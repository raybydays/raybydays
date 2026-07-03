import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LiteYouTube } from "./LiteYouTube";

it("shows a play facade first, then loads the iframe on click", async () => {
  render(<LiteYouTube id="dQw4w9WgXcQ" title="Coast vlog" />);
  const btn = screen.getByRole("button", { name: /play/i });
  expect(screen.queryByTitle("Coast vlog")).not.toBeInTheDocument();
  await userEvent.click(btn);
  const frame = await screen.findByTitle("Coast vlog");
  expect(frame).toHaveAttribute("src", expect.stringContaining("dQw4w9WgXcQ"));
});
