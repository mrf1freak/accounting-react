import { AppShell } from "@mantine/core";
import Navbar from "components/layouts/dashboard-layout/navbar";
import Header from "components/layouts/dashboard-layout/header";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { status } = useSession();
  useEffect(() => {
    if (status == "unauthenticated") void signIn("Credentials");
  }, [status]);
  return (
    <AppShell navbar={<Navbar />} header={<Header />}>
      {children}
    </AppShell>
  );
}
