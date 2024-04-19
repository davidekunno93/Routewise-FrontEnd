import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { DataContext } from '../Context/DataProvider'

export const Footer = () => {
  const { mobileMode } = useContext(DataContext);

  return (
    <div className={`footer ${mobileMode && "mobile"}`}>
      <div className={`${!mobileMode ? "page-container90 flx-r" : "flx-c gap-5"}  just-sb pad28-footer boxsize-border`}>

        <div className={`footer-logo ${mobileMode && "mobile"} flx-r`}>
          <div className="flx w-22pc">
            <img src="https://i.imgur.com/d2FMf3s.png" alt="" className={`bird-logo m-auto`} />
          </div>
          <div className="logo-and-text w-78pc">
            <img src="https://i.imgur.com/Eu8Uf2u.png" alt="" className="word-logo" />
            <p className="slogan m-0 mt-1 ws-nowrap"><i>Plan your trips more efficiently</i></p>
          </div>
        </div>

        <div className="flx-c just-ce">
          <div className="large font-jakarta mb-1 dark-text">Follow us!</div>
          <div className="flx-r gap-2">
            <Link target='_blank' to='https://www.instagram.com/routewise_/'>
              <img src="https://i.imgur.com/voUVM5d.png" alt="" className="footer-icon" />
            </Link>
            <Link>
              <img src="https://i.imgur.com/ytSgpeP.png" alt="" className="footer-icon" />
            </Link>
            <Link target='_blank' to='https://www.linkedin.com/company/travelsmartwithroutewise/'>
              <img src="https://i.imgur.com/ApmsmMC.png" alt="" className="footer-icon" />
            </Link>
          </div>
          {/* <Link><p className="m-0 my-1 ml-3">About Us</p></Link>
          <Link><p className="m-0 my-1 ml-3">Contact Us</p></Link> */}
        </div>
      </div>

    </div>
  )
}
