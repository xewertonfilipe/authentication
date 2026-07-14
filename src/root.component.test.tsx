import { render } from "@testing-library/react";
import Root from "./root.component";

jest.mock("single-spa", () => ({
  navigateToUrl: jest.fn(),
}));

describe("Root component", () => {
  it("should be in the document", () => {
    const { getByRole } = render(<Root />);
    expect(
      getByRole("heading", {
        name: /Preencha os campos abaixo para efetuar login!/i,
      })
    ).toBeInTheDocument();
  });
});
