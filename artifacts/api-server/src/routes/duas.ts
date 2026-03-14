import { Router, type IRouter } from "express";
import { DUA_CATEGORIES, DUAS } from "../data/duas.js";

const router: IRouter = Router();

router.get("/duas/categories", (_req, res) => {
  res.json(DUA_CATEGORIES);
});

router.get("/duas", (req, res) => {
  const { categoryId } = req.query as { categoryId?: string };

  if (categoryId) {
    const duas = DUAS[categoryId] || [];
    return res.json(duas);
  }

  // Return all duas if no category specified
  const allDuas = Object.values(DUAS).flat();
  return res.json(allDuas);
});

export default router;
