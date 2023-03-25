import DashboardLayout from "components/layouts/dashboard-layout";
import { useState } from "react";
import { trpc } from "trpc";
import { Group, Title } from "@mantine/core";
import { useRouter } from "next/router";
import { Table } from "components/ui";
import { capitalize } from "lodash";
import { DateInput } from "@mantine/dates";

export default function AccountDetails() {
  const {
    query: { id: accountId },
  } = useRouter();
  const id = Number(accountId);
  const [startDate, setStartDate] = useState(new Date());
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

  return (
    <DashboardLayout>
      <Group mb={12} grow>
        <Title>{account?.name}</Title>
        <Group>
          <DateInput
            value={startDate}
            onChange={(date) => setStartDate(stripTime(date || new Date()))}
            label="Start"
          />
          <DateInput
            value={endDate}
            onChange={(date) => setEndDate(stripTime(date || new Date()))}
            label="End"
          />
        </Group>
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
        getKey={({ id }) => id}
      />
    </DashboardLayout>
  );
}
