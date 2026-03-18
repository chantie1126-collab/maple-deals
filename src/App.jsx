import React, { useEffect, useMemo, useState } from "react";

const SHEET_URL =
  "https://opensheet.elk.sh/1h60w_zFQgNwKzrnU3t2ky7gT8m_b2dynnaty5ZbCGCw/Sheet1";

function normalizeDeal(row, index) {
  return {
    id: index,
    title: row.Title,
    price: row.Price,
    oldPrice: row["Old Price"],
    discount: row.Discount,
    description: row.Description,
    link: row.Link,
    image: row["Image URL"],
    category: row.Category,
    featured: row.Featured === "TRUE",
    status: row["Post Status"],
  };
}

export default function App() {
  const [deals, setDeals] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetch(SHEET_URL)
      .then((res) => res.json())
      .then((data) => {
        setDeals(data.map(normalizeDeal));
      });
  }, []);

  const filtered = useMemo(() => {
    return deals
      .filter((d) => d.status === "Posted")
      .filter((d) => category === "All" || d.category === category)
      .filter((d) =>
        d.title.toLowerCase().includes(search.toLowerCase())
      );
  }, [deals, search, category]);

  const categories = [
    "All",
    ...new Set(deals.map((d) => d.category)),
  ];

  return (
    <div className="container">
      <h1>🍁 Maple Deals</h1>

      <input
        placeholder="Search deals..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="categories">
        {categories.map((c) => (
          <button key={c} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid">
        {filtered.map((deal) => (
          <div className="card" key={deal.id}>
            <img src={deal.image} />
            <h3>{deal.title}</h3>
            <p>{deal.description}</p>

            <div className="price">
              <strong>{deal.price}</strong>
              <span>{deal.oldPrice}</span>
            </div>

            <a href={deal.link} target="_blank">
              View Deal
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
