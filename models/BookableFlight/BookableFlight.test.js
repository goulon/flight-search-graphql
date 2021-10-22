const { BookableFlight } = require('./BookableFlight');

test('BookableFlight instance has four keys', () => {
  const mockupFlightA = {
    'departureDatetime': new Date(),
    'durationInMin': 60,
    'basePriceUSD': 100,
    'availableSeats': 4
  };
  const mockupFlightB = {
    'departureDatetime': new Date(),
    'durationInMin': 100,
    'basePriceUSD': 150,
    'availableSeats': 5
  };
  const bookableFlights = new BookableFlight(mockupFlightA, mockupFlightB);
  expect(Object.keys(bookableFlights).length).toEqual(4);
})

test('BookableFlight instance keys have valid value types', () => {
  const mockupFlightA = {
    'departureDatetime': new Date(),
    'durationInMin': 60,
    'basePriceUSD': 100,
    'availableSeats': 4
  };
  const mockupFlightB = {
    'departureDatetime': new Date(),
    'durationInMin': 100,
    'basePriceUSD': 150,
    'availableSeats': 5
  };
  const bookableFlights = new BookableFlight(mockupFlightA, mockupFlightB);
  expect(typeof bookableFlights.departureFlight).toBe('object');
  expect(typeof bookableFlights.returnFlight).toEqual('object');
  expect(typeof bookableFlights.totalPrice).toBe('number');
  expect(typeof bookableFlights.availableSeats).toBe('number');
})

test('BookableFlight instance has valid flight DTOs', () => {
  const mockupFlightA = {
    'departureDatetime': new Date(),
    'durationInMin': 60,
    'basePriceUSD': 100,
    'availableSeats': 4
  };
  const mockupFlightB = {
    'departureDatetime': new Date(),
    'durationInMin': 100,
    'basePriceUSD': 150,
    'availableSeats': 5
  };
  const bookableFlights = new BookableFlight(mockupFlightA, mockupFlightB);
  expect(Object.keys(bookableFlights.departureFlight).length).toEqual(3);
  expect(Object.keys(bookableFlights.returnFlight).length).toEqual(3);
})

test('BookableFlight instance has valid price and available seats', () => {
  const mockupFlightA = {
    'departureDatetime': new Date(),
    'durationInMin': 60,
    'basePriceUSD': 100,
    'availableSeats': 4
  };
  const mockupFlightB = {
    'departureDatetime': new Date(),
    'durationInMin': 100,
    'basePriceUSD': 150,
    'availableSeats': 5
  };
  const bookableFlights = new BookableFlight(mockupFlightA, mockupFlightB);
  expect(bookableFlights.totalPrice).toEqual(250);
  expect(bookableFlights.availableSeats).toEqual(4);
})

test('Return ticket\'s departure time is compatible  with departure ticket', () => {
  const mockupOutboundFlight = { 'departureDatetime': new Date('2021-01-01T12:00:00Z'), 'durationInMin': 60 }
  const mockupInboundFlight = { 'departureDatetime': new Date('2021-01-01T15:00:00Z'), 'durationInMin': 10 }
  expect(BookableFlight.canGetOnReturnFlight(mockupOutboundFlight, mockupInboundFlight)).toBe(true);
})

test('Return ticket\'s departure time is incompatible  with departure ticket', () => {
  const mockupOutboundFlight = { 'departureDatetime': new Date('2021-01-01T12:00:00Z'), 'durationInMin': 60 }
  const mockupInboundFlight = { 'departureDatetime': new Date('2021-01-01T14:59:59Z'), 'durationInMin': 10 }
  expect(BookableFlight.canGetOnReturnFlight(mockupOutboundFlight, mockupInboundFlight)).toBe(false);
})