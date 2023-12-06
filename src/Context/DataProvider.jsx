import React, { createContext, useState } from 'react'
import auth from '../firebase';

const DataProvider = (props) => {

    const [user, setUser] = useState(null);
    const [signUpIsOpen, setSignUpIsOpen] = useState(false)

    

    return (
        <DataContext.Provider value={{ 'user': user, 'setUser': setUser, 'signUpIsOpen': signUpIsOpen, 'setSignUpIsOpen': setSignUpIsOpen }}>
            {props.children}
        </DataContext.Provider>
    )
}
export default DataProvider;
export const DataContext = createContext();