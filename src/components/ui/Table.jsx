// components/ui/Table.jsx
import classNames from "classnames";
import { useTheme } from "../../context/ThemeContext";

const Table = ({ columns = [], data = [], className = "" }) => {
  const { currentTheme } = useTheme();
  return (
    <div
      className={classNames(
        "backdrop-blur-md bg-secundario border border-secundario/50 shadow-lg rounded-lg overflow-hidden",
        className
      )}
    >
      <table className="w-full">
        <thead className="bg-texto/15">
          <tr>
            {columns.map((col) => (
              <th
                key={col.id}
                className="px-6 py-4 text-left text-sm font-bold text-texto uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-texto/10">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-texto"
              >
                No hay datos para mostrar.
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex}>
                {columns.map((col) => (
                  <td
                    key={col.id}
                    className={classNames(
                      "px-6 py-4 text-texto text-sm font-semibold"
                    )}
                  >
                    {typeof col.renderCell === "function"
                      ? col.renderCell(row, rowIndex)
                      : row[col.id]}
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

export default Table;
