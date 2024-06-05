import React, { useContext, useEffect, useRef, useState } from 'react'
import { DataContext } from '../Context/DataProvider';
import { Link } from 'react-router-dom';

const PrintItineraryPage = () => {
  const { repeatItems, timeFunctions, currentTrip } = useContext(DataContext);
  const tripTestData = {
    tripID: "",
    places_last: 8,
    places: {
      1: {
        id: 1,
        placeName: "Trafalgar Square",
        info: "Open 24 hours",
        address: "Trafalgar Sq, London WC2N 5DS, UK",
        category: "tourist area",
        imgURL: "https://i.imgur.com/xwY6Bdd.jpg",
        lat: 51.50806,
        long: -0.12806,
        geocode: [51.50806, -0.12806],
        favorite: true,
        place_id: null
      },
      2: {
        id: 2,
        placeName: "Tate Modern",
        info: "Mon-Sun 10 AM-6 PM",
        address: "Bankside, London SE1 9TG, UK",
        category: "art & entertainment",
        imgURL: "https://i.imgur.com/FYc6OB3.jpg",
        lat: 51.507748,
        long: -0.099469,
        geocode: [51.507748, -0.099469],
        favorite: false,
        place_id: null
      },
      3: {
        id: 3,
        placeName: "Hyde Park",
        info: "Mon-Sun 5 AM-12 AM",
        address: "Hyde Park, London W2 2UH, UK",
        category: "nature",
        imgURL: "https://i.imgur.com/tZBnXz4.jpg",
        lat: 51.502777,
        long: -0.151250,
        geocode: [51.502777, -0.151250],
        favorite: false,
        place_id: null
      },
      4: {
        id: 4,
        placeName: "Buckingham Palace",
        info: "Tours Start at 9am",
        address: "Buckingham Palace, London SW1A 1AA, UK",
        category: "landmarks",
        imgURL: "https://i.imgur.com/lw40mp9.jpg",
        lat: 51.501476,
        long: -0.140634,
        geocode: [51.501476, -0.140634],
        favorite: true,
        place_id: null
      },
      5: {
        id: 5,
        placeName: "Borough Market",
        info: "Closed Mondays, Tues-Sun 10 AM-5 PM",
        address: "Borough Market, London SE1 9AL, UK",
        category: "tourist area",
        imgURL: "https://i.imgur.com/9KiBKqI.jpg",
        lat: 51.50544,
        long: -0.091249,
        geocode: [51.50544, -0.091249],
        favorite: true,
        place_id: null
      },
      6: {
        id: 6,
        placeName: "Trafalgar Square",
        info: "Open 24 hours",
        address: "Trafalgar Sq, London WC2N 5DS, UK",
        category: "tourist area",
        imgURL: "https://i.imgur.com/xwY6Bdd.jpg",
        lat: 51.50806,
        long: -0.12806,
        geocode: [51.50806, -0.12806],
        favorite: false,
        place_id: null
      },
      7: {
        id: 7,
        placeName: "Borough Market",
        info: "Closed Mondays, Tues-Sun 10 AM-5 PM",
        address: "Borough Market, London SE1 9AL, UK",
        category: "tourist area",
        imgURL: "https://i.imgur.com/9KiBKqI.jpg",
        lat: 51.50544,
        long: -0.091249,
        geocode: [51.50544, -0.091249],
        favorite: false,
        place_id: null
      },
      8: {
        id: 8,
        placeName: "Trafalgar Square",
        info: "Open 24 hours",
        address: "Trafalgar Sq, London WC2N 5DS, UK",
        category: "tourist area",
        imgURL: "https://i.imgur.com/xwY6Bdd.jpg",
        lat: 51.50806,
        long: -0.12806,
        geocode: [51.50806, -0.12806],
        favorite: false,
        place_id: null
      }
    },
    days: {
      "day-1": {
        id: "day-1",
        date_converted: "Wednesday, November 8",
        day_short: "Wed",
        date_short: "11/8",
        dayName: "Chill day",
        placeIds: [1, 2]
      },
      "day-2": {
        id: "day-2",
        date_converted: "Thursday, November 9",
        day_short: "Thurs",
        date_short: "11/9",
        dayName: "Park and Palace",
        placeIds: [3, 4]
      },
      "day-3": {
        id: "day-3",
        date_converted: "Friday, November 10",
        dayName: "Market Day",
        day_short: "Fri",
        date_short: "11/10",
        placeIds: [5, 6]
      },
      "day-4": {
        id: "day-4",
        date_converted: "Saturday, November 11",
        dayName: "Last day",
        day_short: "Sat",
        date_short: "11/11",
        placeIds: [7, 8]
      }

    },
    "day_order": ["day-1", "day-2", "day-3", "day-4"]
  }
  const tripState = currentTrip.itinerary ?? tripTestData;

  const itineraryDetails = {
    destination: "London",
    duration: "4",
    arrival: "2024-06-12",
    departure: "2024-06-15",
  }


  const [noPhotoMode, setNoPhotoMode] = useState(false);

  const printCurrentTrip = () => {
    console.log(currentTrip);
  }

  useEffect(() => {
    window.addEventListener('scroll', checkScrollY, true);
    return () => window.removeEventListener('scroll', checkScrollY, true);
  }, []);
  const BtnrowRef = useRef(null);
  const checkScrollY = () => {
    if (window.scrollY >= 100) {
      // console.log("you have reached your destination");
      if (BtnrowRef.current) {
        // console.log(BtnrowRef.current.classList);
        BtnrowRef.current.classList.add("hidden");
      } 
    } else {
        BtnrowRef.current.classList.remove("hidden");
      }
  };

  return (
    <div className="printItinerary-page-container">
      <div ref={BtnrowRef} className="btn-row flx-r gap-3 mt-4">
        <Link to='/itinerary'><button className="btn-primaryflex small">Back to Itinerary</button></Link>
        <button onClick={() => setNoPhotoMode(noPhotoMode => !noPhotoMode)} className="btn-outlineflex small">Toggle no photo</button>
      </div>
      <div className="printItinerary-banner">
        <div className="title-imgDiv mr-3">
          <img src={currentTrip.imgUrl ?? ""} alt="*country-flag*" className="img-smedium" style={{ borderRadius: "4px" }} />
        </div>
        <div onClick={() => printCurrentTrip()} className="title-text flx-c">
          <p className="m-0 page-subsubheading-bold">{currentTrip.tripName ?? "-Name of Trip-"} Travel Itinerary</p>
          <p className="m-0 large gray-text">{timeFunctions.datify(timeFunctions.datiundash(currentTrip.startDate ?? itineraryDetails.arrival))} - {timeFunctions.datify(timeFunctions.datiundash(currentTrip.endDate ?? itineraryDetails.arrival))} &nbsp; &bull; &nbsp; {currentTrip.tripDuration ?? "5"} days</p>
        </div>
      </div>

      <div className="dayBoxes">

        {Object.values(tripState.days).map((day, id) => {
          let dayNumber = day.id.split("-")[1]
          return <div className="dayBox">

            <div className="title-row">
              <div className="day-name flx-3"><p className="">DAY {dayNumber}: {day.date_converted.toUpperCase()}{day.dayName && " - " + day.dayName.toUpperCase()}</p></div>
            </div>

            {day.placeIds.map((placeId, index) => {
              return <div key={index} className={`activity-row ${noPhotoMode && "noPhoto"}`}>
                {!noPhotoMode &&
                  <div className="activity-imgDiv">
                    <img src={tripState.places[placeId].imgURL} alt="" className="activity-img" />
                  </div>
                }
                <div className={`activity-body ${noPhotoMode && "noPhoto"} flx-3`}>
                  <div className="activity-name flx-8">
                    <p className="place-name bold500">{tripState.places[placeId].placeName}</p>
                    <p className="address gray-text small">{tripState.places[placeId].address}</p>
                  </div>
                  <div className="activity-checkbox flx-1">
                    <div className="span material-symbols-outlined">
                      check_box_outline_blank
                    </div>
                  </div>
                </div>
              </div>
            })}

          </div>
        })}
        <div className="page-footer mt-6">
          <Link to='/itinerary'><button className="btn-primaryflex small">Back to Itinerary</button></Link>
        </div>

      </div>
    </div>
  )
}
export default PrintItineraryPage;