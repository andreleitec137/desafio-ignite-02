import { env } from '../env'
import jwt from 'jsonwebtoken'

export function generateAccessToken(userId: string) {
  try {
    return jwt.sign({ userId }, env.TOKEN_SECRET, { expiresIn: '1 days' })
  } catch (error) {
    console.log(error)
  }
}
