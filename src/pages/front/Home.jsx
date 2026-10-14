import React from 'react';
import { FlaskRound, Activity, ToothbrushSparkles, Stethoscope, Shield, Heart, Siren, SectionIcon,Clock,ShieldCogCorner,FilePlusCorner} from 'lucide-react';
import WhyChooseSection from './commonSection/WhyChooseSection';
import DoctorsSection from './commonSection/DoctorsSection';
import ServicesSection from './commonSection/ServicesSection';
const Home = () => {
  return (
    <>
      <section className='relative z-0 text-white py-20 bg-indigo-500'>
        <div className='mx-auto px-4'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div>
              <h1 className='text-4xl md:text-5xl font-bold leading-tight mb-6'>Your Smile is Our <br />
                <span className='text-indigo-200'>Top Priority</span></h1>
              <p className='text-indigo-100 text-lg mb-8 leading-relaxed'>
                Professional dental care with a personal touch. Book your appointment online and experience the difference with our expert team of dentists.
              </p>
              <div className='flex flex-col sm:flex-row gap-4'>
                <a className='bg-white text-indigo-600 px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-50 transition text-center shadow-lg'>Book Appointment</a>
                <a className='border-2 border-white text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white hover:text-indigo-600 transition text-center'>Meet Our Doctors</a>
              </div>
              <div className='mt-12 flex items-center space-x-8 pt-8 border-t border-indigo-300'>
                <div>
                  <div className='font-bold text-3xl'>500+</div>
                  <div className='text-indigo-200 text-sm'>Happy Patients</div>
                </div>
                <div>
                  <div className='font-bold text-3xl'>15+</div>
                  <div className='text-indigo-200 text-sm'>Years Experience</div>
                </div>
                <div>
                  <div className='font-bold text-3xl'>10+</div>
                  <div className='text-indigo-200 text-sm'>Dental Procedures</div>
                </div>
              </div>
            </div>
            <div className='hidden lg:flex justify-center relative z-10'>
              <div className='bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-10 text-center max-w-md'>
                <div className='w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                  <FlaskRound size={50} />
                </div>
                <h3 className='text-white text-xl font-bold mb-2'>Modern Dental Technology</h3>
                <p className='text-indigo-100 text-sm leading-relaxed'>Pain-free procedures, digital radiography, and compassionate care tailored to each patient.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Servicestion section */}
      <ServicesSection/>
      {/* Dental Doctors section */}
      <DoctorsSection />
      {/* Why Choose section div */}
      <WhyChooseSection />
      {/* CTA Section */}
      <section id='contact' className='py-20 bg-linear-to-r from-indigo-600 to-blue-700 text-white'>
        <div className='max-w-4xl mx-auto px-4 text-center'>
          <h2 className='mb-4 text-3xl font-bold sm:text-4xl'>Ready for Your Next Dental Visit?</h2>
          <p className='text-indigo-100 text-lg mb-8 max-w-xl mx-auto'>Book your consultation online today and experience friendly, professional dental care.</p>
          <a href='#' className='bg-white text-indigo-600 px-10 py-4 rounded-xl font-bold text-base hover:bg-indigo-50 transition inline-block shadow-lg'>Book Your Appointment Now</a>
        </div>
      </section>
    </>
  )
}

export default Home