user = {
    uid: #,
    displayName: "",
    photoURL: "",
    email: ""
}

userPreferences = {
    landmarks: bool,
    nature: bool,
    shopping: bool,
    food: bool,
    relaxation: bool,
    entertainment: bool,
    arts: bool
}


currentTrip = {
    tripID: #,
    tripName: "",
    city: "",
    country: "",
    country_2letter: "",
    startDate: "",
    endDate: "",
    tripDuration: "",
    geocode: [#, #],
    imgUrl: "",
    places: [ {place}, {place}, ...],
    itinerary: {itinerary}
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

