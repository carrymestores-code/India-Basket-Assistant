const SAMPLE_ROUTES = [
  {
    kind: "Cheapest",
    key: "cheapest",
    store: "JioMart + DMart Ready",
    sources: ["JioMart", "DMart Ready", "Amazon Fresh"],
    priceFactor: 0.86,
    speedHours: "24-48h",
    trust: 78,
    availability: 82,
    link: "https://www.google.com/search?q=JioMart+DMart+Ready+grocery+offers+India",
    revenue: "Referral or basket convenience fee",
    reason:
      "Scheduled grocery routes usually win when the buyer can wait and wants the lowest total basket cost.",
  },
  {
    kind: "Fastest",
    key: "fastest",
    store: "Blinkit + Zepto",
    sources: ["Blinkit", "Zepto", "Instamart"],
    priceFactor: 1.08,
    speedHours: "10-30m",
    trust: 73,
    availability: 90,
    link: "https://www.google.com/search?q=Blinkit+Zepto+Instamart+grocery+delivery+India",
    revenue: "Urgent-route convenience fee",
    reason:
      "Quick commerce is strongest for missing kitchen items, emergency refills, and small baskets.",
  },
  {
    kind: "Best value",
    key: "best-value",
    store: "BigBasket + Amazon Fresh",
    sources: ["BigBasket", "Amazon Fresh", "JioMart"],
    priceFactor: 0.94,
    speedHours: "Same/next day",
    trust: 88,
    availability: 86,
    link: "https://www.google.com/search?q=BigBasket+Amazon+Fresh+grocery+offers+India",
    revenue: "Affiliate, seller lead, or premium comparison",
    reason:
      "A balanced route gives the user better brand confidence, selection, and savings without forcing only the cheapest option.",
  },
];

const form = document.querySelector("#needForm");
const routeGrid = document.querySelector("#routeGrid");
const tableBody = document.querySelector("#opportunityTable");
const opportunityCount = document.querySelector("#opportunityCount");
const resetButton = document.querySelector("#resetOpportunities");
const chatWindow = document.querySelector("#chatWindow");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const quickPrompts = document.querySelector(".quick-prompts");

const PRODUCT_GUIDE = {
  atta:
    "For atta, compare price per kg, pack size, brand trust, freshness date, and delivery fee. Best value route is usually BigBasket/Amazon Fresh; cheapest route is JioMart/DMart Ready; urgent refill route is Blinkit/Zepto/Instamart.",
  rice:
    "For rice, compare price per kg, grain type, 5kg vs 10kg packs, brand, and return policy. Scheduled grocery is usually better than quick commerce for monthly rice purchase.",
  oil:
    "For cooking oil, compare price per litre, brand, pack type, and active offers. Cheapest route often works well for sealed branded oil, but check delivery fee before final choice.",
  sugar:
    "For sugar, compare per kg price and basket delivery fee. It is usually a low-margin staple, so combine it with atta, rice, and oil instead of buying alone.",
  tea:
    "For tea, compare brand, grams, discount, and subscription offers. Best value can beat cheapest if the buyer prefers a trusted brand.",
  detergent:
    "For detergent, compare price per kg or litre, brand, pack size, and combo offers. Scheduled ecommerce routes often give better value than instant routes.",
  milk:
    "For milk and dairy, fastest and freshness matter more than lowest price. Use quick commerce or local delivery if the buyer needs it today.",
  vegetables:
    "For vegetables, quality and freshness matter. Best value route should prioritize reliable freshness, delivery slot, and refund support over only lowest price.",
  snacks:
    "For snacks and packaged food, check combo offers and delivery fee. JioMart/Amazon Fresh can work for planned purchases; quick commerce works for impulse demand.",
 };

let currentNeed = null;
let currentRoutes = [];
let opportunities = loadOpportunities();

function parseItems(value) {
  return value
    .split(/,|\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatRupees(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function calculateFit(route, priority) {
  const base = {
    cheapest: route.key === "cheapest" ? 98 : route.key === "best-value" ? 88 : 68,
    fastest: route.key === "fastest" ? 98 : route.key === "best-value" ? 80 : 64,
    "best-value": route.key === "best-value" ? 98 : route.key === "cheapest" ? 84 : 76,
