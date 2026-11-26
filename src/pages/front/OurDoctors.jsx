import React from 'react'
import { useAuth } from "../../context/AuthContext";
import HeroSection from '../../layout/front/HeroSection'
import DoctorsSection from './commonSection/DoctorsSection'
import usePageTitle from '../../hooks/usePageTitle';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-hot-toast";

const OurDoctors = () => {
  usePageTitle("Our Doctors");
  const navigate = useNavigate();
  const { user } = useAuth();
  const handleBookAppointment = () => {
      // Check login
      if (!user) {
          toast.error("Please login or register first.");
          navigate("/signup");
          return;
      }

      // Check Patient role
      if (user.role?.toLowerCase() !== "patient") {
          toast.error("Only patients can book appointments.");
          return;
      }
      navigate("/patient/dashboard");
  };
  return (
    <>
      <HeroSection pageTitle={"Our Doctors"} title={"Doctor"} />
      {/* Dental Doctors section */}
      <DoctorsSection 
      onBookAppointment={handleBookAppointment}
      />
    </>
  )
}

export default OurDoctors