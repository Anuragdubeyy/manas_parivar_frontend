import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.post("/auth/register", formData);
      toast.success("पंजीकरण सफल 🙏 कृपया लॉगिन करें");
    } catch (err) {
      console.error(err);
      toast.error("त्रुटि हुई, कृपया पुनः प्रयास करें!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-b from-orange-50 to-yellow-100">
      <h1 className="text-3xl font-extrabold text-orange-600 mb-4">
        मानस परिवार
      </h1>
      <p className="text-orange-800 font-semibold mb-6">
        “राम नाम जपते रहो, सुख सम्पदा सब पाओ”
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white/90 p-6 rounded-2xl shadow-lg border border-orange-300 m-2"
      >
        <h2 className="text-xl font-semibold text-orange-700 mb-4 text-center">
          🙏 नया सदस्य पंजीकरण 🙏
        </h2>

        <input
          name="name"
          type="text"
          placeholder="नाम"
          value={formData.name}
          onChange={handleChange}
          className="border border-orange-400 focus:border-orange-500 rounded-lg w-full px-3 py-2 mb-3 outline-none"
        />
        <input
          name="email"
          type="email"
          placeholder="ईमेल"
          value={formData.email}
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
          {loading ? (
            <div className="flex gap-2 justify-center">
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
              <span>पंजीकरण हो रहा है...</span>
            </div>
          ) : (
            <>पंजीकरण करें</>
          )}
        </button>

        <p className="text-center text-sm text-orange-700 mt-4">
          सदस्य लॉगिन{" "}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-orange-600 font-semibold hover:underline"
          >
            यहाँ क्लिक करें
          </button>
        </p>
      </form>

      <p className="mt-6 text-orange-700 italic font-medium">
        🌸 “भजो राम नाम सदा” 🌸
      </p>
    </div>
  );
}
