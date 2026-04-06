"use client";

import React, { useEffect, useState } from "react";
import Skeleton from "../Skeleton";
import Select from "../Select";
import { rowOptions } from "@/app/utils/constants";

export default function CollapsibleTable({
  columns,
  data,
  visibleColumns = [],
  addClass = "",
  state = {},
  setstate = () => {},
  loading = false,
  pagination = true,
  tableGrid = "col-12",
  tableData = [],
  setTableData = () => {},
}) {
  const [expandedRows, setExpandedRows] = useState({});
  const { rowsPerPage = 10, page = 1 } = state;

  useEffect(() => setExpandedRows({}), [visibleColumns]);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  // Only show rows for the current page
  const paginatedData = data.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const toggleRow = (index) =>
    setExpandedRows((prev) => ({ ...prev, [index]: !prev[index] }));

  const handlePageChange = (pag) => {
    if (pag > 0 && pag <= totalPages) setstate({ page: pag });
  };

  const handleRowsPerPageChange = (num) =>
    setstate({ rowsPerPage: num, page: 1 });

  const getPageFontSize = (p) => {
    const diff = Math.abs(page - p);
    if (diff === 0) return 20;
    if (diff === 1) return 18;
    if (diff === 2) return 16;
    return 14;
  };

  const getPagination = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const startItem = (page - 1) * rowsPerPage + 1;
  const endItem = Math.min(page * rowsPerPage, totalItems);

  return (
    <div className={tableGrid}>
      <div className="row">
        <div className="col-12">
          <div className={`pxs_table_wr ${addClass}`}>
            <table>
              <thead>
                <tr>
                  {columns.map((col, i) => (
                    <th
                      key={i}
                      className={`fs_15 fw_500 ${
                        visibleColumns.includes(i) ? "" : "hidden-on-mobile"
                      }`}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  Array.from({ length: rowsPerPage }).map((_, idx) => (
                    <tr key={idx}>
                      {columns.map((_, cidx) => (
                        <td key={cidx}>
                          <Skeleton type="table" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((row, rowIndex) => (
                    <React.Fragment key={row._id || rowIndex}>
                      <tr>
                        {columns.map((col, colIndex) => {
                          const isFirstVisible = colIndex === visibleColumns[0];
                          return (
                            <td
                              key={colIndex}
                              className={`fs_14 fw_400 ${
                                visibleColumns.includes(colIndex)
                                  ? ""
                                  : "hidden-on-mobile"
                              }`}
                            >
                              {isFirstVisible &&
                                visibleColumns.length < columns.length && (
                                  <button
                                    onClick={() => toggleRow(rowIndex)}
                                    className="expand-btn"
                                  >
                                    <span
                                      className={`fs_10 ${
                                        expandedRows[rowIndex] ? "red" : "green"
                                      }`}
                                    >
                                      {expandedRows[rowIndex] ? "-" : "+"}
                                    </span>
                                  </button>
                                )}

                              {col.render
                                ? col.render(
                                    row[col.accessor],
                                    row,
                                    rowIndex,
                                    tableData,
                                    setTableData,
                                  )
                                : row[col.accessor]}
                            </td>
                          );
                        })}
                      </tr>

                      {expandedRows[rowIndex] && (
                        <tr className="mobile-row">
                          <td colSpan={columns.length} className="fs_14 fw_400">
                            <ul>
                              {columns.map(
                                (col, colIndex) =>
                                  !visibleColumns.includes(colIndex) && (
                                    <li key={colIndex}>
                                      <strong>{col.header}:</strong>{" "}
                                      {col.render
                                        ? col.render(
                                            row[col.accessor],
                                            row,
                                            rowIndex,
                                            tableData,
                                            setTableData,
                                          )
                                        : row[col.accessor]}
                                    </li>
                                  ),
                              )}
                            </ul>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      style={{ textAlign: "center" }}
                    >
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {pagination && (
          <div className="col-12">
            <div className="pxs_table_pagination">
              <div className="pxs_pagination_info">
                <p className="fs_14 fw_400">
                  Showing {startItem}-{endItem} of {totalItems}
                </p>

                <div className="pxs_main_input">
                  <p className="fs_14 fw_400">Rows per page:</p>
                  <Select
                    options={rowOptions}
                    value={rowOptions.find((o) => o.value === rowsPerPage)}
                    onChange={(option) => handleRowsPerPageChange(option.value)}
                  />
                </div>
              </div>

              <div className="pxs_pagination_controls">
                <button
                  disabled={page === 1}
                  onClick={() => handlePageChange(1)}
                >
                  {"<< First"}
                </button>
                <button
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  {"< Previous"}
                </button>

                {getPagination().map((p, i) =>
                  p === "..." ? (
                    <span key={`dots-${i}`} className="fs_14">
                      ...
                    </span>
                  ) : (
                    <button
                      key={`page-${p}-${i}`}
                      className={`fs_${getPageFontSize(p)} ${page === p ? "active" : ""}`}
                      onClick={() => handlePageChange(p)}
                    >
                      {p}
                    </button>
                  ),
                )}

                <button
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  {"Next >"}
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(totalPages)}
                >
                  {"Last >>"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
