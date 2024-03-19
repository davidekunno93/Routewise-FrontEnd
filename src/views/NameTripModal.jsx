import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import { Loading } from '../components/Loading'
import { LoadingModal } from '../components/LoadingModal'
import { LoadingBox } from '../components/LoadingBox'
import { set } from 'date-fns'

export const NameTripModal = ({ open, tripData, currentTrip, setCurrentTrip, clearCurrentTrip, changeCity, onClose }) => {
    // send Kate Data
    if (!open) return null
    const [cityImg, setCityImg] = useState(null)
    const [tripName, setTripName] = useState('')
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    useEffect(() => {
        loadCityImg()
        console.log(tripData)
    }, [])

    const getCityImg = () => {
        const response = axios.get(`https://api.unsplash.com/search/photos/?client_id=S_tkroS3HrDo_0BTx8QtZYvW0IYo0IKh3xNSVrXoDxo&query=${tripData.cityName}-${tripData.state}-landmarks`)
            .then((response) => {
                console.log('.then method working')
                console.log(response)
                return response.data
            })
        // return response.status === 200 ? response.data : "error"
    }
    const getCityImg2 = async () => {
        const response = await axios.get(`https://api.unsplash.com/search/photos/?client_id=yNFxfJ53K-d6aJhns-ssAkH1Xc5jMDUPLw3ATqWBn3M&query=${tripData.cityName}-${tripData.state}-landmarks`)
        return response.status === 200 ? response.data : "error"
    }
    const loadCityImg = async () => {
        let apiKey_1 = "S_tkroS3HrDo_0BTx8QtZYvW0IYo0IKh3xNSVrXoDxo"
        let apiKey_2 = "yNFxfJ53K-d6aJhns-ssAkH1Xc5jMDUPLw3ATqWBn3M"
        const response = axios.get(`https://api.unsplash.com/search/photos/?client_id=${apiKey_1}&query=${tripData.cityName}-${tripData.state}-landmarks`)
            .then((response) => {
                let data = response.data
                console.log('.then method working')
                setCityImg(data.results[0].urls.regular)
            })
            .catch((error) => {
                const response2 = axios.get(`https://api.unsplash.com/search/photos/?client_id=${apiKey_2}&query=${tripData.cityName}-${tripData.state}-landmarks`)
                    .then((response2) => {
                        let data = response2.data
                        console.log('.then method working')
                        setCityImg(data.results[0].urls.regular)
                    })
            })


        // const data = await getCityImg()
        // console.log("unsplash error:", data)
        // console.log(data.results[0].urls.regular)
        // setCityImg(data.results[0].urls.regular)
    }

    const typer = () => {
        console.log(typeof tripData.startDate)
    }

    // const updateCurrentTrip = () => {
    //     let currentTripCopy = { ...currentTrip }
    //     currentTripCopy.tripName = tripName
    //     currentTripCopy.city = tripData.cityName
    //     currentTripCopy.country = tripData.country
    //     currentTripCopy.country_2letter = tripData.country_2letter
    //     currentTripCopy.geocode = tripData.geocode
    //     currentTripCopy.imgUrl = cityImg
    //     setCurrentTrip(currentTripCopy)
    // }

    const startPlanningWithName = async () => {
        let tripNameInput = document.getElementById('tripNameInput')
        if (tripName.length > 0) {
            // updateCurrentTrip()
            sendData()
            // navigate('/add-places')
        } else {
            tripNameInput.classList.add('entry-error')
        }
    }

    const startPlanningWithoutName = async () => {
        // updateCurrentTrip()
        sendData()
        // navigate('/add-places')
    }

    const sendData = async () => {
        setLoading(true)
        let tripDataCopy = { ...tripData }
        tripDataCopy['tripName'] = tripName,
            tripDataCopy['destinationImg'] = cityImg
        let data = {
            uid: auth.currentUser.uid,
            tripData: tripDataCopy
        }
        console.log(data)
        const response = await axios.post("https://routewise-backend.onrender.com/places/trip", JSON.stringify(data), {
            headers: { "Content-Type": "application/json" }
        })
            // return response.status === 200 ? response.data : "error"
            .then((response) => processData(response))
            .catch((error) => {
                console.log(error)
                setLoading(false);
                alert("Something went wrong. Please try again")
            })
    }

    const processData = async (response) => {
        // **old code - we went thru processData first to await the sent data before continuing but errors were not handled as desired
        // setLoading(true)
        // let data = await sendData()
        let data = response.data
        // console.log(data)
        // if (data === 'error') {
        //     setLoading(false)
        //     alert('Something went wrong. Please try again later')
        // } else {
        let currentTripCopy = { ...currentTrip }
        currentTripCopy.tripID = data.trip_id
        currentTripCopy.tripName = tripName
        currentTripCopy.city = tripData.cityName
        currentTripCopy.country = tripData.country
        currentTripCopy.country_2letter = tripData.country_2letter
        currentTripCopy.startDate = data.start_date
        // currentTripCopy.startDate = data.start_date.split(' ').slice(1, 4).join(' ')
        currentTripCopy.endDate = data.end_date
        // currentTripCopy.endDate = data.end_date.split(' ').slice(1, 4).join(' ')
        currentTripCopy.tripDuration = data.duration
        currentTripCopy.geocode = tripData.geocode
        currentTripCopy.imgUrl = cityImg
        // reset itinerary in case it has already been generated from previous trip by user
        currentTripCopy.itinerary = null
        currentTripCopy.places = []
        setCurrentTrip(currentTripCopy)
        setLoading(false)
        navigate('/add-places')

        // }
    }



    const updateTripName = (e) => {
        setTripName(e.target.value)
    }

    return (
        <>
            <div className="overlay"></div>
            <div className="modal">
                <div className="nameTrip-box">

                    <LoadingBox width={450} height={500} open={loading} />
                    <span onClick={onClose} class="closeBtn material-symbols-outlined position-absolute xx-large color-gains">
                        close
                    </span>
                    <div className="page-subheading-bold font-jakarta my-3 dark-text">
                        Name your trip to <br /><span className="purple-text">{tripData.cityName}, {tripData.country}</span>
                        <p className="m-0 small bold500 o-70">Wrong <strong>{tripData.cityName}</strong>? Click <Link onClick={changeCity}>here</Link> to find the right one</p>
                    </div>
                    <input onChange={(e) => updateTripName(e)} id='tripNameInput' className="input-model" placeholder='Enter a name for your trip' required />
                    {/* <img src="https://i.imgur.com/sCT1BpF.jpg" alt="" className="tripModal-img my-3" /> */}
                    {cityImg &&
                        <img src={cityImg} alt="" className="tripModal-img my-3" />
                    }
                    <button onClick={() => startPlanningWithName()} className="btn-primaryflex">Start Planning!</button>
                    <Link onClick={() => startPlanningWithoutName()} className='font-jakarta mt-1'>Skip</Link>
                </div>
            </div>
        </>
    )
}
