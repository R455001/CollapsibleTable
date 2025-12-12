"use client";

import { useState, useMemo, useEffect } from "react";
import CollapsibleTable from "./components/CollapsibleTable";
import { useResponsiveColumns } from "./components/useResponsiveColumns";

export default function Page() {
  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Address", accessor: "address" },
    { header: "Role", accessor: "role" },
    {
      header: "Status",
      accessor: "status",
      render: (value, row, tableData, setTableData) => (
        <label className="switch">
          <input
            type="checkbox"
            checked={value}
            onChange={() => {
              setTableData((prev) =>
                prev.map((item) =>
                  item.id === row.id ? { ...item, status: !item.status } : item
                )
              );
              console.log("Status toggled:", row.id);
            }}
          />
          <span className="slider"></span>
        </label>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (_, row) => (
        <div className="actions">
          <button
            className="btn btn-edit"
            onClick={() => console.log("Edit clicked:", row)}
          >
            Edit
          </button>
          <button
            className="btn btn-delete"
            onClick={() => console.log("Delete clicked:", row)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const initialData = [...Array(100)].map((_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@mail.com`,
    phone: `555-${1000 + i}`,
    address: `Street ${i + 1}, City`,
    role: ["Admin", "User", "Manager"][i % 3],
    status: i % 2 === 0,
  }));

  const [tableData, setTableData] = useState(initialData);

  const visibleColumns = useResponsiveColumns(columns.length);

  const [tableState, setTableState] = useState({
    page: 1,
    rowsPerPage: 10,
    total: tableData.length,
  });

  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!searchTerm) return tableData;

    const result = tableData.filter((row) =>
      columns.some((col) => {
        const value = row[col.accessor];
        return value
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
    );

    console.log("Search term:", searchTerm, "| Results:", result.length);
    return result;
  }, [searchTerm, tableData, columns]);

  useEffect(() => {
    console.log("Table state:", tableState);
  }, [tableState]);

  return (
    <div className="page-container">
      <div className="pxs_page_title">
        <h6>User’s List</h6>
        <div className="pxs_page_title_inner">
          <div className="pxs_main_input">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="pxs_rows_select">
            <label>Rows per page:</label>
            <select
              value={tableState.rowsPerPage}
              onChange={(e) =>
                setTableState({
                  ...tableState,
                  page: 1,
                  rowsPerPage: parseInt(e.target.value, 10),
                })
              }
            >
              {[5, 10, 20, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <CollapsibleTable
        columns={columns}
        data={filteredData}
        addClass="user_table"
        visibleColumns={visibleColumns}
        state={tableState}
        setstate={setTableState}
        tableData={tableData}
        setTableData={setTableData}
      />
    </div>
  );
}
