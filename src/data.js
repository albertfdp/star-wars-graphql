const luke = {
  id: '1000',
  name: 'Luke Skywalker',
  friends: [ '1002', '1003', '2000', '2001' ],
  appearsIn: [ 4, 5, 6 ],
  homePlanet: 'Tatooine'
}

const vader = {
  id: '1001',
  name: 'Darth Vader',
  friends: [ '1004' ],
  appearsIn: [ 4, 5, 6 ],
  homePlanet: 'Tatooine'
}

const han = {
  id: '1002',
  name: 'Han Solo',
  friends: [ '1000', '1003', '2001' ],
  appearsIn: [ 4, 5, 6 ]
}

const leia = {
  id: '1003',
  name: 'Leia Organa',
  friends: [ '1000', '1002', '2000', '2001' ],
  appearsIn: [ 4, 5, 6 ],
  homePlanet: 'Alderaan'
}

const tarkin = {
  id: '1004',
  name: 'Wilhuff Tarkin',
  friends: [ '1001' ],
  appearsIn: [ 4 ]
}

const threepio = {
  id: '2000',
  name: 'C-3PO',
  friends: [ '1000', '1002', '1003', '2001' ],
  appearsIn: [ 4, 5, 6 ],
  primaryFunction: 'Protocol'
}

const artoo = {
  id: '2001',
  name: 'R2-D2',
  friends: [ '1000', '1002', '1003' ],
  appearsIn: [ 4, 5, 6 ],
  primaryFunction: 'Astromech'
}

const humanData = {
  1000: luke,
  1001: vader,
  1002: han,
  1003: leia,
  1004: tarkin
}

const droidData = {
  2000: threepio,
  2001: artoo
}

const getCharacter = (id) => Promise.resolve(humanData[id] || droidData[id])

export const getHero = (episode) => (episode === 5) ? luke : artoo
export const getFriends = (character) => character.friends.map(getCharacter)
export const getHuman = (id) => humanData[id]
export const getDroid = (id) => droidData[id]
