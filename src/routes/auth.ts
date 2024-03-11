import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { Encrypt } from '../helpers/encrypt'
import { generateAccessToken } from '../helpers/generateToken'

export async function authRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      email: z.string(),
      password: z.string(),
    })

    const { email, password } = createUserBodySchema.parse(request.body)

    const user = await knex('users')
      .select()
      .where({
        email,
      })
      .first()

    if (user === undefined) {
      return reply.status(401).send({
        error: 'Email doesnt exists',
      })
    }

    const verifyPassword = await Encrypt.comparePassword(
      password,
      user.password,
    )

    if (!verifyPassword) {
      return reply.status(401).send({
        error: 'Email/Password incorrect',
      })
    }

    const token = generateAccessToken(user.id)

    return reply.status(200).send({
      token,
    })
  })
}
