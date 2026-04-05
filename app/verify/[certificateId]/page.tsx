"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Download, Printer, Loader2, XCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
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

export default function CertificateDisplayPage() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

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
    return `for successfully completing ${certificate?.event ?? "the program"}`;
  };

  const getTemplateDataUrl = async () => {
    return new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        } else {
          reject(new Error("Canvas context failed"));
        }
      };
      img.onerror = () => reject(new Error("Failed to load template image"));
      img.src = "/ce.png";
    });
  };

  const drawCertificatePDF = (
    pdf: jsPDF,
    templateDataUrl: string,
    certData: CertificateData
  ) => {
    // Add template image
    pdf.addImage(templateDataUrl, "PNG", 0, 0, CERT_WIDTH, CERT_HEIGHT);

    // Add ID and Date in top left
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("courier", "bold");
    pdf.setFontSize(12);
    pdf.text(`ID: ${certData.id}`, 42, 42);
    pdf.text(`DATE: ${formatDate(certData.issueDate)}`, 42, 62);

    // Add "of appreciation"
    pdf.setTextColor(30, 58, 138);
    pdf.setFont("times", "italic");
    pdf.setFontSize(38);
    pdf.text("of appreciation", CERT_WIDTH / 2, 278, { align: "center" });

    // Add "This is to certify that"
    pdf.setFont("times", "normal");
    pdf.setFontSize(26);
    pdf.text("This is to certify that", CERT_WIDTH / 2, 316, { align: "center" });

    // Add recipient name
    const recipientName = certData.recipientName ?? "";
    const recipientFontSize = recipientName.length > 24 ? 52 : recipientName.length > 18 ? 58 : 64;
    pdf.setFont("times", "bolditalic");
    pdf.setFontSize(recipientFontSize);
    pdf.text(recipientName, CERT_WIDTH / 2, 386, { align: "center" });

    // Add event name
    pdf.setFont("times", "normal");
    pdf.setFontSize(20);
    pdf.setTextColor(30, 58, 138);
    pdf.text(certData.event || "", CERT_WIDTH / 2, 420, { align: "center" });

    // Add completion message - positioned better for visibility
    const completeMsg = `for successfully completing ${certData.event || "the program"}`;
    const msgFont = completeMsg.length > 120 ? 14 : completeMsg.length > 80 ? 15 : 16;
    pdf.setFont("times", "normal");
    pdf.setFontSize(msgFont);
    pdf.setTextColor(30, 58, 138);
    const wrapped = pdf.splitTextToSize(completeMsg, 840);
    pdf.text(wrapped, CERT_WIDTH / 2, 450, { align: "center" });

    // Add "Best Wishes!"
    pdf.setFont("times", "italic");
    pdf.setFontSize(16);
    pdf.setTextColor(30, 58, 138);
    pdf.text("Best Wishes!", CERT_WIDTH / 2, 560, { align: "center" });
  };

  const handleDownload = async () => {
    if (downloading || !certificate) return;

    setDownloading(true);
    try {
      const templateDataUrl = await getTemplateDataUrl();
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [CERT_WIDTH, CERT_HEIGHT],
      });

      drawCertificatePDF(pdf, templateDataUrl, certificate);
      pdf.save(`Certificate_${certificate.id}.pdf`);
    } catch (downloadError) {
      console.error("Download failed:", downloadError);
      alert("Failed to download certificate. Please try again.");
    } finally {
      setDownloading(false);
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
    <main className="min-h-screen bg-gradient-to-b from-[#0B1F3A] to-[#1a3a52] py-8 sm:py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-3 mb-4 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-400/30">
            <CheckCircle2 size={24} className="text-emerald-400" />
            <span className="text-emerald-300 font-semibold text-sm sm:text-base">Certificate Verified & Valid</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Certificate of Achievement</h1>
          <p className="text-white/60 text-sm sm:text-base">This certificate is authentic and has been verified</p>
        </div>

        {/* Certificate Details Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 sm:p-10 mb-8 shadow-2xl">
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {/* Certificate ID */}
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-5 sm:p-6 border border-blue-400/20 text-center">
              <p className="text-white/60 text-xs sm:text-sm font-medium uppercase tracking-wider mb-2">ID</p>
              <p className="text-lg sm:text-2xl font-bold text-[#3DB5D8] truncate">{certificate.id}</p>
            </div>

            {/* Recipient Name */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl p-5 sm:p-6 border border-emerald-400/20 text-center">
              <p className="text-white/60 text-xs sm:text-sm font-medium uppercase tracking-wider mb-2">Recipient</p>
              <p className="text-lg sm:text-2xl font-bold text-emerald-300 line-clamp-2">{certificate.recipientName}</p>
            </div>

            {/* Event Name */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-5 sm:p-6 border border-amber-400/20 text-center">
              <p className="text-white/60 text-xs sm:text-sm font-medium uppercase tracking-wider mb-2">Program</p>
              <p className="text-lg sm:text-2xl font-bold text-amber-300 line-clamp-2">{certificate.event}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>

          {/* Certification Text */}
          <div className="text-center space-y-4">
            <p className="text-white/80 text-base sm:text-lg leading-relaxed">
              This is to certify that
            </p>
            <p className="text-xl sm:text-3xl font-bold text-emerald-300">
              {certificate.recipientName}
            </p>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed">
              has successfully completed
            </p>
            <p className="text-lg sm:text-2xl font-semibold text-amber-300">
              {certificate.event}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#3DB5D8] to-[#2a9bc4] hover:from-[#2a9bc4] hover:to-[#1f7da0] text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {downloading ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
            <span className="hidden sm:inline">{downloading ? "Generating..." : "Download PDF"}</span>
            <span className="sm:hidden">{downloading ? "Generating..." : "Download"}</span>
          </button>

          <button
            onClick={() => router.push("/verify")}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-200 border border-white/20 hover:border-white/40 shadow-lg"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Verify Another</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-10 sm:mt-14 text-center">
          <p className="text-white/50 text-xs sm:text-sm">
            Shared or verified this certificate? Find more at <span className="text-[#3DB5D8] font-semibold">DIU Robotics Club</span>
          </p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </main>
  );
}
