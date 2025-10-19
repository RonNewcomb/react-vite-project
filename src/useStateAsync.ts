import { useCallback, useMemo, useState } from "react";

type RefreshFn<T> = () => Promise<ReturnTupleType<T>>;
type ReturnTupleType<T> = [T | undefined, boolean, unknown, RefreshFn<T>, Promise<ReturnTupleType<T>>];

// const PAYLOAD = 0;
// const LOADING = 1;
// const ERROR = 2;
const REFRESH = 3;
const PROMISE = 4;

/** useAsync without useEffect */
export function useStateAsync<T>(fnAsync: (() => Promise<T>) | undefined | null | false | 0 | "", depArray: unknown[]): ReturnTupleType<T> {
  console.log("useStateAsync", depArray);
  const [tuple, setTuple] = useState<ReturnTupleType<T>>(constructEmpty);

  tuple[REFRESH] = useCallback<RefreshFn<T>>(() => {
    console.log("CALLING");
    if (fnAsync) {
      tuple[PROMISE] = fnAsync()
        .then<ReturnTupleType<T>>(data => [data, false, undefined, tuple[REFRESH], tuple[PROMISE]])
        .catch<ReturnTupleType<T>>((err: unknown) => [undefined, false, err, tuple[REFRESH], tuple[PROMISE]])
        .then(tuple => {
          setTuple(tuple);
          console.log("RETURNING");
          return tuple;
        });
    }
    return tuple[PROMISE];
  }, depArray);

  // calls above refresh fn which will also save the returned promise
  useMemo(tuple[REFRESH], depArray);

  return tuple;
}

/**
 * constructs a tuple that contains a thing that contains a thing that points to the original tuple
 */
function constructEmpty<T>(initialValue: T | undefined = undefined): ReturnTupleType<T> {
  const tuple: ReturnTupleType<T> = [initialValue, false, undefined, undefined as never, undefined as never];
  tuple[PROMISE] = Promise.resolve(tuple);
  tuple[REFRESH] = () => tuple[PROMISE];
  return tuple satisfies ReturnTupleType<T>;
}
