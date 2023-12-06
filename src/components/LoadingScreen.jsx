import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'




export const LoadingScreen = ({ open, loadObject, loadingMessage, waitTime, currentTrip, onClose }) => {
    if (!open) return null

    const navigate = useNavigate()

    function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    useEffect(() => {
        if (loadObject === 'itinerary') {
            waitForItinerary()
        }
    })
    const waitForItinerary = () => {
        if (currentTrip.itinerary) {
            if (currentTrip.itinerary.day_order.length > 0) {
                console.log(currentTrip)
                console.log(currentTrip.itinerary)
                onClose()
                navigate('/itinerary')
            }
        }
    }

    useEffect(() => {
        let loading = document.getElementById('loading')
        if (!waitTime) {
            waitTime = 20000
        }
        wait(waitTime).then(() => {
            if (loadingMessage) {
                loading.innerText = loadingMessage
            } else {
                loading.innerText = "This may take up to a minute..."
            }
        })
    }, [])

    return (
        <>
            <div className="overlay-white flx position-relative">

                <div id='loading' className='position-absolute abs-center purple-text mt-8 center-text'>Loading...</div>

                <img src='https://i.imgur.com/DQ1Otmw.png' className="bird-load-logo m-auto position-absolute abs-center" />

                <div className="loading m-auto"></div>

            </div>
        </>
    )
}
