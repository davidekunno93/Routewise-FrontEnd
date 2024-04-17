import React, { createContext, useEffect, useState } from 'react'
import { auth, firestore } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';


const DataProvider = (props) => {
    const [showNavbar, setShowNavbar] = useState(true);
    const [user, setUser] = useState(null);
    const [userPreferences, setUserPreferences] = useState({
        landmarks: false,
        nature: false,
        shopping: false,
        food: false,
        nightclub: false,
        relaxation: false,
        entertainment: false,
        arts: false
    });

    useEffect(() => {
        if (auth.currentUser) {
            setPreferences()
        }
    }, [auth])
    const setPreferences = async () => {
        let prefs = await getDoc(doc(firestore, `userPreferences/${auth.currentUser.uid}`))
        // console.log(prefs.data())
        prefs = prefs.data()
        let userPref = {
            landmarks: prefs ? prefs.landmarks : false,
            nature: prefs ? prefs.nature : false,
            shopping: prefs ? prefs.shopping : false,
            food: prefs ? prefs.food : false,
            nightclub: prefs ? prefs.nightclub ? prefs.nightclub : false : false,
            relaxation: prefs ? prefs.relaxation : false,
            entertainment: prefs ? prefs.entertainment : false,
            arts: prefs ? prefs.arts : false
        }
        // console.log(userPref)
        setUserPreferences(userPref)
    }
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
    const [signUpIsOpen, setSignUpIsOpen] = useState(false);
    const [authIndex, setAuthIndex] = useState(null);

    const [pageOpen, setPageOpen] = useState(null);

    // logout code currently disabled
    const logOut = () => {
        // window.localStorage.removeItem("userData");
        // window.localStorage.removeItem("userPref");
        // window.localStorage.removeItem("isLoggedIn");
        // console.log('remove loggedIn')
        signOut(auth).then(() => {
            console.log("user signed out")
        })
        console.log("this btn")
        // signOut(auth).then(() => {
            // console.log("user signed out")
            // setUser(null);
            // setLogoutStandby(true);
        // })
    }
    const [logoutStandby, setLogoutStandby] = useState(false);
    useEffect(() => {
        if (logoutStandby && !user) {
            // navigate('/') // can't navigate on a link element
            console.log("auth : ", auth)
            console.log("user: ", user)
        }
    }, [logoutStandby])

    return (
        <DataContext.Provider value={{ 'pageOpen': pageOpen, 'setPageOpen': setPageOpen, 'showNavbar': showNavbar, 'setShowNavbar': setShowNavbar, 'placeListDisplay': placeListDisplay, 'setPlaceListDisplay': setPlaceListDisplay, 'sidebarDisplayed': sidebarDisplayed, 'setSidebarDisplayed': setSidebarDisplayed, 'showSidebar': showSidebar, 'hideSidebar': hideSidebar, 'user': user, 'setUser': setUser, 'signUpIsOpen': signUpIsOpen, 'setSignUpIsOpen': setSignUpIsOpen, 'authIndex': authIndex, 'setAuthIndex': setAuthIndex, 'userPreferences': userPreferences, 'setUserPreferences': setUserPreferences, 'setPreferences': setPreferences }}>
            {props.children}
        </DataContext.Provider>
    )
}
export default DataProvider;
export const DataContext = createContext();