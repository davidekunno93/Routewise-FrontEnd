import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../Context/DataProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Survey = () => {
    // login require
    const { user, setUser } = useContext(DataContext);
    const [categories, setCategories] = useState(
        {
            landmarks: false,
            nature: false,
            shopping: false,
            food: false,
            spa: false,
            entertainment: false,
            art: false
        }
    );

    const navigate = useNavigate()

    const completeSurvey = () => {
        sendData()
        progressLoadingAnimation()
        wait(2000).then(() => {
            navigate('/dashboard')
        })
    }

    const sendData = async () => {
        let data = {
            uid: user.uid,
            categories: categories
        }
        console.log(data)
        const response = await axios.post('https://routewise-backend.onrender.com/profile/user_info', JSON.stringify(data), {
            headers: {"Content-Type" : "application/json"}
        }).then((response) => console.log(response))
        .catch((error) => console.log(error))
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

    const progressAnimation = () => {
        const progressBar = document.getElementById('progress-bar-full')
        const nodeFlex = document.getElementById('node-flex')
        progressBar.style.width = '45%'
        wait(900).then(() => {
            nodeFlex.style.width = '30px'
            nodeFlex.style.height = '30px'
        })
    }
    const progressLoadingAnimation = () => {
        const progressBar = document.getElementById('progress-bar-full')
        const node2Flex = document.getElementById('node2-flex')
        const progressCheckmark2 = document.getElementById('progress-checkmark2')
        progressBar.style.transition = '1.5s ease'
        progressCheckmark2.classList.remove('o-none')
        wait(200).then(() => {
            progressBar.style.width = '93%'
        })
        wait(1500).then(() => {
            progressBar.style.transition = '1.0s ease'
            node2Flex.style.width = '30px'
            node2Flex.style.height = '30px'
        })
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
        // console.log(category_list[id])
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

    return (
        <>
            <div className="progress-bar-container">
                <div className="progress-bar w-95 m-auto flx-r just-sb my-5">
                    <div className="point">
                        <div className="progress-bar-node center">
                            <span id='progress-checkmark' className="material-symbols-outlined white-text m-auto o-none">
                                check
                            </span>
                        </div>
                        <p className="sign-up m-0 mt-1">Sign Up</p>
                    </div>
                    <div className="point">
                        <div className="progress-bar-node-empty node-frame center position-relative">
                            {/* <div className="node-frame five"></div> */}
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
                <h1 className="page-title">Personalize your recommendations</h1>
                <p className="page-text">Routewise suggests places and activities based on your interests and preferences.</p>
                <p className="page-text">Select up to <strong>3 categories</strong> <span id='maxCategoryError' className="red-text bold500 ml-1 d-none">(Please select a maximum of 3 categories)<span className="material-symbols-outlined red-text v-bott">
                    error
                </span></span></p>
                <div className="cards flx-r flx-wrap just-ce">
                    {cards2.map((card2, index) => {
                        return <div onClick={() => toggleSelection(index)} key={index} id={`${index}-card2`} className="card2 mx-4 my-3 position-relative">
                            <div id={`${index}-green-checkbox`} className="green-checkbox d-none">
                                <span className="material-symbols-outlined white-text m-auto">
                                    check
                                </span>
                            </div>
                            <img src={card2.imgUrl} alt="" className="card2-img mt-2" />
                            <div className="card2-text flx-1">
                                <div className="card2-title center-text w-80 m-auto">{card2.title}</div>
                            </div>
                        </div>
                    })}

                </div>
                <button onClick={() => completeSurvey()} className="btn-primaryflex2 right mt-3">
                    <p className='inline'>Continue</p>
                    <span className="material-symbols-outlined v-bott ml-2">
                        arrow_forward
                    </span>
                </button>
            </div>
        </>
    )
}
