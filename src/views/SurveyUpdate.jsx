import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DataContext } from '../Context/DataProvider';
import { auth, firestore } from '../firebase';
import { collection, setDoc, doc, getDoc } from 'firebase/firestore';
import { Fade, Slide } from 'react-awesome-reveal';

export const SurveyUpdate = () => {
    const { user, setUser } = useContext(DataContext);
    const { userPreferences, setUserPreferences } = useContext(DataContext);
    const [categories, setCategories] = useState(
        { ...userPreferences }
        // {
        //     landmarks: false,
        //     nature: false,
        //     shopping: false,
        //     food: false,
        //     relaxation: false,
        //     entertainment: false,
        //     arts: false
        // }
    );

    const [render, setRender] = useState(Object.values(userPreferences))

    useEffect(() => {
        if (user) {
            console.log(user)
        }
        // get the prefs in userPrefs, get the ids of those that have value of true
        // let userPrefArr = Object.entries(userPreferences)
        // // console.log(userPrefArr)
        // let i = 0
        // let true_indices = []
        // for (let [key, value] of userPrefArr) {
        //     if (value) {
        //         console.log(key)
        //         true_indices.push(i)
        //     }
        //     i++
        // }
        // // loop thru those ids and run toggleSelection func on those ids
        // for (let i=0;i<true_indices.length;i++) {
        //     // toggleSelection(true_indices[i])
        // }

        console.log(render)

    }, [])



    const navigate = useNavigate()
    const goBack = () => {
        navigate(-1)
    }

    const cards2 = [
        {
            imgUrl: 'https://i.imgur.com/FvhWwnV.png',
            title: 'Landmarks & Attractions'
        },
        {
            imgUrl: 'https://i.imgur.com/8imPNfF.png',
            title: 'Nature'
        },
        {
            imgUrl: 'https://i.imgur.com/oGV9gqi.png',
            title: 'Shopping'
        },
        {
            imgUrl: 'https://i.imgur.com/dTAAsWU.png',
            title: 'Food & Nightlife'
        },
        {
            imgUrl: 'https://i.imgur.com/3UOXniG.png',
            title: 'Spa & Relaxation'
        },
        {
            imgUrl: 'https://i.imgur.com/3WPIK0i.png',
            title: 'Music & Entertainment'
        },
        {
            imgUrl: 'https://i.imgur.com/BdhaXO4.png',
            title: 'Arts & Culture'
        }
    ]




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

    function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
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
            uid: "testing"
        })
    }

    // const [userPreferecnces, setUserPreferences] = useState({...categories, uid: 1234})

    const updateUserPreferences = () => {
        setUserPreferences(categories)
    }

    const updateFirestore = () => {
        // userId should be auth.currentUser.uid
        let userId = auth.currentUser.uid ? auth.currentUser.uid : "testUser2" 
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
                {/* <h1 className="page-title">Personalize your recommendations</h1> */}
                {/* <p className="page-text">Routewise suggests places and activities based on your interests and preferences.</p> */}
                <div onClick={() => goBack()} className="inline-block">
                    <div className="flx-r mt-4 onHover-fade">
                        <span className="material-symbols-outlined purple-text mr-2">
                            arrow_back
                        </span>
                        <p className="page-text m-0 purple-text">Back</p>
                    </div>
                </div>
                <h1 onClick={() => openUpdatedOverlay()} className="page-title mt-2">Update your travel preferences</h1>
                <p className="page-text">How do you prefer to explore?</p>
                <p className="page-text">Select up to <strong>3 categories</strong> <span id='maxCategoryError' className="red-text bold500 ml-1 d-none">(Please select a maximum of 3 categories)<span className="material-symbols-outlined red-text v-ttop">
                    error
                </span></span></p>
                <div className="cards flx-r flx-wrap just-ce">
                    {cards2.map((card2, index) => {
                        return <div onClick={() => toggleSelection(index)} key={index} id={`${index}-card2`} className={`${render[index] ? "card2-selected" : "card2"} mx2 my-3 position-relative`}>
                            <div id={`${index}-green-checkbox`} className={`green-checkbox ${render[index] ? null : "d-none"}`}>
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
                <button onClick={() => { updateFirestore(); updateUserPreferences(); openUpdatedOverlay()}} className="btn-primaryflex2 center mt-5">
                    <p className='inline'>Update Preferences</p>
                </button>
            </div>
        </>
    )
}
