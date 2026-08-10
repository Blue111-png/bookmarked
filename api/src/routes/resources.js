const express = require("express");
const Resource = require("../models/Resource");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// GET /api/resources?tag=<tag>&submittedBy=<userId>
router.get("/", async (req, res) => {
  try {
    const { tag, submittedBy } = req.query;
    const filter = {};

    if (tag) {
      filter.tags = tag.trim().toLowerCase();
    }

    if (submittedBy) {
      filter.submittedBy = submittedBy;
    }

    const resources = await Resource.find(filter)
      .sort({ createdAt: -1 })
      .populate("submittedBy", "displayName email")
      .populate("reactions.user", "displayName email");

    return res.json({ resources });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch resources" });
  }
});

// GET /api/resources/:id
router.get("/:id", async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate("submittedBy", "displayName email")
      .populate("reactions.user", "displayName email");

    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    return res.json({ resource });
  } catch (err) {
    return res.status(400).json({ error: "Invalid resource id" });
  }
});

// POST /api/resources
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, url, description, tags } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "title is required and cannot be empty" });
    }

    if (!url || !url.trim()) {
      return res.status(400).json({ error: "url is required and cannot be empty" });
    }

    const resource = await Resource.create({
      submittedBy: req.user.id,
      title: title.trim(),
      url: url.trim(),
      description: description ? description.trim() : "",
      tags: Array.isArray(tags) ? tags : [],
    });

    const populated = await resource.populate("submittedBy", "displayName email");

    return res.status(201).json({ resource: populated });
  } catch (err) {
    return res.status(500).json({ error: "Failed to create resource" });
  }
});

// POST /api/resources/:id/reactions
router.post("/:id/reactions", requireAuth, async (req, res) => {
  try {
    const { emoji } = req.body;

    if (!emoji || !emoji.trim()) {
      return res.status(400).json({ error: "emoji is required" });
    }

    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    const alreadyReacted = resource.reactions.some(
      (r) => r.user.toString() === req.user.id && r.emoji === emoji
    );
    if (alreadyReacted) {
      return res.status(409).json({ error: "You already reacted with that emoji" });
    }

    resource.reactions.push({ emoji, user: req.user.id });
    await resource.save();

    const populated = await resource.populate([
      { path: "submittedBy", select: "displayName email" },
      { path: "reactions.user", select: "displayName email" },
    ]);

    return res.status(201).json({ resource: populated });
  } catch (err) {
    return res.status(400).json({ error: "Invalid resource id" });
  }
});

// DELETE /api/resources/:id/reactions/:reactionId
router.delete("/:id/reactions/:reactionId", requireAuth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    const reaction = resource.reactions.id(req.params.reactionId);
    if (!reaction) {
      return res.status(404).json({ error: "Reaction not found" });
    }

    if (reaction.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "You can only remove your own reactions" });
    }

    reaction.deleteOne();
    await resource.save();

    const populated = await resource.populate([
      { path: "submittedBy", select: "displayName email" },
      { path: "reactions.user", select: "displayName email" },
    ]);

    return res.json({ resource: populated });
  } catch (err) {
    return res.status(400).json({ error: "Invalid resource or reaction id" });
  }
});

module.exports = router;
