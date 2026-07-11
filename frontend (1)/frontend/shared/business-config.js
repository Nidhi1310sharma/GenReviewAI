/* ==========================================================================
   business-config.js
   --------------------------------------------------------------------------
   Single source of truth for everything that is specific to ONE business.
   Today this is a static object. Tomorrow, this file (or the `business`
   object it exposes) will simply be replaced by data fetched from the
   backend using the business/session ID — no other file needs to change.

   Every page that needs a business value (name, logo, rating, category,
   review link, etc.) should read it from `window.business` instead of
   hardcoding it in the HTML.
   ========================================================================== */

const business = {
  id: "BUS001",
  name: "Cafe Aroma",
  category: "Restaurant",          // Must match a key in question-config.js
  logoInitials: "CA",              // Fallback shown while/if no image logo exists
  logoImage: "../assets/logos/cafe-aroma.png",
  googleRating: 4.8,
  googleReviewUrl: "https://g.page/r/cafearoma/review",
  googlePlaceId: "",
  reviewLink: "https://graphura.ai/r/cafe-aroma",
  threshold: 4,                    // Placeholder: backend will use this to route
                                    // customers to the AI Review page (>= threshold)
                                    // or the Private Feedback page (< threshold)
  phone: "+91 98765 43210",
  email: "hello@cafearoma.com",
  website: "https://cafearoma.com",
  description: "A cozy neighborhood cafe serving handcrafted coffee and fresh, seasonal food.",
  address: {
    line: "Shop No. 4, MG Road",
    city: "Pune",
    state: "Maharashtra",
    pin: "411001",
    country: "India"
  },
  aiPreferences: {
    tone: "Professional",
    length: "Short",
    emoji: true,
    language: "English"
  }
};

// Expose globally since the project currently has no bundler/module system.
window.business = business;
