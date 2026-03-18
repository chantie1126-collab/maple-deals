import React, { useEffect, useMemo, useState } from "react";

const SHEET_URL = "https://opensheet.elk.sh/1h60w_zFQgNwKzrnU3t2ky7gT8m_b2dynnaty5ZbCGCw/Sheet1";
const LOGO_URL = "https://scontent.fyto1-1.fna.fbcdn.net/v/t39.30808-6/641631710_122098342731284106_8631249794886951697_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=gq3SOlNWMYsQ7kNvwEO16kW&_nc_oc=AdlqTLNT5ncI74suiKjrtDhnnITogqAX6SBxdRLAgp9cTH6tfwFz9Ocrx4BkMyE0_5s&_nc_zt=23&_nc_ht=scontent.fyto1-1.fna&_nc_gid=xoePapzO-aKZbkKYAG6S1g&_nc_ss=8&oh=00_Afz4PIEMQZF9Ie8kM61_4kBJKlNcmxAwKFOVtg28Ts_ZeA&oe=69BF8D3D";

function normalizeDeal(row, index) {
  return {
    id: row.id || row.ID || `${index}`,
    title: row.title || row.Title || row.name || row.Name || "Untitled Deal",
    description:
      row.description || row.Description || row.details || row.Details || "",
    price:
      row.price || row.Price || row.todayprice || row["Today's Price"] || "",
    oldPrice:
      row.oldPrice ||
      row.OldPrice ||
      row.was ||
      row.Was ||
      row["Old Price"] ||
      "",
    discount:
      row.discount || row.Discount || row["Discount %"] || row["Discount"] || "",
    image: (() => {
      let img = row.image || row.Image || row.imageUrl || row.ImageURL || row["Image URL"] || "";

      if (!img) return "";

      if (typeof img === "string" && img.startsWith("=IMAGE(")) {
        const match = img.match(/=IMAGE\("(.*?)"\)/);
        if (match && match[1]) return match[1];
      }

      img = img.trim();
      return img;
    })(),
    link: row.link || row.Link || row.url || row.URL || "#",
    category: row.category || row.Category || "Deals",
    store: row.store || row.Store || "Amazon Canada",
    featured:
      String(row.featured || row.Featured || "").toLowerCase() === "yes" ||
      String(row.featured || row.Featured || "").toLowerCase() === "true",
  };
}

export default function App() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    let isMounted = true;

    async function loadDeals() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(SHEET_URL);
        if (!response.ok) {
          throw new Error("Could not load deals from Google Sheets.");
        }

        const data = await response.json();
        const cleaned = Array.isArray(data)
          ? data.map((row, index) => normalizeDeal(row, index))
          : [];

        if (isMounted) {
          setDeals(cleaned);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Something went wrong.");
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

  const categories = useMemo(() => {
    const list = [...new Set(deals.map((deal) => deal.category).filter(Boolean))];
    return ["All", ...list];
  }, [deals]);

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      return selectedCategory === "All" || deal.category === selectedCategory;
    });
  }, [deals, selectedCategory]);

  const featuredDeals = filteredDeals.filter((deal) => deal.featured).slice(0, 3);
  const regularDeals = filteredDeals.filter((deal) => !deal.featured);

  return (
    <div style={styles.page}>
      <div style={styles.glowRed} />
      <div style={styles.glowGold} />

      <header style={styles.heroWrap}>
        <div style={styles.heroPanel}>
          <div style={styles.heroLeft}>
            <div style={styles.badge}>Amazon Canada Savings</div>
            <h1 style={styles.title}>
              Hot Canadian deals, pulled straight from your sheet.
            </h1>
            <p style={styles.subtitle}>
              Add a new row to Google Sheets and your latest deal appears on the
              site automatically.
            </p>
          </div>

          <div style={styles.heroRight}>
            <div style={styles.logoCard}>
              <img src={LOGO_URL} alt="Maple Deals logo" style={styles.logo} />
            </div>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {loading && <div style={styles.message}>Loading deals...</div>}
        {error && !loading && <div style={styles.error}>{error}</div>}
        {!loading && !error && filteredDeals.length === 0 && (
          <div style={styles.message}>No deals found.</div>
        )}

        {!loading && !error && featuredDeals.length > 0 && (
          <section style={{ marginBottom: 44 }}>
            <div style={styles.sectionHeaderRow}>
              <h2 style={styles.sectionTitle}>Featured Deals</h2>
              <div style={styles.count}>{featuredDeals.length} featured</div>
            </div>

            <div style={styles.grid}>
              {featuredDeals.map((deal) => (
                <DealCard key={`featured-${deal.id}`} deal={deal} featured />
              ))}
            </div>
          </section>
        )}

        {!loading && !error && regularDeals.length > 0 && (
          <section>
            <div style={styles.sectionHeaderRow}>
              <h2 style={styles.sectionTitle}>Latest Deals</h2>
              <div style={styles.count}>{filteredDeals.length} deals</div>
            </div>

            <div style={styles.controlsPanel}>
              <div style={styles.categoryList}>
                {categories.map((category) => {
                  const isActive = selectedCategory === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      style={{
                        ...styles.categoryButton,
                        ...(isActive ? styles.categoryButtonActive : {}),
                      }}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={styles.grid}>
              {regularDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function DealCard({ deal, featured = false }) {
  return (
    <article style={{ ...styles.card, ...(featured ? styles.featuredCard : {}) }}>
      <div style={styles.imageWrap}>
        {deal.image ? (
          <img src={deal.image} alt={deal.title} style={styles.image} />
        ) : (
          <div style={styles.noImage}>No image</div>
        )}

        {deal.discount ? <div style={styles.discount}>{deal.discount} OFF</div> : null}
      </div>

      <div style={styles.cardBody}>
        <div style={styles.metaRow}>
          <span style={styles.metaPill}>{deal.category}</span>
          <span style={styles.store}>{deal.store}</span>
        </div>

        <h3 style={styles.cardTitle}>{deal.title}</h3>
        <p style={styles.description}>{deal.description}</p>

        <div style={styles.priceRow}>
          {deal.price ? <span style={styles.price}>{deal.price}</span> : null}
          {deal.oldPrice ? <span style={styles.oldPrice}>{deal.oldPrice}</span> : null}
        </div>

        <a href={deal.link} target="_blank" rel="noreferrer" style={styles.button}>
          View Deal
        </a>
      </div>
    </article>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(255,87,34,0.18), transparent 28%), radial-gradient(circle at top right, rgba(255,193,7,0.14), transparent 26%), linear-gradient(180deg, #090909 0%, #130707 45%, #090909 100%)",
    color: "#fff7ef",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    position: "relative",
    overflow: "hidden",
  },
  glowRed: {
    position: "absolute",
    top: -180,
    left: -120,
    width: 460,
    height: 460,
    background: "rgba(255, 59, 48, 0.18)",
    filter: "blur(100px)",
    borderRadius: "50%",
  },
  glowGold: {
    position: "absolute",
    top: 80,
    right: -100,
    width: 380,
    height: 380,
    background: "rgba(255, 193, 7, 0.14)",
    filter: "blur(100px)",
    borderRadius: "50%",
  },
  heroWrap: {
    maxWidth: 1240,
    margin: "0 auto",
    padding: "28px 20px 18px",
    position: "relative",
    zIndex: 1,
  },
  heroPanel: {
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: 24,
    alignItems: "center",
    padding: 28,
    borderRadius: 36,
    border: "1px solid rgba(255,255,255,0.08)",
    background:
      "linear-gradient(135deg, rgba(24,24,24,0.92), rgba(48,8,8,0.94) 55%, rgba(18,18,18,0.94))",
    boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
  },
  heroLeft: {
    padding: "8px 6px 8px 6px",
  },
  heroRight: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  logoCard: {
    width: "100%",
    maxWidth: 430,
    borderRadius: 28,
    padding: 18,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
    border: "1px solid rgba(255, 149, 0, 0.2)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 18px 40px rgba(0,0,0,0.3)",
  },
  logo: {
    width: "100%",
    display: "block",
    objectFit: "contain",
    filter: "drop-shadow(0 18px 25px rgba(0,0,0,0.32))",
  },
  badge: {
    display: "inline-block",
    padding: "9px 14px",
    borderRadius: 999,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 18,
    color: "#ffd46b",
    border: "1px solid rgba(255, 180, 0, 0.28)",
    background: "rgba(255, 122, 0, 0.09)",
    fontWeight: 700,
  },
  title: {
    fontSize: "clamp(2.3rem, 5vw, 4.7rem)",
    lineHeight: 0.97,
    margin: "0 0 16px",
    maxWidth: 760,
    fontWeight: 900,
    letterSpacing: -1.5,
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255,247,239,0.8)",
    maxWidth: 650,
    margin: "0 0 28px",
    lineHeight: 1.65,
  },
  controlsPanel: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginBottom: 24,
    padding: 18,
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.08)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
    boxShadow: "0 14px 28px rgba(0,0,0,0.18)",
  },
  categoryList: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  categoryButton: {
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.06)",
    color: "rgba(255,247,239,0.82)",
    padding: "10px 16px",
    borderRadius: 999,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  categoryButtonActive: {
    background: "linear-gradient(135deg, #ffcf33, #ff8a00 58%, #ff4a11)",
    color: "#190b00",
    border: "1px solid rgba(255, 188, 51, 0.45)",
    boxShadow: "0 10px 20px rgba(255, 108, 0, 0.18)",
  },
  main: {
    maxWidth: 1240,
    margin: "0 auto",
    padding: "18px 20px 72px",
    position: "relative",
    zIndex: 1,
  },
  sectionHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 30,
    margin: 0,
    fontWeight: 800,
    letterSpacing: -0.5,
  },
  count: {
    color: "rgba(255,247,239,0.68)",
    fontSize: 14,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 999,
    padding: "8px 12px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 22,
  },
  card: {
    background: "linear-gradient(180deg, rgba(31,11,11,0.98), rgba(12,12,12,0.98))",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 28,
    overflow: "hidden",
    boxShadow: "0 16px 34px rgba(0,0,0,0.28)",
    transition: "transform 0.2s ease",
  },
  featuredCard: {
    border: "1px solid rgba(255, 179, 0, 0.34)",
    boxShadow: "0 16px 40px rgba(255, 136, 0, 0.14)",
  },
  imageWrap: {
    position: "relative",
    background: "linear-gradient(180deg, #ffffff, #f2f2f2)",
    aspectRatio: "4 / 3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  noImage: {
    color: "#777",
    fontSize: 14,
  },
  discount: {
    position: "absolute",
    top: 14,
    right: 14,
    background: "linear-gradient(135deg, #ffcc33, #ff7b00)",
    color: "#171717",
    padding: "8px 12px",
    borderRadius: 999,
    fontWeight: 900,
    fontSize: 12,
    letterSpacing: 0.5,
    boxShadow: "0 8px 18px rgba(0,0,0,0.18)",
  },
  cardBody: {
    padding: 20,
  },
  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  metaPill: {
    display: "inline-block",
    fontSize: 12,
    color: "#ffd46b",
    border: "1px solid rgba(255, 180, 0, 0.22)",
    background: "rgba(255, 122, 0, 0.08)",
    padding: "6px 10px",
    borderRadius: 999,
    fontWeight: 700,
  },
  store: {
    fontSize: 12,
    color: "rgba(255,247,239,0.6)",
  },
  cardTitle: {
    fontSize: 22,
    lineHeight: 1.2,
    margin: "0 0 10px",
    fontWeight: 800,
  },
  description: {
    fontSize: 14,
    lineHeight: 1.65,
    color: "rgba(255,247,239,0.76)",
    minHeight: 68,
    margin: "0 0 18px",
  },
  priceRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
    flexWrap: "wrap",
  },
  price: {
    fontSize: 30,
    fontWeight: 900,
    color: "#fff",
  },
  oldPrice: {
    fontSize: 16,
    color: "rgba(255,247,239,0.46)",
    textDecoration: "line-through",
  },
  button: {
    display: "inline-block",
    width: "100%",
    textAlign: "center",
    textDecoration: "none",
    background: "linear-gradient(135deg, #ffcf33, #ff8a00 58%, #ff4a11)",
    color: "#190b00",
    fontWeight: 900,
    padding: "14px 18px",
    borderRadius: 16,
    boxShadow: "0 12px 22px rgba(255, 108, 0, 0.18)",
  },
  message: {
    padding: "40px 0",
    color: "rgba(255,247,239,0.75)",
    fontSize: 18,
  },
  error: {
    padding: "18px 20px",
    borderRadius: 18,
    color: "#ffe3e3",
    background: "rgba(140, 33, 33, 0.3)",
    border: "1px solid rgba(255, 120, 120, 0.25)",
  },
};
