
import React, { useState } from 'react';
import {
    MapPin,
    Mail,
    Phone,
    Clock,
    Send,
    Heart,
} from 'lucide-react';
import HeroSection from '../../layout/front/HeroSection';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [submitted, setSubmitted] = useState(false);

    const officeDetails = [
        {
            id: 1,
            title: 'Our Office',
            detail: '123 Dental Street, Ahmedabad, Gujarat, India',
            icon: MapPin,
        },
        {
            id: 2,
            title: 'Email Us',
            detail: 'info@dentalcare.com',
            icon: Mail,
        },
        {
            id: 3,
            title: 'Call Us',
            detail: '+91 98765 43210',
            icon: Phone,
        },
        {
            id: 4,
            title: 'Opening Hours',
            detail: 'Mon - Sat: 9:00 AM - 7:00 PM',
            icon: Clock,
        },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setSubmitted(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Connect your API here to save/send the message.
        console.log('Contact form data:', formData);

        setSubmitted(true);
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
        });
    };

    return (
        <>
           <HeroSection pageTitle={"Contact Us"} title={"Contact"} />
           <section className="bg-indigo-50 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Section Heading */}
                <div className="mb-16 text-center">
                    <span  className="inline-block cursor-pointer rounded-full bg-indigo-100 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-indigo-600 transition duration-300 hover:bg-indigo-600 hover:text-white">
                        Get In Touch
                    </span>


                    <h1 className="mt-4 mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                        Contact Us
                    </h1>

                    <p className="mx-auto max-w-2xl text-gray-500">
                        Have a question or need a dental appointment?
                        Send us a message and our team will be happy to help.
                    </p>
                </div>

                {/* Contact Form + Office Details */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                    {/* Contact Form */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 lg:col-span-2">
                        <h2 className="mb-6 text-2xl font-bold text-gray-900">
                            Send Us a Message
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        Full Name
                                    </label>

                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        required
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        Email Address
                                    </label>

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        required
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="subject"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    Subject
                                </label>

                                <input
                                    id="subject"
                                    name="subject"
                                    type="text"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="Enter message subject"
                                    required
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="message"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    Message
                                </label>

                                <textarea
                                    id="message"
                                    name="message"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Write your message here..."
                                    required
                                    className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            <button
                                type="submit"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
                            >
                                <Send size={18} />
                                Send Message
                            </button>

                            {submitted && (
                                <p
                                    role="status"
                                    className="text-sm font-medium text-green-600"
                                >
                                    Form submitted locally. Connect your API to
                                    send and save the message.
                                </p>
                            )}
                        </form>
                    </div>

                    {/* Office Details */}
                    <div className="space-y-5">
                        <div className="rounded-2xl bg-indigo-950 p-6 text-white sm:p-8">
                            <Heart size={32} className="mb-4 text-indigo-400" />

                            <h2 className="mb-3 text-2xl font-bold">
                                Contact Information
                            </h2>

                            <p className="text-sm leading-relaxed text-indigo-100">
                                Contact our friendly team for appointments,
                                questions, or information about our dental
                                services.
                            </p>
                        </div>

                        {officeDetails.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.id}
                                    className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
                                >
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                                        <Icon size={23} />
                                    </div>

                                    <div>
                                        <h3 className="mb-1 font-bold text-gray-900">
                                            {item.title}
                                        </h3>

                                        <p className="break-words text-sm leading-relaxed text-gray-500">
                                            {item.detail}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Google Map */}
                <div className="mt-10 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-900">
                            Find Our Clinic
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Visit us at our dental clinic.
                        </p>
                    </div>

                    <iframe
                        title="DentalCare clinic location"
                        src="https://maps.google.com/maps?q=Ahmedabad%2C%20Gujarat%2C%20India&t=&z=13&ie=UTF8&iwloc=&output=embed"
                        width="100%"
                        height="380"
                        style={{ border: 0 }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                    />
                </div>
            </div>
        </section>
        </>
        
    );
};

export default ContactUs;
