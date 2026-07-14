jest.mock("single-spa-react", () => {
  return jest.fn(() => ({
    bootstrap: jest.fn(),
    mount: jest.fn(),
    unmount: jest.fn(),
  }));
});

jest.mock("./root.component", () => ({
  __esModule: true,
  default: () => null,
}));

import { bootstrap, mount, unmount } from "./bytebank-authentication";

describe("bytebank-authentication entrypoint", () => {
  it("exports single-spa lifecycles", () => {
    expect(typeof bootstrap).toBe("function");
    expect(typeof mount).toBe("function");
    expect(typeof unmount).toBe("function");
  });
});
