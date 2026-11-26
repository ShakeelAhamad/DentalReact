
import React, { useEffect, useState } from "react";
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
import homeService from "../../services/homeService";

const Appointment = () => {
  usePageTitle("Book Appointment");
  const [dentists, setDentists] = useState([]);
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const [formData, setFormData] = useState({
    dentist_id: "",
    service_id: "",
    appointment_date: new Date().toISOString().split("T")[0],
    start_time: "",
    reason: "",
  }); 

  useEffect(() => {
      const fetchHomeData = async () => {
          try {
            setLoading(true);
            setError("");
            const data = await homeService.getHomeData();
            setDentists(data.dentists || []);
            setServices(data.services || []);
          } catch (error) {
              setError(error.message || "Unable to load data.");
          } finally {
              setLoading(false);
          }
      };

      fetchHomeData();
  }, []);
  useEffect(() => {
    // Wait until all three fields are selected
    if (
        !formData.dentist_id ||
        !formData.service_id ||
        !formData.appointment_date
    ) {
        setTimeSlots([]);
        setSlotsError("");
        return;
    }

    let isActive = true;

    const fetchAvailableSlots = async () => {
        try {
            setSlotsLoading(true);
            setSlotsError("");
            setTimeSlots([]);

            const payload = {
                dentistId: Number(formData.dentist_id),
                ServiceId: Number(formData.service_id),
                date: formData.appointment_date,
            };

            const response = await homeService.getTimeSlots(payload);

            if (!isActive) return;

            if (!response?.success) {
                throw new Error(
                    response?.message || "Unable to load available slots."
                );
            }

            // Assumes the API returns the slots in response.data
            setTimeSlots(response.data?.slots || []);
            setSlotsError(
                response.data?.slots?.length === 0 ? response.data?.message : "");
        } catch (error) {
            if (!isActive) return;

            setTimeSlots([]);
            setSlotsError(
                error.response?.data?.message ||
                error.message ||
                "Failed to load available time slots."
            );
        } finally {
            if (isActive) {
                setSlotsLoading(false);
            }
        }
    };

    fetchAvailableSlots();

    return () => {
        isActive = false;
    };
}, [
    formData.dentist_id,
    formData.service_id,
    formData.appointment_date,
]);

  const selectedService = services.find(
    (service) => service.id === Number(formData.service_id)
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "dentist_id" ||
        name === "service_id" ||
        name === "appointment_date"
            ? { start_time: "" }
            : {}),
    }));
};

  const handleSubmit = async (e) => {
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
    const payload = {
        DentistId: Number(formData.dentist_id),
        ServiceId: Number(formData.service_id),
        AppointmentDate: formData.appointment_date,
        StartTime: formData.start_time,
        Reason: formData.reason.trim(),
        Status: "Pending", // Default status for new appointments
    };

      try {
        setSubmitting(true);
        setSubmitError("");
        setSubmitSuccess("");

        const response = await homeService.createAppointment(payload);

        if (!response?.success) {
            throw new Error(
                response?.message || "Failed to book appointment."
            );
        }

        setSubmitSuccess(
            response.message || "Appointment booked successfully!"
        );

        // Reset form after successful booking
        setFormData({
            dentist_id: "",
            service_id: "",
            appointment_date: new Date().toLocaleDateString("en-CA"),
            start_time: "",
            reason: "",
        });

        setTimeSlots([]);

    } catch (error) {
        console.error("Appointment Booking Error:", error);

        setSubmitError(
            error.response?.data?.message ||
            error.message ||
            "Something went wrong. Please try again."
        );
    } finally {
        setSubmitting(false);
    }
    

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
                      {dentist.fullName} - {dentist.specialization} (
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

                  {!formData.dentist_id ||
                  !formData.service_id ||
                  !formData.appointment_date ? (
                      <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                          Please select dentist, service, and preferred date.
                      </p>
                  ) : slotsLoading ? (
                      <div className="flex items-center justify-center gap-3 rounded-xl bg-indigo-50 p-6">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                          <span className="text-sm font-medium text-indigo-700">
                              Loading available time slots...
                          </span>
                      </div>
                  ) : slotsError ? (
                      <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
                          {slotsError}
                      </p>
                  ) : timeSlots.length === 0 ? (
                      <p className="rounded-xl bg-yellow-50 p-4 text-sm text-yellow-700">
                          No available time slots for this date.
                      </p>
                  ) : (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {timeSlots.map((slot) => {
                              const isSelected =
                                  formData.start_time === slot.time;

                              return (
                                  <button
                                      key={slot.time}
                                      type="button"
                                      onClick={() =>
                                          setFormData((prev) => ({
                                              ...prev,
                                              start_time: slot.time,
                                          }))
                                      }
                                      aria-pressed={isSelected}
                                      className={`rounded-xl border px-3 py-3 text-xs font-semibold transition ${
                                          isSelected
                                              ? "border-indigo-600 bg-indigo-600 text-white shadow-md"
                                              : "border-gray-200 bg-white text-gray-700 hover:border-indigo-500 hover:bg-indigo-50"
                                      }`}
                                  >
                                      {slot.label}
                                  </button>
                              );
                          })}
                      </div>
                  )}

                  {!slotsLoading &&
                      !slotsError &&
                      timeSlots.length > 0 &&
                      !formData.start_time && (
                          <p className="mt-2 text-xs text-gray-500">
                              Please select an available time slot.
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
                
                {submitSuccess && (
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                        <div className="flex items-center gap-2">
                            <CheckCircle size={18} />
                            <span>{submitSuccess}</span>
                        </div>
                    </div>
                )}

                {submitError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                        {submitError}
                    </div>
                )}
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="text-sm font-medium text-gray-500 transition hover:text-gray-800"
                >
                  Cancel
                </button>

                <button
                    type="submit"
                    disabled={!formData.start_time || submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-8"
                >
                    {submitting ? (
                        <>
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Booking Appointment...
                        </>
                    ) : (
                        <>
                            <CheckCircle size={18} />
                            Confirm & Book Appointment
                        </>
                    )}
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
