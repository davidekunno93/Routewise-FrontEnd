import React from 'react'

export const Loading = () => {
    return (
        <>
            <div className='position-absolute abs-center purple-text mt-7'>Loading...</div>
            
            <img src='https://i.imgur.com/DQ1Otmw.png' className="bird-load-logo m-auto position-absolute abs-center" />
            
            <div className="loading m-auto"></div>
        </>
    )
}
