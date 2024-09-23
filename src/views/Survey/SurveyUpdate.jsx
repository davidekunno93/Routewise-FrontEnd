import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { DataContext } from '../../Context/DataProvider';
import { auth, firestore } from '../../firebase';
import { collection, setDoc, doc, getDoc } from 'firebase/firestore';
import { Fade, Slide } from 'react-awesome-reveal';
import './survey.scoped.css';

export const SurveyUpdate = () => {
    const location = useLocation();
    const state = location.state;
    // returnPage captures the page to return to if applicable
    const returnPage = state ? state.returnPage : null;
    const { user, setUser } = useContext(DataContext);
    const { mobileMode, mobileModeNarrow } = useContext(DataContext);
    const { userPreferences, setUserPreferences, userPreferenceItems } = useContext(DataContext);
    // the userPreferences being set on the page before updating the actual userPreferences
    const [categories, setCategories] = useState(
        { ...userPreferences }
        // {
        //     landmarks: false,
        //     nature: false,
        //     shopping: false,
        //     food: false,
        //     relaxation: false,
        //     entertainment: false,
        //     arts: false,
        //     nightclub: false,
        // }
    );

    const [render, setRender] = useState(Object.values(userPreferences))

    useEffect(() => {
        if (user) {
            console.log(user);
            console.log(userPreferences);
        }
    }, [])



    const navigate = useNavigate()
    const goBack = () => {
        if (returnPage) {
            navigate(returnPage);
        } else {
            navigate(-1);
        }
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




    // category selection modification
    const toggleSelection = (userPreference) => {
        let categoryCopy = { ...categories };
        let maxCategoryErrorMessage = document.getElementById('maxCategoryError');

        if (categoryCopy[userPreference] === true) {
            categoryCopy[userPreference] = false;
            setCategories(categoryCopy);
        } else if (categoryCopy[userPreference] === false) {
            let selectedCategoryCount = Object.values(categories).filter(bool => bool === true).length;
            // userPreferences max limit = 3
            if (selectedCategoryCount >= 3) {
                maxCategoryErrorMessage.classList.remove('d-none');
            } else {
                categoryCopy[userPreference] = true;
                setCategories(categoryCopy);
            };
        }
    }




    const setfb = async () => {
        // const userPref = doc(firestore, 'userPreferences', 'testUser')
        // const docSnap = await getDoc(userPref);
        // console.log("Doc data", docSnap.data())

        setDoc(doc(firestore, "userPreferences/testUser"), {
            landmarks: false,
            nature: false,
            food: false,
            shopping: false,
            spa: false,
            entertainment: false,
            arts: false,
            nightclub: false,
            uid: "testing"
        })
    }

    // const [userPreferecnces, setUserPreferences] = useState({...categories, uid: 1234})

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

    const getUserPref = async () => {
        // if doc not in firestore, the returned doc will be undefined but no error will run
        // userId should be auth.currentUser.uid
        let userId = auth.currentUser.uid ? auth.currentUser.uid : "testUser2"
        const userPref = await getDoc(doc(firestore, `userPreferences/${userId}`))
        console.log(userPref.data())
    }

    const openUpdatedOverlay = () => {
        let updatedOverlay = document.getElementById('updatedOverlay')
        updatedOverlay.classList.remove('d-none')
    }
    const closeUpdatedOverlay = () => {
        let updatedOverlay = document.getElementById('updatedOverlay')
        updatedOverlay.classList.add('d-none')
    }

    return (
        <>
            <div id='updatedOverlay' className="overlay-white flx td-3 d-none">
                <Slide duration={400} className='m-auto' direction='up' triggerOnce>
                    <Fade triggerOnce>
                        <p className="purple-text center-text page-heading-bold m-auto">Travel Preferences Updated!</p>
                        <div className="flx-r mt-3 just-ce">
                            <button onClick={() => closeUpdatedOverlay()} className="btn-outlineflex mx-2">Keep Editing</button>
                            <button onClick={() => goBack()} className="btn-primaryflex mx-2">Go Back</button>
                        </div>
                    </Fade>
                </Slide>
            </div>

            <div className="page-container90">
                <div onClick={() => goBack()} className="inline-block">
                    <div className="flx-r mt-4 onHover-fade">
                        <span className="material-symbols-outlined purple-text mr-2">
                            arrow_back
                        </span>
                        <p className="page-text m-0 purple-text">Back</p>
                    </div>
                </div>
                <div className="title-section">
                    <h1 onClick={() => openUpdatedOverlay()} className="page-title mt-2">Update your travel preferences</h1>
                    <div className="subtitle-text">
                        <p className={`${mobileModeNarrow ? "medium" : "page-text"}`}>How do you prefer to explore?</p>
                        <p className={`${mobileModeNarrow ? "smedium" : "page-text"}`}>Select up to <strong>3 categories</strong> <span id='maxCategoryError' className="red-text bold500 ml-1 d-none">(Please select a maximum of 3 categories)<span className="material-symbols-outlined red-text v-ttop">
                            error
                        </span></span></p>
                    </div>
                </div>
                <div className="cards-list">
                    {userPreferenceItems.order.map((userPreference, index) => {
                        let card = userPreferenceItems.cards[userPreference];
                        return <div
                            onClick={() => toggleSelection(userPreference)}
                            key={index}
                            className={`card2 ${categories[userPreference] ? "selected" : "unselected"} ${mobileModeNarrow && "flex"}`}
                        >
                            <div className="green-checkbox">
                                <span className="material-symbols-outlined white-text m-auto">
                                    check
                                </span>
                            </div>
                            <div className="card2-imgDiv">
                                <img src={card.imgUrl} alt="" className="card2-img" />
                            </div>
                            <div className="card2-text flx-1">
                                <div className="card2-title center-text w-80 m-auto dark-text">{card.title}</div>
                            </div>
                        </div>
                    })}

                </div>
                <button onClick={() => { updateFirestore(); updateUserPreferences(); openUpdatedOverlay() }} className="btn-primaryflex2 center my-5">
                    <p className='inline'>Update Preferences</p>
                </button>
            </div>
        </>
    )
}
