import type { AppType } from "next/app";
import { trpc } from "trpc";
import { Notifications } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <MantineProvider>
      <Component {...pageProps} />
      <Notifications />
    </MantineProvider>
  );
};
export default trpc.withTRPC(MyApp);
