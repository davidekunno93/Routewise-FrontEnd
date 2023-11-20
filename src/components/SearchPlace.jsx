import React, { useState } from 'react'

export const SearchPlace = () => {
    const [type, setType] = useState(1);


    return (
        <>
        {type === 1 ? 
        
            <div className="searchBar position-relative w-100">
                <span className="material-symbols-outlined position-absolute flowBox-location-icon-placeholder">
                    location_on
                </span>
                <span className="material-symbols-outlined position-absolute search-icon-overlay2">
                    search
                </span>
                {/* <button className="btn-primaryflex-overlay">Add</button> */}
                <input type='text' className="flowBox-searchBar flx-1 position-absolute" placeholder='Add a location' />
            </div> 
            : 
            <input type='text' className='form-input2 w-98 ml-1 mt-3' placeholder='Search places...' />
        }
        </>
    )
}
