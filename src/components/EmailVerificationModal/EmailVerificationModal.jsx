
import { Fade } from 'react-awesome-reveal';
import './emailverificationmodal.scoped.css';
import { useContext } from 'react';
import { DataContext } from '../../Context/DataProvider';
import { auth } from '../../firebase';
import { sendEmailVerification } from 'firebase/auth';

const EmailVerificationModal = ({ open, onClose }) => {
    const { user, gIcon } = useContext(DataContext);

    const resendEmailVerification = () => {
        if (!auth.currentUser) {
            alert("Please sign in to resend the email verification link");
        } else {
            sendEmailVerification(auth.currentUser);
            alert("Email verification link sent. Please check your inbox.");
        };
    };

    if (!open) return null;
    return (
        <div className="overlay-placeholder">
            <Fade duration={200} triggerOnce>
                <div className="overlay">
                    <div className="email-verification-modal">
                        <div onClick={() => onClose()} className="closeBtn">
                            <span className={gIcon}>close</span>
                        </div>
                        {user && user.emailVerified ?
                            <>
                                <p className="title">Email verified</p>
                                <div className="verified-checkbox">
                                    <span className={gIcon + " white-text xx-large"}>done</span>
                                </div>
                                <p className="text">You have successfully verified your email for full website access.</p>
                            </>
                            :
                            <>
                                <p className="title">Email verification required</p>
                                <p className="text">Please check your inbox and click on the link to verify your email or click below to resend the <strong>email verification link</strong>.</p>
                                <button onClick={() => resendEmailVerification()} className="btn-primaryflex2 medium">Resend</button>
                            </>
                        }
                    </div>
                </div>
            </Fade>
        </div>
    )
}

export default EmailVerificationModal;