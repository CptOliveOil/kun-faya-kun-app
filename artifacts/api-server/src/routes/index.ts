import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import dhikrRouter from "./dhikr";
import duasRouter from "./duas";
import prayersRouter from "./prayers";
import quranRouter from "./quran";
import storiesRouter from "./stories";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(dhikrRouter);
router.use(duasRouter);
router.use(prayersRouter);
router.use(quranRouter);
router.use(storiesRouter);

export default router;
