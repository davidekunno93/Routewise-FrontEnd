import { doc, getDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { auth, firestore } from '../../firebase';
import { AddPlaces } from '../../views/AddPlaces';
import { Dashboard } from '../../views/Dashboard';
import { Landing } from '../../views/Landing';
import { DataContext } from '../../Context/DataProvider';
import { useNavigate } from 'react-router-dom';
import PageBlock from './PageBlock';

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    useLayoutEffect(() => {
        if (auth.updateCurrentUser) {
            checkAccess()
        } else {
            navigate('/landing', { replace: true });
        }
    }, [])
    const checkAccess = async () => {
        let uid = auth.currentUser ? auth.currentUser.uid : "no_uid";
        let docModel = await getDoc(doc(firestore, `itineraryAccess/${uid}`))
        let docData = docModel.data();
        if (docData && docData.hasAccess) {
            // no blockage
            console.log("user has access")
            setPageBlockOpen(false);
        } else {
            console.log("no access - navigate to landing");
            navigate('/dashboard', { replace: true });
            return "nope"
        }
    }

    const [pageBlockOpen, setPageBlockOpen] = useState(true);

    return <>
        <PageBlock open={pageBlockOpen} loading={true} />
        {children}
    </>

}
export default ProtectedRoute;