import { Navbar, NavLink, UnstyledButton, Text } from "@mantine/core";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const sections = [
  {
    name: "General Entry",
    sections: [
      { name: "Create", href: "general-entry/create" },
      { name: "View All" },
    ],
  },
  {
    name: "Product Entry",
    sections: [
      { name: "Create", href: "product-entry/create" },
      { name: "View All" },
    ],
  },
  { name: "Daily", href: "daily" },
  { name: "Accounts", href: "accounts" },
  { name: "Products", href: "products" },
];

type Section = { name: string; sections?: Section[]; href?: string };

function Section({ name, href, sections = [] }: Section) {
  const additionalParams:
    | object
    | { component: React.ReactNode; href: string } = href
    ? { component: Link, href: `/dashboard/${href}` }
    : {};

  return (
    <NavLink label={name} {...additionalParams}>
      {sections?.length > 0 && (
        <>
          {sections?.map((section) => (
            <Section key={section.name} {...section} />
          ))}
        </>
      )}
    </NavLink>
  );
}

export default function DashboardNavbar() {
  const { data: session } = useSession();
  return (
    <Navbar width={{ base: 300 }}>
      <Navbar.Section grow>
        {sections.map((section) => (
          <Section key={section.name} {...section} />
        ))}
      </Navbar.Section>
      <Navbar.Section p={8}>
        <Text>{session?.user.username}</Text>
        <UnstyledButton onClick={() => signOut()}>Logout</UnstyledButton>
      </Navbar.Section>
    </Navbar>
  );
}
