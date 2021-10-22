const { buildSchema } = require('graphql');
const { getBookableFlights } = require('../resolvers/searchFlights');

var schema = buildSchema(`
  type Flight {
    departureDate: String
    departureTime: String
    flightLength: String
  }

  type MatchedFlights {
    departureFlight: Flight
    returnFlight: Flight
    totalPrice: Int
    availableSeats: Int
  }
  
  type Query {
    flights(
      first: Int,
      offset: Int,
      originCode: String!,
      destinationCode: String!,
      departureDate: String!,
      returnDate: String!,
      passengerCount: Int,
    ): [MatchedFlights]
  }
`);

var root = {
  flights: (args) => {
    return getBookableFlights(args);
  }
}

module.exports = {
  schema: schema,
  rootValue: root,
};