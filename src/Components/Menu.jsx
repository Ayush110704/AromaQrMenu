export const menuData = [
  {
    category: "Papad",
    type: "Veg",
    items: [
      { name: "Papad Roast", price: 15 },
      { name: "Papad Fry", price: 20 },
      { name: "Papad Masala", price: 25 },
      { name: "Sindhi Papad", price: 40 },
    ],
  },
  {
    category: "Raita",
    type: "Veg",
    items: [
      { name: "Boondi Raita", price: 70 },
      { name: "Aloo Raita", price: 70 },
      { name: "Mix Raita", price: 70 },
      { name: "Pineapple Raita", price: 80 },
    ],
  },
  {
    category: "Salad",
    type: "Veg",
    items: [
      { name: "Onion Salad", price: 10 },
      // { name: "Green Salad (H)", price: 40 },
      { name: "Green Salad (F)", price: 70 },
    ],
  },

  // ✅ Soups (Merged Veg + Non-Veg)
  {
    category: "Soups",
    type: "Mixed",
    items: [
      // 🟢 Veg Soups
      { name: "Tomato Soup", price: 80, type: "Veg" },
      { name: "Veg. Clear Soup", price: 90, type: "Veg" },
      { name: "Veg. Mushroom Soup", price: 100, type: "Veg" },
      { name: "Veg. H/S Soup", price: 100, type: "Veg" },
      { name: "Veg. S/C Soup", price: 100, type: "Veg" },
      { name: "Veg. Cream Soup", price: 100, type: "Veg" },
      { name: "Veg. Manchow", price: 110, type: "Veg" },

      // 🔴 Non-Veg Soups
      { name: "Chicken Clear Soup", price: 120, type: "Non-Veg" },
      { name: "Chicken Mushroom Soup", price: 120, type: "Non-Veg" },
      { name: "Chicken H/S Soup", price: 120, type: "Non-Veg" },
      { name: "Chicken S/C Soup", price: 120, type: "Non-Veg" },
      { name: "Chicken Manchow", price: 130, type: "Non-Veg" },
    ],
  },

  // ✅ Chinese (Merged Veg + Non-Veg)
  {
    category: "Chinese",
    type: "Mixed",
    items: [
      // 🟢 Veg Chinese
      { name: "Veg Fry Noodles", price: 180, type: "Veg" },
      { name: "Veg Hakka Noodles", price: 180, type: "Veg" },
      { name: "Schezwan Noodles", price: 200, type: "Veg" },
      { name: "Veg Manchurian", price: 160, type: "Veg" },
      { name: "Paneer Manchurian", price: 230, type: "Veg" },
      { name: "Paneer Chilli", price: 240, type: "Veg" },
      { name: "Baby Corn Chilli", price: 230, type: "Veg" },
      { name: "Mushroom Chilli", price: 230, type: "Veg" },
      { name: "Veg Crispy", price: 230, type: "Veg" },
      { name: "Paneer 65", price: 240, type: "Veg" },
      { name: "Veg Spring Roll", price: 240, type: "Veg" },

      // 🔴 Non-Veg Chinese 
      { name: "Egg Hakka Noodles", price: 180, type: "Non-Veg" },
      { name: "Chicken Hakka Noodles", price: 180, type: "Non-Veg" },
      { name: "Chicken Manchurian", price: 200, type: "Non-Veg" },
      { name: "Chicken Chilli", price: 180, type: "Non-Veg" },
      { name: "Chicken 65", half: 370, full: 650, type: "Non-Veg" },
      { name: "Chicken Garlic", half: 370, full: 650, type: "Non-Veg" },
      { name: "Chicken Lollipop", price: 180, type: "Non-Veg" },
      { name: "Chicken Junglee", price: 210, type: "Non-Veg" },
      { name: "Chicken Tichi", price: 220, type: "Non-Veg" },
      { name: "Chicken Crispy", price: 220, type: "Non-Veg" }
    ],
  },

  {
    category: "Tandoor Specials",
    type: "Mixed",
    items: [
      { name: "Chicken Tandoor", half: 260, full: 460 },
      { name: "Chicken Tangdi Kabab", price: 300 },
      { name: "Chicken Tikka", price: 300 },
      { name: "Chicken Pahadi Kabab", price: 320 },
      { name: "Paneer Tikka", price: 200 },
      { name: "Paneer Lahori Tikka", price: 220 },
      { name: "Veg Seekh Kabab", price: 230 },
      { name: "Paneer Malai Tikka", price: 240 },
      { name: "Veg Bite Kabab", price: 250 },
    ],
  },

  // ✅ Snacks (Merged Veg + Non-Veg)
  {
    category: "Snacks",
    type: "Mixed",
    items: [
      // 🟢 Veg Snacks
      { name: "Onion Pakoda", price: 130, type: "Veg" },
      { name: "Paneer Pakoda", price: 180, type: "Veg" },
      { name: "Cheese Pakoda", price: 190, type: "Veg" },
      // { name: "Cheese Cube", price: 50, type: "Veg" },
      { name: "Finger Chips", price: 100, type: "Veg" },
      { name: "Green Peas Roast", price: 100, type: "Veg" },
      { name: "Chana Masala", price: 130, type: "Veg" },
      { name: "Chana Chilli", price: 180, type: "Veg" },
      { name: "Paneer Hot-Pan", price: 250, type: "Veg" },
      { name: "Harabhara Kabab", price: 170, type: "Veg" },
      { name: "Cheese Corn Kabab", price: 200, type: "Veg" },

      // 🔴 Non-Veg Snacks
  { name: "Chicken Oil Roast", half: 350, full: 550, type: "Non-Veg" },
  { name: "Chicken Black Pepper", half: 330, full: 550, type: "Non-Veg" },
  { name: "Chicken Gravy Roast", half: 330, full: 550, type: "Non-Veg" }, 
  { name: "Mutton Bhuna", half: 400, full: 700, type: "Non-Veg" },
  { name: "Mutton Roast", half: 400, full: 700, type: "Non-Veg" },
  { name: "Mutton Black Pepper", half: 400, full: 700, type: "Non-Veg" }, 
  { name: "Fish Fry", price: 180, type: "Non-Veg" }
    ],
  },

  // ✅ MAIN COURSE (Added from Images)
  {
    category: "Main Course - Veg",
    type: "Veg",
    items: [
      { name: "Veg Aroma Special", price: 240 },
      { name: "Veg Bhatinda", price: 220 },
      { name: "Chesse Anguri", price: 200 },
      { name: "Kaju Masala", price: 220 },
      { name: "Veg Hydrabadi", price: 180 },
      { name: "Veg Lajawab", price: 190 },
      { name: "Veg Garden", price: 200 },
      { name: "Cheese Butter Masala", price: 200 },
      { name: "Veg Diwani Handi", price: 200 },
      { name: "Mushroom Masala", price: 200 },
      { name: "Mushrrom Curry", price: 180 },
      { name: "Navratan Korma", price: 200 },
      { name: "Veg Kolhapuri", price: 180 },
      { name: "Veg Jaipuri", price: 180 },
      { name: "Veg EggCurry", price: 180 }, 
      { name: "Veg Takatak", price: 180 },
      { name: "Veg Kima Kasturi", price: 200 },
      { name: "Dum Aloo Kashmiri", price: 190 },
      { name: "Dum Aloo Kolhapuri", price: 180 },
      { name: "Stuff Tomato", price: 180 },
      { name: "Stuff Capsicum", price: 180 },
      { name: "Aloo Gobi Mutter", price: 160 },
      { name: "Jira Aloo", price: 160 },
      { name: "Malai Kofta", price: 210 },
      { name: "Kaju Khoya", price: 240 },
      { name: "Kaju Paneer", price: 240 },
    ],
  },

  {
    category: "Main Course - Paneer",
    type: "Veg",
    items: [
      { name: "Paneer Aroma Special", price: 250 },
      { name: "Paneer Bhatinda", price: 240 },
      { name: "Paneer Punjabi", price: 220 },
      { name: "Paneer Lajawab", price: 220 },
      { name: "Paneer Pasanda", price: 230 },
      { name: "Paneer Butter Masala", price: 210 },
      { name: "Paneer Chatpata", price: 200 },
      { name: "Paneer Kasturi", price: 210 },
      { name: "Paneer Tikka Masala", price: 220 },
      { name: "Paneer Dilruba", price: 220 },
      { name: "Paneer Kolhapuri", price: 200 },
      { name: "Paneer Lachedar", price: 230 },
      { name: "Paneer Angara", price: 240 },

      { name: "Palak Paneer", price: 200 },
      { name: "Paneer Bhurji", price: 200 },
      { name: "Paneer Bhurji Curry", price: 210 },
      { name: "Paneer Afgani", price: 230 },
      { name: "Paneer Kofta", price: 200 },
      { name: "Shahi Paneer", price: 220 },
      { name: "Kadhai Paneer", price: 240 },
      { name: "Paneer Takatak", price: 220 },
    ],
  },

  {
    category: "Main Course - Chicken",
    type: "Non-Veg",
    items: [
      { name: "Chicken Aroma Sp.", half: 410, full: 720 },
      { name: "Chicken Handi", half: 360, full: 680 },
      { name: "Chicken Masala", half: 360, full: 680 },
      { name: "Butter Chicken", half: 380, full: 700 },
      { name: "Chicken Afgani", half: 390, full: 720 },
      { name: "Chicken Kolhapuri", half: 330, full: 650 },
      { name: "Chicken Patiyala", half: 380, full: 700 },
      { name: "Chicken Bhuna", half: 380, full: 700 },
      { name: "Chicken Tikka Masala", half: 400, full: 720 },
      { name: "Chicken Roast", half: 320, full: 640 },

      // ✅ Full only (as per image)
      { name: "Chicken Curry", price: 190 },
      { name: "Chicken Shahi Korma", price: 260 },
      { name: "Chicken Do-Pyaza", price: 260 },
    ],
  },

  {
    category: "Main Course - Mutton",
    type: "Non-Veg",
    items: [
      { name: "Mutton Curry", price: 240 },
      { name: "Mutton Ragan Josh", price: 240 },
      { name: "Mutton Masala", price: 240 },
      { name: "Mutton Bhuna", price: 240 },
      { name: "Mutton Kadhai", price: 240 },
      { name: "Mutton Saoji", price: 240 },
      { name: "Mutton Hyderabadi", price: 240 },
      { name: "Mutton Afgani", price: 250 },
      { name: "Mutton Handi (F)", price: 840 },
      { name: "Mutton Handi (H)", price: 440 },
    ],
  },

  {
    category: "Egg & Dal",
    type: "Mixed",
    items: [
      // ✅ Egg Specials
      { name: "Egg Curry", price: 120, type: "Non-Veg" },
      { name: "Egg Masala", price: 130, type: "Non-Veg" },
      { name: "Egg Bhurji", price: 100, type: "Non-Veg" },
      { name: "Egg Bhurji Curry", price: 130, type: "Non-Veg" },
      { name: "Boil Egg", price: 40, type: "Non-Veg" },
      { name: "Egg Omellete", price: 70, type: "Non-Veg" },

      // ✅ Dal
      { name: "Plain Dal", price: 100, type: "Veg" },
      { name: "Jira Dal", price: 110, type: "Veg" },
      { name: "Dal Fry", price: 120, type: "Veg" },
      { name: "Dal Tadka", price: 140, type: "Veg" },
      { name: "Dal Kolhapuri", price: 140, type: "Veg" },
      { name: "Dal Mughlai", price: 140, type: "Veg" },
      { name: "Dal Mughlai (Non-Veg)", price: 160, type: "Non-Veg" },
    ],
  },

  {
    category: "Roti",
    type: "Veg",
    items: [
      { name: "Roti", price: 15 },
      { name: "Butter Roti", price: 20 },
      { name: "LachhaParatha", price: 40 },
      { name: "Butter Nan", price: 45 },
      { name: "Garlic Naan", price: 60 },
      { name: "Cheese Nan", price: 70 },
      { name: "Plain Nan", price: 40 },
      { name: "Aloo Paratha", price: 70 },
      { name: "Mix Kulcha", price: 60 },
      { name: "Butter Kulcha", price: 70 },
      { name: "Paneer Kulcha", price: 80 },
      { name: "Plain Kulcha", price: 40 },
    ],
  },

  {
    category: "Rice",
    type: "Mixed",
    items: [
      { name: "Plain Rice", half: 60, full: 100 },
      { name: "Jeera Rice", half: 70, full: 120 },
      { name: "Veg Pulao", price: 180, type: "Veg" },
      { name: "Veg Biryani", price: 180, type: "Veg" },
      { name: "Green Peas Pulao", price: 180, type: "Veg" },
      { name: "Paneer Pulao", price: 200, type: "Veg" },
      { name: "Namdev Rice", price: 180, type: "Veg" },
      { name: "Dal Khichadi", price: 150, type: "Veg" },

      { name: "Chicken Kashmiri Biryani", price: 260, type: "Non-Veg" },
      { name: "Chicken Biryani", price: 220, type: "Non-Veg" },
      { name: "Chicken Pulao", price: 220, type: "Non-Veg" },
      { name: "Mutton Biryani", price: 240, type: "Non-Veg" },
      { name: "Mutton Pulao", price: 240, type: "Non-Veg" },
      { name: "Hyderabadi Biryani", price: 260, type: "Non-Veg" },
      { name: "Egg Biryani", price: 200, type: "Non-Veg" },
      { name: "Egg Pulao", price: 180, type: "Non-Veg" },
    ],
  },
];
