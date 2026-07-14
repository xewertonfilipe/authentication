import { useDispatch, useSelector } from "react-redux";

import { useAppDispatch, useAppSelector } from "./hooks";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

describe("store hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns app dispatch from useDispatch", () => {
    const dispatchFn = jest.fn();

    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatchFn);

    const result = useAppDispatch();

    expect(useDispatch).toHaveBeenCalledTimes(1);
    expect(result).toBe(dispatchFn);
  });

  it("re-exports useSelector as typed selector hook", () => {
    expect(useAppSelector).toBe(useSelector);
  });
});
