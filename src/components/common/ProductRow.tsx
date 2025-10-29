import { Button } from "@/components/ui/button";

interface Product {
  _id: string;
  name: string;
  totalCount?: number;
}

interface Props {
  product: Product;
  onDelete: (id: string) => void;
}

export default function ProductRow({ product, onDelete }: Props) {
  return (
    <tr className="border-t">
      <td className="p-3">{product.name}</td>
      <td className="p-3">{product.totalCount ?? 0}</td>
      <td className="p-3">
        <Button variant="destructive" onClick={() => onDelete(product._id)}>
          Delete
        </Button>
      </td>
    </tr>
  );
}
