import React, { useState } from 'react';
import { NavLink,Link} from 'react-router-dom';
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

import Button from '../../components/ui/Button';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenProfile, setIsOpenProfile] = useState(false);

    const navLinks = [
        { name: 'Services', href: '/services' },
        { name: 'Our Doctors', href: '/our-doctor' },
        { name: 'Why Choose Us', href: '/features' },
        { name: 'Contact', href: '/contact' }
    ];

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

    const closeMenus = () => {
        setIsOpen(false);
        setIsOpenProfile(false);
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
                        />

                        <button
                            type="button"
                            aria-label="Open profile menu"
                            onClick={() =>
                                setIsOpenProfile(!isOpenProfile)
                            }
                            className="cursor-pointer transition-colors hover:text-indigo-600"
                        >
                            <CircleUser size={26} />
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
                            <CircleUser size={26} />
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
                            />
                        </div>
                    </div>
                )}
            </nav>

            {/* Profile Dropdown */}
            {isOpenProfile && (
                <div className="fixed right-4 top-20 z-[60] w-72 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl">

                    <div className="space-y-2 border-b border-gray-200 py-2">
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

                        <Link
                            to="/login"
                            onClick={closeMenus}
                            className="flex w-full cursor-pointer items-center gap-4 rounded px-3 py-2 hover:bg-gray-50"
                        >
                            <UserShield size={18} />
                            <span>Admin</span>
                        </Link>
                    </div>

                    <div className="py-2">
                        <button
                            onClick={closeMenus}
                            className="flex w-full cursor-pointer items-center gap-4 rounded px-3 py-2 hover:bg-rose-50"
                        >
                            <LogOut size={18} />
                            <span className="font-light text-gray-700">
                                Logout
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;