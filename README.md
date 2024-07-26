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
<!-- *on dashboard, if no city entered and user tries to add trip, code error feedback -->
<!-- DONE*make more aesthetic scrollbars -->
*if ninja api doesn't find travel destination there needs to be a catch error feedback loop 
*add extra destinations to a trip
<!-- *suggested places > load from places api > filter categories from categories state, make horizontally scrollable -->
<!-- *figure out pseudo-class that causes input fields to change color when dropdown suggestion list of old items pop up - img on phone -->
**show route button on each day
<!-- *light bulb on the day that the added location is closest to -->
<!-- *add place via itinerary add place btn inside flowbox -->
<!-- *make suggested places a bottom up panel that swipes horizontally on phone/tablet device widths -->
<!-- *click out of suggested places info -->
*google auth users issue with creating a trip?
*suggested places panel not coming all the way up on phone device? (Kathleen's apple phone)

**08Jan24 meeting**
*google sign in create trip issue?
<!-- *Finish toolTip  -->
<!-- *SAVE FEATURE - save trip, auto-save, edit trip, remove trip, trips on dashboard w/ pop-up -->
<!-- *how much is google api? how long is it free for? -->
*STAR FEATURE - ....

**11Jan24 meeting**
Google gives 6k requests per month for free?
Google maps API - $200 worth of rq per month - 28,500 maploads
<!-- Save trips -->
<!-- Load saved trips -->
<!-- Fix generate itinerary bug that Cheryl found -->
<!-- Figma stickies from Jenny -->
get my trips to be responsive

**18Jan24 meeting**
Will create a modal check that says this place is a duplicate, are you sure you want to add? when adding duplicate places
<!-- Have places updated as well when itinerary is added to or if places are removed -->
<!-- Max 4 places per day -->
<!-- Will create a space/folders for places that didn't make it into the itinerary -->
<!-- *trips on dashboard spacing is weird, give it gap instead of space-between* -->
<!-- loading circle while my trips are loading -->
*Removed from places fade out
<!-- *'# places' on flow box unless screen width is skinny* -->
<!-- Show if place already added on itinerary map place card -->
<!-- make sidebar sticky -->
<!-- sidebar only shows in itinerary page -->
edit trip info in add places page - bring up date range picker and update the date range (update date range of trip_id route needed)
<!-- fade overlay z-index not on top -->
*update highlight day code - days w many places will never be fully in window
<!-- send kate updated trip duration from add places on generate itinerary -->
<!-- update start : end date on dashboard -->

**22Jan24 meeting**
Making a social space for users to create itinerary

**25Jan24 meeting**
Drag n drop a place from itinerary into saved places?
Drag n drop a place from saved places into itinerary and modal pops up 
Place Card pop up - view on map, add to itinerary, 

**12Feb24 meeting**
Landing page - more colors, more entry points, about me with team members, more stuff on the page
inspiration
thatch.co 
elude.co

**12Feb24 meeting**
Itinerary, add places only with the sidebar nav
new always available top navbar
titles smaller
<!-- zeplin product to transfer figma design into code -->
itinerary map needs to stay in view
add places page all in view height
updated add place to day card and lightbulb icon
updated datebox design on figma
CHANGE add userpreferences list of preferences to object so you can map it!

userTrips saves to central user object for quick load after first load?

**09May24 meeting**
Certain trip destinations not generating new suggested places - Japan
<!-- Intermediate step in suggested places loading before switching to new destination's suggested places -->
apikey = 
country jp
lat = 35.6828387
long = 139.7594549
<!-- when go Back from user preferences go back to itinerary tab --> 

Questions?
Will saved places have an 'in itinerary' indication?


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
- *unsplash api for city images 50req/hr*
*GEOAPIFY - 3000 req/day*
- address autocomplete api for adding places
- place details api to populate place info when adding place
- map tiles - client.stadiamaps.com (200,000 credits per month, current avg. use is 50 - 500 per day, maybe 4000 a month)\
- Mapbox api. Mapbox GL JS, used react-map-gl >> 50k free map loads/month
- Mapbox api. Geocoding API (place search) >> 100k free requests/month

After adding npm google maps package @vis.gl/react-google-mapshttps://www.freeconvert.com/video-compressor/
There are now - 13 vulnerabilities (10 low, 2 moderate, 1 high)
Same # of vulnerabilities after uninstall

addPlaces page <-- tripID -- Destination, tripName
itinerary page <-- tripID, days(places) 


TO DO LIST

<!-- User management -->
catch error for emails already in use
>>>>>Kate's db's only allow uids that have already been authenticated
**Pass code (Kate)

<!-- Landing Page -->
<!-- RESPONSIVE -->

<!-- Dashboard -->
<!-- RESPONSIVE -->
?Welcome back {name}?
?Next trip is in __ days?
?Trip stats: # of trips completed, # of places been to etc.?
<!-- ***hover over trip in personal dashboard enlarges img -->
UPDATE TRIP NAME SHOWING ERROR EVEN THOUGH ITS UPDATING IN DATABASE? - works on my browser
Trip name on trip card in dashboard ellipsis and scrollable
***trips in order of activity OR most upcoming trips, then past trips


<!-- AddPlaces Page -->
<!-- RESPONSIVE --> >> userPrefs navigation tabs and tripinfo dates in 320 frame width?
Edit trip dates 
?Put trip name at the top of the page?
Add from suggested list anim for categorical suggested places
favorite a place tool tip needs to chill
map loads funny sometimes when in mobile mode (mobileMode not kicking in on tripInfo dates, and map sometimes ??)
"..."s on suggested places 
<!-- Clear list - are you sure? modal -->

<!-- Itinerary Page -->
RESPONSIVE
<!-- *update add place from PTC animation  -->
*catch saved places from the back-end
*update code: centroids need to update each time itinerary places changes ? currently updates everytime PTC added
*re-do day scroll to flowboxes observer code
***scroll days in tripinfo horizontally (make dates)
<!-- re-center map on click of itinerary place -->
<!-- CANNOT DRAG N DROP PLACES IN NEW DAYS - NOT UPDATING -->
<!-- ***l'musee locations working??? (Waiting for meetup w/ Kate) -->
<!-- ***"no category" on itinerary place cards - categories weren't saved, only place info, new places added should have categories now -->
<!-- center routewise bird on navbar -->
stop from adding suggested places that are already saved to saved places

<!-- Survey & Survey Update page page -->
<!-- RESPONSIVE -->

<!-- Phone responsive -->
Name tripmodal and loading screen and specify city (not working on dashboard?)

<!-- Print Itinerary page -->
<!-- toggle pics on/off mode -->

<!-- Optimization -->
Create state that controls suggestedplaces code running - update state in survey page, keep current.geocode dep
nametripmodal make loadcityimg function come from context api

<!-- With Kate -->
<!-- **generate itinerary object has place['local_id']s instead of place['id']s (Kate) -->
<!-- **saved places need to be returned in itinerary object when viewing already made trip (Kate)..  -->
<!-- ***l'musee locations working??? (Waiting for meetup w/ Kate) -->
<!-- Adjust FE code to receive saved_places as list of placeIds! -->
<!-- **Pass code code -->
Build test environment page for Kate's functions?
add saved_place route
CHANGING TRIP DETAILS FROM MYTRIPS PAGE UPDATES ITINERARY? (new itinerary modal pops up)
New pop up functionalities: itineraryToSaved and savedToItinerary (using update-place route), addToSaved (using add-one-place)
>update itinerary/update-place function:
day_id, in_itinerary
if data['in_itinerary']:
    place.in_itinerary = True
else:
    place.in_itinerary = False
>update itinerary/add-one-place
if data['day_id]:
    day_id = data['day_id]
    in_itinerary = True
else:
    day_id = None (or other value that corresponds to null in database?)
    in_itinerary = False



Laterbase
have mile distance from hotel/destination center to the place in auto complete address list
Create components for savedplaces card, suggestplaces card
bookmark icon on suggested place options filled in if place is already in saved places



03Jun24 Team Meeting
<!-- ***l'musee locations working??? (Waiting for meetup w/ Kate) (e.g. Palais-Royal [Art museums??]) -->
<!-- ***trips in order of activity OR most upcoming trips, then past trips -->
<!-- ***delete trip on mytrips and dashboard? -->
<!-- ***print itinerary navigation causes error "placeName" key? -->


Updates
<!-- place card options on suggested places and saved places -->
<!-- toggle on/off saved place on map place card -->
in itinerary check function - check if a place is in itinerary
update notification icon showing how many changes have been made to your itinerary or saved places in sidebar
exlamation icon to show new suggested places? - clears when you navigate to the page
travel prefs resetting to null while in itinerary??
itinerary place card options - view on map, move to saved places, remove place
($test$) code in itinerary page
make trips on dashboard a carousel of 10 - no flx wrap (btn sliders bottom right, light purple bg rounded squares)
update selected travel preference card to have purplish text


10th June Meeting
stations not working?
locations that would require hold day


<!-- 13Jun24 Team Meeting -->
Need to transfer to new database
Big takeaway! - more info about the places (biz hours, ratings?)
Users want to
type in category to search places
explore places on the map, type regions to explore areas
ppl want to start with suggested places before adding their own places

Upgrade to Google Maps API!!! - reviews/biz hours/places/place imgs/map? costs??
mapbox map w/ google places?
<!-- Google API $200 for free -->
Maps Embed API = free
Geocoding API ~8k requests = $40?.. 30k requests = $150
Places API (address, name, geometry, price level [0 to 4], rating [1.0 - 5.0]) ~10k = $85
+ Review (Place Review API)?
+ Photo (Place Photo API) ~5k-10k = $35-$70

Bronco Venture Accelerator (BVA)
7:30pm

<!-- 17Jun24 Team Meeting -->
Best time to visit location
landing page - include demo of product
different day places have unique markers
re-word lightbulb days for less confusion
non-users should be able to access/see user itineraries
<!-- user should remain logged in after page refresh -->

report weekly hours (part-time or full-time?)

<!-- 24Jun24 Team Meeting -->
Demo on landing page
Changing photos in sign up box?
Popular places shown upfront before adding their own places
more info about each place

100 shares when incorporated 40% of shares are split between the team
CEO should get more shares

<!-- 27Jun24 Team Meeting -->
print itinerary page doesn't have most updated itinerary from itinerary page
more information about the places/better suggestion places
Make the rules of the itinerary generator clear to the user
Wanting to search the map by categories/terms i.e. pizza restaurant (pickup keywords?)
Suggested places not on on the add places page?
Have "added to itinerary" display for places already in the itinerary
edit dates on add places page
re-word hover text on lightbulb days
added to itinerary animation completes too quickly
confirmation for adding saved places to itinerary
Dashboard map get rid?
update travel preferences design consistent with see all trips
edit details -> change to edit date/name



<!-- 01Jul24 Team Meeting -->
Drop down when choosing city to travel to
Integrate API

<!-- 15Jul24 Team Meeting -->
<!-- Jenny updated added places/suggested places/top sites design -->
<!-- Jenny will update the place card design -->

<!-- 18Jul24 Team Meeting -->
Does Google API have place descriptions? 
<!-- Update place card design -->

<!-- daycolor map btn? -->
get day hours
linked in post
update trip name
place website links

<!-- 22Jul24 -->
<!-- New more compact way to display opening hours? ..generate an example -->
Way to display all of place information? Perhaps a popup modal
- name, category, rating, opening hours, description?, address, pricing??, website??, typical time spent??
Am I good to BIP with images from our website? Is anything off limits? - Yes
*Marker press on itinerary page scrolls to the place in the itinerary 
<!-- *Changed boundary search icon  -->
<!-- *update location icon for dropdown places -->
Rounded btns might be the way to go?

Reach out to ppl working at a prospective company and try to get referrals

<!-- 25Jul24 Team Meeting -->
check for expected duration at place