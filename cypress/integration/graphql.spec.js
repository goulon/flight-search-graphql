// graphql-query.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

const queryURL = {
  params: `http://localhost:4000/graphql?query=query%20SearchFlights(%24orig%3A%20String!%2C%20%24dest%3A%20String!%2C%20%24dep%3A%20String!%2C%20%24ret%3A%20String!%2C%20%24pax%3A%20Int)%20%7B%0A%20%20flights(first%3A%202%2C%20offset%3A14%2C%20originCode%3A%20%24orig%2C%20destinationCode%3A%20%24dest%2C%20departureDate%3A%20%24dep%2C%20returnDate%3A%20%24ret%2C%20passengerCount%3A%20%24pax)%20%7B%0A%20%20%20%20departureFlight%20%7B%0A%20%20%20%20%20%20departureDate%0A%20%20%20%20%20%20departureTime%0A%20%20%20%20%20%20flightLength%0A%20%20%20%20%7D%0A%20%20%20%20returnFlight%20%7B%0A%20%20%20%20%20%20departureDate%0A%20%20%20%20%20%20departureTime%0A%20%20%20%20%20%20flightLength%0A%20%20%20%20%7D%0A%20%20%20%20totalPrice%0A%20%20%7D%0A%7D&operationName=SearchFlights&variables=%7B%0A%20%20%22orig%22%3A%20%22MIA%22%2C%0A%20%20%22dest%22%3A%20%22LAX%22%2C%0A%20%20%22dep%22%3A%20%222021-10-23%22%2C%0A%20%20%22ret%22%3A%20%222021-10-25%22%2C%0A%20%20%22pax%22%3A%2010%0A%7D`
}

describe('GraphQL empty query Test', function () {
  it('Enters an empty query', function () {
    cy.visit('http://localhost:4000/graphql')

    cy.get('.execute-button').click()
  })
})

describe('GraphQL FlightSearch query Test', function () {
  it('Enters a formed query', function () {
    cy.visit(queryURL.params)

    cy.get('.execute-button').click()
  })
})

// context('GraphQL FlightSearch query Test', () => {
//   it('cy.request() with query parameters', () => {

//     const queryObject = {
//       query: `query SearchFlights($orig: String!, $dest: String!, $dep: String!, $ret: String!, $pax: Int) { flights(first: 2, offset:14, originCode: $orig, destinationCode: $dest, departureDate: $dep, returnDate: $ret, passengerCount: $pax) { departureFlight { departureDate departureTime flightLength } returnFlight { departureDate departureTime flightLength } totalPrice } }`,
//       operationName: 'SearchFlights',
//       variables: {
//         "orig": "MIA",
//         "dest": "LAX",
//         "dep": (new Date()).toISOString().slice(0, 10),
//         "ret": (new Date()).toISOString().slice(0, 10),
//         "pax": 10
//       }
//     };


//     cy.request({
//       url: 'http://localhost:4000/graphql',
//       qs: queryObject,
//     .its('response.body.data.flights')
//         .should((flights) => {
//           expect(flights.length).to.be.gte(0)
//         })
//     });