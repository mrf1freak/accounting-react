import { AppShell } from "@mantine/core";
import Navbar from "./navbar";
import Header from "./header";

export default function DashboardLayout({ children }) {
  return (
    <AppShell navbar={<Navbar />} header={<Header />}>
      {children}
    </AppShell>
  );
}
