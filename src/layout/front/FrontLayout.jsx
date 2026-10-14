import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from "./Footer";


const FrontLayout = () => {
  return (
    <div className='min-h-screen bg-bg'>
        {/* Header section */}
        <Navbar/>
        <main className="flex-1">
            <Outlet/>
        </main>
        <Footer/>
        
    </div>
  )
}

export default FrontLayout