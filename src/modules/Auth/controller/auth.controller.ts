import { Request, Response } from "express";
import SendMessage from "../../../helpers/message.helper";
import { AppDataSource } from "../../../server";
import { Like } from "typeorm";
import bycript from "bcryptjs";
import Employee from "../../employee/models/employee.model";
import { ConvertJWT } from "../../../helpers/jwt.helper";

export default class AuthController {
  public async auth(request: Request, response: Response): Promise<Response> {
    try {
      const { password, user } = request.body;

      if (!password || !user) {
        return response.status(404).json(SendMessage("Campos inválidos"));
      }

      const employeeRepo = AppDataSource.getRepository(Employee);

      const employee = await employeeRepo.findOne({
        where: {
          id: String(user),
        },
      });

      if (!employee) {
        return response.status(404).json(SendMessage("Usuário não encontrado"));
      }

      const match = await bycript.compareSync(
        password,
        String(employee.password)
      );

      if (!match) {
        return response.status(404).json(SendMessage("Senha errada"));
      }

      const data = {
        employee: employee.id,
      };

      return response.status(200).json({ token: ConvertJWT(data) });
    } catch (err: any) {
      return response.status(500).json(SendMessage(err));
    }
  }
}
