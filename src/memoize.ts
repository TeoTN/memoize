type AnyFunction = (...args: any[]) => any;
type Mimic<Fn extends AnyFunction> = (
  ...args: Parameters<Fn>
) => ReturnType<Fn>;
type Applier = <Fn extends AnyFunction>(
  fn: Fn,
  ...args: Parameters<Fn>
) => ReturnType<Fn>;
type ComparisonStrategy = (prevArgs: any[], nextArgs: any[]) => boolean;
type MemoizationStrategy = (comparison: ComparisonStrategy) => Applier;

// Comparison strategy
const arrayIdentity: ComparisonStrategy = (
  prevArgs: any[],
  nextArgs: any[]
): boolean => prevArgs.every((arg, idx) => nextArgs[idx] === arg);

// Memoization strategy
const lastCall: MemoizationStrategy = (areArgsSame: ComparisonStrategy) => {
  let previousArgs = [];
  let previousReturnValue;
  return function apply<Fn extends AnyFunction>(
    fn: Fn,
    ...args: Parameters<Fn>
  ) {
    if (!areArgsSame(args, previousArgs)) {
      previousArgs = args;
      previousReturnValue = fn(...args);
    }
    return previousReturnValue;
  };
};

const anyCall: MemoizationStrategy = (areArgsSame: ComparisonStrategy) => {
  const previousCalls = {};
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
  apply: Applier = anyCall(arrayIdentity)
): Mimic<Fn> => {
  return (...args: Parameters<Fn>): ReturnType<Fn> => {
    return apply(fn, ...args);
  };
};
