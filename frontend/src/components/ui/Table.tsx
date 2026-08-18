import React from 'react';

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  render?: (item: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T, index: number) => string;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export const Table = <T extends any>({
  data,
  columns,
  keyExtractor,
  emptyMessage = 'No data available.',
  onRowClick
}: TableProps<T>) => {
  return (
    <div className="table-container">
      <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--color-border-subtle)', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr 
                key={keyExtractor(item, index)} 
                onClick={() => onRowClick?.(item)}
                style={{ 
                  cursor: onRowClick ? 'pointer' : 'default',
                  borderBottom: '1px solid var(--color-border-subtle)'
                }}
                className={onRowClick ? 'hover-row' : ''} // assume .hover-row exists or just rely on global styling
              >
                {columns.map((col) => (
                  <td key={col.key} style={{ padding: '1rem' }}>
                    {col.render ? col.render(item) : (item as any)[col.key]}
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
