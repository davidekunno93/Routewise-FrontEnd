import React, { useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import GoogleSearch from '../GoogleSearch';
import { Loading } from '../Loading/Loading';
import { createRoot } from 'react-dom/client';
import { APIProvider, AdvancedMarker, InfoWindow, Map, Pin, useMap } from '@vis.gl/react-google-maps';
import './googlemapbox.scoped.css'
import { bounds } from 'leaflet';
import { DataContext } from '../../Context/DataProvider';

// currentMapBounds
// tripMapBounds

const GoogleMapBox = ({ tripMapCenter, mapCenter, addPlaceToConfirm, mapCenterToggle, markers, setMarkers, markerColors, markerColorsDefaultOn, removeSearch, showPlaceAddedBox, setShowPlaceAddedBox, placeAddedBoxText }) => {
    const { wait, generateTripMapBounds, numberToBgColor } = useContext(DataContext);

    // loading the map -- not needed for vis.gl library however this allows loading screen before map renders
    const gLibrary = ["core", "maps", "places", "marker"];
    const { isLoaded } = useLoadScript({
        id: 'google-maps-script',
        googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_API_KEY,
        libraries: gLibrary
    });

    // for test page
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
    if (!mapCenterToggle) {
        mapCenterToggle = false
    }


    // [tracking the map]
    // get tripMapBounds - mapBounds of trip destination location at zoom ~ 9, doesn't change after first set
    const [tripMapBounds, setTripMapBounds] = useState(null);

    useEffect(() => {
        if (tripMapCenter) {
            let latLngBnds = generateTripMapBounds(tripMapCenter);
            setTripMapBounds(latLngBnds);
        }
    }, [])

    const [mapMonitor, setMapMonitor] = useState({
        center: {},
        bounds: {},
        zoom: 9,
    })
    const updateMapMonitor = {
        center: function (newCenter) {
            let mapMonitorCopy = { ...mapMonitor };
            mapMonitorCopy.center = newCenter;
            setMapMonitor(mapMonitorCopy);
        },
        bounds: function (newBounds) {
            let mapMonitorCopy = { ...mapMonitor };
            mapMonitorCopy.bounds = newBounds;
            setMapMonitor(mapMonitorCopy);
        },
        zoom: function (newZoom) {
            let mapMonitorCopy = { ...mapMonitor };
            mapMonitorCopy.zoom = newZoom;
            setMapMonitor(mapMonitorCopy);
        }
    }

    const [mapCenterChanged, setMapCenterChanged] = useState(false); // use to alert map that it needs to recenter
    const [newMapCenter, setNewMapCenter] = useState({
        position: mapCenter,
        zoom: null
    });
    // keep local state of mapCenter up to date with any mapCenter state changes in parent component
    useEffect(() => {
        let newMapCenterCopy = { ...newMapCenter };
        newMapCenterCopy.position = mapCenter;
        setNewMapCenter(newMapCenterCopy);
    }, [mapCenter])
    useEffect(() => {
        setMapCenterChanged(true);
    }, [mapCenterToggle])

    const panToNewMapCenter = (latLng, zoom) => {
        let newMapCenterCopy = { ...newMapCenter };
        newMapCenterCopy.position = latLng;
        if (zoom) {
            newMapCenterCopy.zoom = zoom;
        }
        setNewMapCenter(newMapCenterCopy);
        setMapCenterChanged(true);
    }


    // [child component allowing map actions ]
    const MapPanner = useCallback(({ newMapCenter, mapCenterChanged, setMapCenterChanged, mapMonitor }) => {
        const myMap = useMap();
        useEffect(() => {
            if (mapCenterChanged) {
                myMap.panTo(newMapCenter.position)
                if (newMapCenter.zoom && newMapCenter.zoom !== mapMonitor.zoom) {
                    myMap.setZoom(newMapCenter.zoom)
                }
                setMapCenterChanged(false);
            }
        }, [mapCenterChanged])
        return <></>
    }, [])



    // [markers code]
    const [markersState, setMarkersState] = useState(markers ?? testMarkers);
    useEffect(() => {
        setMarkersState(markers)
    }, [markers])
    const [markerColorsOn, setMarkerColorsOn] = useState(markerColorsDefaultOn ? true : false);
    // const numberToBgColor = (num) => {
    //     let lastDigit = num.slice(-1)
    //     if (lastDigit === "1") {
    //         return "#FF4856" // RED
    //     }
    //     if (lastDigit === "2") {
    //         return "#FFD84E" // YELLOW
    //     }
    //     if (lastDigit === "3") {
    //         return "#2185F9" // BLUE
    //     }
    //     if (lastDigit === "4") {
    //         return "#4CDE08" // GREEN
    //     }
    //     if (lastDigit === "5") {
    //         return "#FFA80A" // ORANGE
    //     }
    //     if (lastDigit === "6") {
    //         return "#FF52FF" // PINK
    //     }
    //     if (lastDigit === "7") {
    //         return "#14DCDC" // LIGHT BLUE
    //     }
    //     if (lastDigit === "8") {
    //         return "#CECDFE" // PURPLE
    //     }
    //     if (lastDigit === "9") {
    //         return "#A9743A" // BROWN
    //     }
    //     if (lastDigit === "0") {
    //         return "#42F2A8" // LIGHT GREEN
    //     }
    //     return null;
    // }
    const numberToBorderColor = (num) => {
        let lastDigit = num.slice(-1)

        if (lastDigit === "1") {
            return "#8A0F14" // RED
        }
        if (lastDigit === "2") {
            return "#565403" // YELLOW
        }
        if (lastDigit === "3") {
            return "#000349" // BLUE
        }
        if (lastDigit === "4") {
            return "#2B5D26" // GREEN
        }
        if (lastDigit === "5") {
            return "#794812" // ORANGE
        }
        if (lastDigit === "6") {
            return "#8D0076" // PINK
        }
        if (lastDigit === "7") {
            return "#275E5E" // LIGHT BLUE
        }
        if (lastDigit === "8") {
            return "#682B85" // PURPLE
        }
        if (lastDigit === "9") {
            return "#B0824E" // BROWN
        }
        if (lastDigit === "0") {
            return "#15563B" // LIGHT GREEN
        }
        return null;
    }
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

    // [map btns]
    // recenter to trip
    const goToTripCenter = () => {
        panToNewMapCenter(tripMapCenter, 9);
    }
    // boundary search
    const [searchMapViewBounds, setSearchMapViewBounds] = useState(false);
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

    const placeAddedBoxRef = useRef(null);
    const showPlaceAddedBoxSwitch = () => {
        placeAddedBoxRef.current.classList.remove("hidden");
        wait(2000).then(() => {
            placeAddedBoxRef.current.classList.add("hidden");
        })
    }
    const closePlaceAddedBox = () => {
        placeAddedBoxRef.current.classList.add("hidden");
    }
    useEffect(() => {
        if (showPlaceAddedBox) {
            setShowPlaceAddedBox(false);
            showPlaceAddedBoxSwitch();
        }
    }, [showPlaceAddedBox])

    const renderGoogleSearch = useMemo(() => {
        return <GoogleSearch 
            // isLoaded={isLoaded}
            tripMapBounds={tripMapBounds}
            mapViewBounds={mapMonitor.bounds}
            addPlaceFunction={addPlaceToConfirm}
            searchMapViewBounds={searchMapViewBounds}
            searchLimit={5}
            styleProfile={"googlemap"}
        />
    }, []);


    return (
        <>
            <span className={`material-symbols-outlined boundarySearch onTop white-text ${searchMapViewBounds ? "" : "d-none"}`}>
                filter_center_focus
            </span>
            <div ref={placeAddedBoxRef} className="place-added-box hidden">
                <span onClick={() => closePlaceAddedBox()} className="material-symbols-outlined">
                    close
                </span>
                <p>{placeAddedBoxText ?? "Added to Places List!"}</p>
            </div>
            {searchMapViewBounds &&
                <div className="boundarySearch-popup">
                    <p>Searching places in the area</p>
                </div>
            }
            {!removeSearch &&
                <GoogleSearch 
                    isLoaded={isLoaded}
                    tripMapBounds={tripMapBounds}
                    mapViewBounds={mapMonitor.bounds}
                    addPlaceFunction={addPlaceToConfirm}
                    searchMapViewBounds={searchMapViewBounds}
                    searchLimit={5}
                    styleProfile={"googlemap"}
                />
            }
            <div className="gMap-btns">
                {!removeSearch &&
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
                }
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
            {/* {isLoaded ? */}
                <APIProvider apiKey={import.meta.env.VITE_APP_GOOGLE_API_KEY}>
                    <Map
                        defaultZoom={9}
                        onBoundsChanged={(map) => updateMapMonitor.bounds(map.detail.bounds)}
                        defaultCenter={{ lat: 51.5, lng: -0.12 }}
                        mapId="53a011bc3302095"
                        mapTypeControl={false}
                        fullscreenControl={false}
                        onCenterChanged={(map) => updateMapMonitor.center(map.detail.center)}
                        onZoomChanged={(map) => updateMapMonitor.zoom(map.detail.zoom)}
                        onClick={() => console.log(mapMonitor)}

                    >
                        <MapPanner newMapCenter={newMapCenter} mapCenterChanged={mapCenterChanged} setMapCenterChanged={setMapCenterChanged} mapMonitor={mapMonitor} />
                        {Object.values(markers).map((marker, index) => {

                            return <>
                                <AdvancedMarker key={index} position={marker.position} onClick={() => infoWindowFunctions.toggle(marker.id)} zIndex={marker.isPlaceToConfirm ? 1 : null} >
                                    {marker.isPlaceToConfirm ?
                                        <Pin
                                            background={markerColorsOn ? "#ff0000" : "#6663FC"}
                                            borderColor={markerColorsOn ? "#000000" : "#5553d7"}
                                            glyphColor={markerColorsOn ? "#000000" : "#5553d7"}
                                        />
                                        :
                                        markerColorsOn ?
                                            <Pin
                                                // marker.dayId ternery operator for saved places to render marker on test-itinerary pg
                                                background={marker.dayId ? numberToBgColor(marker.dayId) : "#000000"}
                                                borderColor="#000000"
                                                glyphColor="#000000"
                                            />
                                            :
                                            <Pin

                                            />
                                    }
                                </AdvancedMarker>
                                {marker.infoWindowOpen &&
                                    <InfoWindow key={index} position={marker.position} pixelOffset={[0, -25]} onCloseClick={() => infoWindowFunctions.close(marker.id)}>
                                        {/* <p className='m-0'>{marker.id}</p> */}
                                        <p className='m-0'>{marker.placeName}</p>
                                    </InfoWindow>
                                }

                            </>
                        })}
                    </Map>
                </APIProvider>
                {/* :
                <div className="fillDivAndCenter">
                    <Loading noMascot noText />
                </div> */}
            {/* } */}


        </>
    )
}
export default GoogleMapBox;