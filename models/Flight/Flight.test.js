const { getFlightBookableTimes, readFlightTransferObject, getFlightsFromModel } = require('./Flight');

test('Flight times has bookable time window has two attributes', () => {
  const departureDate = new Date();
  const flightBookableTimes = getFlightBookableTimes(departureDate);
  expect(Object.keys(flightBookableTimes).length).toEqual(2);
})

test('Flight times has earliest and latest times of type Date', () => {
  const departureDate = new Date();
  const { latestTime, earliestTime } = getFlightBookableTimes(departureDate);
  expect(latestTime instanceof Date).toBe(true);
  expect(earliestTime instanceof Date).toBe(true);
})

test('Flight Transfer Object has only three attributes', () => {
  const mockupFlight = {
    'departureDatetime': new Date(),
    'durationInMin': 60,
  };
  const flightTransferObject = readFlightTransferObject(mockupFlight);
  expect(Object.keys(flightTransferObject).length).toEqual(3);
})

test('Flight Transfer Object has flight date, time and length', () => {
  const mockupFlight = {
    'departureDatetime': new Date(),
    'durationInMin': 60,
  };
  const flightTransferObject = readFlightTransferObject(mockupFlight);
  expect(typeof flightTransferObject.departureDate).toEqual('string');
  expect(typeof flightTransferObject.departureTime).toEqual('string');
  expect(typeof flightTransferObject.flightLength).toEqual('string');
})

test('Flight model reads a list of Flights', async () => {
  const lookupArgs = {
    originCode: 'ABC',
    destinationCode: 'XYZ',
    departureDate: '2030-01-01',
    passengerCount: 1,
  }
  let flightList = await getFlightsFromModel(lookupArgs);
  expect(Array.isArray(flightList)).toBe(true);
  expect(flightList.length).toEqual(0);
})