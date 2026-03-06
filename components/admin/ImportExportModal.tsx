"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Upload, Download, X, FileSpreadsheet, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";

interface ImportExportModalProps {
  onClose: () => void;
  onImportComplete: () => void;
  currentFilters?: { status?: string; search?: string };
}

export default function ImportExportModal({
  onClose,
  onImportComplete,
  currentFilters,
}: ImportExportModalProps) {
  const [activeTab, setActiveTab] = useState<"import" | "export">("import");
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importProcessed, setImportProcessed] = useState(0);
  const [importTotal, setImportTotal] = useState(0);
  const [importInserted, setImportInserted] = useState(0);
  const [importFailed, setImportFailed] = useState(0);
  const [importId, setImportId] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<any>(null);
  const [importErrors, setImportErrors] = useState<any[]>([]);
  const [importCompletedData, setImportCompletedData] = useState<any>(null);
  const [deleteProgress, setDeleteProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Poll for import progress
  const pollImportProgress = async (id: string, maxAttempts = 300) => {
    let attempts = 0;
    
    return new Promise<void>((resolve) => {
      const poll = async (): Promise<void> => {
        if (attempts >= maxAttempts) {
          console.log("Poll timeout - import may have completed");
          resolve();
          return;
        }

        attempts++;

        try {
          const response = await fetch(`/api/admin/member-registrations/import/progress/${id}`);
          
          if (!response.ok) {
            setTimeout(poll, 500);
            return;
          }

          const progress = await response.json();
          
          if (progress.success) {
            
            setImportProgress(progress.progressPercentage);
            setImportProcessed(progress.processed);
            setImportTotal(progress.totalRows);
            setImportInserted(progress.inserted);
            setImportFailed(progress.failed);

            // Once completed, fetch final results
            if (progress.status === "completed") {
              setImportErrors(progress.errors || []);
              setImporting(false);
              onImportComplete();
              
              // If 100% success, show completion toast then auto-close
              if (progress.failed === 0) {
                setImportCompletedData({
                  total: progress.totalRows,
                  inserted: progress.inserted,
                  failed: progress.failed,
                  successRate: progress.successRate,
                  message: `✅ Import completed: ${progress.inserted} succeeded, ${progress.failed} failed out of ${progress.totalRows} records`,
                });
                
                // Auto-close modal after 3 seconds
                setTimeout(() => {
                  setImportCompletedData(null);
                  onClose();
                }, 3000);
              } else {
                // If there are failures, show results modal
                setImportResult({
                  success: true,
                  total: progress.totalRows,
                  processed: progress.processed,
                  inserted: progress.inserted,
                  failed: progress.failed,
                  successRate: progress.successRate,
                  errors: progress.errors || [],
                  message: `✅ Import completed: ${progress.inserted} inserted, ${progress.failed} failed of ${progress.totalRows} total`,
                });
              }
              resolve();
              return;
            }

            // Continue polling
            setTimeout(poll, 500);
          } else {
            setTimeout(poll, 500);
          }
        } catch (err) {
          setTimeout(poll, 500);
        }
      };

      poll();
    });
  };

  // Test API connectivity
  const testAPIConnection = async () => {
    try {
      console.log("Testing API connectivity...");
      const response = await fetch("/api/admin/health", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      
      if (!response.ok) {
        return { ok: false, status: response.status, message: `HTTP ${response.status}` };
      }
      
      const data = await response.json();
      console.log("API health check:", data);
      return { ok: true, data };
    } catch (err: any) {
      console.error("API health check failed:", err);
      return { ok: false, error: err.message };
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileType = file.name.split(".").pop()?.toLowerCase();
    if (!fileType || !["xlsx", "xls", "csv"].includes(fileType)) {
      alert("Please select a valid Excel or CSV file");
      return;
    }

    setImporting(true);
    setImportProgress(5);
    setImportResult(null);
    setImportErrors([]);
    setImportProcessed(0);
    setImportInserted(0);
    setImportFailed(0);
    setImportTotal(0);

    try {
      // First, test connectivity
      console.log("Starting import process...");
      const healthCheck = await testAPIConnection();
      if (!healthCheck.ok) {
        setImportProgress(0);
        setImportResult({
          success: false,
          message: `Cannot reach API: ${healthCheck.message || healthCheck.error}. Check your internet connection.`,
        });
        setImporting(false);
        return;
      }

      setImportProgress(10);
      const reader = new FileReader();

      reader.onload = async (evt) => {
        try {
          setImportProgress(30);
          const data = evt.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);

          setImportProgress(50);

          // Map Excel headers to database fields - handle numbers from Excel safely
          const mappedData = jsonData.map((row: any) => {
            // Convert all fields to strings first to handle numbers from Excel
            const name = String(row["Full Name"] || row.name || "").trim();
            const studentId = String(row["Student ID"] || row.studentId || "").trim();
            const email = String(row["DIU Email"] || row.email || "").trim();
            const phone = String(row["Mobile Phone"] || row.phone || "").trim();
            const department = String(row.Department || row.department || "").trim();
            const batch = String(row.Batch || row.batch || "").trim();
            const currentYear = String(row["Current Year"] || row.currentYear || "").trim();
            const cgpa = row.CGPA || row.cgpa;
            const previousExperience = String(row["Previous Experience"] || row.previousExperience || "").trim();
            const whyJoin = String(row["Why Join"] || row.whyJoin || "").trim();
            const skills = String(row.Skills || row.skills || "").trim();
            const paymentMethod = String(row["Payment Method"] || row.paymentMethod || "bkash").trim();
            const paymentNumber = String(row["Payment Number"] || row.paymentNumber || "").trim();
            const transactionId = String(row["Transaction ID"] || row.transactionId || "").trim();

            return {
              name,
              studentId,
              email,
              phone,
              department,
              batch,
              currentYear,
              cgpa,
              previousExperience,
              whyJoin,
              skills,
              paymentMethod,
              paymentNumber,
              transactionId,
            };
          });

          setImportProgress(70);

          // Send to API with extended timeout (2 minutes)
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 second timeout

          try {
            const jsonBody = JSON.stringify({ data: mappedData });

            const response = await fetch("/api/admin/member-registrations/import", {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
              },
              body: jsonBody,
              signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
              let errorData;
              try {
                errorData = await response.json();
              } catch {
                errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
              }
              
              setImportProgress(100);
              setImportResult({
                success: false,
                message: `API Error (${response.status}): ${errorData.message || "Unknown error"}`,
              });
              setImporting(false);
              return;
            }

            const result = await response.json();
            
            setImportProgress(100);
            setImportTotal(result.total || 0);
            setImportProcessed(result.processed || result.total || 0);
            setImportInserted(result.inserted || 0);
            setImportFailed(result.failed || 0);
            setImporting(false);
            onImportComplete();

            if (result.failed === 0 && result.success) {
              // All records succeeded – show brief success banner then auto-close
              setImportCompletedData({
                total: result.total,
                inserted: result.inserted,
                failed: result.failed,
                successRate: result.successRate,
                message: `✅ Import completed: ${result.inserted} succeeded, ${result.failed} failed out of ${result.total} records`,
              });
              setTimeout(() => {
                setImportCompletedData(null);
                onClose();
              }, 3000);
            } else {
              // Some failures – keep modal open with error details
              setImportErrors(result.errors || []);
              setImportResult({
                success: result.success,
                total: result.total,
                processed: result.processed,
                inserted: result.inserted,
                failed: result.failed,
                successRate: result.successRate,
                errors: result.errors || [],
                message: result.message,
              });
            }
          } catch (err: any) {
            clearTimeout(timeoutId);
            setImportProgress(100);
            
            let errorMessage = "API request failed";
            if (err.message === "Failed to fetch") {
              errorMessage = "Network error: Check your connection or API endpoint. If using proxy, ensure it's running.";
            } else if (err.name === "AbortError") {
              errorMessage = "Request timeout - server is taking too long. Try importing fewer records.";
            } else {
              errorMessage += ": " + err.message;
            }
            
            setImportResult({
              success: false,
              message: errorMessage,
            });
            setImporting(false);
          }
        } catch (err: any) {
          console.error("Parse error:", err);
          setImportProgress(100);
          setImportResult({
            success: false,
            message: "Failed to parse file: " + err.message,
          });
          setImporting(false);
        } finally {
          setImporting(false);
        }
      };

      reader.onerror = () => {
        setImporting(false);
        alert("Failed to read file");
      };

      reader.readAsBinaryString(file);
    } catch (error: any) {
      console.error("Import error:", error);
      setImporting(false);
      alert("Import failed: " + error.message);
    }
  };

  const handleExport = async (format: "xlsx" | "csv") => {
    setExporting(true);

    try {
      const params = new URLSearchParams();
      if (currentFilters?.status) params.append("status", currentFilters.status);
      if (currentFilters?.search) params.append("search", currentFilters.search);

      const response = await fetch(
        `/api/admin/member-registrations/export?${params.toString()}`
      );
      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.message || "Export failed");
      }

      const worksheet = XLSX.utils.json_to_sheet(result.data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

      const filename = `member-registrations-${new Date().toISOString().split("T")[0]}.${format}`;

      if (format === "xlsx") {
        XLSX.writeFile(workbook, filename);
      } else {
        XLSX.writeFile(workbook, filename, { bookType: "csv" });
      }

      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error: any) {
      console.error("Export error:", error);
      alert("Export failed: " + error.message);
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("🗑️ Are you sure? This will DELETE ALL member registrations permanently and cannot be undone!")) {
      return;
    }

    setDeleting(true);
    setDeleteProgress(0);

    try {
      const response = await fetch("/api/admin/member-registrations/delete-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Delete failed");
      }

      setDeleteProgress(100);
      alert(`✅ Successfully deleted ${result.deleted} records`);
      onImportComplete(); // Refresh the data list
      setDeleting(false);
    } catch (error: any) {
      console.error("Delete error:", error);
      alert("❌ Delete failed: " + error.message);
      setDeleting(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        "Full Name": "John Doe",
        "Student ID": "242-33-001",
        "DIU Email": "john242-33-001@diu.edu.bd",
        "Mobile Phone": "01712345678",
        Department: "CSE",
        Batch: "56",
        "Current Year": "3rd",
        CGPA: "3.75",
        "Previous Experience": "Participated in robotics competition",
        "Why Join": "I want to learn robotics",
        Skills: "Programming, Electronics, 3D Design",
        "Payment Method": "bkash",
        "Payment Number": "01712345678",
        "Transaction ID": "ABC123XYZ",
        "Payment Status": "(optional - defaults to verified)",
        Status: "(optional - defaults to approved)",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "member-registration-template.xlsx");
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="bg-[#0f192d] border border-white/10 rounded-xl max-w-3xl w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Import / Export Registrations</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-red-400 transition-colors"
            disabled={importing || exporting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Import Completion Toast - Shows when import completes with 0 failures */}
        {importCompletedData && (
          <div className="mb-6 bg-green-500/20 border border-green-500/50 rounded-lg p-6 text-center">
            <p className="text-2xl font-bold text-green-400 mb-4">
              ✅ IMPORT SUCCESSFUL!
            </p>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="bg-green-500/10 rounded p-3">
                <p className="text-xs text-white/60 uppercase mb-1">Total Records</p>
                <p className="text-2xl font-bold text-green-400">{importCompletedData.total}</p>
              </div>
              <div className="bg-green-500/10 rounded p-3">
                <p className="text-xs text-white/60 uppercase mb-1">Inserted</p>
                <p className="text-2xl font-bold text-green-400">{importCompletedData.inserted}</p>
              </div>
              <div className="bg-green-500/10 rounded p-3">
                <p className="text-xs text-white/60 uppercase mb-1">Failed</p>
                <p className="text-2xl font-bold text-green-400">{importCompletedData.failed}</p>
              </div>
              <div className="bg-green-500/10 rounded p-3">
                <p className="text-xs text-white/60 uppercase mb-1">Success Rate</p>
                <p className="text-2xl font-bold text-green-400">{importCompletedData.successRate}</p>
              </div>
            </div>
            <p className="text-white text-sm">Closing in 3 seconds...</p>
          </div>
        )}

        {/* Tabs - Hidden when showing completion toast */}
        {!importCompletedData && (
        <div className="flex gap-2 mb-6 border-b border-white/10">
          <button
            onClick={() => setActiveTab("import")}
            disabled={importing || exporting}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "import"
                ? "border-b-2 border-cyan-500 text-cyan-400"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Upload size={18} className="inline mr-2" />
            Import
          </button>
          <button
            onClick={() => setActiveTab("export")}
            disabled={importing || exporting}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "export"
                ? "border-b-2 border-cyan-500 text-cyan-400"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Download size={18} className="inline mr-2" />
            Export
          </button>
        </div>
        )}

        {/* Import Tab */}
        {!importCompletedData && activeTab === "import" && (
          <div className="space-y-4">
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
              <p className="text-sm text-cyan-300 mb-2">
                <strong>Instructions:</strong>
              </p>
              <ul className="text-sm text-white/70 space-y-1 list-disc list-inside">
                <li>Download the template to see the required format</li>
                <li>Fill in the data (Excel or CSV format accepted)</li>
                <li>Required fields: Full Name, Student ID, DIU Email</li>
                <li>All other fields are optional (including images)</li>
                <li><strong>Auto-approved:</strong> If Status/Payment Status not provided, imports as "approved" and "verified"</li>
                <li><strong>For large files:</strong> Import in batches of 500-1000 records to avoid timeout</li>
                <li>Upload the file to import registrations</li>
              </ul>
            </div>

            <Button
              onClick={downloadTemplate}
              variant="outline"
              className="w-full"
              disabled={importing}
            >
              <FileSpreadsheet size={18} className="mr-2" />
              Download Template
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              className="hidden"
            />

            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-cyan-600 hover:bg-cyan-700"
              disabled={importing}
            >
              {importing ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Importing... {importProgress}%
                </>
              ) : (
                <>
                  <Upload size={18} className="mr-2" />
                  Select File to Import
                </>
              )}
            </Button>

            {importing && (
              <div className="bg-white/5 rounded-lg p-6 border border-cyan-500/30">
                <div className="flex flex-col items-center justify-center space-y-4">
                  {/* Spinner */}
                  <Loader2 size={48} className="animate-spin text-cyan-400" />
                  
                  {/* Progress Percentage - Large and Prominent */}
                  <div className="text-center">
                    <div className="text-5xl font-bold text-cyan-400 mb-2">
                      {importProgress}%
                    </div>
                    <p className="text-lg font-semibold text-white">Importing...</p>
                  </div>

                  {/* Real-time Stats - Only show during progress (not at completion) */}
                  {importProgress < 100 && (
                    <div className="grid grid-cols-3 gap-4 w-full text-center">
                      <div className="bg-cyan-500/10 rounded p-2">
                        <p className="text-xs text-white/60 uppercase">Processed</p>
                        <p className="text-xl font-bold text-cyan-400">{importProcessed}/{importTotal}</p>
                      </div>
                      <div className="bg-green-500/10 rounded p-2">
                        <p className="text-xs text-white/60 uppercase">Inserted</p>
                        <p className="text-xl font-bold text-green-400">{importInserted}</p>
                      </div>
                      <div className="bg-red-500/10 rounded p-2">
                        <p className="text-xs text-white/60 uppercase">Failed</p>
                        <p className="text-xl font-bold text-red-400">{importFailed}</p>
                      </div>
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div className="w-full">
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-3 rounded-full transition-all duration-300 shadow-lg shadow-cyan-500/50"
                        style={{ width: `${importProgress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Warning Text */}
                  <div className="text-center space-y-2">
                    <p className="text-lg font-bold text-red-400 animate-pulse">
                      ⚠️ Please do not close this page
                    </p>
                    <p className="text-sm text-white/70">
                      Your import is in progress. Closing this page may interrupt the process.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {importResult && (
              <div
                className={`rounded-lg p-6 border ${
                  importResult.success
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-red-500/10 border-red-500/30"
                }`}
              >
                {/* Results Header */}
                <div className="text-center mb-6">
                  <p
                    className={`font-semibold mb-4 text-xl ${
                      importResult.success ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {importResult.success ? "✅ Import Successful!" : "❌ Import Failed"}
                  </p>
                  <p className="text-white text-lg font-bold">
                    {importResult.message}
                  </p>
                </div>
                
                {/* Results Summary - Large Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-white/60 text-xs uppercase tracking-wide mb-2">📊 Total Rows</p>
                    <p className="text-3xl font-bold text-cyan-400">{importResult.total || importResult.totalProcessed || 0}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-white/60 text-xs uppercase tracking-wide mb-2">📈 Success Rate</p>
                    <p className="text-3xl font-bold text-green-400">{importResult.successRate || "0%"}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-white/60 text-xs uppercase tracking-wide mb-2">✅ Inserted</p>
                    <p className="text-3xl font-bold text-green-400">{importResult.inserted || importResult.insertedCount || 0}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-white/60 text-xs uppercase tracking-wide mb-2">❌ Failed</p>
                    <p className="text-3xl font-bold text-red-400">{importResult.failed || importResult.failedCount || 0}</p>
                  </div>
                </div>

                {/* Error Details */}
                <div className="text-sm text-white/70 mb-3">
                  {(importResult.errors?.length > 0 || importResult.results?.errors?.length > 0) && (
                    <details className="cursor-pointer">
                      <summary className="text-red-400 font-semibold hover:text-red-300 pb-2">
                        📋 Show Errors ({(importResult.errors || importResult.results?.errors || []).length} total)
                      </summary>
                      <ul className="mt-2 space-y-1 max-h-48 overflow-y-auto bg-white/5 p-3 rounded">
                        {(importResult.errors || importResult.results?.errors || []).slice(0, 20).map((err: any, idx: number) => (
                          <li key={idx} className="text-xs text-white/60 font-mono">
                            {err.row && <span className="text-yellow-400">Row {err.row}:</span>} {err.error}
                          </li>
                        ))}
                        {(importResult.errors || importResult.results?.errors || []).length > 20 && (
                          <li className="text-xs text-white/50 italic pt-2">
                            ... and {(importResult.errors || importResult.results?.errors || []).length - 20} more errors
                          </li>
                        )}
                      </ul>
                    </details>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {!importResult.success && (
                    <Button
                      onClick={() => {
                        setImportResult(null);
                        setImportProgress(0);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                        fileInputRef.current?.click();
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      try Again
                    </Button>
                  )}
                  <Button
                    onClick={importResult.success ? onClose : () => {
                      setImportResult(null);
                      setImportProgress(0);
                    }}
                    className={importResult.success ? "flex-1 bg-green-600 hover:bg-green-700" : "flex-1"}
                  >
                    {importResult.success ? "Done" : "Close"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Export Tab */}
        {!importCompletedData && activeTab === "export" && (
          <div className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm text-blue-300">
                Export all member registrations {currentFilters?.status && `(${currentFilters.status})`}{" "}
                {currentFilters?.search && `matching "${currentFilters.search}"`}
              </p>
            </div>

            <Button
              onClick={() => handleExport("xlsx")}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={exporting}
            >
              {exporting ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <FileSpreadsheet size={18} className="mr-2" />
                  Export as Excel (.xlsx)
                </>
              )}
            </Button>

            <Button
              onClick={() => handleExport("csv")}
              variant="outline"
              className="w-full"
              disabled={exporting}
            >
              {exporting ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <FileSpreadsheet size={18} className="mr-2" />
                  Export as CSV (.csv)
                </>
              )}
            </Button>
          </div>
        )}

        {/* Delete All Tab */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-sm text-red-300 mb-3">
            ⚠️ Danger Zone - Permanently delete all records
          </p>
          <Button
            onClick={handleDeleteAll}
            className="w-full bg-red-600 hover:bg-red-700"
            disabled={deleting || importing || exporting}
          >
            {deleting ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Deleting all records... {deleteProgress}%
              </>
            ) : (
              <>
                🗑️ Delete All Records
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
