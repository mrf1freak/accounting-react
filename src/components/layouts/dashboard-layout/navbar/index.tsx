import { Navbar, NavLink } from "@mantine/core";
import Link from "next/link";

const sections = [
  {
    name: "General Entry",
    sections: [{ name: "Create" }, { name: "View All" }],
  },
  {
    name: "Product Entry",
    sections: [{ name: "Create" }, { name: "View All" }],
  },
  { name: "Daily" },
  { name: "Accounts", href: "accounts" },
  { name: "Products", sections: [{ name: "Create" }, { name: "View All" }] },
];

type Section = { name: string; sections?: Section[]; href?: string };

function Section({ name, href, sections = [] }: Section) {
  const additionalParams:
    | object
    | { component: React.ReactNode; href: string } = href
    ? { component: Link, href: `dashboard/${href}` }
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
  return (
    <Navbar width={{ base: 300 }}>
      <Navbar.Section>
        {sections.map((section) => (
          <Section key={section.name} {...section} />
        ))}
      </Navbar.Section>
    </Navbar>
  );
}
