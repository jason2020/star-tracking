import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders properly", () => {
  render(<App />);
  const headerElement = screen.getByText(/Star Tracking/i);
  expect(headerElement).toBeInTheDocument();
});
