import type { AppType } from "next/app";
import { trpc } from "trpc";
import { Notifications } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

const MyApp: AppType<{ session: Session }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <MantineProvider>
        <Component {...pageProps} />
        <Notifications />
      </MantineProvider>
    </SessionProvider>
  );
};
export default trpc.withTRPC(MyApp);
