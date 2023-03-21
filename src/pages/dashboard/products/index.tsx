import DashboardLayout from "components/layouts/dashboard-layout";
import { trpc } from "trpc";
import { Table } from "components/ui";
import { Container, Flex, Title } from "@mantine/core";
import { useRouter } from "next/router";
import CreateProductModal from "components/pages/dashboard/products/index/create-product-modal";

export default function Accounts() {
  const { data = [] } = trpc.products.all.useQuery();
  const { push, pathname } = useRouter();

  return (
    <DashboardLayout>
      <Container size="sm" mx={0}>
        <Title>Products</Title>
        <Flex mb={24} justify="flex-end">
          <CreateProductModal />
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
