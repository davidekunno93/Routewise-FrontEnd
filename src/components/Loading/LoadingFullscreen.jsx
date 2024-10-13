import React from 'react'

const LoadingFullscreen = ({ open, loading, opacity }) => {
    if (!open) return null;

    return (
        <div className="overlay-white" style={{ backgroundColor: opacity ? "white" : "", opacity: opacity ?? "" }}>
            <div className={`flx h-100 ${!loading && "d-none"}`}>
                <div className="loading m-auto"></div>
            </div>
        </div>
    )
}
export default LoadingFullscreen;