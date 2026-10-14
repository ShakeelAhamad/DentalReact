import React from 'react'
import HeroSection from '../../layout/front/HeroSection'
import WhyChooseSection from './commonSection/WhyChooseSection'
import usePageTitle from '../../hooks/usePageTitle';

const WhyChooseUs = () => {
  usePageTitle("Why Choose Us");
  return (
    <>
      <HeroSection pageTitle={"Why Choose Us"} title={"Features"} />
      {/* Why Choose section div */}
      <WhyChooseSection/>
      
    </>
  )
}

export default WhyChooseUs