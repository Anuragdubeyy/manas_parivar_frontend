import React, { useEffect, useState } from "react";
import API from "@/api/axios";

interface Product {
  _id: string;
  name: string;
}

interface ProductCount {
  _id: string;
  product: Product;
  count: number;
  date: string;
}

const DailyProductTable: React.FC = () => {
  const [data, setData] = useState<ProductCount[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await API.get<ProductCount[]>("/products/daily");
        setData(res.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch product counts");
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="p-3">
      <h2 className="text-2xl font-semibold text-orange-700  italic mb-4">📊 दैनिक जप विवरण</h2>

      {loading && (
        <div className="flex items-center gap-2 text-gray-600">
          <svg
            className="animate-spin h-5 w-5 text-blue-500"
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
              d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 100 16v4l3.5-3.5L12 20v-4a8 8 0 01-8-8z"
            ></path>
          </svg>
          लोड हो रहा है...
        </div>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {!loading && !error && (
        <div className="overflow-scroll">
          <table className="min-w-full border border-gray-200 rounded-lg text-sm">
            <thead className="bg-gray-100 text-black text-base text-center">
              <tr>
                <th className="border px-4 py-2 text-center">तिथि</th>
                <th className="border px-4 py-2 text-center">संकल्प</th>
                <th className="border px-4 py-2 text-center">जप संख्या</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 font-semibold">
                    <td className="border px-4 py-2">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">{item.product?.name || "N/A"}</td>
                    <td className="border px-4 py-2">{item.count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    🙏 कोई रिकॉर्ड नहीं मिला 🙏
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DailyProductTable;
