"use client";

import { useState } from "react";
import { addReaction } from "@/lib/api";

// Starter emoji set - deliberately small. See the "add another reaction
// emoji option" good-first-issue for extending this.
const REACTION_OPTIONS = ["⭐", "🔖"];

export function groupReactions(reactions) {
  const groups = {};
  for (const reaction of reactions) {
    groups[reaction.emoji] = (groups[reaction.emoji] || 0) + 1;
  }
  return groups;
}

export default function ResourceCard({ resource, auth, onUpdated }) {
  const [error, setError] = useState(null);
  const reactionGroups = groupReactions(resource.reactions || []);

  async function handleReact(emoji) {
    if (!auth) return;
    setError(null);
    try {
      const { resource: updated } = await addReaction(
        { resourceId: resource._id, emoji },
        auth.token
      );
      onUpdated(updated);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <article className="resource-card">
      <header>
        <span className="resource-title">
          <a href={resource.url} target="_blank" rel="noreferrer noopener">
            {resource.title}
          </a>
        </span>
        <span className="author">{resource.submittedBy?.displayName || "Unknown"}</span>
      </header>
      {resource.tags?.length > 0 && (
        <div className="tags">
          {resource.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}
      {resource.description && <p className="resource-description">{resource.description}</p>}
      <footer>
        <time>{new Date(resource.createdAt).toLocaleString()}</time>
        <div className="reactions">
          {Object.entries(reactionGroups).map(([emoji, count]) => (
            <span key={emoji} className="reaction-count">
              {emoji} {count}
            </span>
          ))}
          {auth &&
            REACTION_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="reaction-button"
                onClick={() => handleReact(emoji)}
              >
                {emoji}
              </button>
            ))}
        </div>
      </footer>
      {error && <p className="error">{error}</p>}
    </article>
  );
}
