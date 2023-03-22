import { Button, Modal, NumberInput } from "@mantine/core";
import { isInRange, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { trpc } from "trpc";

type FormValues = {
  size: number;
  quantity: number;
};

export default function CreatePackingModal({
  productId,
}: {
  productId: number;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const { getInputProps, onSubmit } = useForm<FormValues>({
    initialValues: {
      size: 25,
      quantity: 0,
    },
    validate: {
      size: isInRange({ min: 1 }),
    },
  });

  const context = trpc.useContext();
  const { mutate, isLoading } = trpc.packing.create.useMutation({
    onSuccess: () => {
      void context.products.findByID.invalidate(productId);
      close();
    },
  });

  function handleSubmit({ size, quantity }: FormValues) {
    if (productId) mutate({ size, quantity, productId });
  }

  return (
    <>
      <Button onClick={open}>Create Packing</Button>
      <Modal opened={opened} onClose={close} title="Create Packing">
        <form onSubmit={onSubmit(handleSubmit)}>
          <NumberInput label="Size (kg)" mb={4} {...getInputProps("size")} />
          <NumberInput label="Quantity" {...getInputProps("quantity")} />
          <Button mt={16} type="submit" loading={isLoading}>
            Submit
          </Button>
        </form>
      </Modal>
    </>
  );
}
