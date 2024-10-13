
import { useContext, useState } from 'react';
import './accountsettings.scoped.css';
import { DataContext } from '../../Context/DataProvider';
import { auth } from '../../firebase';

const AccountSettings = () => {
    const { mobileMode, mobileModeNarrow, authFunctions, gIcon } = useContext(DataContext);

    const [userInfo, setUserInfo] = useState({
        firstName: "Josh",
        lastName: "Anderson",
        username: auth.currentUser ? auth.currentUser.displayName : null,
        email: auth.currentUser ? auth.currentUser.email : "joshanderson@email.com",
        photoURL: auth.currentUser ? auth.currentUser.photoURL : "https://i.imgur.com/cf5lgSl.png"
    })


    return (
        <div
            className="account-settings-page"
            data-mobileMode={mobileModeNarrow ? "narrow" : mobileMode}
        >
            <p className='page-title-text'>Account Settings</p>
            <div className="body">
                <div className="column profile-picture">
                    <div className="imgDiv">
                        <img src={userInfo.photoURL} alt="" />
                    </div>
                </div>
                <div className="column profile-info">
                    <div className="my-profile">
                        <div className="header">
                            <p className="title">My Profile</p>
                            <p className="edit">Edit</p>
                        </div>
                        <div className="body">
                            <div className="row">
                                <div className="field">
                                    <p className="label">First name</p>
                                    <p className="value">Josh</p>
                                </div>
                                <div className="field">
                                    <p className="label">Last name</p>
                                    <p className="value">Anderson</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="field">
                                    <p className="label">Username</p>
                                    <p className="value">{userInfo.username ? "@" + userInfo.username : "Undefined"}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="account-security">
                        <div className="header">
                            <p className="title">Account Security</p>
                        </div>
                        <div className="body">
                            <div className="row">
                                <div className="field w-50">
                                    <p className="label">Email</p>
                                    <p className="value">{userInfo.email}</p>
                                </div>
                                {auth.currentUser && auth.currentUser.emailVerified ?
                                    <p className="green-text align-all-items gap-2">{mobileModeNarrow ? "Verified" : "Email verified"} <span className={gIcon + " green-text"}>done</span></p>
                                    :
                                    <button onClick={() => authFunctions.sendEmailVerification()} className="btn-outlineflex">{mobileModeNarrow ? "Verify" : "Verify email"}</button>
                                }
                            </div>
                            <div className="row">
                                <div className="field">
                                    <p className="label">Password</p>
                                    <p className="value">********</p>
                                </div>
                                <button onClick={() => authFunctions.resetPassword()} className="btn-outlineflex">{mobileModeNarrow ? "Change" : "Change password"}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountSettings;