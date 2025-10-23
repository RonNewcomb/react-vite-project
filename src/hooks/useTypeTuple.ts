// //type TypedFn<A, B, C, D> = (a: A, b: B, c?: C, d?: D) => void;
// type TypedFn<T> = (...args: unknown[]) => Promise<T>;

// //export function useTypeTuple<T, A, B, C>(fn: TypedFn<T, A, B, C>, depArray: Parameters<typeof fn>);
// export function useTypeTuple<T>(fn: TypedFn<T>, depArray: Parameters<typeof fn>) {}

// async function consumer1(x: number, s: string) {
//   return 3;
// }
// async function consumer2(b: boolean, o: { foo: string }, ys: number[]) {
//   return "hi";
// }

// useTypeTuple(consumer1, [5, "6"]);
// useTypeTuple(consumer2, [false, { foo: "world" }, [4, 5]]);
// useTypeTuple(() => consumer1(1, "lkj"), [5, "6"]);
// useTypeTuple(() => consumer2(false, { foo: "" }, []), [5, "6"]);

// useTypeTuple(consumer1, [5, 6]); // 6 should be string
// useTypeTuple(consumer1, [5]); // 2nd element missing
// useTypeTuple(consumer1, [5, "6", "lkj"]); // boolean, obj, array
// useTypeTuple(consumer1, [false, {}, [4, 5]]); // 2nd obj missing property, 3rd array

// function foo<A, B>();
// function foo<A>() {}

// foo<boolean>();
// foo<string, number>();
