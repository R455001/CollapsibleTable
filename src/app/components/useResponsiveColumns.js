"use client";

import { useEffect, useState } from "react";

export function useResponsiveColumns(columnCount) {
  const [visibleColumns, setVisibleColumns] = useState([]);

  const updateColumns = () => {
    const width = window.innerWidth;

    let count = columnCount;

    if (width < 390) count = 2;
    else if (width < 576) count = 3;
    else if (width < 776) count = 4;
    else if (width < 991) count = 6;

    const arr = [...Array(count).keys()].filter((i) => i < columnCount);

    setVisibleColumns(arr);
  };

  useEffect(() => {
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, [columnCount]);

  return visibleColumns;
}
