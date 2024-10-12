import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../../Context/DataProvider';
import './carouselwiper.scoped.css'

const CarouselWiper = ({ items = [], height, width, gap = 24, parentRef, paddingX = 0, paddingY = 0, position = "center" }) => {
    const { gIcon } = useContext(DataContext);
    // helper functions
    const getPx = (value) => {
        if (typeof value === 'number') {
            return value;
        } else if (typeof value === 'string') {
            if (value.endsWith('vw')) {
                let vw = value.slice(0, -2);
                return parseInt(((vw / 100) * screenWidth).toFixed(0));
            } else if (value.endsWith('px')) {
                return value.slice(0, -2);
            };
        };
    };

    // respond to page resize
    const [screenWidth, setScreenWidth] = useState(parentRef && parentRef.current ? parentRef.current.offsetWidth : window.innerWidth);


    // carousel state
    const [carouselState, setCarouselState] = useState({
        isLoaded: false,
        offset: 0,
        maxOffset: 0,
        items: items,
        itemWidth: getPx(width),
        itemGap: gap,
        itemsInView: 1,
        windowWidth: width,
        position: position,
        paddingX: paddingX,
        paddingY: paddingY,
        scrollable: false,
    });
    const carouselFunctions = {
        initialize: function () {
            let { items, itemGap } = carouselState;
            let itemWidth = getPx(width);
            let itemsInView = Math.floor((screenWidth - paddingX * 2) / (itemWidth + itemGap));
            let maxOffset = itemWidth * (items.length - itemsInView) + (itemGap * (items.length - itemsInView));
            setCarouselState({
                ...carouselState,
                offset: 0,
                maxOffset: maxOffset,
                itemWidth: itemWidth,
                position: position,
                windowWidth: itemWidth * itemsInView + (itemGap * (itemsInView - 1)),
                scrollable: items.length > itemsInView,
                // scrollable: itemWidth * items.length + (itemGap * (items.length - 1)) + paddingX * 2 > screenWidth,
                isLoaded: true,
            });
        },
        next: function () {
            let { offset, maxOffset, itemWidth, itemGap } = carouselState;
            console.log(itemWidth, itemGap)
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
    }, [screenWidth, width]);


    // respond to window resize
    useEffect(() => {
        window.addEventListener('resize', carouselFunctions.handleResize);
        return () => window.removeEventListener('resize', carouselFunctions.handleResize);
    }, []);


    return (
        <div className="carousel-wiper" style={{ margin: position === "center" ? "0 auto" : position === "left" ? "0 auto 0 0" : "", padding: `${paddingY}px ${paddingX}px` }}>

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
            <div className="carousel-wiper-window" style={{ height: height ?? "", width: carouselState.windowWidth, marginLeft: !carouselState.scrollable && position === "left" ? 0 : "" }}>
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