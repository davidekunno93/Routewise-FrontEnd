import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../../Context/DataProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth, firestore } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Fade, Slide } from 'react-awesome-reveal';
import './survey.scoped.css';

export const Survey = () => {
    // login require
    const { setUserPreferences } = useContext(DataContext);
    const { mobileMode, mobileModeNarrow } = useContext(DataContext);

    const [numberOfSelectedPreferences, setNumberOfSelectedPreferences] = useState(0);
    const [preferenceSelections, setPreferenceSelections] = useState({
        landmarks: false,
        nature: false,
        shopping: false,
        food: false,
        nightclub: false,
        relaxation: false,
        entertainment: false,
        arts: false
    });
    useEffect(() => {
        setNumberOfSelectedPreferences(Object.values(preferenceSelections).filter(value => value === true).length);
    }, [preferenceSelections]);
    const preferenceFunctions = {
        add: function (preference) {
            if (numberOfSelectedPreferences >= 3) {
                // let maxCategoryError = document.getElementById('maxCategoryError');
                // maxCategoryError.classList.remove('d-none')
                alert('You can only select up to 3 preferences');
            } else {
                setPreferenceSelections({ ...preferenceSelections, [preference]: true });
            };
        },
        remove: function (preference) {
            setPreferenceSelections({ ...preferenceSelections, [preference]: false });
        },
        toggle: function (preference) {
            if (preferenceSelections[preference]) {
                preferenceFunctions.remove(preference);
            } else {
                preferenceFunctions.add(preference);
            };
        },
    };


    const navigate = useNavigate()

    const completeSurvey = async () => {
        progressLoadingAnimation()
        wait(2000).then(() => {
            navigate('/dashboard')
        })
    }

    useEffect(() => {
        const progressCheckmark = document.getElementById('progress-checkmark')

        wait(200).then(() => {
            progressCheckmark.classList.remove('o-none')
            wait(400).then(() => {
                progressAnimation()
            })
        })
    }, [])

    function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    const [progressBarSpace, setProgressBarSpace] = useState(window.innerWidth < 600 ? 10 : 0);
    const progressAnimation = () => {
        const progressBar = document.getElementById('progress-bar-full')
        const nodeFlex = document.getElementById('node-flex')
        const progressBarContainer = document.getElementById('progressBarContainer')
        let halfBarWidth = progressBarContainer.offsetWidth / 2 - 30
        // progressBar.style.width = '47%'
        halfBarWidth = halfBarWidth + progressBarSpace
        progressBar.style.right = halfBarWidth + "px"
        console.log(halfBarWidth)
        wait(900).then(() => {
            nodeFlex.style.width = '30px'
            nodeFlex.style.height = '30px'
        })
    }
    const progressLoadingAnimationStall = () => {
        const progressBar = document.getElementById('progress-bar-full')
        const progressCheckmark2 = document.getElementById('progress-checkmark2')
        progressBar.style.transition = '3s ease'
        progressCheckmark2.classList.remove('o-none')
        wait(200).then(() => {
            // progressBar.style.width = '93%'
            progressBar.style.right = '44px'
        })
    }
    const progressLoadingAnimation = () => {
        const progressBar = document.getElementById('progress-bar-full')
        const node2Flex = document.getElementById('node2-flex')
        wait(500).then(() => {
            progressBar.style.transition = '0.2s ease'
            progressBar.style.right = '44px'
        })
        wait(2500).then(() => {
            node2Flex.style.width = '30px'
            node2Flex.style.height = '30px'
        })
        return 'done'
    }

    const cards2 = [
        {
            userPreference: "landmarks",
            imgUrl: 'https://i.imgur.com/nixatab.png',
            title: 'Landmarks & Attractions'
        },
        {
            userPreference: "nature",
            imgUrl: 'https://i.imgur.com/kmZtRbp.png',
            title: 'Nature'
        },
        {
            userPreference: "shopping",
            imgUrl: 'https://i.imgur.com/Fo8WLyJ.png',
            title: 'Shopping'
        },
        {
            userPreference: "food",
            imgUrl: 'https://i.imgur.com/K6ADmfR.png',
            title: 'Food & Restaurants'
        },
        {
            userPreference: "arts",
            imgUrl: 'https://i.imgur.com/ExY7HDK.png',
            title: 'Arts & Culture'
        },
        {
            userPreference: "nightlife",
            imgUrl: 'https://i.imgur.com/9fVucq9.png',
            title: 'Nightlife'
        },
        {
            userPreference: "entertainment",
            imgUrl: 'https://i.imgur.com/A8Impx2.png',
            title: 'Music & Entertainment'
        },
        {
            userPreference: "relaxation",
            imgUrl: 'https://i.imgur.com/o8PJDZ5.png',
            title: 'Spa & Relaxation'
        },
    ];

    const cards2_dict = {
        "landmarks": {
            userPreference: "landmarks",
            imgUrl: 'https://i.imgur.com/nixatab.png',
            title: 'Landmarks & Attractions'
        },
        "nature": {
            userPreference: "nature",
            imgUrl: 'https://i.imgur.com/kmZtRbp.png',
            title: 'Nature'
        },
        "shopping": {
            userPreference: "shopping",
            imgUrl: 'https://i.imgur.com/Fo8WLyJ.png',
            title: 'Shopping'
        },
        "food": {
            userPreference: "food",
            imgUrl: 'https://i.imgur.com/K6ADmfR.png',
            title: 'Food & Restaurants'
        },
        "arts": {
            userPreference: "arts",
            imgUrl: 'https://i.imgur.com/ExY7HDK.png',
            title: 'Arts & Culture'
        },
        "nightclub": {
            userPreference: "nightclub",
            imgUrl: 'https://i.imgur.com/9fVucq9.png',
            title: 'Nightlife'
        },
        "entertainment": {
            userPreference: "entertainment",
            imgUrl: 'https://i.imgur.com/A8Impx2.png',
            title: 'Music & Entertainment'
        },
        "relaxation": {
            userPreference: "relaxation",
            imgUrl: 'https://i.imgur.com/o8PJDZ5.png',
            title: 'Spa & Relaxation'
        },
    };


    const updateFirestore = () => {
        // userId should be auth.currentUser.uid
        let userId = auth.currentUser.uid ? auth.currentUser.uid : "testUser2"
        let userPreferences = { ...preferenceSelections, uid: userId }
        setDoc(doc(firestore, `userPreferences/${userId}`), userPreferences)
        console.log("firestore updated!")
        progressLoadingAnimationStall()
        completeSurvey()
    }

    const updateUserPreferences = () => {
        setUserPreferences(preferenceSelections)
    }

    const openContinueOverlay = () => {
        let continueOverlay = document.getElementById('continueOverlay')
        continueOverlay.classList.remove('d-none')
    }
    const closeContinueOverlay = () => {
        let continueOverlay = document.getElementById('continueOverlay')
        continueOverlay.classList.add('d-none')
    }

    return (
        <>

            <div id='continueOverlay' className="overlay-white90 flx td-3 d-none">
                <Slide duration={400} className='m-auto' direction='up' triggerOnce>
                    <Fade triggerOnce>
                        <img src="https://i.imgur.com/FxsCfD2.png" alt="" className="page-card-img center" />
                        <div className="flx-r mt-3 just-ce">
                            <p className="w-80 center-text x-large bold500"> Just a moment while we save your travel preferences...</p>
                        </div>
                    </Fade>
                </Slide>
            </div>

            <div id='progressBarContainer' className="progress-bar-container">
                <div className="progress-bar w-95 m-auto flx-r just-sb my-5">
                    <div className="point">
                        <div className="progress-bar-node center">
                            <span id='progress-checkmark' className="material-symbols-outlined white-text m-auto o-none">
                                check
                            </span>
                        </div>
                        <p className={`sign-up m-0 mt-1 ${mobileMode && "small"}`}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sign Up&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                    </div>
                    <div className="point">
                        <div className="progress-bar-node-empty node-frame center position-relative">

                            <div id='node-flex' className="progress-bar-node-flex">
                                <span id='progress-checkmark2' className="material-symbols-outlined white-text m-auto o-none">
                                    check
                                </span>
                            </div>
                        </div>
                        <p className={`sign-up m-0 mt-1 ${mobileMode && "small"}`}>Travel Preferences</p>
                    </div>
                    <div className="point">
                        <div className="progress-bar-node-empty node-frame center position-relative">
                            <div id='node2-flex' className="progress-bar-node-flex"></div>
                        </div>
                        <p className={`sign-up m-0 mt-1 ${mobileMode && "small"}`}>Start Planning!</p>
                    </div>
                    <div id='progress-bar-full' className="progress-bar-full"></div>
                    <div className="progress-bar-empty"></div>
                </div>
            </div>

            <div className="page-container90">
                <div className="title-section">
                    <h1 className="page-title">Set up your traveler profile</h1>
                    <div className="subtitle-text">
                        <p className={`${mobileModeNarrow ? "medium" : "page-text"}`}>Adventure awaits! How do you prefer to explore the world?</p>
                        <p className={`${mobileModeNarrow ? "smedium" : "page-text"}`}>Select up to <strong className='purple-text'>3 categories</strong> <span id='maxCategoryError' className="red-text bold500 ml-1 d-none">(max 3 categories) <span className={`material-symbols-outlined red-text v-ttop ${mobileModeNarrow && "large"}`}>
                            error
                        </span></span></p>
                    </div>
                </div>
                <div className="cards-list">
                    {Object.keys(preferenceSelections).map((preference, index) => {
                        let card = cards2_dict[preference]
                        return <div
                            key={index}
                            className={`card2 ${mobileModeNarrow && "flex"} ${preferenceSelections[preference] && "selected"}`}
                            onClick={() => preferenceFunctions.toggle(preference)}
                        >
                            {preferenceSelections[preference] &&
                                <div className="green-checkbox">
                                    <span className="material-symbols-outlined white-text m-auto">
                                        check
                                    </span>
                                </div>
                            }
                            <div className="card2-imgDiv flx-1">
                                <img src={card.imgUrl} alt="" className="card2-img" />
                            </div>
                            <div className="card2-text flx-1">
                                <div className="card2-title">{card.title}</div>
                            </div>
                        </div>
                    })}
                    {/* {cards2.map((card2, index) => {
                        return <div onClick={() => toggleSelection(index)} key={index} id={`${index}-card2`} className={`card2 ${mobileModeNarrow && "flex"} mx2 my-3 position-relative`}>
                            <div id={`${index}-green-checkbox`} className="green-checkbox d-none">
                                <span className="material-symbols-outlined white-text m-auto">
                                    check
                                </span>
                            </div>
                            <div className="card2-imgDiv flx-1">
                                <img src={card2.imgUrl} alt="" className="card2-img" />
                            </div>
                            <div className="card2-text flx-1">
                                <div className="card2-title center-text w-80 m-auto dark-text">{card2.title}</div>
                            </div>
                        </div>
                    })} */}

                </div>
                <button onClick={() => { updateFirestore(), updateUserPreferences(), openContinueOverlay() }} className="btn-primaryflex2 right mt-4">
                    <p className='inline'>Continue</p>
                    <span className="material-symbols-outlined arrow v-bott ml-2">
                        arrow_forward
                    </span>
                </button>
            </div>
            <div className="empty-3"></div>
        </>
    )
}
