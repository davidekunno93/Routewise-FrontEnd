import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Fade } from 'react-awesome-reveal';
import format from 'date-fns/format';
import { DateRange } from 'react-date-range';
import { LoadingScreen } from './LoadingScreen';
import { LoadingModal } from './LoadingModal';
import LoadOnTop from './LoadOnTop';
import ItineraryUpdatedModal from './ItineraryUpdatedModal';
import { DataContext } from '../Context/DataProvider';


const EditTripModal = ({ open, trip, loadItinerary, loadUserTripsData, onClose }) => {
    if (!open) return null
    const { currentTrip, timeFunctions } = useContext(DataContext);
    const { mobileMode, mobileModeNarrow } = useContext(DataContext);

    // calendar code
    const [calendarOpen, setCalendarOpen] = useState(false);
    const refCalendar = useRef(null)
    const hideOnClickOutsideCalendar = (e) => {
        if (refCalendar.current && !refCalendar.current.contains(e.target)) {
            setCalendarOpen(false)
        }
    }
    const [range, setRange] = useState([
        {
            startDate: trip ? new Date(timeFunctions.datiundash(trip.start_date)) : null,
            endDate: trip ? new Date(timeFunctions.datiundash(trip.end_date)) : null,
            key: 'selection'
        }
    ])
    useEffect(() => {
        // console.log(trip.start_date)
        // console.log(datidash(timeFunctions.datiundash(trip.start_date)))
        // console.log(new Date(trip.start_date))
        // console.log(new Date(timeFunctions.datiundash(trip.start_date)))
        window.addEventListener('click', hideOnClickOutsideCalendar, true)
    }, [])




    const [newTripImg, setNewTripImg] = useState(trip ? trip.dest_img : null)
    const [newTripName, setNewTripName] = useState(trip ? trip.trip_name : null)
    const [newStartDate, setNewStartDate] = useState(trip ? trip.start_date : null)
    const [newEndDate, setNewEndDate] = useState(trip ? trip.end_date : null)
    useEffect(() => {
        setNewStartDate(timeFunctions.datinormal(range[0].startDate))
        setNewEndDate(timeFunctions.datinormal(range[0].endDate))
    }, [range])

    const loadTripName = () => {
        let tripNameInput = document.getElementById('tripNameInput')
        tripNameInput.value = trip ? trip.trip_name : null
    }

    useEffect(() => {
        loadTripName()
    }, [])
    const updateTripName = (e) => {
        setNewTripName(e.target.value)
    }

    const tripUpdate = {
        tripName: function (new_name, trip_id) {
            // returns success/failed
            let url = `https://routewise-backend.onrender.com/places/update-trip/${trip_id}`
            let data = { 
                tripName: new_name,
                startDate: null,
                endDate: null,
             }
            const response = axios.patch(url, data, {
                headers: { "Content-Type": "application/json" }
            }).then((response) => {
                console.log(response.data)
                currentTrip.tripName = new_name
                return "success"
            }).catch((error) => {
                console.log(error)
                // console.log("error caught")
                return "failed"
            })
        },
        tripDates: function(new_start_date, new_end_date, trip_id) {
            // returns success/failed/itinerary updated
            let url = `https://routewise-backend.onrender.com/places/update-trip/${trip_id}`
            let data = { 
                tripName: null,
                startDate: new_start_date,
                endDate: new_end_date,
             }
             const response = axios.patch(url, data, {
                headers: { "Content-Type": "application/json" }
            }).then((response) => {
                console.log(response.data)
                let newItinerary = typeof response.data === "object"
                // let newItinerary = "days" in response.data ? true : false; // days in response data indicates data is an itinerary
                if (newItinerary) {
                    console.log('itinerary updated')
                    // update currentTrip itinerary w/ response.data
                    // setUpdatedItinerary(response.data)
                    // setItineraryUpdatedModalOpen(true)
                    return "itinerary updated"
                } else {
                    return "success"
                }
            }).catch((error) => {
                console.log(error)
                // console.log("error caught")
                return "failed"
            })
        }
    }
    // send to backend database code
    const sendUpdatedTrip = () => {
        let sendData = {
            tripName: null,
            startDate: null,
            endDate: null
        }
        console.log(trip.trip_name)
        // compare new tripname to old one, if different un-nullify tripName in sendData
        if (trip.trip_name !== newTripName) {
            sendData.tripName = newTripName
        }
        // compare new start date to old one, if different un-nullify startDate & endDate in sendData
        if (timeFunctions.datiundash(trip.start_date) !== newStartDate) {
            // console.log(trip.start_date)
            sendData.startDate = newStartDate
            sendData.endDate = newEndDate
        }
        // compare new end date to old one, if different un-nullify startDate & endDate in sendData
        if (timeFunctions.datiundash(trip.end_date) !== newEndDate) {
            // console.log(trip.end_date)
            sendData.startDate = newStartDate
            sendData.endDate = newEndDate
        }
        if (!sendData.tripName && !sendData.startDate && !sendData.endDate) {
            console.log("no changes")
        } else if (!sendData.startDate) {
            console.log("New Trip Name Only")
        } else if (!sendData.tripName) {
            console.log("New Trip Dates Only")
        } else {
            console.log("Trip Name and Trip Dates changed")
        }
        console.log(sendData)
        if (sendData.tripName || sendData.startDate) {
            updateInDB(sendData)
        } else {
            // onClose()
        }
    }
    const updateInDB = (sendData) => {
        setIsLoading(true)
        let url = `https://routewise-backend.onrender.com/places/update-trip/${trip.trip_id}`
        let data = sendData
        const response = axios.patch(url, data, {
            headers: { "Content-Type": "application/json" }
        }).then((response) => {
            console.log(response.data)
            setIsLoading(false)
            if (loadUserTripsData) {
                loadUserTripsData()
            }
            // response object to say if itinerary was updated - if so, show link allowing user to navigate to iti
            if (response.data.days) {
                console.log('itinerary updated')
                console.log(response.data)
                setUpdatedItinerary(response.data)
                // setItineraryUpdatedModalOpen(true)
            } else {
                onClose()
            }
        }).catch((error) => {
            setIsLoading(false)
            // console.log(error)
            console.log("error caught")
            alert("Something went wrong. Please Try again later.")
        })
    }

    const [isLoading, setIsLoading] = useState(false);
    const [editTripOverlayOpen, setEditTripOverlayOpen] = useState(false);
    // need navigate to itinerary function 

    const [itineraryUpdatedModalOpen, setItineraryUpdatedModalOpen] = useState(false);
    const [updatedItinerary, setUpdatedItinerary] = useState({});
    useEffect(() => {
        if (updatedItinerary.days) {
            setItineraryUpdatedModalOpen(true);
        }
    }, [updatedItinerary])

    return (
        <div className="overlay-placeholder">
            <Fade duration={200} triggerOnce>
                <div className="overlay flx">
                    <div className={`edit-trip-modal ${mobileMode && "mobile"}`}>
                        <ItineraryUpdatedModal open={itineraryUpdatedModalOpen} trip={trip} updatedItinerary={updatedItinerary} loadItinerary={loadItinerary} onClose={() => { setItineraryUpdatedModalOpen(false); onClose() }} />
                        <LoadOnTop open={isLoading} full={true} borderRadius={8} />
                        <div className={`editTripOverlay ${editTripOverlayOpen ? null : "hidden-o"}`}>
                            <div className="go-to-itinerary-modal">
                                <p className="m-0 x-large center-text">Itinerary updated!</p>
                                <p className="m-0 center-text">Would you like to view your new itinerary?</p>
                                <div className="flx-r just-ce gap-4">
                                    <button className="btn-primaryflex">Go to itinerary</button>
                                    <button className="btn-outlineflex">Close</button>
                                </div>
                            </div>
                        </div>
                        <div onClick={() => onClose()} className="closeBtn">
                            <span className="material-symbols-outlined">close</span>
                        </div>
                        <div className="page-subsubheading center-text dark-text">Edit your trip to {trip ? trip.dest_city : "*city*"}</div>

                        <img src={`${trip ? trip.dest_img : null}`} alt="" className="edit-trip-modal-img my-3" />

                        <p className="m-0 bold600">Trip Name</p>
                        <input onChange={(e) => updateTripName(e)} id='tripNameInput' type="text" className="input-model2" />

                        <p className="m-0 bold600 mt-2">Dates</p>
                        <div ref={refCalendar} className="calendar-component">
                            <div onClick={() => setCalendarOpen(calendarOpen => !calendarOpen)} className="calendarInput pointer">
                                <div className="startDateInput flx-1">
                                    <span className="material-symbols-outlined purple-text">date_range</span>
                                    <p className="m-0 black-text small-375">{range[0].startDate ? timeFunctions.datify(format(range[0].startDate, "MM/dd/yyyy")) : "Start Date"}</p>
                                </div>
                                <hr className='h-40' />
                                <div className="endDateInput flx-1">
                                    <span className="material-symbols-outlined purple-text">date_range</span>
                                    <p className="m-0 black-text small-375">{range[0].startDate ? timeFunctions.datify(format(range[0].endDate, "MM/dd/yyyy")) : "End Date"}</p>
                                </div>
                            </div>
                            <div>
                                {calendarOpen &&
                                    <DateRange

                                        onChange={item => setRange([item.selection])}
                                        editableDateInputs={true}
                                        moveRangeOnFirstSelection={false}
                                        ranges={range}
                                        months={1}
                                        direction='vertical'
                                        className='calendarElement-editTrip'
                                    />
                                }
                            </div>
                        </div>

                        <div className="flx-r just-ce position-bottom">
                            <button onClick={() => sendUpdatedTrip()} className="btn-primaryflex">Save changes</button>
                        </div>

                    </div>

                </div>
            </Fade>
        </div>
    )
}
export default EditTripModal;