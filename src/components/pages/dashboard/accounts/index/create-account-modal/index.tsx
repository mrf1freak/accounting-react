import { Box, Button, Group, Modal, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";

export default function CreateAccountModal() {
  const [opened, { open, close }] = useDisclosure(false);
  const { getInputProps, onSubmit } = useForm({
    initialValues: {
      code: "",
      name: "",
    },
    validate: {
      code: isNotEmpty("Code is required"),
      name: isNotEmpty("Name is required"),
    },
  });

  function handleSubmit() {
    close();
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
          <Button mt={16} type="submit" grow>
            Submit
          </Button>
        </form>
      </Modal>
    </>
  );
}
