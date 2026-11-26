import { LayoutDashboard, FileClock, Settings, ShoppingCart, User, Users,CircleUser,Clock,HourglassCog,UserShield,CalendarCheck } from "lucide-react";

export const dentistNavigation = [
  {
    title: "Main Menu",
    items: [
      {
        label: "Dashboard",
        path: "/dentist/dashboard",
        icon: LayoutDashboard
      },
    ]
  },
  {
    title : "Clinical",
    items : [
        {
            label: "My Appointments",
            path : "/dentist/appointments",
            icon : CalendarCheck
        },
        {
            label: "Treatment Records",
            path : "/dentist/treatments",
            icon : FileClock  
        },
        {
            label: "Working Hours",
            path : "/dentist/schedule",
            icon : Clock
        },
    ]
  },
  {
    title: "Account",
    items: [
      {
        label: "Profile",
        path: "/dentist/profile",
        icon: User
      },
    ]
  }
]


export const pageTitles = {
  "dentist/dashboard": "Dashboard",
}
