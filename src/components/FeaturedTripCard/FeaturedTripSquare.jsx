
import { useContext } from 'react'
import './featuredtripsquare.scoped.css'
import { DataContext } from '../../Context/DataProvider'

const FeaturedTripSquare = ({ trip, index, loadItinerary }) => {
    // example trip = { destination: "Paris", summary: "City of love!", numberOfDays: 4, numberOfPlaces: 10, imgUrl: "https://i.imgur.com/NIID4oP.jpg", flagImgUrl: "https://i.imgur.com/NIID4oP.jpg" }
    const { mobileModeNarrow } = useContext(DataContext);

    return (
        <div onClick={() => loadItinerary(trip.trip)} className={`featuredTrip-card ${mobileModeNarrow && "mobile"}`} style={{ marginLeft: index === 0 ? "0px" : "" }}>
            <div className="imgDiv"><img src={trip.imgUrl} alt="" className="img" /></div>
            <div className="caption">
                <div className="titleDiv">
                    <div className="imgDiv">
                        <img src={trip.flagImgUrl} alt="" className="country-flag" />
                    </div>
                    <p className="destination">{trip.destination}</p>
                </div>
                <p className="summary">{trip.summary}</p>
                <div className="details">
                    <p className="detail">Trip Duration: <span className="purple-text">{trip.numberOfDays}</span></p>
                    <p className="detail">Number of places: <span className="purple-text">{trip.numberOfPlaces}</span></p>
                </div>
            </div>
        </div>
    )
}

export default FeaturedTripSquare