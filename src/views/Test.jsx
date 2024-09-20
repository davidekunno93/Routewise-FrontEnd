import React, { useState, lazy, Suspense, useRef, useEffect, useCallback, useMemo } from 'react'
import { Loading } from '../components/Loading/Loading'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import { Draggable, Icon } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { DragDropContext } from 'react-beautiful-dnd';
import { FlowBox } from '../components/FlowBox';
import "./test.scoped.css"
import { GoogleMap, StreetViewService, useJsApiLoader, useLoadScript } from '@react-google-maps/api';
import { Zoom } from 'react-awesome-reveal';
import SearchPlaceForMap from '../components/SearchPlaceForMap';
import GoogleSearch from '../components/GoogleSearch';
import PlaceToConfirmCard from '../components/PlaceToConfirmCard';
import GoogleMapBox from '../components/GoogleMap/GoogleMapBox';


const Column = lazy(() => import('../components/Column'));
const FlowBoxDraggable = lazy(() => import('../components/FlowBoxDraggable'));

export const Test = () => {
    // const renderLoader = () => {
    //     <p>Loading</p>
    // }
    // map stuff
    const markers = [
        {
            geocode: [48.86, 2.3522],
            popUp: "First Marker"
        },
        {
            geocode: [48.85, 2.3522],
            popUp: "Second Marker"
        },
        {
            geocode: [48.855, 2.3522],
            popUp: "Third Marker"
        },
        {
            geocode: [48.865, 2.3522],
            popUp: "Fourth Marker"
        },
    ]
    const pinIcon = new Icon({
        iconUrl: "https://i.imgur.com/ukt1lYj.png",
        iconSize: [46, 41]
    })
    const parisGeo = [48.8566, 2.3522]
    const tile1 = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
    const tile2 = 'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png'
    const tiles = ["http://a.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png", "http://b.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png", "http://c.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png"]


    // drag n drop
    const initialData = {
        places: {
            1: { id: 1, placeName: "London", info: "Cold and rainy", address: "In the UK", imgUrl: "https://i.imgur.com/mGTF2GC.jpg" },
            2: { id: 2, placeName: "Paris", info: "Rude ppl", address: "In France", imgUrl: "https://i.imgur.com/JnLJKbE.jpg" },
            3: { id: 3, placeName: "Houston", info: "Sun is never off", address: "In USA", imgUrl: "https://i.imgur.com/RxO0dfy.jpg" },
            4: { id: 4, placeName: "Tokyo", info: "Historical grounds", address: "In Japan", imgUrl: "https://i.imgur.com/5r2n8f4.jpg" },
            5: { id: 5, placeName: "Rome", info: "Good food", address: "In Italy", imgUrl: "https://i.imgur.com/HJJEInt.jpg" },
            6: { id: 6, placeName: "Los Angeles", info: "Best Surgeons live here", address: "In USA", imgUrl: "https://i.imgur.com/F6fkD7O.jpg" }
        },
        days: {
            "day-1": {
                id: "day-1",
                day: "Monday",
                date: "11/27",
                placeIds: [1, 2, 3, 4, 5, 6]
            },
            "day-2": {
                id: "day-2",
                day: "Tuesday",
                date: "11/28",
                placeIds: []
            },
            "day-3": {
                id: "day-3",
                day: "Wednesday",
                date: "11/29",
                placeIds: []
            },
            // for reordering of days
        },
        dayOrder: ["day-1", "day-2", "day-3"]
    }


    const [state, setState] = useState(initialData);

    const reorderColumnList = (sourceDay, startIndex, endIndex) => {
        const newPlaceIds = Array.from(sourceDay.placeIds);
        const [removed] = newPlaceIds.splice(startIndex, 1)
        newPlaceIds.splice(endIndex, 0, removed)

        const newDay = {
            ...sourceDay,
            placeIds: newPlaceIds
        }

        return newDay;
    }



    // my data for draggable containers
    function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    const tripData = {
        tripID: "",
        places: {
            1: {
                id: 1,
                placeName: "Traflagar Square",
                info: "Open 24 hours",
                address: "Trafalgar Sq, London WC2N 5DS, UK",
                imgURL: "https://i.imgur.com/xwY6Bdd.jpg",
                lat: 51.50806,
                long: -0.12806,
                geocode: [51.50806, -0.12806]
            },
            2: {
                id: 2,
                placeName: "Tate Modern",
                info: "Mon-Sun 10 AM-6 PM",
                address: "Bankside, London SE1 9TG, UK",
                imgURL: "https://i.imgur.com/FYc6OB3.jpg",
                lat: 51.507748,
                long: -0.099469,
                geocode: [51.507748, -0.099469]
            },
            3: {
                id: 3,
                placeName: "Hyde Park",
                info: "Mon-Sun 5 AM-12 AM",
                address: "Hyde Park, London W2 2UH, UK",
                imgURL: "https://i.imgur.com/tZBnXz4.jpg",
                lat: 51.502777,
                long: -0.151250,
                geocode: [51.502777, -0.151250]
            },
            4: {
                id: 4,
                placeName: "Buckingham Palace",
                info: "Tours Start at 9am",
                address: "Buckingham Palace, London SW1A 1AA, UK",
                imgURL: "https://i.imgur.com/lw40mp9.jpg",
                lat: 51.501476,
                long: -0.140634,
                geocode: [51.501476, -0.140634]
            },
            5: {
                id: 5,
                placeName: "Borough Market",
                info: "Closed Mondays, Tues-Sun 10 AM-5 PM",
                address: "Borough Market, London SE1 9AL, UK",
                imgURL: "https://i.imgur.com/9KiBKqI.jpg",
                lat: 51.50544,
                long: -0.091249,
                geocode: [51.50544, -0.091249]
            },
            6: {
                id: 6,
                placeName: "Traflagar Square",
                info: "Open 24 hours",
                address: "Trafalgar Sq, London WC2N 5DS, UK",
                imgURL: "https://i.imgur.com/xwY6Bdd.jpg",
                lat: 51.50806,
                long: -0.12806,
                geocode: [51.50806, -0.12806]
            },
            7: {
                id: 7,
                placeName: "Borough Market",
                info: "Closed Mondays, Tues-Sun 10 AM-5 PM",
                address: "Borough Market, London SE1 9AL, UK",
                imgURL: "https://i.imgur.com/9KiBKqI.jpg",
                lat: 51.50544,
                long: -0.091249,
                geocode: [51.50544, -0.091249]
            },
            8: {
                id: 8,
                placeName: "Traflagar Square",
                info: "Open 24 hours",
                address: "Trafalgar Sq, London WC2N 5DS, UK",
                imgURL: "https://i.imgur.com/xwY6Bdd.jpg",
                lat: 51.50806,
                long: -0.12806,
                geocode: [51.50806, -0.12806]
            }
        },
        days: {
            "day-1": {
                id: "day-1",
                day: "Wednesday, November 8",
                dayShort: "Wed",
                dateShort: "11/8",
                dayName: "",
                placeIds: [1, 2]
            },
            "day-2": {
                id: "day-2",
                day: "Thursday, November 9",
                dayShort: "Thurs",
                dateShort: "11/9",
                dayName: "",
                placeIds: [3, 4]
            },
            "day-3": {
                id: "day-3",
                day: "Friday, November 10",
                dayName: "",
                dayShort: "Fri",
                dateShort: "11/10",
                placeIds: [5, 6]
            },
            "day-4": {
                id: "day-4",
                day: "Saturday, November 11",
                dayName: "",
                dayShort: "Sat",
                dateShort: "11/11",
                placeIds: [7, 8]
            }

        },
        "dayOrder": ["day-1", "day-2", "day-3", "day-4"]
    }

    const [tripState, setTripState] = useState(tripData);

    const reorderDayList = (sourceDay, startIndex, endIndex) => {
        const newPlaceIds = Array.from(sourceDay.placeIds);
        const [removed] = newPlaceIds.splice(startIndex, 1)
        newPlaceIds.splice(endIndex, 0, removed)

        const newDay = {
            ...sourceDay,
            placeIds: newPlaceIds
        }

        return newDay;
    }
    const onDragEndItinerary = (result) => {
        const { destination, source } = result
        // if user tries to drop outside scope
        if (!destination) return;

        // if user drops in same position
        if (destination.droppableId === source.droppableId && destination.index === source.index) { return; }

        // if user drops in same container but different position
        const sourceDay = tripState.days[source.droppableId];
        const destinationDay = tripState.days[destination.droppableId];

        if (sourceDay.id === destinationDay.id) {
            const newDay = reorderDayList(
                sourceDay,
                source.index,
                destination.index
            );

            const newTripState = {
                ...tripState,
                days: {
                    ...tripState.days,
                    [newDay.id]: newDay,
                }
            };
            setTripState(newTripState);
            return;
        }

        // if user drops in different container
        const startPlaceIds = Array.from(sourceDay.placeIds);
        const [removed] = startPlaceIds.splice(source.index, 1);
        const newStartDay = {
            ...sourceDay,
            placeIds: startPlaceIds,
        }

        const endPlaceIds = Array.from(destinationDay.placeIds)
        endPlaceIds.splice(destination.index, 0, removed);
        const newEndDay = {
            ...destinationDay,
            placeIds: endPlaceIds,
        }

        const newState = {
            ...tripState,
            days: {
                ...tripState.days,
                [newStartDay.id]: newStartDay,
                [newEndDay.id]: newEndDay,
            }
        }
        setTripState(newState);
    }

    // FlowBox functions
    const rotateSymbol = (id, deg) => {
        const symbol = document.getElementById(`expandArrow-${id}`)
        symbol.style.transform = `rotate(${deg}deg)`
    }
    const expandFlow = (id) => {
        const flowZero = document.getElementById(`flow-${id}`)
        const flowBodyZero = document.getElementById(`flowBody-${id}`)
        const placeCount = document.getElementById(`placeCount-${id}`)
        flowZero.style.height = `${flowBodyZero.offsetHeight}px`
        rotateSymbol(id, '0')
        wait(100).then(() => {
            flowBodyZero.classList.remove('o-none')
            placeCount.classList.add('o-none')
            wait(500).then(() => {
                flowZero.style.removeProperty('height')
            })
        })
    }
    const collapseFlow = (id) => {
        const flowZero = document.getElementById(`flow-${id}`)
        const flowBodyZero = document.getElementById(`flowBody-${id}`)
        const placeCount = document.getElementById(`placeCount-${id}`)
        flowBodyZero.classList.add('o-none')
        flowZero.style.height = `${flowBodyZero.offsetHeight}px`
        wait(100).then(() => {
            flowZero.style.height = '0px'
            placeCount.classList.remove('o-none')
            rotateSymbol(id, '-90')
        })
    }
    const toggleFlow = (id) => {
        const flowZero = document.getElementById(`flow-${id}`)
        const flowBodyZero = document.getElementById(`flowBody-${id}`)
        // console.log(id)
        if (flowZero.style.height === '0px') {
            expandFlow(id)
        } else {
            collapseFlow(id)
        }
    }
    const addSearchOpen = (id) => {
        const addPlacesBtn = document.getElementById(`addPlacesBtn-${id}`)
        const searchBar = document.getElementById(`searchBar-${id}`)
        const addPlaceExpand = document.getElementById(`addPlace-expand-${id}`)
        addPlacesBtn.classList.add('d-none')
        searchBar.classList.remove('d-none')
        addPlaceExpand.style.height = '70px'
        wait(100).then(() => {
            searchBar.classList.remove('o-none')
        })
    }
    const addSearchClose = (id) => {
        const addPlacesBtn = document.getElementById(`addPlacesBtn-${id}`)
        const searchBar = document.getElementById(`searchBar-${id}`)
        const addPlaceExpand = document.getElementById(`addPlace-expand-${id}`)
        searchBar.classList.add('o-none')
        wait(100).then(() => {
            addPlacesBtn.classList.remove('d-none')
            searchBar.classList.add('d-none')
            addPlaceExpand.style.height = '30px'
        })
    }










    const onDragEnd = (result) => {
        const { destination, source } = result
        // if user tries to drop outside scope
        if (!destination) return;

        // if user drops in same position
        if (destination.droppableId === source.droppableId && destination.index === source.index) { return; }

        // if user drops in same container but different position
        const sourceDay = state.days[source.droppableId];
        const destinationDay = state.days[destination.droppableId];

        if (sourceDay.id === destinationDay.id) {
            const newColumn = reorderColumnList(
                sourceDay,
                source.index,
                destination.index
            );

            const newState = {
                ...state,
                days: {
                    ...state.days,
                    [newColumn.id]: newColumn,
                }
            };
            setState(newState);
            return;
        }

        // if user drops in different container
        const startPlaceIds = Array.from(sourceDay.placeIds);
        const [removed] = startPlaceIds.splice(source.index, 1);
        const newStartDay = {
            ...sourceDay,
            placeIds: startPlaceIds,
        }

        const endPlaceIds = Array.from(destinationDay.placeIds)
        endPlaceIds.splice(destination.index, 0, removed);
        const newEndDay = {
            ...destinationDay,
            placeIds: endPlaceIds,
        }

        const newState = {
            ...state,
            days: {
                ...state.days,
                [newStartDay.id]: newStartDay,
                [newEndDay.id]: newEndDay,
            }
        }
        setState(newState);
    }

    const london = {
        geocode: { lat: 51.50735, lng: -0.12776 }
    }

    const [markerInfoOpen, setMarkerInfoOpen] = useState(false);

    const mapRef = useRef(null);
    const placeAutoCompleteRef = useRef(null);
    const gLibrary = ["core", "maps", "places", "marker"];
    const { isLoaded } = useLoadScript({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyD6EGcKbaI-RJrDL0EWbLGOd0XxXAmSxyo',
        // googleMapsApiKey: process.env.NEXT_PUBLIC_API_KEY,
        libraries: gLibrary,
    })
    
    // useEffect(() => {
    //     map.panTo({ lat: latitude, lng: longitude })
    // }, [latitude, setLongitude])
    const [map, setMap] = useState(null);
    const [mapViewCenter, setMapViewCenter] = useState(null);
    const [mapViewBounds, setMapViewBounds] = useState(null);
    useEffect(() => {
        console.log(mapViewBounds)
    }, [mapViewBounds])
    // useEffect(() => {
    //     if (isLoaded) {
    //         const mapOptions = {
    //             center: {
    //                 lat: 51.50735,
    //                 lng: -0.12776
    //             },
    //             zoom: 9,
    //             mapId: '53a011bc3302095',
    //             mapTypeControl: false,
    //             fullscreenControl: false,
    //         }

    //         // setup the map
    //         const gMap = new google.maps.Map(mapRef.current, mapOptions);

    //         const marker = new google.maps.marker.AdvancedMarkerElement({
    //             map: map,
    //             position: {lat: 51, lng: -0.8},
    //             title: "testing",
    //             zIndex: 2,
    //         });


    //         setMap(gMap);

    //     }
    // }, [isLoaded])
    const onUnmount = useCallback(() => {
        setMap(null);
    }, [])
    const onLoad = useCallback((map) => {
        if (isLoaded) {
            const mapOptions = {
                center: {
                    lat: 51.50735,
                    lng: -0.12776
                },
                zoom: 9,
                mapId: '53a011bc3302095',
                mapTypeControl: false,
                fullscreenControl: false,
            }

            // setup the map
            // const gMap = new google.maps.Map(map);

            // const marker = new google.maps.marker.AdvancedMarkerElement({
            //     map: map,
            //     position: {lat: 51, lng: -0.8},
            //     title: "testing",
            //     zIndex: 2,
            // });

            // const bounds = new window.google.maps.LatLngBounds(london.geocode);
            // map.fitBounds(bounds);



            setMap(map);

        }
    }, [isLoaded])
    const updateCurrentMapCenter = (e) => {
        if (map) {
            console.log(map)
            let mapGeo = map.getCenter();
            let LatLng = { lat: mapGeo.lat(), lng: mapGeo.lng() }
            setMapViewCenter(LatLng)
            // console.log({lat: mapGeo.lat(), lng: mapGeo.lng()})
            let latLngBounds = map.getBounds();

            setMapViewBounds(latLngBounds);
        }
        // console.log("dragged")
    }


    const testFunc = () => {
        if (map) {
            let boundsObj = map.getBounds();
            let centerObj = map.getCenter();
            let lat = centerObj.lat();
            let lng = centerObj.lng();
            // console.log([lat, lng]);
            // console.log(boundsObj);
            // map.panTo({lat: 51, lng: -0.8})
            // console.log(currentMapCenter)
        }
    }
    const updateMapCenter = (geocode) => {
        if (map) {
            map.panTo({
                lat: geocode[0],
                lng: geocode[1]
            })
        }
    }

    const printStatement = () => {
        console.log("center changed!")
    }

    const [placeToConfirm, setPlaceToConfirm] = useState(null);

    /**
    * @param  placeObj - see data structures.
    */
    const addPlaceToConfirm = (placeObj) => {
        clearPlaceToConfirm();
        setPlaceToConfirm(placeObj);
        updateMapCenter(placeObj.geocode);
    }
    const clearPlaceToConfirm = () => {
        setPlaceToConfirm(null);
    }
    useEffect(() => {
        if (isLoaded) {
            // cmon()

        }
    }, [])
    const cmon = async () => {
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
        const markerTest = new AdvancedMarkerElement({
            map: map,
            position: { lat: 51, lng: -0.8 },
            title: "testing",
            // zIndex: 2,
        })
    }


    const gMap = useMemo(() => {
        return (<GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={london.geocode}
            zoom={9}
            onLoad={(map) => setMap(map)}
            onUnmount={() => onUnmount()}
            options={{ fullscreenControl: false, mapTypeControl: false }}
        >

        </GoogleMap>)
    }, [])
    return (
        <>
            <p onClick={() => testFunc()} className="">Test Page</p>

            <div className="flx-r w-100 five">
                <div className="flx-c flx-1">
                    <DragDropContext onDragEnd={onDragEnd}>

                        {state.dayOrder.map((dayNum) => {
                            const day = state.days[dayNum]
                            const places = day.placeIds.map(placeId => state.places[placeId]);

                            return <Suspense fallback={<div>Loading...</div>}>
                                <Column key={day.id} day={day} places={places} />
                            </Suspense>
                        })}
                    </DragDropContext>

                </div>

                <div onMouseUp={() => updateCurrentMapCenter()} id='gMap' className="mapBox">
                    {/* <GoogleSearch isLoaded={isLoaded} mapBounds={mapViewBounds} addPlaceToConfirm={addPlaceToConfirm} /> */}
                    <PlaceToConfirmCard placeToConfirm={placeToConfirm} clearPlaceToConfirm={() => setPlaceToConfirm(null)} />
                    <GoogleMapBox mapCenter={london.geocode} />
                </div>

                {/* <APIProvider apiKey='AIzaSyD6EGcKbaI-RJrDL0EWbLGOd0XxXAmSxyo'>
                    <div id='gMap' ref={mapRef} className='mapBox'>
                        <Map
                            defaultZoom={9}
                            defaultCenter={{ lat: 51.50735, lng: -0.12776 }}
                            mapId="53a011bc3302095"
                            mapTypeControl={false}
                            fullscreenControl={false}
                        />
                        <AdvancedMarker position={london.geocode} onClick={() => setMarkerInfoOpen(!markerInfoOpen)}>
                            <Pin background="red" />
                        </AdvancedMarker>
                        {markerInfoOpen &&
                            <InfoWindow position={london.geocode} anchor="" pixelOffset={[0, -25]} onCloseClick={() => setMarkerInfoOpen(false)}>
                                <p className='m-0'>Center of London</p>
                            </InfoWindow>
                        }
                    </div>
                </APIProvider> */}
            </div>














            {/* <MapContainer center={parisGeo} zoom={13}>
                <TileLayer
                    attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url={tile2}
                />
                <MarkerClusterGroup chunkedLoading >
                    {markers.map(marker => (
                        <Marker position={marker.geocode} icon={pinIcon}>
                            <Popup>{marker.popUp}</Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>
            </MapContainer> */}

            {/* <div className="sign-up-loading flx-c">
                <Loading />
            </div> */}



            {/* Old side panel that we are no longer using */}
            {/* <div id='dayPanel' className="itinerary-c1">
          <div onClick={() => showDayPanel()} id='showDayPanelBtn' className="arrowToOpen">
            <span className="material-symbols-outlined o-50 xx-large onHover-fade position-fixed z-1 top-128">
              keyboard_double_arrow_right
            </span>
          </div>

          <div className="dayPanelContainer">
            <div id='dayPanelBody' className="it-column1 white-bg position-fixed ml-3 flx-c align-c o-none d-none">
              <img src="https://i.imgur.com/46q31Cx.png" alt="" className="vertical-logo" />

              <div onClick={() => hideDayPanel()} className="arrowToClose my-2">
                <span className="material-symbols-outlined o-50 xx-large right onHover-fade">
                  keyboard_double_arrow_left
                </span>
              </div>

              <button className="btn-secondaryflex">
                <span className="material-symbols-outlined btn-symbol v-align x-large white-text">
                  expand_more
                </span>
                <p className="inline v-align white-text">Itinerary &nbsp;&nbsp;</p>
              </button>

              <div className="it-datesPanel w-100 flx-c mt-3">

                {tripState.day_order.map((dayNum, id) => {
                  const day = tripState.days[dayNum]

                  return <div key={id} onClick={() => scrollToSection(id)} className="day-date flx-r onHover-fade pointer">
                    <p className="it-dateBlock my-1 flx-1 gray-text">{day.day_short}</p>
                    <p className="it-dayBlock my-1 flx-1 gray-text">{day.date_short}</p>
                  </div>
                })}
              </div>
            </div>
          </div>

        </div> */}
            {/* End Old side panel that we are no longer using */}



            <div className="empty-6"></div>
            <div className="empty-6"></div>
            <div className="empty-6"></div>

        </>
    )
}
