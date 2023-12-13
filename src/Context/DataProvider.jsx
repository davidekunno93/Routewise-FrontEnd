import React, { createContext, useState } from 'react'
import { auth } from '../firebase';


const DataProvider = (props) => {

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
    const [signUpIsOpen, setSignUpIsOpen] = useState(false)

    

    return (
        <DataContext.Provider value={{ 'user': user, 'setUser': setUser, 'signUpIsOpen': signUpIsOpen, 'setSignUpIsOpen': setSignUpIsOpen, 'userPreferences': userPreferences, 'setUserPreferences': setUserPreferences }}>
            {props.children}
        </DataContext.Provider>
    )
}
export default DataProvider;
export const DataContext = createContext();