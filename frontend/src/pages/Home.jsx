import React from 'react'
import Hero from '../sections/Hero'
import TrustStrip from '../sections/TrustStrip'
import Services from '../sections/Services'
import Tools from '../sections/Tools'
import Approach from '../sections/Approach'
import WhyChooseUs from '../sections/WhyChooseUs'
import Testimonials from '../sections/Testimonials'
import Contact from '../sections/Contact'

const Home = () => {
  return (
    <main className="flex flex-col" style={{ background: 'var(--bg)', transition: 'background 0.4s' }}>
      <div id="home"><Hero /></div>
      <div id="work"><TrustStrip /></div>
      <div id="process"><Approach /></div>
      <div id="services"><Services /></div>
      <div id="resources"><Tools /></div>
      <div id="about-us"><WhyChooseUs /></div>
      <Testimonials />
      <div id="contact"><Contact /></div>
    </main>
  )
}

export default Home
