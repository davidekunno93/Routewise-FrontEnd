import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../Context/DataProvider'

const SurveyModal = () => {
    const { user, setUser } = useContext(DataContext);
    const { userPreferences, setUserPreferences } = useContext(DataContext);
    const [categories, setCategories] = useState({ ...userPreferences })

    function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    const [render, setRender] = useState(Object.values(userPreferences))

    useEffect(() => {
        console.log(userPreferences)
        console.log(render)
    }, [])

    // category selection modification
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
            // console.log('max interests reached')
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

    const updateUserPreferences = () => {
        setUserPreferences(categories)
    }

    const updateFirestore = () => {
        // userId should be auth.currentUser.uid
        let userId = auth.currentUser ? auth.currentUser.uid : "testUser2"
        let userPreferences = { ...categories, uid: userId }
        setDoc(doc(firestore, `userPreferences/${userId}`), userPreferences)
        console.log("firestore updated!")
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
    ]
    return (
        <div className="overlay-placeholder">
            <div className="overlay flx">
                <div className="survey-modal">
                    <div id='progressBarContainer' className="progress-bar-modal-container">
                        <div className="progress-bar w-95 m-auto flx-r just-sb mt-2">
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
                                <p className="sign-up m-0 mt-1">Complete</p>
                            </div>
                            <div id='progress-bar-full' className="progress-bar-full"></div>
                            <div className="progress-bar-empty"></div>
                        </div>
                    </div>
                    <div className="content">

                        <p className="m-0 title">Set up your traveler profile</p>
                        <p className="m-0">Adventure awaits! How do you prefer to explore the world?</p>
                        <p className="m-0">Select <strong>3 categories</strong></p>
                        <div className="cards flx-r flx-wrap just-ce">
                            {cards2.map((card2, index) => {
                                return <div onClick={() => toggleSelection(index)} key={index} id={`${index}-card2`} className={`${render[index] ? "card2-smaller-selected" : "card2-smaller"} mx2 my-3 position-relative`}>
                                    <div id={`${index}-green-checkbox`} className={`green-checkbox ${render[index] ? null : "d-none"}`}>
                                        <span className="material-symbols-outlined white-text m-auto">
                                            check
                                        </span>
                                    </div>
                                    <div className="card2-imgDiv">
                                        <img src={card2.imgUrl} alt="" className="card2-smaller-img" />
                                    </div>
                                    <div className="card2-text flx-1">
                                        <div className="card2-smaller-title center-text w-80 m-auto dark-text">{card2.title}</div>
                                    </div>
                                </div>
                            })}

                        </div>
                    </div>

                    <div className="flx-r position-bottom just-en gap-4">
                        <button className="btn-outlineflex">
                            <div className="align-all-items">
                                <p className='m-0 purple-text'>Skip for now</p>
                            </div>
                        </button>
                        <button onClick={() => { updateFirestore(), updateUserPreferences() }} className="btn-primaryflex2">
                            <div className="align-all-items">
                                <p className='m-0'>Continue</p>
                                <span className="material-symbols-outlined arrow">
                                    arrow_forward
                                </span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SurveyModal;