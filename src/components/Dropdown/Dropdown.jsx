import React, { useContext, useEffect, useRef, useState } from 'react'
import './dropdown.scoped.css'
import { DataContext } from '../../Context/DataProvider'
import DaySelector from '../DaySelector';
import { DaySelection } from '../DaySelection/DaySelection';

const Dropdown = ({ open, itemsList, day, tripState, setTripState, renderLocation, openConfirmationModal, pointerRef, confirmationModalRef, onClose }) => {
  if (!open) return null;

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
    }
    if (action === "move places") {
      return "Move all places to:";
    }
  };
  const handleClick = (prompt) => {
    if (typeof prompt === "string") {
      let category = prompt.split(":")[0]
      let action = prompt.split(":")[1]
      if (category === "daySelection") {
        setDaySelectionProps({
          action: action,
          titleText: actionToTitleText(action)
        })
        setDaySelectionOpen(true);
      }
    }
  };

  // click outside
  const dropdownRef = useRef(null);
  const handleClickOutside = (e) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target)
    ) {
      if (!pointerRef || !pointerRef.current.contains(e.target)) {
        if (!confirmationModalRef || !confirmationModalRef.current.contains(e.target)) {
        onClose()
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClickOutside, true)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])


  return (
    <div ref={dropdownRef} onClick={(e) => e.stopPropagation()} className="dropdown">
      {/* itemsList.headers ? */}
      {itemsList.options.map((item, index) => {
        let isFirst = index === 0;
        return <div
          key={index}
          onClick={() => handleClick(item.clickFunction)}
          className={`option ${isFirst && "noTopBorder"}`}
        >
          {item.gIconPrompt &&
            <span className={gIcon + " large"}>{item.gIconPrompt}</span>
          }
          <p className="text">{item.itemName}</p>
        </div>
      })}
      <DaySelection
        open={daySelectionOpen}
        tripState={tripState}
        setTripState={setTripState}
        sourceDay={day}
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