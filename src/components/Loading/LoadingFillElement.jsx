import './loading.scoped.css'
import { Loading } from "./Loading";
import { useState, useEffect } from 'react';

const LoadingFillElement = ({ innerText, noMascot, noText, color, fadeIn }) => {
    
    // fade in on load
    const [fadeInInstruction, setFadeInstruction] = useState(fadeIn ? "start" : null);
    useEffect(() => {
        if (!fadeIn) return;
        setFadeInstruction("end");
    }, []);
    return (
        <div
            className="loading-fillElement"
            data-color={color}
            data-fadeIn={fadeInInstruction}
        >
            <Loading
                innerText={innerText}
                noMascot={noMascot}
                noText={noText}
            />
        </div>
    )
}
export default LoadingFillElement;