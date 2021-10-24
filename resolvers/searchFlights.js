const { getFlightsFromModel } = require('../models/Flight/Flight');
const { BookableFlight } = require('../models/BookableFlight/BookableFlight');
const DataLoader = require('dataloader');

// checkRequiredArguments returns an object to validate whether the endpoint received
// invalid required arguments. It contains a validation status and an error message.
const checkRequiredArguments = (requiredArguments) => {
  for (const [argName, argValue] of Object.entries(requiredArguments)) {
    if (!argValue) {
      return { 'areValid': false, 'errorMessage': `${argName} is a required argument.` };
    }
    if (typeof argValue !== 'string') {
      return { 'areValid': false, 'errorMessage': `${argName} should be a string.` };
    }
    if (['originCode', 'destinationCode'].includes(argName)) {
      if (argValue.length !== 3 || argValue !== argValue.toUpperCase()) {
        return { 'areValid': false, 'errorMessage': `Invalid query argument for ${argName}: Airport IATA codes should be 3 uppercase characters long.` };
      }
      if (argName === 'destinationCode' && requiredArguments.destinationCode === requiredArguments.originCode) {
        return { 'areValid': false, 'errorMessage': `Invalid query argument for origin and destination airport codes: destination airport should be different than origin airport.` };
      }
    } else if (['departureDate', 'returnDate'].includes(argName)) {
      if (argValue.length !== 10 || argValue.split('-').length !== 3) {
        return { 'areValid': false, 'errorMessage': `Invalid query argument for ${argName}: Travel dates should be 10 characters long formated as YYYY-MM-DD.` };
      }
      if (argName === 'returnDate' && new Date(requiredArguments.returnDate) < new Date(requiredArguments.departureDate)) {
        return { 'areValid': false, 'errorMessage': `Invalid query argument for departure and return dates: return date should be the same or later than departure date.` };
      }
    }
  }
  return { 'areValid': true, 'errorMessage': '', };
}

// matchFlight returns a list of BookableFlight from outbound and inbound flights.
const matchCompatibleFlights = ({ outboundFlights, inboundFlights }) => {
  const bookableFlightsList = [];
  // For each flight, we first check if the traveler can get on the return 
  // flight, in case its departure is close to the arrival time of the first leg.
  console.log(`Query result: ${outboundFlights.length} outbound flights and ${inboundFlights.length} inbound flights.`);
  outboundFlights.forEach((outbound) => {
    inboundFlights.forEach((inbound) => {
      if (BookableFlight.canGetOnReturnFlight(outbound, inbound)) {
        // Then a new BookableFlight object is added to the results list.
        // It contains all the required informations to book the return trip.
        bookableFlightsList.push(new BookableFlight(outbound, inbound));
      }
    });
  });
  return bookableFlightsList;
}

// batchFunction returns a promise which resolves to an Array of values or an Error instance.
const batchFunction = async (keys, callback) => {
  const resultsByKeys = {};
  resultsByKeys[keys] = await callback(keys);
  return keys.map(key => resultsByKeys[key] || new Error(`No result for ${key}`));
}

// getLookupKeys returns concatenated lookup variables into into one string.
const getLookupKeys = keys => keys.join('_');

// flightLoader returns a promise which resolves to an Array of Flights or an Error instance.
// This array is mapped to the lookup keys for one-way flights, each key containing the airports codes, the travel date, pax count.
const flightLoader = new DataLoader(keys => {
  return batchFunction(keys, async (keys) => {
    [originCode, destinationCode, departureDate, passengerCount] = keys[0].split('_');
    return await getFlightsFromModel({ originCode, destinationCode, departureDate, passengerCount });
  });
})

// lookupReturnFlights returns an object containing two lists of Flights.
// One for all the departing Flights, another for all the returning Flights. 
const lookupReturnFlights = async (lookupParams) => {
  const { originCode, destinationCode, departureDate, returnDate, passengerCount } = lookupParams;
  console.log(`Querying: ${originCode} to ${destinationCode}. Departure on ${departureDate} and return on ${returnDate} for ${passengerCount} passengers.`);
  // Calling DataLoader.load() once with a given key fetches and caches data to eliminate redundant loads.
  const outboundFlights = await flightLoader.load(getLookupKeys([originCode, destinationCode, departureDate, passengerCount]));
  const inboundFlights = await flightLoader.load(getLookupKeys([destinationCode, originCode, returnDate, passengerCount]));
  return { outboundFlights, inboundFlights };
}

// getBookableFlights returns either a BookableFlight list of compatible 
// flights by computing compatible flights or an Error to the GraphQL resolver.
const getBookableFlights = async ({ originCode, destinationCode, departureDate, returnDate, passengerCount = 1, first = 4, offset = 0 }) => {
  const requiredArguments = checkRequiredArguments({ originCode, destinationCode, departureDate, returnDate });
  if (!requiredArguments.areValid) {
    console.log('requiredArguments: ', requiredArguments)
    return new Error(requiredArguments.errorMessage);
  } else {
    const bookableFlights = matchCompatibleFlights(await lookupReturnFlights({ originCode, destinationCode, departureDate, returnDate, passengerCount }));
    // Pagination happens here. We only return the first results, with the selected offset.
    if (first < 0) return new Error('first should be a positive number of flights.');
    if (offset < 0) return new Error('offset should be a positive number of paginated flights.');
    return bookableFlights.slice(offset, offset + first);
  }
}

module.exports = {
  checkRequiredArguments,
  matchCompatibleFlights,
  lookupReturnFlights,
  getBookableFlights
};