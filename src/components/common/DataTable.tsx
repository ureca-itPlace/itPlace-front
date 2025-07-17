import React from 'react';

interface Column {
  key: string;
  label: string;
  width?: string;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
  headerRender?: () => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps {
  data: Record<string, unknown>[];
  columns: Column[];
  onRowClick?: (row: Record<string, unknown>) => void;
  width?: number;
  height?: number;
  emptyMessage?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  onRowClick,
  width = 1410,
  height = 516,
  emptyMessage = '데이터가 없습니다.',
}) => {
  return (
    <div className="bg-white rounded-[18px]  overflow-hidden relative" style={{ width, height }}>
      <table className="w-full table-fixed">
        <thead className="border-b border-grey01">
          <tr style={{ height: 56 }}>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`pl-[40px] py-2 text-body-2-bold text-grey05 ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}`}
                style={{ width: column.width }}
              >
                {column.headerRender ? column.headerRender() : column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-grey01">
          {data.length === 0 ? (
            <tr style={{ height: 56 }}>
              <td
                colSpan={columns.length}
                className="pl-[40px] py-2 text-center text-body-2 text-black"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={index}
                className={`hover:bg-grey01 transition-colors duration-150 ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                style={{ height: 56 }}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`pl-[40px] py-2 text-body-2 text-black truncate ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}`}
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
  );
};

export default DataTable;
