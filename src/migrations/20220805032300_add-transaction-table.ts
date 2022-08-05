import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("transactions", (table) => {
        table.uuid("id").primary();
        table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
        table.decimal("value").notNullable();
        table.text("description").notNullable();
        table.enu("type", ["credit", "debit"]);
        table.uuid("cardId").notNullable().references("cards.id");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("transactions");
}