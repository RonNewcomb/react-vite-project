import { useStateAsync } from "../hooks/useStateAsync";
import { getInvoice } from "../models/Invoice";
import reactLogo from "/assets/react.svg";

export function Child({ id }: { id: number | string }) {
  console.log("CHILD", id);
  const [invoice, loadingInvoice, invoiceError, refresh] = useStateAsync(getInvoice, [id]);
  return (
    <div>
      <div>
        <img src={reactLogo} className="spin" alt="Loading..." width={16} style={{ visibility: loadingInvoice ? "visible" : "hidden" }} />
        {invoice && <span>invoice: {JSON.stringify(invoice)}</span>}
        {!!invoiceError && <span className="err">invoiceError: {JSON.stringify(invoiceError)}</span>}
      </div>
      <button onClick={() => refresh("silently")}>Reload Invoice</button>
    </div>
  );
}
