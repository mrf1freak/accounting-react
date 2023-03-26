import { NextApiRequest, NextApiResponse } from "next";
import { hashPassword } from "utils/password";

export default async function Password(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { p },
  } = req;
  if (typeof p === "string") return res.send(await hashPassword(p));
  res.send("Error");
}
