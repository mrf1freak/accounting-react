import { Table as MantineTable } from "@mantine/core";
import { HTMLAttributes } from "react";

type Props<T> = {
  items: T[];
  columns: { name: string; value: (row: T) => React.ReactNode }[];
  getKey: (row: T) => string | number;
  onClickRow?: (row: T) => void;
  rowProps?: React.DetailedHTMLProps<
    HTMLAttributes<HTMLTableRowElement>,
    HTMLTableRowElement
  >;
};

export default function Table<T>({
  items,
  columns,
  getKey,
  onClickRow = () => undefined,
  rowProps,
}: Props<T>) {
  const head = (
    <tr>
      {columns.map(({ name }, index) => (
        <th key={index}>{name}</th>
      ))}
    </tr>
  );
  const rows = items.map((row) => (
    <tr
      onClick={() => onClickRow(row)}
      key={getKey(row).toString()}
      {...rowProps}
    >
      {columns.map(({ value }, index) => (
        <td key={index}>{value(row)}</td>
      ))}
    </tr>
  ));
  return (
    <MantineTable withBorder highlightOnHover>
      <thead>{head}</thead>
      <tbody>{rows}</tbody>
    </MantineTable>
  );
}
