const { readFlightTransferObject } = require('../Flight/Flight');

// addMinutes helps adding time to JS Date objects.
Date.prototype.addMinutes = function (minutes) {
  let date = new Date(this.valueOf());
  date.setMinutes(date.getMinutes() + minutes);
  return date;
}

// BookableFlight represents a bookable return flight ticket.
// Its departureFlight and returnFlight contain Flight DTOs.
// totalPrice and availableSeats are computed from those Flights.
class BookableFlight {
  constructor(departureFlight, returnFlight) {
    this.departureFlight = readFlightTransferObject(departureFlight);
    this.returnFlight = readFlightTransferObject(returnFlight);
    this.totalPrice = departureFlight.basePriceUSD + returnFlight.basePriceUSD;
    this.availableSeats = Math.min(departureFlight.availableSeats, returnFlight.availableSeats);
  }

  // canGetOnReturnFlight returns true if and only if a traveler can take its return flight.
  static canGetOnReturnFlight(outbound, inbound) {
    // Compares traveler arrival time and check-in time to fly back right away.
    const arrivesAt = outbound.departureDatetime.addMinutes(outbound.durationInMin);
    const checkInDelayInMin = -120;
    const checksInAt = inbound.departureDatetime.addMinutes(checkInDelayInMin);
    return arrivesAt <= checksInAt;
  }
}

module.exports = { BookableFlight };