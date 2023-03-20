import { Button, Modal, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { trpc } from "trpc";

type FormValues = {
  code: string;
  name: string;
};

export default function CreateAccountModal() {
  const [opened, { open, close }] = useDisclosure(false);
  const { getInputProps, onSubmit } = useForm<FormValues>({
    initialValues: {
      code: "",
      name: "",
    },
    validate: {
      code: isNotEmpty("Code is required"),
      name: isNotEmpty("Name is required"),
    },
  });

  const context = trpc.useContext();
  const { mutate, isLoading } = trpc.accounts.create.useMutation({
    onSuccess: () => {
      void context.accounts.all.invalidate();
      close();
    },
  });

  function handleSubmit({ name, code }: FormValues) {
    mutate({ name, code });
  }

  return (
    <>
      <Button onClick={open}>Create</Button>
      <Modal opened={opened} onClose={close} title="Create Account">
        <form onSubmit={onSubmit(handleSubmit)}>
          <TextInput
            withAsterisk
            label="Code"
            mb={4}
            {...getInputProps("code")}
          />
          <TextInput withAsterisk label="Name" {...getInputProps("name")} />
          <Button mt={16} type="submit" loading={isLoading}>
            Submit
          </Button>
        </form>
      </Modal>
    </>
  );
}
