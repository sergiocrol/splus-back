import { Router } from "../deps.ts";

import loginController from "../controllers/login.ts";
import isAdmin from "../middlewares/isAdminMiddleware.ts";
import isToken from "../middlewares/isToken.ts";

const router = new Router();

router.get("/communities", loginController.communities);
router.get("/discussions", loginController.discussions);
router.get("/blog", loginController.blog);
router.get("/users", loginController.getUsers);
router.get("/admin", isToken, isAdmin, loginController.isAdmin);
router.post("/login", loginController.login);
router.post("/signup", loginController.signupRequest);
router.post("/user", isToken, isAdmin, loginController.addUser);
router.put("/user", isToken, isAdmin, loginController.updateUser);
router.delete("/user", isToken, isAdmin, loginController.deleteUser);

export default router;
