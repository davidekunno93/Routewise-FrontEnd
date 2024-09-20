import React from 'react'

const LoadOnTop = ({ open, width, height, full, opacity, borderRadius, onClose }) => {
    if (!open) return null

    return (
        <div className="loadBox" style={{ width: full ? '100%' : width ? width : 300, height: full ? '100%' : height ? height : 400, opacity: opacity ? opacity : "0.8", borderRadius: borderRadius ? borderRadius : '0%' }}>
            <div className="loading m-auto"></div>
        </div>
    )
}
export default LoadOnTop;