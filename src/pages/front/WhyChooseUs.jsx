import React from 'react'
import HeroSection from '../../layout/front/HeroSection'
import WhyChooseSection from './commonSection/WhyChooseSection'

const WhyChooseUs = () => {
  return (
    <>
      <HeroSection pageTitle={"Why Choose Us"} title={"Features"} />
      {/* Why Choose section div */}
      <WhyChooseSection/>
      
    </>
  )
}

export default WhyChooseUs