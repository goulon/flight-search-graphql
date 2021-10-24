const { Sequelize, DataTypes, Model, Op } = require('sequelize');
const path = require('path');
const dbPath = path.resolve('data', 'FlightSearch.db');
const sequelize = new Sequelize(`sqlite:${dbPath}`, { logging: false, });

// This Flight model represents a flight mapping for the database.
// Flight informations are extracted into a data transfer object,
// and used to instantiate a BookableFlight ticket.
class Flight extends Model { };

Flight.init({
  originCode: { type: DataTypes.STRING, allowNull: false },
  destinationCode: { type: DataTypes.STRING, allowNull: false },
  departureDatetime: { type: DataTypes.DATE, allowNull: false },
  durationInMin: { type: DataTypes.INTEGER, allowNull: false },
  operatedBy: { type: DataTypes.STRING, allowNull: false },
  basePriceUSD: { type: DataTypes.INTEGER, allowNull: false },
  totalCapacity: { type: DataTypes.INTEGER, allowNull: false },
  availableSeats: { type: DataTypes.INTEGER, allowNull: false },
}, {
  sequelize,
  timestamps: true,
  modelName: 'Flight',
  tableName: 'flights',
  indexes: [
    {
      name: 'flights_by_airport_code_index',
      using: 'BTREE',
      fields: ['originCode']
    }
  ]
});

// readFlightTransferObject returns a DTO to be passed to a MatchedFlights object.
const readFlightTransferObject = (flight) => {
  const getDurationInHours = () => {
    const h = `${Math.floor(flight.durationInMin / 60)}h`;
    const m = `${flight.durationInMin % 60}m`;
    return `${h}${m}`;
  }

  return {
    'departureDate': flight.departureDatetime.toDateString(),
    'departureTime': flight.departureDatetime.toTimeString(),
    'flightLength': getDurationInHours(),
  }
}

// addDays helps adding time to JS Date objects.
Date.prototype.addDays = function (days) {
  let date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

// getFlightBookableTimes returns an object with earliest and latest bookable times.
const getFlightBookableTimes = (departureDate) => {
  // currentTime is compared with the selected departure date. If the departure 
  // date is today, only flights with the earliest departure times are looked up.
  // The latest bookable time should be before 12:00AM the next day.
  const currentTime = new Date();
  return {
    'latestTime': departureDate.addDays(1),
    'earliestTime': new Date(Math.max(departureDate, currentTime))
  }
}

// getFlightsFromModel returns a promised Flight list from querying the model.
const getFlightsFromModel = async (queryParams) => {
  const { originCode, destinationCode, departureDate, passengerCount } = queryParams;
  console.log({ originCode, destinationCode, departureDate, passengerCount })
  const { latestTime, earliestTime } = getFlightBookableTimes(new Date(departureDate));
  const flightList = await Flight.findAll({
    attributes: [
      'originCode', 'destinationCode', 'departureDatetime',
      'durationInMin', 'basePriceUSD', 'availableSeats'
    ],
    where: {
      [Op.and]: [
        { originCode: originCode },
        { destinationCode: destinationCode },
        {
          departureDatetime: {
            [Op.gte]: earliestTime,
            [Op.lt]: latestTime,
          }
        },
        {
          availableSeats: {
            [Op.gte]: passengerCount,
          }
        },
      ]
    },
  });
  return flightList;
}

module.exports = {
  Flight,
  readFlightTransferObject,
  getFlightBookableTimes,
  getFlightsFromModel,
};