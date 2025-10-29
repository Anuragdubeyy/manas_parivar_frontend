import { useEffect, useState } from "react";
import API from "../api/axios";

interface Product {
  _id: string;
  name: string;
  totalCount?: number;
}

export default function UserPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newCounts, setNewCounts] = useState<Record<string, number>>({});

  const fetchProducts = async () => {
    try {
      const { data } = await API.get<Product[]>("/products/all");
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const addCount = async (productId: string) => {
    const value = newCounts[productId];
    if (!value || value <= 0) return alert("कृपया सही संख्या दर्ज करें 🙏");

    try {
      await API.post("/products/count", { productId, count: value });
      setNewCounts((prev) => ({ ...prev, [productId]: 0 }));
      await fetchProducts(); // refresh to show updated total
    } catch (err) {
      console.error("Error adding count:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      {/* Header */}
      <div className="text-center py-6 bg-gradient-to-r from-orange-300 to-yellow-200 shadow-md">
        <h1 className="text-3xl font-extrabold text-orange-600  drop-shadow-lg">
          मानस परिवार
        </h1>
        <p className="text-xl font-bold text-orange-950 mt-2">
          📿राम जपते रहो, काम करते रहो 📿
        </p>
      </div>

      {/* Decorative Section */}
      <div className="text-center font-bold mt-4 text-orange-700 italic p-2">
        <p>सीताराम चरण रति मोरे । अनुदिन बढ़ऊ अनुग्रह तोरे</p>
      </div>

      {/* Product Cards */}
      <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white/90 border border-orange-300 rounded-2xl p-5 flex flex-col items-center shadow-md hover:shadow-lg transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-orange-700 mb-1">
              {p.name}
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              वर्तमान कुल जप संख्या:{" "}
              <span className="font-bold text-orange-800">
                📿{p.totalCount || 0}
              </span>
            </p>

            <input
              type="number"
              min={1}
              placeholder="जप संख्या दर्ज करें"
              value={newCounts[p._id] || ""}
              onChange={(e) =>
                setNewCounts((prev) => ({
                  ...prev,
                  [p._id]: Number(e.target.value),
                }))
              }
              className="border border-orange-400 focus:border-orange-500 px-3 py-2 rounded-lg mb-3 w-32  text-center outline-none"
            />

            <button
              onClick={() => addCount(p._id)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all"
            >
              ➕ जप संख्या जोड़ें
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-orange-800 text-sm font-bold">
        <p>📿 जय श्री राम | मानस परिवार - सेवा में समर्पित 📿</p>
      </footer>
    </div>
  );
}
