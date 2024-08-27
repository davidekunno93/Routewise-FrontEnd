import React, { forwardRef, useContext, useEffect, useState } from 'react'
import { DataContext } from '../Context/DataProvider'
import "./placecards.scoped.css"
import ScrollText from './ScrollText';
import CategoryAndRating from './CategoryAndRating/CategoryAndRating';
import OpeningHoursMap from './OpeningHoursMap';

export const PlaceCard = forwardRef(({ index, place, addPlaceToConfirm, addStar, removeStar, removePlace, updateMapCenter }, ref) => {
    // imports
    const { textFunctions, renderRating } = useContext(DataContext);

    // test data
    let testdays = {
        monday: "11:00AM - 7:00PM",
        tuesday: "11:00AM - 7:00PM",
        wednesday: "11:00AM - 7:00PM",
        thursday: "11:00AM - 7:00PM",
        friday: "11:00AM - 7:00PM",
        saturday: "9:00AM - 5:00PM",
        sunday: "9:00 - 1:00PM",
    }

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
            <div className="div-to-create-space-from-fade-for-ref">
                <div id={`placeholderBefore-${index}`} className="placeCard2-placeholder hidden"></div>
                <div ref={ref} key={index} className={`placeCard2 position-relative flx-r o-none gone shown`}>

                    <div className="placeCard-img-div flx-4">
                        <img onClick={() => addPlaceToConfirm(place)} className="placeCard2-img pointer" src={place.imgURL} />
                    </div>
                    <div className="placeCard2-body flx-7">
                        <p className="body-title truncated">{place.placeName}</p>
                        <CategoryAndRating place={place} />
                        {place.info.includes(":") ?
                            <OpeningHoursMap
                                idTree={index}
                                placeInfo={place.info}
                            />
                            :
                            <p className="m-0">{place.info}</p>
                        }
                        {place.summary ?
                            <p className="m-0 body-address truncated-2">{place.summary}</p>
                            :
                            <p className="m-0 body-address truncated-2">{place.address}</p>
                        }
                    </div>
                    <div className="side-options">

                        {place.favorite !== true ?
                            <img onClick={() => addStar(index)} id={`star-empty-${index}`} src="https://i.imgur.com/ZzbFaMA.png" alt="" className="star-empty my-2" />
                            :
                            <img onClick={() => removeStar(index)} id={`star-full-${index}`} src="https://i.imgur.com/M5Yj2Nu.png" alt="" className="star-full my-2" />
                        }
                        <span onClick={() => removePlace(index)} className="material-symbols-outlined mx-3 my-2 onHover-50 pointer">
                            delete
                        </span>
                    </div>
                </div>
            </div>
            <div id={`placeholderAfter-${index}`} className="placeCard2-placeholder hidden"></div>

        </>
    )
})
export default PlaceCard;