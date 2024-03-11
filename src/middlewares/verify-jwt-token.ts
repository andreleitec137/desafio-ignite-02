import { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'
import { env } from '../env'

export interface JwtPayload {
  userId: string
  exp: number // Data de expiração do token (timestamp)
}

export async function verifyJwtToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const token = request.headers.authorization?.replace('Bearer ', '')
  if (token === '' || token === undefined) {
    return reply.status(401).send()
  }

  const tokenWithoutBearer = token.replace('Bearer ', '')

  try {
    const payload: JwtPayload = jwt.verify(
      tokenWithoutBearer,
      env.TOKEN_SECRET,
    ) as JwtPayload
    const { userId } = payload
    request.userId = userId
  } catch (error) {
    return reply.status(401).send()
  }
}
