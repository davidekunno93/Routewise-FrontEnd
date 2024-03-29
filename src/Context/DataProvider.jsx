import React, { createContext, useState } from 'react'
import { auth } from '../firebase';


const DataProvider = (props) => {
    const [showNavbar, setShowNavbar] = useState(true);
    const [user, setUser] = useState(null);
    const [userPreferences, setUserPreferences] = useState({
        landmarks: false,
        nature: false,
        shopping: false,
        food: false,
        relaxation: false,
        entertainment: false,
        arts: false
    });
    const [firstTimeUser, setFirstTimeUser] = useState({
        firstPlaceAdded: true,
        firstSignIn: true
    })
    // for itinerary page only - decides which list is being displayed
    const [placeListDisplay, setPlaceListDisplay] = useState('Itinerary') // Suggested Places, Saved Places
    const [sidebarDisplayed, setSidebarDisplayed] = useState(false);
    const showSidebar = () => {
        setSidebarDisplayed(true)
        console.log('show sidebar')
    }
    const hideSidebar = () => {
        setSidebarDisplayed(false)
        console.log('hide sidebar')
    }
    const [signUpIsOpen, setSignUpIsOpen] = useState(false)
    const [authIndex, setAuthIndex] = useState(null);

    const [pageOpen, setPageOpen] = useState(null)

    return (
        <DataContext.Provider value={{ 'pageOpen': pageOpen, 'setPageOpen': setPageOpen, 'showNavbar': showNavbar, 'setShowNavbar': setShowNavbar, 'placeListDisplay': placeListDisplay, 'setPlaceListDisplay': setPlaceListDisplay, 'sidebarDisplayed': sidebarDisplayed, 'setSidebarDisplayed': setSidebarDisplayed, 'showSidebar': showSidebar, 'hideSidebar': hideSidebar, 'user': user, 'setUser': setUser, 'signUpIsOpen': signUpIsOpen, 'setSignUpIsOpen': setSignUpIsOpen, 'authIndex': authIndex, 'setAuthIndex': setAuthIndex, 'userPreferences': userPreferences, 'setUserPreferences': setUserPreferences }}>
            {props.children}
        </DataContext.Provider>
    )
}
export default DataProvider;
export const DataContext = createContext();