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


@Index("employee_pk", ["id"], { unique: true })
@Entity("employees", { schema: getEnvironments().schema })
export default class Employee {

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
    name: "password",
    type: "varchar",
    length: 100,
  })
  password: string | undefined;

  @Column({
    name: "cpf",
    type: "varchar",
    length: 14,
  })
  cpf: string | undefined;

  @Column({
    name: "fired",
    type: "timestamp",
    nullable: true,
  })
  fired: Date | undefined;

}
