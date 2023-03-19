import { AppShell } from "@mantine/core";
import Navbar from "components/layouts/dashboard-layout/navbar";
import Header from "components/layouts/dashboard-layout/header";

export default function DashboardLayout({ children }) {
  return (
    <AppShell navbar={<Navbar />} header={<Header />}>
      {children}
    </AppShell>
  );
}
