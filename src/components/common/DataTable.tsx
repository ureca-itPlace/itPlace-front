import React from 'react';
import Pagination from 'react-js-pagination';

interface Column {
  key: string;
  label: string;
  width?: string;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

interface DataTableProps {
  data: Record<string, unknown>[];
  columns: Column[];
  onRowClick?: (row: Record<string, unknown>) => void;
  width?: number;
  height?: number;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (pageNumber: number) => void;
  emptyMessage?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  onRowClick,
  width = 1410,
  height = 516,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  emptyMessage = '데이터가 없습니다.',
}) => {
  return (
    <div className="space-y-5">
      <div
        className="bg-white rounded-[18px] shadow-sm border border-gray-100 overflow-hidden relative"
        style={{ width, height }}
      >
        <table className="w-full table-fixed">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr style={{ height: 56 }}>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-body-2 font-medium text-gray-700"
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr style={{ height: 56 }}>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-body-2 text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 transition-colors duration-150 ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                  style={{ height: 56 }}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 text-body-2 text-gray-900 truncate"
                      style={{ width: column.width }}
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : (row[column.key] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-center" style={{ width }}>
        <Pagination
          activePage={currentPage}
          itemsCountPerPage={itemsPerPage}
          totalItemsCount={totalItems}
          pageRangeDisplayed={5}
          onChange={onPageChange}
          innerClass="flex items-center space-x-2"
          itemClass="px-3 py-2 text-body-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-150"
          linkClass="block w-full h-full"
          activeClass="bg-purple04 text-white hover:bg-purple04"
          activeLinkClass="text-white"
          firstPageText="<<"
          lastPageText=">>"
          prevPageText="<"
          nextPageText=">"
          hideFirstLastPages={false}
          hideNavigation={false}
          hideDisabled={false}
          disabledClass="opacity-50 cursor-not-allowed"
        />
      </div>
    </div>
  );
};

export default DataTable;
