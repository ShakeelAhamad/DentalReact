import React from 'react'
import HeroSection from '../../layout/front/HeroSection'
import DoctorsSection from './commonSection/DoctorsSection'

const OurDoctors = () => {
  return (
    <>
      <HeroSection pageTitle={"Our Doctors"} title={"Doctor"} />
      {/* Dental Doctors section */}
      <DoctorsSection/>
    </>
  )
}

export default OurDoctors