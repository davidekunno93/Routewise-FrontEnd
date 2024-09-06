import React, { useContext, useEffect, useState } from 'react'
import DaySelected from '../DaySelected'
import { DataContext } from '../../Context/DataProvider';
import './dayselection.scoped.css'
import ConfirmationModal from '../ConfirmationModal';
import axios from 'axios';

export const DaySelection = ({ open, tripState, setTripState, sourceDay, addPlace, place, titleText, action, renderLocation, openConfirmationModal, onClose, closeTree }) => {
    if (!open) return null;
    const { gIcon } = useContext(DataContext);

    // where might this component be?

    // action = swap days
    // action = move all places
    // -- on itinerary (swap day/move all places) - x addPlace (switched to swap/move places), placeToConfirm

    // action = add to itinerary from map
    // -- on map - x day, + daySelected anim

    // action = add from suggested
    // action = add from saved
    // -- in suggested places/saved places (add to day) - x day, 

    // locationForDaySelection = itinerary, map, saved/suggested

    const { numberToBgColor } = useContext(DataContext);
    const [daySelectedOpen, setDaySelectedOpen] = useState(false);
    const [dateToConfirm, setDateToConfirm] = useState(null);

    const [lightbulbDays, setLightbulbDays] = useState([]);
    const getLightbulbDays = () => {
        let days = {}
        for (let dayNum of tripState.day_order) {
            let day = tripState.days[dayNum]
            let dist = Math.sqrt((place.lat - day.centroid[0]) ** 2 + (place.long - day.centroid[1]) ** 2)
            days[dayNum] = dist
        }
        let min_dist = 99999999999
        let dist_list = Object.values(days)
        for (let i = 0; i < dist_list.length; i++) {
            if (min_dist > parseFloat(dist_list[i])) {
                min_dist = dist_list[i]
            }
        }
        let lightbulb_days = []
        for (let [dayNum, dist] of Object.entries(days)) {
            if (dist === min_dist) {
                lightbulb_days.push(dayNum)
            }
        }
        setLightbulbDays(lightbulb_days)
    }
    useEffect(() => {
        if (place) {
            getLightbulbDays();
        }
    }, [])

    const updatePlaceInDatabase = (db_place_id, db_day_id) => {
        let url = `https://routewise-backend.onrender.com/itinerary/update-place/${db_place_id}`
        const response = axios.patch(url, { "day_id": db_day_id, "in_itinerary": db_day_id ? true : false }, {
            headers: { "Content-Type": "application/json" }
        }).then((response) => {
            console.log(response.data)
        }).catch((error) => {
            console.log(error)
        })
    };
    const itineraryFunctions = {
        swapDays: function (sourceDayNum, destinationDayNum) {
            // send updates to Kate Backend
            if (tripState.trip_id) {
                let url = `https://routewise-backend.onrender.com/itinerary/move-day-places/${tripState.trip_id}`
                let data = {
                    sourceDayId: tripState.days[sourceDayNum].db_id,
                    destDayId: tripState.days[destinationDayNum].db_id,
                    swap: true,
                };
                console.log(data)
                const response = axios.patch(url, data)
                    .then((response) => {
                        console.log(response);
                        let tripStateCopy = { ...tripState };
                        [tripStateCopy.days[sourceDayNum].placeIds, tripStateCopy.days[destinationDayNum].placeIds] = [tripStateCopy.days[destinationDayNum].placeIds, tripStateCopy.days[sourceDayNum].placeIds];
                        setTripState(tripStateCopy);
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            } else {
                let tripStateCopy = { ...tripState };
                [tripStateCopy.days[sourceDayNum].placeIds, tripStateCopy.days[destinationDayNum].placeIds] = [tripStateCopy.days[destinationDayNum].placeIds, tripStateCopy.days[sourceDayNum].placeIds];
                setTripState(tripStateCopy);
            };

        },
        moveAllPlaces: function (sourceDayNum, destinationDayNum) {
            // send updates to Kate Backend
            if (tripState.trip_id) {
                let url = `https://routewise-backend.onrender.com/itinerary/move-day-places/${tripState.trip_id}`
                let data = {
                    sourceDayId: tripState.days[sourceDayNum].db_id,
                    destDayId: tripState.days[destinationDayNum].db_id,
                    swap: false,
                };
                console.log(data)
                const response = axios.patch(url, data)
                    .then((response) => {
                        let tripStateCopy = { ...tripState };
                        tripStateCopy.days[destinationDayNum].placeIds = tripStateCopy.days[destinationDayNum].placeIds.concat(tripStateCopy.days[sourceDayNum].placeIds);
                        tripStateCopy.days[sourceDayNum].placeIds = [];
                        setTripState(tripStateCopy);
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            } else {
                let tripStateCopy = { ...tripState };
                tripStateCopy.days[destinationDayNum].placeIds = tripStateCopy.days[destinationDayNum].placeIds.concat(tripStateCopy.days[sourceDayNum].placeIds);
                tripStateCopy.days[sourceDayNum].placeIds = [];
                setTripState(tripStateCopy);
            }
        },
        savedToItinerary: function (dayNum, place) {
            // remove id and from saved_places placesIds
            let tripStateCopy = { ...tripState };
            let placeId = place.id;
            // let place = tripStateCopy.places[placeId];
            let indexOfPlaceId = tripStateCopy.saved_places.placesIds.indexOf(placeId);
            let indexOfAddress = tripStateCopy.saved_places.placesIds.indexOf(place.address);
            tripStateCopy.saved_places.placesIds.splice(indexOfPlaceId, 1);
            tripStateCopy.saved_places.addresses.splice(indexOfAddress, 1);


            // places[placeId].day_id = days[dayNum].day_id
            tripStateCopy.places[placeId].day_id = tripStateCopy.days[dayNum].day_id;

            // add placeId to days[dayNum].placeIds
            tripStateCopy.days[dayNum].placeIds.push(placeId);

            // tell Kate - send to database ($test$)
            if (tripStateCopy.trip_id) {
                updatePlaceInDatabase(place.place_id, place.day_id);
            };

            // set state
            setTripState(tripStateCopy);
        },
    }
    
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(true);
    const [confirmationModalProps, setConfirmationModalProps] = useState({
        confirmAction: null,
        questionText: null,
        descText: null,
        confirmOption: null,
        rejectOption: null
    })
    const [standBy, setStandby] = useState(false);
    const handleConfirmationModal = (action, params) => {
        if (action === "swap days") {
            setStandby(true);
            setConfirmationModalProps({
                confirmAction: itineraryFunctions.swapDays,
                confirmActionParams: params,
                questionText: "Are you sure you want to swap the itinerary days?",
                descText: null,
                confirmOption: "Yes, swap days",
                rejectOption: "Cancel",
                sideEffectFunction: closeTree,
            })
        } else if (action === "move places") {
            setStandby(true);
            setConfirmationModalProps({
                confirmAction: itineraryFunctions.moveAllPlaces,
                confirmActionParams: params,
                questionText: "Are you sure you want to move all places to a new day?",
                descText: null,
                confirmOption: "Yes, move places",
                rejectOption: "Cancel",
                sideEffectFunction: closeTree,
            })
        }
    }
    useEffect(() => {
        if (standBy) {
            openConfirmationModal(confirmationModalProps)
            setStandby(false);
        };
        // console.log(addPlace);
    }, [confirmationModalProps]);




    return (
        <>
            <div id='daySelection' className={`daySelection ${renderLocation}`}>
                <div className="day-selector">
                    {/* <DaySelected open={daySelectedOpen} placeToConfirm={placeToConfirm} dateToConfirm={dateToConfirm} /> */}

                    <span onClick={() => { onClose() }} className={`closeBtn2 ${gIcon} position-absolute x-large color-gains`}>
                        close
                    </span>
                    <div className="titleDiv">
                        <p className="title">{titleText}</p>
                    </div>
                    {renderLocation === "itinerary" &&
                        <>
                            {action === "add place" &&
                                <>
                                    {tripState.day_order.map((dayNum, i) => {
                                        const day = tripState.days[dayNum];
                                        return <div
                                            key={i}
                                            id='day-option'
                                            onClick={() => addPlace(dayNum, place)}
                                            className="day-option"
                                        >
                                            <div className="day-color" style={{ backgroundColor: numberToBgColor(dayNum.split("-")[1]) }}></div>
                                            <div className="text">
                                                <p className="m-0 ws-nowrap"><strong>Day {dayNum.split("-")[1]}:</strong> <span className='gray-text'>{day.day_short}, {day.date_converted.split(",").slice(1)}</span> </p>
                                            </div>
                                            <div className={`day-lightBulb flx ${lightbulbDays && lightbulbDays.includes(dayNum) ? null : "o-none"}`}>
                                                <div className="tooltip"><strong>RouteWise recommended:</strong> Most optimal date!</div>
                                                <img src="https://i.imgur.com/T3ZIaA5.png" alt="" className="img" />
                                            </div>
                                        </div>
                                    })}
                                </>
                            }
                            {action === "add place from saved" &&
                                <>
                                    {tripState.day_order.map((dayNum, i) => {
                                        const day = tripState.days[dayNum];
                                        return <div
                                            key={i}
                                            id='day-option'
                                            onClick={() => itineraryFunctions.savedToItinerary(dayNum, place)}
                                            className="day-option"
                                        >
                                            <div className="day-color" style={{ backgroundColor: numberToBgColor(dayNum.split("-")[1]) }}></div>
                                            <div className="text">
                                                <p className="m-0 ws-nowrap"><strong>Day {dayNum.split("-")[1]}:</strong> <span className='gray-text'>{day.day_short}, {day.date_converted.split(",").slice(1)}</span> </p>
                                            </div>
                                            <div className={`day-lightBulb flx ${lightbulbDays && lightbulbDays.includes(dayNum) ? null : "o-none"}`}>
                                                <div className="tooltip"><strong>RouteWise recommended:</strong> Most optimal date!</div>
                                                <img src="https://i.imgur.com/T3ZIaA5.png" alt="" className="img" />
                                            </div>
                                        </div>
                                    })}
                                </>
                            }
                            {(action === "swap days" || action === "move places") &&
                                <>
                                    {tripState.day_order.map((dayNum, i) => {
                                        const day = tripState.days[dayNum];
                                        let isSameDay = sourceDay.id === dayNum;
                                        return <div
                                            key={i}
                                            id='day-option'
                                            onClick={() => { !isSameDay && handleConfirmationModal(action, [sourceDay.id, `day-${i + 1}`]) }}
                                            className={`day-option ${isSameDay && "disabled"}`}
                                        >
                                            <div className="day-color" style={{ backgroundColor: sourceDay.id === dayNum ? "#808080" : numberToBgColor(dayNum.split("-")[1]) }}></div>
                                            <div className="text">
                                                <p className="m-0 mr-4"><strong>Day {dayNum.split("-")[1]}:</strong> <span className='gray-text'>{day.day_short}, {day.date_converted.split(",").slice(1)}</span> </p>
                                            </div>
                                            {action === "move places" &&
                                                <div className={`day-lightBulb flx ${lightbulbDays && lightbulbDays.includes(dayNum) ? null : "o-none"}`}>
                                                    <div className="tooltip"><strong>RouteWise recommended:</strong> Most optimal date!</div>
                                                    <img src="https://i.imgur.com/T3ZIaA5.png" alt="" className="img" />
                                                </div>
                                            }
                                        </div>
                                    })}
                                </>
                            }
                        </>
                    }
                    {renderLocation === "map" &&
                        <>
                            {tripState.day_order.map((dayNum, i) => {
                                const day = tripState.days[dayNum]
                                return <div id='day-option' onClick={() => { addPlace(`day-${i + 1}`), setDateToConfirm(day.day_short + ", " + day.date_short) }} className={`day-option ${sourceDay.id === dayNum && "disabled"}`}>
                                    <div className="day-color" style={{ backgroundColor: sourceDay.id === dayNum ? "#808080" : numberToBgColor(dayNum.split("-")[1]) }}></div>
                                    <div className="text">
                                        <p className="m-0 mr-4"><strong>Day {dayNum.split("-")[1]}:</strong> <span className='gray-text'>{day.day_short}, {day.date_converted.split(",").slice(1)}</span> </p>
                                    </div>
                                    <div className={`day-lightBulb flx ${lightbulbDays && lightbulbDays.includes(dayNum) ? null : "o-none"}`}>
                                        <div className="tooltip"><strong>RouteWise recommended:</strong> Most optimal date!</div>
                                        <img src="https://i.imgur.com/T3ZIaA5.png" alt="" className="img" />
                                    </div>
                                </div>
                            })}
                        </>
                    }


                </div>
            </div>
        </>
    )
}
