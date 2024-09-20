import './featuredtripcard.scoped.css'

const FeaturedTripCard = ({ trip }) => {
    return (
        <div className="featuredTrip-card2">
            <div className="imgDiv">
                <img src={trip.imgUrl} alt={trip.title} />
            </div>
            <div className="caption">
                <p className="title">{trip.title}</p>
                <p className="info">{trip.duration === 1 ? `${trip.duration} day` : `${trip.duration} days`} &bull; {trip.numberOfPlaces} places</p>
            </div>
        </div>
    )
}
export default FeaturedTripCard;