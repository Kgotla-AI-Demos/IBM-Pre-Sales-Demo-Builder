/**
 * DataTableView — Carbon DataTable wrapper with search, status tags, CSV export, pagination.
 * carbondesignsystem.com/components/data-table — unverified via Carbon MCP (token expired).
 */
import React, { useState, useMemo } from 'react';
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  TableContainer,
  Pagination,
  Tag,
  Button,
} from '@carbon/react';
import Download from '@carbon/icons-react/lib/download/index.js';

const STATUS_TAG_TYPE = {
  Normal: 'green',
  Warning: 'yellow',
  Critical: 'red',
  Offline: 'gray',
  Maintenance: 'blue',
  Open: 'blue',
  Assigned: 'teal',
  'In Progress': 'purple',
  Completed: 'green',
  Deferred: 'warm-gray',
  Low: 'gray',
  Medium: 'cyan',
  High: 'red',
  'P1-Critical': 'red',
  'P2-High': 'magenta',
  'P3-Medium': 'cyan',
  'P4-Low': 'gray',
};

function exportCSV(headers, rows, filename) {
  const headerRow = headers.map((h) => h.header).join(',');
  const dataRows = rows.map((r) => headers.map((h) => {
    const val = r[h.key];
    return typeof val === 'object' ? JSON.stringify(val) : String(val ?? '');
  }).join(','));
  const csv = [headerRow, ...dataRows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'export.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function DataTableView({
  headers = [],
  rows = [],
  title = '',
  description = '',
  pageSize = 10,
  statusColumns = [],
  exportFilename = 'export.csv',
}) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);

  const filteredRows = useMemo(() => {
    if (!search) return rows;
    const s = search.toLowerCase();
    return rows.filter((row) =>
      headers.some((h) => String(row[h.key] ?? '').toLowerCase().includes(s))
    );
  }, [rows, search, headers]);

  const paginatedRows = filteredRows.slice((page - 1) * currentPageSize, page * currentPageSize);

  return (
    <DataTable rows={paginatedRows} headers={headers}>
      {({ rows: tableRows, headers: tableHeaders, getTableProps, getHeaderProps, getRowProps, getToolbarProps, onInputChange }) => (
        <TableContainer title={title} description={description}>
          <TableToolbar {...getToolbarProps()}>
            <TableToolbarContent>
              <TableToolbarSearch
                placeholder="Search..."
                persistent
                onChange={(e) => {
                  setSearch(e.target.value);
                  onInputChange(e);
                  setPage(1);
                }}
              />
              <Button
                kind="ghost"
                size="sm"
                renderIcon={Download}
                iconDescription="Export CSV"
                hasIconOnly={false}
                onClick={() => exportCSV(headers, filteredRows, exportFilename)}
              >
                Export CSV
              </Button>
            </TableToolbarContent>
          </TableToolbar>

          <Table {...getTableProps()} aria-label={title || 'Data table'}>
            <TableHead>
              <TableRow>
                {tableHeaders.map((header) => (
                  <TableHeader key={header.key} {...getHeaderProps({ header })}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows.map((row) => (
                <TableRow key={row.id} {...getRowProps({ row })}>
                  {row.cells.map((cell) => (
                    <TableCell key={cell.id}>
                      {statusColumns.includes(cell.info.header) ? (
                        <Tag type={STATUS_TAG_TYPE[cell.value] || 'gray'} size="sm">
                          {cell.value}
                        </Tag>
                      ) : (
                        cell.value
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {tableRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={headers.length} style={{ textAlign: 'center', color: '#a8a8a8', padding: '2rem' }}>
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {filteredRows.length > currentPageSize && (
            <Pagination
              totalItems={filteredRows.length}
              pageSize={currentPageSize}
              pageSizes={[10, 20, 50]}
              page={page}
              onChange={({ page: p, pageSize: ps }) => { setPage(p); setCurrentPageSize(ps); }}
            />
          )}
        </TableContainer>
      )}
    </DataTable>
  );
}
