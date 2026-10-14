import React, { useState } from 'react'
import { Heart, X, Menu, User, UserPlus, UserShield, CircleUser,LogOut } from 'lucide-react';
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
    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b px-4 sm:px-6 lg:px-10 py-4">
                {/* desktop navbar */}
                <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                        <span className='text-indigo-400 font-bold'>
                            <Heart size={28} /> 
                        </span>
                        <a href="/" className='text-2xl font-bold'>Dental<span className="text-indigo-400">Care</span></a>

                    </div>
                    <div className='hidden lg:flex items-center gap-8'>
                        {navLinks.map((link, index) => (
                            <a key={index} href={link.href} className='text-gray-700 hover:text-indigo-600 hover:border-b-2 hover:border-indigo-700 hover:border-b-indigo-700 hover:transition-colors transition-colors'>{link.name}</a>
                        ))}
                        <Button title={"Book Appointment"} px={4} py={2} />
                        <button className='cursor-pointer' onClick={() => setIsOpenProfile(!isOpenProfile)}>
                            <CircleUser size={26} />
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className='lg:hidden flex p-2 justify-between gap-3'>
                        <button className=' cursor-pointer' onClick={() => setIsOpenProfile(!isOpenProfile)}>
                            <CircleUser size={26} />
                        </button>
                        <button onClick={() => setIsOpen(!isOpen)}>
                            {
                                isOpen
                                    ?
                                    <>
                                        <X className='h-6 w-6' />
                                    </>
                                    :
                                    <>
                                        <Menu className='h-6 w-6' />
                                    </>
                            }
                        </button>
                    </div>

                </div>

                {/* mobile navbar */}
                {
                    isOpen && (
                        <div className='lg:hidden py-4 '>
                            <div className='flex flex-col gap-4'>
                                {navLinks.map((link, index) =>
                                    <a
                                        key={index}
                                        href={link.href}
                                        className='text-gray-700 font-medium'>
                                        {link.name} 
                                    </a>
                                )}
                                <Button title={"Book Appointment"} px={4} py={2} />
                            </div>
                        </div>
                    )
                }
            </nav>
            {/* Profile pop div */}
            {
                isOpenProfile && (
                <div className='absolute right-0 top-17 w-74 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50'>
                    {/* Menu Content */}
                    <div className='border-b border-gray-200 space-y-2 py-2'>
                        {/* profile */}
                        <button
                            onClick={() => { setIsOpenProfile(false); setIsOpen(false); }}
                            className="w-full flex items-center gap-4 px-3 py-1.5 rounded hover:bg-gray-50 cursor-pointer"
                        >
                            <User size={18} />
                            <span>Login</span>
                        </button>
                        <button
                            onClick={() => { setIsOpenProfile(false); setIsOpen(false);}}
                            className="w-full flex items-center gap-4 px-3 py-1.5 rounded hover:bg-gray-50 cursor-pointer"
                        >
                            <UserPlus size={18} />
                            <span>Sign Up</span>
                        </button>
                        <button
                            onClick={() => { setIsOpenProfile(false); setIsOpen(false); }}
                            className="w-full flex items-center gap-4 px-3 py-1.5 rounded hover:bg-gray-50 cursor-pointer"
                        >
                            <UserShield size={18} />
                            <span>Admin</span>
                        </button>
                    </div>
                    {/* logout buton */}
                    <div className="py-2">
                        <button
                            onClick={() => { setIsOpenProfile(false); setIsOpen(false);}}
                            className="w-full flex items-center gap-4 px-3 py-1.5 rounded hover:bg-rose-50 cursor-pointer">
                            <LogOut size={18} />
                            <span className="text-md text-text-primary font-light">Logout</span>
                        </button>
                    </div>
                </div>
            )
            }
        </>
    )
}

export default Navbar