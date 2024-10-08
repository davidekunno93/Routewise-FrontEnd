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
import axios from 'axios';


const FlowBoxDraggable = ({ id, tripState, setTripState, mapCenter, addSearchOpen, addSearchClose, toggleFlow, day, places, removePlace, addPlaceFromFlowBox, addPlaceToConfirm, itineraryToSaved, isSavedPlace, openConfirmationModal, confirmationModalRef }) => {
    const { gIcon, generateTripMapBounds, numberToBgColor } = useContext(DataContext);



    // detect narrow window to render # of places in flowbox
    const [narrowWindow, setNarrowWindow] = useState(false);
    useEffect(() => {
        window.addEventListener('resize', updateNarrowWindow)
        return () => window.removeEventListener('resize', updateNarrowWindow)
    }, []);


    const updateNarrowWindow = () => {
        // console.log(window.innerWidth)
        if (window.innerWidth < 1024) {
            setNarrowWindow(true)
        } else if (window.innerWidth >= 1024) {
            setNarrowWindow(false)
        };
    };

    // [day name updates]
    const dayNameInputRef = useRef(null);
    const [dayNameControls, setDayNameControls] = useState({
        dayNum: day.id,
        db_id: day.db_id,
        previousText: day.dayName ?? "",
        text: day.dayName ?? "",
        isUpdating: false,
        onStandby: false,
    });
    useEffect(() => {
        console.log(dayNameControls)
    }, [dayNameControls])
    const dayNameFunctions = {
        startEdit: function () {
            setDayNameControls({ ...dayNameControls, isUpdating: true, onStandby: true });
        },
        endEdit: function () {
            setDayNameControls({ ...dayNameControls, isUpdating: false });
        },
        updateText: function (e) {
            setDayNameControls({ ...dayNameControls, text: e.target.value });
        },
        checkToSendData: function () {
            console.log("checking to send data...")
            if (!dayNameControls.isUpdating && dayNameControls.onStandby) {
                if (dayNameControls.text !== dayNameControls.previousText) {
                    console.log("send day name data", {
                        db_id: dayNameControls.db_id,
                        dayName: dayNameControls.text,
                    })
                    // handle send data
                    dayNameFunctions.sendData();
                } else {
                    console.log("no need to send day name data");
                }
            }
        },
        sendData: async function () {
            // send data to backend
            let dispo_local = "http://localhost:5000"
            let dispo_hosted = "https://routewise-backend.onrender.com"
            let url = `${dispo_local}/places/update-day-name/${day.db_id}`
            let data = { dayName: dayNameControls.text }
            const response = await axios.patch(url, data, {
                headers: { "Content-Type": "application/json" }
            }).then((response) => {
                console.log("day name update was successful")
                // if successful update previous text to current text
                if (response.status === 200) {
                    setDayNameControls({ ...dayNameControls, previousText: dayNameControls.text });
                } else {
                    console.log(response)
                    alert("Your day name was not able to be updated. Please try again.");
                    setDayNameControls({ ...dayNameControls, text: dayNameControls.previousText });
                };
            }).catch((error) => {
                console.log("day name update was unsuccessful")
                console.log(error)
                // if unsuccessful revert current text back to previous text
                alert("Your day name was not able to be updated. Please try again.");
                setDayNameControls({ ...dayNameControls, text: dayNameControls.previousText });
            })
        },
    };
    useEffect(() => {
        dayNameFunctions.checkToSendData();
    }, [dayNameControls.isUpdating]);


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
                        <p id={`placeCount-${id}`} className="placeCount o-none">{narrowWindow ? "(" + day.placeIds.length + ")" : day.placeIds.length + " " + (day.placeIds.length === 1 ? "place" : "places") }</p>
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
                    <input ref={dayNameInputRef}
                        onFocus={() => dayNameFunctions.startEdit()}
                        onBlur={() => dayNameFunctions.endEdit()}
                        onChange={dayNameFunctions.updateText}
                        value={dayNameControls.text}
                        id={`dayTitleInput-${id}`}
                        type="text"
                        className="input-dayTitle ml-5"
                        placeholder='Add subheading...'
                    />
                    {/* <label id={`editOverlay-${id}`} htmlFor={`dayTitleInput-${id}`}>
                        {!dayNameControls.isUpdating && !dayNameControls.text &&
                            <span className={`${gIcon} o-20 edit-overlay small`}>
                                edit
                            </span>
                        }
                    </label> */}
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
