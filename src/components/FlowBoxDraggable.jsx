import React, { useContext, useEffect, useRef, useState } from 'react'
import { PlaceCardDraggable } from './PlaceCardDraggable';
import { Link } from 'react-router-dom';
import { SearchPlace } from './SearchPlace';
// import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import './flowbox.scoped.css'
import { DataContext } from '../Context/DataProvider';
import Dropdown from './Dropdown/Dropdown';
import GoogleSearch from './GoogleSearch';


const FlowBoxDraggable = ({ id, tripState, setTripState, mapCenter, addSearchOpen, addSearchClose, toggleFlow, day, places, removePlace, addPlaceFromFlowBox, country, addPlaceToConfirm, itineraryToSaved, isSavedPlace, openConfirmationModal, confirmationModalRef }) => {
    const { gIcon, generateTripMapBounds } = useContext(DataContext);
    const [dayTitle, setDayTitle] = useState('');


    const updateDayTitle = (e) => {
        setDayTitle(e.target.value);
    }

    useEffect(() => {
        let editOverlay = document.getElementById(`editOverlay-${id}`)
        let dayTitleInput = document.getElementById(`dayTitleInput-${id}`)
        if (dayTitle.length > 0) {
            editOverlay.classList.add('d-none')
        } else if (dayTitle.length === 0) {
            editOverlay.classList.remove('d-none')
        }
        if (dayTitle.length >= 32) {
            dayTitleInput.value = dayTitle.slice(0, 32)
            // console.log(">31")
        }
    }, [dayTitle])


    // detect narrow window to render # of places in flowbox
    const [narrowWindow, setNarrowWindow] = useState(false);
    const [placeOrPlaces, setPlaceOrPlaces] = useState(`${day.placeIds.length === 1 ? "place" : "places"}`)
    useEffect(() => {
        window.addEventListener('resize', updateNarrowWindow,)
    }, [])

    useEffect(() => {
        // console.log('placeIds length =', day.placeIds.length)
        if (day.placeIds.length === 1) {
            setPlaceOrPlaces("place")
        } else {
            setPlaceOrPlaces("places")
        }
    }, [day.placeIds])

    const updateNarrowWindow = () => {
        // console.log(window.innerWidth)
        if (window.innerWidth < 1024) {
            setNarrowWindow(true)
        } else if (window.innerWidth >= 1024) {
            setNarrowWindow(false)
        }
    }

    const numberToBgColor = (num) => {
        let lastDigit = num.slice(-1)
        if (lastDigit === "1") {
            return "#FF4856" // RED
        }
        if (lastDigit === "2") {
            return "#FFD84E" // YELLOW
        }
        if (lastDigit === "3") {
            return "#2185F9" // BLUE
        }
        if (lastDigit === "4") {
            return "#4CDE08" // GREEN
        }
        if (lastDigit === "5") {
            return "#FFA80A" // ORANGE
        }
        if (lastDigit === "6") {
            return "#FF52FF" // PINK
        }
        if (lastDigit === "7") {
            return "#14DCDC" // LIGHT BLUE
        }
        if (lastDigit === "8") {
            return "#CECDFE" // PURPLE
        }
        if (lastDigit === "9") {
            return "#A9743A" // BROWN
        }
        if (lastDigit === "0") {
            return "#42F2A8" // LIGHT GREEN
        }
        return null;
    }

    // [dropdown code]
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        if (dropdownOpen) {
            setDropdownOpen(false);
            if (pointerRef.current) {
                pointerRef.current.classList.remove('pressed');
            };
        } else if (!dropdownOpen) {
            setDropdownOpen(true);
            if (pointerRef.current) {
                pointerRef.current.classList.add('pressed');
            };
        };
    };
    const dropDownItems = {
        header: null, // title/closeBtn
        options: [
            {
                itemName: "Swap entire day",
                gIconPrompt: "sync_alt",
                clickFunction: "daySelection:swap days",
            },
            {
                itemName: "Move all to different day",
                gIconPrompt: "subdirectory_arrow_right",
                clickFunction: "daySelection:move places",
            }
        ]
    };
    const pointerRef = useRef(null);

    const [searchBoxOpen, setSearchBoxOpen] = useState(false);
    const openSearchBox = (id) => {
        const addPlacesBtn = document.getElementById(`addPlacesBtn`)
        const searchBar = document.getElementById(`searchBar-`)
        const addPlaceExpand = document.getElementById(`addPlace-expand`)
        addPlacesBtn.classList.add('d-none')
        searchBar.classList.remove('d-none')
        addPlaceExpand.style.height = '70px'
        wait(100).then(() => {
            searchBar.classList.remove('o-none')
        })
    }
    const closeSearchBox = (id) => {
        const addPlacesBtn = document.getElementById(`addPlacesBtn-${id}`)
        const searchBar = document.getElementById(`searchBar-${id}`)
        const addPlaceExpand = document.getElementById(`addPlace-expand-${id}`)
        searchBar.classList.add('o-none')
        wait(100).then(() => {
            addPlacesBtn.classList.remove('d-none')
            searchBar.classList.add('d-none')
            addPlaceExpand.style.height = '30px'
        })
    };

    const addPlaceFromFlowBoxFlow = (place) => {
        addPlaceFromFlowBox(day.id, place);
    };

    return (
        <div id={`flowBox-${id}`} className="flow-box" style={{ borderLeftColor: numberToBgColor(day.id) }}>

            <div className="flow-header">
                <div onClick={() => toggleFlow(id)} className="content">
                    <p className="page-subheading-bold smallertext975-respond m-0">
                        <span id={`expandArrow-${id}`} className={`${gIcon} expandArrow`}>
                            expand_more
                        </span>
                        {day.date_converted.split(' ')[0]}
                        <span className="smalltext-respond">&nbsp;{day.date_converted.split(' ')[1]} {day.date_converted.split(' ')[2]}</span>
                    </p>
                    <div className="options">
                        <p id={`placeCount-${id}`} className="placeCount o-none">{narrowWindow ? "(" + day.placeIds.length + ")" : day.placeIds.length + " " + placeOrPlaces}</p>
                        <div className="more_vert-container">
                            <span ref={pointerRef} onClick={(e) => { e.stopPropagation(); toggleDropdown() }} className={`${gIcon} o-50 more_vert`}>more_vert</span>
                        </div>
                        <Dropdown
                            open={dropdownOpen}
                            itemsList={dropDownItems}
                            day={day}
                            tripState={tripState}
                            setTripState={setTripState}
                            renderLocation={"itinerary"}
                            pointerRef={pointerRef}
                            openConfirmationModal={openConfirmationModal}
                            confirmationModalRef={confirmationModalRef}
                            onClose={() => setDropdownOpen(false)}
                        />
                    </div>
                </div>
                <div className="addTitle-input position-relative">
                    <input onChange={(e) => updateDayTitle(e)} id={`dayTitleInput-${id}`} type="text" className="input-dayTitle ml-5" placeholder='Add subheading' />
                    <label id={`editOverlay-${id}`} htmlFor={`dayTitleInput-${id}`}><span className={`${gIcon} o-20 edit-overlay small`}>
                        edit
                    </span></label>
                </div>
            </div>
            <div id={`flow-${id}`} className="flowBody-collapsible pr-2">
                <div id={`flowBody-${id}`} className="flowBody ml-5-respon w-100">
                    <Droppable droppableId={day.id}>
                        {(droppableProvided, droppableSnaphot) => (

                            <div className="droppableSpace" ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
                                {places.map((place, i) => (
                                    <Draggable key={place.id} draggableId={`${place.id}`} index={i} >
                                        {(draggableProvided, draggableSnapshot) => (
                                            <div ref={draggableProvided.innerRef} {...draggableProvided.draggableProps} {...draggableProvided.dragHandleProps} key={i}>
                                                <PlaceCardDraggable id={i} place={place} removePlace={removePlace} dayId={day.id} draggableSnapshot={draggableSnapshot} addPlaceToConfirm={addPlaceToConfirm} itineraryToSaved={itineraryToSaved} isSavedPlace={isSavedPlace} />
                                            </div>
                                        )}

                                    </Draggable>
                                ))}
                                {droppableProvided.placeholder}
                            </div>

                        )}
                    </Droppable>


                    <div id={`addPlace-expand-${id}`} className="addPlace-expand m-auto mt-2">
                        <Link onClick={() => addSearchOpen(id)} id={`addPlacesBtn-${id}`} className='onHover-fadelite'>
                            <p className="right-text m-0 purple-text"><span className="material-symbols-outlined v-bott mx-2 purple-text">
                                add
                            </span>
                                Add Places</p>
                        </Link>
                        <div id={`searchBar-${id}`} className="searchPlace-container w-100 o-none d-none td-4 flx-r align-c">
                            <div className="flx-c">
                                <span onClick={() => addSearchClose(id)} className="material-symbols-outlined mt-1 px-1 pointer onHover-fade o-50">
                                    close
                                </span>
                            </div>
                            {/* <SearchPlace id={id} country={country} addPlaceFromFlowBox={addPlaceFromFlowBox} dayNum={day.id} /> */}
                            <div className="google-search-container position-relative" style={{ width: "100%", height: "70px", paddingLeft: "34px" }}>

                                <GoogleSearch
                                    addPlaceFunction={addPlaceToConfirm}
                                    tripMapBounds={generateTripMapBounds(mapCenter)}
                                    searchLimit={4}
                                    isLoaded={true}
                                    styleProfile={"flowbox"}
                                />

                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}
export default FlowBoxDraggable;
