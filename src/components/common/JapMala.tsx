import API from "@/api/axios";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default function JapCounter() {
  const [count, setCount] = useState(0);
  const [malaCount, setMalaCount] = useState(0);
  const [totalJap, setTotalJap] = useState(0);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const productId = location.state?.productId;
  const productName = location.state?.productName;

  const LOCAL_KEY = `japProgress_${productId}`;

  // 🧩 To prevent double API call in Strict Mode
  const malaSavedRef = useRef(false);

  // 🔹 Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setCount(parsed.count || 0);
      setMalaCount(parsed.malaCount || 0);
      setTotalJap(parsed.totalJap || 0);
    }
  }, [productId]);

  // 🔹 Persist to localStorage
  useEffect(() => {
    if (!productId) return;
    localStorage.setItem(
      LOCAL_KEY,
      JSON.stringify({ count, malaCount, totalJap })
    );
  }, [count, malaCount, totalJap, productId]);

  // 🔹 Save mala progress (called once)
  const saveMalaToBackend = async () => {
    if (malaSavedRef.current) return; // prevent double call
    malaSavedRef.current = true;

    setLoading(true);
    try {
      const res = await API.post("/products/count/jap-tap", { productId });
      console.log("✅ Mala updated:", res.data);
      toast.success("आप का जप जुड़ गया 🙏 जय श्री राम");
    } catch (err) {
      console.error("❌ Error saving mala:", err);
    } finally {
      setLoading(false);
      // Reset flag after short delay (for next mala)
      setTimeout(() => (malaSavedRef.current = false), 500);
    }
  };

  // 🔹 Handle tap logic
  const handleTap = () => {
    const newCount = count + 1;
    const newTotalJap = totalJap + 1;

    setCount(newCount);
    setTotalJap(newTotalJap);

    if (newCount >= 108) {
      // complete mala
      setCount(0);
      setMalaCount((prev) => prev + 1);
      saveMalaToBackend(); // now safe from double trigger
    }
  };

  return (
    <div className="w-screen flex flex-col min-h-screen bg-orange-50 text-center">
      <div className="text-center py-6 bg-gradient-to-r from-orange-300 to-yellow-200 shadow-md">
        <div className="flex justify-center mb-4">
          <img
            src="/manas_parivar.ico"
            alt="Manas Parivar Logo"
            className="w-28 h-28 rounded-full shadow-md border border-orange-400"
          />
        </div>
        <h1 className="text-3xl font-extrabold text-orange-600 drop-shadow-lg">
          मानस परिवार
        </h1>
        <p className="text-xl font-bold text-orange-950 mt-2">
          📿राम जपते रहो, काम करते रहो 📿
        </p>
      </div>

      <h1 className="text-3xl font-bold mb-2 text-orange-800">{productName}</h1>
      <p className="text-xl font-bold mb-6 text-orange-600">108 जप = 1 माला</p>

      <div className="bg-white  rounded-2xl shadow-md p-6 m-2">
        <div className="flex-col gap-10 justify-center mb-6">
          <div className="flex gap-10 justify-center">
            <p className="text-2xl font-bold mb-2">
              कुल जप: {totalJap.toLocaleString()}
            </p>
            <p className="text-2xl font-bold mb-4">माला: {malaCount}</p>
          </div>
          <div>
            <p className="text-2xl font-bold mb-2">वर्तमान जप: {count}</p>
          </div>
        </div>

        <button
          onClick={handleTap}
          disabled={loading}
          className="button-glow bg-orange-500 text-white px-6 py-3 w-72 h-64 rounded-xl text-lg font-bold shadow 
             hover:bg-orange-700 transition transform active:scale-95 active:shadow-inner duration-150 ease-in-out"
        >
          {loading ? "🔄 जप गिन रहे हैं..." : "🙏 जप करें"}
        </button>
      </div>
    </div>
  );
}
