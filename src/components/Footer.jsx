import React from 'react'
import { Link } from 'react-router-dom'

export const Footer = () => {
  return (
    <div className='footer'>
      <div className="page-container90 flx-r just-sb pad28-footer boxsize-border">
        <div className="footer-logo flx-r">
          <div className="flx">
            <img src="https://i.imgur.com/d2FMf3s.png" alt="" className="bird-logo m-auto" />
          </div>
          <div className="logo-and-text flx-c just-ce ml6">
            <img src="https://i.imgur.com/Eu8Uf2u.png" alt="" className="word-logo" />
            <p className="slogan m-0 mt-1 ws-nowrap"><i>Plan your trips more efficiently</i></p>
          </div>
        </div>
        <div className="flx-c just-ce">
          <div className="large font-jakarta mb-1 mt- dark-text">2023</div>
          {/* <Link><p className="m-0 my-1 ml-3">About Us</p></Link>
          <Link><p className="m-0 my-1 ml-3">Contact Us</p></Link> */}
        </div>
      </div>

    </div>
  )
}
