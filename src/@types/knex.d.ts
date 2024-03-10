// Arquivo D TS é definição de tipos

// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      password: string
      created_at: string
    }
    meals: {
      id: string
      user_id: string
      title: string
      description: string
      in_the_diet: boolean
      meal_date: string
      created_at: string
    }
  }
}
