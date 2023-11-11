import React from 'react'

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
                <div className="abs-vcenter center-text">
                    <h1 className="hero-title mt-10">Explore with ease.</h1>
                    <p className="x-large bold700">Effortlessly craft the perfect itinerary based on your interests and travel needs</p>
                    <button className="btn-primaryflex"><p className="my-1 mx-2">Start planning now</p></button>
                </div>
                <img src="https://i.imgur.com/6E1qXMc.jpg" alt="" className="hero-img" />
            </div>

            <div className="planning-section mt-4">
                <h1 className="page-title w-60 center-text m-auto my-8">Planning your day-to-day travel itinerary just got a whole lot easier</h1>
                <div className="cards flx-r flx-wrap just-se">
                    {cards.map((card, index) => {
                        return <div key={index} className="card mx-5 my-4">
                        <img src={card.imgUrl} alt="" className="card-img" />

                        <div className="card-text">
                            <div className="card-title center-text"><strong>{card.title}</strong></div>
                            <div className="card-desc center-text">{card.desc}</div>
                        </div>
                    </div>
                    })}
                    
                </div>
            </div>
        </>
    )
}
