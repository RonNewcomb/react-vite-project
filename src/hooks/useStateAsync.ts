import { useCallback, useMemo, useRef, useState } from "react";

export type UseStateAsyncRefreshFn<T> = () => Promise<UseStateAsyncReturnTuple<T>>;
export type UseStateAsyncReturnTuple<T> = [T | undefined, boolean, unknown, UseStateAsyncRefreshFn<T>, Promise<UseStateAsyncReturnTuple<T>>];
export type UseStateAsyncInputFn<T> = (() => Promise<T>) | undefined | null | false | 0 | "";
export type UseStateAsyncInputTuple<T> = [UseStateAsyncInputFn<T>, T?, boolean?, unknown?];

// const PAYLOAD = 0;
// const LOADING = 1;
// const ERROR = 2;
const REFRESH = 3;
const PROMISE = 4;

/**
 * useStateAsync without useEffect, because the important thing about useEffect is the deparray to skip some re-renders, not when it is issued.
 *
 * passed-in async fn can be falsy instead to skip calls.
 * passed-in async fn is not checked for ref changes, so you can use an inline lambda without infinite rerender
 * but if you want rerender on asyncfn change, add it to the depArray
 *
 * first arg can be an array, holding
 * [async fn same as above, initial payload, initial isLoading, initial error]
 *
 * @returns a tuple holding the resolved data, isLoading, any error, an imperative refresh function, the promise used
 */
export function useStateAsync<T>(main: UseStateAsyncInputFn<T> | UseStateAsyncInputTuple<T>, depArray: unknown[]): UseStateAsyncReturnTuple<T> {
  // console.log("Re-rendering useStateAsync", depArray);
  const [fnAsync, initialValue, initialLoading, initialError] = Array.isArray(main) ? main : [main];
  const [tuple, setTuple] = useState<UseStateAsyncReturnTuple<T>>(() => constructEmpty(initialValue, initialLoading, initialError));

  // for when the 2nd fetch returns before the 1st fetch returns
  const staleDataCounter = useRef(1);

  // manaul refresh, always happens, can be imperatively invoked by user to force a refresh
  tuple[REFRESH] = useCallback<UseStateAsyncRefreshFn<T>>(() => {
    if (!fnAsync) return tuple[PROMISE]; // no function, nothing can change.
    staleDataCounter.current++;
    const myInstance = staleDataCounter.current;
    console.log("CALLING #", myInstance);

    const promise = fnAsync()
      .then<UseStateAsyncReturnTuple<T>>(data => [data, false, undefined, tuple[REFRESH], tuple[PROMISE]])
      .catch<UseStateAsyncReturnTuple<T>>((err: unknown) => [undefined, false, err, tuple[REFRESH], tuple[PROMISE]])
      .then(newTuple => {
        if (myInstance !== staleDataCounter.current) {
          console.log("STALE DATA", myInstance, staleDataCounter.current);
          return tuple; // old tuple is correct? better than exception since why catch it.
        } else {
          console.log("RETURNING", newTuple);
          setTuple(newTuple);
          return newTuple;
        }
      });
    setTuple(([v, _, e, f]) => [v, true, e, f, promise]); // isLoading = true, fresh promise made on the line above, previous data/error preserved
    return tuple[PROMISE];
  }, depArray);

  // in react STRICT MODE, remembering and checking this to see if we need to issue I/O avoids extra-fetch
  const depArrayOld = useRef<typeof depArray | undefined>(undefined);

  // conditional refresh, conditional on dependencies automatically change & not already emitted fetch for them
  useMemo(() => {
    console.log("CALL?");
    if (
      !Array.isArray(depArray) || // if dependencies is missing or not an array, call everytime
      !Array.isArray(depArrayOld.current) || // if we've never done this before, call it
      depArrayOld.current.length != depArray.length || // if the arrays differ in size or shallow contents, call it
      depArrayOld.current.some((arg, i) => !Object.is(arg, depArray[i]))
    ) {
      depArrayOld.current = depArray;
      tuple[REFRESH]();
    }
  }, depArray);

  return tuple;
}

/**
 * constructs a tuple that contains a thing that contains a thing that points to the original tuple
 */
function constructEmpty<T>(initialValue: T | undefined = undefined, initialLoading = false, initialError: unknown = undefined): UseStateAsyncReturnTuple<T> {
  const tuple: UseStateAsyncReturnTuple<T> = [initialValue, initialLoading, initialError, undefined as never, undefined as never];
  tuple[PROMISE] = Promise.resolve(tuple);
  tuple[REFRESH] = () => tuple[PROMISE];
  return tuple;
}
