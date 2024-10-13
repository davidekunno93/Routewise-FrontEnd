import { useContext, useEffect } from 'react';
import './preferencecard.scoped.css';
import { DataContext } from '../../Context/DataProvider';

const PreferenceCard = ({ preference, selected, toggleSelect, cardType, checkedOnly = false, frozen = false }) => {
    // cardType = "portrait" or "landscape"
    const { mobileMode, mobileModeNarrow, userPreferenceItems, gIcon } = useContext(DataContext);


    return (
        <div
            className="preference-card"
            data-cardselected={selected}
            data-checkedonly={checkedOnly}
            data-cardtype={cardType ?? mobileModeNarrow ? "landscape" : "portrait"}
            data-frozen={frozen}
            onClick={() => !frozen && toggleSelect(preference)}
        >
            <img src={userPreferenceItems.cards[preference].imgUrl} alt="" className="preference-icon" />
            <p className="title">
                {userPreferenceItems.cards[preference].title}
            </p>
            <div className="green-checkbox">
                <span className={gIcon}>done</span>
            </div>
        </div>
    )
}
export default PreferenceCard;