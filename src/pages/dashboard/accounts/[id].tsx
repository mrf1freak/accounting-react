import DashboardLayout from "components/layouts/dashboard-layout";
import { useState } from "react";
import { trpc } from "trpc";
import { Group, Title } from "@mantine/core";
import { useRouter } from "next/router";
import { PrintHide, Table } from "components/ui";
import { capitalize } from "lodash";
import { DateInput } from "@mantine/dates";
import { generalEntry, productEntry } from "utils/urls";

const defaultStartDate = new Date(new Date().valueOf() - 7 * 24 * 3600 * 1000);

export default function AccountDetails() {
  const {
    query: { id: accountId },
    push,
  } = useRouter();
  const id = Number(accountId);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(new Date());
  const { data: account } = trpc.accounts.findByID.useQuery(id);
  const { data: report = [] } = trpc.accounts.report.useQuery({
    id,
    startDate,
    endDate,
  });

  function stripTime(date: Date) {
    return new Date(date.toDateString());
  }

  function handleClickRow({
    entryType,
    entryId,
  }: {
    entryType: "PRODUCT" | "GENERAL";
    entryId: number;
  }) {
    switch (entryType) {
      case "PRODUCT":
        return push(productEntry(entryId));
      case "GENERAL":
        return push(generalEntry(entryId));
    }
  }

  return (
    <DashboardLayout>
      <Group mb={12} grow>
        <Title>{account?.name}</Title>
        <PrintHide>
          <Group>
            <DateInput
              value={startDate}
              onChange={(date) =>
                setStartDate(stripTime(date || defaultStartDate))
              }
              label="Start"
            />
            <DateInput
              value={endDate}
              onChange={(date) => setEndDate(stripTime(date || new Date()))}
              label="End"
            />
          </Group>
        </PrintHide>
      </Group>
      <Table
        items={report}
        columns={[
          { name: "Date", value: ({ date }) => date.toDateString() },
          { name: "Type", value: ({ type }) => capitalize(type) },
          {
            name: "Debit",
            value: ({ amount }) => (amount < 0 ? Math.abs(amount) : 0),
          },
          {
            name: "Credit",
            value: ({ amount }) => (amount > 0 ? Math.abs(amount) : 0),
          },
          { name: "Balance", value: ({ balance }) => balance },
        ]}
        onClickRow={handleClickRow}
        getKey={({ id }) => id}
      />
    </DashboardLayout>
  );
}
