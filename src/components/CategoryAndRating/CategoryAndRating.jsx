import React, { useContext } from 'react'
import { DataContext } from '../../Context/DataProvider';

const CategoryAndRating = ({ place }) => {
    const { textFunctions, renderRating } = useContext(DataContext);

    const starDarkbgImgs = {
        noStar: "https://i.imgur.com/ZhvvgPZ.png",
        halfStar: "https://i.imgur.com/SWExJbv.png",
        fullStar: "https://i.imgur.com/3eEFOjj.png",
    };
    const starImgs = {
        noStar: "https://i.imgur.com/7T9CNME.png",
        halfStar: "https://i.imgur.com/gL5QY1I.png",
        fullStar: "https://i.imgur.com/3eEFOjj.png",
    };
    return (
        <div className="align-all-items">
            <p className="body-category truncated">{place.category ? textFunctions.capitalize(place.category.split(',')[0]) : "No Category"}</p>
            {place.rating &&
                <>
                    <p className='m-0 x-small mx-1 gray-text'>&bull;</p>
                    <div className="rating">
                        <p className='score-text'>{place.rating}</p>
                        {renderRating(place.rating).map((star, index) => {
                            let starRender = star === 0 ? "noStar" : star === 1 ? "fullStar" : "halfStar";
                            return <img key={index} src={starImgs[starRender]} alt="" className="star-img" />
                        })}

                    </div>
                </>
            }

        </div>
    )
}
export default CategoryAndRating;