import { useContext, useEffect } from 'react';
import './preferencecard.scoped.css';
import { DataContext } from '../../Context/DataProvider';

const PreferenceCard = ({ preference, selected, toggleSelect }) => {
    const { userPreferenceItems, gIcon } = useContext(DataContext);

    
    return (
        <div onClick={() => toggleSelect(preference)} className="preference-card" data-cardselected={selected}>
            <img src={userPreferenceItems.cards[preference].imgUrl} alt="" className="preference-icon" />
            <p className="title ws-normal">
                {userPreferenceItems.cards[preference].title}
            </p>
            <div className="green-checkbox">
                <span className={gIcon}>done</span>
            </div>
        </div>
    )
}
export default PreferenceCard;