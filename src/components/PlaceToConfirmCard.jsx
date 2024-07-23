import React, { useContext, useEffect, useRef, useState } from 'react'
import { DataContext } from '../Context/DataProvider';
import './placecards.scoped.css'

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


    return (
        <>
            <div ref={placeToConfirmRef} className="placeToConfirmCardDiv position-absolute hide">
                <div className="placeCard-PTC w-97 position-relative flx-r my-2">
                    <span onClick={() => clearPlaceToConfirm()} className={`closeBtn-PTC material-symbols-outlined position-absolute ${!mobileMode && "showOnHover"} large color-gains`}>
                        close
                    </span>

                    <div className="placeCard-PTC-imgDiv flx-1">
                        {placeToConfirm.imgURL ?
                            <img className="img" src={placeToConfirm.imgURL} />
                            :
                            <p>Loading...</p>
                        }
                    </div>
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
                        {placeToConfirm.info &&
                            <p className="body-info truncated">{placeToConfirm.info}</p>
                        }
                        {/* <p onClick={() => togglePopUp('PTC')} className="body-info-PTC pointer mb-1">{placeToConfirm.info}</p> */}
                        <p className="body-address truncated-2 m-0">{placeToConfirm.summary ?? placeToConfirm.address}</p>

                        {placesAddressList.includes(placeToConfirm.address) ?
                            <div className="flx-r position-bottom">
                                <div onClick={() => { removePlace(placesAddressList.indexOf(placeToConfirm.address)) }} className="added-place-btn pointer">
                                    {/* <div className={`${mobileModeNarrow ? "addIcon-filled-green-smallest" : "addIcon-filled-green-smaller"} flx mx-2`}>
                                        <span className={`material-symbols-outlined m-auto ${mobileModeNarrow ? "smedium" : "medium"} white-text`}>
                                            done
                                        </span>
                                    </div> */}
                                    <span className={`material-symbols-outlined m-auto ${mobileModeNarrow ? "smedium" : "large"} green-text`}>
                                            done
                                        </span>
                                    <div className="flx">
                                        <p className={`green-text m-auto ${mobileModeNarrow ? "smedium" : "smedium"}`}>Added to places</p>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="flx-r position-bottom">
                                <div onClick={() => addPlace()} className="add-place-btn position-relative">
                                    {/* <div id='placeRemovedText' className={`overlayFull-text position-absolute w-100 h-100 d-non ${justAddedIsAnimating ? null : "hidden-o"}`}>Removed from places</div> */}
                                    <div className="flx pointer">
                                        <span className={`material-symbols-outlined m-auto ${mobileModeNarrow ? "smedium" : "medium"} purple-text`}>
                                            add
                                        </span>
                                    </div>
                                    <div className="flx">
                                        <p className={`purple-text m-auto ${mobileModeNarrow ? "smedium" : "smedium"}`}>Add to places</p>
                                    </div>
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