import React from 'react'
import Hero from '../components/Hero'
import TrustStrip from '../components/TrustStrip'
import Services from '../components/Services'
import Tools from '../components/Tools'
import Portfolio from '../components/Portfolio'
import Approach from '../components/Approach'
import WhyChooseUs from '../components/WhyChooseUs'
import Testimonials from '../components/Testimonials'
import Contact from '../components/Contact'

const Home = () => {
  return (
    <main className="flex flex-col gap-24 lg:gap-32">
      <div id="home"><Hero /></div>
      <TrustStrip />
      <div id="approach"><Approach /></div>
      <div id="services"><Services /></div>
      <Tools />
      <WhyChooseUs />
      <Testimonials />
      <Contact />
    </main>
  )
}

export default Home
