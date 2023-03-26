import { MediaQuery } from "@mantine/core";

export default function PrintHide({ children }: { children: React.ReactNode }) {
  return (
    <MediaQuery styles={{ display: "none" }} query="print">
      {children}
    </MediaQuery>
  );
}
