import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import homeService from "../../../services/homeService";

import toast from "react-hot-toast";

const getServiceIcon = (name) => {
    return serviceIcons[name?.toLowerCase()] || Stethoscope;
};

const getInitials = (name) => {
    return name
        ?.split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase() || "DR";
};

const DoctorsSection = ({onBookAppointment}) => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await homeService.getHomeData();
                setDoctors(data.dentists.filter(item => item.status));
            } catch (err) {
                console.error("Home API Error:", err);
                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Unable to load home data."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    // Dynamic doctors data
    // const doctors = [
    //     {
    //         id: 1,
    //         name: 'Dr. Sarah Johnson',
    //         specialization: 'General Dentistry',
    //         qualification: 'DDS, University of Michigan',
    //         experience: 10,
    //         status: 'Available',
    //         description:
    //             'Dr. Sarah Johnson is a highly experienced general dentist specializing in preventive and restorative dentistry.',
    //         color: 'emerald',
    //         initial: 'S',
    //     },
    //     {
    //         id: 2,
    //         name: 'Dr. Michael Chen',
    //         specialization: 'Orthodontics',
    //         qualification: 'DMD, Harvard School of Dental Medicine',
    //         experience: 15,
    //         status: 'Available',
    //         description:
    //             'Dr. Michael Chen is an orthodontic specialist transforming smiles with braces and clear aligners.',
    //         color: 'purple',
    //         initial: 'M',
    //     },
    //     {
    //         id: 3,
    //         name: 'Dr. Emily Williams',
    //         specialization: 'Cosmetic Dentistry',
    //         qualification: 'DDS, University of California',
    //         experience: 8,
    //         status: 'Available',
    //         description:
    //             'Dr. Emily Williams specializes in cosmetic dental treatments, smile makeovers, and restorative oral care.',
    //         color: 'yellow',
    //         initial: 'E',
    //     },
    // ];

    // Static Tailwind classes for reliable CSS generation
    const colorStyles = [
        "bg-indigo-50 text-indigo-600",
        "bg-teal-50 text-teal-600",
        "bg-purple-50 text-purple-600",
        "bg-rose-50 text-rose-600",
        "bg-amber-50 text-amber-600",
        "bg-cyan-50 text-cyan-600",
    ];

    // const handleBookAppointment = (doctor) => {
    //     // Update this route to match your booking page
    //     navigate(`/book-appointment?doctorId=${doctor.id}`);
    // };

    return (
        <section id="doctors" className="bg-emerald-50 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Section Heading */}
                <div className="mb-16 text-center">
                    <span className="inline-block cursor-pointer rounded-full bg-indigo-100 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-indigo-600 transition duration-300 hover:bg-indigo-600 hover:text-white">
                        Specialist Practitioners
                    </span>

                    <h2 className="mt-4 mb-4 text-3xl font-bold text-gray-900">
                        Meet Our Dental Doctors
                    </h2>

                    <p className="mx-auto max-w-2xl text-gray-500">
                        Our qualified dentists bring decades of collective
                        clinical experience in general dentistry, orthodontics,
                        and restorative oral care.
                    </p>
                </div>

                {/* Dynamic Doctors Cards */}
                {/* Dynamic Doctors Cards */}
                <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">

                    {doctors.map((doctor, index) => {
                        const color = colorStyles[index % colorStyles.length];

                        const isAvailable = doctor.status === true;

                        return (
                            <div
                                key={doctor.id}
                                className="group flex flex-col justify-between rounded-2xl border border-gray-200/70 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-emerald-200 hover:shadow-[0_16px_40px_rgba(220,38,38,0.12)]"
                            >
                                <div>
                                    {/* Doctor Information */}
                                    <div className="mb-5 flex items-center gap-4">

                                        <div
                                            className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl text-2xl font-bold transition duration-300 group-hover:text-indigo-600 ${color}`}
                                        >
                                            {doctor.profileImage ? (
                                                <img
                                                    src={doctor.profileImage}
                                                    alt={doctor.fullName}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                getInitials(doctor.fullName)
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {doctor.fullName}
                                            </h3>

                                            <p className="text-xs font-medium text-teal-600">
                                                {doctor.specialization || "General Dentistry"}
                                            </p>

                                            <p className="mt-0.5 text-xs text-gray-400">
                                                {doctor.qualification || "Qualification N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Experience and Availability */}
                                    <div className="mb-4 flex flex-wrap items-center gap-2">

                                        <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
                                            {doctor.experience || 0}+ Years Experience
                                        </span>

                                        <span
                                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isAvailable
                                                    ? "bg-green-50 text-green-700"
                                                    : "bg-red-50 text-red-700"
                                                }`}
                                        >
                                            {isAvailable ? "Available" : "Unavailable"}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="mb-6 text-sm leading-relaxed text-gray-600">
                                        {doctor.bio || doctor.description || "Experienced dental professional providing quality dental care."}
                                    </p>
                                </div>

                                {/* Booking Button */}
                                <div className="border-t border-gray-100 pt-4">
                                    <button
                                        type="button"
                                       onClick={onBookAppointment}
                                        disabled={!isAvailable}
                                        className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer"
                                    >
                                        Book with {doctor.fullName}
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {!loading && doctors.length === 0 && (
                        <p className="col-span-full py-8 text-center text-gray-500">
                            No dentists available.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default DoctorsSection;