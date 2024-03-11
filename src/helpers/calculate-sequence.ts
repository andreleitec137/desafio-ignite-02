import { Tables } from 'knex/types/tables'

export async function calculateSequence(meals: Array<Tables['meals']>) {
  let bestSequence = 0
  let sequence = 0

  meals.forEach(function (meal) {
    // eslint-disable-next-line eqeqeq
    if (meal.in_the_diet == true) {
      sequence = sequence + 1

      if (sequence > bestSequence) bestSequence = sequence
    } else {
      sequence = 0
    }
  })

  return bestSequence
}
