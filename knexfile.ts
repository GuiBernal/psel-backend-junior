import dotenv from "dotenv";

dotenv.config();

export = {
  client: "pg",
  connection: {
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT ?? "5432", 10),
    user: process.env.DB_USERNAME,
  },
  migrations: {
    directory: "src/infra/migrations",
    extension: "ts",
  },
};
