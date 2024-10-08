import { doc, getDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { auth, firestore } from '../../firebase';
import { AddPlaces } from '../../views/AddPlaces';
import { Dashboard } from '../../views/Dashboard/Dashboard';
import { Landing } from '../../views/Landing/Landing';
import { DataContext } from '../../Context/DataProvider';
import { useNavigate } from 'react-router-dom';
import PageBlock from './PageBlock';

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    useEffect(() => {
        if (auth.updateCurrentUser) {
            console.log("checking access...")
            if (!auth.currentUser || !auth.currentUser.emailVerified) {
                setPageBlockOpen(false);
                // navigate('/dashboard', { replace: true });
                // alert("Please verify your email first. Check your email for a verification link.");
                return;
            } else if (auth.currentUser && auth.currentUser.emailVerified) {
                setPageBlockOpen(false);
                console.log("email verified");
            };
        } else {
            navigate('/landing', { replace: true });
        };
    }, []);
    // const checkAccess = async () => {
    //     let uid = auth.currentUser ? auth.currentUser.uid : "no_uid";
    //     let docModel = await getDoc(doc(firestore, `itineraryAccess/${uid}`))
    //     let docData = docModel.data();
    //     if (docData && docData.hasAccess) {
    //         // no blockage
    //         console.log("user has access")
    //         setPageBlockOpen(false);
    //     } else {
    //         console.log("no access - navigate to landing");
    //         navigate('/dashboard', { replace: true });
    //         return "nope"
    //     }
    // };
    // const checkEmailVerified = () => {
    //     if (!auth.currentUser) {
    //         console.log("no user");
    //         navigate('/dashboard', { replace: true });
    //         return "nope"
    //     } else {
    //         if (!auth.currentUser.emailVerified) {
    //             console.log("email not verified");
    //             navigate('/dashboard', { replace: true });
    //             return "nope"
    //         } else {
    //             setPageBlockOpen(false);
    //             console.log("email verified");
    //         }
    //     }
    // }

    const [pageBlockOpen, setPageBlockOpen] = useState(true);

    return <>
        <PageBlock open={pageBlockOpen} loading={true} />
        {children}
    </>

}
export default ProtectedRoute;