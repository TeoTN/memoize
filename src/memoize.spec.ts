import { memoize, lastCall } from "./memoize";

const arg1 = { id: 1 };
const arg2 = { id: 2 };
const fn = jest.fn().mockImplementation(Math.random);

describe("Any call", () => {
  const memoizedFn = memoize(fn);
  beforeEach(fn.mockClear);

  test("should call the function once", () => {
    memoizedFn();
    memoizedFn();
    memoizedFn();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test("should return the same value for the same args as previously", () => {
    const firstReturnValue = memoizedFn(arg1, arg2);
    const secondReturnValue = memoizedFn(arg1, arg2);
    expect(firstReturnValue).toBe(secondReturnValue);
  });

  test("should NOT return the same value for the different args", () => {
    const firstReturnValue = memoizedFn(arg1, arg2);
    const secondReturnValue = memoizedFn(arg2, arg1);
    expect(firstReturnValue).not.toBe(secondReturnValue);
  });

  test("should return the same value for the same args as 2 calls ago", () => {
    const firstReturnValue = memoizedFn(arg1, arg2);
    memoizedFn(arg2, arg1);
    const thirdReturnValue = memoizedFn(arg1, arg2);
    expect(firstReturnValue).toBe(thirdReturnValue);
  });
});

describe("last call", () => {
  let memoizedFn = memoize(fn, lastCall);
  beforeEach(() => {
    fn.mockClear();
    memoizedFn = memoize(fn, lastCall);
  });

  it("should call the function once", () => {
    memoizedFn();
    memoizedFn();
    memoizedFn();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should return the same value for the same args as previously", () => {
    const firstReturnValue = memoizedFn(arg1, arg2);
    const secondReturnValue = memoizedFn(arg1, arg2);
    expect(firstReturnValue).toBe(secondReturnValue);
  });
});
