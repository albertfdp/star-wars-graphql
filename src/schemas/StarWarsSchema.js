import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLEnumType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInterfaceType
} from 'graphql'

import { getFriends, getHero, getHuman, getDroid } from '../data'

const episodeEnum = new GraphQLEnumType({
  name: 'Episode',
  description: 'One of the films of the Star Wars Trilogy',
  values: {
    NEWHOPE: { value: 4, description: 'Released in 1977' },
    EMPIRE: { value: 5, description: 'Released in 1980' },
    JEDI: { value: 6, description: 'Released in 1983' }
  }
})

const charaterInterface = new GraphQLInterfaceType({
  name: 'Character',
  description: 'A character in the Star Wars universe',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString), description: 'id of the character' },
    name: { type: GraphQLString, description: 'The name of the character' },
    friends: { type: new GraphQLList(charaterInterface), description: 'The friends of the character, or empty list', resolve: getFriends },
    appearsIn: { type: new GraphQLList(episodeEnum), description: 'Which movies they appear in' }
  }),
  resolveType: (character) => getHuman(character.id) ? humanType : droidType
})

const humanType = new GraphQLObjectType({
  name: 'Human',
  description: 'A humanoid creature in the Star Wars universe',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString), description: 'id of the human' },
    name: { type: GraphQLString, description: 'The name of the human' },
    friends: { type: new GraphQLList(charaterInterface), description: 'The friends of the human, or empty list', resolve: getFriends },
    appearsIn: { type: new GraphQLList(episodeEnum), description: 'Which movies they appear in' },
    homePlanet: { type: GraphQLString, description: 'The home planet of the human, or null if unknown' }
  }),
  interfaces: [ charaterInterface ]
})

const droidType = new GraphQLObjectType({
  name: 'Droid',
  description: 'A droid creature in the Star Wars universe',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString), description: 'id of the droid' },
    name: { type: GraphQLString, description: 'The name of the droid' },
    friends: { type: new GraphQLList(charaterInterface), description: 'The friends of the droid, or empty list', resolve: getFriends },
    appearsIn: { type: new GraphQLList(episodeEnum), description: 'Which movies they appear in' },
    primaryFunction: { type: GraphQLString, description: 'The primary function of the droid' }
  }),
  interfaces: [ charaterInterface ]
})

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    hero: {
      type: charaterInterface,
      args: {
        episode: { description: 'If omitted, returns the hero of the whole saga', type: episodeEnum }
      },
      resolve: (root, { episode }) => getHero(episode)
    },
    human: {
      type: humanType,
      args: {
        id: { description: 'id of the human', type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (root, { id }) => getHuman(id)
    },
    droid: {
      type: droidType,
      args: {
        id: { description: 'id of the droid', type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (root, { id }) => getDroid(id)
    }
  })
})

export const StarWarsSchema = new GraphQLSchema({
  query: queryType
})
