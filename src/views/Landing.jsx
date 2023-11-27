import React, { useState } from 'react'
import { HeroCarousel } from '../components/HeroCarousel'

export const Landing = () => {

    const cards = [
        {
            imgUrl: 'https://i.imgur.com/S1hglkm.jpg',
            title: 'Personalized Recommendations',
            desc: ''
        },
        {
            imgUrl: 'https://i.imgur.com/S1hglkm.jpg',
            title: 'Efficient Routes',
            desc: ''
        },
        {
            imgUrl: 'https://i.imgur.com/S1hglkm.jpg',
            title: 'Adaptable Itineraries',
            desc: ''
        }
    ]
    

    return (
        <>
            <div className="hero-section w-100 position-relative">
                <div className="abs-vcenter center-text z-1 w-60">
                    <h1 className="hero-title mt15">Explore with ease.</h1>
                    <p className="hero-text bold700">Effortlessly craft the perfect itinerary based on your interests and travel needs</p>
                    <button className="btn-primaryflex disappear425"><p className="my-1 mx-2 white-text">Start planning now</p></button>
                </div>
                {/* <img src="https://i.imgur.com/6E1qXMc.jpg" alt="" className="hero-img" /> */}
                <HeroCarousel />
            </div>
            <button className="btn-primaryflex mt-3 w-50 m-auto appear425"><p className="my-1 mx-2 white-text">Start planning now</p></button>

            <div className="planning-section mt-4">
                <h1 className="page-title w-60 center-text m-auto my-8">Planning your day-to-day travel itinerary just got a whole lot easier</h1>
                <div className="cards flx-r flx-wrap just-se">
                    {cards.map((card, index) => {
                        return <div key={index} className="card mx-5 my-4">
                            <img src={card.imgUrl} alt="" className="card-img" />

                            <div className="card-text">
                                <div className="card-title page-subheading center-text"><strong>{card.title}</strong></div>
                                <div className="card-desc center-text">{card.desc}</div>
                            </div>
                        </div>
                    })}

                </div>
            </div>


            <div className="how-it-works">
                <h1 className="page-title center-text my-8">How it Works</h1>
                
                <div className="cards w-90 m-auto">

                    <div className="card4-l flx-r my-10">
                        <div className="flx-1">
                        <img src="https://i.imgur.com/LtwTsr7.png" alt="" className="card4-img" />
                        </div>
                        <div className="flx-1 pad28"><p className="page-heading-bold"> 1. Set your travel preferences</p> </div>
                    </div>


                    <div className="card4-r flx-r my-10">
                        <div className="flx-1 pad28"><p className="page-heading-bold"> 2. Start your trip</p> </div>
                        <div className="flx-1">
                        <img src="https://i.imgur.com/51ZmBFY.png" alt="" className="card4-img" />
                        </div>
                    </div>


                    <div className="card4-l flx-r my-10">
                        <div className="flx-1">
                        <img src="https://i.imgur.com/pvdhYw0.png" alt="" className="card4-img" />
                        </div>
                        <div className="flx-1 pad28"><p className="page-heading-bold"> 3. Add locations</p> </div>
                    </div>

                    <div className="card4-r flx-r my-10">
                        <div className="flx-1 pad28"><p className="page-heading-bold"> 4. Generate itinerary</p> </div>
                        <div className="flx-1">
                        <img src="https://i.imgur.com/WHVlrc4.png" alt="" className="card4-img" />
                        </div>
                    </div>


                </div>


            </div>


        </>
    )
}
