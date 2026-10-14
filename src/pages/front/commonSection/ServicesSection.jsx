import React from 'react';
import {
    Sparkles,
    Activity,
    Stethoscope,
    Shield,
    Heart,
    Siren,
} from 'lucide-react';

const ServicesSection = () => {
    // Dynamic services data
    const services = [
        {
            id: 1,
            title: 'Dental Cleaning',
            description:
                'Professional teeth cleaning to remove plaque and tartar, helping maintain healthy teeth and gums.',
            duration: 60,
            price: 80,
            icon: Sparkles,
            color: 'red',
        },
        {
            id: 2,
            title: 'Dental Examination',
            description:
                'Comprehensive dental examinations to assess oral health and identify potential problems early.',
            duration: 30,
            price: 50,
            icon: Activity,
            color: 'blue',
        },
        {
            id: 3,
            title: 'Dental Consultation',
            description:
                'Personalized consultations to discuss symptoms, treatment options, and your dental care plan.',
            duration: 30,
            price: 40,
            icon: Stethoscope,
            color: 'purple',
        },
        {
            id: 4,
            title: 'Tooth Extraction',
            description:
                'Professional tooth extraction when necessary, with a focus on comfort and appropriate aftercare.',
            duration: 45,
            price: 100,
            icon: Shield,
            color: 'green',
        },
        {
            id: 5,
            title: 'Dental Filling',
            description:
                'Restore teeth affected by cavities with suitable filling materials to help protect tooth structure.',
            duration: 45,
            price: 80,
            icon: Heart,
            color: 'yellow',
        },
        {
            id: 6,
            title: 'Root Canal Treatment',
            description:
                'Treatment to address infection or inflammation inside a tooth and help preserve the natural tooth.',
            duration: 90,
            price: 250,
            icon: Siren,
            color: 'pink',
        },
    ];

    // Full Tailwind classes so Tailwind can detect them
    const colorStyles = {
        red: 'bg-red-100 text-red-600 group-hover:bg-red-600',
        blue: 'bg-blue-100 text-blue-600 group-hover:bg-blue-600',
        purple: 'bg-purple-100 text-purple-600 group-hover:bg-purple-600',
        green: 'bg-green-100 text-green-600 group-hover:bg-green-600',
        yellow: 'bg-yellow-100 text-yellow-600 group-hover:bg-yellow-600',
        pink: 'bg-pink-100 text-pink-600 group-hover:bg-pink-600',
    };

    return (
        <section id="services" className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Section Heading */}
                <div className="mb-16 text-center">
                    <span className="inline-block cursor-pointer rounded-full bg-indigo-100 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-indigo-600 transition duration-300 hover:bg-indigo-600 hover:text-white">
                        Our Expertise
                    </span>

                    <h2 className="mt-4 mb-4 text-3xl font-bold text-gray-900">
                        Comprehensive Dental Services
                    </h2>

                    <p className="mx-auto max-w-2xl text-gray-500">
                        We offer a full spectrum of dental treatments using
                        modern medical equipment for patients of all ages.
                    </p>
                </div>

                {/* Dynamic Service Cards */}
                <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => {
                        const Icon = service.icon;

                        return (
                            <div
                                key={service.id}
                                className="group rounded-lg border border-[rgba(220,38,38,0.08)] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.10)] transition duration-300 hover:-translate-y-1.5 hover:border-[rgba(220,38,38,0.2)] hover:shadow-[0_16px_40px_rgba(220,38,38,0.12)]"
                            >
                                {/* Service Icon */}
                                <div
                                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300 group-hover:text-white ${colorStyles[service.color]}`}
                                >
                                    <Icon size={25} />
                                </div>

                                {/* Service Details */}
                                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                    {service.title}
                                </h3>

                                <p className="mb-6 text-sm leading-relaxed text-slate-500">
                                    {service.description}
                                </p>

                                {/* Duration and Price */}
                                <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-sm">
                                    <span className="text-xs text-gray-400">
                                        {service.duration} mins
                                    </span>

                                    <span className="font-bold text-gray-900">
                                        ${service.price.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;