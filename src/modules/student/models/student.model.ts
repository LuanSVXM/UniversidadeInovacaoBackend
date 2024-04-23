import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import getEnvironments from "../../../config/environments";

@Index("student_pk", ["id"], { unique: true })
@Entity("students", { schema: getEnvironments().schema })
export default class Student {
  @PrimaryColumn({
    type: "varchar",
    length: 255,
    name: "id",
  })
  id: string | undefined;

  @Column({
    name: "name",
    type: "varchar",
    length: 255,
  })
  name: string | undefined;

  @Column({
    name: "email",
    type: "varchar",
    length: 255,
  })
  email: string | undefined;

  @Column({
    name: "registration_number",
    type: "int",
  })
  registration_number: number | undefined;

  @Column({
    name: "cpf",
    type: "varchar",
    length: 14,
  })
  cpf: string | undefined;

  @Column({
    name: "inactive",
    type: "timestamp",
    nullable: true,
  })
  inactive: Date | undefined;
}
