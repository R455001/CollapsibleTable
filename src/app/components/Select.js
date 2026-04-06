"use client";

import React from "react";

export default function Select({ options = [], value, onChange, placeholder }) {
  return (
    <select
      value={value?.value || ""}
      onChange={(e) => {
        const selected = options.find(
          (o) => o.value === Number(e.target.value),
        );
        onChange && onChange(selected);
      }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
