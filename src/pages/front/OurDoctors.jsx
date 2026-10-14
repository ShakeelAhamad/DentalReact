import React from 'react'
import HeroSection from '../../layout/front/HeroSection'
import DoctorsSection from './commonSection/DoctorsSection'
import usePageTitle from '../../hooks/usePageTitle';

const OurDoctors = () => {
  usePageTitle("Our Doctors");
  return (
    <>
      <HeroSection pageTitle={"Our Doctors"} title={"Doctor"} />
      {/* Dental Doctors section */}
      <DoctorsSection/>
    </>
  )
}

export default OurDoctors