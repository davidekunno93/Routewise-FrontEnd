import React, { useContext, useEffect, useRef, useState } from 'react'
import { DataContext } from '../Context/DataProvider';
import './placecards.scoped.css'

const PlaceToConfirmCard = ({ addPlace, removePlace, placeToConfirm, clearPlaceToConfirm, placesAddressList }) => {
    if (!placeToConfirm) return null;
    const { mobileMode, mobileModeNarrow, textFunctions } = useContext(DataContext);
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
    const renderRating = (num) => {
        // input = num from 0 to 5, returns array of star fill numbers

        const ratingArr = [];
        for (let i = 0; i < 5; i++) {
            if (num >= 1) {
                ratingArr.push(1);
                num -= 1;
                num = (Math.round(num * 10) / 10); // removes awkward recurring numbers
            } else if (num < 1) {
                if (num >= 0.8) {
                    ratingArr.push(1);
                } else if (num <= 0.2) {
                    ratingArr.push(0);
                } else {
                    ratingArr.push(0.5);
                }
                num = 0;
            }
        }
        return ratingArr;
    }
    const placeToConfirmRef = useRef(null);
    useEffect(() => {
        // renderRating(4.8)
        if (placeToConfirmRef.current) {
            placeToConfirmRef.current.classList.replace("hide", "show");
        }
    }, [])

    const ptcCardBodyRef = useRef(null);
    const addedPlaceAddresses = [];

    return (
        <>
            <div ref={placeToConfirmRef} className="placeToConfirmCardDiv position-absolute hide">
                <div className="placeCard-PTC w-97 position-relative flx-r my-2">
                    <span onClick={() => clearPlaceToConfirm()} className={`closeBtn-PTC material-symbols-outlined position-absolute ${!mobileMode && "showOnHover"} x-large color-gains`}>
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
                        {/* <p onClick={() => togglePopUp('PTC')} className="body-info-PTC pointer mb-1">{placeToConfirm.info}</p> */}
                        <p className="body-category mb-1">{placeToConfirm.category.split(',')[0].charAt(0).toUpperCase() + placeToConfirm.category.split(',')[0].slice(1)}</p>
                        <p className="body-address truncated m-0">{placeToConfirm.address}</p>
                        <div className="rating">
                            <p className='score-text'>{placeToConfirm.rating}</p>
                            {renderRating(placeToConfirm.rating).map((star, index) => {
                                let noStar = star === 0;
                                let fullStar = star === 1;
                                let halfStar = star === 0.5;
                                return <img key={index} src={`${fullStar ? "https://i.imgur.com/3eEFOjj.png" : noStar ? "https://i.imgur.com/ZhvvgPZ.png" : "https://i.imgur.com/SWExJbv.png"}`} alt="" className="star-img" />
                            })}

                        </div>

                        {placesAddressList.includes(placeToConfirm.address) ?
                            <div className="flx-r position-bottom">
                                <div onClick={() => { removePlace(placesAddressList.indexOf(placeToConfirm.address)) }} className="added-place-btn pointer">
                                    <div className={`${mobileModeNarrow ? "addIcon-filled-green-smallest" : "addIcon-filled-green-smaller"} flx mx-2`}>
                                        <span className={`material-symbols-outlined m-auto ${mobileModeNarrow ? "smedium" : "medium"} white-text`}>
                                            done
                                        </span>
                                    </div>
                                    <div className="flx">
                                        <p className={`green-text m-auto ${mobileModeNarrow ? "smedium" : "page-text-smaller"}`}>Added to places</p>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="flx-r position-bottom">
                                <div onClick={() => addPlace()} className="add-place-btn position-relative">
                                    {/* <div id='placeRemovedText' className={`overlayFull-text position-absolute w-100 h-100 d-non ${justAddedIsAnimating ? null : "hidden-o"}`}>Removed from places</div> */}
                                    <div className="flx pointer mx-2">
                                        <span className={`material-symbols-outlined m-auto ${mobileModeNarrow ? "smedium" : "medium"} purple-text`}>
                                            add
                                        </span>
                                    </div>
                                    <div className="flx">
                                        <p className={`purple-text m-auto ${mobileModeNarrow ? "smedium" : "page-text-smaller"}`}>Add to places</p>
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