const { Flight } = require('../models/Flight/Flight');

const airports = ['JFK', 'LAX', 'ORD', 'SEA', 'MIA', 'ATL'];
const airlines = ['AA', 'DL', 'UA', 'WN', 'B6'];

// addDays helps adding time to JS Date objects.
Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

// getRandInt returns a random integer between the bounds.
const getRandInt = (maxInt, minInt = 0) => {
  return Math.floor(Math.random() * (maxInt - minInt) + minInt);
}

// Writes a new Flight object to the database.
const createRandomFlight = async () => {
  const originIndex = getRandInt(airports.length);
  const airportsLeft = airports.slice(0, originIndex).concat(
    airports.slice(originIndex + 1)
  );
  const destinationIndex = getRandInt(airportsLeft.length);

  let dateToday = new Date();
  let dateInSevenDays = dateToday.addDays(10);
  const departureDate = new Date(getRandInt(dateInSevenDays.getTime(), dateToday.getTime()));

  const totalCapacity = getRandInt(280, 150);

  const newFlight = await Flight.create({
    'originCode': airports[originIndex],
    'destinationCode': airportsLeft[destinationIndex],
    'departureDatetime': departureDate,
    'operatedBy': airlines[getRandInt(airlines.length)],
    'durationInMin': getRandInt(720, 120),
    'basePriceUSD': getRandInt(550, 450),
    'totalCapacity': totalCapacity,
    'availableSeats': getRandInt(totalCapacity, 1),
  });
}

// Syncs the Flight model by creating its table and index
// and then inserts rows by calling createRandomFlight.
const seedDatabase = async () => {
  console.log("Creating flights table");
  console.log("Creating flights index");
  Flight.sync().then(() => {
    console.log("Populating the flights table");
    for (let i = 0; i < 2000; i++) {
      createRandomFlight();
    }
  });
}

seedDatabase();