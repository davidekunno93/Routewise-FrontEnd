import React, { useState } from 'react'
import { HeroCarousel } from '../components/HeroCarousel'
import { HeroFade } from '../components/HeroFade'
import { Fade, Slide } from 'react-awesome-reveal'

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
                <div className="abs-vcenter center-text z-100 w-60">
                    <h1 className="hero-title mt15">Explore with ease.</h1>
                    <p className="hero-text bold700">Effortlessly craft the perfect itinerary based on your interests and travel needs</p>
                    <button className="btn-primaryflex"><p className="my-1 mx-2 white-text">Start planning now</p></button>
                </div>
                {/* <img src="https://i.imgur.com/6E1qXMc.jpg" alt="" className="hero-img" /> */}
                <HeroFade />
            </div>
            {/* <div className="flx align-c w-100 blend-bg">
                <button className="btn-primaryflex mt-3 w-50 m-auto appear425"><p className="my-1 mx-2 white-text">Start planning now</p></button>
            </div> */}


            <div className="planning-section">
                <Fade delay={300} triggerOnce>
                    <Slide direction='up' triggerOnce>
                        <h1 className="page-title w-65 center-text m-auto my-12">Planning your day-to-day travel itinerary just got a whole lot easier</h1>


                        <div className="page-container90 flx-r">
                            <div className="img flx-4">
                                <img src="https://i.imgur.com/jlXivfT.png" alt="" className='w-100' />
                            </div>
                            <div className="text flx flx-3">
                                <p className="m-auto bold500 pad28-respond">
                                    RouteWise groups nearby locations for a hassle-free day of exploration. <br /><br />
                                    Maximize your time and make every moment count with simplified travel planning at your fingertips!
                                </p>
                            </div>

                        </div>


                        {/* <div className="cards flx-r flx-wrap just-se">
                    {cards.map((card, index) => {
                        return <div key={index} className="card mx-5 my-4">
                            <img src={card.imgUrl} alt="" className="card-img" />

                            <div className="card-text">
                                <div className="card-title page-subheading center-text"><strong>{card.title}</strong></div>
                                <div className="card-desc center-text">{card.desc}</div>
                            </div>
                        </div>
                    })}

                </div> */}
                        <div className="empty-3"></div>
                    </Slide>
                </Fade>
            </div>



            <div className="how-it-works">
                <Fade delay={300} triggerOnce>
                    <Slide direction='up' triggerOnce>
                        <h1 className="page-title center-text my-8">How it Works</h1>
                    </Slide>
                </Fade>
                <div className="cards w-90 m-auto">
                    <Fade delay={500} fraction={0.6} triggerOnce>
                        <Slide fraction={0.6} direction='left' triggerOnce>
                            <div className="card4-l flx-r my-10">
                                <div className="flx-2">
                                    <img src="https://i.imgur.com/wx4upLO.png" alt="" className="card4-img" />
                                </div>
                                <div className="flx-1 pad28">
                                    <div className="page-heading-bold flx-r">
                                        <p className="">1.&nbsp;&nbsp;</p>
                                        <div className="flx-c">
                                            <p className="">Add places to your trip list</p>
                                            <p className="m-0 page-text">Look up the places you want to go on the map and add it to your trip list with a click of a button!</p>

                                        </div></div>
                                </div>
                            </div>
                        </Slide>
                        <Slide fraction={0.6} direction='right' triggerOnce>
                            <div className="card4-r flx-r my-10">
                                <div className="flx-1 pad28"><p className="page-heading-bold"> 2. Generate a proximity-bsaed itinerary</p> </div>
                                <div className="flx-1">
                                    <img src="https://i.imgur.com/02aZHAR.png" alt="" className="card4-img" />
                                </div>
                            </div>
                        </Slide>
                        <Slide fraction={0.6} direction='left' triggerOnce>
                            <div className="card4-l flx-r my-10">
                                <div className="flx-1">
                                    <img src="https://i.imgur.com/oe52kHu.png" alt="" className="card4-img" />
                                </div>
                                <div className="flx-1 pad28"><p className="page-heading-bold"> 3. Customize your itinerary and explore!</p> </div>
                            </div>
                        </Slide>
                        {/* <Slide fraction={0.6} direction='right' triggerOnce>
                        <div className="card4-r flx-r my-10">
                            <div className="flx-1 pad28"><p className="page-heading-bold"> 4. Generate itinerary</p> </div>
                            <div className="flx-1">
                                <img src="https://i.imgur.com/WHVlrc4.png" alt="" className="card4-img" />
                            </div>
                        </div>
                        </Slide> */}
                    </Fade>

                </div>


            </div>

            <div className="empty-2"></div>

            <div className="page-card">
                <div className="flx-r-respond768">
                    <div className="img flx-1 flx">
                        <img src="https://i.imgur.com/DQ1Otmw.png" alt="" className="page-card-img m-auto my-12-respond768" />
                    </div>
                    <div className="body flx-1">
                        <div className="pad28 w-80">
                            <p className="page-heading-bold page-card-title">Did you know?</p>
                            <p className="page-card-text">
                                Pigeons have a small spot on their beak that is believed to contain a magnetic mineral called magnetite. This acts as a natural compass and allows them to sense the Earth's magnetic field, helping them determine their position and navigating in the right direction. <br /><br />
                                That's why we've enlisted the pigeon as our little mascot, to help travelers pick up the breadcrumbs and plan the most efficient itinerary that utilizes the proximity of locations for a stress-free trip.<br /><br />
                                Ready to get started?
                            </p>
                            <button className="btn-primaryflex2 mt-4">Start planning now</button>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}
