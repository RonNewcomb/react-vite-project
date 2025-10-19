import { useCallback, useMemo, useRef, useState } from "react";

type RefreshFn<T> = () => Promise<ReturnTupleType<T>>;
type ReturnTupleType<T> = [T | undefined, boolean, unknown, RefreshFn<T>, Promise<ReturnTupleType<T>>];

// const PAYLOAD = 0;
// const LOADING = 1;
// const ERROR = 2;
const REFRESH = 3;
const PROMISE = 4;

/** useAsync without useEffect */
export function useStateAsync<T>(fnAsync: (() => Promise<T>) | undefined | null | false | 0 | "", dependencies: unknown[]): ReturnTupleType<T> {
  console.log("Re-renderin useStateAsync", dependencies);
  const [tuple, setTuple] = useState<ReturnTupleType<T>>(constructEmpty);
  const args = useRef<unknown[] | undefined>(undefined); // in react STRICT MODE, remembering and checking this to see if we need to issue I/O avoids extra-fetch

  // manaul refresh, always happens
  tuple[REFRESH] = useCallback<RefreshFn<T>>(() => {
    return fnAsync
      ? fnAsync()
          .then<ReturnTupleType<T>>(data => [data, false, undefined, tuple[REFRESH], tuple[PROMISE]])
          .catch<ReturnTupleType<T>>((err: unknown) => [undefined, false, err, tuple[REFRESH], tuple[PROMISE]])
          .then(tuple => {
            setTuple(tuple);
            console.log("RETURNING");
            return tuple;
          })
      : tuple[PROMISE];
  }, dependencies);

  // conditional refresh, conditional on dependecies automatic change & not already emitted fetch
  useMemo(() => {
    console.log("CALLING?");
    if (
      !Array.isArray(dependencies) || // if dependencies is missing or not an array, call everytime
      !args.current || // if we've never done this before, call it
      args.current.length != dependencies.length || // if the arrays differ in size or shallow contents, call it
      args.current.some((arg, i) => !Object.is(arg, dependencies[i]))
    ) {
      console.log("CALLING...");
      args.current = dependencies;
      tuple[REFRESH]();
    }
    //return tuple[PROMISE];
  }, dependencies);

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
