import React, { useState } from 'react'
import { PlaceCard } from './PlaceCard'
import { Link } from 'react-router-dom'
import { SearchPlace } from './SearchPlace'
import { PlaceCardDraggable } from './PlaceCardDraggable'

export const FlowBox = ({ id, addSearchOpen, addSearchClose, toggleFlow, day }) => {
    
    
    return (
        <div id={`flowBox-${id}`} className="flow-box">

            <div className="flow-header">
                <p className="page-subheading-bold m-0">
                    <span id={`expandArrow-${id}`} onClick={() => toggleFlow(id)} className="material-symbols-outlined xx-large v-align symbol pointer td-2">
                        expand_more
                    </span>
                    {day.day}</p>
                <input type="text" className="input-special italic-placeholder bold-placeholder ml-5" placeholder='Add subheading' />
            </div>
            <div id={`flow-${id}`} className="flowBody-collapsible">
                <div id={`flowBody-${id}`} className="flowBody ml-5 w-90">
                    {day.places.map((place, i) => {
                        return <div key={i}>
                            <PlaceCardDraggable id={i} place={place} />
                        </div>
                    })}


                    <div id={`addPlace-expand-${id}`} className="addPlace-expand ml- m-auto">
                        <Link onClick={() => addSearchOpen(id)} id={`addPlacesBtn-${id}`} className=''>
                            <p className="right-text m-0"><span className="material-symbols-outlined v-bott mx-2 purple-text">
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
