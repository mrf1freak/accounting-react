import DashboardLayout from "components/layouts/dashboard-layout";
import { trpc } from "trpc";
import { Table } from "components/ui";
import { Container, Flex, Title } from "@mantine/core";
import { useRouter } from "next/router";
import CreatePackingModal from "components/pages/dashboard/products/details/create-packing-modal";

export default function Details() {
  const {
    query: { id },
  } = useRouter();
  const productId = Number(id) || 0;
  const { data: product } = trpc.products.findByID.useQuery(productId);

  if (!product)
    return (
      <DashboardLayout>
        <div />
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <Container size="sm" mx={0}>
        <Title>{product.name}</Title>
        <Flex mb={24} justify="flex-end">
          <CreatePackingModal productId={productId} />
        </Flex>

        <Table
          items={product.packings}
          columns={[{ name: "Size", value: ({ size }) => `${size} kg` }]}
          getKey={({ id }) => id}
          rowProps={{ style: { cursor: "pointer" } }}
        />
      </Container>
    </DashboardLayout>
  );
}
