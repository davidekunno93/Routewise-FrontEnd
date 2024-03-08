import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { Fade } from 'react-awesome-reveal';
import format from 'date-fns/format';
import { DateRange } from 'react-date-range';
import { LoadingScreen } from './LoadingScreen';
import { LoadingModal } from './LoadingModal';
import LoadOnTop from './LoadOnTop';
import ItineraryUpdatedModal from './ItineraryUpdatedModal';


const EditTripModal = ({ open, trip, loadItinerary, loadUserTripsData, onClose }) => {
    if (!open) return null

    // date conversion functions
    const datinormal = (systemDate) => {
        let day = systemDate.getDate().toString().length === 1 ? "0" + systemDate.getDate() : systemDate.getDate()
        let month = systemDate.getMonth().toString().length + 1 === 1 ? "0" + (systemDate.getMonth() + 1) : systemDate.getMonth() + 1
        if (month.toString().length === 1) {
            month = "0" + month
        }
        // console.log(month)
        let fullYear = systemDate.getFullYear()
        // console.log(systemDate)
        // console.log(month+"/"+day+"/"+fullYear)
        return month + "/" + day + "/" + fullYear
    }
    const datify = (normalDate) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        let day = normalDate.slice(3, 5)
        let monthNum = normalDate.slice(0, 2)
        if (monthNum.charAt(0) === "0") {
            monthNum = monthNum[1]
        }
        let fullYear = normalDate.slice(6)
        const month = months[monthNum - 1]
        if (day.charAt(0) === "0") {
            day = day[1]
        }
        let twoYear = fullYear.slice(2)
        return month + " " + day + ", " + twoYear
    }
    const datidash = (mmddyyyy) => {
        let year = mmddyyyy.slice(6)
        let month = mmddyyyy.slice(0, 2)
        let day = mmddyyyy.slice(3, 5)
        return year + "-" + month + "-" + day
    }
    const datiundash = (dashDate) => {
        let fullyear = dashDate.slice(0, 4)
        let month = dashDate.slice(5, 7)
        let day = dashDate.slice(8)
        return month + "/" + day + "/" + fullyear
    }

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
            startDate: trip ? new Date(datiundash(trip.start_date)) : null,
            endDate: trip ? new Date(datiundash(trip.end_date)) : null,
            key: 'selection'
        }
    ])
    useEffect(() => {
        // console.log(trip.start_date)
        // console.log(datidash(datiundash(trip.start_date)))
        // console.log(new Date(trip.start_date))
        // console.log(new Date(datiundash(trip.start_date)))
        window.addEventListener('click', hideOnClickOutsideCalendar, true)
    }, [])




    const [newTripImg, setNewTripImg] = useState(trip ? trip.dest_img : null)
    const [newTripName, setNewTripName] = useState(trip ? trip.trip_name : null)
    const [newStartDate, setNewStartDate] = useState(trip ? trip.start_date : null)
    const [newEndDate, setNewEndDate] = useState(trip ? trip.end_date : null)
    useEffect(() => {
        setNewStartDate(datinormal(range[0].startDate))
        setNewEndDate(datinormal(range[0].endDate))
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

    // send to backend database code
    const sendUpdatedTrip = () => {
        let sendData = {
            tripName: null,
            startDate: null,
            endDate: null
        }
        console.log(trip.trip_name)
        if (trip.trip_name !== newTripName) {
            sendData.tripName = newTripName
        }
        if (datiundash(trip.start_date) !== newStartDate) {
            // console.log(trip.start_date)
            sendData.startDate = newStartDate
            sendData.endDate = newEndDate
        }
        if (datiundash(trip.end_date) !== newEndDate) {
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
            loadUserTripsData()
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
            console.log(error)
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
                    <div className="edit-trip-modal">
                        <ItineraryUpdatedModal open={itineraryUpdatedModalOpen} trip={trip} updatedItinerary={updatedItinerary} loadItinerary={loadItinerary} onClose={() => {setItineraryUpdatedModalOpen(false); onClose()}} />
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
                        <div className="page-subsubheading center-text">Edit your trip to {trip ? trip.dest_city : "*city*"}</div>

                        <img src={`${trip ? trip.dest_img : null}`} alt="" className="edit-trip-modal-img my-3" />

                        <p className="m-0 bold600">Trip Name</p>
                        <input onChange={(e) => updateTripName(e)} id='tripNameInput' type="text" className="input-model2" />

                        <p className="m-0 bold600 mt-2">Dates</p>
                        <div ref={refCalendar} className="calendar-component">
                            <div onClick={() => setCalendarOpen(calendarOpen => !calendarOpen)} className="calendarInput pointer">
                                <div className="startDateInput flx-1">
                                    <span className="material-symbols-outlined purple-text">date_range</span>
                                    <p className="m-0 black-text">{range[0].startDate ? datify(format(range[0].startDate, "MM/dd/yyyy")) : "Start Date"}</p>
                                </div>
                                <hr className='h-40' />
                                <div className="endDateInput flx-1">
                                    <span className="material-symbols-outlined purple-text">date_range</span>
                                    <p className="m-0 black-text">{range[0].startDate ? datify(format(range[0].endDate, "MM/dd/yyyy")) : "End Date"}</p>
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