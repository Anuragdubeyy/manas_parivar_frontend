import API from "@/api/axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function JapCounter() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [malaCount, setMalaCount] = useState(0);

  const productId = location.state?.productId;
  const productName = location.state?.productName;
  
  // 🔹 Load progress on mount
  useEffect(() => {
     const LOCAL_KEY = `japProgress_${productId}`;
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setCount(parsed.count || 0);
      setMalaCount(parsed.malaCount || 0);
    }
  }, [productId]);

  // 🔹 Save progress whenever count changes
  useEffect(() => {
    if (!productId) return;
    const LOCAL_KEY = `japProgress_${productId}`;
    localStorage.setItem(
      LOCAL_KEY,
      JSON.stringify({ count, malaCount })
    );
  }, [count, malaCount, productId]);

  // 🔹 Handle tap logic
  const handleTap = () => {
    setCount((prev) => {
      const newCount = prev + 1;

      if (newCount >= 108) {
        // Increase mala count
        const newMala = malaCount + 1;
        setMalaCount(newMala);
        // Reset local count after one mala
        saveMalaToBackend();
        return 0;
      }

      return newCount;
    });
  };

  // 🔹 Save mala progress to backend
  const saveMalaToBackend = async () => {
    setLoading(true);
    try {
      const res = await API.post("/products/count/jap-tap", { productId });
      console.log("✅ Mala updated:", res.data);
    } catch (err) {
      console.error("❌ Error saving mala:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen flex flex-col  h-screen bg-orange-50 text-center ">
      <div className="text-center  py-6 bg-gradient-to-r from-orange-300 to-yellow-200 shadow-md">
        <h1 className="text-3xl font-extrabold text-orange-600  drop-shadow-lg">
          मानस परिवार
        </h1>
        <p className="text-xl font-bold text-orange-950 mt-2">
          📿राम जपते रहो, काम करते रहो 📿
        </p>
        <div>
          <div className="text-center mt-4">
            <p className="text-orange-800 text-xl font-bold text-lg">
              🙏 स्वागत है,{" "}
              {/* <span className="font-bold">{loginUser?.name || "भक्त"}</span> */}
            </p>
          </div>
          {/* <button
            onClick={handleLogout}
            className="bg-gradient-to-r  from-orange-500 to-orange-600 text-white px-2  rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all items-right mt-3"
          >
            🚪 Logout
          </button> */}
        </div>
      </div>
     

      <h1 className="text-3xl font-bold mb-2 text-orange-800">{productName}</h1>
      <p className="text-xl font-bold mb-6 text-orange-600">108 जप = 1 माला</p>

      <div className="bg-white rounded-2xl shadow-md p-6 m-2 ">
        <p className="text-2xl font-bold mb-2">जप: {count}</p>
        <p className="text-2xl font-bold mb-4">माला: {malaCount}</p>

        <button
          onClick={handleTap}
          disabled={loading}
          className="bg-orange-600 text-white px-6 py-3 w-60 h-40  rounded-xl  text-lg font-bold shadow hover:bg-orange-700 transition"
        >
          {loading ? "🔄 जप गिन रहा है..." : "🙏 जप करें"}
        </button>
      </div>
    </div>
  );
}
