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

<!-- *msg saying this may take up to a minute on auth loading page  -->
<!-- *put char count limit on subheading day names in itinerary page, limit is 32 chars -->
*busy vs relaxed can change the max # activities in a day (8 vs 5?)
**make mobile responsive
<!-- DONE*show number of items in that day when you collapse itinerary day -->
<!-- *make sticky map + suggestions 100vh in itinerary page -->
<!-- *different api for loading city names? -->
<!-- DONE*loading screen while name trip load -->
*on dashboard, if no city entered and user tries to add trip, code error feedback
<!-- DONE*make more aesthetic scrollbars -->
*if ninja api doesn't find travel destination there needs to be a catch error feedback loop 
*add extra destinations to a trip
*daySelection scrollable
*My Trips, My Interests, My Account
*suggested places > load from places api > filter categories from categories state, make horizontally scrollable
*figure out pseudo-class that causes input fields to change color when dropdown suggestion list of old items pop up
**show route button on each day
*light bulb on the day that the added location is closest to
*add place via itinerary add place btn inside flowbox
*make suggested places a bottom up panel that swipes horizontally on phone/tablet device widths

REMEMBER TO...
Take out unnecessary routes
Remove unnecessary console.logs
login lock certain routes

geoapify api place objects
calendar selection
draggable place objects
Save itinerary button at the bottom of itinerary page
keep star priority of places in itinerary page?
trips recorded on dashboard

APIs 
- api ninjas geocoding API for city names
- unsplash api for city images
*GEOAPIFY - 3000 req/day*
- address autocomplete api for adding places
- place details api to populate place info when adding place



addPlaces page <-- tripID -- Destination, tripName
itinerary page <-- tripID, days(places) 



Xtext input boxes - white text
sign in error
Xsign up error
catch error for emails already in use
Xget w/Kate to sort out auth
>>>>>Kate's db's only allow uids that have already been authenticated