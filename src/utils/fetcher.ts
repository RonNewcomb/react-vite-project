export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// SAMPLE use axios or something
export const fetcher = <T>(...args: Parameters<typeof fetch>) =>
  fetch(...args)
    .then(() => wait(Math.random() * 2000))
    .then(() => {
      if (Math.random() < 0.2) throw Error("HTTP 500");
      return [];
    })
    .then<T>(() => new Date().toLocaleTimeString() as T);
