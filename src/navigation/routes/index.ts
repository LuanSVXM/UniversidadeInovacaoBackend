import { Router } from "express";

import NameRoutes from "../names";
import employeeRouter from "../../modules/employee/routes/employee.routes";
import authRouter from "../../modules/Auth/routes/auth.routes";
import studentRouter from "../../modules/student/routes/student.routes";

const router = Router();

router.use(NameRoutes.StudentRoute, studentRouter);

router.use(NameRoutes.EmployeeRoute, employeeRouter);

router.use(NameRoutes.AuthRoute, authRouter);



export default router;
