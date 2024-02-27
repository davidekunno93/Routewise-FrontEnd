import React, { useEffect, useState } from 'react'

export const HeroFade = () => {
    const [topIndex, setTopIndex] = useState(0)
    const [bottomIndex, setBottomIndex] = useState(1)
    const [fadeIndex, setFadeIndex] = useState(2)
    // 2 front pics are bridge pics to be compared
    const heroImgs = ["https://i.imgur.com/hu7bPUa.jpg", "https://i.imgur.com/FzGZqA8.jpg", "https://i.imgur.com/WKgnuQh.jpg", "https://i.imgur.com/38wwsY5.jpg", "https://i.imgur.com/8sJTism.jpg", "https://i.imgur.com/q55B0FZ.jpg", "https://i.imgur.com/A7YyTjp.jpg", "https://i.imgur.com/idjR6V5.jpg", "https://i.imgur.com/95FwIBc.png"]
    
    const [timer, setTimer] = useState(0)

    function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
    const heroFade = () => {
        let heroImgTop = document.getElementById('top')
        let heroImgBott = document.getElementById('bottom')
        let heroImgFade = document.getElementById('fade')
        setFadeIndex(topIndex)
        heroImgFade.classList.remove('d-none')
        incrementTopIndex()
        incrementBottomIndex()
        wait(500).then(() => {
            heroImgFade.classList.add('o-none')
            wait(2100).then(() => {
                heroImgFade.classList.add('d-none')
            })
        })
    }

    const incrementTopIndex = () => {
        if (topIndex === heroImgs.length - 1) {
            setTopIndex(0)
        } else {
            setTopIndex(topIndex + 1)
        }
    }
    const incrementBottomIndex = () => {
        if (bottomIndex === heroImgs.length - 1) {
            setBottomIndex(0)
        } else {
            setBottomIndex(bottomIndex + 1)
        }
    }

    const heroFadeOpacityOnly = () => {
        let heroImgFade = document.getElementById('fade')
        setFadeIndex(topIndex)
        heroImgFade.classList.remove('o-none')
        wait(2100).then(() => {
            incrementTopIndex()
            incrementBottomIndex()
            wait(500).then(() => {
                heroImgFade.classList.add('o-none')
                updateTimer()
            })
        })
    }


    const updateTimer = () => {
        wait(8000).then(() => {
            setTimer(timer + 1)
            // console.log(timer)
        })
    }

    useEffect(() => {
        updateTimer()
    }, [])
    useEffect(() => {
        if (timer > 0) {
            heroFadeOpacityOnly()
        }
    }, [timer])

    return (
        <>
            <div onClick={() => heroFadeOpacityOnly()} className="heroFadeContainer position-relative">
                <img id='fade' src={heroImgs[fadeIndex]} alt="" className="heroFade-img position-absolute z-10 o-none" />
                <img id='top' src={heroImgs[topIndex]} alt="" className="heroFade-img position-absolute z-1" />
                <img id='bottom' src={heroImgs[bottomIndex]} alt="" className="heroFade-img position-absolute" />
                <div className="placeholder"></div>
            </div>

        </>
    )
}
