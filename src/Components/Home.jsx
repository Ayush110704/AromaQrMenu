import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Banner from "./Banner.jsx";
import MenuPreview from "./MenuPreview.jsx";
import Service from "./Service.jsx";
import Testimonials from "./Testimonials.jsx";
import Footer from "./Footer.jsx";

export default function Home() {
  const location = useLocation();

  // ✅ Smooth scroll when URL has hash (#top / #services / #menuPreview / #reviews)
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);

      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 120);
      }
    }
  }, [location]);

  return (
    <div className="bg-gray-50">
      {/* ✅ TOP / BANNER SECTION */}
      <section id="top">
        <Banner />
      </section>

      {/* ✅ SERVICE SECTION */}
      <section id="services" className="scroll-mt-28">
        <Service />
      </section>

      {/* ✅ MENU PREVIEW SECTION */}
      <section id="menuPreview" className="scroll-mt-28">
        <MenuPreview />
      </section>

      {/* ✅ TESTIMONIALS / REVIEWS SECTION */}
      <section id="reviews" className="scroll-mt-28">
        <Testimonials />
      </section>

      {/* ✅ FOOTER SECTION */}
      <Footer />
    </div>
  );
}
