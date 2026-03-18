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
  logo: "https://scontent.fyto1-1.fna.fbcdn.net/v/t39.30808-6/641631710_122098342731284106_8631249794886951697_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=gq3SOlNWMYsQ7kNvwEO16kW&_nc_oc=AdlqTLNT5ncI74suiKjrtDhnnITogqAX6SBxdRLAgp9cTH6tfwFz9Ocrx4BkMyE0_5s&_nc_zt=23&_nc_ht=scontent.fyto1-1.fna&_nc_gid=xoePapzO-aKZbkKYAG6S1g&_nc_ss=8&oh=00_Afz4PIEMQZF9Ie8kM61_4kBJKlNcmxAwKFOVtg28Ts_ZeA&oe=69BF8D3D",
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

function IconLink({ href, icon: Icon, label }) {
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
      <div className="deal-image-wrap">
        <img src={deal.image} alt={deal.title} className="deal-image" loading="lazy" />
        <div className="badge-row">
          <span className="badge badge-hot">{deal.discount}</span>
          <span className="badge badge-light">{deal.category}</span>
        </div>
      </div>

      <div className="deal-body">
        <h3 className="deal-title">{deal.title}</h3>
        <p className="deal-description">{deal.description}</p>

        <div className="price-row">
          <span className="price-current">{deal.price}</span>
          {hasOldPrice ? <span className="price-old">{deal.oldPrice}</span> : null}
        </div>

        <div className="deal-footer">
          <span className="deal-pick">Maple Deals Pick</span>
          <a className="deal-button" href={deal.link} target="_blank" rel="noreferrer noopener">
            View Deal <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function FeaturedCard({ deal }) {
  return (
    <div className="featured-card">
      <img src={deal.image} alt={deal.title} className="featured-image" loading="lazy" />
      <div className="featured-badges">
        <span className="badge badge-dark">Featured</span>
        <span className="badge badge-gold">{deal.discount}</span>
      </div>
      <h3 className="featured-title">{deal.title}</h3>
      <div className="featured-bottom">
        <span className="featured-price">{deal.price}</span>
        <ChevronRight size={16} />
      </div>
    </div>
  );
}

export default function App() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    let isMounted = true;

    async function loadDeals() {
      try {
        setError("");

        const response = await fetch(SHEET_URL);
        if (!response.ok) {
          throw new Error(`Failed to load sheet: ${response.status}`);
        }

        const data = await response.json();
        const normalizedDeals = data.map((row, index) => normalizeDeal(row, index));

        if (isMounted) {
          setDeals(normalizedDeals);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load deals");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDeals();

    const intervalId = setInterval(loadDeals, 60000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
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
      const matchesCategory = activeCategory === "All" || deal.category === activeCategory;
      const matchesSearch =
        !q ||
        deal.title.toLowerCase().includes(q) ||
        deal.description.toLowerCase().includes(q) ||
        deal.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [publishedDeals, search, activeCategory]);

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-gradient-line" />
        <div className="container">
          <div className="announcement-grid">
            {["🍁 Curated Canada Finds", "✨ Elegant Everyday Deals", "🔥 Fresh Daily Picks"].map((item) => (
              <div key={item} className="announcement-card">
                {item}
              </div>
            ))}
          </div>

          <div className="hero-grid">
            <div>
              <div className="eyebrow">
                <Flame size={16} />
                Curated savings, beautifully organized
              </div>

              <div className="brand-row">
                <div className="brand-logo-shell">
                  <img src={brand.logo} alt="Maple Deals logo" className="brand-logo" />
                </div>
                <div>
                  <p className="brand-name">Maple Deals</p>
                  <p className="brand-subtitle">
                    <MapPin size={14} />
                    Amazon Canada Finds
                  </p>
                </div>
              </div>

              <h1 className="hero-title">Luxury style. Smart prices. Daily deals worth opening.</h1>
              <p className="hero-copy">
                Discover beautifully curated Amazon Canada deals across home, beauty, tech, pets, office, and more — all in one elevated shopping experience.
              </p>

              <div className="hero-actions">
                <div className="socials">
                  {socials.map((social) => (
                    <IconLink key={social.label} {...social} />
                  ))}
                </div>

                <button
                  type="button"
                  className="primary-cta"
                  onClick={() => {
                    document.getElementById("latest-deals")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <ShoppingBag size={18} />
                  Browse Deals
                </button>

                <button type="button" className="secondary-cta">
                  <Tag size={18} />
                  Updated From Sheet
                </button>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <p>Live Deals</p>
                  <strong>{publishedDeals.length}</strong>
                </div>
                <div className="stat-card">
                  <p>Categories</p>
                  <strong>{categories.length - 1}+</strong>
                </div>
                <div className="stat-card">
                  <p>Refresh Rate</p>
                  <strong>1 Min</strong>
                </div>
              </div>
            </div>

            <div className="featured-panel-wrap">
              <div className="top-picks-label">Featured Picks</div>

              <div className="featured-panel">
                <div className="featured-header">
                  <div>
                    <p>Handpicked Highlights</p>
                    <h2>Maple Deals Edit</h2>
                  </div>
                  <Star size={18} />
                </div>

                <div className="featured-grid">
                  {featuredDeals.length ? (
                    featuredDeals.map((deal) => <FeaturedCard key={deal.id} deal={deal} />)
                  ) : (
                    <div className="empty-state">
                      <strong>No featured deals yet</strong>
                      <p>Set Featured = TRUE in your sheet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container content-section" id="latest-deals">
        <div className="spotlight-grid">
          {[
            { title: "Refined Home", text: "Elegant upgrades and practical finds for everyday living.", tone: "warm" },
            { title: "Beauty & Self-Care", text: "Popular treatments, tools, and polished essentials.", tone: "light" },
            { title: "Tech & Lifestyle", text: "Smart devices and trending buys worth watching.", tone: "gold" },
          ].map((item) => (
            <div key={item.title} className={`spotlight-card ${item.tone}`}>
              <p>Collection Spotlight</p>
              <h3>{item.title}</h3>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        <div className="search-panel">
          <div>
            <h2>Latest Deals</h2>
            <p>Search and browse live products pulled directly from your Google Sheet.</p>
          </div>

          <label className="search-input-wrap" aria-label="Search deals">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search deals..."
            />
          </label>
        </div>

        <div className="category-row">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={activeCategory === category ? "category-pill active" : "category-pill"}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="latest-strip">
          <Zap size={16} />
          <span>Live from your Google Sheet</span>
        </div>

        {loading ? (
          <div className="empty-state">
            <strong>Loading deals...</strong>
            <p>Your sheet data is being pulled in now.</p>
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
                <p>Try another search or category, or mark rows as Posted in your sheet.</p>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="container footer-wrap">
        <div className="footer-banner">
          <div>
            <p className="footer-eyebrow">Luxury feel, automated workflow</p>
            <h2>Your site now looks curated and updates from your sheet automatically.</h2>
            <span>
              Add or edit rows in Google Sheets, set Post Status to Posted, and your site refreshes with the new products automatically.
            </span>
          </div>

          <div className="footer-card">
            <p>Recommended next steps</p>
            <ul>
              <li>Use Featured = TRUE to control top homepage picks</li>
              <li>Use Post Status = Scheduled for deals waiting to go live</li>
              <li>Connect Make.com next for Instagram, Facebook, and Pinterest posting</li>
              <li>Add an affiliate disclosure and custom domain when ready</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
