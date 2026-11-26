
import api from "../../config/api";

// Normalize appointment status
const normalizeStatus = (status) => {
    const value = String(status ?? "Pending").toLowerCase();

    const statuses = {
        pending: "Pending",
        confirmed: "Confirmed",
        completed: "Completed",
        cancelled: "Cancelled",
    };

    return statuses[value] ?? "Pending";
};

// Map API response
const mapAppointment = (item) => ({
    id: item.id ?? item.appointmentId,

    bookedDate:
        item.appointmentDate ??
        item.bookedDate ??
        item.date,

    appointmentDate:
        item.appointmentDate ??
        item.bookedDate ??
        item.date,

    serviceName:
        item.serviceName ??
        item.service?.name ??
        item.service?.serviceName ??
        "Dental Service",

    dentistName:
        item.dentistName ??
        item.dentist?.fullName ??
        "Not Assigned",

    dentistSpecialization:
        item.dentistSpecialization ??
        item.dentist?.specialization ??
        item.dentist?.qualification ??
        "",

    dentistQualification:
        item.dentistQualification ??
        item.dentist?.qualification ??
        "",

    experience:
        item.dentistExperience ??
        item.dentist?.experience ??
        "",

    bio:
        item.dentistBio ??
        item.dentist?.bio ??
        "",

    startTime: item.startTime ?? item.start_time ?? "",
    endTime: item.endTime ?? item.end_time ?? "",

    serviceDuration: Number(
        item.serviceDuration ??
        item.service?.duration ??
        item.service?.durationMinutes ??
        0
    ),

    servicePrice: Number(
        item.servicePrice ??
        item.service?.price ??
        item.price ??
        0
    ),

    notes: item.notes ?? item.reason ?? "",

    bookedOn: item.createdAt ?? item.created_at ?? "",

    status: normalizeStatus(item.status),

    // Preserve original API relationships
    service: item.service ?? {},
    dentist: item.dentist ?? {},
    treatmentRecord: item.treatment ?? null,
});

// Get logged-in patient's appointments
export const getPatientAppointments = async () => {
    try {
        const response = await api.get("/patient/appointments");
        const result = response.data;
        const appointments =
            result?.data?.data ??
            result?.data ??
            result;

        if (!Array.isArray(appointments)) {
            throw new Error("Invalid appointments response.");
        }

        return appointments.map(mapAppointment);

    } catch (error) {
        console.error(
            "Get Patient Appointments Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

// Get appointment details by ID
export const getById = async (id) => {
    try {
        if (!id || isNaN(Number(id))) {
            throw new Error("Invalid appointment ID.");
        }

        const response = await api.get(
            `/patient/appointments/${id}`
        );

        const result = response.data;
        const appointment =
            result?.data?.data ??
            result?.data ??
            result;

        if (!appointment || typeof appointment !== "object") {
            throw new Error("Invalid appointment response.");
        }

        return mapAppointment(appointment);

    } catch (error) {
        console.error(
            "Get Appointment Details Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

// Cancel patient appointment
export const cancelAppointment = async (appointmentId) => {
    try {
        if (!appointmentId || isNaN(Number(appointmentId))) {
            throw new Error("Invalid appointment ID.");
        }

        const response = await api.put(
            `/appointment/${Number(appointmentId)}/cancel`
        );
        return response.data;

    } catch (error) {
        console.error(
            "Cancel Appointment Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};
// Get patient's treatments
export const myTreatments = async () => {
    try {
        const response = await api.get("/patient/getTreatments");
        return response.data;
    } catch (error) {
        console.error(
            "Get My Treatments Error:",
            error.response?.data || error.message
        );
        throw error;
    }
};

