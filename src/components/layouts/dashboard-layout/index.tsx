import { AppShell } from "@mantine/core";
import Navbar from "components/layouts/dashboard-layout/navbar";
import Header from "components/layouts/dashboard-layout/header";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useMediaQuery } from "@mantine/hooks";

export default function DashboardLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { status } = useSession();
  const print = useMediaQuery("print");
  useEffect(() => {
    if (status == "unauthenticated") void signIn("Credentials");
  }, [status]);
  return (
    <AppShell navbar={<Navbar />} header={<Header />} hidden={print}>
      {children}
    </AppShell>
  );
}
