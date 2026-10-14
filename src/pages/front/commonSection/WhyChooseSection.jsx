import React from 'react';
import { Clock, ShieldCheck, FilePlus2 } from 'lucide-react';

const WhyChooseSection = () => {
    const features = [
        {
            id: 1,
            title: 'Real-Time Slot Booking',
            description:
                'Choose your preferred doctor, procedure, and select from real-time available time slots 24/7.',
            icon: Clock,
            color: 'blue',
        },
        {
            id: 2,
            title: 'Experienced Dentists',
            description:
                'Certified specialists in orthodontics, cosmetic whitening, endodontics, and preventive dentistry.',
            icon: ShieldCheck,
            color: 'green',
        },
        {
            id: 3,
            title: 'Digital Medical Records',
            description:
                'Access your diagnostic notes, clinical procedures, prescriptions, and past visit history at any time.',
            icon: FilePlus2,
            color: 'indigo',
        },
    ];

    const colorStyles = {
        blue: {
            icon: 'bg-blue-600 group-hover:bg-blue-100 group-hover:text-blue-600',
        },
        green: {
            icon: 'bg-green-600 group-hover:bg-green-100 group-hover:text-green-600',
        },
        indigo: {
            icon: 'bg-indigo-600 group-hover:bg-indigo-100 group-hover:text-indigo-600',
        },
    };

    return (
        <section id="features" className="bg-indigo-50 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Section Heading */}
                <div className="mb-16 text-center">
                    <span className="inline-block cursor-pointer rounded-full bg-indigo-100 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-indigo-600 transition duration-300 hover:bg-indigo-600 hover:text-white">
                        Clinic Highlights
                    </span>

                    <h2 className="mt-4 mb-4 text-3xl font-bold text-gray-900">
                        Why Choose DentalCare?
                    </h2>
                </div>

                {/* Dynamic Feature Cards */}
                <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.id}
                                className="group rounded-2xl border border-blue-100/50 bg-white p-8 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-lg"
                            >
                                {/* Icon */}
                                <div
                                    className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-md transition duration-300 ${colorStyles[feature.color].icon
                                        }`}
                                >
                                    <Icon size={30} />
                                </div>

                                {/* Card Content */}
                                <h3 className="mb-2 text-lg font-bold text-gray-900">
                                    {feature.title}
                                </h3>

                                <p className="text-sm leading-relaxed text-gray-500">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseSection;