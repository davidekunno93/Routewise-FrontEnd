import React, { useContext, useState } from 'react'
import { DataContext } from '../Context/DataProvider';
import './placecards.scoped.css'

const OpeningHoursMap = ({ openingHoursObject }) => {
    const { textFunctions } = useContext(DataContext);
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
    };
    return (
        <div className="days">
                {Object.entries(openingHoursObject).map((day, id) => {
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
    )
}
export default OpeningHoursMap;