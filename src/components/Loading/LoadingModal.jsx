import React from 'react'
import { Loading } from './Loading'

export const LoadingModal = ({ open, width, height, marginTop, onClose }) => {
    if (!open) return null
    return (
        <div className="overlay">
            <div className="loadingBox modal" style={{ width: width ? width+"px" : "500px", height: height ? height+"px" : "550px", marginTop: marginTop ? marginTop+"px" : "0px" }}>
                <Loading />
            </div>
        </div>
    )
}
