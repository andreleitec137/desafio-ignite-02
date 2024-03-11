import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { verifyJwtToken } from '../middlewares/verify-jwt-token'
import { calculateSequence } from '../helpers/calculate-sequence'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', (request, reply) => {
    return verifyJwtToken(request, reply)
  })

  app.post('/', async (request, reply) => {
    const userId = request.userId

    const createMealBodySchema = z.object({
      title: z.string(),
      description: z.string(),
      mealDate: z.string(),
      inTheDiet: z.boolean(),
    })

    const { title, description, mealDate, inTheDiet } =
      createMealBodySchema.parse(request.body)

    const user = await knex('users')
      .select()
      .where({
        id: userId,
      })
      .first()

    if (user === undefined) {
      return reply.status(401).send({
        error: 'User doesnt exists',
      })
    }

    await knex('meals').insert({
      id: randomUUID(),
      title,
      description,
      meal_date: mealDate,
      in_the_diet: inTheDiet,
      user_id: userId,
    })

    return reply.status(201).send()
  })

  app.put('/:id', async (request, reply) => {
    const userId = request.userId

    const editMealBodySchema = z.object({
      title: z.string(),
      description: z.string(),
      mealDate: z.string(),
      inTheDiet: z.boolean(),
    })

    const idMealParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = idMealParamsSchema.parse(request.params)

    const { title, description, mealDate, inTheDiet } =
      editMealBodySchema.parse(request.body)

    const meal = await knex('meals')
      .select()
      .where({
        id,
        user_id: userId,
      })
      .first()

    if (meal === undefined) {
      return reply.status(400).send({
        error: 'Meal not found',
      })
    }

    await knex('meals')
      .update({
        title,
        description,
        meal_date: mealDate,
        in_the_diet: inTheDiet,
      })
      .where({
        id,
      })

    return reply.status(200).send()
  })

  app.delete('/:id', async (request, reply) => {
    const userId = request.userId

    const idMealParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = idMealParamsSchema.parse(request.params)

    const meal = await knex('meals')
      .select()
      .where({
        id,
        user_id: userId,
      })
      .first()

    if (meal === undefined) {
      return reply.status(400).send({
        error: 'Meal not found',
      })
    }

    await knex('meals').delete().where({
      id,
    })

    return reply.status(204).send()
  })

  app.get('/', async (request) => {
    const userId = request.userId

    const meals = await knex('meals').select().where({
      user_id: userId,
    })

    return { meals }
  })

  app.get('/:id', async (request, reply) => {
    const userId = request.userId

    const idMealParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = idMealParamsSchema.parse(request.params)

    const meal = await knex('meals')
      .select()
      .where({
        id,
        user_id: userId,
      })
      .first()

    if (meal === undefined) {
      return reply.status(400).send({
        error: 'Meal not found',
      })
    }

    return { meal }
  })

  app.get('/summary', async (request) => {
    const userId = request.userId

    const meals = await knex('meals')
      .select()
      .where({
        user_id: userId,
      })
      .orderBy('meal_date', 'asc')

    if (meals.length === 0) {
      return {
        totalMeals: 0,
        totalMealsInDiet: 0,
        totalMealsOutDiet: 0,
        bestSequence: 0,
      }
    }

    const totalMeals = meals.length

    const totalMealsInDiet = meals.filter((meal) => {
      // eslint-disable-next-line eqeqeq
      return meal.in_the_diet == true
    }).length

    const totalMealsOutDiet = meals.filter((meal) => {
      // eslint-disable-next-line eqeqeq
      return meal.in_the_diet == false
    }).length

    const bestSequence = await calculateSequence(meals)

    return { totalMeals, totalMealsInDiet, totalMealsOutDiet, bestSequence }
  })
}
