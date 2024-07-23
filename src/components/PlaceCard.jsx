import React, { forwardRef, useContext } from 'react'
import { DataContext } from '../Context/DataProvider'
import "./placecards.scoped.css"
import ScrollText from './ScrollText';

export const PlaceCard = forwardRef(({ place, index, addStar, removeStar, removePlace, updateMapCenter }, ref) => {
    const { textFunctions, renderRating } = useContext(DataContext);

    let firstCategory = place.category.split(",")[0]

    return (
        <>
            <div className="div-to-create-space-from-fade-for-ref">
                <div id={`placeholderBefore-${index}`} className="placeCard2-placeholder hidden"></div>
                <div ref={ref} key={index} className={`placeCard2 position-relative flx-r o-none gone shown`}>

                    <div className="placeCard-img-div flx-4">
                        <img onClick={() => updateMapCenter(place.geocode)} className="placeCard2-img" src={place.imgURL} />
                    </div>
                    <div className="placeCard2-body flx-7">
                        {/* <div onClick={() => togglePopUp(index)} id={`popUp-${index}`} className="popUp d-none">{place.info}</div> */}
                        <p className="body-title truncated">{place.placeName}</p>
                        <div className="align-all-items">
                            <p className="body-category">{textFunctions.capitalize(place.category.split(',')[0])}</p>
                            {place.rating &&
                                <>
                                    <p className='m-0 x-small mx-1 gray-text'>&bull;</p>
                                    <div className="rating">
                                        <p className='score-text'>{place.rating}</p>
                                        {renderRating(place.rating).map((star, index) => {
                                            let noStar = star === 0;
                                            let fullStar = star === 1;
                                            let halfStar = star === 0.5;
                                            return <img key={index} src={`${fullStar ? "https://i.imgur.com/3eEFOjj.png" : noStar ? "https://i.imgur.com/ZhvvgPZ.png" : "https://i.imgur.com/SWExJbv.png"}`} alt="" className="star-img" />
                                        })}

                                    </div>
                                </>
                            }

                        </div>
                        {place.info &&
                            <ScrollText text={place.info} height={20} fontSize={12} color="gray" />
                            // <p className="body-info truncated">{place.info.constructor === Array ? place.info.join(", ") : place.info}</p>
                        }
                        <p className="m-0 body-address truncated-2">{place.summary ?? place.address}</p>
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