import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import DailyProductTable from "@/components/common/DailyProductTable";
import { useNavigate } from "react-router-dom";

interface Product {
  _id: string;
  name: string;
  totalCount?: number;
}
interface User {
  _id: string;
  name: string;
  email: string;
  products: UserProduct[];
  totalUserCount?: number;
}
interface UserProduct {
  productId: string;
  name: string;
  count: number;
}
export default function UserPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newCounts, setNewCounts] = useState<Record<string, number>>({});
  const [loadingProduct, setLoadingProduct] = useState<string | null>(null);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loginUser, setLoginUser] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const navigate = useNavigate();
  const fetchProducts = async () => {
    try {
      setIsFetchingProducts(true);
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

  const fetchUsers = async () => {
    try {
      const { data } = await API.get<User[]>(
        "/products/admin/users-with-counts"
      );
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // const handleLogout = () => {
  //   localStorage.removeItem("user");
  //   localStorage.removeItem("token");
  //   toast.success("आपने सफलतापूर्वक लॉगआउट कर लिया 🙏");
  //   window.location.href = "/"; // redirect to login
  // };

  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setLoginUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Invalid user data in localStorage:", err);
      }
    }
  }, []);
  // if (selectedProduct) {
  //   return (
  //     <JapCounter
  //       productId={selectedProduct._id}
  //       productName={selectedProduct.name}
  //       onBack={() => setSelectedProduct(null)}
  //     />
  //   );
  // }
  return (
    <div className="min-h-screen w-screen  bg-gradient-to-b from-orange-50 to-orange-100">
      {/* Header */}

      <div className="text-center  py-6 bg-gradient-to-r from-orange-300 to-yellow-200 shadow-md">
        <div className="flex justify-center mb-4">
          <img
            src="/manas_parivar.ico"
            alt="Manas Parivar Logo"
            className="w-28 h-28 rounded-full shadow-md border border-orange-400"
          />
        </div>
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
              <span className="font-bold">{loginUser?.name || "भक्त"}</span>
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
            <button
              onClick={() =>
                navigate("/jap", {
                  state: { productId: p._id, productName: p.name },
                })
              }
              className="mt-3 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
            >
              🙏 जप करें
            </button>
          </div>
        ))}
      </div>
      <div className="bg-white/90 rounded-2xl shadow-md border border-orange-300 p-2 h-96 overflow-auto m-4">
        <DailyProductTable />
      </div>
      <section className="max-w-6xl m-4  bg-white/90 rounded-2xl shadow-md border border-orange-300 p-3">
        <h2 className="text-2xl font-bold text-orange-700 mb-4">
          उपयोगकर्ताओं की संख्या ({users.length})
        </h2>

        <div className="overflow-y-auto max-h-[500px] rounded-lg border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th className="p-3 text-center">#</th>
                <th className="p-3 text-center">User</th>
                {products.map((p) => (
                  <th key={p._id} className="p-3 text-center">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {[...users]
                .sort((a, b) => {
                  const totalA = a.products.reduce(
                    (sum, prod) => sum + (prod.count || 0),
                    0
                  );
                  const totalB = b.products.reduce(
                    (sum, prod) => sum + (prod.count || 0),
                    0
                  );
                  return totalB - totalA;
                })
                .map((user, index) => (
                  <tr
                    key={user._id}
                    className={`border-b ${
                      index === 0
                        ? "bg-yellow-100 font-bold"
                        : index === 1
                        ? "bg-gray-100"
                        : index === 2
                        ? "bg-orange-50"
                        : ""
                    }`}
                  >
                    <td className="p-3 text-center">{index + 1}</td>
                    <td className="p-3 text-center">
                      {user.name || user.email}
                    </td>
                    {products.map((p) => {
                      const totalForProduct = user.products
                        .filter((prod) => prod.productId === p._id)
                        .reduce((sum, prod) => sum + (prod.count || 0), 0);
                      return (
                        <td key={p._id} className="p-3 text-center">
                          {totalForProduct || "-"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-orange-50 border-t-4 border-orange-400 mt-10">
        <div className="max-w-6xl mx-auto px-4 py-10 text-center text-gray-800">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img
              src="/manas_parivar.ico"
              alt="Manas Parivar Logo"
              className="w-20 h-20 rounded-full shadow-md border border-orange-400"
            />
          </div>

          {/* Main Text */}
          <h2 className="text-2xl font-bold text-orange-700 mb-2">
            प्रिय भक्तजनो,
          </h2>
          <p className="max-w-3xl mx-auto text-base leading-relaxed mb-4">
            हम सबके आराध्य प्रभु श्रीराम के नाम का जाप ही कलियुग में सबसे सरल और
            श्रेष्ठ साधना है। इसी दिव्य भावना के साथ मानस परिवार ने एक महान
            संकल्प लिया है —
          </p>

          <p className="text-lg font-semibold text-orange-800 mb-2">
            📿 “राम नाम जप संकल्प — कुल 11,25,000 बार श्रीराम नाम का उच्चारण” 📿
          </p>
          <p className="text-lg font-semibold text-orange-800 mb-4">
            📿 हनुमान चालीसा संकल्प — 2,100 📿
          </p>

          <p className="text-base mb-6">
            🙏 यह सम्पूर्ण संकल्प समर्पित किया जाएगा <br />
            <strong>अयोध्या धाम स्थित श्री हनुमान गढ़ी मंदिर</strong> में <br />
            हमारे पावन तीर्थ-प्रवास के अवसर पर।
          </p>

          {/* 🌺 श्री रामचरितमानस पाठ आयोजन Section */}
          <div className="bg-gradient-to-r from-orange-100 via-white to-orange-100 border border-orange-300 rounded-xl p-5 shadow-inner mb-6 max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-orange-700 mb-2">
              📖 श्री रामचरितमानस पाठ आयोजन — श्री धाम अयोध्या 📖
            </h3>

            <p className="text-base leading-relaxed mb-2">
              आप सभी मानस प्रेमियों का एक{" "}
              <strong>संकल्पित और सामूहिक धार्मिक श्री रामचरितमानस पाठ</strong>{" "}
              का आयोजन <strong>श्री धाम अयोध्या</strong> में <br />
              <span className="text-orange-800 font-semibold">
                16 दिसंबर
              </span>{" "}
              से शुभारंभ एवं
              <span className="text-orange-800 font-semibold">
                {" "}
                17 दिसंबर
              </span>{" "}
              को पूर्णाहुति होगी।
            </p>

            <div className="bg-orange-100 border border-orange-300 rounded-lg p-3 my-3 text-sm sm:text-base">
              <p className="font-semibold text-orange-800 mb-1">
                📍 कार्यक्रम स्थल:
              </p>
              <p className="font-medium">
                बड़ा भक्तमाल तपस्वी छावनी अयोध्या <br />
                <span className="italic">(श्री अवधेश दास जी आश्रम)</span>
              </p>
            </div>

            <p className="text-base text-orange-800 font-semibold mt-3">
              🚆 14 दिसंबर को मुंबई से अयोध्या के लिए हम सभी मानस प्रेमी ट्रेन
              से रवाना होंगे <br />
              🕉 18 दिसंबर को सायंकाल को वापसी होगी।
            </p>
          </div>

          <p className="text-base mb-6">
            हर “राम राम” का उच्चारण न केवल हमारे अंतर्मन को शुद्ध करेगा, बल्कि
            समाज में शांति और सकारात्मकता का भी प्रसार करेगा।
          </p>

          <h3 className="text-xl font-bold text-orange-700">
            जय श्रीराम 🙏 जय बजरंगबली!
          </h3>
          <p className="mt-1 font-medium">– मानस परिवार घाटकोपर</p>

          {/* Social Links */}
          <div className="flex justify-center gap-6 mt-6">
            <a
              href="https://instagram.com/manas_parivaar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:text-orange-800 transition-transform transform hover:scale-110"
            >
              <i className="fab fa-instagram text-3xl"></i>
            </a>
            <a
              href="https://facebook.com/manas_parivaar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:text-orange-800 transition-transform transform hover:scale-110"
            >
              <i className="fab fa-facebook text-3xl"></i>
            </a>
            <a
              href="https://www.youtube.com/@manas_parivarr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:text-orange-800 transition-transform transform hover:scale-110"
            >
              <i className="fab fa-youtube text-3xl"></i>
            </a>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            © {new Date().getFullYear()} मानस परिवार घाटकोपर — सर्वाधिकार
            सुरक्षित
          </div>
        </div>
      </footer>
    </div>
  );
}
