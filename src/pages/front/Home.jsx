import React from 'react';
import { FlaskRound, Activity, ToothbrushSparkles, Stethoscope, Shield, Heart, Siren, SectionIcon,Clock,ShieldCogCorner,FilePlusCorner} from 'lucide-react';
const Home = () => {
  return (
    <>
      <section className='relative z-0 text-white py-20 bg-indigo-400'>
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
      <section className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <span className='text-indigo-600 bg-indigo-700/50 py-2 px-3 rounded-full font-semibold text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:transition hover:duration-300 cursor-pointer'>Our Expertise</span>

            <h3 className='text-3xl font-bold text-gray-90 mt-2 mb-4'>Comprehensive Dental Services</h3>

            <p className='text-gray-500 max-w-2xl mx-auto'>
              We offer a full spectrum of dental treatments using modern medical equipment for patients of all ages.
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6'>
            {/* card section 1 */}
            <div className='bg-white border border-[rgba(220,38,38,0.08)] transition duration-300 hover:-translate-y-[6px] hover:shadow-[0_16px_40px_rgba(220,38,38,0.12)] hover:border-[rgba(220,38,38,0.2)] group rounded-lg p-6 shadow-[0_2px_16px_rgba(0,0,0,0.10)]'>
              <div className='w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-4 group-hover:bg-red-600 transition-colors group-hover:text-white'>
                <ToothbrushSparkles />
              </div>
              <h3 className='text-lg font-semibold'>Dental Cleaning</h3>
              <p className='text-slate-500 mb-6'>
                Comprehensive cardiac assessments, risk evaluations, and personalized preventive care plans to keep your heart healthy.
              </p>
              <div className='pt-8 border-t border-gray-600/60 flex items-center justify-between text-sm'>
                <div className='text-gray-400 text-xs'>60 mins</div>
                <div className='font-bold text-gray-900'>$80.00</div>
              </div>
            </div>
            {/* card section 2 */}
            <div className='bg-white border border-[rgba(220,38,38,0.08)] transition duration-300 hover:-translate-y-[6px] hover:shadow-[0_16px_40px_rgba(220,38,38,0.12)] hover:border-[rgba(220,38,38,0.2)] group rounded-lg p-6 shadow-[0_2px_16px_rgba(0,0,0,0.10)]'>
              <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 transition-colors group-hover:text-white'>
                <Activity />
              </div>
              <h3 className='text-lg font-semibold'>Dental Examination</h3>
              <p className='text-slate-500 mb-6'>
                Comprehensive cardiac assessments, risk evaluations, and personalized preventive care plans to keep your heart healthy.
              </p>
              <div className='pt-8 border-t border-gray-600/60 flex items-center justify-between text-sm'>
                <div className='text-gray-400 text-xs'>60 mins</div>
                <div className='font-bold text-gray-900'>$80.00</div>
              </div>
            </div>
            {/* card section 3 */}
            <div className='bg-white border border-[rgba(220,38,38,0.08)] transition duration-300 hover:-translate-y-[6px] hover:shadow-[0_16px_40px_rgba(220,38,38,0.12)] hover:border-[rgba(220,38,38,0.2)] group rounded-lg p-6 shadow-[0_2px_16px_rgba(0,0,0,0.10)]'>
              <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-600 transition-colors group-hover:text-white'>
                <Stethoscope />
              </div>
              <h3 className='text-lg font-semibold'>Dental Examination</h3>
              <p className='text-slate-500 mb-6'>
                Comprehensive cardiac assessments, risk evaluations, and personalized preventive care plans to keep your heart healthy.
              </p>
              <div className='pt-8 border-t border-gray-600/60 flex items-center justify-between text-sm'>
                <div className='text-gray-400 text-xs'>60 mins</div>
                <div className='font-bold text-gray-900'>$80.00</div>
              </div>
            </div>
            {/* card section 4 */}
            <div className='bg-white border border-[rgba(220,38,38,0.08)] transition duration-300 hover:-translate-y-[6px] hover:shadow-[0_16px_40px_rgba(220,38,38,0.12)] hover:border-[rgba(220,38,38,0.2)] group rounded-lg p-6 shadow-[0_2px_16px_rgba(0,0,0,0.10)]'>
              <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4 group-hover:bg-green-600 transition-colors group-hover:text-white'>
                <Shield />
              </div>
              <h3 className='text-lg font-semibold'>Tooth Extraction</h3>
              <p className='text-slate-500 mb-6'>
                Comprehensive cardiac assessments, risk evaluations, and personalized preventive care plans to keep your heart healthy.
              </p>
              <div className='pt-8 border-t border-gray-600/60 flex items-center justify-between text-sm'>
                <div className='text-gray-400 text-xs'>60 mins</div>
                <div className='font-bold text-gray-900'>$80.00</div>
              </div>
            </div>
            {/* card section 5 */}
            <div className='bg-white border border-[rgba(220,38,38,0.08)] transition duration-300 hover:-translate-y-[6px] hover:shadow-[0_16px_40px_rgba(220,38,38,0.12)] hover:border-[rgba(220,38,38,0.2)] group rounded-lg p-6 shadow-[0_2px_16px_rgba(0,0,0,0.10)]'>
              <div className='w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-600 mb-4 group-hover:bg-yellow-600 transition-colors group-hover:text-white'>
                <Heart />
              </div>
              <h3 className='text-lg font-semibold'>Dental Filling</h3>
              <p className='text-slate-500 mb-6'>
                Comprehensive cardiac assessments, risk evaluations, and personalized preventive care plans to keep your heart healthy.
              </p>
              <div className='pt-8 border-t border-gray-600/60 flex items-center justify-between text-sm'>
                <div className='text-gray-400 text-xs'>60 mins</div>
                <div className='font-bold text-gray-900'>$80.00</div>
              </div>
            </div>
            {/* card section 6 */}
            <div className='bg-white border border-[rgba(220,38,38,0.08)] transition duration-300 hover:-translate-y-[6px] hover:shadow-[0_16px_40px_rgba(220,38,38,0.12)] hover:border-[rgba(220,38,38,0.2)] group rounded-lg p-6 shadow-[0_2px_16px_rgba(0,0,0,0.10)]'>
              <div className='w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 mb-4 group-hover:bg-pink-600 transition-colors group-hover:text-white'>
                <Siren />
              </div>
              <h3 className='text-lg font-semibold'>Root Canal Treatment</h3>
              <p className='text-slate-500 mb-6'>
                Comprehensive cardiac assessments, risk evaluations, and personalized preventive care plans to keep your heart healthy.
              </p>
              <div className='pt-8 border-t border-gray-600/60 flex items-center justify-between text-sm'>
                <div className='text-gray-400 text-xs'>60 mins</div>
                <div className='font-bold text-gray-900'>$80.00</div>
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* Dental Doctors section */}
      <section className='py-20 bg-emerald-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <span className='text-indigo-600 bg-indigo-700/50 py-2 px-3 rounded-full font-semibold text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:transition hover:duration-300 cursor-pointer'>Specialist Practitioners</span>
            <h3 className='text-3xl font-bold text-gray-90 mt-2 mb-4'>Meet Our Dental Doctors</h3>
            <p className='text-gray-500 max-w-2xl mx-auto'>Our qualified dentists bring decades of collective clinical experience in general dentistry, orthodontics, and restorative oral care.</p>
          </div>
          {/* Doctors section div */}
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6'>
            {/* Card section 1 */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200/70 p-6 flex flex-col justify-between hover:shadow-md transition hover:-translate-y-[6px] hover:shadow-[0_16px_40px_rgba(220,38,38,0.12)] hover:border-[rgba(6,35,1,0.2)] group'>
              <div>
                <div className='flex items-center space-x-4 mb-5 group'>
                  <div className='w-16 h-16 bg-emerald-100 rounded-xl text-emerald-700 flex items-center justify-center text-2xl font-bold group-hover:bg-emerald-900 group-hover:text-white'>D</div>
                  <div>
                    <h3 className='text-lg font-bold text-gray-900'>Dr. Sarah Johnson</h3>
                    <p className='font-medium text-xs text-teal-600'>General Dentistry</p>
                    <p className='text-gray-400 text-xs mt-0.5'>DDS, University of Michigan</p>
                  </div>
                </div>
                <div className='flex items-center space-x-2 mb-4'>
                  <span className='bg-teal-50 text-teal-700 text-xs font-semibold px-2.5 py-1 rounded-full'>10+ Years Experience</span>
                  <span className='bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full'>Available</span>
                </div>
                <p className='text-gray-600 text-sm leading-relaxed mb-6'>Dr. Sarah Johnson is a highly experienced general dentist with over 10 years of practice. She specializes in preventive and restorative dentistry.</p>
              </div>
              <div className='pt-4 border-t border-gray-100'>
                <a className='bg-indigo-600 w-full inline-flex items-center justify-center px-4 py-2.5 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer'>Book with Dr. Sarah Johnson  </a>
              </div>
            </div>
             {/* Card section 2 */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200/70 p-6 flex flex-col justify-between hover:shadow-md transition hover:-translate-y-[6px] hover:shadow-[0_16px_40px_rgba(220,38,38,0.12)] hover:border-[rgba(6,35,1,0.2)] group'>
              <div>
                <div className='flex items-center space-x-4 mb-5 group'>
                  <div className='w-16 h-16 bg-purple-100 rounded-xl text-purple-700 flex items-center justify-center text-2xl font-bold group-hover:bg-purple-900 group-hover:text-white'>D</div>
                  <div>
                    <h3 className='text-lg font-bold text-gray-900'>Dr. Michael Chen</h3>
                    <p className='font-medium text-xs text-teal-600'>Orthodontics</p>
                    <p className='text-gray-400 text-xs mt-0.5'>DMD, Harvard School of Dental Medicine</p>
                  </div>
                </div>
                <div className='flex items-center space-x-2 mb-4'>
                  <span className='bg-teal-50 text-teal-700 text-xs font-semibold px-2.5 py-1 rounded-full'>15+ Years Experience</span>
                  <span className='bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full'>Available</span>
                </div>
                <p className='text-gray-600 text-sm leading-relaxed mb-6'>Dr. Michael Chen is an orthodontic specialist with 15 years of experience transforming smiles with braces and clear aligners.</p>
              </div>
              <div className='pt-4 border-t border-gray-100'>
                <a className='bg-indigo-600 w-full inline-flex items-center justify-center px-4 py-2.5 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer'>Book with Dr. Sarah Johnson  </a>
              </div>
            </div>
            {/* Card section 3 */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200/70 p-6 flex flex-col justify-between hover:shadow-md transition hover:-translate-y-[6px] hover:shadow-[0_16px_40px_rgba(220,38,38,0.12)] hover:border-[rgba(6,35,1,0.2)] group'>
              <div>
                <div className='flex items-center space-x-4 mb-5 group'>
                  <div className='w-16 h-16 bg-yellow-100 rounded-xl text-yellow-700 flex items-center justify-center text-2xl font-bold group-hover:bg-yellow-900 group-hover:text-white'>D</div>
                  <div>
                    <h3 className='text-lg font-bold text-gray-900'>Dr. Michael Chen</h3>
                    <p className='font-medium text-xs text-teal-600'>Orthodontics</p>
                    <p className='text-gray-400 text-xs mt-0.5'>DMD, Harvard School of Dental Medicine</p>
                  </div>
                </div>
                <div className='flex items-center space-x-2 mb-4'>
                  <span className='bg-teal-50 text-teal-700 text-xs font-semibold px-2.5 py-1 rounded-full'>15+ Years Experience</span>
                  <span className='bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full'>Available</span>
                </div>
                <p className='text-gray-600 text-sm leading-relaxed mb-6'>Dr. Michael Chen is an orthodontic specialist with 15 years of experience transforming smiles with braces and clear aligners.</p>
              </div>
              <div className='pt-4 border-t border-gray-100'>
                <a className='bg-indigo-600 w-full inline-flex items-center justify-center px-4 py-2.5 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer'>Book with Dr. Sarah Johnson  </a>
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* Why Choose section div */}
      <section className='py-20 bg-indigo-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <span className='text-indigo-600 bg-indigo-700/50 py-2 px-3 rounded-full font-semibold text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:transition hover:duration-300 cursor-pointer'>Clinic Highlights</span>
            <h3 className='text-3xl font-bold text-gray-90 mt-2 mb-4'>Why Choose DentalCare?</h3>
          </div>
         
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 '>
             {/* Card section 1 */}
            <div className='bg-white rounded-2xl p-8 text-center shadow-xs border border-blue-100/50 group'>
              <div className='w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md group-hover:bg-blue-100 group-hover:text-blue-600'>
                <Clock />
              </div>
              <h3 className='text-lg font-bold text-gray-900 mb-2'>Real-Time Slot Booking</h3>
              <p className='text-sm text-gray-500 leading-relaxed'>Choose your preferred doctor, procedure, and select from real-time available time slots 24/7.</p>
            </div>
             {/* Card section 2 */}
            <div className='bg-white rounded-2xl p-8 text-center shadow-xs border border-blue-100/50 group'>
              <div className='w-16 h-16 bg-green-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md group-hover:bg-green-100 group-hover:text-green-600'>
                <ShieldCogCorner />
              </div>
              <h3 className='text-lg font-bold text-gray-900 mb-2'>Experienced Dentists</h3>
              <p className='text-sm text-gray-500 leading-relaxed'>Certified specialists in orthodontics, cosmetic whitening, endodontics, and preventive dentistry.</p>
            </div>
             {/* Card section 3 */}
            <div className='bg-white rounded-2xl p-8 text-center shadow-xs border border-blue-100/50 group'>
              <div className='w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md group-hover:bg-indigo-100 group-hover:text-indigo-600'>
                <FilePlusCorner />
              </div>
              <h3 className='text-lg font-bold text-gray-900 mb-2'>Digital Medical Records</h3>
              <p className='text-sm text-gray-500 leading-relaxed'>Access your diagnostic notes, clinical procedures, prescriptions, and past visit history at any time.</p>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}

export default Home