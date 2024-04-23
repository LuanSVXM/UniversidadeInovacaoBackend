import { Router } from "express";

import EmployeeController from "../controllers/employee.controller";

const employeeRouter = Router();
const employeeController = new EmployeeController();


employeeRouter.get("/", employeeController.show);


employeeRouter.post("/", employeeController.create);

export default employeeRouter;
