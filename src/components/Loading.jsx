import React, { useEffect } from 'react'

export const Loading = ({ innerText, noMascot, noText }) => {

    function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    useEffect(() => {
        let loading = document.getElementById('loading')
        if (loading) {
            wait(20000).then(() => {
                loading.innerText = innerText ? innerText : "This may take up to a minute..."
            })
        }
    }, [])

    return (
        <>
            {!noText &&
                <div id='loading' className='position-absolute abs-center purple-text mt-8 center-text'>Loading...</div>
            }

            {!noMascot &&
                <img src='https://i.imgur.com/DQ1Otmw.png' className="bird-load-logo m-auto position-absolute abs-center" />
            }

            <div className="loading m-auto"></div>
        </>
    )
}
