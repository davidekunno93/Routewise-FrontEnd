import React, { useEffect, useState } from 'react'

export const HeroCarousel = () => {
    const [timer, setTimer] = useState(0)
    const [activeIndex, setActiveIndex] = useState(0);
    const images = [
        {
            imgUrl: "https://i.imgur.com/6E1qXMc.jpg"
        },
        {
            imgUrl: "https://i.imgur.com/EJm6Wx7.jpgg"
        },
        {
            imgUrl: "https://i.imgur.com/mGTF2GC.jpg"
        },
        {
            imgUrl: "https://i.imgur.com/snzvk0Z.jpg"
        },
        {
            imgUrl: "https://i.imgur.com/I0DfHwI.jpg"
        },
        {
            imgUrl: "https://i.imgur.com/TPeboMl.jpg"
        }
    ]

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    const updateIndex = (newIndex) => {
        if (newIndex === images.length) {
            newIndex = 0
        } else if (newIndex === -1) {
            newIndex = images.length - 1
        }
        setActiveIndex(newIndex)
        console.log(activeIndex)
    }

    const incrementIndex = () => {
        setActiveIndex(activeIndex + 1);
    }
    const changeTimer = () => {
        if (timer === 0) {
            setTimer(1)
        } else {
            setTimer(0)
        }
    }


    wait(12000).then(() => {
        // updateIndex(activeIndex + 1)
        // console.log(activeIndex)
        changeTimer()
    })

    
    useEffect(() => {
        updateIndex(activeIndex + 1)
    }, [timer])


    return (
        <>
            <div className="heroCarouselContainer position-relative w-100 hideOverFlow flx-c just-ce">
                {/* <div className="position-absolute z-1 w-100"> */}
                <div className="indicators w-25 mt-3 flx-r just-se abs-vcenter z-1 abs-bottom8">
                    {images.map((image, index) => {
                        return <img key={index} src={activeIndex === index ? "https://i.imgur.com/X6zwuT5.png" : "https://i.imgur.com/flQLMEs.png"} className={`${activeIndex === index ? null : "onHover-fade pointer"} dot-indicator mx-3`} onClick={() => updateIndex(index)} />


                    })}
                </div>
                {/* </div> */}

                <div className="inner2" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                    <div className="carousel-item">
                        {images.map((image, index) => {
                            return <div className="imgFrame-12-5">
                                <img src={image.imgUrl} alt="" className="w-100" />
                            </div>
                        })}

                    </div>
                </div>
            </div>

        </>
    )
}
