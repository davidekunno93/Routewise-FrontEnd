import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DataContext } from '../Context/DataProvider';

export const SurveyUpdate = () => {
    const { user, setUser } = useContext(DataContext);
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

    useEffect(() => {
        if (user) {
            console.log(user)
        }
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




    return (
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
            <h1 className="page-title mt-2">Update your travel preference</h1>
            <p className="page-text">How do you prefer to explore?</p>
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
            <button className="btn-primaryflex2 center mt-5">
                <p className='inline'>Update Preferences</p>
            </button>
        </div>
    )
}
