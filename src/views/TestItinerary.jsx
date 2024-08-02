import React, { useContext, useEffect, useState } from 'react'
import GoogleMapBox from '../components/GoogleMap/GoogleMapBox';
import './test.scoped.css'
import { DataContext } from '../Context/DataProvider';
import axios from 'axios';
import { Loading } from '../components/Loading';

const TestItinerary = () => {
    // imports
    const { geoToLatLng } = useContext(DataContext);

    // helper functions
    const getDayId = (placeId) => {
        if (tripState) {
            for (let dayNum of tripState.day_order) {
                if (tripState.days[dayNum].placeIds.includes(placeId)) {
                    return dayNum;
                }
            }
        }
        return null;
    }

    // input text state
    const [tripText, setTripText] = useState(null);

    // get trip
    const [tripState, setTripState] = useState(null);
    const [tripIsLoading, setTripIsLoading] = useState(false);
    const getItinerary = async () => {
        // send get request to Kate's backend using tripText
        setTripIsLoading(true);
        const response = axios.get(`https://routewise-backend.onrender.com/itinerary/createdays/${tripText}`)
            .then((response) => {
                console.log(response)
                setTripState(response.data);
                setTripIsLoading(false);
            })
            .catch((error) => {
                console.log(error)
                alert(error.message)
                setTripIsLoading(false);
            })

        // use response to update tripState
    }

    // markers
    const [markers, setMarkers] = useState([]);
    useEffect(() => {
        console.log(tripState)
        if (tripState) {
            updateMarkers()
        }
    }, [tripState])
    const updateMarkers = () => {
        const placesArr = Object.values(tripState.places);
        let markersObj = {};
        for (let i = 0; i < placesArr.length; i++) {
            let place = placesArr[i]
            if (place.day_id && place.in_itinerary === true) {
                markersObj[place.id] = {
                    id: place.id,
                    placeName: place.placeName,
                    position: geoToLatLng(place.geocode),
                    isPlaceToConfirm: false,
                    infoWindowOpen: false,
                    dayId: getDayId(place.id),
                }
            }
        }
        setMarkers(markersObj)
    }


    return (
        <>
            <div className="page-container90">
                <div className="test-input-bar my-2 flx gap-2">
                    <input onChange={(e) => setTripText(e.target.value)} type="text" className="input-model2" />
                    <button onClick={() => getItinerary()} className="btn-primaryflex">
                        <p className="m-0">Create Itinerary</p>
                    </button>
                </div>
                <div className="flx-r">
                    <div className="mapBox position-relative" style={{ borderRadius: "8px", overflow: "hidden" }}>
                        {tripIsLoading &&
                            <div className="fullDiv-overlay">
                                <Loading noMascot innerText={"Render may be waking up!"} />
                            </div>
                        }
                        <GoogleMapBox
                            tripMapCenter={{ lat: 51.5, lng: -0.12 }}
                            mapCenter={{ lat: 51.5, lng: -0.12 }}
                            markers={markers}
                            setMarkers={setMarkers}
                            markerColors
                            markerColorsDefaultOn
                            removeSearch
                        />
                    </div>
                    <div className="flx-c ml-4">
                        <h2 className='black-text my-0'>Saved Places</h2>
                        {tripState && tripState.saved_places.placesIds.map((placeId, index) => {
                            return <p className='m-0'>&bull; {tripState.places[placeId].placeName}</p>
                        })}
                        {tripState && tripState.saved_places.placesIds.length === 0 &&
                            <p className="m-0">None</p>
                        }

                    </div>
                </div>
            </div>
        </>
    )
}
export default TestItinerary;