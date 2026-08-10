"use client";

import { useEffect, useMemo, useState } from "react";
import { listResources } from "@/lib/api";
import ResourceCard from "./ResourceCard";

export default function Feed({ auth, refreshToken }) {
  const [resources, setResources] = useState([]);
  const [tagFilter, setTagFilter] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listResources({ tag: tagFilter || undefined })
      .then(({ resources: fetched }) => {
        if (!cancelled) setResources(fetched);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tagFilter, refreshToken]);

  const tags = useMemo(() => {
    const set = new Set();
    for (const r of resources) {
      for (const tag of r.tags || []) set.add(tag);
    }
    return Array.from(set).sort();
  }, [resources]);

  function handleUpdated(updated) {
    setResources((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
  }

  return (
    <div className="feed">
      <div className="filter-bar">
        <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}>
          <option value="">All tags</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="hint">Loading resources...</p>}
      {!loading && resources.length === 0 && <p className="hint">No resources yet.</p>}

      <div className="resource-list">
        {resources.map((resource) => (
          <ResourceCard
            key={resource._id}
            resource={resource}
            auth={auth}
            onUpdated={handleUpdated}
          />
        ))}
      </div>
    </div>
  );
}
