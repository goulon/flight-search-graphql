const {
  checkRequiredArguments,
  matchCompatibleFlights,
  lookupReturnFlights,
  getBookableFlights
} = require('./searchFlights');

test('Flight search has every required arguments', () => {
  const mockupArgs = {
    originCode: 'ABC',
    destinationCode: 'XYZ',
    departureDate: '2000-01-01',
    returnDate: '2000-01-10',
  }
  expect(checkRequiredArguments(mockupArgs).areValid).toBe(true);
})

test('Flight search has different airport codes', () => {
  const mockupArgs = {
    originCode: 'ABC',
    destinationCode: 'ABC',
    departureDate: '2000-01-01',
    returnDate: '2000-01-10',
  }
  expect(checkRequiredArguments(mockupArgs).areValid).toBe(false);
})

test('Flight search has incompatible return date', () => {
  const mockupArgs = {
    originCode: 'ABC',
    destinationCode: 'XYZ',
    departureDate: '2000-01-02',
    returnDate: '2000-01-01',
  }
  expect(checkRequiredArguments(mockupArgs).areValid).toBe(false);
})

test('Flight search required arguments are falsy', () => {
  const mockupArgs = {
    originCode: null,
    destinationCode: 0,
    departureDate: false,
    returnDate: undefined,
  }
  expect(checkRequiredArguments(mockupArgs).areValid).toBe(false);
})

test('Flight search arguments have the wrong type', () => {
  const mockupArgs = {
    originCode: 1,
    destinationCode: 2,
    departureDate: 3,
    returnDate: 4,
  }
  expect(checkRequiredArguments(mockupArgs).areValid).toBe(false);
})

test('Flight search arguments are malformed', () => {
  const mockupArgs = {
    originCode: 'ABCD',
    destinationCode: 'WX',
    departureDate: '2000-01',
    returnDate: '2000-01-10T',
  }
  expect(checkRequiredArguments(mockupArgs).areValid).toBe(false);
})

test('Flight search airport codes have invalid case', () => {
  const mockupArgs = {
    originCode: 'abc',
    destinationCode: 'XyZ',
    departureDate: '2000-01-01',
    returnDate: '2000-01-01',
  }
  expect(checkRequiredArguments(mockupArgs).areValid).toBe(false);
})

test('Flight search travel dates arguments have invalid date separators', () => {
  const mockupArgs = {
    originCode: 'ABC',
    destinationCode: 'XYZ',
    departureDate: '2000/01/01',
    returnDate: '2000/01/10',
  }
  expect(checkRequiredArguments(mockupArgs).areValid).toBe(false);
})

test('Bookable flights list gets a list given two flights lists', async () => {
  const bookableFlights = await matchCompatibleFlights({ 'outboundFlights': [], 'inboundFlights': [] })
  expect(Array.isArray(bookableFlights)).toBe(true);
})

test('Return flight lookup receives two flight lists', async () => {
  const mockupArgs = {
    originCode: 'MIA',
    destinationCode: 'LAX',
    departureDate: '2021-01-01',
    returnDate: '2021-01-10',
    passengerCount: 1,
  }
  const flightLists = await lookupReturnFlights(mockupArgs);
  expect(Object.keys(flightLists).length).toEqual(2);
  expect(Array.isArray(flightLists.outboundFlights)).toBe(true);
  expect(Array.isArray(flightLists.inboundFlights)).toBe(true);
})

test('Flight search arguments match a bookable flights list', async () => {
  const mockupArgs = {
    originCode: 'MIA',
    destinationCode: 'LAX',
    departureDate: '2021-01-01',
    returnDate: '2021-01-10',
  }
  const bookableFlights = await getBookableFlights(mockupArgs);
  expect(Array.isArray(bookableFlights)).toBe(true);
})