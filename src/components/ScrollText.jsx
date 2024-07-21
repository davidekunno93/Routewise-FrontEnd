import React, { useEffect, useRef, useState } from 'react'

export const ScrollText = ({ text, width, height, fontSize, color, scrollDuration }) => {
    const [isOverflown, setIsOverflown] = useState(false);
    const [scrollDurationState, setScrollDurationState] = useState(scrollDuration);
    const textRef = useRef(null);
    useEffect(() => {
        // console.log(textRef.current.offsetWidth)
        // console.log(textRef.current.scrollWidth)
        setIsOverflown(textRef.current.offsetWidth < textRef.current.scrollWidth)
        if (!scrollDuration) {
            setScrollDurationState(Math.ceil((textRef.current.scrollWidth / textRef.current.offsetWidth)*4.5));
        }
    }, [text])

    return (
        <div className={`scroll-text-container ${isOverflown ? "enabled" : "disabled"}`} style={{ width: width ?? "100%", height: height ?? "", fontSize: fontSize ? fontSize.toString()+"px" : "12px" }}>
            
            <p className="static-text m-0 truncated" style={{ color: color ?? "black" }}>{text}</p>
            
            <div className="marquee-text" data-animated>
                <div className="scroller-inner" style={{ animation: `scroll ${scrollDurationState ? scrollDurationState.toString()+"s" : "4s"} linear infinite` }}>
                    <p className='m-0 ws-nowrap' style={{ color: color ?? "black" }}>{text}</p>
                    <p className='m-0 ws-nowrap' style={{ color: color ?? "black" }}>{text}</p>
                </div>
            </div>

            <p ref={textRef} className="reference-text m-0 ws-nowrap hidden">{text}</p>
            
        </div>
    )
}
export default ScrollText;