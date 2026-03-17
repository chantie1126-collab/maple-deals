import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { motion } from "framer-motion";

const SHEET_ID = "1h60w_zFQgNwKzrnU3t2ky7gT8m_b2dynnaty5ZbCGCw";
const SHEET_GID = "0";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?gid=${SHEET_GID}&tqx=out:json`;
const categories = ["All", "Tech", "Office", "Sports", "Pets", "Home", "Beauty", "Bed", "Fashion"];

const brand = {
  logo: "https://scontent.fyto1-1.fna.fbcdn.net/v/t39.30808-6/641631710_122098342731284106_8631249794886951697_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=gq3SOlNWMYsQ7kNvwEO16kW&_nc_oc=AdlqTLNT5ncI74suiKjrtDhnnITogqAX6SBxdRLAgp9cTH6tfwFz9Ocrx4BkMyE0_5s&_nc_zt=23&_nc_ht=scontent.fyto1-1.fna&_nc_gid=xoePapzO-aKZbkKYAG6S1g&_nc_ss=8&oh=00_Afz4PIEMQZF9Ie8kM61_4kBJKlNcmxAwKFOVtg28Ts_ZeA&oe=69BF8D3D",
  colors: {
    red: "#d70000",
    gold: "#ffb400",
    orange: "#ff7a00",
    black: "#090909",
    gray: "#f3f4f6",
  },
};

function parseGoogleSheetResponse(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("Invalid Google Sheets response");
  }

  const json = JSON.parse(text.slice(start, end + 1));
  const cols = json.table.cols.map((col) => col.label);

  return json.table.rows.map((row, index) => {
    const item = { id: index + 1 };

    cols.forEach((label, colIndex) => {
      const cell = row.c[colIndex];
      item[label] = cell?.f ?? cell?.v ?? "";
    });

    return item;
  });
}

function isTrue(value) {
  return String(value).trim().toUpperCase() === "TRUE";
}

function normalizeDeal(rawDeal) {
  const normalizedStatus = String(rawDeal["Post Status"] || "Draft").trim();

  return {
    id: rawDeal.id,
    title: String(rawDeal.Title || "Untitled Deal").trim(),
    category: String(rawDeal.Category || "Other").trim(),
    price: String(rawDeal.Price || "").trim(),
    oldPrice: String(rawDeal["Old Price"] || "").trim(),
    discount: String(rawDeal.Discount || "Deal").trim(),
    description: String(rawDeal.Description || "").trim(),
    link: String(rawDeal.Link || "#").trim(),
    image: String(rawDeal["Image URL"] || "").trim(),
    featured: isTrue(rawDeal.Featured),
    postStatus: normalizedStatus,
    postDate: String(rawDeal["Post Date"] || "").trim(),
  };
}

function DealCard({ deal }) {
  const hasOldPrice = deal.oldPrice && deal.oldPrice !== deal.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="h-full"
    >
      <Card className="group h-full overflow-hidden rounded-[2rem] border-2 border-black bg-white shadow-[0_14px_0_0_rgba(0,0,0,0.9)] transition-transform duration-200 hover:-translate-y-1">
        <div className="relative overflow-hidden border-b-2 border-black">
          <img
            src={deal.image}
            alt={deal.title}
            className="h-52 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <Badge className="rounded-full border-2 border-black bg-[linear-gradient(135deg,#d70000_0%,#ff7a00_100%)] px-3 py-1 font-bold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.9)] hover:bg-[linear-gradient(135deg,#d70000_0%,#ff7a00_100%)]">
              {deal.discount}
            </Badge>
            <Badge
              variant="secondary"
              className="rounded-full border-2 border-black bg-white px-3 py-1 font-semibold text-neutral-900"
            >
              {deal.category}
            </Badge>
          </div>
        </div>

        <CardContent className="flex h-[calc(100%-13rem)] flex-col p-5">
          <div className="mb-3 flex items-start justify-between gap-3">
            <h3 className="text-lg font-black leading-tight text-neutral-950">
              {deal.title}
            </h3>
          </div>

          <p className="mb-4 text-sm leading-6 text-neutral-600">{deal.description}</p>

          <div className="mb-5 flex items-end gap-3 border-t-2 border-dashed border-black/15 pt-4">
            <span className="text-2xl font-bold text-neutral-950">{deal.price}</span>
            {hasOldPrice ? (
              <span className="pb-1 text-sm text-neutral-400 line-through">{deal.oldPrice}</span>
            ) : null}
          </div>

          <div className="mt-auto flex items-center justify-between gap-3">
            <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Maple Deals Pick
            </span>
            <Button
              asChild
              className="rounded-2xl border-2 border-black bg-[linear-gradient(135deg,#d70000_0%,#ff7a00_100%)] px-4 text-white shadow-[0_4px_0_0_rgba(0,0,0,0.9)] transition hover:translate-y-[1px] hover:bg-[linear-gradient(135deg,#d70000_0%,#ff7a00_100%)] hover:shadow-[0_3px_0_0_rgba(0,0,0,0.9)]"
            >
              <a href={deal.link} target="_blank" rel="noreferrer">
                View Deal <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function MapleDealsWebsite() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    let isMounted = true;

    async function loadDeals() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(SHEET_URL);
        if (!response.ok) {
          throw new Error(`Failed to load sheet: ${response.status}`);
        }

        const text = await response.text();
        const rows = parseGoogleSheetResponse(text);
        const normalizedDeals = rows.map(normalizeDeal);

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

    return () => {
      isMounted = false;
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
      const matchesCategory =
        activeCategory === "All" || deal.category === activeCategory;
      const matchesSearch =
        !q ||
        deal.title.toLowerCase().includes(q) ||
        deal.description.toLowerCase().includes(q) ||
        deal.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [publishedDeals, search, activeCategory]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.10),transparent_22%),linear-gradient(180deg,#f5f5f5_0%,#ffffff_42%,#f3f4f6_100%)] text-neutral-900">
      <section className="relative overflow-hidden border-b-4 border-black bg-[linear-gradient(180deg,#efefef_0%,#ffffff_55%,#f3f4f6_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,0,0,0.18),transparent_26%),radial-gradient(circle_at_left,rgba(255,180,0,0.18),transparent_24%)]" />
        <div className="absolute inset-x-0 top-0 h-4 bg-[linear-gradient(90deg,#090909_0%,#d70000_35%,#ff7a00_70%,#ffb400_100%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-14 md:px-10 lg:px-12 lg:py-20">
          <div className="mb-6 grid gap-3 md:grid-cols-3">
            {["Amazon Canada Finds", "🔥 Fresh Daily Deals", "⚡ Big Savings Fast"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-2xl border-2 border-black bg-white px-4 py-3 text-center text-sm font-black uppercase tracking-[0.18em] text-neutral-900 shadow-[0_6px_0_0_rgba(0,0,0,0.9)]"
                >
                  {item}
                </div>
              )
            )}
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.16em] text-red-700 shadow-[0_4px_0_0_rgba(0,0,0,0.9)]">
                <Flame className="h-4 w-4" />
                Amazon Canada savings in one place
              </div>

              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-[1.75rem] border-2 border-black bg-white p-2 shadow-[0_8px_0_0_rgba(0,0,0,0.9)]">
                  <img
                    src={brand.logo}
                    alt="Maple Deals logo"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.32em] text-neutral-500">
                    Maple Deals
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-neutral-700">
                    <MapPin className="h-4 w-4 text-red-600" />
                    Amazon Canada Savings
                  </p>
                </div>
              </div>

              <h1 className="max-w-4xl text-4xl font-black uppercase leading-none tracking-tight text-neutral-950 md:text-6xl lg:text-7xl">
                Score the hottest deals before they’re gone.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-700">
                Maple Deals brings you the best Amazon Canada deals in one place — updated daily with top picks, trending finds, and real savings.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="mr-2 flex items-center gap-3">
                  <a
                    href="https://www.instagram.com/dealsmaple/"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border-2 border-black bg-white p-2 shadow-[0_4px_0_0_rgba(0,0,0,0.9)] transition hover:translate-y-[1px]"
                  >
                    <Instagram className="h-4 w-4 text-black" />
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=61588523198142"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border-2 border-black bg-white p-2 shadow-[0_4px_0_0_rgba(0,0,0,0.9)] transition hover:translate-y-[1px]"
                  >
                    <Facebook className="h-4 w-4 text-black" />
                  </a>
                  <a
                    href="https://ca.pinterest.com/atozdealscanada/"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border-2 border-black bg-white p-2 shadow-[0_4px_0_0_rgba(0,0,0,0.9)] transition hover:translate-y-[1px]"
                  >
                    <Pin className="h-4 w-4 text-black" />
                  </a>
                </div>
                <Button className="rounded-2xl border-2 border-black bg-[linear-gradient(135deg,#d70000_0%,#ff7a00_100%)] px-5 py-6 text-base font-bold text-white shadow-[0_6px_0_0_rgba(0,0,0,0.9)] transition hover:translate-y-[1px] hover:bg-[linear-gradient(135deg,#d70000_0%,#ff7a00_100%)] hover:shadow-[0_5px_0_0_rgba(0,0,0,0.9)]">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Browse Deals
                </Button>
                <Button
                  variant="outline"
                  className="rounded-2xl border-2 border-black bg-white px-5 py-6 text-base font-bold text-neutral-900 shadow-[0_6px_0_0_rgba(0,0,0,0.9)] transition hover:translate-y-[1px] hover:bg-white hover:shadow-[0_5px_0_0_rgba(0,0,0,0.9)]"
                >
                  <Tag className="mr-2 h-5 w-5" />
                  New Deals Daily
                </Button>
              </div>

              <div className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-3">
                {[
                  { label: "Deals Posted", value: publishedDeals.length ? String(publishedDeals.length) : "Daily" },
                  { label: "Categories", value: `${categories.length - 1}+` },
                  { label: "Savings", value: "Up to 54%" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[1.5rem] border-2 border-black bg-white px-4 py-4 shadow-[0_6px_0_0_rgba(0,0,0,0.9)]"
                  >
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-neutral-500">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-2xl font-black text-neutral-950">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 -top-4 rounded-2xl border-2 border-black bg-[#ffb400] px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-black shadow-[0_6px_0_0_rgba(0,0,0,0.9)]">
                Top Picks
              </div>
              <div className="rounded-[2rem] border-2 border-black bg-[linear-gradient(180deg,#111111_0%,#1f1f1f_100%)] p-5 pt-10 shadow-[0_14px_0_0_rgba(0,0,0,0.9)]">
                <div className="mb-4 flex items-center justify-between rounded-2xl border-2 border-black bg-white px-4 py-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-neutral-500">
                      Featured This Week
                    </p>
                    <p className="text-lg font-black text-neutral-950">Maple Deals Hot List</p>
                  </div>
                  <Star className="h-5 w-5 text-red-600" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {featuredDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="rounded-[1.6rem] border-2 border-black bg-white p-4 shadow-[0_8px_0_0_rgba(0,0,0,0.9)]"
                    >
                      <img
                        src={deal.image}
                        alt={deal.title}
                        className="mb-4 h-40 w-full rounded-2xl border-2 border-black object-cover"
                      />
                      <div className="mb-2 flex items-center gap-2">
                        <Badge className="rounded-full border-2 border-black bg-neutral-950 text-white hover:bg-neutral-950">
                          Featured
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="rounded-full border-2 border-black bg-[#ffb400] font-bold text-black"
                        >
                          {deal.discount}
                        </Badge>
                      </div>
                      <h2 className="text-base font-black text-neutral-950">{deal.title}</h2>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-sm font-bold text-red-700">{deal.price}</p>
                        <ChevronRight className="h-4 w-4 text-neutral-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-12">
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Top Tech Deals",
              text: "Trending gadgets, PC finds, and smart buys.",
            },
            {
              title: "Home & Office",
              text: "Useful everyday picks for your space.",
            },
            {
              title: "Pet & Lifestyle",
              text: "Fun finds, cozy buys, and popular picks.",
            },
          ].map((item, index) => (
            <div
              key={item.title}
              className={`rounded-[1.75rem] border-2 border-black px-5 py-5 shadow-[0_8px_0_0_rgba(0,0,0,0.9)] ${
                index === 0
                  ? "bg-[linear-gradient(135deg,#d70000_0%,#ff7a00_100%)] text-white"
                  : index === 1
                    ? "bg-white text-neutral-950"
                    : "bg-[#ffb400] text-black"
              }`}
            >
              <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80">
                Category Spotlight
              </p>
              <h3 className="mt-2 text-2xl font-black uppercase leading-tight">{item.title}</h3>
              <p className="mt-2 text-sm font-medium opacity-90">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="mb-8 rounded-[2rem] border-2 border-black bg-white p-6 shadow-[0_10px_0_0_rgba(0,0,0,0.9)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-950 md:text-3xl">Latest Deals</h2>
              <p className="mt-2 text-neutral-600">
                Browse deals by category to quickly find exactly what you’re looking for.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
              <div className="relative min-w-[280px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search deals..."
                  className="rounded-2xl border-black/10 bg-white pl-9"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border-2 border-black px-4 py-2 text-sm font-black uppercase tracking-[0.08em] transition ${
                  isActive
                    ? "bg-gradient-to-r from-red-700 via-red-600 to-orange-500 text-white shadow-md"
                    : "bg-white text-neutral-700 shadow-sm ring-1 ring-black/10 hover:bg-neutral-50"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="mb-6 flex items-center gap-3 rounded-2xl border-2 border-black bg-[#090909] px-4 py-3 text-white shadow-[0_6px_0_0_rgba(0,0,0,0.9)]">
          <Zap className="h-4 w-4 text-[#ffb400]" />
          <p className="text-sm font-black uppercase tracking-[0.18em]">
            Browse the latest Maple Deals picks
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-black/10 bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-medium text-neutral-950">Loading deals...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-300 bg-red-50 p-10 text-center shadow-sm">
            <p className="text-lg font-medium text-red-700">Could not load deals</p>
            <p className="mt-2 text-red-600">{error}</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredDeals.length ? (
              filteredDeals.map((deal) => <DealCard key={deal.id} deal={deal} />)
            ) : (
              <div className="col-span-full rounded-3xl border border-black/10 bg-white p-10 text-center shadow-sm">
                <p className="text-lg font-medium text-neutral-950">No deals found</p>
                <p className="mt-2 text-neutral-500">Try another search or category.</p>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 md:px-10 lg:px-12">
        <div className="rounded-[2rem] border-2 border-black bg-[linear-gradient(135deg,#090909_0%,#1f1f1f_58%,#b91c1c_100%)] px-8 py-10 text-white shadow-[0_14px_0_0_rgba(0,0,0,0.95)]">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-[0.28em] text-[#ffb400]">
                Ready to grow
              </p>
              <h3 className="text-3xl font-black uppercase leading-tight md:text-4xl">
                Turn your Instagram deal posts into a full shopping website.
              </h3>
              <p className="mt-4 max-w-2xl text-neutral-300">
                This version leans much harder into your logo style with bold outlines, stacked promo blocks, stronger contrast, and a more branded “deal graphic” look across the homepage.
              </p>
            </div>
            <div className="rounded-[1.75rem] border-2 border-black bg-white p-6 text-neutral-950 shadow-[0_8px_0_0_rgba(0,0,0,0.95)]">
              <p className="text-lg font-black uppercase">Next steps to build out</p>
              <ul className="mt-4 space-y-3 text-sm font-medium text-neutral-700">
                <li>• Manage all deals from your Google Sheet</li>
                <li>• Use Featured = TRUE to control homepage highlights</li>
                <li>• Use Post Status = Posted to publish deals live</li>
                <li>• Connect Make.com next for social automation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

