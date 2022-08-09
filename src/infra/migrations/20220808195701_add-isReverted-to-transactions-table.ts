import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table("transactions", (table) => {
        table.boolean("isReverted").defaultTo(false);
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("transactions", (table) => {
        table.dropColumn("isReverted");
    });
}

