import React, { useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import HeroSection from '../components/landing/HeroSection';
import GalleryHeroSection from '../components/landing/GalleryHeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import FeaturedEventsSection from '../components/landing/FeaturedEventsSection';
import ConcertAtmosphereSection from '../components/landing/ConcertAtmosphereSection';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const { events, currentUser } = useStore();
  const heroRef = useRef(null);

  useEffect(() => {
    // Parallax effect on Hero
    if (heroRef.current) {
      gsap.to(".hero-glow-1", {
        y: 100,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to(".hero-glow-2", {
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark text-brand-darkText dark:text-brand-lightText transition-colors duration-300 overflow-x-hidden">
      <Navbar />

      <HeroSection ref={heroRef} currentUser={currentUser} />
      <GalleryHeroSection />
      <FeaturesSection />
      <FeaturedEventsSection events={events} />
      <ConcertAtmosphereSection />
      
      <Footer />
    </div>
  );
}
