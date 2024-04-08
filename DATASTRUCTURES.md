user = {
    uid: #,
    displayName: "",
    photoURL: "",
    email: ""
}
testUser = {
    uid: FDg0qeNWvrSTrE54et5r4wCRE1C3,
    displayName: "Tester",
    photoURL: "https://i.imgur.com/cf5lgSl.png",
    email: "test@ghi.com" (pw: testing123)
}

userPreferences = {
    landmarks: bool,
    nature: bool,
    shopping: bool,
    food: bool,
    nightlife: bool,
    relaxation: bool,
    entertainment: bool,
    arts: bool
}

tripData (comes from tripInfo) = {
            cityName: data[0].name,
            state: data[0].state,
            country: countryName,
            country_2letter: data[0].country,
            destinationLat: geocode[0],
            destinationLong: geocode[1],
            geocode: geocode,
            startDate: format(range[0].startDate, "MM/dd/yyyy"),
            endDate: format(range[0].endDate, "MM/dd/yyyy"),
        }

currentTrip = {
    tripID: #,
    tripName: "",
    city: "",
    country: "",
    country_2letter: "",
    startDate: "", MM/DD/YYYY 
    endDate: "", MM/DD/YYYY 
    tripDuration: "",
    geocode: [#, #],
    imgUrl: "",
    places: [ {place}, {place}, ...],
    itinerary: {itinerary}
}
<!-- User flow without profile -->
currentTripDummy = {
    tripID: "",
    tripName: "London Trip",
    city: "London",
    country: "United Kingdom",
    country_2letter: "UK",
    startDate: "08/14/2024",
    endDate: "08/20/2024",
    tripDuration: "7",
    geocode: [51.50735, -0.12776],
    imgUrl: "https://i.imgur.com/A7YyTjp.jpg",
    places: [ 
        {
        id: 1,
        placeName: "Traflagar Square",
        info: "Open 24 hours",
        address: "Trafalgar Sq, London WC2N 5DS, UK",
        imgURL: "https://i.imgur.com/xwY6Bdd.jpg",
        lat: 51.50806,
        long: -0.12806,
        geocode: [51.50806, -0.12806],
        favorite: true,
        place_id: null
      },
      {
        id: 2,
        placeName: "Tate Modern",
        info: "Mon-Sun 10 AM-6 PM",
        address: "Bankside, London SE1 9TG, UK",
        imgURL: "https://i.imgur.com/FYc6OB3.jpg",
        lat: 51.507748,
        long: -0.099469,
        geocode: [51.507748, -0.099469],
        favorite: false,
        place_id: null
      },
      {
        id: 3,
        placeName: "Hyde Park",
        info: "Mon-Sun 5 AM-12 AM",
        address: "Hyde Park, London W2 2UH, UK",
        imgURL: "https://i.imgur.com/tZBnXz4.jpg",
        lat: 51.502777,
        long: -0.151250,
        geocode: [51.502777, -0.151250],
        favorite: false,
        place_id: null
      }
    ],
    itinerary: {},
}


Itinerary = {
    trip_id: #,
    places: { 1: {place}, 2: {place}, ...},
    places_last: #,
    days: { "day-1": {day}, "day-2": {day}, ...}
    day_order: ["day-1", "day-2", ...]
}

day = {
    id: "day-1",
    db_id: #,
    centroid: [#, #],
    date_converted: "Tuesday, January 30",
    date_short: "01/30",
    dayName: "",
    day_short: "Tue",
    placeIds: [#, #, ...]
}

place = {
    id: #, - local (index + 1)
    address: "",
    favorite: bool,
    geocode: [#, #],
    imgURL: "",
    info: "",
    lat: #,
    long: #,
    placeName: "",
    place_id: # - from database
}

