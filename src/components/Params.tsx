export function Params({ id, otherId }: { id: number; otherId: string }) {
  return (
    <div>
      <div>Params readout</div>
      <div>
        id: {id} {typeof id}
      </div>
      <div>
        otherId: {otherId} {typeof otherId}
      </div>
    </div>
  );
}
