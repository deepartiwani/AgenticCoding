
import type { OrderType } from "./OrderTypes";
import { OrderCard } from "./OrderCard";

interface OrdersListProps {
  orders: OrderType[];
}

export function OrdersList({ orders }: OrdersListProps) {
  return (
    <div className="mt-8 space-y-6">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
