import React, { useContext, useEffect, useRef, useState } from 'react'
import './dropdown.scoped.css'
import { DataContext } from '../../Context/DataProvider'
import DaySelector from '../DaySelector';
import { DaySelection } from '../DaySelection/DaySelection';

const Dropdown = ({ open, itemsList, day, place, addPlace, tripState, setTripState, renderLocation, openConfirmationModal, pointerRef, confirmationModalRef, offsetX, onClose }) => {
  if (!open) return null;
  // propsKey = {
    // open: state
    // onClose: close open state
    // itemsList: [{header: {}?, options: [{itemName: "", gIconPrompt: "", clickFunction: func}]}]
    // renderLocation?: "itinerary" || "map" - needed if opening daySelection
    // day? - only needed if dropdown is on flowbox or other day capturing element
    // place?
    // addPlace?
    // openConfirmationModal?
    // confirmationModalRef?
    // pointerRef?
    // offsetX?
  // }

  // imports
  const { gIcon } = useContext(DataContext);

  // [day selection popup code]
  const [daySelectionOpen, setDaySelectionOpen] = useState(false);
  const [daySelectionProps, setDaySelectionProps] = useState({
    action: "",
    titleText: "",
  });
  const actionToTitleText = (action) => {
    if (action === "swap days") {
      return "Swap day with:";
    };
    if (action === "move places") {
      return "Move all places to:";
    };
    if (action === "add place" || action === "add place from saved") {
      return "Add to:"
    }
  };
  const handleClick = (param) => {
    if (typeof param === "string") {
      let prompt = param;
      let category = prompt.split(":")[0];
      let action = prompt.split(":")[1];
      if (category === "daySelection") {
        setDaySelectionProps({
          action: action,
          titleText: actionToTitleText(action)
        });
        setDaySelectionOpen(true);
      }
    } else if (typeof param === 'object') {
      let clickFunction = param;
      let functionCall = clickFunction.function;
      let params = clickFunction.params;
      functionCall(...params);
      onClose();
    }
  };

  // click outside
  const dropdownRef = useRef(null);
  const handleClickOutside = (e) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target)
    ) {
      if (!pointerRef || !pointerRef.current || !pointerRef.current.contains(e.target)) {
        if (!confirmationModalRef || !confirmationModalRef.current || !confirmationModalRef.current.contains(e.target)) {
        onClose();
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClickOutside, true);
    return () => window.removeEventListener('click', handleClickOutside)
  }, []);


  return (
    <div ref={dropdownRef} onClick={(e) => e.stopPropagation()} className="dropdown" style={{ right: offsetX ? typeof offsetX === 'string' ? offsetX : offsetX.toString()+"px" : "" }}>
      {/* itemsList.headers ? */}
      {itemsList.options.map((item, index) => {
        let isFirst = index === 0;
        return <div
          key={index}
          onClick={() => handleClick(item.clickFunction)}
          className={`option ${isFirst && "noTopBorder"}`}
        >
          {item.gIconPrompt &&
            <span className={gIcon} style={{ color: item.textColor ?? "" }}>{item.gIconPrompt}</span>
          }
          <p className="text" style={{ color: item.textColor ?? "" }}>{item.itemName}</p>
        </div>
      })}
      <DaySelection
        open={daySelectionOpen}
        tripState={tripState}
        setTripState={setTripState}
        sourceDay={day}
        place={place}
        addPlace={addPlace}
        renderLocation={renderLocation}
        titleText={daySelectionProps.titleText}
        action={daySelectionProps.action}
        openConfirmationModal={openConfirmationModal}
        onClose={() => setDaySelectionOpen(false)}
        closeTree={onClose}
      />
    </div>
  )
}
export default Dropdown;