import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("cards", (table) => {
        table.uuid("id").primary();
        table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
        table.text("number").notNullable();
        table.text("cvv").notNullable();
        table.enu("type", ["virtual", "physical"]);
        table.uuid("accountId").notNullable().references("accounts.id");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("cards");
}
