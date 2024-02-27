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
    const [signUpIsOpen, setSignUpIsOpen] = useState(false)
    const [authIndex, setAuthIndex] = useState(null);
    
    const [pageOpen, setPageOpen] = useState(null)

    return (
        <DataContext.Provider value={{ 'pageOpen': pageOpen, 'setPageOpen': setPageOpen, 'showNavbar': showNavbar, 'setShowNavbar': setShowNavbar, 'user': user, 'setUser': setUser, 'signUpIsOpen': signUpIsOpen, 'setSignUpIsOpen': setSignUpIsOpen, 'authIndex': authIndex, 'setAuthIndex': setAuthIndex, 'userPreferences': userPreferences, 'setUserPreferences': setUserPreferences }}>
            {props.children}
        </DataContext.Provider>
    )
}
export default DataProvider;
export const DataContext = createContext();