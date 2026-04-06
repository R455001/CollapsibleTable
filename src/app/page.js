"use client";

import { useEffect, useState, useMemo } from "react";
import CollapsibleTable from "./components/table/CollapsibleTable";
import { useResponsiveColumns } from "./components/table/useResponsiveColumns";

const breakpoints = {
  1200: { columns: 8 },
  991: { columns: 6 },
  768: { columns: 5 },
  575: { columns: 4 },
  360: { columns: 3 },
  0: { columns: 2 },
};

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
      render: (value, row, index, tableData, setTableData) => (
        <label className="switch">
          <input
            type="checkbox"
            checked={value}
            onChange={() => {
              setTableData((prev) =>
                prev.map((item) =>
                  item.id === row.id ? { ...item, status: !item.status } : item,
                ),
              );
              // Log to console
              console.log(
                `Status for ${row.name} (ID: ${row.id}) changed to`,
                !value,
              );
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
            onClick={() => console.log("Edit:", row)}
          >
            Edit
          </button>
          <button
            className="btn btn-delete"
            onClick={() => console.log("Delete:", row)}
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
  const visibleColumns = useResponsiveColumns(columns.length, breakpoints);
  const [tableState, setTableState] = useState({ page: 1, rowsPerPage: 10 });
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!searchTerm) return tableData;
    return tableData.filter((row) =>
      columns.some((col) =>
        row[col.accessor]
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      ),
    );
  }, [searchTerm, tableData, columns]);

  useEffect(() => {
    setTableState((prev) => ({ ...prev, page: 1 }));
  }, [searchTerm]);

  return (
    <div className="page-container">
      <div className="pxs_page_title">
        <h6>User’s List</h6>
        <div className="pxs_main_input">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <CollapsibleTable
        columns={columns}
        data={filteredData}
        addClass="user_table"
        visibleColumns={visibleColumns}
        state={tableState}
        setstate={(newState) =>
          setTableState((prev) => ({ ...prev, ...newState }))
        }
        tableData={tableData}
        setTableData={setTableData}
      />
    </div>
  );
}
