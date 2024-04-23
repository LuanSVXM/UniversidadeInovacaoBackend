import { Router } from "express";

import StudentController from "../controllers/student.controller";
import AuthorizationEnsure from "../../../middlewares/AuthorizationEnsure.middleware";

const studentRouter = Router();
const studentController = new StudentController();

studentRouter.get("/", AuthorizationEnsure, studentController.show);

studentRouter.get("/count", AuthorizationEnsure, studentController.count);

studentRouter.post("/", AuthorizationEnsure, studentController.create);

studentRouter.put("/",AuthorizationEnsure, studentController.update);

studentRouter.delete("/:id", AuthorizationEnsure, studentController.remove);

export default studentRouter;
