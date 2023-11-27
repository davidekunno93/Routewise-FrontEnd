import React, { createContext, useState } from 'react'
import auth from '../firebase';

const DataProvider = (props) => {

    const [user, setUser] = useState(null);

    

    return (
        <DataContext.Provider value={{ 'user': user, 'setUser': setUser }}>
            {props.children}
        </DataContext.Provider>
    )
}
export default DataProvider;
export const DataContext = createContext();