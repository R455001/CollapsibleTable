"use client";

import React from "react";

export default function Skeleton({ type }) {
  if (type === "table") {
    return (
      <div
        className="skeleton-table-cell"
        style={{ background: "#eeeeee", height: "20px", borderRadius: "4px" }}
      />
    );
  }
  return (
    <div
      className="skeleton"
      style={{ background: "#eee", height: "20px", borderRadius: "4px" }}
    />
  );
}
