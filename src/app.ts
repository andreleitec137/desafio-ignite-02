import fastify from 'fastify'
import { usersRoutes } from './routes/users'
import { mealsRoutes } from './routes/meals'
import { authRoutes } from './routes/auth'

export const app = fastify()

app.register(usersRoutes, {
  prefix: 'users',
})

app.register(mealsRoutes, {
  prefix: 'meals',
})

app.register(authRoutes, {
  prefix: 'auth',
})
