import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { Encrypt } from '../helpers/encrypt'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    })

    const { name, email, password } = createUserBodySchema.parse(request.body)

    const isUserRegister = await knex('users')
      .select()
      .where({
        email,
      })
      .first()

    if (isUserRegister) {
      return reply.status(400).send({
        error: 'User already exists',
      })
    }

    const passwordEncoded = await Encrypt.cryptPassword(password)

    await knex('users').insert({
      id: randomUUID(),
      name,
      password: passwordEncoded,
      email,
    })

    return reply.status(201).send()
  })
}
