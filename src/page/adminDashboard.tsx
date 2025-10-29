import { useEffect, useState } from "react";
import API from "../api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductRow from "@/components/common/ProductRow";

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

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newProduct, setNewProduct] = useState("");

  const fetchProducts = async () => {
    try {
      const { data } = await API.get<Product[]>("/products/all");
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
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

  const addProduct = async () => {
    if (!newProduct.trim()) return;
    try {
      await API.post("/products/add", { name: newProduct });
      setNewProduct("");
      fetchProducts();
      alert("नया उत्पाद सफलतापूर्वक जोड़ा गया 🙏");
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      {/* Header */}
      <header className="text-center py-6 bg-gradient-to-r from-orange-300 to-yellow-200 shadow-md">
        <h1 className="text-3xl font-extrabold text-orange-600 drop-shadow-lg">
           मानस परिवार 
        </h1>
        <p className="text-lg font-semibold text-orange-900 mt-2">
          राम नाम जपते रहो, काम करते रहो
        </p>
      </header>

      {/* Decorative Line */}
      <div className="text-center font-bold mt-4 text-orange-700  italic">
        <p>सीताराम चरण रति मोरे । अनुदिन बढ़ऊ अनुग्रह तोरे</p>
      </div>

            <div className="p-2">
      {/* Add Product Section */}
      <section className="max-w-4xl mx-auto mt-6 bg-white/90 rounded-2xl shadow-md border border-orange-300 p-6">
        <h2 className="text-2xl font-bold text-orange-700 mb-4">
          🪔 नया संकल्प जोड़ें
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="संकल्प का नाम दर्ज करें"
            value={newProduct}
            onChange={(e) => setNewProduct(e.target.value)}
            className="border border-orange-400 focus:border-orange-500 rounded-lg px-3 py-2 outline-none"
          />
          <Button
            onClick={addProduct}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg"
          >
            ➕ जोड़ें
          </Button>
        </div>
      </section>
        {/* Product List */}
        <section className="max-w-5xl mx-auto mt-8 bg-white/90 rounded-2xl shadow-md border border-orange-300 p-6 overflow-x-auto">
          <h2 className="text-2xl font-bold text-orange-700 mb-4">
            📦 सभी संकल्प
          </h2>
          <table className="min-w-full border border-orange-200">
            <thead className="bg-gradient-to-r from-orange-100 to-yellow-50 border-b border-orange-300">
              <tr>
                <th className="p-3 text-left text-orange-800">संकल्प</th>
                <th className="p-3 text-left text-orange-800">कुल जप संख्या</th>
                <th className="p-3 text-left text-orange-800">क्रिया</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <ProductRow key={p._id} product={p} onDelete={deleteProduct} />
              ))}
            </tbody>
          </table>
        </section>

        {/* User Count Section */}
        <section className="max-w-6xl mx-auto mt-8  bg-white/90 rounded-2xl shadow-md border border-orange-300 p-6 overflow-auto ">
          <h2 className="text-2xl font-bold text-orange-700 mb-4">
            🙏 उपयोगकर्ताओं की जप संख्या
          </h2>
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">User</th>
                {products.map((p) => (
                  <th key={p._id} className="p-3 text-center">
                    {p.name}
                  </th>
                ))}
                <th className="p-3 text-center">Total</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="p-3">{user.name || user.email}</td>

                  {products.map((p) => {
                    const productData = user.products.find(
                      (prod) => prod.productId === p._id
                    );
                    return (
                      <td key={p._id} className="p-3 text-center">
                        {productData ? productData.count : 0}
                      </td>
                    );
                  })}

                  <td className="p-3 text-center font-semibold">
                    {user.totalUserCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
      {/* Footer */}
      <footer className="text-center py-4 text-orange-800 text-sm font-bold">
        📿 जय श्री राम | मानस परिवार व्यवस्थापक पैनल 📿
      </footer>
    </div>
  );
}
