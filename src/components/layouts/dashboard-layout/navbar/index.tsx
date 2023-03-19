import { Navbar, NavLink } from "@mantine/core";

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
  { name: "Accounts", sections: [{ name: "Create" }, { name: "View All" }] },
  { name: "Products", sections: [{ name: "Create" }, { name: "View All" }] },
];

type Section = { name: string; sections?: Section[] };

function Section({ name, sections = [] }: Section) {
  return (
    <NavLink label={name}>
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