import express from 'express'
import expressGraphql from 'express-graphql'

import { StarWarsSchema } from './schemas'

console.log('Server online!')
express()
  .use('/graphql', expressGraphql({ schema: StarWarsSchema, pretty: true }))
  .listen(3000)
