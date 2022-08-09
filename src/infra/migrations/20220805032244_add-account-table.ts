import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("accounts", (table) => {
        table.uuid("id").primary();
        table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
        table.text("branch").notNullable();
        table.text("account").notNullable();
        table.decimal("balance").notNullable().defaultTo(0);
        table.uuid("peopleId").notNullable().references("peoples.id");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("accounts");
}


