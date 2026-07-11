/* ==========================================================================
   question-config.js
   --------------------------------------------------------------------------
   Category-based question sets used by the "Tell us about your experience"
   (tags.html) page. The questionnaire page reads `business.category` from
   business-config.js and pulls the matching array from here instead of
   having the questions hardcoded in HTML.

   "Overall Experience" and "Would you recommend us?" are intentionally NOT
   here — they are common to every business category and stay on
   rating.html as-is.

   To support a new business category, just add a new key below.
   ========================================================================== */

const questionSets = {

  Restaurant: [
    { key: "food",        icon: "🍽️", label: "Food Quality" },
    { key: "staff",       icon: "🤝", label: "Staff Behaviour" },
    { key: "ambience",    icon: "🏡", label: "Ambience" },
    { key: "cleanliness", icon: "✨", label: "Cleanliness" },
    { key: "value",       icon: "💰", label: "Value for Money" }
  ],

  Cafe: [
    { key: "coffee",    icon: "☕", label: "Coffee Quality" },
    { key: "food",      icon: "🍽️", label: "Food Quality" },
    { key: "ambience",  icon: "🏡", label: "Ambience" },
    { key: "service",   icon: "🤝", label: "Service" }
  ],

  Bakery: [
    { key: "product",     icon: "🥐", label: "Product Quality" },
    { key: "freshness",   icon: "✨", label: "Freshness" },
    { key: "staff",       icon: "🤝", label: "Staff Behaviour" },
    { key: "value",       icon: "💰", label: "Value for Money" }
  ],

  Salon: [
    { key: "service",     icon: "💇", label: "Service Quality" },
    { key: "staff",       icon: "🤝", label: "Staff Behaviour" },
    { key: "cleanliness", icon: "✨", label: "Cleanliness" },
    { key: "waiting",     icon: "⏳", label: "Waiting Time" }
  ],

  Hotel: [
    { key: "room",        icon: "🛏️", label: "Room Comfort" },
    { key: "staff",       icon: "🤝", label: "Staff Behaviour" },
    { key: "cleanliness", icon: "✨", label: "Cleanliness" },
    { key: "amenities",   icon: "🏊", label: "Amenities" }
  ],

  Spa: [
    { key: "service",     icon: "💆", label: "Service Quality" },
    { key: "staff",       icon: "🤝", label: "Staff Behaviour" },
    { key: "cleanliness", icon: "✨", label: "Cleanliness" },
    { key: "ambience",    icon: "🏡", label: "Ambience" }
  ],

  Gym: [
    { key: "equipment",   icon: "🏋️", label: "Equipment Quality" },
    { key: "staff",       icon: "🤝", label: "Trainer/Staff Behaviour" },
    { key: "cleanliness", icon: "✨", label: "Cleanliness" },
    { key: "value",       icon: "💰", label: "Value for Money" }
  ],

  Clinic: [
    { key: "care",        icon: "🩺", label: "Quality of Care" },
    { key: "staff",       icon: "🤝", label: "Staff Behaviour" },
    { key: "cleanliness", icon: "✨", label: "Cleanliness" },
    { key: "waiting",     icon: "⏳", label: "Waiting Time" }
  ],

  Boutique: [
    { key: "product",    icon: "🛍️", label: "Product Quality" },
    { key: "collection", icon: "👗", label: "Collection" },
    { key: "staff",      icon: "🤝", label: "Staff Behaviour" },
    { key: "experience", icon: "🏬", label: "Store Experience" }
  ]

};

// Expose globally since the project currently has no bundler/module system.
window.questionSets = questionSets;
