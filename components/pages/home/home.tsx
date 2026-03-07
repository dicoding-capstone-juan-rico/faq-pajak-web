import Navbar from '@/components/layout/navbar'
import React from 'react'
import HeroSection from './hero'
import OurFeatures from './our-features'
import Footer from '@/components/layout/footer'

const Home = () => {
  return (
     <div className={`min-h-screen transition-colors duration-500 font-sans dark:bg-[#022c22] bg-white`}>
        <Navbar />
        <HeroSection />
        <OurFeatures />
        <Footer />
     </div>
  )
}

export default Home