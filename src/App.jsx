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
  { href: "https://www.instagram.com/dealsmaple/", icon: Instagram },
  { href: "https://www.facebook.com/profile.php?id=61588523198142", icon: Facebook },
  { href: "https://ca.pinterest.com/atozdealscanada/", icon: Pin },
];

function isTrue(value) {
  return String(value).trim().toUpperCase() === "TRUE";
}

function normalizeDeal(raw, index) {
  return {
    id: index + 1,
    title: (raw.Title || "").trim(),
    price: raw.Price || "",
    oldPrice: raw["Old Price"] || "",
    discount: raw.Discount || "",
    description: raw.Description || "",
    link: raw.Link || "#",
    image: raw["Image URL"] || "",
    category: raw.Category || "Other",
    featured: isTrue(raw.Featured),
    status: (raw["Post Status"] || "").trim(),
  };
}

function DealCard({ deal }) {
  return (
    <div className="deal-card">
      <img src={deal.image} alt={deal.title} />
      <h3>{deal.title}</h3>
      <p>{deal.description}</p>

      <div>
        <strong>{deal.price}</strong>
        {deal.oldPrice && <span style={{ textDecoration: "line-through", marginLeft: 8 }}>{deal.oldPrice}</span>}
      </div>

      <a href={deal.link} target="_blank" rel="noreferrer">
        View Deal <ExternalLink size={14} />
      </a>
    </div>
  );
}

function FeaturedCard({ deal }) {
  return (
    <div className="featured-card">
      <img src={deal.image} alt={deal.title} />
      <h4>{deal.title}</h4>
      <strong>{deal.price}</strong>
    </div>
  );
}

export default function App() {
  const [deals, setDeals] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetch(SHEET_URL)
      .then((res) => res.json())
      .then((data) => {
        const cleaned = data.map(normalizeDeal);
        setDeals(cleaned);
      })
      .catch((err) => console.error(err));
  }, []);

  const published = useMemo(() => {
    return deals.filter((d) => d.status === "Posted");
  }, [deals]);

  const featured = useMemo(() => {
    return published.filter((d) => d.featured).slice(0, 4);
  }, [published]);

  const filtered = useMemo(() => {
    return published.filter((d) => {
      const matchesCategory = category === "All" || d.category === category;
      const matchesSearch =
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [published, search, category]);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🍁 Maple Deals</h1>

      <input
        placeholder="Search deals..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: 8, marginBottom: 20, width: "100%" }}
      />

      <div style={{ marginBottom: 20 }}>
        {categories.map((c) => (
          <button key={c} onClick={() => setCategory(c)} style={{ marginRight: 8 }}>
            {c}
          </button>
        ))}
      </div>

      <h2>🔥 Featured Deals</h2>
      <div style={{ display: "flex", gap: 10 }}>
        {featured.map((d) => (
          <FeaturedCard key={d.id} deal={d} />
        ))}
      </div>

      <h2 style={{ marginTop: 30 }}>🛒 All Deals</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px,1fr))", gap: 20 }}>
        {filtered.map((d) => (
          <DealCard key={d.id} deal={d} />
        ))}
      </div>
    </div>
  );
}
