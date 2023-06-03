import { Modal, Text, Button, Flex, Menu, ActionIcon } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash, IconDotsVertical } from "@tabler/icons-react";
import { trpc } from "trpc";
import { useRouter } from "next/router";

export default function OptionsMenu({ id }: { id: number }) {
  const { push } = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const { mutate, isLoading } = trpc.generalEntry.deleteByID.useMutation({
    onSuccess: () => push("/dashboard"),
  });

  function handleDelete() {
    mutate(id);
  }

  return (
    <>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <ActionIcon ml="auto">
            <IconDotsVertical />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item color="red" icon={<IconTrash size={14} />} onClick={open}>
            Delete
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Modal opened={opened} onClose={close} title="Delete Entry">
        <Text>Are you sure you want to delete this entry?</Text>
        <Flex justify="flex-end" gap={16} mt={16}>
          <Button onClick={close} variant="outline" color="gray">
            Cancel
          </Button>
          <Button color="red" onClick={handleDelete} loading={isLoading}>
            Delete
          </Button>
        </Flex>
      </Modal>
    </>
  );
}
