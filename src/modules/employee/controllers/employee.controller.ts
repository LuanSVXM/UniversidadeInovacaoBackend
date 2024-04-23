import { Request, Response } from "express";
import SendMessage from "../../../helpers/message.helper";
import { AppDataSource } from "../../../server";
import { Like } from "typeorm";
import Employee from "../models/employee.model";
import { v4 } from "uuid";
import bcrypt from "bcryptjs";
import {CPFValidation} from "../../../helpers/validations.helper";

export default class EmployeeController {
  public async show(request: Request, response: Response): Promise<Response> {
    try {
      const employeeRepo = AppDataSource.getRepository(Employee);

      const employees = await employeeRepo.find({
        select: { id: true, name: true },
      });

      return response.status(200).json(employees);
    } catch (err: any) {
      return response.status(500).json(SendMessage(err));
    }
  }

  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { name, password, cpf } = request.body;

      if (
        !name ||
        typeof name !== "string" ||
        !password ||
        typeof password !== "string"
      ) {
        return response.status(404).json(SendMessage("Campos inválidos"));
      }

      if (name.length < 2 || password.length < 8) {
        return response.status(404).json(SendMessage("Campos inválidos"));
      }

      const employeeRepo = AppDataSource.getRepository(Employee);

      if (!CPFValidation(String(cpf))) {
        return response.status(404).json(SendMessage("CPF inválido"));
      }

      const findCpf = await employeeRepo.findOne({
        select: {
          id: true,
        },
        where: {
          cpf: Like(cpf),
        },
      });

      if (findCpf) {
        return response.status(404).json(SendMessage("CPF já cadastrado!"));
      }

      const hash = await bcrypt.hashSync(String(password), 10);

      const newEmployee = new Employee();
      newEmployee.id = v4();
      newEmployee.name = String(name);
      newEmployee.password = hash;
      newEmployee.cpf = String(cpf);
      newEmployee.fired = undefined;

      await employeeRepo.insert(newEmployee);

      return response.status(200).json(newEmployee);
    } catch (err: any) {
      return response.status(500).json(SendMessage(err));
    }
  }
}
