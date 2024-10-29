import { expect, test } from "vitest";
import { renderHook, act } from "@testing-library/react-hooks";
import { useState } from "react";
import useMemoValue from "./useMemoValue";

test("basics", () => {
  const { result } = renderHook(() => {
    const [ rawValue, setRawValue ] = useState({ name: "starting value" });
    const memoValue = useMemoValue(rawValue);
    return { rawValue, setRawValue, memoValue };
  });

  // init
  expect(result.current.rawValue).toBe(result.current.memoValue);

  // update to same value
  act(() => result.current.setRawValue({ name: "starting value" }));
  expect(result.current.rawValue).not.toBe(result.current.memoValue);
  expect(result.current.memoValue.name).toBe("starting value");

  // update to new value
  act(() => result.current.setRawValue({ name: "changed value" }));
  expect(result.current.rawValue).toBe(result.current.memoValue);
  expect(result.current.memoValue.name).toBe("changed value");
});

test("comparator", () => {
  let fooComparatorCalled = 0;
  let barComparatorCalled = 0;

  const fooComparator = (a: any, b: any) => {
    fooComparatorCalled++;
    return a.foo === b.foo;
  };

  const barComparator = (a: any, b: any) => {
    barComparatorCalled++;
    return a.bar === b.bar;
  };

  const { result } = renderHook(() => {
    const [ rawValue, setRawValue ] = useState({ foo: 1, bar: 1 });
    const [ comparator, setComparator ] = useState(() => fooComparator);
    const memoValue = useMemoValue(rawValue, comparator);
    return { rawValue, setRawValue, setComparator, memoValue };
  });

  // init
  expect(result.current.memoValue.foo).toBe(1);
  expect(result.current.memoValue.bar).toBe(1);
  expect(fooComparatorCalled).toBe(0);
  expect(barComparatorCalled).toBe(0);

  // change something comparator cares about
  act(() => result.current.setRawValue({ foo: 2, bar: 2 }));
  expect(result.current.memoValue.foo).toBe(2);
  expect(result.current.memoValue.bar).toBe(2);
  expect(fooComparatorCalled).toBe(1);
  expect(barComparatorCalled).toBe(0);

  // change something comparator doesn't care about
  act(() => result.current.setRawValue({ foo: 2, bar: 3 }));
  expect(result.current.memoValue.foo).toBe(2);
  expect(result.current.memoValue.bar).toBe(2);
  expect(fooComparatorCalled).toBe(2);
  expect(barComparatorCalled).toBe(0);

  // switch comparators
  act(() => result.current.setComparator(() => barComparator));
  expect(result.current.memoValue.foo).toBe(2);
  expect(result.current.memoValue.bar).toBe(3);
  expect(fooComparatorCalled).toBe(2);
  expect(barComparatorCalled).toBe(1);

  // change something comparator cares about
  act(() => result.current.setRawValue({ foo: 2, bar: 4 }));
  expect(result.current.memoValue.foo).toBe(2);
  expect(result.current.memoValue.bar).toBe(4);
  expect(fooComparatorCalled).toBe(2);
  expect(barComparatorCalled).toBe(2);

  // change something comparator doesn't care about
  act(() => result.current.setRawValue({ foo: 3, bar: 4 }));
  expect(result.current.memoValue.foo).toBe(2);
  expect(result.current.memoValue.bar).toBe(4);
  expect(fooComparatorCalled).toBe(2);
  expect(barComparatorCalled).toBe(3);
});
