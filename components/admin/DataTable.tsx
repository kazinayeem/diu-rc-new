"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    onPageChange: (page: number) => void;
  };
}

export default function DataTable({
  columns,
  data,
  onEdit,
  onDelete,
  pagination,
}: DataTableProps) {
  return (
    <Card
      variant="elevated"
      className="bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl text-white"
    >
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* ======================= */}
            {/* TABLE HEADER */}
            {/* ======================= */}
            <thead className="bg-white/10 backdrop-blur-xl border-b border-white/10">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/70"
                  >
                    {column.label}
                  </th>
                ))}

                {(onEdit || onDelete) && (
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-white/70">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            {/* ======================= */}
            {/* TABLE BODY */}
            {/* ======================= */}
            <tbody className="divide-y divide-white/10">
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                    className="px-6 py-8 text-center text-white/50"
                  >
                    No data available
                  </td>
                </tr>
              ) : (
                data.map((row, index) => (
                  <tr
                    key={row._id || index}
                    className="hover:bg-white/5 transition-colors"
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="px-6 py-4 whitespace-nowrap text-sm text-white/90"
                      >
                        {column.render
                          ? column.render(row[column.key], row)
                          : row[column.key] || "-"}
                      </td>
                    ))}

                    {(onEdit || onDelete) && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex justify-end space-x-3">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className="text-blue-400 hover:text-blue-300 transition"
                              aria-label="Edit"
                            >
                              <Edit size={18} />
                            </button>
                          )}

                          {onDelete && (
                            <button
                              onClick={() => onDelete(row)}
                              className="text-red-400 hover:text-red-300 transition"
                              aria-label="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ======================= */}
        {/* PAGINATION */}
        {/* ======================= */}
        {pagination && pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between text-white/70">
            <div className="text-sm">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} results
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => pagination.onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <ChevronLeft size={16} />
              </Button>

              <span className="px-4 py-2 text-sm text-white/80">
                Page {pagination.page} of {pagination.pages}
              </span>

              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => pagination.onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
