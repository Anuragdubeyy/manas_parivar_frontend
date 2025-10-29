import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("लॉगिन सफल 🙏 जय श्री राम");
      window.location.href = "/user"; // redirect to user page
    } catch (err) {
      console.error(err);
      alert("गलत विवरण, कृपया पुनः प्रयास करें!");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-b from-orange-50 to-yellow-100">
      <h1 className="text-2xl font-extrabold text-orange-600 mb-4">
         मानस परिवार 
      </h1>
      <p className="text-orange-800 font-semibold mb-6">
        📿राम नाम ही सबसे बड़ा सहारा है 📿
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white/90 p-6 rounded-2xl shadow-lg border border-orange-300 m-2"
      >
        <h2 className="text-xl font-semibold text-orange-700 mb-4 text-center">
          🔸 सदस्य लॉगिन 🔸
        </h2>

        <input
          name="identifier"
          placeholder="username/ email"
          value={formData.identifier}
          onChange={handleChange}
          className="border border-orange-400 focus:border-orange-500 rounded-lg w-full px-3 py-2 mb-3 outline-none"
        />
        <input
          name="password"
          type="password"
          placeholder="पासवर्ड"
          value={formData.password}
          onChange={handleChange}
          className="border border-orange-400 focus:border-orange-500 rounded-lg w-full px-3 py-2 mb-4 outline-none"
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
        >
          लॉगिन करें
        </button>
         <p className="text-center text-sm text-orange-700 mt-4">
          नया खाता बनाना है?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-orange-600 font-semibold hover:underline"
          >
            यहाँ क्लिक करें
          </button>
        </p>
      </form>

      <p className="mt-6 text-orange-700 italic font-medium">
        🌸 “सीता राम जय जय राम” 🌸
      </p>
    </div>
  );
}
