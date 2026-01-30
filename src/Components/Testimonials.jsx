import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Swal from "sweetalert2"; // ✅ Added

export default function Testimonials() {
  const sectionRef = useRef(null);

  const defaultTestimonials = [
    {
      id: "t1",
      name: "Prachi",
      role: "Customer",
      message:
        "Amazing food and great service! The taste was authentic and everything was super fresh. Highly recommended!",
      rating: 5,
    },
    {
      id: "t2",
      name: "Ayush",
      role: "Food Lover",
      message:
        "The ambience was perfect and the staff was very polite. The quality is top-notch, loved it!",
      rating: 5,
    },
    {
      id: "t3",
      name: "Rohit",
      role: "Regular Visitor",
      message:
        "Fast service, great taste, and very affordable pricing. Definitely one of the best restaurants in town.",
      rating: 4,
    },
  ];

  const isAdmin = localStorage.getItem("isAdminLoggedIn") === "true";

  // ✅ Give every review a safe unique id (old reviews also)
  const normalizeReviews = (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr.map((r, index) => ({
      id:
        r?.id ||
        `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
      name: r?.name || "Guest",
      role: r?.role || "Customer",
      message: r?.message || "",
      rating: Number(r?.rating || 0),
    }));
  };

  // ✅ Load from localStorage safely (and normalize)
  const [testimonials, setTestimonials] = useState(() => {
    const saved = localStorage.getItem("aroma_reviews");
    if (!saved) return defaultTestimonials;

    try {
      return normalizeReviews(JSON.parse(saved));
    } catch (e) {
      return defaultTestimonials;
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [form, setForm] = useState({
    name: "",
    role: "Customer",
    message: "",
    rating: 0,
  });

  // ✅ Section visible state (start effects only after reach)
  const [hasReached, setHasReached] = useState(false);

  const chunkSize = 2;

  // ✅ Always save normalized reviews (ids will stay)
  useEffect(() => {
    localStorage.setItem("aroma_reviews", JSON.stringify(testimonials));
  }, [testimonials]);

  // ✅ Slides of 2
  const slides = useMemo(() => {
    const result = [];
    for (let i = 0; i < testimonials.length; i += chunkSize) {
      result.push(testimonials.slice(i, i + chunkSize));
    }
    return result;
  }, [testimonials]);

  // ✅ Detect when section comes in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasReached(true);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  // ✅ Auto slide (start only after reach)
  useEffect(() => {
    if (!hasReached) return;
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length, hasReached]);

  // ✅ Fix slide index
  useEffect(() => {
    if (currentSlide > slides.length - 1) setCurrentSlide(0);
  }, [slides.length, currentSlide]);

  // ✅ Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Add Review
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.message.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Fill Required Fields ❌",
        text: "Please enter Name and Message",
        confirmButtonColor: "#111827",
      });
      return;
    }

    if (form.rating === 0) {
      Swal.fire({
        icon: "warning",
        title: "Select Rating ⭐",
        text: "Please select at least 1 star rating",
        confirmButtonColor: "#111827",
      });
      return;
    }

    const newReview = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: form.name.trim(),
      role: form.role,
      message: form.message.trim(),
      rating: Number(form.rating),
    };

    setTestimonials((prev) => [...prev, newReview]);

    setForm({
      name: "",
      role: "Customer",
      message: "",
      rating: 0,
    });

    setIsOpen(false);

    Swal.fire({
      icon: "success",
      title: "Review Added ✅",
      timer: 1200,
      showConfirmButton: false,
      position: "top",
    });
  };

  // ✅ Delete review (SweetAlert2)
  const deleteReview = async (reviewId) => {
    if (!isAdmin) return;
    if (!reviewId) return;

    const res = await Swal.fire({
      title: "Delete this review? ❌",
      text: "This review will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#111827",
    });

    if (!res.isConfirmed) return;

    setTestimonials((prev) => prev.filter((t) => t.id !== reviewId));

    Swal.fire({
      icon: "success",
      title: "Deleted ✅",
      timer: 1200,
      showConfirmButton: false,
      position: "top",
    });
  };

  return (
    <section ref={sectionRef} className="w-full bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* ✅ Heading (NO TYPING EFFECT) */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            What Our Customers Say ⭐
          </h2>

          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Real reviews from our happy customers who love our taste, quality,
            and service.
          </p>
        </div>

        {/* Reviews */}
        {testimonials.length === 0 ? (
          <div className="bg-gray-50 border rounded-2xl p-6 text-center font-semibold text-gray-600">
            No reviews yet ❌
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={hasReached ? { opacity: 0, y: 25 } : false}
                  animate={hasReached ? { opacity: 1, y: 0 } : false}
                  exit={hasReached ? { opacity: 0, y: -25 } : false}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="grid gap-6 md:grid-cols-2"
                >
                  {slides[currentSlide]?.map((t) => {
                    const firstLetter =
                      t.name?.trim()?.charAt(0)?.toUpperCase() || "?";

                    return (
                      <motion.div
                        key={t.id}
                        initial={hasReached ? { opacity: 0, scale: 0.97 } : false}
                        animate={hasReached ? { opacity: 1, scale: 1 } : false}
                        transition={{ duration: 0.5 }}
                        className="bg-gray-50 rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col relative"
                      >
                        {/* ✅ Admin Delete Button */}
                        {isAdmin && (
                          <button
                            onClick={() => deleteReview(t.id)}
                            className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-700 transition"
                          >
                            Delete ❌
                          </button>
                        )}

                        {/* Top */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold">
                            {firstLetter}
                          </div>

                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {t.name}
                            </h3>
                            <p className="text-sm text-gray-500">{t.role}</p>
                          </div>
                        </div>

                        {/* Message */}
                        <p className="text-gray-700 text-sm leading-relaxed flex-1">
                          “{t.message}”
                        </p>

                        {/* Rating */}
                        <div className="flex mt-4">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${
                                i < t.rating ? "text-yellow-500" : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Add Review Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            + Add Review
          </button>
        </div>

        {/* Modal */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
              >
                ✕
              </button>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Add Your Review ✨
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                />

                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option>Customer</option>
                  <option>Food Lover</option>
                  <option>Visitor</option>
                  <option>Regular Customer</option>
                </select>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your review..."
                  rows="4"
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                />

                <div>
                  <p className="font-semibold text-gray-800 mb-2">Rating ⭐</p>
                  <div className="flex gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() =>
                          setForm((prev) => ({ ...prev, rating: i + 1 }))
                        }
                        className={`text-3xl transition ${
                          i < form.rating ? "text-yellow-500" : "text-gray-300"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
                >
                  Submit Review ✅
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
