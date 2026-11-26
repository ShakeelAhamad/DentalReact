
import api from "../config/api";

const signupService = {
  // Existing login methods...

  
registerPatient: async (payload) => {
//   const payload = new FormData();

//   payload.append("fullname", formData.fullName.trim());
//   payload.append("username", formData.username.trim());
//   payload.append("email", formData.email.trim());
//   payload.append("password", formData.password);
//   payload.append("role", "Patient");
//   payload.append("PhoneNumber", formData.phoneNumber);

//   if (formData.profileImage) {
//     payload.append("ProfileImageFile", formData.profileImage);
//   }

//   payload.append("DateOfBirth", formData.dateOfBirth);
//   payload.append("Gender", formData.gender);
//   payload.append("Address", formData.address);
//   payload.append("Status", formData.status === "active");
//   console.log("Payload before sending:", payload);
  const response = await api.post("/patient/create", payload);

  return response.data;
},

};

export default signupService;
