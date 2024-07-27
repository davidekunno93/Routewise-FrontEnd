import React, { useContext, useEffect, useState } from 'react'
import GoogleMapBox from '../components/GoogleMap/GoogleMapBox';
import './test.scoped.css'
import { DataContext } from '../Context/DataProvider';
import axios from 'axios';

const TestItinerary = () => {
    const { geoToLatLng } = useContext(DataContext);
    const [markers, setMarkers] = useState([]);
    const [tripText, setTripText] = useState(null);
    const [tripState, setTripState] = useState(null);
    useEffect(() => {
        if (tripState) {
            updateMarkers()
        }
    }, [tripState])

    const getItinerary = async () => {
        // send get request to Kate's backend using tripText
        const response = axios.get(`https://routewise-backend.onrender.com/itinerary/createdays/${tripText}`)
            .then((response) => {
                console.log(response)
                setTripState(response.data);
            })
            .catch((error) => {
                console.log(error)
                alert(error.message)
            })

        // use response to update tripState
    }
    const updateMarkers = () => {
        const placesArr = Object.values(tripState.places);
        let markersObj = {};
        for (let i = 0; i < placesArr.length; i++) {
            let place = placesArr[i]
            if (place.day_id) {
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
    return (
        <>
            <div className="page-container90">
                <div className="test-input-bar my-2 flx gap-2">
                    <input onChange={(e) => setTripText(e.target.value)} type="text" className="input-model2" />
                    <button onClick={() => getItinerary()} className="btn-primaryflex">
                        <p className="m-0">Create Itinerary</p>
                    </button>
                </div>
                <div className="mapBox" style={{ borderRadius: "8px", overflow: "hidden" }}>
                    <GoogleMapBox
                        tripMapCenter={{ lat: 51.5, lng: -0.12 }}
                        mapCenter={{ lat: 51.5, lng: -0.12 }}
                        markers={markers}
                        setMarkers={setMarkers}
                        markerColors
                        removeSearch
                    />
                </div>
            </div>
        </>
    )
}
export default TestItinerary;