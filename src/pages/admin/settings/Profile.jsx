
import React, { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  GraduationCap,
  BriefcasePlus,
  CalendarDays,
  UserRound,
  ShieldCheck,
  Info,
  BriefcaseBusiness,
  ExternalLink,
  Gem,
} from "lucide-react";
import { userProfile } from "../../../services/authService";
import toast from "react-hot-toast";

function Profile() {
  const [profileData,setProfileData] = useState(null);
  const [patientDetails,setPatientDetails] = useState(null);
  const [dentistDetails,setDentistDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async() => {
      try{
        const response = await userProfile();
        setProfileData(response.data);
        setPatientDetails(response.data?.patient);
        setDentistDetails(response.data?.dentist);
      }catch(error){
        setLoading(false);
        toast.error(error.message || "Failed to update password.");
      }finally{

        setLoading(false);
      }
    }
    getProfile();
  },[]);

 

  const details = [
    {
      label: "Qualification",
      value: dentistDetails?.qualification,
      icon: GraduationCap,
    },
    {
      label: "Specialization",
      value: dentistDetails?.specialization,
      icon: Gem,
    },
    {
      label: "Experience",
      value: dentistDetails?.experience + ' Years Experience',
      icon: BriefcasePlus,
    },
    {
      label: "Email",
      value: profileData?.email,
      icon: Mail,
    },
  ];

  if (loading) {
    return (
        <div className="flex justify-center items-center min-h-60">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
    );
}

if (!profileData) {
    return (
        <div className="text-center py-10 text-gray-500">
            Profile information not available.
        </div>
    );
}
  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <UserRound size={28} className="text-primary" />
          <h1 className="text-2xl font-semibold text-text-primary">
            Profile
          </h1>
        </div>

        <p className="text-sm text-gray-400">
          Dashboard / <span className="text-primary">Profile</span>
        </p>
      </div>

      {/* Profile Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        

        {/* Left Profile Card */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">

          <div className="flex flex-col items-center text-center">

            {/* Profile Image */}
            <div className="w-32 h-32 bg-primary-dark/80 rounded-full flex items-center justify-center text-white shrink-0 border-2 border-indigo-500" >
                  {profileData && profileData?.profileImage!="" ? (
                      <img
                          src={profileData?.profileImage}
                          className="w-full h-full rounded-full object-cover"
                      />
                  ) : (
                      <span className="text-lg font-semibold">
                        {profileData?.username?.substring(0, 2).toUpperCase() || "AD"}
                      </span>
                  )}
              </div>

            <h2 className="text-xl font-semibold text-text-primary mt-4">
             {dentistDetails?.fullName ? (
                dentistDetails.fullName
              ) : (
                  profileData?.username
              )}
            </h2>

            <span className={`mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${profileData?.status == true ? "bg-blue-50 text-primary" : "bg-red-50 text-red"} `}>
              <ShieldCheck size={16} />
              {profileData?.role}
            </span>

            <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
              <CalendarDays size={16} />
              Joined {profileData?.joinedDate}
            </div>
          </div>

          <div className="border-t border-gray-200 my-6" />

          {/* Contact Information */}
          <div className="space-y-4">

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
                <Mail size={17} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400">Email Address</p>
                <p className="text-sm text-text-primary break-all">
                  {profileData?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
                <Phone size={17} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Phone Number</p>
                <p className="text-sm text-text-primary">
                  {profileData?.phoneNumber}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 space-y-6">

          {/* About Section */}
          {dentistDetails && dentistDetails?.bio && (
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
                <Info size={20} />
              </div>

              <h3 className="text-lg font-semibold text-text-primary">
                About
              </h3>
            </div>

            <p className="text-sm leading-7 text-gray-500">
              {dentistDetails?.bio}
            </p>
          </div>
         )}
          {/* Details Section */}
          {dentistDetails && (
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">

                <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
                    <BriefcaseBusiness size={20} />
                </div>

                <h3 className="text-lg font-semibold text-text-primary">
                    Personal Details
                </h3>
                </div>

                <div className="divide-y divide-gray-100">

                {dentistDetails && details.map((item) => {
                    const Icon = item.icon;
                    return (
                    <div
                        key={item.label}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-4"
                    >
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                        <Icon size={18} className="text-primary" />
                        {item.label}
                        </div>

                        <div className="sm:col-span-2 text-sm text-text-primary break-all">
                        {item.link ? (
                            <a
                            href={item.value}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline inline-flex items-center gap-2"
                            >
                            {item.value}
                            <ExternalLink size={14} />
                            </a>
                        ) : (
                            item.value
                        )}
                        </div>
                    </div>
                    );
                })}

                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
