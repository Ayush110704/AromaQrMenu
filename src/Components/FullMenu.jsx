import React, { useMemo, useState, useEffect } from "react";
import { menuData } from './Menu.jsx';
import { Link } from "react-router-dom";
import { useCart } from "./CartContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import photo1 from "../assets/photo1.png";
import photo2 from "../assets/photo2.jpeg";
import photo3 from "../assets/photo3.jpeg";
import photo4 from "../assets/photo4.jpeg";

// Import the menuImages - this contains imported image objects
import { menuImages } from "./menuImages.jsx";

export default function FullMenu() {
  // ✅ Carousel Images
  const carouselImages = [photo1, photo2, photo3, photo4];

  // ✅ Item count per category
  const categoryCounts = useMemo(() => {
    const obj = {};
    menuData.forEach((c) => {
      obj[c.category] = c.items.length;
    });
    return obj;
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const categories = useMemo(
    () => ["All", ...menuData.map((c) => c.category)],
    []
  );

  const [selectedCategory, setSelectedCategory] = useState("All");

  // ✅ Cart (Context)
  const { addToCart, cartCount } = useCart();

  // ✅ Accordion open category
  const [openCategory, setOpenCategory] = useState(null);

  // ✅ Filter per category (Veg / Non-Veg)
  const [categoryFoodFilter, setCategoryFoodFilter] = useState({});

  // ✅ Search + Sort
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");

  // ✅ Modal (Dish details)
  const [selectedDish, setSelectedDish] = useState(null);

  // ✅ Quantity state (per dish key)
  const [qtyMap, setQtyMap] = useState({});

  // ✅ SweetAlert helper
  const showAddedAlert = (itemName, qty = 1) => {
    Swal.fire({
      icon: "success",
      title: "Added to cart ✅",
      text: `${itemName} (x${qty}) added successfully!`,
      timer: 1400,
      showConfirmButton: false,
      position: "top",
    });
  };

  // ✅ Detect item type (Veg / Non-Veg)
  const getItemType = (item) => {
    if (item.type) {
      const t = String(item.type).toLowerCase().trim();
      if (t === "veg") return "Veg";
      if (t === "non-veg" || t === "nonveg" || t === "non veg") return "Non-Veg";
    }

    const name = String(item.name || "").toLowerCase();
    const nonVegWords = [
      "chicken",
      "mutton",
      "fish",
      "prawn",
      "egg",
      "keema",
      "crab",
      "meat",
    ];

    const isNonVeg = nonVegWords.some((w) => name.includes(w));
    return isNonVeg ? "Non-Veg" : "Veg";
  };

  // ✅ Check both veg and nonveg exist in category
  const hasVegAndNonVeg = (items) => {
    const hasVeg = items.some((it) => getItemType(it) === "Veg");
    const hasNonVeg = items.some((it) => getItemType(it) === "Non-Veg");
    return hasVeg && hasNonVeg;
  };

  // ✅ Filter categories
  const filteredMenu = useMemo(() => {
    if (selectedCategory === "All") return menuData;
    return menuData.filter((c) => c.category === selectedCategory);
  }, [selectedCategory]);

  // ✅ Price formatter
  const formatPrice = (item) => {
    if (typeof item.price === "number") return `₹${item.price}/-`;
    if (typeof item.half === "number" && typeof item.full === "number")
      return `Half ₹${item.half}/- | Full ₹${item.full}/-`;
    return "-";
  };

  // ✅ Numeric Price (for sorting)
  const getNumericPrice = (item) => {
    if (typeof item.price === "number") return item.price;
    if (typeof item.full === "number") return item.full;
    if (typeof item.half === "number") return item.half;
    return 999999;
  };

  // ✅ Apply veg/non-veg filter + search + sort
  const finalMenu = useMemo(() => {
    return filteredMenu.map((section) => {
      const activeFilter = categoryFoodFilter[section.category];

      let items = [...section.items];

      // Veg/Non-Veg filter
      if (activeFilter) {
        items = items.filter((item) => getItemType(item) === activeFilter);
      }

      // Search filter
      if (searchTerm.trim()) {
        items = items.filter((item) =>
          String(item.name || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      }

      // Sorting
      if (sortBy === "nameAZ") {
        items.sort((a, b) => String(a.name).localeCompare(String(b.name)));
      } else if (sortBy === "priceLow") {
        items.sort((a, b) => getNumericPrice(a) - getNumericPrice(b));
      } else if (sortBy === "priceHigh") {
        items.sort((a, b) => getNumericPrice(b) - getNumericPrice(a));
      }

      return { ...section, items };
    });
  }, [filteredMenu, categoryFoodFilter, searchTerm, sortBy]);

  // ✅ Carousel State
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // ✅ FULL MENU Typing Effect
  const fullText = "Full Menu 🍽️";
  const [typedText, setTypedText] = useState("");
  const [restartKey, setRestartKey] = useState(0);

  useEffect(() => {
    let i = 0;
    setTypedText("");

    const typingInterval = setInterval(() => {
      i++;
      setTypedText(fullText.slice(0, i));
      if (i === fullText.length) clearInterval(typingInterval);
    }, 120);

    return () => clearInterval(typingInterval);
  }, [restartKey]);

  useEffect(() => {
    const repeatTimer = setInterval(() => {
      setRestartKey((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(repeatTimer);
  }, []);

  // ✅ Function to get dish image (UPDATED)
  const getDishImage = (dishName) => {
    // Direct match from menuImages - returns the imported image object
    return menuImages[dishName] || "";
  };

  // ✅ Helper to get placeholder gradient
  const getPlaceholderStyle = (dishType) => {
    return dishType === "Veg" 
      ? "from-green-50 to-green-100" 
      : "from-red-50 to-red-100";
  };

  // ✅ Qty Helpers
  const getKey = (category, item) => `${category}__${item.name}`;

  const increaseQty = (category, item) => {
    const key = getKey(category, item);
    setQtyMap((prev) => ({ ...prev, [key]: (prev[key] ?? 1) + 1 }));
  };

  const decreaseQty = (category, item) => {
    const key = getKey(category, item);
    setQtyMap((prev) => {
      const current = prev[key] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      }
      return { ...prev, [key]: current - 1 };
    });
  };

  // ✅ Add to cart with qty + SweetAlert
  const handleAddToCartWithQty = (category, item) => {
    const key = getKey(category, item);
    const qty = qtyMap[key] || 1;

    for (let i = 0; i < qty; i++) {
      addToCart(category, item, formatPrice(item));
    }

    showAddedAlert(item.name, qty);
  };

  // ✅ Framer Motion Variants
  const accordionVariants = {
    hidden: { height: 0, opacity: 0 },
    show: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 },
  };

  const listVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.07, delayChildren: 0.05 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.25, ease: "easeOut" },
    },
  };

  return (
    <div className="bg-gray-50 pt-28 px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* ✅ Header */}
        <div className="bg-white shadow rounded-2xl p-5 md:p-6 mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <motion.h1
                key={restartKey}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="text-2xl md:text-3xl font-bold text-gray-900"
              >
                {typedText}
                <span className="animate-pulse">|</span>
              </motion.h1>
            </div>

            {/* ✅ Open Cart */}
            <div className="flex items-center gap-3">
              <Link
                to="/cart"
                className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition"
              >
                Open Cart 🛒 ({cartCount})
              </Link>
            </div>

          </div>
          {/* ✅ Carousel */}
          <div
            className="
              mt-4 relative overflow-hidden rounded-2xl border
              h-[280px]
              sm:h-[340px]
              md:h-[460px]
              lg:h-[540px]
              xl:h-[620px]
            "
          >
            <img
              src={carouselImages[slide]}
              alt="Aroma Carousel"
              className="w-full h-full object-cover transition-all duration-700"
            />

            <div className="absolute inset-0 bg-black/35"></div>
          </div>

          {/* ✅ Search + Sort */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search dish... (ex: Paneer, Chicken)"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="default">Sort: Default</option>
              <option value="nameAZ">Sort: Name A → Z</option>
              <option value="priceLow">Sort: Price Low → High</option>
              <option value="priceHigh">Sort: Price High → Low</option>
            </select>
          </div>

          {/* ✅ Category dropdown */}
          <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-center">
            <label className="font-semibold text-gray-800">Choose Category:</label>

            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setOpenCategory(null);
                setCategoryFoodFilter({});
              }}
              className="w-full sm:w-96 border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat === "All"
                    ? "All Categories"
                    : `${cat} (${categoryCounts[cat] || 0})`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ✅ Accordion Menu */}
        <div className="space-y-4">
          {finalMenu.map((section, index) => {
            const isOpen = openCategory === section.category;

            const originalItems =
              menuData.find((x) => x.category === section.category)?.items || [];

            const canShowButtons = hasVegAndNonVeg(originalItems);
            const activeFilter = categoryFoodFilter[section.category];

            return (
              <div
                key={index}
                className="bg-white shadow rounded-2xl overflow-hidden border"
              >
                {/* ✅ Accordion Header */}
                <div className="w-full flex items-center justify-between p-5 md:p-6">
                  <button
                    onClick={() =>
                      setOpenCategory((prev) =>
                        prev === section.category ? null : section.category
                      )
                    }
                    className="flex items-center gap-3 text-left"
                  >
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                      {section.category} ({section.items.length})
                    </h2>
                  </button>

                  {/* ✅ SHOW FILTER BUTTONS ONLY WHEN OPEN */}
                  {isOpen && canShowButtons && (
                    <div className="hidden md:flex items-center gap-4">
                      <button
                        onClick={() => {
                          setCategoryFoodFilter((prev) => {
                            const current = prev[section.category];
                            if (current === "Veg") {
                              const copy = { ...prev };
                              delete copy[section.category];
                              return copy;
                            }
                            return { ...prev, [section.category]: "Veg" };
                          });
                        }}
                        className={`px-6 py-3 rounded-2xl border font-semibold transition
                        ${activeFilter === "Veg"
                            ? "bg-green-50 border-green-500 text-green-700"
                            : "bg-white border-gray-300 text-gray-700"
                          }`}
                      >
                        🟢 Veg Only
                      </button>

                      <button
                        onClick={() => {
                          setCategoryFoodFilter((prev) => {
                            const current = prev[section.category];
                            if (current === "Non-Veg") {
                              const copy = { ...prev };
                              delete copy[section.category];
                              return copy;
                            }
                            return { ...prev, [section.category]: "Non-Veg" };
                          });
                        }}
                        className={`px-6 py-3 rounded-2xl border font-semibold transition
                        ${activeFilter === "Non-Veg"
                            ? "bg-orange-50 border-orange-600 text-orange-700"
                            : "bg-white border-gray-300 text-gray-700"
                          }`}
                      >
                        🔴 Non Veg Only
                      </button>
                    </div>
                  )}

                  {/* Arrow */}
                  <button
                    onClick={() =>
                      setOpenCategory((prev) =>
                        prev === section.category ? null : section.category
                      )
                    }
                    className="ml-auto"
                  >
                    <svg
                      className={`w-6 h-6 text-gray-900 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                        }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>

                {/* ✅ Accordion Body with Smooth Animation */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      variants={accordionVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="px-5 md:px-6 pb-6 overflow-hidden"
                    >
                      {/* ✅ Mobile filter buttons */}
                      {canShowButtons && (
                        <div className="flex md:hidden gap-3 flex-wrap mb-4">
                          <button
                            onClick={() => {
                              setCategoryFoodFilter((prev) => {
                                const current = prev[section.category];
                                if (current === "Veg") {
                                  const copy = { ...prev };
                                  delete copy[section.category];
                                  return copy;
                                }
                                return { ...prev, [section.category]: "Veg" };
                              });
                            }}
                            className={`px-5 py-3 rounded-2xl border font-semibold transition
                            ${activeFilter === "Veg"
                                ? "bg-green-50 border-green-500 text-green-700"
                                : "bg-white border-gray-300 text-gray-700"
                              }`}
                          >
                            🟢 Veg Only
                          </button>

                          <button
                            onClick={() => {
                              setCategoryFoodFilter((prev) => {
                                const current = prev[section.category];
                                if (current === "Non-Veg") {
                                  const copy = { ...prev };
                                  delete copy[section.category];
                                  return copy;
                                }
                                return { ...prev, [section.category]: "Non-Veg" };
                              });
                            }}
                            className={`px-5 py-3 rounded-2xl border font-semibold transition
                            ${activeFilter === "Non-Veg"
                                ? "bg-orange-50 border-orange-600 text-orange-700"
                                : "bg-white border-gray-300 text-gray-700"
                              }`}
                          >
                            🔴 Non Veg Only
                          </button>
                        </div>
                      )}

                      {/* ✅ Items */}
                      {section.items.length === 0 ? (
                        <p className="text-gray-500 font-semibold">
                          No items found ❌
                        </p>
                      ) : (
                        <motion.div
                          variants={listVariants}
                          initial="hidden"
                          animate="show"
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                        >
                          {section.items.map((item, i) => {
                            const dishType = getItemType(item);

                            const isBestseller =
                              item.bestseller === true ||
                              String(item.name || "")
                                .toLowerCase()
                                .includes("special");

                            const key = getKey(section.category, item);
                            const qty = qtyMap[key] || 1;
                            const dishImage = getDishImage(item.name);
                            const hasImage = !!dishImage; // Check if image exists

                            return (
                              <motion.div
                                key={i}
                                variants={cardVariants}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white border rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col"
                              >
                                {/* ✅ Image Section - UPDATED */}
                                <div
                                  className="relative cursor-pointer group flex-shrink-0"
                                  onClick={() =>
                                    setSelectedDish({
                                      ...item,
                                      category: section.category,
                                    })
                                  }
                                >
                                  <div className="relative pt-[75%] overflow-hidden rounded-t-2xl">
                                    {hasImage ? (
                                      <img
                                        src={dishImage}
                                        alt={item.name}
                                        className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                      />
                                    ) : (
                                      <div className={`absolute inset-0 bg-gradient-to-br ${getPlaceholderStyle(dishType)} flex items-center justify-center`}>
                                        <div className="text-center p-4">
                                          <div className="text-gray-500 text-4xl mb-2">
                                            {dishType === "Veg" ? "🥗" : "🍗"}
                                          </div>
                                          <div className="text-gray-600 font-medium truncate max-w-[200px]">
                                            {item.name}
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {/* Bestseller Tag */}
                                    {isBestseller && (
                                      <div className="absolute top-3 left-3 bg-yellow-400 text-black font-bold px-3 py-1 rounded-full text-xs shadow z-10">
                                        ⭐ Bestseller
                                      </div>
                                    )}

                                    {/* Veg/NonVeg Tag */}
                                    <div
                                      className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow z-10
                                        ${dishType === "Veg"
                                          ? "bg-green-600 text-white"
                                          : "bg-red-600 text-white"
                                        }`}
                                    >
                                      {dishType}
                                    </div>
                                  </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 flex flex-col gap-2 flex-grow">
                                  <div
                                    className="font-bold text-gray-900 text-lg cursor-pointer hover:underline line-clamp-1"
                                    onClick={() =>
                                      setSelectedDish({
                                        ...item,
                                        category: section.category,
                                      })
                                    }
                                  >
                                    {item.name}
                                  </div>

                                  <div className="font-extrabold text-red-600">
                                    {formatPrice(item)}
                                  </div>

                                  {/* Qty Controls */}
                                  <div className="flex items-center justify-between gap-3 mt-2">
                                    <div className="flex items-center gap-2">
                                      <motion.button
                                        whileTap={{ scale: 0.85 }}
                                        onClick={() =>
                                          decreaseQty(section.category, item)
                                        }
                                        className="w-10 h-10 rounded-xl border font-bold text-lg hover:bg-gray-100"
                                      >
                                        −
                                      </motion.button>

                                      <div className="w-12 text-center font-bold">
                                        {qty}
                                      </div>

                                      <motion.button
                                        whileTap={{ scale: 0.85 }}
                                        onClick={() =>
                                          increaseQty(section.category, item)
                                        }
                                        className="w-10 h-10 rounded-xl border font-bold text-lg hover:bg-gray-100"
                                      >
                                        +
                                      </motion.button>
                                    </div>

                                    <motion.button
                                      whileTap={{ scale: 0.92 }}
                                      onClick={() =>
                                        handleAddToCartWithQty(section.category, item)
                                      }
                                      className="px-5 py-3 rounded-2xl font-bold text-white
             bg-gradient-to-r from-red-700 to-red-500
             shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95
             transition-all duration-200"
                                    >
                                      Add 🛒
                                    </motion.button>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* ✅ Modal */}
      <AnimatePresence>
        {selectedDish && (
          <motion.div
            className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDish(null)}
          >
            <motion.div
              className="bg-white max-w-lg w-full rounded-2xl overflow-hidden shadow-xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-64 w-full overflow-hidden bg-white">
                {(() => {
                  const dishImage = getDishImage(selectedDish.name);
                  const dishType = getItemType(selectedDish);
                  
                  if (dishImage) {
                    return (
                      <div className="w-full h-full flex items-center justify-center p-6">
                        <img
                          src={dishImage}
                          alt={selectedDish.name}
                          className="max-w-full max-h-full object-contain rounded-lg"
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getPlaceholderStyle(dishType)}`}>
                        <div className="text-center p-6">
                          <div className="text-gray-500 text-6xl mb-4">
                            {dishType === "Veg" ? "🥗" : "🍗"}
                          </div>
                          <div className="text-gray-600 font-medium text-lg">{selectedDish.name}</div>
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900">
                      {selectedDish.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Category:{" "}
                      <span className="font-semibold">{selectedDish.category}</span>
                    </p>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedDish(null)}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 font-bold"
                  >
                    ✕
                  </motion.button>
                </div>

                <div className="mt-3 font-extrabold text-red-600 text-lg">
                  {formatPrice(selectedDish)}
                </div>

                <p className="text-gray-600 mt-2 text-sm">
                  Delicious & freshly prepared dish ⭐
                </p>

                {/* ✅ Modal Add To Cart + SweetAlert */}
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    addToCart(
                      selectedDish.category,
                      selectedDish,
                      formatPrice(selectedDish)
                    );
                    showAddedAlert(selectedDish.name, 1);
                  }}
                  className="mt-5 w-full px-5 py-3 rounded-2xl font-bold text-white
                             bg-gradient-to-r from-red-700 to-red-500
                             shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95
                             transition-all duration-200"
                >
                  Add To Cart +
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}