import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../Context/DataProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth, firestore } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Fade, Slide } from 'react-awesome-reveal';

export const Survey = () => {
    // login require
    const { user, setUser } = useContext(DataContext);
    const { userPreferences, setUserPreferences } = useContext(DataContext);
    const [categories, setCategories] = useState(
        {
            landmarks: false,
            nature: false,
            shopping: false,
            food: false,
            relaxation: false,
            entertainment: false,
            arts: false
        }
    );

    const navigate = useNavigate()

    const completeSurvey = async () => {
        progressLoadingAnimation()
        wait(2000).then(() => {
            navigate('/dashboard')
        })
    }
    const sendDataTest = async () => {
        let data = {
            uid: '1234567',
            categories: {
                landmarks: false,
                nature: true,
                shopping: true,
                food: true,
                relaxation: false,
                entertainment: false,
                arts: false
            }
        }
        console.log(data)
        const response = await axios.post('https://routewise-backend.onrender.com/profile/user_info', JSON.stringify(data), {
            headers: { "Content-Type": "application/json" }
        })
            .then((response) => console.log(response))
            .catch((error) => console.log(error))
    }

    const sendData = async () => {
        if (!user) {

        } else {

        }
        let data = {
            uid: user.uid,
            categories: categories
        }
        console.log(data)
        const response = await axios.post('https://routewise-backend.onrender.com/profile/user_info', JSON.stringify(data), {
            headers: { "Content-Type": "application/json" }
        })
        // .then((response) => console.log(response))
        // .catch((error) => console.log(error))
        progressLoadingAnimationStall()
        return response.status === 200 ? completeSurvey() : handleError(response)
    }

    // useEffect(() => {
    //     console.log(categories)
    // }, [categories])
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
        // const progressCheckmark2 = document.getElementById('progress-checkmark2')
        // progressBar.style.transition = '1.5s ease'
        // progressCheckmark2.classList.remove('o-none')
        // wait(200).then(() => {
        //     progressBar.style.width = '93%'
        // })
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
            imgUrl: 'https://i.imgur.com/FvhWwnV.png',
            title: 'Landmarks & Attractions'
        },
        {
            userPreference: "nature",
            imgUrl: 'https://i.imgur.com/8imPNfF.png',
            title: 'Nature'
        },
        {
            userPreference: "shopping",
            imgUrl: 'https://i.imgur.com/oGV9gqi.png',
            title: 'Shopping'
        },
        {
            userPreference: "food",
            imgUrl: 'https://i.imgur.com/dTAAsWU.png',
            title: 'Food & Nightlife'
        },
        {
            userPreference: "relaxation",
            imgUrl: 'https://i.imgur.com/3UOXniG.png',
            title: 'Spa & Relaxation'
        },
        {
            userPreference: "entertainment",
            imgUrl: 'https://i.imgur.com/3WPIK0i.png',
            title: 'Music & Entertainment'
        },
        {
            userPreference: "arts",
            imgUrl: 'https://i.imgur.com/BdhaXO4.png',
            title: 'Arts & Culture'
        }
    ]

    const toggleSelection = (id) => {
        const card = document.getElementById(`${id}-card2`)
        const greenCheck = document.getElementById(`${id}-green-checkbox`)
        if (card.classList.contains('card2')) {
            // card.classList.replace('card2', 'card2-selected')
            // greenCheck.classList.remove('d-none')
            addToCategories(id)
        } else if (card.classList.contains('card2-selected')) {
            card.classList.replace('card2-selected', 'card2')
            greenCheck.classList.add('d-none')
            removeFromCategories(id)
        }
    }

    const addToCategories = (id) => {
        let categoriesCopy = { ...categories };
        let category_list = Object.keys(categories);
        let category_booleans = Object.values(categories);
        const card = document.getElementById(`${id}-card2`)
        const greenCheck = document.getElementById(`${id}-green-checkbox`)
        console.log(category_list[id])
        let true_count = category_booleans.filter(val => val === true).length;
        let maxCategoryError = document.getElementById('maxCategoryError')
        if (true_count > 2) {
            maxCategoryError.classList.remove('d-none')
            console.log('max interests reached')
        } else {
            card.classList.replace('card2', 'card2-selected')
            greenCheck.classList.remove('d-none')
            categoriesCopy[category_list[id]] = true;
            setCategories(categoriesCopy);
        }
    }
    const removeFromCategories = (id) => {
        let categoriesCopy = { ...categories };
        let category_list = Object.keys(categories);
        categoriesCopy[category_list[id]] = false;
        setCategories(categoriesCopy);
    }

    const updateFirestore = () => {
        // userId should be auth.currentUser.uid
        let userId = auth.currentUser.uid ? auth.currentUser.uid : "testUser2"
        let userPreferences = { ...categories, uid: userId }
        setDoc(doc(firestore, `userPreferences/${userId}`), userPreferences)
        console.log("firestore updated!")
        progressLoadingAnimationStall()
        completeSurvey()

    }

    const updateUserPreferences = () => {
        setUserPreferences(categories)
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
                        <p className="sign-up m-0 mt-1">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sign Up&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                    </div>
                    <div className="point">
                        <div className="progress-bar-node-empty node-frame center position-relative">

                            <div id='node-flex' className="progress-bar-node-flex">
                                <span id='progress-checkmark2' className="material-symbols-outlined white-text m-auto o-none">
                                    check
                                </span>
                            </div>
                        </div>
                        <p className="sign-up m-0 mt-1">Travel Preferences</p>
                    </div>
                    <div className="point">
                        <div className="progress-bar-node-empty node-frame center position-relative">
                            <div id='node2-flex' className="progress-bar-node-flex"></div>
                        </div>
                        <p className="sign-up m-0 mt-1">Start Planning!</p>
                    </div>
                    <div id='progress-bar-full' className="progress-bar-full"></div>
                    <div className="progress-bar-empty"></div>
                </div>
            </div>
            <div className="page-container90">
                {/* <h1 className="page-title">Personalize your recommendations</h1> */}
                {/* <p className="page-text">Routewise suggests places and activities based on your interests and preferences.</p> */}
                <h1 className="page-title">Set up your traveler profile</h1>
                <p className="page-text">Adventure awaits! How do you prefer to explore the world?</p>
                <p className="page-text">Select up to <strong>3 categories</strong> <span id='maxCategoryError' className="red-text bold500 ml-1 d-none">(Please select a maximum of 3 categories)<span className="material-symbols-outlined red-text v-ttop">
                    error
                </span></span></p>
                <div className="cards flx-r flx-wrap just-ce">
                    {cards2.map((card2, index) => {
                        return <div onClick={() => toggleSelection(index)} key={index} id={`${index}-card2`} className="card2 mx2 my-3 position-relative">
                            <div id={`${index}-green-checkbox`} className="green-checkbox d-none">
                                <span className="material-symbols-outlined white-text m-auto">
                                    check
                                </span>
                            </div>
                            <img src={card2.imgUrl} alt="" className="card2-img mt-2" />
                            <div className="card2-text flx-1">
                                <div className="card2-title center-text w-80 m-auto dark-text">{card2.title}</div>
                            </div>
                        </div>
                    })}

                </div>
                <button onClick={() => { updateFirestore(), updateUserPreferences(), openContinueOverlay() }} className="btn-primaryflex2 right mt-3">
                    <p className='inline'>Continue</p>
                    <span className="material-symbols-outlined arrow v-bott ml-2">
                        arrow_forward
                    </span>
                </button>
            </div>
        </>
    )
}
