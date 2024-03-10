import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.uuid('user_id').notNullable()
    table.text('title').notNullable()
    table.text('description').notNullable()
    table.boolean('in_the_diet').notNullable()
    table.timestamp('meal_date').notNullable()
    table.foreign('user_id').references('users.id').withKeyName('fk_user_meal')
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTable('meal')
}
