# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

BackEnd (Kate) checkpoints
- (send) User registration components > auth > AuthLoadingScreen.jsx {uid, displayName, email}
- (send) User interests views > Survey.jsx {uid, categories: {interest: boolean} }
- (send/return) User trip creation views > NameTripModal.jsx {uid, destinationCity, destinationState, destinationGeocode, tripName, startDate, endDate}. RETURN tripID
- (send) Destination add places views > addPlaces.jsx 

*msg saying this may take up to a minute on auth loading page 
*put char count limit on subheading day names in itinerary page
*busy vs relaxed can change the max # activities in a day (8 vs 5?)
*make mobile responsive
*show number of items in that day when you collapse itinerary day
*make sticky map + suggestions 100vh in itinerary page
*different api for loading city names?
*loading screen while city options load

geoapify api place objects
calendar selection
draggable place objects
Save itinerary button at the bottom of itinerary page
keep star priority of places in itinerary page?
trips recorded on dashboard

APIs 
- geoapify geocoding API for city names
- unsplash api for city images



addPlaces page <-- tripID -- Destination, tripName
itinerary page <-- tripID, days(places) 
