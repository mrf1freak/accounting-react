import DashboardLayout from "components/layouts/dashboard-layout";
import { DateInput } from "@mantine/dates";
import { useState } from "react";
import { trpc } from "trpc";
import { Table } from "components/ui";
import { Box, Container, Flex, Group, Title } from "@mantine/core";
import { useRouter } from "next/router";

export default function Daily() {
  const { push } = useRouter();
  const [date, setDate] = useState<Date>(new Date());
  const { data: generalEntries = [] } =
    trpc.generalEntry.findByDate.useQuery(date);
  const { data: productEntries = [] } =
    trpc.productEntry.findByDate.useQuery(date);
  const purchases = productEntries.filter(({ type }) => type === "PURCHASE");
  const sales = productEntries.filter(({ type }) => type === "SALE");
  const noEntries = productEntries.length + generalEntries.length == 0;

  const salesTable = sales.length > 0 && (
    <Box>
      <Title order={2} mb={8}>
        Sales
      </Title>
      <Table
        columns={[
          { name: "Account", value: ({ account }) => account.name },
          { name: "Amount", value: () => 0 },
        ]}
        onClickRow={({ id }) => push(`product-entry/${id}`)}
        items={sales}
        getKey={({ id }) => id}
      />
    </Box>
  );

  const purchasesTable = purchases.length > 0 && (
    <Box>
      <Title order={2} mb={8}>
        Purchases
      </Title>
      <Table
        columns={[
          { name: "Account", value: ({ account }) => account.name },
          { name: "Amount", value: () => 0 },
        ]}
        onClickRow={({ id }) => push(`general-entry/${id}`)}
        items={purchases}
        getKey={({ id }) => id}
      />
    </Box>
  );

  const entriesTable = generalEntries.length > 0 && (
    <Box>
      <Title order={2} mb={8}>
        Entries
      </Title>
      <Table
        columns={[
          { name: "From", value: ({ from }) => from.name },
          { name: "Amount", value: ({ amount }) => amount },
          { name: "To", value: ({ to }) => to.name },
        ]}
        items={generalEntries}
        getKey={({ id }) => id}
      />
    </Box>
  );

  return (
    <DashboardLayout>
      <Container size="md" mx={0}>
        <Group mb={24} grow>
          <Title>Daily</Title>
          <DateInput
            value={date}
            onChange={(date) => setDate(date || new Date())}
            width={220}
          />
        </Group>
        <Flex direction="column" gap={16}>
          {noEntries && <Box ta="center">No Entries</Box>}
          {salesTable}
          {purchasesTable}
          {entriesTable}
        </Flex>
      </Container>
    </DashboardLayout>
  );
}
