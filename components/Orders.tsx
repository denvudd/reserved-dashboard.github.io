"use client";

import Heading from "./ui/Heading";
import { Separator } from "./ui/Separator";
import { type Product, type Order, type OrderItem } from "@prisma/client";
import { format } from "date-fns";
import { DataTable } from "./ui/DataTable";
import { priceFormatter } from "@/lib/utils";
import { type OrderColumn, columns } from "./tables/orders/columns";

interface OrdersProps {
  orders: ({
    orderItems: ({
      product: Product;
    } & OrderItem)[];
  } & Order)[];
}

const Orders: React.FC<OrdersProps> = ({ orders }) => {
  const formattedOrders: OrderColumn[] = orders.map((order) => ({
    id: order.id,
    phone: order.phone,
    address: order.address,
    products: order.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(", "),
    totalPrice: priceFormatter(
      order.orderItems.reduce((total, item) => {
        return total + Number(item.product.price);
      }, 0)
    ),
    isPaid: order.isPaid,
    createdAt: format(order.createdAt, "Pp"),
    updatedAt: format(order.updatedAt, "Pp"),
  }));

  return (
    <>
      <Heading
        title={`Orders (${orders.length})`}
        description="Menage orders for you store."
      />

      <Separator />
      <DataTable
        columns={columns}
        data={formattedOrders}
        searchKey="products"
      />
    </>
  );
};

export default Orders;
