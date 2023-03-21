import DashboardLayout from "components/layouts/dashboard-layout";
import {
  Button,
  Container,
  Group,
  NumberInput,
  Select,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import { trpc } from "trpc";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";

export default function Create() {
  const { data: accounts = [] } = trpc.accounts.all.useQuery();
  function isAccount() {
    return (value: string) =>
      accounts.some(({ id }) => id.toString() == value)
        ? null
        : "Select an account";
  }
  const { getInputProps, onSubmit, getTransformedValues, reset } = useForm({
    initialValues: {
      date: new Date(),
      amount: 0,
      description: "",
      fromId: "0",
      toId: "0",
    },
    validate: {
      fromId: isAccount(),
      toId: isAccount(),
    },
    transformValues: (values) => ({
      ...values,
      fromId: Number(values.fromId),
      toId: Number(values.toId),
    }),
  });
  const { mutate, isLoading } = trpc.generalEntry.create.useMutation({
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

  function handleSubmit({
    date,
    amount,
    description,
    fromId,
    toId,
  }: ReturnType<typeof getTransformedValues>) {
    mutate({ date, amount, description, fromId, toId });
  }

  return (
    <DashboardLayout>
      <Container size="sm" mx={0}>
        <Title>Create General Entry</Title>
        <form onSubmit={onSubmit(handleSubmit)}>
          <Stack spacing={16}>
            <DateInput label="Date" {...getInputProps("date")} />
            <NumberInput label="Amount" min={0} {...getInputProps("amount")} />
            <TextInput label="Description" {...getInputProps("description")} />
            <Group spacing={16}>
              <Select
                data={accountsSelectData}
                searchable
                label="From"
                {...getInputProps("fromId")}
              />
              <Select
                data={accountsSelectData}
                searchable
                label="To"
                {...getInputProps("toId")}
              />
            </Group>
            <Button type="submit" loading={isLoading}>
              Save
            </Button>
          </Stack>
        </form>
      </Container>
    </DashboardLayout>
  );
}
