import React from 'react'
import HeroSection from '../../layout/front/HeroSection'
import { Heart, Shield, Siren, Stethoscope, ToothbrushSparkles,Activity } from 'lucide-react'
import ServicesSection from './commonSection/ServicesSection';

const Services = () => {
  return (
    <>
      <HeroSection pageTitle={"Services"} title={"Service"}/>
      {/* Servicestion section */}
      <ServicesSection/>
    </>
  )
}

export default Services