import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import GoogleSearch from '../GoogleSearch';
import { Loading } from '../Loading';
import { createRoot } from 'react-dom/client';
import { APIProvider, AdvancedMarker, InfoWindow, Map, Pin, useMap } from '@vis.gl/react-google-maps';
import './googlemapbox.scoped.css'


// currentMapBounds
// tripMapBounds

const GoogleMapBox = ({ tripMapCenter, mapCenter, addPlaceToConfirm, mapCenterToggle, markers, setMarkers }) => {
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
        // console.log(markers)
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
            btn.classList.remove("pressed");
        } else {
            // localize
            setSearchMapViewBounds(true);
            btn.classList.add("pressed");
        }
    }
    return (
        <>
            <span className={`material-symbols-outlined boundarySearch onTop white-text ${searchMapViewBounds ? "" : "d-none"}`}>location_searching</span>
            <GoogleSearch isLoaded={isLoaded} tripMapBounds={tripMapBounds} mapViewBounds={mapViewBounds} addPlaceToConfirm={addPlaceToConfirm} searchMapViewBounds={searchMapViewBounds} />
            <div className="gMap-btns">
                <button id='localizeSearchToggle' onClick={() => localizeSearchToggle()} className="gMap-btn">
                    <span className="material-symbols-outlined o-80">
                        my_location
                    </span>
                    <div className="toolTip">
                        <p>Toggle <i>Boundary Search {searchMapViewBounds ? "On" : "Off"}</i> - when turned on your place search will only return places within the current map view</p>
                    </div>
                    {searchMapViewBounds && 
                    <div className="info o-80">
                        <p>Searching places within map view only</p>
                    </div>
                    }
                </button>
                <button id='returnHome' onClick={() => goToTripCenter()} className="gMap-btn">
                    <div className="material-symbols-outlined o-80">
                        home_pin
                    </div>
                    <div className="toolTip narrow">
                        <p>Recenter map to trip location</p>
                    </div>
                </button>
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
                                    <Pin
                                        background={`${marker.isPlaceToConfirm ? "#6663FC" : ""}`}
                                        borderColor={`${marker.isPlaceToConfirm ? "#5553d7" : ""}`}
                                        glyphColor={`${marker.isPlaceToConfirm ? "#5553d7" : ""}`}
                                    />
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