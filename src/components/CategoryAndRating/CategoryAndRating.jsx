import React, { useContext } from 'react'
import { DataContext } from '../../Context/DataProvider';

const CategoryAndRating = ({ place }) => {
    const { textFunctions, renderRating } = useContext(DataContext);
    return (
        <div className="align-all-items">
            <p className="body-category truncated">{place.category ? textFunctions.capitalize(place.category.split(',')[0]) : "No Category"}</p>
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
    )
}
export default CategoryAndRating;