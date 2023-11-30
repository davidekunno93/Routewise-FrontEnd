import React from 'react'
import { PlaceCardDraggable } from './PlaceCardDraggable';
import { Link } from 'react-router-dom';
import { SearchPlace } from './SearchPlace';
import { Draggable, Droppable } from 'react-beautiful-dnd';


const FlowBoxDraggable = ({ id, addSearchOpen, addSearchClose, toggleFlow, day, places, removePlace }) => {

    return (
        <div id={`flowBox-${id}`} className="flow-box">

            <div className="flow-header">
                <div className="flx-r just-sb">
                    <p className="page-subheading-bold m-0">
                        <span id={`expandArrow-${id}`} onClick={() => toggleFlow(id)} className="material-symbols-outlined xx-large v-align symbol pointer td-2">
                            expand_more
                        </span>
                        {day.day}</p>
                    <p id={`placeCount-${id}`} className="gray-text bold500 td-2 o-none">{day.placeIds.length} {day.placeIds.length === 1 ? "place" : "places"}</p></div>
                <input type="text" className="input-special italic-placeholder bold-placeholder ml-5" placeholder='Add subheading' />
            </div>
            <div id={`flow-${id}`} className="flowBody-collapsible">
                <div id={`flowBody-${id}`} className="flowBody ml-5 w-90">
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
