import { useRouter } from "next/router";
import { trpc } from "trpc";
import DashboardLayout from "components/layouts/dashboard-layout";
import { Text, Container, Title, Space, Box, Group } from "@mantine/core";
import OptionsMenu from "components/pages/dashboard/general-entry/details/options-menu";
import { Table } from "components/ui";

export default function ProductEntryDetails() {
  const {
    query: { id },
  } = useRouter();
  const { data: entry } = trpc.generalEntry.findByID.useQuery(Number(id));

  if (!entry) return null;

  return (
    <DashboardLayout>
      <Container>
        <Group grow>
          <Box>
            <Title>General Entry</Title>
            <Text>{entry.date.toDateString()}</Text>
          </Box>
          <Box>
            <OptionsMenu id={Number(id)} />
          </Box>
        </Group>
        <Space h="md" />
        <Table
          items={[entry]}
          columns={[
            {
              name: "From",
              value: ({ from }) => from.name,
            },

            {
              name: "Amount",
              value: ({ amount }) => amount,
            },

            {
              name: "To",
              value: ({ to }) => to.name,
            },
          ]}
          getKey={({ id }) => id}
        />
      </Container>
    </DashboardLayout>
  );
}
