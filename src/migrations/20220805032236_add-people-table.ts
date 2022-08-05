import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("peoples", (table) => {
        table.uuid("id").primary();
        table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
        table.text("name").notNullable();
        table.text("document").notNullable();
        table.text("password").notNullable();
        table.decimal("balance").notNullable().defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("peoples");
}

