// In-memory progress tracker for bulk imports with persistence across requests
interface ImportProgress {
  importId: string;
  totalRows: number;
  processed: number;
  inserted: number;
  failed: number;
  progressPercentage: number;
  status: "processing" | "completed" | "failed";
  startedAt: Date;
  completedAt?: Date;
  errors: any[];
  expiresAt?: Date;
}

// Use global to persist across module reloads
declare global {
  var importProgressMap: Map<string, ImportProgress>;
}

if (!global.importProgressMap) {
  global.importProgressMap = new Map<string, ImportProgress>();
}

const progressMap = global.importProgressMap;

// Auto-cleanup expired entries every 30 seconds
const RETENTION_TIME = 5 * 60 * 1000; // Keep completed imports for 5 minutes
setInterval(() => {
  const now = new Date();
  const entries = Array.from(progressMap.entries());
  entries.forEach(([id, progress]) => {
    if (progress.expiresAt && now > progress.expiresAt) {
      progressMap.delete(id);
    }
  });
}, 30000);

export function initializeImport(importId: string, totalRows: number): void {
  progressMap.set(importId, {
    importId,
    totalRows,
    processed: 0,
    inserted: 0,
    failed: 0,
    progressPercentage: 0,
    status: "processing",
    startedAt: new Date(),
    errors: [],
    expiresAt: new Date(Date.now() + RETENTION_TIME),
  });
}

export function updateProgress(
  importId: string,
  processed: number,
  inserted: number,
  failed: number,
  errors: any[] = []
): void {
  const progress = progressMap.get(importId);
  if (progress) {
    progress.processed = processed;
    progress.inserted = inserted;
    progress.failed = failed;
    progress.progressPercentage = Math.round((processed / progress.totalRows) * 100);
    // Accumulate all errors, not just the latest ones
    if (errors.length > 0) {
      progress.errors = errors;
    }
    // Extend expiration time on each update
    progress.expiresAt = new Date(Date.now() + RETENTION_TIME);
  }
}

export function completeImport(importId: string): void {
  const progress = progressMap.get(importId);
  if (progress) {
    progress.status = "completed";
    progress.completedAt = new Date();
    progress.progressPercentage = 100;
    // Extend expiration time so completed imports stay available for 5 minutes
    progress.expiresAt = new Date(Date.now() + RETENTION_TIME);
  }
}

export function failImport(importId: string, error: string): void {
  const progress = progressMap.get(importId);
  if (progress) {
    progress.status = "failed";
    progress.completedAt = new Date();
    progress.errors.push(error);
    // Extend expiration time so failed imports also stay available
    progress.expiresAt = new Date(Date.now() + RETENTION_TIME);
  }
}

export function getProgress(importId: string): ImportProgress | undefined {
  const progress = progressMap.get(importId);
  if (!progress) return undefined;
  
  // Check if expired
  if (progress.expiresAt && new Date() > progress.expiresAt) {
    progressMap.delete(importId);
    return undefined;
  }
  
  return progress;
}

export function clearProgress(importId: string): void {
  progressMap.delete(importId);
}
