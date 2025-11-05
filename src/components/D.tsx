export function D(props: { id?: string }) {
  return <div>D {props?.id || ""}</div>;
}

export default D;
