import { Request, Response } from "express";
import SendMessage from "../../../helpers/message.helper";
import { AppDataSource } from "../../../server";
import { IsNull, Like } from "typeorm";
import { v4 } from "uuid";
import bcrypt from "bcryptjs";
import {
  CPFValidation,
  EmailValidation,
} from "../../../helpers/validations.helper";
import Student from "../models/student.model";
import { DEFAULT_LIMIT } from "../../../config/constants";
import { calcutePages } from "../../../helpers/pagesCount.helper";

export default class StudentController {
  public async count(request: Request, response: Response): Promise<Response> {
    try {
      const { per_page } = request.query;

      const studentRepo = AppDataSource.getRepository(Student);

      const studentsCount = await studentRepo.count({
        where: { inactive: IsNull() },
      });

      const pages = Number(per_page) > 0 ? Number(per_page) : DEFAULT_LIMIT;

      return response
        .status(200)
        .json({ total_pages: calcutePages(pages, studentsCount) });
    } catch (err: any) {
      return response.status(500).json(SendMessage(err));
    }
  }

  public async show(request: Request, response: Response): Promise<Response> {
    try {
      const { page, per_page, type, search } = request.query;

      const types = ["name", "registration_number", "email", "cpf"];

      const where = {} as any;

      if (
        search &&
        type &&
        types.includes(String(type)) &&
        String(search).length > 0
      ) {
        where[String(type)] = Like(`%${search}%`);
      }

      const formated_page = Number(page) > 0 ? Number(page) : 1;
      const formated_per_page = Number(per_page) || DEFAULT_LIMIT;

      console.log({ formated_page, formated_per_page });
      
      const skip = parseInt(String((formated_page - 1) * formated_per_page));

      const take = parseInt(String(formated_per_page));


      console.log({skip,take});

      const studentRepo = AppDataSource.getRepository(Student);

      const students = await studentRepo.find({
        where: { inactive: IsNull(), ...where },
        order: {
          name: "ASC",
        },
        skip: skip,
        take: take,
      });

      return response.status(200).json(students);
    } catch (err: any) {
      return response.status(500).json(SendMessage(err));
    }
  }

  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { registration_number, name, cpf, email } = request.body;

      if (
        !registration_number ||
        !name ||
        !cpf ||
        !email ||
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof cpf !== "string" ||
        typeof registration_number !== "number"
      ) {
        console.log(
          !registration_number,
          !name,
          !cpf,
          !email,
          typeof name !== "string",
          typeof email !== "string",
          typeof cpf !== "string",
          typeof registration_number !== "number",
          typeof registration_number
        );
        return response.status(500).json(SendMessage("Campos inválido"));
      }

      if (String(registration_number).length > 10) {
        return response
          .status(500)
          .json(SendMessage("Numero de Registro com tamanho inválido"));
      }

      if (name.length > 250 || name.length < 2) {
        return response
          .status(500)
          .json(SendMessage("Nome com tamanho inválido"));
      }

      if (!CPFValidation(String(cpf))) {
        return response.status(404).json(SendMessage("CPF inválido"));
      }

      if (!EmailValidation(String(email))) {
        return response.status(404).json(SendMessage("Email inválido"));
      }

      const studentRepo = AppDataSource.getRepository(Student);

      const verifyRegister = await studentRepo.findOne({
        where: [
          {
            registration_number: registration_number,
          },
          {
            cpf: cpf,
          },
          {
            email: email,
          },
        ],
        select: {
          id: true,
          email: true,
          cpf: true,
          registration_number: true,
        },
      });

      console.log(verifyRegister);

      if (verifyRegister) {
        return response
          .status(404)
          .json(
            SendMessage(
              verifyRegister.cpf === cpf
                ? "CPF já existente"
                : verifyRegister.email === email
                ? "Email já existente"
                : "Numero de registro ja existe"
            )
          );
      }

      let id = v4();

      while (
        await studentRepo.findOne({ where: { id: id }, select: { id: true } })
      ) {
        id = v4();
      }

      const newStudante = new Student();

      newStudante.id = v4();
      newStudante.name = String(name).trim();
      newStudante.registration_number = Number(registration_number);
      newStudante.cpf = String(cpf).trim();
      newStudante.email = String(email).trim();

      await studentRepo.insert(newStudante);

      return response.status(200).json(newStudante);
    } catch (err: any) {
      return response.status(500).json(SendMessage(err));
    }
  }

  public async update(request: Request, response: Response): Promise<Response> {
    try {
      const { id, email, name } = request.body;

      const studentRepo = AppDataSource.getRepository(Student);

      const student = await studentRepo.findOne({
        where: { id: id },
      });

      if (!student) {
        return response.status(404).json(SendMessage("usuario não encontrado"));
      }

      if (name) {
        if (typeof name !== "string" || String(name).length > 250) {
          return response.status(400).json(SendMessage("Nome inválido"));
        }
        student.name = String(name).trim();
      }

      if (email) {
        if (!EmailValidation(email)) {
          return response.status(400).json(SendMessage("Email inválido"));
        }

        const verifyEmail = await studentRepo.findOne({
          where: { email: email },
          select: { id: true },
        });

        if (verifyEmail && verifyEmail?.id != student.id) {
          return response
            .status(404)
            .json(SendMessage("Email já existe no sistema."));
        }

        student.email = String(email).trim();
      }
      const studentID = student.id;

      delete student.id;

      await studentRepo.update({ id: studentID }, { ...student });

      return response.status(200).json(student);
    } catch (err: any) {
      return response.status(500).json(SendMessage(err));
    }
  }

  public async remove(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.params;

      const studentRepo = AppDataSource.getRepository(Student);

      const student = await studentRepo.findOne({
        where: { id: String(id) },
      });

      if (!student) {
        return response.status(404).json(SendMessage("usuario não encontrado"));
      }

      await studentRepo.update({ id: student.id }, { inactive: new Date() });

      return response.status(200).json(student);
    } catch (err: any) {
      return response.status(500).json(SendMessage(err));
    }
  }
}
