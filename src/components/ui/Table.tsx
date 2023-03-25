import { Table as MantineTable } from "@mantine/core";
import { HTMLAttributes } from "react";

type Props<T extends unknown[]> = {
  items: T;
  columns: {
    name: string;
    value: (row: T[number], index: number) => React.ReactNode;
  }[];
  getKey: (row: T[number], index: number) => string | number;
  onClickRow?: (row: T[number]) => void;
  rowProps?: React.DetailedHTMLProps<
    HTMLAttributes<HTMLTableRowElement>,
    HTMLTableRowElement
  >;
};

export default function Table<T extends unknown[]>({
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
  const rows = items.map((row, index) => (
    <tr
      onClick={() => onClickRow(row)}
      key={getKey(row, index).toString()}
      {...rowProps}
    >
      {columns.map(({ value }, index) => (
        <td key={index}>{value(row, index)}</td>
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
