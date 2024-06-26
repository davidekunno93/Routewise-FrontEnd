import React from 'react'

const PageBlock = ({ open, loading }) => {
    if (!open) return null;

    return (
        <div className="overlay-white">
            <div className={`flx h-100 ${!loading && "d-none"}`}>
                <div className="loading m-auto"></div>
            </div>
        </div>
    )
}
export default PageBlock;