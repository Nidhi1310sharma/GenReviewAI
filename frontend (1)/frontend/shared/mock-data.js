/* ==========================================================================
   mock-data.js
   --------------------------------------------------------------------------
   Centralized dummy/mock data used throughout the frontend while there is
   no backend. This complements business-config.js (which holds config for
   the CURRENT logged-in business) by holding sample records and stats that
   pages render lists/charts from.

   When a real API exists, each of these constants is replaced by a fetch
   call — no other file needs to change its shape.
   ========================================================================== */

/* ---------- Businesses (full records, powers admin/businesses.html —
   Business Management. Each business carries everything the table, the
   View modal, and the Edit modal need, so no page duplicates this data
   or hardcodes it locally.) ---------- */
const businesses = [
  {
    id: 1, businessId: 'BUS-001', name: 'Cafe Aroma', owner: 'John Smith', category: 'Restaurant', city: 'Pune',
    rating: 4.8, reviewCount: 1264, status: 'active', email: 'hello@cafearoma.com', phone: '+91 98765 43210',
    joinedDate: '2026-01-12', qrScans: 3820, googleReviews: 940, thresholdRating: 4, logo: 'CA'
  },
  {
    id: 2, businessId: 'BUS-002', name: 'Urban Brew', owner: 'Emily Carter', category: 'Cafe', city: 'Mumbai',
    rating: 4.7, reviewCount: 952, status: 'pending', email: 'contact@urbanbrew.com', phone: '+91 98765 11223',
    joinedDate: '2026-06-28', qrScans: 1210, googleReviews: 410, thresholdRating: 4, logo: 'UB'
  },
  {
    id: 3, businessId: 'BUS-003', name: 'Bella Pizza', owner: 'Rahul Mehta', category: 'Restaurant', city: 'Pune',
    rating: 4.9, reviewCount: 2130, status: 'active', email: 'info@bellapizza.com', phone: '+91 98765 33445',
    joinedDate: '2025-11-03', qrScans: 5230, googleReviews: 1680, thresholdRating: 4, logo: 'BP'
  },
  {
    id: 4, businessId: 'BUS-004', name: 'Glow Salon', owner: 'Priya Nair', category: 'Salon', city: 'Bengaluru',
    rating: 4.9, reviewCount: 684, status: 'active', email: 'hello@glowsalon.com', phone: '+91 98765 55667',
    joinedDate: '2025-09-19', qrScans: 1540, googleReviews: 522, thresholdRating: 4, logo: 'GS'
  },
  {
    id: 5, businessId: 'BUS-005', name: 'Trendy Retail', owner: 'Karan Gill', category: 'Retail', city: 'Delhi',
    rating: 4.1, reviewCount: 318, status: 'suspended', email: 'support@trendyretail.com', phone: '+91 98765 77889',
    joinedDate: '2025-07-22', qrScans: 640, googleReviews: 190, thresholdRating: 4, logo: 'TR'
  },
  {
    id: 6, businessId: 'BUS-006', name: 'Wellness Clinic', owner: 'Dr. Ananya Kapoor', category: 'Clinic', city: 'Pune',
    rating: 4.6, reviewCount: 421, status: 'active', email: 'care@wellnessclinic.com', phone: '+91 98765 99001',
    joinedDate: '2026-02-14', qrScans: 980, googleReviews: 305, thresholdRating: 4, logo: 'WC'
  },
  {
    id: 7, businessId: 'BUS-007', name: 'Spice Route', owner: 'Vikram Kulkarni', category: 'Restaurant', city: 'Mumbai',
    rating: 4.4, reviewCount: 876, status: 'active', email: 'reservations@spiceroute.com', phone: '+91 98765 44556',
    joinedDate: '2025-12-08', qrScans: 2110, googleReviews: 640, thresholdRating: 4, logo: 'SR'
  },
  {
    id: 8, businessId: 'BUS-008', name: 'Brew & Bean', owner: 'Sneha Rao', category: 'Cafe', city: 'Bengaluru',
    rating: 4.5, reviewCount: 512, status: 'pending', email: 'hi@brewandbean.com', phone: '+91 98765 66778',
    joinedDate: '2026-06-30', qrScans: 730, googleReviews: 240, thresholdRating: 4, logo: 'BB'
  },
  {
    id: 9, businessId: 'BUS-009', name: 'Chic Boutique', owner: 'Meera Patil', category: 'Retail', city: 'Delhi',
    rating: 4.3, reviewCount: 289, status: 'suspended', email: 'orders@chicboutique.com', phone: '+91 98765 88990',
    joinedDate: '2025-08-30', qrScans: 480, googleReviews: 150, thresholdRating: 4, logo: 'CB'
  },
  {
    id: 10, businessId: 'BUS-010', name: 'Serene Spa', owner: 'Tanmay Nair', category: 'Salon', city: 'Pune',
    rating: 4.8, reviewCount: 604, status: 'active', email: 'book@serenespa.com', phone: '+91 98765 12121',
    joinedDate: '2026-03-05', qrScans: 1320, googleReviews: 470, thresholdRating: 4, logo: 'SS'
  }
];

/* ---------- Owners (full records, powers admin/owners.html — Owner
   Management. Each owner carries everything the table, the View modal,
   and the Edit modal need, so no page duplicates this data or hardcodes
   it locally.) ---------- */
const owners = [
  {
    ownerId: 'OWN-001', fullName: 'John Smith', email: 'john@cafearoma.com', phone: '+91 98765 43210',
    businessId: 'BUS-001', businessName: 'Cafe Aroma', category: 'Restaurant', city: 'Pune',
    role: 'Primary Owner', status: 'active', access: 'active', lastLogin: 'Today', joinedDate: '2026-01-12',
    avatar: 'JS', googleConnected: true, qrGenerated: 12
  },
  {
    ownerId: 'OWN-002', fullName: 'Emily Carter', email: 'contact@urbanbrew.com', phone: '+91 98765 11223',
    businessId: 'BUS-002', businessName: 'Urban Brew', category: 'Cafe', city: 'Mumbai',
    role: 'Primary Owner', status: 'pending', access: 'pending', lastLogin: 'Never', joinedDate: '2026-06-28',
    avatar: 'EC', googleConnected: false, qrGenerated: 3
  },
  {
    ownerId: 'OWN-003', fullName: 'Rahul Mehta', email: 'info@bellapizza.com', phone: '+91 98765 33445',
    businessId: 'BUS-003', businessName: 'Bella Pizza', category: 'Restaurant', city: 'Pune',
    role: 'Primary Owner', status: 'active', access: 'active', lastLogin: 'Yesterday', joinedDate: '2025-11-03',
    avatar: 'RM', googleConnected: true, qrGenerated: 18
  },
  {
    ownerId: 'OWN-004', fullName: 'Priya Nair', email: 'hello@glowsalon.com', phone: '+91 98765 55667',
    businessId: 'BUS-004', businessName: 'Glow Salon', category: 'Salon', city: 'Bengaluru',
    role: 'Manager', status: 'active', access: 'active', lastLogin: '2 days ago', joinedDate: '2025-09-19',
    avatar: 'PN', googleConnected: true, qrGenerated: 9
  },
  {
    ownerId: 'OWN-005', fullName: 'Karan Gill', email: 'support@trendyretail.com', phone: '+91 98765 77889',
    businessId: 'BUS-005', businessName: 'Trendy Retail', category: 'Retail', city: 'Delhi',
    role: 'Primary Owner', status: 'suspended', access: 'suspended', lastLogin: '3 weeks ago', joinedDate: '2025-07-22',
    avatar: 'KG', googleConnected: false, qrGenerated: 4
  },
  {
    ownerId: 'OWN-006', fullName: 'Dr. Ananya Kapoor', email: 'care@wellnessclinic.com', phone: '+91 98765 99001',
    businessId: 'BUS-006', businessName: 'Wellness Clinic', category: 'Clinic', city: 'Pune',
    role: 'Primary Owner', status: 'active', access: 'active', lastLogin: 'Today', joinedDate: '2026-02-14',
    avatar: 'AK', googleConnected: true, qrGenerated: 7
  },
  {
    ownerId: 'OWN-007', fullName: 'Vikram Kulkarni', email: 'reservations@spiceroute.com', phone: '+91 98765 44556',
    businessId: 'BUS-007', businessName: 'Spice Route', category: 'Restaurant', city: 'Mumbai',
    role: 'Read Only', status: 'active', access: 'active', lastLogin: '5 days ago', joinedDate: '2025-12-08',
    avatar: 'VK', googleConnected: true, qrGenerated: 11
  },
  {
    ownerId: 'OWN-008', fullName: 'Sneha Rao', email: 'hi@brewandbean.com', phone: '+91 98765 66778',
    businessId: 'BUS-008', businessName: 'Brew & Bean', category: 'Cafe', city: 'Bengaluru',
    role: 'Primary Owner', status: 'pending', access: 'pending', lastLogin: 'Never', joinedDate: '2026-06-30',
    avatar: 'SR', googleConnected: false, qrGenerated: 2
  },
  {
    ownerId: 'OWN-009', fullName: 'Meera Patil', email: 'orders@chicboutique.com', phone: '+91 98765 88990',
    businessId: 'BUS-009', businessName: 'Chic Boutique', category: 'Retail', city: 'Delhi',
    role: 'Manager', status: 'suspended', access: 'suspended', lastLogin: '1 month ago', joinedDate: '2025-08-30',
    avatar: 'MP', googleConnected: false, qrGenerated: 1
  },
  {
    ownerId: 'OWN-010', fullName: 'Tanmay Nair', email: 'book@serenespa.com', phone: '+91 98765 12121',
    businessId: 'BUS-010', businessName: 'Serene Spa', category: 'Salon', city: 'Pune',
    role: 'Primary Owner', status: 'active', access: 'active', lastLogin: '28 minutes ago', joinedDate: '2026-03-05',
    avatar: 'TN', googleConnected: true, qrGenerated: 14
  }
];

/* ---------- Owner Management KPIs (mirrors admin/owners.html KPI
   cards — platform-wide totals, independent of the 10 sample rows in
   `owners` above which only back the table itself) ---------- */
const ownerKpis = {
  total: 238,
  active: 221,
  pending: 9,
  suspended: 8
};

/* ---------- Owner Activity (mirrors admin/owners.html sidebar
   "Owner Activity" card — the Owner Management equivalent of
   businessInsights) ---------- */
const ownerActivity = {
  ownersOnline: 28,
  averageSession: '34 mins',
  businessesManaged: 245,
  inactiveAccounts: 7
};

/* ---------- Role Distribution (mirrors admin/owners.html sidebar
   horizontal progress bars) ---------- */
const roleDistribution = [
  { role: 'Primary Owners', percent: 92 },
  { role: 'Managers', percent: 6 },
  { role: 'Read Only', percent: 2 }
];

/* ---------- Recent Logins (mirrors admin/owners.html sidebar timeline) ---------- */
const recentLogins = [
  { name: 'John Smith', time: '5 minutes ago' },
  { name: 'Emily', time: '28 minutes ago' },
  { name: 'Rahul', time: 'Yesterday' }
];

/* ---------- AI Owner Insights (mirrors admin/owners.html premium AI
   card — the Owner Management equivalent of aiBusinessOverview) ---------- */
const aiOwnerInsights = {
  mostActiveOwner: 'John Smith',
  leastActiveOwners: 8,
  needingFollowUp: 5,
  loginFrequency: '4.8/week',
  recommendation: 'Follow up with inactive owners to improve platform adoption.'
};

/* ---------- Dashboard counts (mirrors owner/dashboard.html stat cards) ---------- */
const dashboardStats = {
  totalReviews: 128,
  averageRating: 4.8,
  positivePercent: 91,
  qrScansToday: 24
};

/* ---------- Reviews-page statistics (mirrors owner/reviews.html stat cards) ---------- */
const reviewsStats = {
  todaysReviews: 24,
  averageRating: 4.8,
  positivePercent: 91,
  negativePercent: 9
};

/* ---------- Analytics values (mirrors owner/analytics.html KPIs/charts) ---------- */
const analyticsData = {
  reviewTrend: [22, 35, 41, 58, 63, 78],
  sentiment: { positive: 88, neutral: 9, negative: 3 }
};

/* ---------- Recent reviews (used by owner/reviews.html review list) ---------- */
const recentReviews = [
  { id: 1, initials: 'RS', name: 'Rohan Sharma', overall: 5, food: 5, staff: 5, ambience: 4, cleanliness: 5, recommend: 'Definitely', sentiment: 'positive', text: 'The food was absolutely delicious and the staff were so attentive throughout our visit. Loved every bit of it!', time: '2 hours ago', date: new Date('2026-07-03T10:00:00'), ai: true, google: true },
  { id: 2, initials: 'AK', name: 'Ananya Kapoor', overall: 5, food: 5, staff: 4, ambience: 5, cleanliness: 5, recommend: 'Definitely', sentiment: 'positive', text: 'Loved the ambience, perfect place for a family dinner. Will definitely be back soon with friends.', time: '4 hours ago', date: new Date('2026-07-03T08:00:00'), ai: true, google: true },
  { id: 3, initials: 'MP', name: 'Meera Patil', overall: 4, food: 4, staff: 4, ambience: 4, cleanliness: 5, recommend: 'Maybe', sentiment: 'positive', text: 'Good food and friendly service, though we waited a little longer than expected during peak hours.', time: '6 hours ago', date: new Date('2026-07-03T06:00:00'), ai: true, google: false },
  { id: 4, initials: 'TN', name: 'Tanmay Nair', overall: 5, food: 5, staff: 5, ambience: 5, cleanliness: 5, recommend: 'Definitely', sentiment: 'positive', text: 'Fantastic experience from start to finish. The staff went above and beyond to make our anniversary special.', time: 'Yesterday', date: new Date('2026-07-02T18:00:00'), ai: true, google: true },
  { id: 5, initials: 'JD', name: 'Jaya Desai', overall: 3, food: 3, staff: 4, ambience: 2, cleanliness: 4, recommend: 'Maybe', sentiment: 'neutral', text: 'Food was decent but the place was a bit noisy for our taste. Staff were polite though and tried to help.', time: 'Yesterday', date: new Date('2026-07-02T14:00:00'), ai: true, google: false },
  { id: 6, initials: 'VK', name: 'Vikram Kulkarni', overall: 2, food: 2, staff: 3, ambience: 3, cleanliness: 3, recommend: 'No', sentiment: 'negative', text: 'Waited almost 40 minutes for our order and the food came out cold. Parking was also a hassle.', time: '2 days ago', date: new Date('2026-07-01T13:00:00'), ai: false, google: true },
  { id: 7, initials: 'SR', name: 'Sneha Rao', overall: 5, food: 5, staff: 5, ambience: 4, cleanliness: 5, recommend: 'Definitely', sentiment: 'positive', text: 'Absolutely wonderful! The coffee here is the best in town and the staff remembers our regular order.', time: '2 days ago', date: new Date('2026-07-01T10:00:00'), ai: true, google: true },
  { id: 8, initials: 'AB', name: 'Aditya Bose', overall: 4, food: 4, staff: 4, ambience: 4, cleanliness: 4, recommend: 'Definitely', sentiment: 'positive', text: 'Solid neighborhood cafe with consistent quality. A bit pricier than nearby options but worth it.', time: '3 days ago', date: new Date('2026-06-30T12:00:00'), ai: true, google: false },
  { id: 9, initials: 'PN', name: 'Priya Nambiar', overall: 1, food: 2, staff: 1, ambience: 2, cleanliness: 2, recommend: 'No', sentiment: 'negative', text: 'Disappointing visit. The staff seemed disinterested and our table wasn\'t cleaned before we sat down.', time: '4 days ago', date: new Date('2026-06-29T09:00:00'), ai: false, google: true },
  { id: 10, initials: 'KG', name: 'Karan Gill', overall: 4, food: 4, staff: 5, ambience: 4, cleanliness: 4, recommend: 'Definitely', sentiment: 'positive', text: 'Great spot for weekend brunch. The staff is always warm and welcoming, food comes out quick.', time: '5 days ago', date: new Date('2026-06-28T11:00:00'), ai: true, google: true }
];

/* ---------- Recent activity (e.g. for a future activity feed) ---------- */
const recentActivity = [
  { id: 1, type: 'review', message: 'New 5-star review from Rohan Sharma', time: '2 hours ago' },
  { id: 2, type: 'qr-scan', message: 'QR code scanned 8 times today', time: '3 hours ago' },
  { id: 3, type: 'reply', message: 'Reply sent to Vikram Kulkarni', time: '1 day ago' }
];

/* ---------- QR analytics (mirrors owner/qr-manage.html funnel/stat data) ---------- */
const qrAnalytics = {
  totalScans: 342,
  totalReviews: 128,
  conversionRate: 37,
  scansThisWeek: [12, 18, 9, 24, 30, 22, 15]
};

/* ---------- Platform-wide stats (mirrors admin/dashboard.html KPI cards) ----------
   Unlike dashboardStats above (one business), these numbers describe the
   entire Graphura ReviewFlow platform across every business/owner. */
const platformStats = {
  totalBusinesses: 245,
  totalOwners: 238,
  totalReviews: 18420,
  totalQrScans: 71350,
  totalAiReviews: 13875,
  platformHealth: 99.9
};

/* ---------- Platform growth (mirrors admin/dashboard.html line chart) ---------- */
const platformGrowth = {
  monthlyRegistrations: [28, 34, 41, 52, 60, 30],
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
};

/* ---------- Recent platform activity (mirrors admin/dashboard.html timeline) ---------- */
const platformActivity = [
  { id: 1, type: 'registration', message: 'Cafe Aroma registered', time: '5 min ago' },
  { id: 2, type: 'update', message: 'Urban Brew updated profile', time: '18 min ago' },
  { id: 3, type: 'qr', message: 'QR generated for Bella Pizza', time: 'Today' },
  { id: 4, type: 'owner', message: 'New owner account created', time: 'Today' },
  { id: 5, type: 'suspended', message: 'Business suspended', time: 'Yesterday' }
];

/* ---------- Recent businesses (mirrors admin/dashboard.html businesses table) ---------- */
const recentBusinesses = [
  { id: 'BUS001', name: 'Cafe Aroma', category: 'Restaurant', owner: 'John', status: 'active', rating: 4.8 },
  { id: 'BUS002', name: 'Urban Brew', category: 'Cafe', owner: 'Meera', status: 'active', rating: 4.6 },
  { id: 'BUS003', name: 'Bella Pizza', category: 'Restaurant', owner: 'Arjun', status: 'pending', rating: 4.3 },
  { id: 'BUS004', name: 'Glow Salon', category: 'Salon', owner: 'Priya', status: 'active', rating: 4.9 },
  { id: 'BUS005', name: 'Trendy Retail', category: 'Retail', owner: 'Karan', status: 'inactive', rating: 4.1 }
];

/* ---------- Business category distribution (mirrors admin/dashboard.html chart) ---------- */
const categoryDistribution = [
  { category: 'Restaurants', percent: 40 },
  { category: 'Cafes', percent: 25 },
  { category: 'Retail', percent: 20 },
  { category: 'Salons', percent: 15 }
];

/* ---------- Platform health (mirrors admin/dashboard.html health cards) ---------- */
const platformHealth = {
  server: 'Healthy',
  aiService: 'Operational',
  database: 'Healthy',
  storagePercent: 82,
  qrService: 'Running'
};

/* ---------- AI platform insights (mirrors admin/dashboard.html AI insights card) ---------- */
const aiPlatformInsights = {
  topCategory: 'Restaurants',
  needsAttention: 12,
  mostActiveCity: 'Pune',
  growthTrend: 18,
  recommendation: 'Focus onboarding campaigns towards salons and clinics.'
};

/* ---------- Business Management KPIs (mirrors admin/businesses.html
   KPI cards — platform-wide totals, independent of the 10 sample rows
   in `businesses` above which only back the table itself) ---------- */
const businessKpis = {
  total: 245,
  active: 228,
  pending: 11,
  suspended: 6
};

/* ---------- Business Insights (mirrors admin/businesses.html sidebar
   "Business Insights" card) ---------- */
const businessInsights = {
  topCategory: 'Restaurant',
  highestRated: 'Bella Pizza',
  mostReviews: 'Cafe Aroma',
  fastestGrowing: 'Urban Brew'
};

/* ---------- Recent Business Registrations (mirrors admin/businesses.html
   sidebar timeline) ---------- */
const recentBusinessRegistrations = [
  { name: 'Cafe Aroma', time: 'Today' },
  { name: 'Urban Brew', time: 'Yesterday' },
  { name: 'Bella Pizza', time: '2 days ago' }
];

/* ---------- AI Business Overview (mirrors admin/businesses.html premium
   AI card — the Business Management equivalent of aiPlatformInsights) ---------- */
const aiBusinessOverview = {
  topCategory: 'Restaurant',
  needingAttention: 6,
  averageRating: 4.74,
  growthTrend: 16,
  recommendation: 'Focus onboarding campaigns towards healthcare and salons.'
};

/* ---------- Platform Reviews (full records, powers admin/reviews.html —
   Review Monitoring. Each review carries everything the table, the View
   modal, and the timeline need, so no page duplicates this data or
   hardcodes it locally.) ---------- */
const platformReviews = [
  {
    id: 1, reviewId: 'REV-1001', businessId: 'BUS-001', business: 'Cafe Aroma', businessOwner: 'John Smith',
    category: 'Restaurant', customer: 'Aditi Sharma', city: 'Pune', rating: 5,
    aiGenerated: true, aiStatus: 'ai-generated', reviewStatus: 'published',
    text: 'Absolutely loved the coffee and the ambience — will definitely be back!',
    privateFeedback: '', googlePosted: true, qrSource: true, language: 'English', date: '2026-07-06'
  },
  {
    id: 2, reviewId: 'REV-1002', businessId: 'BUS-002', business: 'Urban Brew', businessOwner: 'Emily Carter',
    category: 'Cafe', customer: 'Rohan Deshmukh', city: 'Mumbai', rating: 2,
    aiGenerated: false, aiStatus: 'manual', reviewStatus: 'private',
    text: '', privateFeedback: "Coffee wasn't hot when it was served.",
    googlePosted: false, qrSource: true, language: 'English', date: '2026-07-06'
  },
  {
    id: 3, reviewId: 'REV-1003', businessId: 'BUS-003', business: 'Bella Pizza', businessOwner: 'Rahul Mehta',
    category: 'Restaurant', customer: 'Sana Khan', city: 'Pune', rating: 3,
    aiGenerated: false, aiStatus: 'manual', reviewStatus: 'private',
    text: '', privateFeedback: 'Tables were dirty when we were seated.',
    googlePosted: false, qrSource: true, language: 'English', date: '2026-07-05'
  },
  {
    id: 4, reviewId: 'REV-1004', businessId: 'BUS-004', business: 'Glow Salon', businessOwner: 'Priya Nair',
    category: 'Salon', customer: 'Neha Joshi', city: 'Bengaluru', rating: 5,
    aiGenerated: true, aiStatus: 'ai-generated', reviewStatus: 'published',
    text: 'The staff were wonderful and my haircut turned out perfect.',
    privateFeedback: '', googlePosted: true, qrSource: true, language: 'English', date: '2026-07-05'
  },
  {
    id: 5, reviewId: 'REV-1005', businessId: 'BUS-005', business: 'Trendy Retail', businessOwner: 'Karan Gill',
    category: 'Retail', customer: 'Ishaan Verma', city: 'Delhi', rating: 2,
    aiGenerated: true, aiStatus: 'ai-failed', reviewStatus: 'pending-sync',
    text: 'Staff behaviour was rude and unhelpful during checkout.',
    privateFeedback: '', googlePosted: false, qrSource: false, language: 'English', date: '2026-07-04'
  },
  {
    id: 6, reviewId: 'REV-1006', businessId: 'BUS-006', business: 'Wellness Clinic', businessOwner: 'Dr. Ananya Kapoor',
    category: 'Clinic', customer: 'Farhan Ali', city: 'Pune', rating: 5,
    aiGenerated: true, aiStatus: 'ai-generated', reviewStatus: 'published',
    text: 'Doctor was thorough and the clinic was spotless. Highly recommend.',
    privateFeedback: '', googlePosted: true, qrSource: true, language: 'English', date: '2026-07-04'
  },
  {
    id: 7, reviewId: 'REV-1007', businessId: 'BUS-007', business: 'Spice Route', businessOwner: 'Vikram Kulkarni',
    category: 'Restaurant', customer: 'Meher Kaur', city: 'Mumbai', rating: 4,
    aiGenerated: false, aiStatus: 'edited', reviewStatus: 'published',
    text: 'Great flavours, slightly long waiting time but worth it.',
    privateFeedback: '', googlePosted: true, qrSource: true, language: 'English', date: '2026-07-03'
  },
  {
    id: 8, reviewId: 'REV-1008', businessId: 'BUS-008', business: 'Brew & Bean', businessOwner: 'Sneha Rao',
    category: 'Cafe', customer: 'Aakash Iyer', city: 'Bengaluru', rating: 1,
    aiGenerated: false, aiStatus: 'manual', reviewStatus: 'private',
    text: '', privateFeedback: 'Pricing has gone up but portion sizes shrank.',
    googlePosted: false, qrSource: true, language: 'English', date: '2026-07-03'
  },
  {
    id: 9, reviewId: 'REV-1009', businessId: 'BUS-009', business: 'Chic Boutique', businessOwner: 'Meera Patil',
    category: 'Retail', customer: 'Divya Menon', city: 'Delhi', rating: 4,
    aiGenerated: true, aiStatus: 'ai-generated', reviewStatus: 'published',
    text: 'Nice collection and helpful staff, will shop here again.',
    privateFeedback: '', googlePosted: true, qrSource: true, language: 'English', date: '2026-07-02'
  },
  {
    id: 10, reviewId: 'REV-1010', businessId: 'BUS-010', business: 'Serene Spa', businessOwner: 'Tanmay Nair',
    category: 'Salon', customer: 'Kabir Malhotra', city: 'Pune', rating: 5,
    aiGenerated: true, aiStatus: 'ai-generated', reviewStatus: 'published',
    text: 'Best spa experience in the city, extremely relaxing.',
    privateFeedback: '', googlePosted: true, qrSource: true, language: 'English', date: '2026-07-02'
  },
  {
    id: 11, reviewId: 'REV-1011', businessId: 'BUS-002', business: 'Urban Brew', businessOwner: 'Emily Carter',
    category: 'Cafe', customer: 'Sameer Joshi', city: 'Mumbai', rating: 2,
    aiGenerated: false, aiStatus: 'manual', reviewStatus: 'private',
    text: '', privateFeedback: 'Cleanliness needs improvement, tables were sticky.',
    googlePosted: false, qrSource: true, language: 'English', date: '2026-07-01'
  },
  {
    id: 12, reviewId: 'REV-1012', businessId: 'BUS-004', business: 'Glow Salon', businessOwner: 'Priya Nair',
    category: 'Salon', customer: 'Ritika Bose', city: 'Bengaluru', rating: 3,
    aiGenerated: true, aiStatus: 'ai-draft', reviewStatus: 'pending-sync',
    text: 'Good service overall, though I waited longer than expected.',
    privateFeedback: '', googlePosted: false, qrSource: true, language: 'English', date: '2026-07-01'
  },
  {
    id: 13, reviewId: 'REV-1013', businessId: 'BUS-001', business: 'Cafe Aroma', businessOwner: 'John Smith',
    category: 'Restaurant', customer: 'Om Prakash', city: 'Pune', rating: 5,
    aiGenerated: true, aiStatus: 'ai-generated', reviewStatus: 'published',
    text: 'Consistently great food and friendly staff every time I visit.',
    privateFeedback: '', googlePosted: true, qrSource: true, language: 'English', date: '2026-06-30'
  },
  {
    id: 14, reviewId: 'REV-1014', businessId: 'BUS-007', business: 'Spice Route', businessOwner: 'Vikram Kulkarni',
    category: 'Restaurant', customer: 'Tara Singh', city: 'Mumbai', rating: 1,
    aiGenerated: true, aiStatus: 'ai-failed', reviewStatus: 'pending-sync',
    text: 'Food quality has dropped a lot compared to last year.',
    privateFeedback: '', googlePosted: false, qrSource: false, language: 'English', date: '2026-06-29'
  }
];

/* ---------- Review Monitoring KPI Cards ---------- */
const reviewKpis = {
  totalReviews: 18420,
  positiveReviews: 15970,
  privateFeedback: 1245,
  averageRating: 4.74,
  aiReviewsGenerated: 13875,
  reviewsToday: 182
};

/* ---------- Rating Distribution (mirrors admin/reviews.html bar chart) ---------- */
const reviewRatingDistribution = [
  { stars: 5, percent: 68 },
  { stars: 4, percent: 20 },
  { stars: 3, percent: 7 },
  { stars: 2, percent: 3 },
  { stars: 1, percent: 2 }
];

/* ---------- AI Review Insights (mirrors admin/reviews.html premium AI card) ---------- */
const aiReviewInsights = {
  averageAiUsage: 75,
  mostPositiveCategory: 'Restaurant',
  mostComplaints: 'Salon',
  risingRatings: 18,
  recommendation: 'Focus follow-up campaigns on businesses receiving repeated private feedback.'
};

/* ---------- Businesses Requiring Attention (mirrors admin/reviews.html
   sidebar table) ---------- */
const reviewBusinessesAttention = [
  { business: 'Urban Brew', issue: 'Low Ratings', reviews: 18 },
  { business: 'Style Studio', issue: 'High Complaint Rate', reviews: 12 },
  { business: 'Bella Pizza', issue: 'AI Disabled', reviews: 7 }
];

/* ---------- Complaint Categories (mirrors admin/reviews.html animated bars) ---------- */
const complaintCategories = [
  { label: 'Staff Behaviour', percent: 42 },
  { label: 'Food Quality', percent: 34 },
  { label: 'Cleanliness', percent: 28 },
  { label: 'Waiting Time', percent: 22 },
  { label: 'Pricing', percent: 16 }
];

/* ---------- Recent Private Feedback (mirrors admin/reviews.html card) ---------- */
const recentPrivateFeedback = [
  { business: 'Cafe Aroma', rating: 4, text: 'The waiting time was too long.' },
  { business: 'Urban Brew', rating: 2, text: "Coffee wasn't hot." },
  { business: 'Bella Pizza', rating: 3, text: 'Tables were dirty.' }
];

/* ---------- Review Activity Timeline (mirrors admin/reviews.html timeline) ---------- */
const reviewTimeline = [
  { label: '★★★★★ Review Submitted', time: '2 minutes ago' },
  { label: 'Private Feedback Received', time: '9 minutes ago' },
  { label: 'AI Review Generated', time: '17 minutes ago' },
  { label: 'Google Review Synced', time: 'Today' }
];

/* ---------- Platform Analytics Filter Data (mirrors admin/analytics.html
   — Platform Analytics. Keyed by time period chip value; each entry fully
   powers the KPI cards, growth charts, funnel, distributions, lists,
   AI usage, keyword cloud, peak hours, city split, AI insights and
   period-over-period comparison for that period.) ---------- */
const platformAnalyticsFilterData = {
  today: {
    kpis: {
      businesses: { count: 3, sub: '+3 registered today' },
      owners: { count: 5, sub: '92% active owners rate' },
      reviews: { count: 182, sub: 'Avg 4.78 / 5' },
      scans: { count: 640, sub: '28.4% conversion rate' },
      aiReviews: { count: 138, sub: '75.8% AI adoption rate' },
      avgRating: { count: 4.78, sub: 'Stable customer vibe' }
    },
    platformGrowth: { labels: ['6 AM', '12 PM', '6 PM', '12 AM'], data: [0, 1, 2, 3], title: 'Platform Growth — Businesses Registered Today' },
    reviewsGrowth: { labels: ['6 AM', '12 PM', '6 PM', '12 AM'], data: [20, 68, 132, 182], title: 'Reviews Growth — Cumulative Today' },
    funnel: { scans: 640, started: 300, completed: 220, sentToGoogle: 182 },
    ratings: [{ stars: 5, percent: 72 }, { stars: 4, percent: 18 }, { stars: 3, percent: 5 }, { stars: 2, percent: 3 }, { stars: 1, percent: 2 }],
    sentiment: { positive: 90, neutral: 7, negative: 3 },
    categories: [
      { name: 'Restaurant', rating: 4.8, count: 64 },
      { name: 'Cafe', rating: 4.7, count: 38 },
      { name: 'Salon', rating: 4.9, count: 24 },
      { name: 'Retail', rating: 4.2, count: 18 },
      { name: 'Clinic', rating: 4.6, count: 16 }
    ],
    topBusinesses: [
      { logo: 'BP', name: 'Bella Pizza', rating: 4.9, reviews: 38 },
      { logo: 'CA', name: 'Cafe Aroma', rating: 4.8, reviews: 32 },
      { logo: 'SS', name: 'Serene Spa', rating: 4.8, reviews: 22 },
      { logo: 'GS', name: 'Glow Salon', rating: 4.9, reviews: 19 },
      { logo: 'WC', name: 'Wellness Clinic', rating: 4.6, reviews: 14 }
    ],
    attentionBusinesses: [
      { name: 'Trendy Retail', issue: 'Low Ratings' },
      { name: 'Chic Boutique', issue: 'High Complaint Rate' },
      { name: 'Urban Brew', issue: 'AI Disabled' }
    ],
    aiUsage: { generated: 138, modified: 32, rejected: 12, rate: 75.8 },
    keywords: [
      { text: 'friendly staff', count: 42, type: 'positive' },
      { text: 'fast service', count: 36, type: 'positive' },
      { text: 'clean space', count: 29, type: 'positive' },
      { text: 'value for money', count: 22, type: 'neutral' },
      { text: 'long wait', count: 14, type: 'negative' },
      { text: 'noisy', count: 9, type: 'negative' }
    ],
    peakHours: [
      { hour: '8 AM - 10 AM', count: 64 },
      { hour: '12 PM - 2 PM', count: 118 },
      { hour: '6 PM - 8 PM', count: 172 },
      { hour: '8 PM - 10 PM', count: 140 }
    ],
    cities: [
      { city: 'Pune', reviews: 64, share: 35 },
      { city: 'Mumbai', reviews: 47, share: 26 },
      { city: 'Bengaluru', reviews: 38, share: 21 },
      { city: 'Delhi', reviews: 33, share: 18 }
    ],
    aiInsights: 'Today\'s activity is trending toward <strong>Restaurants</strong>, which lead adoption with a 4.8★ average. <strong>Pune</strong> remains the most active city with 35% of submissions. Consider nudging <strong>Trendy Retail</strong> and <strong>Chic Boutique</strong> owners toward enabling AI replies to lift today\'s adoption rate further.',
    monthlyComparison: { prevPeriod: 'yesterday', scansDiff: '+8.4%', reviewsDiff: '+6.1%', aiDiff: '+9.7%', ratingDiff: '+0.02' }
  },

  last7days: {
    kpis: {
      businesses: { count: 9, sub: '+9 registered this week' },
      owners: { count: 52, sub: '85% active owners rate' },
      reviews: { count: 1180, sub: 'Avg 4.75 / 5' },
      scans: { count: 4120, sub: '28.6% conversion rate' },
      aiReviews: { count: 865, sub: '73.3% AI adoption rate' },
      avgRating: { count: 4.75, sub: 'Stable customer vibe' }
    },
    platformGrowth: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], data: [1, 2, 3, 4, 6, 7, 9], title: 'Platform Growth — Businesses Registered' },
    reviewsGrowth: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], data: [120, 260, 410, 590, 780, 980, 1180], title: 'Reviews Growth — Cumulative Total' },
    funnel: { scans: 4120, started: 1980, completed: 1420, sentToGoogle: 1180 },
    ratings: [{ stars: 5, percent: 69 }, { stars: 4, percent: 20 }, { stars: 3, percent: 6 }, { stars: 2, percent: 3 }, { stars: 1, percent: 2 }],
    sentiment: { positive: 88, neutral: 9, negative: 3 },
    categories: [
      { name: 'Restaurant', rating: 4.76, count: 472 },
      { name: 'Cafe', rating: 4.68, count: 283 },
      { name: 'Salon', rating: 4.83, count: 177 },
      { name: 'Retail', rating: 4.24, count: 130 },
      { name: 'Clinic', rating: 4.6, count: 118 }
    ],
    topBusinesses: [
      { logo: 'BP', name: 'Bella Pizza', rating: 4.9, reviews: 214 },
      { logo: 'CA', name: 'Cafe Aroma', rating: 4.8, reviews: 168 },
      { logo: 'SS', name: 'Serene Spa', rating: 4.8, reviews: 122 },
      { logo: 'GS', name: 'Glow Salon', rating: 4.9, reviews: 104 },
      { logo: 'UB', name: 'Urban Brew', rating: 4.7, reviews: 96 }
    ],
    attentionBusinesses: [
      { name: 'Trendy Retail', issue: 'Low Ratings' },
      { name: 'Chic Boutique', issue: 'High Complaint Rate' },
      { name: 'Urban Brew', issue: 'AI Disabled' }
    ],
    aiUsage: { generated: 865, modified: 215, rejected: 100, rate: 73.3 },
    keywords: [
      { text: 'friendly staff', count: 218, type: 'positive' },
      { text: 'fast service', count: 190, type: 'positive' },
      { text: 'clean space', count: 156, type: 'positive' },
      { text: 'value for money', count: 112, type: 'neutral' },
      { text: 'long wait', count: 74, type: 'negative' },
      { text: 'noisy', count: 48, type: 'negative' }
    ],
    peakHours: [
      { hour: '8 AM - 10 AM', count: 340 },
      { hour: '12 PM - 2 PM', count: 410 },
      { hour: '6 PM - 8 PM', count: 620 },
      { hour: '8 PM - 10 PM', count: 480 }
    ],
    cities: [
      { city: 'Pune', reviews: 413, share: 35 },
      { city: 'Mumbai', reviews: 307, share: 26 },
      { city: 'Bengaluru', reviews: 248, share: 21 },
      { city: 'Delhi', reviews: 212, share: 18 }
    ],
    aiInsights: 'Over the past 7 days, <strong>Restaurants</strong> continued to lead engagement with a 4.76★ average across 472 reviews. <strong>Pune</strong> drove the most submissions at 35% share. AI adoption held steady at 73.3% — recommend spotlighting AI-reply wins with <strong>Trendy Retail</strong> and <strong>Chic Boutique</strong> to close the gap.',
    monthlyComparison: { prevPeriod: 'previous week', scansDiff: '+18.2%', reviewsDiff: '+15.4%', aiDiff: '+19.8%', ratingDiff: '+0.03' }
  },

  last30days: {
    kpis: {
      businesses: { count: 35, sub: '+35 registered this month' },
      owners: { count: 214, sub: '82% active owners rate' },
      reviews: { count: 5210, sub: 'Avg 4.76 / 5' },
      scans: { count: 18450, sub: '28.2% conversion rate' },
      aiReviews: { count: 3820, sub: '73.3% AI adoption rate' },
      avgRating: { count: 4.76, sub: 'Stable customer vibe' }
    },
    platformGrowth: { labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'], data: [6, 14, 24, 35], title: 'Platform Growth — Total Businesses' },
    reviewsGrowth: { labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'], data: [980, 2340, 3790, 5210], title: 'Reviews Growth — Cumulative Total' },
    funnel: { scans: 18450, started: 8900, completed: 6420, sentToGoogle: 5210 },
    ratings: [{ stars: 5, percent: 70 }, { stars: 4, percent: 19 }, { stars: 3, percent: 6 }, { stars: 2, percent: 3 }, { stars: 1, percent: 2 }],
    sentiment: { positive: 89, neutral: 8, negative: 3 },
    categories: [
      { name: 'Restaurant', rating: 4.75, count: 2085 },
      { name: 'Cafe', rating: 4.68, count: 1250 },
      { name: 'Salon', rating: 4.82, count: 790 },
      { name: 'Retail', rating: 4.25, count: 575 },
      { name: 'Clinic', rating: 4.6, count: 510 }
    ],
    topBusinesses: [
      { logo: 'BP', name: 'Bella Pizza', rating: 4.9, reviews: 2130 },
      { logo: 'GS', name: 'Glow Salon', rating: 4.9, reviews: 684 },
      { logo: 'SS', name: 'Serene Spa', rating: 4.8, reviews: 604 },
      { logo: 'CA', name: 'Cafe Aroma', rating: 4.8, reviews: 1264 },
      { logo: 'UB', name: 'Urban Brew', rating: 4.7, reviews: 952 }
    ],
    attentionBusinesses: [
      { name: 'Trendy Retail', issue: 'Low Ratings' },
      { name: 'Chic Boutique', issue: 'High Complaint Rate' },
      { name: 'Urban Brew', issue: 'AI Disabled' }
    ],
    aiUsage: { generated: 3820, modified: 940, rejected: 350, rate: 73.3 },
    keywords: [
      { text: 'friendly staff', count: 960, type: 'positive' },
      { text: 'fast service', count: 840, type: 'positive' },
      { text: 'clean space', count: 705, type: 'positive' },
      { text: 'value for money', count: 512, type: 'neutral' },
      { text: 'long wait', count: 318, type: 'negative' },
      { text: 'noisy', count: 204, type: 'negative' }
    ],
    peakHours: [
      { hour: '8 AM - 10 AM', count: 1480 },
      { hour: '12 PM - 2 PM', count: 1860 },
      { hour: '6 PM - 8 PM', count: 2640 },
      { hour: '8 PM - 10 PM', count: 2120 }
    ],
    cities: [
      { city: 'Pune', reviews: 1875, share: 36 },
      { city: 'Mumbai', reviews: 1400, share: 27 },
      { city: 'Bengaluru', reviews: 1096, share: 21 },
      { city: 'Delhi', reviews: 839, share: 16 }
    ],
    aiInsights: 'This month, <strong>Restaurants</strong> remained the top-performing category with a 4.75★ average across 2,085 reviews. <strong>Pune</strong> led with 36% of all submissions, and AI adoption reached 73.3% of published reviews. Recommend prioritizing onboarding follow-ups for <strong>Trendy Retail</strong> and <strong>Chic Boutique</strong> to lift their ratings and re-enable AI replies for <strong>Urban Brew</strong>.',
    monthlyComparison: { prevPeriod: 'previous month', scansDiff: '+24.1%', reviewsDiff: '+21.3%', aiDiff: '+26.8%', ratingDiff: '+0.05' }
  },

  last6months: {
    kpis: {
      businesses: { count: 142, sub: '+142 registered in 6 months' },
      owners: { count: 198, sub: '83% active owners rate' },
      reviews: { count: 26800, sub: 'Avg 4.74 / 5' },
      scans: { count: 94200, sub: '28.5% conversion rate' },
      aiReviews: { count: 19500, sub: '72.8% AI adoption rate' },
      avgRating: { count: 4.74, sub: 'Stable customer vibe' }
    },
    platformGrowth: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], data: [40, 66, 88, 112, 128, 142], title: 'Platform Growth — Total Businesses' },
    reviewsGrowth: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], data: [3200, 7800, 12400, 17900, 22600, 26800], title: 'Reviews Growth — Cumulative Total' },
    funnel: { scans: 94200, started: 44800, completed: 32600, sentToGoogle: 26800 },
    ratings: [{ stars: 5, percent: 68 }, { stars: 4, percent: 20 }, { stars: 3, percent: 7 }, { stars: 2, percent: 3 }, { stars: 1, percent: 2 }],
    sentiment: { positive: 87, neutral: 9, negative: 4 },
    categories: [
      { name: 'Restaurant', rating: 4.72, count: 10720 },
      { name: 'Cafe', rating: 4.65, count: 6432 },
      { name: 'Salon', rating: 4.79, count: 4288 },
      { name: 'Retail', rating: 4.18, count: 3216 },
      { name: 'Clinic', rating: 4.55, count: 2144 }
    ],
    topBusinesses: [
      { logo: 'BP', name: 'Bella Pizza', rating: 4.9, reviews: 2130 },
      { logo: 'CA', name: 'Cafe Aroma', rating: 4.8, reviews: 1264 },
      { logo: 'UB', name: 'Urban Brew', rating: 4.7, reviews: 952 },
      { logo: 'SR', name: 'Spice Route', rating: 4.4, reviews: 876 },
      { logo: 'GS', name: 'Glow Salon', rating: 4.9, reviews: 684 }
    ],
    attentionBusinesses: [
      { name: 'Trendy Retail', issue: 'Low Ratings' },
      { name: 'Chic Boutique', issue: 'High Complaint Rate' },
      { name: 'Urban Brew', issue: 'AI Disabled' }
    ],
    aiUsage: { generated: 19500, modified: 5200, rejected: 2100, rate: 72.8 },
    keywords: [
      { text: 'friendly staff', count: 4820, type: 'positive' },
      { text: 'fast service', count: 4120, type: 'positive' },
      { text: 'clean space', count: 3560, type: 'positive' },
      { text: 'value for money', count: 2480, type: 'neutral' },
      { text: 'long wait', count: 1560, type: 'negative' },
      { text: 'noisy', count: 980, type: 'negative' }
    ],
    peakHours: [
      { hour: '8 AM - 10 AM', count: 7200 },
      { hour: '12 PM - 2 PM', count: 9100 },
      { hour: '6 PM - 8 PM', count: 13400 },
      { hour: '8 PM - 10 PM', count: 10600 }
    ],
    cities: [
      { city: 'Pune', reviews: 9520, share: 35.5 },
      { city: 'Mumbai', reviews: 7100, share: 26.5 },
      { city: 'Bengaluru', reviews: 5630, share: 21 },
      { city: 'Delhi', reviews: 4550, share: 17 }
    ],
    aiInsights: 'Over the last 6 months, the platform added <strong>142 businesses</strong> and crossed <strong>26,800 reviews</strong>, led by the Restaurant category at 4.72★. <strong>Pune</strong> continues to be the most active city at 35.5% share. AI adoption sits at 72.8% — recommend a targeted push toward Retail owners, the lowest-adopting category.',
    monthlyComparison: { prevPeriod: 'previous 6 months', scansDiff: '+31.4%', reviewsDiff: '+28.9%', aiDiff: '+33.2%', ratingDiff: '+0.06' }
  },

  lastyear: {
    kpis: {
      businesses: { count: 245, sub: '+245 registered this year' },
      owners: { count: 238, sub: '81% active owners rate' },
      reviews: { count: 18420, sub: 'Avg 4.74 / 5' },
      scans: { count: 71350, sub: '25.8% conversion rate' },
      aiReviews: { count: 13875, sub: '75.3% AI adoption rate' },
      avgRating: { count: 4.74, sub: 'Stable customer vibe' }
    },
    platformGrowth: { labels: ['Q1', 'Q2', 'Q3', 'Q4'], data: [58, 120, 178, 245], title: 'Platform Growth — Total Businesses' },
    reviewsGrowth: { labels: ['Q1', 'Q2', 'Q3', 'Q4'], data: [3800, 8600, 13200, 18420], title: 'Reviews Growth — Cumulative Total' },
    funnel: { scans: 71350, started: 34200, completed: 24800, sentToGoogle: 18420 },
    ratings: [{ stars: 5, percent: 67 }, { stars: 4, percent: 21 }, { stars: 3, percent: 7 }, { stars: 2, percent: 3 }, { stars: 1, percent: 2 }],
    sentiment: { positive: 86, neutral: 10, negative: 4 },
    categories: [
      { name: 'Restaurant', rating: 4.7, count: 7368 },
      { name: 'Cafe', rating: 4.65, count: 4605 },
      { name: 'Salon', rating: 4.8, count: 2763 },
      { name: 'Retail', rating: 4.2, count: 1842 },
      { name: 'Clinic', rating: 4.55, count: 1842 }
    ],
    topBusinesses: [
      { logo: 'BP', name: 'Bella Pizza', rating: 4.9, reviews: 2130 },
      { logo: 'CA', name: 'Cafe Aroma', rating: 4.8, reviews: 1264 },
      { logo: 'UB', name: 'Urban Brew', rating: 4.7, reviews: 952 },
      { logo: 'SR', name: 'Spice Route', rating: 4.4, reviews: 876 },
      { logo: 'GS', name: 'Glow Salon', rating: 4.9, reviews: 684 }
    ],
    attentionBusinesses: [
      { name: 'Trendy Retail', issue: 'Low Ratings' },
      { name: 'Chic Boutique', issue: 'High Complaint Rate' },
      { name: 'Urban Brew', issue: 'AI Disabled' }
    ],
    aiUsage: { generated: 13875, modified: 3200, rejected: 1345, rate: 75.3 },
    keywords: [
      { text: 'friendly staff', count: 3480, type: 'positive' },
      { text: 'fast service', count: 2960, type: 'positive' },
      { text: 'clean space', count: 2510, type: 'positive' },
      { text: 'value for money', count: 1780, type: 'neutral' },
      { text: 'long wait', count: 1120, type: 'negative' },
      { text: 'noisy', count: 690, type: 'negative' }
    ],
    peakHours: [
      { hour: '8 AM - 10 AM', count: 5200 },
      { hour: '12 PM - 2 PM', count: 6400 },
      { hour: '6 PM - 8 PM', count: 9600 },
      { hour: '8 PM - 10 PM', count: 7800 }
    ],
    cities: [
      { city: 'Pune', reviews: 6320, share: 34.3 },
      { city: 'Mumbai', reviews: 4780, share: 26 },
      { city: 'Bengaluru', reviews: 3980, share: 21.6 },
      { city: 'Delhi', reviews: 3340, share: 18.1 }
    ],
    aiInsights: 'Across the full year, the platform grew to <strong>245 businesses</strong> and <strong>18,420 reviews</strong> at a 4.74★ average. <strong>Pune</strong> led all cities with 34.3% share, and AI adoption closed the year at 75.3%. Recommend expanding onboarding campaigns into the Clinic and Retail categories, which trail the platform average.',
    monthlyComparison: { prevPeriod: 'previous year', scansDiff: '+42.6%', reviewsDiff: '+38.1%', aiDiff: '+45.9%', ratingDiff: '+0.08' }
  }
};

// Expose globally since the project currently has no bundler/module system.
window.businesses = businesses;
window.businessKpis = businessKpis;
window.businessInsights = businessInsights;
window.recentBusinessRegistrations = recentBusinessRegistrations;
window.aiBusinessOverview = aiBusinessOverview;
window.owners = owners;
window.ownerKpis = ownerKpis;
window.ownerActivity = ownerActivity;
window.roleDistribution = roleDistribution;
window.recentLogins = recentLogins;
window.aiOwnerInsights = aiOwnerInsights;
window.dashboardStats = dashboardStats;
window.reviewsStats = reviewsStats;
window.analyticsData = analyticsData;
window.recentReviews = recentReviews;
window.recentActivity = recentActivity;
window.qrAnalytics = qrAnalytics;
window.platformStats = platformStats;
window.platformGrowth = platformGrowth;
window.platformActivity = platformActivity;
window.recentBusinesses = recentBusinesses;
window.categoryDistribution = categoryDistribution;
window.platformHealth = platformHealth;
window.aiPlatformInsights = aiPlatformInsights;
window.platformReviews = platformReviews;
window.reviewKpis = reviewKpis;
window.reviewRatingDistribution = reviewRatingDistribution;
window.aiReviewInsights = aiReviewInsights;
window.reviewBusinessesAttention = reviewBusinessesAttention;
window.complaintCategories = complaintCategories;
window.recentPrivateFeedback = recentPrivateFeedback;
window.reviewTimeline = reviewTimeline;
window.platformAnalyticsFilterData = platformAnalyticsFilterData;