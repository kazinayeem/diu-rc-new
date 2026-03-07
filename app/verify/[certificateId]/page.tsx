"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Download, Printer, Loader2, XCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Great_Vibes } from "next/font/google";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface CertificateData {
  id: string;
  recipientName: string;
  event: string;
  issueDate: string;
  description?: string;
}

const CERT_WIDTH = 1123;
const CERT_HEIGHT = 794;
const signatureFont = Great_Vibes({ subsets: ["latin"], weight: "400" });

export default function CertificateDisplayPage() {
  const params = useParams();
  const router = useRouter();
  const certificateRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const certId = Array.isArray(params.certificateId)
          ? params.certificateId[0]
          : params.certificateId;

        const res = await fetch(`/api/certificates/verify?id=${encodeURIComponent(certId)}`);
        const data = await res.json();

        if (data.valid) {
          setCertificate({
            id: data.id,
            recipientName: data.recipientName,
            event: data.event,
            issueDate: data.issueDate,
            description: data.description,
          });
        } else {
          setError(data.message || "Certificate not found");
        }
      } catch {
        setError("Unable to load certificate. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [params.certificateId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDescription = () => {
    if (certificate?.description) return certificate.description;
    return `for successfully participating in ${certificate?.event ?? "the event"} organized by DIU Robotics Club`;
  };

  const recipientName = certificate?.recipientName ?? "";
  const descriptionText = getDescription();
  const recipientFontSize = recipientName.length > 24 ? 52 : recipientName.length > 18 ? 58 : 64;
  const descriptionFontSize = descriptionText.length > 150 ? 14 : descriptionText.length > 115 ? 16 : 18;

  const waitForRenderReady = async () => {
    await document.fonts.ready;

    await new Promise<void>((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = "/ce.png";
    });
  };

  const renderCertificateCanvas = async () => {
    if (!certificateRef.current) {
      throw new Error("Certificate container not found");
    }

    await waitForRenderReady();

    return html2canvas(certificateRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: null,
      width: CERT_WIDTH,
      height: CERT_HEIGHT,
      logging: false,
      scrollX: 0,
      scrollY: 0,
    });
  };

  const handleDownload = async () => {
    if (downloading || printing) return;

    setDownloading(true);
    try {
      const canvas = await renderCertificateCanvas();
      const imgData = canvas.toDataURL("image/png", 1.0);

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [CERT_WIDTH, CERT_HEIGHT],
      });

      pdf.addImage(imgData, "PNG", 0, 0, CERT_WIDTH, CERT_HEIGHT, undefined, "FAST");
      pdf.save(`Certificate_${certificate?.id}.pdf`);
    } catch (downloadError) {
      console.error("Download failed:", downloadError);
      alert("Failed to download certificate. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = async () => {
    if (printing || downloading) return;

    setPrinting(true);
    try {
      const canvas = await renderCertificateCanvas();
      const imgData = canvas.toDataURL("image/png", 1.0);
      const printWindow = window.open("", "_blank", "width=1300,height=900");

      if (!printWindow) {
        alert("Popup blocked. Please allow popups to print the certificate.");
        setPrinting(false);
        return;
      }

      printWindow.document.open();
      printWindow.document.write(`
        <!doctype html>
        <html>
          <head>
            <title>Certificate ${certificate?.id}</title>
            <style>
              @page { size: landscape; margin: 0; }
              html, body {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
                background: #ffffff;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              body {
                display: grid;
                place-items: center;
                overflow: hidden;
              }
              img {
                width: 100vw;
                height: 100vh;
                object-fit: contain;
                display: block;
              }
            </style>
          </head>
          <body>
            <img src="${imgData}" alt="Certificate" />
            <script>
              const runPrint = () => {
                window.focus();
                window.print();
                window.onafterprint = () => window.close();
              };
              if (document.readyState === "complete") {
                setTimeout(runPrint, 150);
              } else {
                window.addEventListener("load", () => setTimeout(runPrint, 150));
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (printError) {
      console.error("Print failed:", printError);
      alert("Failed to print certificate. Please try again.");
    } finally {
      // Reset parent UI state after print window has been initiated.
      setTimeout(() => setPrinting(false), 400);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B1F3A] flex items-center justify-center">
        <div className="text-center no-print">
          <Loader2 size={48} className="animate-spin text-[#3DB5D8] mx-auto mb-4" />
          <p className="text-white/70 text-lg">Loading certificate...</p>
        </div>
      </main>
    );
  }

  if (error || !certificate) {
    return (
      <main className="min-h-screen bg-[#0B1F3A] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 no-print">
            <XCircle size={64} className="text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Invalid Certificate ID</h1>
            <p className="text-white/60 mb-6">{error || "Please check the ID and try again."}</p>
            <button
              onClick={() => router.push("/verify")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#3DB5D8] hover:bg-[#3DB5D8]/90 text-white font-semibold rounded-xl transition-colors"
            >
              <ArrowLeft size={18} />
              Back to Verification
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B1F3A] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="no-print flex items-center justify-center gap-3 mb-8">
          <CheckCircle2 size={30} className="text-emerald-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Certificate Verified</h1>
            <p className="text-white/60 text-sm">This certificate is authentic and valid</p>
          </div>
        </div>

        <div className="print-root">
          <div className="certificate-stage">
            <div
              ref={certificateRef}
              className="certificate-container"
              style={{
                width: `${CERT_WIDTH}px`,
                height: `${CERT_HEIGHT}px`,
                backgroundImage: "url('/ce.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="field-appreciation">of appreciation</div>

              <div className="field-certify-line">This is to certify that</div>

              <div className={`field-recipient ${signatureFont.className}`} style={{ fontSize: `${recipientFontSize}px` }}>
                {certificate.recipientName}
              </div>

              <div className="field-description" style={{ fontSize: `${descriptionFontSize}px` }}>
                {descriptionText}
              </div>

              <div className="field-certificate-id">ID: {certificate.id}</div>

              <div className="field-issue-date">DATE: {formatDate(certificate.issueDate)}</div>
            </div>
          </div>
        </div>

        <div className="no-print flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={handleDownload}
            disabled={downloading || printing}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3DB5D8] hover:bg-[#3DB5D8]/90 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {downloading ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
            {downloading ? "Generating PDF..." : "Download Certificate"}
          </button>

          <button
            onClick={handlePrint}
            disabled={printing || downloading}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl transition-all border-2 border-gray-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {printing ? <Loader2 size={20} className="animate-spin" /> : <Printer size={20} />}
            {printing ? "Preparing Print..." : "Print Certificate"}
          </button>

          <button
            onClick={() => router.push("/verify")}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            <ArrowLeft size={20} />
            Verify Another
          </button>
        </div>
      </div>

      <style jsx global>{`
        .certificate-stage {
          display: flex;
          justify-content: center;
          overflow-x: auto;
          padding: 8px;
        }

        .certificate-container {
          position: relative;
          min-width: 1123px;
          min-height: 794px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
          border-radius: 8px;
          overflow: hidden;
        }

        .field-recipient {
          position: absolute;
          top: 386px;
          left: 50%;
          transform: translateX(-50%);
          width: 900px;
          text-align: center;
          font-family: "Great Vibes", "Brush Script MT", cursive;
          line-height: 1.18;
          font-weight: 400;
          color: #1e3a8a;
          white-space: nowrap;
          padding-bottom: 4px;
        }

        .field-appreciation {
          position: absolute;
          top: 278px;
          left: 50%;
          transform: translateX(-50%);
          width: 420px;
          text-align: center;
          font-family: "Times New Roman", serif;
          font-size: 38px;
          font-style: italic;
          line-height: 1;
          font-weight: 400;
          color: #1e3a8a;
          opacity: 0.95;
          white-space: nowrap;
        }

        .field-certify-line {
          position: absolute;
          top: 316px;
          left: 50%;
          transform: translateX(-50%);
          width: 520px;
          text-align: center;
          font-family: "Times New Roman", serif;
          font-size: 26px;
          line-height: 1.1;
          font-weight: 400;
          color: #1e3a8a;
          opacity: 0.95;
          white-space: nowrap;
        }

        .field-description {
          position: absolute;
          top: 474px;
          left: 50%;
          transform: translateX(-50%);
          width: 840px;
          text-align: center;
          font-family: "Times New Roman", serif;
          line-height: 1.42;
          font-weight: 400;
          color: #1e3a8a;
          max-height: 140px;
          padding-bottom: 10px;
          overflow: hidden;
        }

        .field-certificate-id {
          position: absolute;
          left: 42px;
          top: 42px;
          font-family: "Courier New", Courier, monospace;
          font-size: 12px;
          line-height: 1.25;
          font-weight: 700;
          color: #ffffff;
          max-width: 520px;
          white-space: nowrap;
          overflow: visible;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
          z-index: 4;
        }

        .field-issue-date {
          position: absolute;
          left: 42px;
          top: 62px;
          font-family: "Courier New", Courier, monospace;
          font-size: 12px;
          line-height: 1.25;
          font-weight: 700;
          color: #ffffff;
          text-align: left;
          max-width: 520px;
          white-space: nowrap;
          overflow: visible;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
          z-index: 4;
        }

        @media print {
          @page {
            size: landscape;
            margin: 0;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: #fff !important;
          }

          * {
            animation: none !important;
            transition: none !important;
          }

          header,
          nav,
          .navbar,
          .topbar,
          .no-print {
            display: none !important;
          }

          .certificate-container {
            box-shadow: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </main>
  );
}
