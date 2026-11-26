import React, { useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { NavLink,Link} from 'react-router-dom';
import {
    Heart,
    X,
    Menu,
    UserRoundKey,
    UserPlus,
    UserShield,
    CircleUser,
    LayoutDashboard,
    LogOut
} from 'lucide-react';

import Button from '../../components/ui/Button';
import { logoutUser } from '../../services/authService';
import { useNavigate } from "react-router-dom";



const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenProfile, setIsOpenProfile] = useState(false);
    const user = JSON.parse(localStorage.getItem("dentalcare_user") || null);
    let role = user?.role;
    role     = user?.role?.toLowerCase();
      // Profile image
    const profileImage = user?.profile || null;
    // Get first two characters
    const initials = (user?.name || "AU")
        .trim()
        .slice(0, 2)
        .toUpperCase();
    const handleLogout = async () => {
        setIsOpen(false);
        setIsOpenProfile(false);
        await logoutUser();
        navigate("/login", { replace: true });
    };

    let  navLinks = [
        { name: 'Services', href: '/services' },
        { name: 'Our Doctors', href: '/our-doctor' },
        { name: 'Why Choose Us', href: '/features' },
        { name: 'Contact', href: '/contact' }
    ];
    let profileMenu = [
        { label: 'Login', icon: UserRoundKey, url: '/login', type: "link"},
        { label: 'Sign Up', icon: UserPlus, url: '/signup', type: "link" }
    ];
    if (user) {
        if (role == "patient") {
            navLinks = [
                { name: 'Dashboard', href: '/patient/dashboard' },
                { name: 'My Appointments', href: '/patient/appointments' },
                { name: 'Book Appointment', href: '/patient/book/appointments' }
            ];
            profileMenu = [
                { label: 'My Dashboard', icon: UserPlus, url: '/patient/dashboard', type: "link" },
                { label: 'My Appointments', icon: UserShield, url: '/patient/appointments', type: "link"},
                { label: 'Book Appointment', icon: LayoutDashboard, url: '/patient/book/appointments', type: "link" },
                { label: 'Logout', icon: LogOut, url: null, action: handleLogout, type: "action" },
            ];
        }
    }
    
    // Active and hover classes
    const getLinkClass = ({ isActive }) =>
        `relative py-2 font-medium transition-colors duration-300
        after:absolute after:bottom-0 after:left-0 after:h-0.5
        after:bg-indigo-600 after:transition-all after:duration-300
        ${
            isActive
                ? 'text-indigo-600 after:w-full'
                : 'text-gray-700 after:w-0 hover:text-indigo-600 hover:after:w-full'
        }`;
    const navigate = useNavigate();
    const closeMenus = async () => {
        setIsOpen(false);
        setIsOpenProfile(false);
    };
    const handleBookAppointment = () => {
        navigate("/patient/book/appointments");
    };
    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-white px-4 py-4 sm:px-6 lg:px-10">
                <div className="flex items-center justify-between">

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <span className="text-indigo-400">
                            <Heart size={28} />
                        </span>

                        <NavLink
                            to="/"
                            end
                            onClick={closeMenus}
                            className="text-2xl font-bold text-gray-900"
                        >
                            Dental
                            <span className="text-indigo-400">Care</span>
                        </NavLink>
                    </div>

                    {/* Desktop Navbar */}
                    <div className="hidden items-center gap-8 lg:flex">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.href}
                                to={link.href}
                                className={getLinkClass}
                            >
                                {link.name}
                            </NavLink>
                        ))}

                        <Button
                            title="Book Appointment"
                            px={4}
                            py={2}
                            onClicks={handleBookAppointment}
                        />

                        <button
                            type="button"
                            aria-label="Open profile menu"
                            onClick={() =>
                                setIsOpenProfile(!isOpenProfile)
                            }
                            className="cursor-pointer transition-colors hover:text-indigo-600"
                        >
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="h-9 w-9 rounded-full border-2 border-indigo-500 object-cover"
                                />
                            ) : (
                                <CircleUser size={26} />
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu Buttons */}
                    <div className="flex items-center gap-3 lg:hidden">
                        <button
                            type="button"
                            aria-label="Open profile menu"
                            onClick={() =>
                                setIsOpenProfile(!isOpenProfile)
                            }
                            className="cursor-pointer hover:text-indigo-600"
                        >
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="h-9 w-9 rounded-full border-2 border-indigo-500 object-cover"
                                />
                            ) : (
                                <CircleUser size={26} />
                            )}
                        </button>
                        

                        <button
                            type="button"
                            aria-label="Toggle navigation"
                            onClick={() => setIsOpen(!isOpen)}
                            className="cursor-pointer"
                        >
                            {isOpen
                                ? <X size={24} />
                                : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navbar */}
                {isOpen && (
                    <div className="py-4 lg:hidden">
                        <div className="flex flex-col items-start gap-4">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.href}
                                    to={link.href}
                                    className={getLinkClass}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </NavLink>
                            ))}

                            <Button
                                title="Book Appointment"
                                px={4}
                                py={2}
                                onClick={handleBookAppointment}
                            />
                        </div>
                    </div>
                )}
            </nav>

            {/* Profile Dropdown */}
            {isOpenProfile && (
                <div className="fixed right-4 top-20 z-[60] w-72 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                    <div className="space-y-2 py-2">
                        {/* {!user ? (
                            <>
                                <Link 
                                    to="/login"
                                    onClick={closeMenus}
                                    className="flex w-full cursor-pointer items-center gap-4 rounded px-3 py-2 hover:bg-gray-50"
                                >
                                    <UserRoundKey size={18} />
                                    <span>Login</span>
                                </Link >
                                <Link
                                    to="/signup"
                                    onClick={closeMenus}
                                    className="flex w-full cursor-pointer items-center gap-4 rounded px-3 py-2 hover:bg-gray-50"
                                >
                                    <UserPlus size={18} />
                                    <span>Sign Up</span>
                                </Link>
                            </>
                        ) : (
                            <>
                            {role === "patient" && (
                                <>
                                    <Link
                                        to="/patient/dashboard"
                                        onClick={closeMenus}
                                        className="flex w-full cursor-pointer items-center gap-4 rounded px-3 py-2 hover:bg-gray-50"
                                    >
                                        <LayoutDashboard size={18} />
                                        <span>My Dashboard</span>
                                    </Link>
                                    <button
                                        onClick={closeMenus}
                                        className="flex w-full cursor-pointer items-center gap-4 rounded px-3 py-2 hover:bg-rose-50"
                                    >
                                        <LogOut size={18} />
                                        <span className="font-light text-gray-700">
                                            Logout
                                        </span>
                                    </button>
                                </>
                            )}
                            </>
                        )} */}
                        {profileMenu.map((item, index) => {
                            const Icon = item.icon;
                            const commonClass = `
                                flex w-full cursor-pointer items-center gap-4
                                rounded px-3 py-2
                                ${item.label === "Logout"
                                    ? "hover:bg-rose-50"
                                    : "hover:bg-gray-50"}
                            `;

                            return item.type === "action" ? (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={item.action}
                                    className={commonClass}
                                >
                                    <Icon size={18} />

                                    <span className="font-light text-gray-700">
                                        {item.label}
                                    </span>
                                </button>
                            ) : (
                                <Link
                                    key={item.url}
                                    to={item.url}
                                    onClick={closeMenus}
                                    className={commonClass}
                                >
                                    <Icon size={18} />

                                    <span className="font-light text-gray-700">
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;