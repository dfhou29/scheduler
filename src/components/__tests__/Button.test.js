import Button from "../Button";
import React from "react";
import {render} from "@testing-library/react";

it('render without crashing', () => {
  render(<Button/>);
})

it("renders its `children` prop as text", () => {
  const { getByText } = render(<Button>Default</Button>);
  expect(getByText("Default")).toBeInTheDocument();
});