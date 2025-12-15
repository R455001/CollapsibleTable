"use client";

import React, { useState } from "react";

export default function CollapsibleTable({
  columns,
  data,
  visibleColumns = [],
  addClass = "",
  state = {},
  setstate = () => {},
}) {
  const [expandedRows, setExpandedRows] = useState({});
  const { rowsPerPage = 10, page = 1 } = state || {};

  const totalFiltered = data.length;
  const totalPages = Math.ceil(totalFiltered / rowsPerPage);

  const toggleRow = (index) => {
    setExpandedRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handlePageChange = (pag) => {
    if (pag > 0 && pag <= totalPages) {
      setstate({ ...state, page: pag });
    }
  };

  const getPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 4;

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            className={page === i ? "active" : ""}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      }
    } else {
      buttons.push(
        <button
          key="prev"
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          Previous
        </button>
      );

      const start = Math.max(1, page - 1);
      const end = Math.min(totalPages, page + 1);

      for (let i = start; i <= end; i++) {
        buttons.push(
          <button
            key={i}
            className={page === i ? "active" : ""}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      }

      buttons.push(
        <button
          key="next"
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </button>
      );
    }

    return buttons;
  };

  const startIndex = (page - 1) * rowsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className={`pxs_table_wr ${addClass}`}>
      <table>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className={`table-cell ${
                  visibleColumns.includes(i) ? "" : "hidden-on-mobile"
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, rowIndex) => (
              <React.Fragment key={startIndex + rowIndex}>
                {/* MAIN ROW */}
                <tr>
                  {columns.map((col, colIndex) => {
                    const isFirstVisible = colIndex === visibleColumns[0];

                    return (
                      <td
                        key={colIndex}
                        className={
                          visibleColumns.includes(colIndex)
                            ? ""
                            : "hidden-on-mobile"
                        }
                      >
                        {/* EVERYTHING INSIDE ONE DIV */}
                        <div className={col.accessor}>
                          {isFirstVisible && (
                            <button
                              onClick={() => toggleRow(startIndex + rowIndex)}
                              className="expand-btn"
                            >
                              {expandedRows[startIndex + rowIndex] ? (
                                <span className="red">-</span>
                              ) : (
                                <span className="green">+</span>
                              )}
                            </button>
                          )}

                          {col.render
                            ? col.render(row[col.accessor], row)
                            : row[col.accessor]}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* MOBILE EXPANDED ROW */}
                {expandedRows[startIndex + rowIndex] && (
                  <tr className="mobile-row">
                    <td colSpan={columns.length + 1}>
                      <ul>
                        {columns.map(
                          (col, colIndex) =>
                            !visibleColumns.includes(colIndex) && (
                              <li key={colIndex}>
                                <strong>{col.header}:</strong>{" "}
                                <div className={col.accessor}>
                                  {col.render
                                    ? col.render(row[col.accessor], row)
                                    : row[col.accessor]}
                                </div>
                              </li>
                            )
                        )}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} style={{ textAlign: "center" }}>
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalFiltered > rowsPerPage && (
        <div className="pxs_table_pagination">{getPaginationButtons()}</div>
      )}
    </div>
  );
}
