import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Product {
  _id: string;
  name: string;
  description?: string;
}

interface ProductCardProps {
  product: Product;
  count: number;
  onCountChange: (newCount: number) => void;
}

export default function ProductCard({ product, count, onCountChange }: ProductCardProps) {
  const [localCount, setLocalCount] = useState(count);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (isNaN(localCount)) return;
    try {
      setSaving(true);
      await onCountChange(localCount);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col justify-between bg-white hover:shadow-md transition">
      <div>
        <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
        {product.description && (
          <p className="text-sm text-gray-600 mb-3">{product.description}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={localCount}
          min={0}
          onChange={(e) => setLocalCount(Number(e.target.value))}
          className="w-20"
        />
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
