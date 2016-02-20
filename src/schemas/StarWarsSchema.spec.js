import expect from 'unexpected'
import { StarWarsSchema } from './StarWarsSchema'
import { graphql } from 'graphql'

describe('StarWarsSchema', () => {
  describe('Basic Queries', () => {
    it('correctly identifies R2-D2 as the hero of the Star Wars saga', () => {
      const query = `
        query HeroNameQuery {
          hero {
            name
          }
        }
      `

      return graphql(StarWarsSchema, query).then((result) => {
        expect(result, 'to satisfy', {
          data: {
            hero: { name: 'R2-D2' }
          }
        })
      })
    })

    it('allows to query for the id and friends of R2-D2', () => {
      const query = `
        query HeroNameAndFriendsQuery {
          hero {
            id
            name
            friends {
              name
            }
          }
        }
      `
      return graphql(StarWarsSchema, query).then((result) => {
        expect(result, 'to satisfy', {
          data: {
            hero: {
              id: '2001',
              name: 'R2-D2',
              friends: [
                { name: 'Luke Skywalker' },
                { name: 'Han Solo' },
                { name: 'Leia Organa' }
              ]
            }
          }
        })
      })
    })
  })

  describe('Nested Queries', () => {
    it('allows to query for the friends of friends of R2-D2', () => {
      const query = `
        query NestedQuery {
          hero {
            name
            friends {
              name
              appearsIn
              friends {
                name
              }
            }
          }
        }
      `
      return graphql(StarWarsSchema, query).then((result) => {
        expect(result, 'to satisfy', {
          data: {
            hero: {
              name: 'R2-D2',
              friends: [
                {
                  name: 'Luke Skywalker',
                  appearsIn: ['NEWHOPE', 'EMPIRE', 'JEDI'],
                  friends: [
                    { name: 'Han Solo' },
                    { name: 'Leia Organa' },
                    { name: 'C-3PO' },
                    { name: 'R2-D2' }
                  ]
                },
                {
                  name: 'Han Solo',
                  appearsIn: ['NEWHOPE', 'EMPIRE', 'JEDI'],
                  friends: [
                    { name: 'Luke Skywalker' },
                    { name: 'Leia Organa' },
                    { name: 'R2-D2' }
                  ]
                },
                {
                  name: 'Leia Organa',
                  appearsIn: ['NEWHOPE', 'EMPIRE', 'JEDI'],
                  friends: [
                    { name: 'Luke Skywalker' },
                    { name: 'Han Solo' },
                    { name: 'C-3PO' },
                    { name: 'R2-D2' }
                  ]
                }

              ]
            }
          }
        })
      })
    })

    it('should allow to use IDs and query params to refetch objects', () => {
      const query = `
        query FetchLukeQuery {
          human(id: "1000") {
            name
          }
        }
      `
      return graphql(StarWarsSchema, query).then((result) => {
        expect(result, 'to satisfy', {
          data: {
            human: {
              name: 'Luke Skywalker'
            }
          }
        })
      })
    })

    it('should allow to create a generic query and use it to fetch Han Solo using his ID', () => {
      const query = `
        query FetchSomeIDQuery($someId: String!) {
          human(id: $someId) {
            name
          }
        }
      `
      const params = { someId: 1002 }
      return graphql(StarWarsSchema, query, null, params).then((result) => {
        expect(result, 'to satisfy', {
          data: {
            human: {
              name: 'Han Solo'
            }
          }
        })
      })
    })

    it('should allow to create a generic query and pass an invalid ID to get null back', () => {
      const query = `
        query FetchSomeIDQuery($someId: String!) {
          human(id: $someId) {
            name
          }
        }
      `
      const params = { someId: 'lol' }
      return graphql(StarWarsSchema, query, null, params).then((result) => {
        expect(result, 'to satisfy', {
          data: {
            human: null
          }
        })
      })
    })
  })

  describe('Aliased Queries', () => {
    it('should allow to query for Luke, changing his key with an alias', () => {
      const query = `
        query FetchLukeAliased {
          luke: human(id: "1000") {
            name
          }
        }
      `
      return graphql(StarWarsSchema, query).then((result) => {
        expect(result, 'to satisfy', {
          data: {
            luke: {
              name: 'Luke Skywalker'
            }
          }
        })
      })
    })

    it('should allow to use a fragment to avoid duplicated content', () => {
      const query = `
        query UseFragment {
          luke: human(id: "1000") {
            ...HumanFragment
          }
          leia: human(id: "1003") {
            ...HumanFragment
          }
        }

        fragment HumanFragment on Human {
          name
          homePlanet
        }
      `

      return graphql(StarWarsSchema, query).then((result) => {
        expect(result, 'to satisfy', {
          data: {
            luke: { name: 'Luke Skywalker', homePlanet: 'Tatooine' },
            leia: { name: 'Leia Organa', homePlanet: 'Alderaan' }
          }
        })
      })
    })

    it('should allow to use __typename to find the type of an object', () => {
      const query = `
      query CheckTypeOfR2D2 {
        hero {
          __typename
          name
        }
      }
      `

      return graphql(StarWarsSchema, query).then((result) => {
        expect(result, 'to satisfy', {
          data: {
            hero: {
              __typename: 'Droid',
              name: 'R2-D2'
            }
          }
        })
      })
    })

    it('should allow to verify that Luke is a human', () => {
      const query = `
        query CheckTypeOfLuke {
          hero(episode: EMPIRE) {
            __typename
            name
          }
        }
      `

      return graphql(StarWarsSchema, query).then((result) => {
        expect(result, 'to satisfy', {
          data: {
            hero: {
              __typename: 'Human',
              name: 'Luke Skywalker'
            }
          }
        })
      })
    })
  })
})
