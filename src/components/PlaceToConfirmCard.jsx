import React, { useContext, useEffect, useRef, useState } from 'react'
import { DataContext } from '../Context/DataProvider';
import './placecards.scoped.css'
import ScrollText from './ScrollText';
import { Link } from 'react-router-dom';

const PlaceToConfirmCard = ({ addPlace, removePlace, placeToConfirm, clearPlaceToConfirm, placesAddressList }) => {
    if (!placeToConfirm) return null;
    const { mobileMode, mobileModeNarrow, textFunctions, renderRating } = useContext(DataContext);
    // const [placeToConfirm, setPlaceToConfirm] = useState({
    //     placeName: "this place this place this place",
    //     info: "", // biz hours
    //     address: "5 Russell Gardens, N20 0TR, UK, 5 Russell Gardens, N20 0TR, UK",
    //     imgURL: "https://i.imgur.com/MlFlVkA.png", // photos - getURI
    //     category: "Test place", // ??
    //     lat: 51,
    //     long: -0.8,
    //     geocode: [51, -0.8],
    //     placeId: "place.id",
    //     rating: 2.5 // rating - num.toFixed(1)
    // });
    const simplifyWebsite = (website) => {
        website = website.split("www.")[1];
        return website
    }

    const placeToConfirmRef = useRef(null);
    useEffect(() => {
        // renderRating(4.8)
        if (placeToConfirmRef.current) {
            placeToConfirmRef.current.classList.replace("hide", "show");
        }
    }, [])

    const ptcCardBodyRef = useRef(null);

    const getTodaysHours = (openingHoursArr) => {
        let openingHoursToday = "";
        for (let i = 0; i < openingHoursArr.length; i++) {
            let todayAbbr = new Date().toString().split(" ")[0]; // Mon, Tue, Wed.. etc.
            if (openingHoursArr[i].includes(todayAbbr)) {
                openingHoursToday = openingHoursArr[i];
            }
        }
        return openingHoursToday
    }
    // get the days opening hours

    // opening hours code
    const convertInfoToMap = (openingHoursStr) => {
        if (openingHoursStr.toLowerCase().includes(":")) {

            let openingHoursArr = openingHoursStr.split(", ");
            let result = {}
            // loop thru arr
            for (let i = 0; i < openingHoursArr.length; i++) {
                // let day = openingHoursArr[i].slice(0, 3)
                // get day
                let day = openingHoursArr[i].split(": ")[0]
                // get opning hrs
                let hours = openingHoursArr[i].split(": ")[1]
                // update result object
                result[day] = hours;
            }
            return result;
        } else {
            return openingHoursStr;
        }
    }
    const [openingHoursDayId, setOpeningHoursDayId] = useState(null);
    const hoursTextFunctions = {
        open: function (id) {
            let hoursText = document.getElementById(`hours-text-${id}`);
            if (openingHoursDayId !== null) {
                hoursTextFunctions.close(openingHoursDayId)
            }
            hoursText.style.width = hoursText.scrollWidth.toString() + "px";
            hoursText.style.margin = "0px 4px";
            hoursText.style.opacity = 1;
        },
        close: function (id) {
            let hoursText = document.getElementById(`hours-text-${id}`);
            hoursText.style.width = 0;
            hoursText.style.margin = "0px";
            hoursText.style.opacity = 0.5;
        },
        toggle: function (id) {
            if (openingHoursDayId === id) {
                setOpeningHoursDayId(null);
                hoursTextFunctions.close(id);
            } else {
                setOpeningHoursDayId(id);
                hoursTextFunctions.open(id);
            }
        },
    }


    return (
        <>
            <div ref={placeToConfirmRef} className="placeToConfirmCardDiv position-absolute hide">
                    <span onClick={() => clearPlaceToConfirm()} className={`closeBtn-PTC material-symbols-outlined position-absolute x-large`}>
                        close
                    </span>
                <div className="placeCard-PTC w-97 position-relative flx-r my-2">


                    <div ref={ptcCardBodyRef} className="body flx-2">
                        <div onClick={() => togglePopUp('PTC')} id='popUp-PTC' className="popUp d-none position-absolute">{placeToConfirm.info}</div>
                        <p className="body-title truncated">{textFunctions.capitalize(placeToConfirm.placeName)}</p>
                        <div className="align-all-items">
                            <p className="body-category">{textFunctions.capitalize(placeToConfirm.category.split(',')[0])}</p>
                            {placeToConfirm.rating &&
                                <>
                                    <p className='m-0 x-small mx-1 gray-text'>&bull;</p>
                                    <div className="rating">
                                        <p className='score-text'>{placeToConfirm.rating}</p>
                                        {renderRating(placeToConfirm.rating).map((star, index) => {
                                            let noStar = star === 0;
                                            let fullStar = star === 1;
                                            let halfStar = star === 0.5;
                                            return <img key={index} src={`${fullStar ? "https://i.imgur.com/3eEFOjj.png" : noStar ? "https://i.imgur.com/ZhvvgPZ.png" : "https://i.imgur.com/SWExJbv.png"}`} alt="" className="star-img" />
                                        })}

                                    </div>
                                </>
                            }

                        </div>
                        {/* {placeToConfirm.info &&
                            <p className="body-info truncated">{placeToConfirm.info}</p>
                        } */}
                        <div className="days">

                            {Object.entries(convertInfoToMap(placeToConfirm.info)).map((day, id) => {
                                let dayName = day[0];
                                let dayShort = dayName.slice(0, 2)
                                let openingHours = day[1];
                                return <>
                                    <div key={id} onClick={() => hoursTextFunctions.toggle(id)} className={`day-circle ${id === openingHoursDayId && "selected"}`}>
                                        <p className="m-0 x-small bold700">{textFunctions.capitalize(dayShort)}</p>
                                    </div>
                                    <p id={`hours-text-${id}`} className={`openingHours x-small ${id !== openingHoursDayId && "closed"}`}>{openingHours}</p>
                                </>
                            })}
                        </div>
                        {/* <p onClick={() => togglePopUp('PTC')} className="body-info-PTC pointer mb-1">{placeToConfirm.info}</p> */}
                        {placeToConfirm.summary &&
                            <p className="body-summary truncated-2 m-0">{placeToConfirm.summary}</p>
                        }

                        <div className="body-details">
                            {placeToConfirm.address &&
                                <div className="detail address">
                                    <span className="material-symbols-outlined">location_on</span>
                                    <p className="m-0">{placeToConfirm.address}</p>
                                </div>
                            }
                            {placeToConfirm.website &&
                                <div className="detail website">
                                    <span className="material-symbols-outlined">public</span>
                                    <Link target='_blank' to={placeToConfirm.website}>
                                        <p className="m-0 truncated">{simplifyWebsite(placeToConfirm.website)}</p>
                                    </Link>
                                </div>
                            }
                            {placeToConfirm.phoneNumber &&
                                <div className="detail phoneNumber">
                                    <span className="material-symbols-outlined">call</span>
                                    <p className="m-0">{placeToConfirm.phoneNumber}</p>
                                </div>
                            }

                        </div>
                        <div className="flx position-bottom">
                            <Link target='_blank' to={`https://www.google.com/maps/place/?q=place_id:${placeToConfirm.placeId}`}>
                                <button className="open-in-google-maps">
                                    <img src="https://i.imgur.com/JZj1jWC.png" alt="" className="icon" />
                                    <p>Open in Google Maps</p>
                                </button>
                            </Link>
                        </div>

                    </div>
                    <div className="right-panel flx-1">
                        <div className="imgDiv">
                            {placeToConfirm.imgURL ?
                                <img className="img" src={placeToConfirm.imgURL} />
                                :
                                <p>Loading...</p>
                            }
                        </div>

                        {placesAddressList.includes(placeToConfirm.address) ?
                            <div className="w-100 position-bottom">
                                <div onClick={() => { removePlace(placesAddressList.indexOf(placeToConfirm.address)) }} className="added-place-btn pointer">
                                    {/* <div className={`${mobileModeNarrow ? "addIcon-filled-green-smallest" : "addIcon-filled-green-smaller"} flx mx-2`}>
                                        <span className={`material-symbols-outlined m-auto ${mobileModeNarrow ? "smedium" : "medium"} white-text`}>
                                            done
                                        </span>
                                    </div> */}
                                    <span className={`material-symbols-outlined ${mobileModeNarrow ? "smedium" : "large"} green-text`}>
                                        done
                                    </span>
                                    {/* <div className="flx"> */}
                                    <p className={`green-text ${mobileModeNarrow ? "small" : "small"}`}>Added to places</p>
                                    {/* </div> */}
                                </div>
                            </div>
                            :
                            <div className="w-100 position-bottom">
                                <div onClick={() => addPlace()} className="add-place-btn position-relative">
                                    {/* <div id='placeRemovedText' className={`overlayFull-text position-absolute w-100 h-100 d-non ${justAddedIsAnimating ? null : "hidden-o"}`}>Removed from places</div> */}
                                    <div className="flx pointer">
                                        <span className={`material-symbols-outlined m-auto ${mobileModeNarrow ? "smedium" : "medium"} purple-text`}>
                                            add
                                        </span>
                                    </div>
                                    <p className="purple-text">Add to Places List</p>
                                </div>
                            </div>
                        }
                        

                    </div>
                </div>
            </div>
        </>
    )
}
export default PlaceToConfirmCard;