import { MockOTAAdapter } from "./mock-adapter";
import type { OTAChannel, ChannelManagerAdapter } from "../types";

export class AirbnbAdapter extends MockOTAAdapter {
  constructor() {
    super("airbnb", "Airbnb");
  }
}

export class BookingComAdapter extends MockOTAAdapter {
  constructor() {
    super("booking_com", "Booking.com");
  }
}

export class AgodaAdapter extends MockOTAAdapter {
  constructor() {
    super("agoda", "Agoda");
  }
}

export class MakeMyTripAdapter extends MockOTAAdapter {
  constructor() {
    super("makemytrip", "MakeMyTrip (IngoMMT)");
  }
}

export class GoibiboAdapter extends MockOTAAdapter {
  constructor() {
    super("goibibo", "Goibibo");
  }
}

export function getOTAAdapter(channel: OTAChannel): ChannelManagerAdapter {
  switch (channel) {
    case "airbnb":
      return new AirbnbAdapter();
    case "booking_com":
      return new BookingComAdapter();
    case "agoda":
      return new AgodaAdapter();
    case "makemytrip":
      return new MakeMyTripAdapter();
    case "goibibo":
      return new GoibiboAdapter();
    case "mock_sandbox":
    default:
      return new MockOTAAdapter();
  }
}
