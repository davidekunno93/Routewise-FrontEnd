import React from 'react'

export const PlaceCard = () => {
    return (
        <div className="placeCard position-relative flx-r my-2">

            <div className="placeCard-img-div flx-1">
                <img className="placeCard-img" src="https://i.imgur.com/xwY6Bdd.jpg" />
            </div>
            <div className="placeCard-body flx-2">
                <p className="body-title">Trafalgar Square</p>
                <p className="body-info">Open 24 hours</p>
                <p className="body-desc">...</p>
            </div>
            <div className="placeCard-starOrDelete flx-c just-sb align-c">
                <img src="https://i.imgur.com/S0wE009.png" alt="" className="star-empty my-2" />
                <img src="https://i.imgur.com/Bq6COcA.png" alt="" className="star-full my-2 d-none" />
                <span className="material-symbols-outlined mx-3 my-2 onHover-50 pointer">
                    delete
                </span>
            </div>
        </div>
    )
}
