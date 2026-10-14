
import React, { useState } from "react";
import {
  CalendarDays,
  Clock,
  UserRound,
  Stethoscope,
  FileText,
  CheckCircle,
} from "lucide-react";
import HeroSection from "../../layout/front/HeroSection";
import usePageTitle from "../../hooks/usePageTitle";

const Appointment = () => {
  usePageTitle("Appointment");
  const [formData, setFormData] = useState({
    dentist_id: "",
    service_id: "",
    appointment_date: new Date().toISOString().split("T")[0],
    start_time: "",
    reason: "",
  });

  const dentists = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialization: "General Dentistry",
      experience: 10,
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialization: "Orthodontics",
      experience: 15,
    },
  ];

  const services = [
    { id: 1, name: "Dental Cleaning", duration: 60, price: 80 },
    { id: 2, name: "Dental Examination", duration: 45, price: 60 },
    { id: 3, name: "Teeth Whitening", duration: 90, price: 250 },
    { id: 4, name: "Tooth Extraction", duration: 60, price: 150 },
    { id: 5, name: "Dental Filling", duration: 60, price: 120 },
    { id: 6, name: "Root Canal Treatment", duration: 90, price: 500 },
    { id: 7, name: "Dental Crown", duration: 90, price: 800 },
    { id: 8, name: "Orthodontic Consultation", duration: 60, price: 100 },
    { id: 9, name: "Dental Implant Consultation", duration: 60, price: 150 },
    { id: 10, name: "X-Ray", duration: 30, price: 50 },
  ];

  const timeSlots = [
    { start: "12:30", label: "12:30 PM - 1:15 PM" },
    { start: "13:00", label: "1:00 PM - 1:45 PM" },
    { start: "13:30", label: "1:30 PM - 2:15 PM" },
    { start: "14:00", label: "2:00 PM - 2:45 PM" },
    { start: "14:30", label: "2:30 PM - 3:15 PM" },
    { start: "15:00", label: "3:00 PM - 3:45 PM" },
    { start: "15:30", label: "3:30 PM - 4:15 PM" },
    { start: "16:00", label: "4:00 PM - 4:45 PM" },
  ];

  const selectedService = services.find(
    (service) => service.id === Number(formData.service_id)
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "dentist_id" || name === "service_id"
        ? { start_time: "" }
        : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.start_time) {
      alert("Please select an available time slot.");
      return;
    }

    // Connect your appointment API here.
    console.log("Appointment Data:", {
      ...formData,
      dentist_id: Number(formData.dentist_id),
      service_id: Number(formData.service_id),
    });

    alert("Form validated! Connect your API to book the appointment.");
  };

  return (
    <>
      <HeroSection pageTitle={"Appointment"} title={"Appointment"} />
      <section className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Page heading */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Book a Dental Appointment
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Select your dentist, dental procedure, and choose a convenient
              available time slot.
            </p>
          </div>

          {/* Appointment form */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dentist */}
              <div>
                <label
                  htmlFor="dentist_id"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800"
                >
                  <UserRound size={17} className="text-indigo-600" />
                  1. Select Dentist *
                </label>

                <select
                  id="dentist_id"
                  name="dentist_id"
                  value={formData.dentist_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">-- Choose a Dentist --</option>
                  {dentists.map((dentist) => (
                    <option key={dentist.id} value={dentist.id}>
                      {dentist.name} - {dentist.specialization} (
                      {dentist.experience} yrs exp)
                    </option>
                  ))}
                </select>
              </div>

              {/* Dental service */}
              <div>
                <label
                  htmlFor="service_id"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800"
                >
                  <Stethoscope size={17} className="text-indigo-600" />
                  2. Select Dental Service *
                </label>

                <select
                  id="service_id"
                  name="service_id"
                  value={formData.service_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">-- Choose a Service --</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} ({service.duration} mins) - $
                      {service.price.toFixed(2)}
                    </option>
                  ))}
                </select>

                {selectedService && (
                  <div className="mt-3 flex flex-wrap gap-4 rounded-xl bg-indigo-50 p-3 text-sm text-indigo-800">
                    <span className="flex items-center gap-2">
                      <Clock size={16} />
                      {selectedService.duration} minutes
                    </span>
                    <span className="font-semibold">
                      ${selectedService.price.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Appointment date */}
              <div>
                <label
                  htmlFor="appointment_date"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800"
                >
                  <CalendarDays size={17} className="text-indigo-600" />
                  3. Preferred Date *
                </label>

                <input
                  type="date"
                  id="appointment_date"
                  name="appointment_date"
                  min={new Date().toLocaleDateString("en-CA")}
                  value={formData.appointment_date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Available time slots */}
              <div>
                <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <Clock size={17} className="text-indigo-600" />
                  4. Available Time Slots *
                </label>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {timeSlots.map((slot) => {
                    const isSelected = formData.start_time === slot.start;

                    return (
                      <button
                        key={slot.start}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            start_time: slot.start,
                          }))
                        }
                        aria-pressed={isSelected}
                        className={`rounded-xl border px-3 py-3 text-xs font-semibold transition duration-200 sm:px-4 ${isSelected
                            ? "border-indigo-600 bg-indigo-600 text-white shadow-md"
                            : "border-gray-200 bg-white text-gray-700 hover:border-indigo-500 hover:bg-indigo-50"
                          }`}
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>

                {!formData.start_time && (
                  <p className="mt-2 text-xs text-gray-500">
                    Please select a time slot to continue.
                  </p>
                )}
              </div>

              {/* Reason / symptoms */}
              <div>
                <label
                  htmlFor="reason"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800"
                >
                  <FileText size={17} className="text-indigo-600" />
                  5. Reason / Symptoms (Optional)
                </label>

                <textarea
                  id="reason"
                  name="reason"
                  rows={3}
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Briefly describe your symptoms or reason for visit (e.g., toothache, routine cleaning)..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Footer buttons */}
              <div className="flex flex-col-reverse items-center justify-between gap-4 border-t border-gray-100 pt-5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="text-sm font-medium text-gray-500 transition hover:text-gray-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!formData.start_time}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-8"
                >
                  <CheckCircle size={18} />
                  Confirm &amp; Book Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>

  );
};

export default Appointment;
