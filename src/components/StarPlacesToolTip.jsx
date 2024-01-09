import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useContext, useEffect } from 'react'
import { Fade, Slide } from 'react-awesome-reveal';
import { firestore } from '../firebase';
import { DataContext } from '../Context/DataProvider';

const StarPlacesToolTip = ({ open, currentTrip, onClose }) => {
    if (!open) return null
    const { user, setUser } = useContext(DataContext);

    useEffect(() => {
        console.log(user)
    }, [])

    const updateFirstPlaceAdded = async () => {
        let uid = user ? user.uid : "testUser"
        let dontShow = document.getElementById('dontShowCheckbox')
        // await getDoc, from doc(firestone, path)
        let firstDoc = await getDoc(doc(firestore, `firstTimeUser/${uid}`))
        // get data from doc
        let firstData = firstDoc.data()
        // console.log(firstData)
        if (dontShow.checked) {
            if (firstData) {
                firstData.firstPlaceAdded = false
            }
            // console.log('checked')
        } else {
            if (firstData) {
                firstData.firstPlaceAdded = true
            }
            // console.log('unchecked')
        }
        if (firstData) {
            setDoc(doc(firestore, `firstTimeUser/${uid}`), firstData)
        }
    }


    return (
        <div className="overlay-placeholder">
            <Fade className='z-99999' duration={200} triggerOnce>
                <div className="overlay">
                    <div className="toolTip-modal">
                        <p className="m-0 page-subheading-bold">Tip: Prioritize your must-go places</p>
                        <p className="m-0 page-text bold500">Star <i>must-go</i> places so we can make sure these are included in your itinerary</p>
                        <img src="https://i.imgur.com/DLgJ5sS.png" alt="" className='' />
                        <div className="flx-r gap-3 aligns-l ml15">
                            <input id='dontShowCheckbox' onClick={() => updateFirstPlaceAdded()} type="checkbox" className='checkbox-medium' />
                            <p className="m-0 page-text">Don't show this again</p>
                        </div>

                        <button onClick={() => onClose()} className="btn-primaryflex">Got it!</button>
                    </div>
                </div>
            </Fade>
        </div>
    )
}
export default StarPlacesToolTip;