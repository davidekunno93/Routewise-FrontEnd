import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export const NameTripModal = ({ open, tripData, changeCity, onClose }) => {
    // send Kate Data
    if (!open) return null
    const [cityImg, setCityImg] = useState(null)

    useEffect(() => {
        loadCityImg()
        console.log(tripData)
    }, [])

    const getCityImg = async () => {
        const response = await axios.get(`https://api.unsplash.com/search/photos/?client_id=S_tkroS3HrDo_0BTx8QtZYvW0IYo0IKh3xNSVrXoDxo&query=${tripData.cityName}-${tripData.state}-landmarks`)
        return response.status === 200 ? response.data : "error" 
        // .then((response) => {
        //         console.log(response.results[0].urls.regular)
        //         setCityImg(response.results[0].urls.regular)
        //     })
    }
    const loadCityImg = async () => {
        const data = await getCityImg()
        console.log(data)
        console.log(data.results[0].urls.regular)
        setCityImg(data.results[0].urls.regular)
    }


    const sendData = () => {

    }

    return (
        <>
            <div className="overlay"></div>
            <div className="modal">
                <div className="nameTrip-box">
                    <span onClick={onClose} class="closeBtn material-symbols-outlined position-absolute xx-large color-gains">
                        close
                    </span>
                    <div className="xx-large bold700 font-jakarta w-80 my-3">
                        Name your trip to <br /><span className="purple-text">{tripData.cityName}, {tripData.country}</span>
                    <p className="m-0 small bold500 o-70">Wrong <strong>{tripData.cityName}</strong>? Click <Link onClick={changeCity}>here</Link> to find the right one</p>
                    </div>
                    <input className="input-model" placeholder='Enter a name for your trip' required />
                    {/* <img src="https://i.imgur.com/sCT1BpF.jpg" alt="" className="tripModal-img my-3" /> */}
                    {cityImg &&
                        <img src={cityImg} alt="" className="tripModal-img my-3" />
                    }
                    <button className="btn-primaryflex">Start Planning!</button>
                    <Link className='font-jakarta mt-1'>Skip</Link>
                </div>
            </div>
        </>
    )
}
