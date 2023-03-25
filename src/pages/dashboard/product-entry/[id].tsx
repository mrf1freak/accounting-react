import { useRouter } from "next/router";
import { trpc } from "trpc";
import DashboardLayout from "components/layouts/dashboard-layout";
import { Text, Container, Title, Space, Box, Group } from "@mantine/core";
import { Table } from "components/ui";
import { capitalize } from "lodash";

export default function ProductEntryDetails() {
  const {
    query: { id },
  } = useRouter();
  const { data: entry } = trpc.productEntry.findByID.useQuery(Number(id));

  if (!entry) return null;

  return (
    <DashboardLayout>
      <Container>
        <Group grow>
          <Box>
            <Title>{entry.account.name}</Title>
            <Text>{entry.date.toDateString()}</Text>
          </Box>
          <Title order={2} ta="right">
            {capitalize(entry.type)}
          </Title>
        </Group>
        <Space h="md" />
        <Table
          items={entry.items}
          columns={[
            {
              name: "Product",
              value: ({ packing }) => packing.product.name,
            },
            { name: "Packing", value: ({ packing }) => packing.size },
            { name: "Quantity", value: ({ quantity }) => quantity },
            { name: "Price", value: ({ price }) => price },
            {
              name: "Total",
              value: ({ total }) => `Rs. ${total.toLocaleString()}`,
            },
          ]}
          getKey={({ id }) => id}
        />
        <Text ta="right" size={24} mt={8}>
          Rs. {entry.total.toLocaleString()}
        </Text>
      </Container>
    </DashboardLayout>
  );
}
