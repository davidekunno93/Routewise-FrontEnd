import React, { useContext, useEffect } from 'react'
import { Loading } from '../Loading'
import { updateProfile } from 'firebase/auth'
import auth from '../../firebase'
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
    const completeSignIn = () => {
        sendData()
        wait(1000).then(() => {
            // console.log(auth.currentUser)
            setUser(auth.currentUser)
            navigate('/survey')
            closeAll()
        })
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
    // sendDataTest()
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
        }).then((response => console.log(response)))
        .catch((error) => console.log(error))
    }
    useEffect(() => {
        wait(4000).then(() => {
            updateProfile(auth.currentUser, {
                displayName: displayName,
                photoURL: "https://i.imgur.com/cf5lgSl.png"
            }).then(() => {
                completeSignIn()
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
