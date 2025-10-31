import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";

interface Product {
  _id: string;
  name: string;
  totalCount?: number;
}

export default function UserPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newCounts, setNewCounts] = useState<Record<string, number>>({});
  const [loadingProduct, setLoadingProduct] = useState<string | null>(null);
    const [isFetchingProducts, setIsFetchingProducts] = useState(false);

  const fetchProducts = async () => {
    try {
      setIsFetchingProducts(true)
      const { data } = await API.get<Product[]>("/products/all");
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("उत्पाद लाने में त्रुटि हुई 🙏 कृपया पुनः प्रयास करें!");
    } finally {
      setIsFetchingProducts(false); // 👈 hide loader
    }
  };

 const addCount = async (productId: string) => {
    const value = newCounts[productId];
    if (!value || value <= 0) return alert("कृपया सही संख्या दर्ज करें 🙏");

    try {
      setLoadingProduct(productId);
      await API.post("/products/count", { productId, count: value });
      setNewCounts((prev) => ({ ...prev, [productId]: 0 }));
      await fetchProducts(); // refresh after success
    } catch (err) {
      console.error("Error adding count:", err);
      alert("त्रुटि हुई, कृपया पुनः प्रयास करें 🙏");
    } finally {
      setLoadingProduct(null);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen w-screen  bg-gradient-to-b from-orange-50 to-orange-100">
      {/* Header */}
      <div className="text-center  py-6 bg-gradient-to-r from-orange-300 to-yellow-200 shadow-md">
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

      {isFetchingProducts && (
        <div className="flex justify-center items-center mt-6">
          <svg
            className="animate-spin h-8 w-8 text-orange-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span className="ml-3 text-orange-700 font-medium">
            संकल्प लोड हो रहे हैं...
          </span>
        </div>
      )}

      {/* Product Cards */}
      <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-2 items-center gap-6 w-full lg:w-fit mx-auto">
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
              disabled={loadingProduct === p._id}
              className={`flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-all ${
                loadingProduct === p._id
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:from-orange-600 hover:to-orange-700"
              }`}
            >
              {loadingProduct === p._id ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  <span>जोड़ रहे है...</span>
                </>
              ) : (
                "➕ जप संख्या जोड़ें"
              )}
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
