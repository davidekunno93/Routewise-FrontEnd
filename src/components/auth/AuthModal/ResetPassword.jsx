import { useContext, useEffect, useState } from 'react';
import './resetpassword.scoped.css';
import { DataContext } from '../../../Context/DataProvider';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { auth } from '../../../firebase';

const ResetPassword = ({ open, onClose }) => {
  const { mobileMode, mobileModeNarrow, emailIsValid } = useContext(DataContext);

  const [emailInput, setEmailInput] = useState('');
  const resetPasswordFunctions = {
    updateEmail: function (e) {
      setEmailInput(e.target.value);
    },
    resetPage: function () {
      setEmailInput("");
    },
    resetPassword: function () {
      if (emailIsValid(emailInput)) {
        sendPasswordResetEmail(auth, emailInput);
        alert("Password reset email link has been sent to your email.");
        setEmailInput("");
      } else {
        alert("Please enter a valid email address.");
      };
    },
  };

  useEffect(() => {
    resetPasswordFunctions.resetPage();
  }, [open]);

  if (!open) return null;
  return (
    <div className={`reset-password ${mobileMode && "mobile"}`}>
      <div className="title-section">
        <p className="title">Reset Password</p>
        <p className="subtitle">If you have forgotten your password, enter your email and we will send you a link to reset it. You will only receive a link if you have an account with Routewise.</p>
      </div>

        <div className="email-input">
          <div className={`inputBox ${mobileModeNarrow && "mobile"} flx-c my-2`}>
            <input id='registerEmail' onChange={(e) => resetPasswordFunctions.updateEmail(e)} value={emailInput} type='text' className={`input-model ${mobileModeNarrow && "mobile"}`} required />
            <span className='title font-jakarta'>Email</span>
          </div>
        </div>

        <div className="reset-password-button">
          <button onClick={resetPasswordFunctions.resetPassword} className={`btn-primaryflex2 medium ${mobileModeNarrow && "mobile"}`}>Reset Password</button>
        </div>
        <p className="small center-text mt-1">Go back to login <Link onClick={onClose}><strong>here</strong></Link> </p>
      </div>

  )
}
export default ResetPassword;