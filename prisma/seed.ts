import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: "saad@email.com",
      username: "saad",
      password: "password",
    },
  });
}

main().then(() => console.log("Seed Complete"));
