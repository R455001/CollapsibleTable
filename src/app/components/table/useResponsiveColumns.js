"use client";

import { useEffect, useState } from "react";

export function useResponsiveColumns(columnCount, breakpoints) {
  const [visibleColumns, setVisibleColumns] = useState([]);

  useEffect(() => {
    const updateColumns = () => {
      if (!breakpoints) return;

      const width = window.innerWidth;

      const sortedBps = Object.keys(breakpoints)
        .map(Number)
        .sort((a, b) => b - a);

      let columns = columnCount;

      for (let bp of sortedBps) {
        if (width >= bp) {
          columns = breakpoints[bp].columns;
          break;
        }
      }

      setVisibleColumns(
        Array.from({ length: Math.min(columns, columnCount) }, (_, i) => i),
      );
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, [columnCount, breakpoints]);

  return visibleColumns;
}
