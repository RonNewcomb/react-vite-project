import { Invoice } from "../interfaces";
import { fetcher } from "../utils/fetcher";

export async function getInvoice(count: number) {
  await fetcher<Invoice>(`/invoices/${count}`);
  return { count: count.toString() };
}
