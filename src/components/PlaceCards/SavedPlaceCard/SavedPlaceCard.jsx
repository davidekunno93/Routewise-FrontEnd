import React, { useContext, useRef, useState } from 'react'
import OpeningHoursMap from '../../OpeningHoursMap';
import { DataContext } from '../../../Context/DataProvider';
import Dropdown from '../../Dropdown/Dropdown';

const SavedPlaceCard = ({ index, place, placeFunctions, tripState, setTripState }) => {
    const { textFunctions, gIcon } = useContext(DataContext);

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const itemsList = {
        options: [
            {
                itemName: "View on map",
                gIconPrompt: "location_on",
                clickFunction: {
                    function: placeFunctions.addPlaceToConfirm,
                    params: [place]
                },
            },
            {
                itemName: "Move to itinerary",
                gIconPrompt: "map",
                clickFunction: "daySelection:add place from saved",
            },
            {
                itemName: "Remove from list",
                gIconPrompt: "delete",
                clickFunction: {
                    function: placeFunctions.removeFromSavedPlaces,
                    params: [place.id]
                },
                textColor: "red",
            },
        ]
    }

    const pointerRef = useRef(null);

    return (
        <div key={index} className="placeCard2 flx-r position-relative">
            <div className="placeCard-img-div flx-3">
                <img onClick={() => placeFunctions.addPlaceToConfirm(place)} className="placeCard2-img" src={place.imgURL} />
            </div>
            <div className="placeCard-body flx-5">
                <p className="body-title ">{place.placeName}</p>
                <p className="body-category">{place.category ? textFunctions.capitalize(place.category) : "No category"}</p>
                {place.info &&
                    <>
                        {place.info.includes(":") ?
                            <OpeningHoursMap
                                idTree={`saved-${index}`}
                                placeInfo={place.info}
                            />
                            :
                            <p className="body-info">{place.info}</p>
                        }
                    </>
                }
                {place.summary ?
                    <p className="body-address">{place.summary}</p>
                    :
                    <p className="body-address">{place.address}</p>
                }
            </div>
            <div className="placeCard-options py-2h flx-c just-sb align-c">
                <Dropdown
                    open={dropdownOpen}
                    itemsList={itemsList}
                    place={place}
                    addPlace={placeFunctions.addPlace}
                    tripState={tripState}
                    setTripState={setTripState}
                    renderLocation={"itinerary"}
                    pointerRef={pointerRef}
                    onClose={() => setDropdownOpen(false)}
                />


                <span ref={pointerRef} id={`optionBtn-${index}`} onClick={() => setDropdownOpen(!dropdownOpen)} className={`${gIcon} gray-text more_vert ${dropdownOpen && "pressed"}`}>
                    more_vert
                </span>
                <span onClick={() => placeFunctions.removeFromSavedPlaces(place.id)} className={`${gIcon} gray-text showOnHover-50 pointer`}>
                    delete
                </span>

            </div>
        </div>
    )
}
export default SavedPlaceCard;