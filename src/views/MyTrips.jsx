import React, { useContext, useEffect, useRef, useState } from 'react'
import { auth } from '../firebase';
import { DataContext } from '../Context/DataProvider';
import { Loading } from '../components/Loading';
import axios from 'axios';

const MyTrips = () => {
    const { user } = useContext(DataContext);
    const [userTrips, setUserTrips] = useState(null)
    const [isLoadingTrips, setIsLoadingTrips] = useState(false);
    // get user trips code
    const getUserTripsData = async () => {
        const response = await axios.get(`https://routewise-backend.onrender.com/places/trips/${auth.currentUser.uid}`)
        return response.status === 200 ? response.data : "error - it didn't work"
    }
    const loadUserTripsData = async () => {
        setIsLoadingTrips(true)
        let data = await getUserTripsData()
        setUserTrips(data)
        console.log(data)
        setIsLoadingTrips(false)
    }
    useEffect(() => {
        if (auth.currentUser) {
            loadUserTripsData()
            // console.log(auth.currentUser.uid)
        }
        console.log(userTrips)
    }, [])
    useEffect(() => {
        loadUserTripsData()
    }, [user])


    // user trip box code
    const toggleUserTripPopup = (index) => {
        let popUp = document.getElementById(`userTrip-popUp-${index}`)
        popUp.classList.toggle('d-none')
    }

    const closeUserTripPopup = () => {
        let popUps = document.getElementsByClassName('popUp')
        for (let i = 0; i < popUps.length; i++) {
            popUps[i].classList.add('d-none')
        }
    }
    const hidePopUpOnClickOutside = (e) => {
        if (refPopUp.current && !refPopUp.current.contains(e.target)) {
            closeUserTripPopup()
        }
    }
    const refPopUp = useRef(null);



    // date change code
    const datishort = (date) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const monthNum = date.slice(5, 7)
        const month = months[monthNum - 1]
        let day = date.slice(8)
        if (day[0] === "0") {
            day = day[1]
        }
        return month + " " + day
    }
    const datishortRange = (startDate, endDate) => {
        // const startYear = startDate.slice(0, 5)
        // const endYear = endDate.slice(0, 4)
        const start = datishort(startDate)
        const end = datishort(endDate)
        const startMonth = start.slice(0, 3)
        const endMonth = end.slice(0, 3)
        // console.log(startDate)
        // console.log(start)
        // console.log(endDate)

        if (startMonth === endMonth) {
            return start + " - " + end.slice(4)
        } else {
            return start + " - " + end
        }

    }


    return (
        <div>
            <div className="page-container75 flx-c">
                <p className="m-0 page-subheading-bold mt-6 mb-4h">My Trips</p>

                <div className="trip-options flx-r">
                    <div className="option upcoming">Upcoming Trips</div>
                    <div className="option past">Past Trips</div>
                    <div className="option published">Published Itineraries</div>
                </div>



                {isLoadingTrips &&
                    // <p className='m-0'>Loading...</p>
                    <div className="loadingDiv">
                        <Loading noMascot={true} noText={true} />
                    </div>
                }

                <div className="userTrips flx-r flx-wrap gap-8">
                    <div className="userTrip-card">
                        <img src="https://i.imgur.com/PToTA7p.png" alt="" className="card-img" />
                        <div className="card-footer">
                            <div className="card-info">
                                <div className="align-all-items">
                                    <div className="card-title">Paris 2024</div>
                                </div>
                                <div className="card-days">Paris 2024</div>
                            </div>
                            <div className="card-icons">
                                <span className="material-symbols-outlined position-right gray-text">more_vert</span>
                                <span className="material-symbols-outlined position-right gray-text">lock</span>
                            </div>
                        </div>
                    </div>
                    {userTrips ? userTrips.map((trip, index) => {


                        return <div key={index} className="userTrip-box">
                            <div ref={refPopUp}>
                                <div id={`userTrip-popUp-${index}`} className="popUp d-none">
                                    <div onClick={(() => { openEditTripModal(trip); closeUserTripPopup() })} className="option">
                                        <p className="m-0">Edit trip details</p>
                                        <span className="material-symbols-outlined large mx-1">
                                            edit
                                        </span>
                                    </div>

                                    <div onClick={() => deleteTrip(trip)} className="option">
                                        <p className="m-0">Delete trip</p>
                                        <span className="material-symbols-outlined large mx-1">
                                            delete
                                        </span>
                                    </div>
                                </div>
                                <span onClick={() => toggleUserTripPopup(index)} className="material-symbols-outlined vertIcon">
                                    more_vert
                                </span>
                            </div>
                            <img onClick={() => viewTrip(trip, trip.is_itinerary ? 'itinerary' : 'places')} src={trip.dest_img} alt="" className="destImg pointer" />
                            <div className="box-text-container">
                                <p className="m-0 box-title">{trip.trip_name}</p>
                                <div className="flx-r">
                                    <p className="m-0 gray-text">{datishortRange(trip.start_date, trip.end_date)}</p>
                                    <p className="m-0 gray-text">&nbsp; &#9679; &nbsp;</p>
                                    <p className="m-0 gray-text">{trip.duration} {trip.duration > 1 ? "days" : "day"}</p>
                                </div>
                            </div>
                        </div>
                    }) : null}


                </div>


            </div>

            <div className="empty-6"></div>
        </div>
    )
}
export default MyTrips;