import mapboxgl from 'mapbox-gl';
import React, { useContext, useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react'
import { Map, Marker, Popup, Source } from 'react-map-gl';
import SearchPlaceForMap from './SearchPlaceForMap';
import { DataContext } from '../Context/DataProvider';

const OpenMapBox = ({ mapCenter, newPlaceMarker, markers, zoom, country_2letter, geocode, addPlaceToConfirm }) => {
    const { currentTrip, setCurrentTrip, clearCurrentTrip } = useContext(DataContext);
    // LIBRARIES
    const mapboxOwnedStyles = [
        "mapbox://styles/mapbox/standard",
        "mapbox://styles/mapbox/streets-v12",
        "mapbox://styles/mapbox/outdoors-v12",
        "mapbox://styles/mapbox/light-v11",
        "mapbox://styles/mapbox/dark-v11",
        "mapbox://styles/mapbox/satellite-v9",
        "mapbox://styles/mapbox/satellite-streets-v12",
        "mapbox://styles/mapbox/navigation-day-v1",
        "mapbox://styles/mapbox/navigation-night-v1",
    ]
    // FIRST TRY USING MAPBOX
    // const mapRef = useRef(null);
    // mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;
    // useLayoutEffect(() => {
    //     const map = new mapboxgl.Map({
    //         container: 'map', // container ID
    //         style: mapboxOwnedStyles[1], // style URL
    //         center: [-74.5, 40], // mapCenter [lng, lat]
    //         zoom: 9, // zoom
    //     });
    //     // Create a new marker.
    //     const marker = new mapboxgl.Marker()
    //         .setLngLat([-74.5, 40.5])
    //         .addTo(map);
    // }, [mapRef])

    // TEST DATA
    const testMarkers = [
        {
            placeName: "Place 1",
            geocode: [-74.3, 40.2]
        },
        {
            placeName: "Place 2",
            geocode: [-74.5, 40.1]
        },
        {
            placeName: "Place 3",
            geocode: [-74.6, 40]
        },
    ]
    const testNewPlaceMarker = {
        placeName: "New Place",
        geocode: [-74.5, 40.0]
    }

    // POPUP CODE
    const [showPopUp, setShowPopUp] = useState({
        markers: {},
        newPlaceMarker: false
    })
    // showpopup populated with marker indices: boolean value
    useEffect(() => {
        let showPopUpCopy = { ...showPopUp };
        for (let i = 0; i < testMarkers.length; i++) {
            showPopUpCopy.markers[i] = false;
        };
        setShowPopUp(showPopUpCopy);
        // console.log(showPopUpCopy)
        console.log(markers)
    }, [])
    const toggleShowPopUp = (index, newPlace) => {
        let showPopUpCopy = { ...showPopUp };
        if (newPlace) {
            showPopUpCopy.newPlaceMarker = !showPopUpCopy.newPlaceMarker;
            setShowPopUp(showPopUpCopy);
        } else {
            showPopUpCopy.markers[index] = !showPopUpCopy.markers[index];
            setShowPopUp(showPopUpCopy);
        }
    }

    // MAP CODE
    const mapboxAccessToken = import.meta.env.VITE_APP_MAPBOX_API_KEY;
    const [viewState, setViewState] = useState({
        latitude: mapCenter ? mapCenter[0] : 40,
        longitude: mapCenter ? mapCenter[1] : -74.5,
        zoom: 9
    });

    return (
        <>
            {/* <div className="mapBox map-style"> */}
            <SearchPlaceForMap addPlaceToConfirm={addPlaceToConfirm} />
            {/* <div ref={mapRef} id='map' style={{ width: '100%', height: '100%' }}></div> */}
            <Map
                {...viewState}
                onMove={e => setViewState(e.viewState)}
                mapStyle={mapboxOwnedStyles[1]}
                mapboxAccessToken={mapboxAccessToken}
                style={{ width: '100%', height: '100%' }}
                className=""
            >
                {markers && markers.map((marker, i) => {
                    return <>
                        <Marker
                            onClick={() => toggleShowPopUp(i)}
                            latitude={marker.geocode[0]}
                            longitude={marker.geocode[1]}
                            anchor='bottom'>
                            <img src="https://i.imgur.com/9OD1zyb.png" alt="" className="img-small" />
                        </Marker>
                        {showPopUp.markers[i] &&
                            <Popup
                                latitude={marker.geocode[0]}
                                longitude={marker.geocode[1]}
                                anchor='top'
                                onClose={() => toggleShowPopUp(i)}
                                closeOnClick={false}>
                                <div className="popupBox">
                                    {marker.placeName}
                                </div>
                            </Popup>
                        }
                    </>
                })}
                {
                    newPlaceMarker &&
                    <>
                        <Marker
                            onClick={() => toggleShowPopUp(false, 'newPlace')}
                            latitude={newPlaceMarker.geocode[0]}
                            longitude={newPlaceMarker.geocode[1]}
                            anchor='bottom'>
                            <img src="https://i.imgur.com/0XluxVX.png" alt="" className="img-smedium" />
                        </Marker>
                        {showPopUp.newPlaceMarker &&
                            <Popup
                                latitude={newPlaceMarker.geocode[0]}
                                longitude={newPlaceMarker.geocode[1]}
                                anchor='top'
                                onClose={() => toggleShowPopUp(false, 'newPlace')}
                                closeOnClick={false}
                            >
                                <div className="popupBox">
                                    {newPlaceMarker.placeName}
                                </div>
                            </Popup>
                        }
                    </>
                }
            </Map>
            {/* </div> */}
        </>
    )
}
export default OpenMapBox;
