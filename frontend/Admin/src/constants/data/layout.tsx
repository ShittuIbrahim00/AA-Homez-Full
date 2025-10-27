export const NavbarData = [
  {
    name: "Dashboard",
    id: 1,
    icon: require("../../../public/svg/home.svg"),
    active_icon: require("../../../public/svg/home_fill.svg"),
    route: "/dashboard"
  },
  {
    name: "Properties",
    id: 2,
    icon: require("../../../public/svg/properties.svg"),
    active_icon: require("../../../public/svg/properties_fill.svg"),
    route: "/properties",
    children: [
      {
        name: "Add Property",
        route: "/properties/add",
      },
      {
        name: "Add Sub-Property",
        route: "/properties/add-sub",
      },
      {
        name: "View Properties",
        route: "/properties",
      },
    ],
  },
  {
    name: "Schedule",
    id: 3,
    icon: require("../../../public/svg/calendar_month.svg"),
    active_icon: require("../../../public/svg/calendar_month_fill.svg"),
    route: "/schedule"
  },
  {
    name: "Agents",
    id: 4,
    icon: require("../../../public/svg/agents.svg"),
    active_icon: require("../../../public/svg/agents_fill.svg"),
    route: "/agents"
  },
  // {
  //   name: "Transactions",
  //   id: 5,
  //   icon: require("../../../public/svg/receipt_long.svg"),
  //   active_icon: require("../../../public/svg/receipt_long_fill.svg"),
  //   route: "/transactions"
  // },
  {
    name: "Settings",
    id: 6,
    icon: require("../../../public/svg/h_work.svg"),
    active_icon: require("../../../public/svg/h_work.svg"),
    route: "/settings"
  },
];