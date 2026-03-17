import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Search,
  Tag,
  ShoppingBag,
  Flame,
  MapPin,
  ChevronRight,
  Star,
  Zap,
  Instagram,
  Facebook,
  Pin,
} from "lucide-react";

const SHEET_URL =
  "https://opensheet.elk.sh/1h60w_zFQgNwKzrnU3t2ky7gT8m_b2dynnaty5ZbCGCw/Sheet1";

const categories = ["All", "Tech", "Office", "Sports", "Pets", "Home", "Beauty", "Bed", "Fashion"];

const brand = {
  logo: "https://scontent.fyto1-1.fna.fbcdn.net/v/t39.30808-6/641631710_122098342731284106_8631249794886951697_n.jpg",
};

const socials = [
  { href: "https://www.instagram.com/dealsmaple/", icon: Instagram, label: "Instagram" },
  { href: "https://www.facebook.com/profile.php?id=61588523198142", icon: Facebook, label: "Facebook" },
  { href: "https://ca.pinterest.com/atozdealscanada/", icon: Pin, label: "Pinterest" },
];

function isTrue(value) {
  return String(value).trim().toUpperCase() === "TRUE";
}

function normalizeDeal(rawDeal, index) {
  return {
    id: index + 1,
    title: String(rawDeal.Title || "Untitled Deal").trim(),
    category: String(rawDeal.Category || "Other").trim(),
    price: String(rawDeal.Price || "").trim(),
    oldPrice: String(rawDeal["Old Price"] || "").trim(),
    discount: String(rawDeal.Discount || "Deal").trim(),
    description: String(rawDeal.Description || "").trim(),
    link: String(rawDeal.Link || "#").trim(),
    image: String(rawDeal["Image URL"] || "").trim(),
    featured: isTrue(rawDeal.Featured),
    postStatus: String(rawDeal["Post Status"] || "Draft").trim(),
    postDate: String(rawDeal["Post Date"] || "").trim(),
  };
}

function SocialIcon({ href, icon: Icon, label }) {
  return (
    <a className="social-link" href={href} target="_blank" rel="noreferrer noopener" aria-label={label}>
      <Icon size={16} />
    </a>
  );
}

function DealCard({ deal }) {
  const hasOldPrice = deal.oldPrice && deal.oldPrice !== deal.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="deal-card"
    >
      <img src={deal.image} alt={deal.title} loading="lazy" />
      <h3 className="deal-title">{deal.title}</h3>
      <p className="deal-description">{deal.description}</p>

      <div className="price-row">
        <span className="price-current">{deal.price}</span>
        {hasOldPrice ? <span className="price-old">{deal.oldPrice}</span> : null}
      </div>

      <a className="deal-button" href={deal.link} target="_blank" rel="noreferrer noopener">
        View Deal <ExternalLink size={14} style={{ marginLeft: 6, verticalAlign: "middle" }} />
      </a>
    </motion.div>
  );
}

function FeaturedCard({ deal }) {
  return (
    <div className="featured-card">
      <img src={deal.image} alt={deal.title} loading="lazy" />
      <h4>{deal.title}</h4>
      <strong>{deal.price}</strong>
    </div>
  );
}

export default function App() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    async function loadDeals() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(SHEET_URL);
        if (!response.ok) {
          throw new Error(`Failed to load sheet: ${response.status}`);
        }

        const data = await response.json();
        setDeals(data.map(normalizeDeal));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load deals");
      } finally {
        setLoading(false);
      }
    }

    loadDeals();
  }, []);

  const publishedDeals = useMemo(() => {
    return deals.filter((deal) => deal.postStatus === "Posted");
  }, [deals]);

  const featuredDeals = useMemo(() => {
    return publishedDeals.filter((deal) => deal.featured).slice(0, 4);
  }, [publishedDeals]);

  const filteredDeals = useMemo(() => {
    const q = search.trim().toLowerCase();

    return publishedDeals.filter((deal) => {
      const matchesCategory = category === "All" || deal.category === category;
      const matchesSearch =
        !q ||
        deal.title.toLowerCase().includes(q) ||
        deal.description.toLowerCase().includes(q) ||
        deal.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [publishedDeals, search, category]);

  return (
    <div className="page">
      <section className="hero">
        <div className="container">
          <div style={{ marginBottom: 24, display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))" }}>
            {["🍁 Amazon Canada Finds", "🔥 Fresh Daily Deals", "⚡ Big Savings Fast"].map((item) => (
              <div key={item} className="announcement-card">
                {item}
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gap: 40, gridTemplateColumns: "1.2fr 0.8fr" }}>
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 16px",
                  border: "2px solid #000",
                  borderRadius: 999,
                  background: "#fff",
                  color: "#d70000",
                  fontWeight: 900,
                  marginBottom: 20,
                }}
              >
                <Flame size={16} />
                Amazon Canada savings in one place
              </div>

              <div className="brand-row">
                <img src={brand.logo} alt="Maple Deals logo" className="brand-logo" />
                <div>
                  <p className="brand-name">Maple Deals</p>
                  <p className="brand-subtitle">
                    <MapPin size={14} style={{ marginRight: 6 }} />
                    Amazon Canada Savings
                  </p>
                </div>
              </div>

              <h1 className="hero-title">Score the hottest deals before they’re gone.</h1>
              <p className="hero-copy">
                Maple Deals brings you the best Amazon Canada deals in one place — updated daily with top picks, trending finds, and real savings.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginBottom: 24 }}>
                <div>
                  {socials.map((social) => (
                    <SocialIcon key={social.label} {...social} />
                  ))}
                </div>

                <button className="primary-cta">
                  <ShoppingBag size={16} style={{ marginRight: 6 }} />
                  Browse Deals
                </button>

                <button className="secondary-cta">
                  <Tag size={16} style={{ marginRight: 6 }} />
                  New Deals Daily
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: 16,
                }}
              >
                <div className="stat-card">
                  <p>Deals Posted</p>
                  <strong>{publishedDeals.length}</strong>
                </div>
                <div className="stat-card">
                  <p>Categories</p>
                  <strong>{categories.length - 1}+</strong>
                </div>
                <div className="stat-card">
                  <p>Savings</p>
                  <strong>Up to 54%</strong>
                </div>
              </div>
            </div>

            <div>
              <h2 style={{ marginBottom: 16 }}>🔥 Featured Deals</h2>
              <div className="featured-grid">
                {featuredDeals.map((deal) => (
                  <FeaturedCard key={deal.id} deal={deal} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <div style={{ marginBottom: 24, display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))" }}>
          {[
            { title: "Top Tech Deals", text: "Trending gadgets, PC finds, and smart buys." },
            { title: "Home & Office", text: "Useful everyday picks for your space." },
            { title: "Pet & Lifestyle", text: "Fun finds, cozy buys, and popular picks." },
          ].map((item) => (
            <div key={item.title} className="featured-card">
              <p style={{ fontSize: 12, textTransform: "uppercase", color: "#777", marginBottom: 8 }}>
                Category Spotlight
              </p>
              <h3 style={{ marginBottom: 8 }}>{item.title}</h3>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        <div className="search-panel">
          <h2 style={{ marginBottom: 12 }}>Latest Deals</h2>
          <p style={{ marginBottom: 12, color: "#666" }}>
            Browse deals by category to quickly find exactly what you’re looking for.
          </p>

          <label className="search-input-wrap">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search deals..."
            />
          </label>
        </div>

        <div className="category-row">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={category === c ? "category-pill active" : "category-pill"}
            >
              {c}
            </button>
          ))}
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#090909",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: 14,
            marginBottom: 20,
            border: "2px solid #000",
          }}
        >
          <Zap size={16} />
          <span>Browse the latest Maple Deals picks</span>
        </div>

        {loading ? (
          <div className="empty-state">
            <strong>Loading deals...</strong>
          </div>
        ) : error ? (
          <div className="empty-state">
            <strong>Could not load deals</strong>
            <p>{error}</p>
          </div>
        ) : (
          <div className="deals-grid">
            {filteredDeals.length ? (
              filteredDeals.map((deal) => <DealCard key={deal.id} deal={deal} />)
            ) : (
              <div className="empty-state">
                <strong>No deals found</strong>
                <p>Try another search or category.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
