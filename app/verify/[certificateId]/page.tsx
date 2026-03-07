"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Download,
  Printer,
  CheckCircle2,
  Loader2,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface CertificateData {
  id: string;
  recipientName: string;
  event: string;
  issueDate: string;
  eventType?: string;
  description?: string;
}

export default function CertificateDisplayPage() {
  const TEMPLATE_WIDTH = 2000;
  const TEMPLATE_HEIGHT = 1414;
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
            eventType: data.eventType,
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

  const renderCertificateCanvas = async () => {
    if (!certificateRef.current) {
      throw new Error("Certificate element not found");
    }

    await document.fonts.ready;

    return html2canvas(certificateRef.current, {
      scale: 3,
      backgroundColor: "#ffffff",
      useCORS: true,
      allowTaint: false,
      logging: false,
      windowWidth: certificateRef.current.scrollWidth,
      windowHeight: certificateRef.current.scrollHeight,
    });
  };

  const handleDownload = async () => {
    if (downloading || printing) return;

    setDownloading(true);
    try {
      const canvas = await renderCertificateCanvas();
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: canvas.width >= canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
        hotfixes: ["px_scaling"],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height, undefined, "FAST");
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
      const imgData = canvas.toDataURL("image/png");
      const printWindow = window.open("", "_blank", "width=1200,height=900");

      if (!printWindow) {
        alert("Popup blocked. Please allow popups to print the certificate.");
        return;
      }

      printWindow.document.write(`
        <!doctype html>
        <html>
          <head>
            <title>Certificate ${certificate?.id}</title>
            <style>
              @page { size: A4 landscape; margin: 0; }
              html, body {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
                background: #ffffff;
              }
              body {
                display: flex;
                align-items: center;
                justify-content: center;
              }
              img {
                width: 100%;
                height: auto;
                max-width: 100%;
                display: block;
              }
            </style>
          </head>
          <body>
            <img src="${imgData}" alt="Certificate" />
            <script>
              window.onload = function() {
                window.focus();
                window.print();
                window.onafterprint = function() { window.close(); };
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (printError) {
      console.error("Print failed:", printError);
      alert("Failed to print certificate. Please try again.");
    } finally {
      setPrinting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B1F3A] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-[#3DB5D8] mx-auto mb-4" />
          <p className="text-white/70 text-lg">Loading certificate...</p>
        </div>
      </main>
    );
  }

  if (error || !certificate) {
    return (
      <main className="min-h-screen bg-[#0B1F3A] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8">
            <XCircle size={64} className="text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Invalid Certificate ID</h1>
            <p className="text-white/60 mb-6">
              {error || "Please check the ID and try again."}
            </p>
            <button
              onClick={() => router.push("/verify")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#3DB5D8] hover:bg-[#3DB5D8]/90 text-white font-semibold rounded-xl transition-colors"
            >
              <ArrowLeft size={18} />
              Back to Verification
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  // Format the description text for the certificate
  const getCertificateDescription = () => {
    if (certificate.description) {
      return certificate.description;
    }
    return `for successfully participating in ${certificate.event} organized by DIU Robotics Club`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-[#0B1F3A] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Success Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <CheckCircle2 size={32} className="text-emerald-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Certificate Verified</h1>
            <p className="text-white/60 text-sm">This certificate is authentic and valid</p>
          </div>
        </motion.div>

        {/* Certificate Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden print:shadow-none"
        >
          {/* Certificate with Template Background */}
          <div
            ref={certificateRef}
            className="relative w-full bg-white"
            style={{
              fontFamily: "'Times New Roman', serif",
              aspectRatio: `${TEMPLATE_WIDTH} / ${TEMPLATE_HEIGHT}`,
            }}
          >
            {/* Background Template Image */}
            <Image
              src="/ce.png"
              alt="Certificate Template"
              fill
              className="object-contain"
              priority
            />

            {/* Text Overlays */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-8 md:px-16">
              {/* Main Title - CERTIFICATE */}
              <div className="text-center mb-2">
                <h2
                  className="font-bold tracking-wider"
                  style={{
                    fontSize: "clamp(2rem, 5vw, 4rem)",
                    color: "#1e3a8a",
                    textTransform: "uppercase",
                  }}
                >
                  CERTIFICATE
                </h2>
              </div>

              {/* Subtitle - of appreciation */}
              <div className="mb-6">
                <p
                  className="italic"
                  style={{
                    fontSize: "clamp(1rem, 2vw, 1.5rem)",
                    color: "#1e3a8a",
                  }}
                >
                  of appreciation
                </p>
              </div>

              {/* Static line */}
              <div className="mb-4">
                <p
                  className=""
                  style={{
                    fontSize: "clamp(0.875rem, 1.5vw, 1.125rem)",
                    color: "#1e3a8a",
                  }}
                >
                  This is to certify that
                </p>
              </div>

              {/* Recipient Name - Dynamic */}
              <div className="mb-6">
                <h3
                  className="font-bold text-center border-b-2 border-[#1e3a8a] px-8 pb-1"
                  style={{
                    fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                    color: "#1e3a8a",
                  }}
                >
                  {certificate.recipientName}
                </h3>
              </div>

              {/* Event Description - Dynamic */}
              <div className="mb-8 max-w-3xl">
                <p
                  className="text-center leading-relaxed"
                  style={{
                    fontSize: "clamp(0.75rem, 1.25vw, 1rem)",
                    color: "#1e3a8a",
                  }}
                >
                  {getCertificateDescription()}
                </p>
              </div>

            </div>
          </div>

          {/* Certificate Info Below */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 print:hidden">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
              <div>
                <span className="font-semibold">Certificate ID:</span> {certificate.id}
              </div>
              <div>
                <span className="font-semibold">Issue Date:</span> {formatDate(certificate.issueDate)}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8 print:hidden"
        >
          <button
            onClick={handleDownload}
            disabled={downloading || printing}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3DB5D8] hover:bg-[#3DB5D8]/90 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {downloading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Download size={20} />
            )}
            {downloading ? "Generating PDF..." : "Download Certificate"}
          </button>

          <button
            onClick={handlePrint}
            disabled={printing || downloading}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl transition-all border-2 border-gray-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {printing ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Printer size={20} />
            )}
            {printing ? "Preparing Print..." : "Print Certificate"}
          </button>

          <button
            onClick={() => router.push("/verify")}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            <ArrowLeft size={20} />
            Verify Another
          </button>
        </motion.div>

      </div>
    </main>
  );
}
