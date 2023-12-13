import React, { useContext, useEffect } from 'react'
import { Loading } from '../Loading'
import { updateProfile } from 'firebase/auth'
import { auth } from '../../firebase'
import { useNavigate } from 'react-router-dom'
import { DataContext } from '../../Context/DataProvider'
import axios from 'axios'



export const AuthLoadingScreen = ({ loading, displayName, onClose, closeAll }) => {
    if (!loading) return null
    const { user, setUser } = useContext(DataContext);
    const navigate = useNavigate()

    function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
    
    // const sendDataTest = async () => {
    //     let data = {
    //         uid: 'authUser.uid',
    //         displayName: 'authUser.displayName',
    //         email: 'authUser.email',
    //         // photoURL: authUser.photoURL
    //     }
    //     console.log(data)
    //     const response = await axios.post("https://routewise-backend.onrender.com/profile/user", JSON.stringify(data) , {
    //         headers : {"Content-Type" : "application/json"}
    //     }).then((response => console.log(response)))
    //     .catch((error) => console.log(error))
    // }
    
    const sendData = async () => {
        let authUser = auth.currentUser
        let data = {
            uid: authUser.uid,
            displayName: authUser.displayName,
            email: authUser.email,
            // photoURL: authUser.photoURL
        }
        console.log(data)
        const response = await axios.post("https://routewise-backend.onrender.com/profile/user", JSON.stringify(data) , {
            headers : {"Content-Type" : "application/json"}
        })
        // .then((response => handleData(response)))
        // .catch((error) => console.log(error))
        return response.status === 200 ? completeSignIn(response) : handleError(response)
    }

    const handleError = (response) => {
        alert('Account creation not completed')
        console.log(response)
        onClose()
        // modal saying error creating your account - please try again
        // delete firebase authenticated user
    }
    const completeSignIn = (response) => {
        console.log(response)
        wait(1000).then(() => {
            // console.log(auth.currentUser)
            setUser(auth.currentUser)
            navigate('/survey')
            closeAll()
        })
    }
    useEffect(() => {
        wait(4000).then(() => {
            updateProfile(auth.currentUser, {
                displayName: displayName,
                photoURL: "https://i.imgur.com/cf5lgSl.png"
            }).then(() => {
                sendData()
                // console.log('profile name and url added!')
            }).catch((error) => {
                console.log(error)
            })
        })

    }, [])


    return (
        <>
            <div className="sign-up-loading flx-c">
                <Loading />
            </div>
        </>
    )
}
