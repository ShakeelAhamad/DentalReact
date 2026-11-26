import { LayoutDashboard, Package, Settings, ShoppingCart, User, Users,CircleUser,UserGroup,HourglassCog,UserShield,CalendarCheck } from "lucide-react";

export const navigation = [
  {
    title: "Main Menu",
    items: [
      {
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: LayoutDashboard
      },
    ]
  },
  {
    title : "Management",
    items : [
        {
            label: "Appointments",
            path : "/admin/appointments",
            icon : CalendarCheck
        },
        {
            label: "Dentists",
            path : "/admin/dentists",
            icon : CircleUser  
        },
        {
            label: "Patients",
            path : "/admin/patients",
            icon : UserGroup
        },
        {
            label: "Services",
            path : "/admin/services",
            icon : HourglassCog
        },
    ]
  },
  {
    title: "Account",
    items: [
      {
        label: "Profile",
        path: "/admin/profile",
        icon: User
      },
    ]
  }
]


export const pageTitles = {
  "admin/dashboard": "Dashboard",
}
