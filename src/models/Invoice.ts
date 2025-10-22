import { Invoice } from "../interfaces";
import { fetcher } from "../utils/fetcher";

export async function getInvoice(count: number, arg2?: unknown) {
  console.log("getInvoice received", count, "and an unnecessary", arg2);
  await fetcher<Invoice>(`/invoices/${count}`);
  return { count: count.toString() };
}
