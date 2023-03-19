import DashboardLayout from "components/layouts/dashboard-layout";
import CreateAccountModal from "components/pages/dashboard/accounts/index/create-account-modal";

export default function Accounts() {
  return (
    <DashboardLayout>
      <CreateAccountModal />
    </DashboardLayout>
  );
}
