import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const footerLinks = [
        {
            id: 1,
            name: 'Services',
            href: '/services',
        },
        {
            id: 2,
            name: 'Our Doctors',
            href: '/our-doctor',
        },
        {
            id: 3,
            name: 'Why Choose Us',
            href: '/features',
        },
        {
            id: 4,
            name: 'Staff Portal',
            href: '/patient/appointments/book',
        },
    ];

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 py-12 text-gray-400">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Heart
                            size={28}
                            className="text-indigo-400"
                        />

                        <Link
                            to="/"
                            className="text-2xl font-bold text-white"
                        >
                            Dental
                            <span className="text-indigo-400">Care</span>
                        </Link>
                    </div>

                    {/* Dynamic Footer Links */}
                    <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm">
                        {footerLinks.map((link) => (
                            <Link
                                key={link.id}
                                to={link.href}
                                className="transition hover:text-white"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Dynamic Copyright Year */}
                    <p className="text-center text-sm">
                        © {currentYear}{' '}
                        Dental<span className="text-indigo-400">Care.</span>
                        {' '}All rights reserved.
                    </p>

                </div>
            </div>
        </footer>
    );
};

export default Footer;