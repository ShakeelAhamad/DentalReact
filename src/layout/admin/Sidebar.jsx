import React from 'react'
import {
    Heart,
    X,
    Menu,
    UserRoundKey,
    UserPlus,
    UserShield,
    CircleUser,
    LogOut
} from 'lucide-react';
import { navigation } from "../../config/navigation";
import {dentistNavigation} from "../../config/dentistNavigation";
import { NavLink } from 'react-router-dom';

const Sidebar = ({ showSidebar, setShowSidebar }) => {
  const user = JSON.parse(localStorage.getItem("dentalcare_user") || "{}");
  const role = user.role;
   const menuItems =
        role === "Admin"
            ? navigation
            : role === "Dentist"
                ? dentistNavigation
                : [];
  return (
    <>
        <div 
          className={`fixed left-0 top-0 z-50 flex h-screen flex-col w-64 bg-sidebar-bg text-white transform transition-transform duration-300 ease-in-out ${showSidebar ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        >
          {/* Logo */}
          <div className="shrink-0 border-b border-text-secondary/10 px-6 py-5">
              <div className='flex items-center gap-2'>
                  <span className="text-indigo-400">
                      <Heart size={28} />
                  </span>
                <div>
                  <div className='text-xl font-bold'>
                    Dental
                    <span className="text-indigo-400">Care</span>
                  </div>
                  <div className='text-xs'>{role} Panel</div>
                </div>
                <button
                  className="ml-auto rounded-md p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer md:hidden"
                  onClick={() => setShowSidebar(false)}
                >
                    <X size={20} />
                </button>
              </div>
          </div>
          {/* Menu */}
          <div
            className="
            min-h-0 flex-1
            overflow-y-auto
            px-2 py-6
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-600
          "
          >
             {menuItems.map((group) => (
              <div  key={group.title} className='mb-6'>
                {/* Group title */}
                <p className='mb-3 px-4 text-xs font-light uppercase text-gray-500'>{group.title}</p>
                {/* Items */}
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setShowSidebar(false)}
                        className={({ isActive }) =>
                          `relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors duration-200 ${isActive
                            ? "bg-sidebar-active-light text-sidebar-text-active"
                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {/* Active indicator */}
                            {isActive && (
                              <div
                                className="
                                  absolute left-0 top-1/2
                                  h-8 w-1
                                  -translate-y-1/2
                                  rounded-r-full
                                  bg-indigo-500
                                "
                              />
                            )}

                            {/* Icon */}
                            <item.icon size={20} />

                            {/* Label */}
                            <span>{item.label}</span>
                          </>
                        )}
                      </NavLink>
                    ))}
                  </div>
              </div>
             ))}
          </div>
        </div>
    </>
  )
}

export default Sidebar