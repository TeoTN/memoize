type AnyFunction = (...args: any[]) => any;
type MemoizedFn<Fn extends AnyFunction> = (
  ...args: Parameters<Fn>
) => ReturnType<Fn>;
type Applier = <Fn extends AnyFunction>(
  fn: Fn,
  ...args: Parameters<Fn>
) => ReturnType<Fn>;
type MemoizationStrategy = () => Applier;

export const lastCall: MemoizationStrategy = <Fn extends AnyFunction>() => {
  let previousArgs: Parameters<Fn>[];
  let previousReturnValue: ReturnType<Fn>;
  return function apply(fn: Fn, ...args: Parameters<Fn>) {
    if (
      !Array.isArray(previousArgs) ||
      !previousArgs.every((arg, idx) => args[idx] === arg)
    ) {
      previousReturnValue = fn(...args);
    }
    previousArgs = args;
    return previousReturnValue;
  };
};

export const anyCall: MemoizationStrategy = <Fn extends AnyFunction>() => {
  const previousCalls: Record<string, ReturnType<Fn>> = {};
  return function apply(fn, ...args) {
    const hash = JSON.stringify(args);
    if (!previousCalls[hash]) {
      previousCalls[hash] = fn(...args);
    }
    return previousCalls[hash];
  };
};

export const memoize = <Fn extends AnyFunction>(
  fn: Fn,
  strategy: MemoizationStrategy = anyCall
): MemoizedFn<Fn> => {
  const apply = strategy();
  return (...args: Parameters<Fn>): ReturnType<Fn> => {
    return apply(fn, ...args);
  };
};
