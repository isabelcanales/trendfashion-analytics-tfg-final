"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface GeneratedReport {
  slug: string; // "zara-vs-mango"
  brandA: string; // "Zara"
  brandB: string; // "Mango"
  scoreA: number;
  scoreB: number;
  sentimentA: number;
  sentimentB: number;
  mentionsA: number;
  mentionsB: number;
  generatedAt: Date;
  mainInsight: string;
}

interface ReportsContextType {
  reports: GeneratedReport[];
  addReport: (report: Omit<GeneratedReport, "generatedAt">) => void;
  getReport: (slug: string) => GeneratedReport | undefined;
  removeReport: (slug: string) => void;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  // Start with empty reports - users generate them dynamically
  // No mock data injected
  const [reports, setReports] = useState<GeneratedReport[]>([]);

  const addReport = useCallback(
    (report: Omit<GeneratedReport, "generatedAt">) => {
      const newReport: GeneratedReport = {
        ...report,
        generatedAt: new Date(),
      };

      // Evitar duplicados
      setReports((prev) =>
        prev.some((r) => r.slug === report.slug)
          ? prev.map((r) => (r.slug === report.slug ? newReport : r))
          : [newReport, ...prev]
      );
    },
    []
  );

  const getReport = useCallback(
    (slug: string) => reports.find((r) => r.slug === slug),
    [reports]
  );

  const removeReport = useCallback((slug: string) => {
    setReports((prev) => prev.filter((r) => r.slug !== slug));
  }, []);

  return (
    <ReportsContext.Provider value={{ reports, addReport, getReport, removeReport }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error("useReports must be used within ReportsProvider");
  }
  return context;
}
