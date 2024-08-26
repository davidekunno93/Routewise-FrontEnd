import React, { useEffect, useRef } from 'react'
import OpeningHoursMap from '../../OpeningHoursMap';
import CategoryAndRating from '../../CategoryAndRating/CategoryAndRating';

const SuggestedPlaceCard = ({ index, place, addPlaceToConfirm, addPlace, placesAddressList, addToBlacklist, blacklist, suggestedPlacesFilter, flashAdded, removePlace }) => {
    let filteredIn = suggestedPlacesFilter ? place.categoryTitle === suggestedPlacesFilter : true;
    let blacklisted = blacklist.includes(place.placeName);
    if (!filteredIn || blacklisted || !place.placeName) return null;

    let added = placesAddressList.includes(place.address);
    const isOverFlown = (el) => {
        // if scrollWidth > clientWidth then return true
        if (el.scrollWidth > el.clientWidth) {
            return true;
        }
        return false;
    };
    const titleRef = useRef(null);

    // useEffect(() => {
    //     console.log(isOverFlown(titleRef.current));
    // }, []);

    return (
        <div key={index} className="placeCard2 position-relative flx-r my-2">
            <div id={`added-${index}`} className="added-overlay abs-center font-jakarta x-large hidden-o">
                <p className="m-0 purple-text">Added!</p>
            </div>
            <div className="placeCard-img-div flx-3">
                <img onClick={() => addPlaceToConfirm(place)} className="placeCard2-img pointer" src={place.imgURL} />
            </div>
            <div className="placeCard-body flx-5">
                <div className={`scroll-over-text ${place.placeName.length && "disabled"}`}>
                    <p ref={titleRef} className="static-text body-title truncated">{place.placeName}</p>
                    <div className="scroller" data-animated="true">
                        <div className="scroller-inner">
                            <p className="scroll-text body-title">{place.placeName}</p>
                            <p className="scroll-text body-title">{place.placeName}</p>
                        </div>
                    </div>
                </div>
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
                    <p className={`body-address truncated-2`}>{place.summary}</p>
                    :
                    <p className={`body-address truncated`}>{place.address}</p>
                }
            </div>
            <div className="placeCard-starOrDelete flx-c just-sb align-c">
                {added ?
                    <div onClick={() => { removePlace(placesAddressList.indexOf(place.address)) }} className="addIcon-filled-green-small flx mx-2 mt-2 pointer">
                        <span className="material-symbols-outlined m-auto mt-h medium white-text">
                            done
                        </span>
                    </div>
                    :
                    <div onClick={() => { addPlace(place); flashAdded(index) }} className="addIcon-medium flx pointer mx-2 mt-2 onHover-fadelite">
                        <span className="material-symbols-outlined m-auto medium purple-text">
                            add
                        </span>
                    </div>}

                <span onClick={() => addToBlacklist(place.placeName)} className="material-symbols-outlined mx-3 my-2 onHover-50 pointer">
                    visibility_off
                </span>
            </div>
        </div>
    )
}
export default SuggestedPlaceCard;