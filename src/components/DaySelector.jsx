import React, { useEffect, useState } from 'react'
import DaySelected from './DaySelected'
import { Fade } from 'react-awesome-reveal';

const DaySelector = ({ open, tripState, daySelectorStateProps, placeToConfirm, dateToConfirm, addPlace, savedToItinerary, onClose }) => {
    if (!open) return null;
    const place = daySelectorStateProps.place;
    const action = daySelectorStateProps.action;
    const sideEffectFuntion = daySelectorStateProps.sideEffectFuntion;
    const sideEffectVariable = daySelectorStateProps.sideEffectVariable;
    // actions - addPlace, itineraryToSaved, savedToItinerary
    const [daySelectedOpen, setDaySelectedOpen] = useState(false);
    const [lightbulbDays, setLightbulbDays] = useState([]);
    useEffect(() => {
        setLightbulbDays(getLightbulbDays(place));
    }, []);
    const getLightbulbDays = (placeObj) => {
        // create object with { dayNum: place distance from centroid}
        // create object with { place distance from centroid: dayNum}
        let dayDistances = {}
        for (let dayNum of tripState.day_order) {
            if (tripState.days[dayNum].placeIds.length > 0) {
                let day = tripState.days[dayNum]
                let dist = Math.sqrt((placeObj.lat - day.centroid[0]) ** 2 + (placeObj.long - day.centroid[1]) ** 2)
                dayDistances[dayNum] = dist
            }
        }
        let min_dist = Math.min(...Object.values(dayDistances));
        // let min_dist = null;
        // let dist_list = Object.values(dayDistances)
        // for (let i = 0; i < dist_list.length; i++) {
        //     if (!min_dist) {
        //         min_dist = dist_list[i]
        //     } else if (min_dist > parseFloat(dist_list[i])) {
        //         min_dist = dist_list[i]
        //     }
        // }
        // console.log("min dist =", min_dist)
        let lightbulb_days = []
        for (let [dayNum, dist] of Object.entries(dayDistances)) {
            if (dist === min_dist) {
                lightbulb_days.push(dayNum)
            }
        }
        // console.log("lightbulb days are = ", lightbulb_days);
        // place["lightbulb_days"] = lightbulb_days;
        // setLightbulbDays(lightbulb_days);
        return lightbulb_days
    }
    return (
        <div className="overlay-placeholder">
            <Fade duration={200} triggerOnce>
                <div className="overlay flx">
                    <div id='daySelection' className="daySelection-modal">
                        <div className="day-selector">
                            {/* <DaySelected open={daySelectedOpen} placeToConfirm={placeToConfirm} dateToConfirm={dateToConfirm} /> */}
                            <span onClick={() => onClose()} className="closeBtn2 material-symbols-outlined position-absolute x-large color-gains">
                                close
                            </span>
                            <div className="titleDiv">
                                <p className="title">Add to</p>
                            </div>
                            {tripState.day_order.map((dayNum, i) => {
                                const day = tripState.days[dayNum]
                                // const lightbulb_days = placeToConfirm ? placeToConfirm.lightbulb_days : []
                                // const lightbulb = lightbulb_days.includes(dayNum) ? true : false
                                return <div id='day-option' onClick={() => { action === "addPlace" && addPlace(dayNum, place); action === "savedToItinerary" && savedToItinerary(dayNum, place.id); sideEffectFuntion && sideEffectFuntion(sideEffectVariable && sideEffectVariable); onClose() }} className="day-option">
                                    {/* <div className={`day-lightBulb flx ${placeToConfirm && placeToConfirm.lightbulb_days.includes(dayNum) ? null : "o-none"} tooltip`}> */}
                                    <div className={`day-lightBulb flx ${lightbulbDays && lightbulbDays.includes(dayNum) ? null : "hidden"} tooltip`}>
                                        <div className="tooltiptext">The lightbulb icon indicates the day that has the closest activities</div>
                                        <span class="material-symbols-outlined m-auto gray-text normal-cursor">
                                            emoji_objects
                                        </span>
                                        {/* <img src="https://i.imgur.com/mplOdwv.png" alt="" className="lightbulb-icon" /> */}
                                    </div>
                                    <div className="text">
                                        <p className="m-0 bold500">{day.date_converted.split(",")[0]}</p>
                                        <p className="m-0 bold500 small gray-text">{day.date_converted.split(",").slice(1)}</p>
                                    </div>
                                </div>
                            })}


                        </div>
                    </div>
                </div>
            </Fade>
        </div>
    )
}
export default DaySelector;