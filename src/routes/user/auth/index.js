import express from "express";
import UserController from "../../../controllers/UserController";

const router = express.Router();

router.post("/", UserController.create);
router.patch("/:id", UserController.patch);
router.put("/:id", UserController.update);
router.delete("/:id", UserController.delete);

export default router;
