import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../../Context/DataProvider';
import './carouselwiper.scoped.css'

const CarouselWiper = ({ items = [], height, width, gap = 24, parentRef, paddingX = 36, paddingY = 24 }) => {
    const { gIcon } = useContext(DataContext);

    // respond to page resize
    const [screenWidth, setScreenWidth] = useState(parentRef && parentRef.current ? parentRef.current.offsetWidth : window.innerWidth);


    // carousel state
    const [carouselState, setCarouselState] = useState({
        isLoaded: false,
        offset: 0,
        maxOffset: 0,
        items: items,
        itemWidth: width,
        itemGap: gap,
        itemsInView: 1,
        windowWidth: width,
        paddingX: paddingX,
        paddingY: paddingY,
        scrollable: false,
    });
    const carouselFunctions = {
        initialize: function () {
            let { items, itemGap, itemWidth } = carouselState;
            let itemsInView = Math.floor((screenWidth - paddingX * 2) / (itemWidth + itemGap));
            let maxOffset = itemWidth * (items.length - itemsInView) + (itemGap * (items.length - itemsInView));
            setCarouselState({
                ...carouselState,
                windowWidth: itemWidth * itemsInView + (itemGap * (itemsInView - 1)),
                maxOffset: maxOffset,
                scrollable: itemWidth * items.length + (itemGap * (items.length - 1)) + paddingX * 2 > screenWidth,
                isLoaded: true,
            });
        },
        next: function () {
            let { offset, maxOffset, itemWidth, itemGap } = carouselState;
            if (offset >= maxOffset - (itemWidth + itemGap)) {
                setCarouselState({
                    ...carouselState,
                    offset: maxOffset,
            });
            } else {
                setCarouselState({
                    ...carouselState,
                    offset: offset + (itemWidth + itemGap),
                });
            };
        },
        previous: function () {
            let { offset, itemWidth, itemGap } = carouselState;
            if (offset <= 0 + itemWidth + itemGap) {
                setCarouselState({
                    ...carouselState,
                    offset: 0,
                });
            } else {
                setCarouselState({
                    ...carouselState,
                    offset: offset - (itemWidth + itemGap),
                });
            };
        },
        handleResize: function () {
            if (parentRef && parentRef.current) {
                setScreenWidth(parentRef.current.offsetWidth);
            } else {
                setScreenWidth(window.innerWidth);
            };
        },
    };
    useEffect(() => {
        carouselFunctions.initialize();
    }, [screenWidth]);

    
    // respond to window resize
    useEffect(() => {
        window.addEventListener('resize', carouselFunctions.handleResize);
        return () => window.removeEventListener('resize', carouselFunctions.handleResize);        
    }, []);

    return (
        <div className="carousel-wiper">

            {/* buttons */}
            <button className="navigate left"
                data-hidden={!carouselState.scrollable || carouselState.offset === 0}
                onClick={() => carouselFunctions.previous()}
            >
                <span className={gIcon}>keyboard_arrow_left</span>
            </button>
            <button
                className="navigate right"
                data-hidden={!carouselState.scrollable || carouselState.offset === carouselState.maxOffset}
                onClick={() => carouselFunctions.next()}
            >
                <span className={gIcon}>keyboard_arrow_right</span>
            </button>

            {/* carousel */}
            <div className="carousel-wiper-window" style={{ height: height ?? "", width: carouselState.windowWidth }}>
                <div
                    className="carousel-wiper-inner"
                    style={{ transform: `translateX(-${carouselState.offset}px)` }}
                >
                    {carouselState.items.map((item, index) => {
                        return (
                            <div key={index} className="carousel-wiper-item">
                                {item}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default CarouselWiper;