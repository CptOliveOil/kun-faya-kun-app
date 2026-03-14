import { Router, type IRouter } from "express";
import { STORY_CATEGORIES, STORIES } from "../data/stories";

const router: IRouter = Router();

router.get("/stories/categories", (_req, res) => {
  return res.json(STORY_CATEGORIES);
});

router.get("/stories", (req, res) => {
  const { categoryId } = req.query as { categoryId?: string };

  let stories = STORIES;
  if (categoryId) {
    stories = stories.filter(s => s.categoryId === categoryId);
  }

  // Return summary without full content for listing
  return res.json(
    stories.map(s => ({
      id: s.id,
      categoryId: s.categoryId,
      title: s.title,
      subtitle: s.subtitle,
      arabicTitle: s.arabicTitle,
      readTime: s.readTime,
      tags: s.tags,
      content: s.content,
    }))
  );
});

router.get("/stories/:id", (req, res) => {
  const { id } = req.params;
  const story = STORIES.find(s => s.id === id);

  if (!story) {
    return res.status(404).json({ error: "Story not found" });
  }

  return res.json(story);
});

export default router;
