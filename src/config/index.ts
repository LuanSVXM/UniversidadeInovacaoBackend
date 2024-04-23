import { DataSourceOptions } from "typeorm";
import getEnvironments from "./environments";
interface IConfig {
  DATASOURCE: DataSourceOptions;
  PORT: number;
}

export default function Config(): IConfig {
  return {
    DATASOURCE: {
      type: "postgres",
      ...getEnvironments(),
      entities: [getEnvironments().entities],
    },
    PORT: Number(process.env.PORT) || 3002,
  };
}
