import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import { Loading } from '../components/Loading'
import { LoadingModal } from '../components/LoadingModal'
import { LoadingBox } from '../components/LoadingBox'
import { set } from 'date-fns'
import { DataContext } from '../Context/DataProvider'

export const NameTripModal = ({ open, tripData, currentTrip, setCurrentTrip, clearCurrentTrip, changeCity, onClose }) => {
    // send Kate Data
    if (!open) return null
    const { mobileMode, mobileModeNarrow } = useContext(DataContext);
    const [cityImg, setCityImg] = useState(null)
    const [tripName, setTripName] = useState('')
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    // date functions
    const datinormal = (systemDate) => {
        let day = systemDate.getDate().toString().length === 1 ? "0" + systemDate.getDate() : systemDate.getDate()
        let month = systemDate.getMonth().toString().length + 1 === 1 ? "0" + (systemDate.getMonth() + 1) : systemDate.getMonth() + 1
        if (month.toString().length === 1) {
            month = "0" + month
        }
        // console.log(month)
        let fullYear = systemDate.getFullYear()
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
    // from slash or normal date to dash date
    const datidash = (mmddyyyy) => {
        let year = mmddyyyy.slice(6)
        let month = mmddyyyy.slice(0, 2)
        let day = mmddyyyy.slice(3, 5)
        return year + "-" + month + "-" + day
    }
    // from dash date to slash or normal date
    const datiundash = (dashDate) => {
        let fullyear = dashDate.slice(0, 4)
        let month = dashDate.slice(5, 7)
        let day = dashDate.slice(8)
        return month + "/" + day + "/" + fullyear
    }
    useEffect(() => {
        loadCityImg()
        console.log(tripData)
    }, [])

    const getCityImg = () => {
        const response = axios.get(`https://api.unsplash.com/search/photos/?client_id=S_tkroS3HrDo_0BTx8QtZYvW0IYo0IKh3xNSVrXoDxo&query=${tripData.cityName}-${tripData.state}-landmarks`)
            .then((response) => {
                // console.log('.then method working')
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
            if (auth.currentUser) {
                sendData()
            } else {
                processData()
            }
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
        tripDataCopy['tripName'] = tripName
        tripDataCopy['destinationImg'] = cityImg
        if (auth.currentUser) {

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
    }

    const processData = async (response) => {
        // **old code - we went thru processData first to await the sent data before continuing but errors were not handled as desired
        let data = response ? response.data : null
        let currentTripCopy = { ...currentTrip }
        const one_day = 1000 * 60 * 60 * 24;
        currentTripCopy.tripID = data ? data.trip_id : null
        currentTripCopy.tripName = tripName
        currentTripCopy.city = tripData.cityName
        currentTripCopy.country = tripData.country
        currentTripCopy.country_2letter = tripData.country_2letter
        // for some reason data.start_date and data.end_date return new Date formatted dates
        currentTripCopy.startDate = datidash(tripData.startDate)
        // currentTripCopy.startDate = data.start_date.split(' ').slice(1, 4).join(' ')
        currentTripCopy.endDate = datidash(tripData.endDate)
        // currentTripCopy.endDate = data.end_date.split(' ').slice(1, 4).join(' ')
        currentTripCopy.tripDuration = data ? data.duration : Math.ceil((new Date(tripData.endDate).getTime() - new Date(tripData.startDate).getTime()) / (one_day)) + 1
        currentTripCopy.geocode = tripData.geocode
        currentTripCopy.imgUrl = cityImg
        // reset itinerary in case it has already been generated from previous trip by user
        currentTripCopy.itinerary = null
        currentTripCopy.places = []
        console.log(currentTripCopy)
        setCurrentTrip(currentTripCopy)
        setLoading(false)
        navigate('/add-places')
    }



    const updateTripName = (e) => {
        setTripName(e.target.value)
    }

    return (
        <>
            <div className="overlay"></div>
            <div className={`nameTrip-modal ${mobileModeNarrow && "mobileNarrow"}`}>
                <LoadingBox width={450} height={500} open={loading} />
                <span onClick={onClose} class="closeBtn material-symbols-outlined position-absolute xx-large color-gains">
                    close
                </span>
                
                    <div className="my-3">
                        <p className={`m-0 ${mobileModeNarrow ? "page-subsubheading-bold" : "page-subheading-bold"}`}>Name your trip to <br /><span className="purple-text">{tripData.cityName}, {tripData.country}</span></p>
                        <p className="m-0 small bold500 o-70">Wrong <strong>{tripData.cityName}</strong>? Click <Link onClick={changeCity}>here</Link> to find the right one</p>
                    </div>

                    <div className="input-and-image">
                    <input onChange={(e) => updateTripName(e)} id='tripNameInput' className={`input-model ${mobileModeNarrow && "mobile"}`} placeholder='Enter a name for your trip' autoComplete='off' required />
                    {/* <img src="https://i.imgur.com/sCT1BpF.jpg" alt="" className="tripModal-img my-3" /> */}
                    {cityImg &&
                        <img src={cityImg} alt="" className={`tripModal-img ${mobileModeNarrow && "mobile"} my-3`} />
                    }
                    </div>

                    <button onClick={() => startPlanningWithName()} className="btn-primaryflex">Start Planning!</button>
                    {/* <Link onClick={() => startPlanningWithoutName()} className='font-jakarta mt-1'>Skip</Link> */}
                </div>
            
        </>
    )
}
