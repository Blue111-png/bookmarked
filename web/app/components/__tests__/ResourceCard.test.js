import { render, screen } from "@testing-library/react";
import ResourceCard, { groupReactions } from "../ResourceCard";

describe("groupReactions", () => {
  it("counts reactions by emoji", () => {
    const reactions = [{ emoji: "⭐" }, { emoji: "⭐" }, { emoji: "🔖" }];
    expect(groupReactions(reactions)).toEqual({ "⭐": 2, "🔖": 1 });
  });

  it("returns an empty object for no reactions", () => {
    expect(groupReactions([])).toEqual({});
  });
});

describe("ResourceCard", () => {
  const resource = {
    _id: "1",
    title: "MDN Async/Await Guide",
    url: "https://developer.mozilla.org",
    description: "Great explainer for async/await.",
    tags: ["javascript", "beginner"],
    createdAt: new Date().toISOString(),
    submittedBy: { _id: "u1", displayName: "Amina Yusuf" },
    reactions: [{ emoji: "⭐", user: { _id: "u2" } }],
  };

  it("renders the resource title, author, and tags", () => {
    render(<ResourceCard resource={resource} auth={null} onUpdated={() => {}} />);

    expect(screen.getByText("MDN Async/Await Guide")).toBeInTheDocument();
    expect(screen.getByText("Amina Yusuf")).toBeInTheDocument();
    expect(screen.getByText("javascript")).toBeInTheDocument();
    expect(screen.getByText("beginner")).toBeInTheDocument();
  });

  it("does not show reaction buttons when logged out", () => {
    render(<ResourceCard resource={resource} auth={null} onUpdated={() => {}} />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
