import DashboardLayout from "components/layouts/dashboard-layout";
import {
  ActionIcon,
  Box,
  Button,
  Container,
  NumberInput,
  Select,
  Stack,
  Table,
  TextInput,
  Title,
} from "@mantine/core";
import { isInRange, useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import { trpc } from "trpc";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconTrash } from "@tabler/icons-react";
import { randomId } from "@mantine/hooks";

export default function Create() {
  const { data: accounts = [] } = trpc.accounts.all.useQuery();
  const { data: products = [] } = trpc.products.all.useQuery();
  const packings = products.map(({ packings }) => packings).flat();

  function isAccount() {
    return (value: string) =>
      accounts.some(({ id }) => id.toString() == value)
        ? null
        : "Select an account";
  }

  function isValidId() {
    return (value: string) => (value != "0" ? null : "Cannot be empty");
  }

  const {
    getInputProps,
    onSubmit,
    getTransformedValues,
    reset,
    values,
    insertListItem,
    removeListItem,
    setFieldValue,
  } = useForm({
    initialValues: {
      date: new Date(),
      description: "",
      accountId: "0",
      additionalCharges: 0,
      type: "SALE" as "SALE" | "PURCHASE",
      items: [
        {
          key: randomId(),
          productId: "0",
          packingId: "0",
          quantity: 0,
          price: 0,
        },
      ],
    },
    validate: {
      accountId: isAccount(),
      additionalCharges: isInRange({ min: 0 }),
      items: {
        quantity: isInRange({ min: 1 }, "Should be greater than 0"),
        price: isInRange({ min: 1 }, "Should be greater than 0"),
        productId: isValidId(),
        packingId: isValidId(),
      },
    },
    transformValues: (values) => ({
      ...values,
      accountId: Number(values.accountId),
      items: values.items.map(({ productId, packingId, ...rest }) => ({
        ...rest,
        productId: Number(productId),
        packingId: Number(packingId),
      })),
    }),
  });
  const { mutate, isLoading } = trpc.productEntry.create.useMutation({
    onSuccess: () => {
      notifications.show({
        title: "Entry Created",
        message: "An entry was created",
        color: "green",
        icon: <IconCheck />,
      });
      reset();
    },
  });

  const accountsSelectData = accounts.map(({ name, id }) => ({
    label: name,
    value: id.toString(),
  }));
  const productsSelectData = products.map(({ name, id }) => ({
    label: name,
    value: id.toString(),
  }));

  function addItem() {
    insertListItem("items", {
      key: randomId(),
      productId: "0",
      packingId: "0",
      quantity: 0,
      price: 0,
    });
  }

  function getPackingSize(id: number) {
    return packings.find(({ id: _id }) => _id == id)?.size || 0;
  }

  function getItemTotal({
    quantity,
    price,
    packingId,
  }: {
    quantity: number;
    price: number;
    packingId: string;
  }) {
    return quantity * price * getPackingSize(Number(packingId));
  }

  const total =
    values.items.map(getItemTotal).reduce((a, b) => a + b, 0) +
    values.additionalCharges;

  function handleSubmit(values: ReturnType<typeof getTransformedValues>) {
    mutate(values);
  }

  return (
    <DashboardLayout>
      <Container size="md" mx={0}>
        <Title>Create Product Entry</Title>
        <form onSubmit={onSubmit(handleSubmit)}>
          <Stack spacing={16}>
            <DateInput label="Date" {...getInputProps("date")} />
            <TextInput label="Description" {...getInputProps("description")} />
            <Select
              data={accountsSelectData}
              searchable
              label="Account"
              {...getInputProps("accountId")}
            />
            <Select
              data={["SALE", "PURCHASE"] as const}
              label="Type"
              {...getInputProps("type")}
            />
            <NumberInput
              label="Additional Charges"
              min={0}
              {...getInputProps("additionalCharges")}
            />
            <Box>
              <Table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Packing</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {values.items.map(
                    ({ quantity, price, packingId, productId, key }, index) => (
                      <tr key={key}>
                        <td>
                          <Select
                            data={productsSelectData}
                            {...getInputProps(`items.${index}.productId`)}
                            onChange={(value) => {
                              setFieldValue(`items.${index}.productId`, value);
                              setFieldValue(`items.${index}.packingId`, "0");
                            }}
                            searchable
                          />
                        </td>

                        <td>
                          <Select
                            data={packings
                              .filter(
                                ({ productId: id }) =>
                                  id.toString() == productId
                              )
                              .map(({ id, size }) => ({
                                label: size.toString(),
                                value: id.toString(),
                              }))}
                            {...getInputProps(`items.${index}.packingId`)}
                            searchable
                          />
                        </td>
                        <td>
                          <NumberInput
                            {...getInputProps(`items.${index}.quantity`)}
                          />
                        </td>
                        <td>
                          <NumberInput
                            {...getInputProps(`items.${index}.price`)}
                          />
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          Rs. {getItemTotal({ quantity, price, packingId })}
                        </td>
                        <td>
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            onClick={() => removeListItem("items", index)}
                          >
                            <IconTrash size="1rem" />
                          </ActionIcon>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} />
                    <td>Rs. {total}</td>
                  </tr>
                </tfoot>
              </Table>
              <Button onClick={addItem} mt={16}>
                Add Item
              </Button>
            </Box>
            <Button type="submit" loading={isLoading} mt={36}>
              Save
            </Button>
          </Stack>
        </form>
      </Container>
    </DashboardLayout>
  );
}
