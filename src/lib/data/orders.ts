import { promises as fs } from "fs";
import path from "path";
import type { Order, OrdersData } from "./order-types";
import { isDatabaseEnabled } from "@/lib/db/sql";
import * as pg from "@/lib/db/postgres";

const ORDERS_PATH = path.join(process.cwd(), "data", "orders.json");

export async function readOrders(): Promise<OrdersData> {
  if (isDatabaseEnabled()) {
    return { orders: await pg.pgGetAllOrders() };
  }
  try {
    const raw = await fs.readFile(ORDERS_PATH, "utf-8");
    return JSON.parse(raw) as OrdersData;
  } catch {
    return { orders: [] };
  }
}

export async function writeOrders(data: OrdersData): Promise<void> {
  await fs.mkdir(path.dirname(ORDERS_PATH), { recursive: true });
  await fs.writeFile(ORDERS_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function saveOrder(order: Order): Promise<Order> {
  if (isDatabaseEnabled()) return pg.pgSaveOrder(order);
  const data = await readOrders();
  data.orders.unshift(order);
  await writeOrders(data);
  return order;
}

export async function getOrdersByPhone(phone: string): Promise<Order[]> {
  if (isDatabaseEnabled()) return pg.pgGetOrdersByPhone(phone);
  const normalized = phone.replace(/\D/g, "");
  const data = await readOrders();
  return data.orders.filter((o) => o.customer.phone.replace(/\D/g, "") === normalized);
}

export async function getOrdersByEmail(email: string): Promise<Order[]> {
  if (isDatabaseEnabled()) return pg.pgGetOrdersByEmail(email);
  const normalized = email.trim().toLowerCase();
  const data = await readOrders();
  return data.orders.filter((o) => o.customer.email.trim().toLowerCase() === normalized);
}

export function generateOrderId(): string {
  return `TP-${Date.now().toString(36).toUpperCase()}`;
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  if (isDatabaseEnabled()) return pg.pgGetOrderById(id);
  const data = await readOrders();
  return data.orders.find((o) => o.id === id);
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"]
): Promise<Order | undefined> {
  if (isDatabaseEnabled()) return pg.pgUpdateOrderStatus(id, status);
  const data = await readOrders();
  const idx = data.orders.findIndex((o) => o.id === id);
  if (idx < 0) return undefined;
  data.orders[idx] = { ...data.orders[idx], status };
  await writeOrders(data);
  return data.orders[idx];
}

export async function getAllOrders(): Promise<Order[]> {
  if (isDatabaseEnabled()) return pg.pgGetAllOrders();
  const data = await readOrders();
  return data.orders;
}
