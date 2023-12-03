import React, { useEffect } from 'react'

export const Loading = () => {

    function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    useEffect(() => {
        let loading = document.getElementById('loading')
        wait(20000).then(() => {
            loading.innerText = "This may take up to a minute..."
        })
    }, [])
    
    return (
        <>
            <div id='loading' className='position-absolute abs-center purple-text mt-7'>Loading...</div>
            
            <img src='https://i.imgur.com/DQ1Otmw.png' className="bird-load-logo m-auto position-absolute abs-center" />
            
            <div className="loading m-auto"></div>
        </>
    )
}
