import React, { useContext, useEffect, useRef, useState } from 'react'
import { auth } from '../firebase';
import { DataContext } from '../Context/DataProvider';
import { Loading } from '../components/Loading';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyTrips = ({ currentTrip, setCurrentTrip, clearCurrentTrip }) => {
    const { user } = useContext(DataContext);
    const { pageOpen, setPageOpen } = useContext(DataContext);
    const [userTrips, setUserTrips] = useState(null)
    const [isLoadingTrips, setIsLoadingTrips] = useState(false);
    const navigate = useNavigate()
    const resetPageOpen = () => {
        setPageOpen(null)
    }
    useEffect(() => {
        setPageOpen('my trips')
        return resetPageOpen;
    }, [])

    // get user trips code
    const getUserTripsData = async () => {
        const response = await axios.get(`https://routewise-backend.onrender.com/places/trips/${auth.currentUser.uid}`)
        return response.status === 200 ? response.data : "error - it didn't work"
    }
    const loadUserTripsData = async () => {
        if (auth.currentUser) {
            setIsLoadingTrips(true)
            let data = await getUserTripsData()
            setUserTrips(data)
            console.log(data)
            setIsLoadingTrips(false)
        }
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



    
    

    const viewTrip = async (trip, navigation) => {
        clearCurrentTrip()
        setIsLoading(true)
        if (navigation === "itinerary") {
            let url = `https://routewise-backend.onrender.com/places/trip/${trip.trip_id}`
            const response = await axios.get(url)
            // const response = await axios.get("https://routewise-backend.onrender.com/places/trip/254")
            return response.status === 200 ? loadItinerary(response.data, trip) : alert('Something went wrong. Please try again.')
        } else if (navigation === "places") {
            let url = `https://routewise-backend.onrender.com/places/get-places/${trip.trip_id}`
            const response = await axios.get(url)
            // const response = await axios.get("https://routewise-backend.onrender.com/places/trip/254")
            return response.status === 200 ? loadPlaces(response.data, trip) : alert('Something went wrong. Please try again.')
        }
    }
    const loadPlaces = (place_list, trip) => {
        console.log(place_list)
        let placesList = []
        for (let i = 0; i < place_list.length; i++) {
            let place = {
                category: place_list[i].category,
                favorite: place_list[i].favorite,
                placeId: place_list[i].geoapify_placeId,
                id: place_list[i].local_id,
                place_id: place_list[i].place_id, // db
                // tripId : place_list[i].trip_id,
                long: place_list[i].long,
                lat: place_list[i].lat,
                geocode: [place_list[i].lat, place_list[i].long],
                imgURL: place_list[i].place_img,
                info: place_list[i].info,
                placeName: place_list[i].place_name,
                address: place_list[i].place_address,
            }
            placesList.push(place)
        }
        console.log(placesList)
        let currentTripCopy = {
            tripID: trip.trip_id,
            tripName: trip.trip_name,
            city: trip.dest_city,
            country: trip.dest_country,
            country_2letter: trip.dest_country_2letter,
            startDate: trip.start_date,
            endDate: trip.end_date,
            tripDuration: trip.duration,
            geocode: [trip.dest_lat, trip.dest_long],
            imgUrl: trip.dest_img,
            places: placesList,
            itinerary: null,
        }
        // console.log(response.data)
        // console.log(currentTripCopy)
        setIsLoading(false)
        setCurrentTrip(currentTripCopy)
        navigate('/add-places')
    }
    const loadItinerary = (itinerary, trip) => {
        let currentTripCopy = {
            tripID: trip.trip_id,
            tripName: trip.trip_name,
            city: trip.dest_city,
            country: trip.dest_country,
            country_2letter: trip.dest_country_2letter,
            startDate: trip.start_date,
            endDate: trip.end_date,
            tripDuration: trip.duration,
            geocode: [trip.dest_lat, trip.dest_long],
            imgUrl: trip.dest_img,
            places: Object.values(itinerary.places),
            itinerary: itinerary,
        }
        // console.log(response.data)
        // console.log(currentTripCopy)
        setIsLoading(false)
        setCurrentTrip(currentTripCopy)
        navigate('/itinerary')
    }
    const [isLoading, setIsLoading] = useState(false);
    const stopLoadingScreen = () => {
        setIsLoading(false)
    }




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
                    {userTrips ? userTrips.map((trip, index) => {

                        return <div className="userTrip-card">
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
                            <div onClick={() => viewTrip(trip, trip.is_itinerary ? 'itinerary' : 'places')} className="card-imgFrame">
                                <img src={trip.dest_img} alt="" className="card-img pointer" />
                            </div>
                            <div className="card-footer">
                                <div className="card-info">
                                    <div className="align-all-items">
                                        <div className="card-title">{trip.trip_name}</div>
                                    </div>
                                    <div className="card-days">

                                        <p className="m-0 gray-text">{datishortRange(trip.start_date, trip.end_date)}</p>
                                        <p className="m-0 gray-text small">&nbsp; &#9679; &nbsp;</p>
                                        <p className="m-0 gray-text">{trip.duration} {trip.duration > 1 ? "days" : "day"}</p>

                                    </div>
                                </div>
                                <div className="card-icons">
                                    <span onClick={() => toggleUserTripPopup(index)} className="material-symbols-outlined position-right gray-text pointer">more_vert</span>
                                    <img src="https://i.imgur.com/6VMWZni.png" alt="" className="img-18-square" />
                                </div>
                            </div>
                        </div>
                    }) : null}

                    {/* {userTrips ? userTrips.map((trip, index) => {


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
                    }) : null} */}


                </div>


            </div>

            <div className="empty-6"></div>
        </div>
    )
}
export default MyTrips;