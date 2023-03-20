import DashboardLayout from "components/layouts/dashboard-layout";
import CreateAccountModal from "components/pages/dashboard/accounts/index/create-account-modal";
import { trpc } from "trpc";
import { Table } from "components/ui";
import { Container, Flex, Title } from "@mantine/core";
import { useRouter } from "next/router";

export default function Accounts() {
  const { data = [] } = trpc.accounts.all.useQuery();
  const { push, pathname } = useRouter();

  return (
    <DashboardLayout>
      <Container size="sm" mx={0}>
        <Title>Accounts</Title>
        <Flex mb={24} justify="flex-end">
          <CreateAccountModal />
        </Flex>

        <Table
          items={data}
          columns={[
            { name: "Code", value: ({ code }) => code },
            { name: "Name", value: ({ name }) => name },
          ]}
          getKey={({ id }) => id}
          onClickRow={({ id }) => push(`${pathname}/${id}`)}
          rowProps={{ style: { cursor: "pointer" } }}
        />
      </Container>
    </DashboardLayout>
  );
}
