import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import GoogleSearch from '../GoogleSearch';
import { Loading } from '../Loading';
import { createRoot } from 'react-dom/client';
import { APIProvider, AdvancedMarker, InfoWindow, Map, Pin, useMap } from '@vis.gl/react-google-maps';
import './googlemapbox.scoped.css'


// currentMapBounds
// tripMapBounds

const GoogleMapBox = ({ tripMapCenter, mapCenter, addPlaceToConfirm, mapCenterToggle, markers, setMarkers, markerColors }) => {
    // const [testMarkers, setTestMarkers] = useState(markers)
    const [testMarkers, setTestMarkers] = useState({
        "test-1": {
            id: "test-1",
            placeName: "ur mum",
            position: { lat: 51, lng: -0.12 },
            isPlaceToConfirm: true,
            dayId: null,
            infoWindowOpen: false
        },
        "test-2": {
            id: "test-2",
            placeName: "ur dad",
            position: { lat: 51.5, lng: -0.4 },
            isPlaceToConfirm: false,
            dayId: null,
            infoWindowOpen: false
        },
        "test-3": {
            id: "test-3",
            placeName: "ur granny",
            position: { lat: 51.8, lng: -0.6 },
            isPlaceToConfirm: false,
            dayId: null,
            infoWindowOpen: false
        },
    });
    const [markersState, setMarkersState] = useState(markers ?? testMarkers);
    useEffect(() => {
        console.log(markers)
        setMarkersState(markers)
    }, [markers])


    const addMarker = () => {
        const markerObj = {
            id: 0,
            placeName: "this place!",
            position: { lat: 51, lng: -0.8 },
            isPlaceToConfirm: true,
            infoWindowOpen: false,
            dayId: null,
        }
        let markersCopy = { ...testMarkers };
        markersCopy[markerObj.id] = markerObj;
        console.log(markersCopy)
        setTestMarkers(markersCopy);
    }

    // loading the map
    const gLibrary = ["core", "maps", "places", "marker"];
    const { isLoaded } = useLoadScript({
        id: 'google-maps-script',
        googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_API_KEY,
        libraries: gLibrary
    })





    // tracking the map view
    const [tripMapBounds, setTripMapBounds] = useState(null);
    const [mapViewBounds, setMapViewBounds] = useState(null);
    const [searchMapViewBounds, setSearchMapViewBounds] = useState(false);
    const updateMapViewBounds = (map) => {
        setMapViewBounds(map.detail.bounds);
    }
    // get tripMapBounds - mapBounds of trip destination location at zoom ~ 9, doesn't change after first set
    useEffect(() => {
        if (tripMapCenter) {
            let lat = tripMapCenter.lat;
            let lng = tripMapCenter.lng;
            let latLngBnds = {
                north: lat + 0.426,
                south: lat - 0.426,
                east: lng + 0.686,
                west: lng - 0.686,
            }
            setTripMapBounds(latLngBnds);
        }
    }, [])









    const infoWindowFunctions = {
        open: function (id) {
            let markersStateCopy = { ...markersState };
            markersStateCopy[id].infoWindowOpen = true;
            setMarkers(markersStateCopy);
        },
        close: function (id) {
            let markersStateCopy = { ...markersState };
            markersStateCopy[id].infoWindowOpen = false;
            setMarkersState(markersStateCopy);
        },
        toggle: function (id) {
            if (markersState[id].infoWindowOpen) {
                infoWindowFunctions.close(id)
            } else {
                infoWindowFunctions.open(id)
            }
        }
    }



    const [mapCenterChanged, setMapCenterChanged] = useState(false);
    const [newMapCenter, setNewMapCenter] = useState({
        position: mapCenter,
        zoom: null
    });
    useEffect(() => {
        let newMapCenterCopy = { ...newMapCenter };
        newMapCenterCopy.position = mapCenter;
        setNewMapCenter(newMapCenterCopy);
    }, [mapCenter])
    useEffect(() => {
        setMapCenterChanged(true);
    }, [mapCenterToggle])
    const goToTripCenter = () => {
        panToNewMapCenter(tripMapCenter, 9);
    }
    const panToNewMapCenter = (latLng, zoom) => {
        let newMapCenterCopy = { ...newMapCenter };
        newMapCenterCopy.position = latLng;
        if (zoom) {
            newMapCenterCopy.zoom = zoom;
        }
        setNewMapCenter(newMapCenterCopy);
        setMapCenterChanged(true);
    }





    const MapPanner = useCallback(({ newMapCenter, mapCenterChanged, setMapCenterChanged }) => {
        const myMap = useMap();
        // poly coords = NW, SW, SE, NE
        // const polygonCoords = [
        //     { lat: 51.774, lng: -0.12 },
        //     { lat: 51.466, lng: -0.12 },
        //     { lat: 51.466, lng: -0.8 },
        //     { lat: 51.774, lng: -0.8 },
        // ];
        // const polygon = new google.maps.Polygon({
        //     paths: polygonCoords,
        //     strokeColor: "#FF0000",
        //     strokeOpacity: 0.25,
        //     strokeWeight: 2,
        //     fillColor: "#242424",
        //     fillOpacity: 0.1,
        // })
        // polygon.setMap(myMap)
        // myMap.setOptions() ??
        // const featureLayer = myMap.getFeatureLayer('LOCALITY');
        // featureLayer.style = (options) => {
        //     let place_id = "ChIJdd4hrwug2EcRmSrV3Vo6llI";
        //     if (options.feature.placeId == place_id) {

        //         return ({
        //             fillColor: "#242424",
        //             fillOpacity: 0.15,
        //             strokeColor: "red",
        //             strokeOpacity: 0.5,
        //             strokeWeight: 2,
        //         })
        //     }
        // }
        useEffect(() => {
            if (mapCenterChanged) {
                myMap.panTo(newMapCenter.position)
                if (newMapCenter.zoom) {
                    myMap.setZoom(newMapCenter.zoom)
                }
                setMapCenterChanged(false);
            }
        }, [mapCenterChanged])
        return <></>
    }, [])

    const localizeSearchToggle = () => {
        let btn = document.getElementById('localizeSearchToggle');
        if (btn.classList.contains("pressed")) {
            // unlocalize
            setSearchMapViewBounds(false);
        } else {
            // localize
            setSearchMapViewBounds(true);
        }
    }
    const [markerColorsOn, setMarkerColorsOn] = useState(false);
    const numberToBgColor = (num) => {
        let lastDigit = num.slice(-1)
        if (lastDigit === "1") {
            return "red"
        }
        if (lastDigit === "2") {
            return "#000bda" // blue
        }
        if (lastDigit === "3") {
            return "#11a531" // green
        }
        if (lastDigit === "4") {
            return "yellow"
        }
        if (lastDigit === "5") {
            return "#ae0dd2" // purple
        }
        if (lastDigit === "6") {
            return "gray"
        }
        if (lastDigit === "7") {
            return "orange"
        }
        if (lastDigit === "8") {
            return "lightblue"
        }
        if (lastDigit === "9") {
            return "pink"
        }
        if (lastDigit === "0") {
            return "pink"
        }
        return null;
    }
    const numberToBorderColor = (num) => {
        let lastDigit = num.slice(-1)

        if (lastDigit === "2") {
            return "navy" // blue
        }
        if (lastDigit === "3") {
            return "green"
        }
        if (lastDigit === "4") {
            return "#cdcd15" // yellow
        }
        if (lastDigit === "5") {
            return "purple"
        }
        if (lastDigit === "6") {
            return "#4D4D4D" // gray
        }
        if (lastDigit === "7") {
            return "#c2820b" // orange
        }
        if (lastDigit === "8") {
            return "#3c79b7" // lightblue
        }
        if (lastDigit === "9") {
            return "#ab7ea8" // pink
        }
        if (lastDigit === "0") {
            return "darkred"
        }
        return null;
    }
    useEffect(() => {
        console.log(numberToBgColor("10786"))
    }, [])
    return (
        <>
            <span className={`material-symbols-outlined boundarySearch onTop white-text ${searchMapViewBounds ? "" : "d-none"}`}>
                filter_center_focus
            </span>
            {searchMapViewBounds &&
                <div className="boundarySearch-popup">
                    <p>Searching places in the area</p>
                </div>
            }
            <GoogleSearch isLoaded={isLoaded} tripMapBounds={tripMapBounds} mapViewBounds={mapViewBounds} addPlaceToConfirm={addPlaceToConfirm} searchMapViewBounds={searchMapViewBounds} />
            <div className="gMap-btns">
                <button id='localizeSearchToggle' onClick={() => localizeSearchToggle()} className={`gMap-btn ${searchMapViewBounds && "pressed"}`}>
                    <span className="material-symbols-outlined o-80">
                        {/* my_location */}
                        filter_center_focus
                    </span>
                    <div className="toolTip">
                        <p>Toggle <i>Boundary Search {searchMapViewBounds ? "On" : "Off"}</i> - when turned on your place search will only return places within the current map view</p>
                    </div>
                    {/* {searchMapViewBounds &&
                        <div className="info o-80">
                            <p>Searching places within map view only</p>
                        </div>
                    } */}
                </button>
                <button id='returnHome' onClick={() => goToTripCenter()} className="gMap-btn">
                    <span className="material-symbols-outlined o-80">
                        home_pin
                    </span>
                    <div className="toolTip narrow">
                        <p>Recenter map to trip location</p>
                    </div>
                </button>
                {markerColors &&
                    <button id='mapColors' onClick={() => setMarkerColorsOn(!markerColorsOn)} className={`gMap-btn ${markerColorsOn && "pressed"}`}>
                        <span className="material-symbols-outlined o-80">
                            palette
                        </span>
                        <div className="toolTip narrow">
                            <p>Toggle unique marker colors for each trip day</p>
                        </div>
                    </button>
                }
            </div>
            {isLoaded ?
                <APIProvider apiKey={import.meta.env.VITE_APP_GOOGLE_API_KEY}>
                    <Map
                        defaultZoom={9}
                        onBoundsChanged={updateMapViewBounds}
                        defaultCenter={{ lat: 51.5, lng: -0.12 }}
                        mapId="53a011bc3302095"
                        mapTypeControl={false}
                        fullscreenControl={false}

                    // onClick={() => addMarker()}

                    >
                        <MapPanner newMapCenter={newMapCenter} mapCenterChanged={mapCenterChanged} setMapCenterChanged={setMapCenterChanged} />
                        {Object.values(markers).map((marker, index) => {

                            return <>
                                <AdvancedMarker key={index} position={marker.position} onClick={() => infoWindowFunctions.toggle(marker.id)} zIndex={marker.isPlaceToConfirm ? 1 : null} >
                                    {marker.isPlaceToConfirm ?
                                        <Pin
                                            background="#6663FC"
                                            borderColor="#5553d7"
                                            glyphColor="#5553d7"
                                        />
                                        :
                                        markerColorsOn ?
                                            <Pin
                                                background={numberToBgColor(marker.dayId)}
                                                borderColor={numberToBorderColor(marker.dayId)}
                                                glyphColor={numberToBorderColor(marker.dayId)}
                                            />
                                            :
                                            <Pin

                                            />
                                    }
                                </AdvancedMarker>
                                {marker.infoWindowOpen &&
                                    <InfoWindow key={index} position={marker.position} pixelOffset={[0, -25]} onCloseClick={() => infoWindowFunctions.close(marker.id)}>
                                        <p className='m-0'>{marker.placeName}</p>
                                    </InfoWindow>
                                }

                            </>
                        })}
                    </Map>
                </APIProvider>
                :
                <div className="fillDivAndCenter">
                    <Loading noMascot noText />
                </div>
            }


        </>
    )
}
export default GoogleMapBox;