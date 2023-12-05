import React, { useEffect, useState } from 'react'
import { PlaceCardDraggable } from './PlaceCardDraggable';
import { Link } from 'react-router-dom';
import { SearchPlace } from './SearchPlace';
import { Draggable, Droppable } from 'react-beautiful-dnd';


const FlowBoxDraggable = ({ id, addSearchOpen, addSearchClose, toggleFlow, day, places, removePlace }) => {

    const [dayTitle, setDayTitle] = useState('')


    const updateDayTitle = (e) => {
        setDayTitle(e.target.value)
    }

    useEffect(() => {
        let editOverlay = document.getElementById(`editOverlay-${id}`)
        let dayTitleInput = document.getElementById(`dayTitleInput-${id}`)
        if (dayTitle.length > 0) {
            editOverlay.classList.add('d-none')
        } else if (dayTitle.length === 0) {
            editOverlay.classList.remove('d-none')
        }
        if (dayTitle.length >= 32) {
            dayTitleInput.value = dayTitle.slice(0, 32)
            // console.log(">31")
        }
    }, [dayTitle])

    return (
        <div id={`flowBox-${id}`} className="flow-box">

            <div className="flow-header">
                <div onClick={() => toggleFlow(id)} className="flx-r just-sb pointer">
                    <p className="page-subheading-bold smallertext975-respond m-0">
                        <span id={`expandArrow-${id}`} className="material-symbols-outlined xx-large v-align symbol td-2">
                            expand_more
                        </span>
                        {day.day.split(' ')[0]} <span className="smalltext-respond"> {day.day.split(' ')[1]} {day.day.split(' ')[2]}</span></p>
                    <p id={`placeCount-${id}`} className="gray-text bold500 placeCount ws-nowrap td-2 o-none">{day.placeIds.length} {day.placeIds.length === 1 ? "place" : "places"}</p></div>
                <div className="addTitle-input position-relative">
                    <input onChange={(e) => updateDayTitle(e)} id={`dayTitleInput-${id}`} type="text" className="input-special italic-placeholder bold-placeholder ml-5" placeholder='Add subheading' />
                    <label id={`editOverlay-${id}`} htmlFor={`dayTitleInput-${id}`}><span className="material-symbols-outlined o-50 edit-overlay">
                        edit
                    </span></label>
                </div>
            </div>
            <div id={`flow-${id}`} className="flowBody-collapsible">
                <div id={`flowBody-${id}`} className="flowBody ml-5-respond w-90">
                    <Droppable droppableId={day.id}>
                        {(droppableProvided, droppableSnaphot) => (

                            <div className="droppableSpace" ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
                                {places.map((place, i) => (
                                    <Draggable key={place.id} draggableId={`${place.id}`} index={i} >
                                        {(draggableProvided, draggableSnapshot) => (
                                            <div ref={draggableProvided.innerRef} {...draggableProvided.draggableProps} {...draggableProvided.dragHandleProps} key={i}>
                                                <PlaceCardDraggable id={i} place={place} removePlace={removePlace} dayId={day.id} draggableSnapshot={draggableSnapshot} />
                                            </div>
                                        )}

                                    </Draggable>
                                ))}
                                {droppableProvided.placeholder}
                            </div>

                        )}
                    </Droppable>


                    <div id={`addPlace-expand-${id}`} className="addPlace-expand m-auto mt-2">
                        <Link onClick={() => addSearchOpen(id)} id={`addPlacesBtn-${id}`} className='onHover-fadelite'>
                            <p className="right-text m-0 purple-text"><span className="material-symbols-outlined v-bott mx-2 purple-text">
                                add
                            </span>
                                Add Places</p>
                        </Link>
                        <div id={`searchBar-${id}`} className="searchPlace w-100 o-none d-none td-4 flx-r">
                            <div className="flx-c">
                                <span onClick={() => addSearchClose(id)} className="material-symbols-outlined mt-4 pointer onHover-fade o-50">
                                    close
                                </span>
                            </div>
                            <SearchPlace />
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}
export default FlowBoxDraggable;
