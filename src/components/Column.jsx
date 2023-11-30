import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'

const Column = ({ day, places }) => {
    return (

        <div className="flx-c flx-1 six">
            <h2 className="">{day.day}</h2>
            <Droppable droppableId={day.id}>
                {(droppableProvided, droppableSnapshot) => (

                    <div className="" ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
                        {places &&
                            places.map((place, index) => (
                                <Draggable key={place.id} draggableId={`${place.id}`} index={index} >
                                    {(draggableProvided, draggableSnapshot) => (
                                        <div ref={draggableProvided.innerRef} {...draggableProvided.draggableProps} {...draggableProvided.dragHandleProps} className="w-100 seven pointer">{place.placeName}</div>
                                    )}
                                    
                                </Draggable>
                            ))}
                            {droppableProvided.placeholder}
                    </div>

                )}

            </Droppable>
        </div>
    )
}
export default Column;
