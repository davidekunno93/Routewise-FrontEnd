import React, { createRef, useEffect, useState } from 'react'
import { PlaceCard } from '../components/PlaceCard'
import { Link } from 'react-router-dom'
import { SearchPlace } from '../components/SearchPlace'
import { FlowBox } from '../components/FlowBox'
import { useRef } from 'react'
import { OpenMap } from '../components/OpenMap'
import auth from '../firebase'

export const Itinerary = ({ tripId, setTripID }) => {
  const [markers, setMarkers] = useState(null);
  const tripDays =
  {
    tripID: "",
    days: [
      {
        day: "Wednesday, November 8",
        dayShort: "Wed",
        dateShort: "11/8",
        dayName: "",
        places: [
          {
            placeName: "Traflagar Square",
            info: "Open 24 hours",
            address: "Trafalgar Sq, London WC2N 5DS, UK",
            imgURL: "https://i.imgur.com/xwY6Bdd.jpg",
            lat: 51.50806,
            long: -0.12806,
            geocode: [51.50806, -0.12806]
          },
          {
            placeName: "Tate Modern",
            info: "Mon-Sun 10 AM-6 PM",
            address: "Bankside, London SE1 9TG, UK",
            imgURL: "https://i.imgur.com/FYc6OB3.jpg",
            lat: 51.507748,
            long: -0.099469,
            geocode: [51.507748, -0.099469]
          }
        ]
      },
      {
        day: "Thursday, November 9",
        dayShort: "Thurs",
        dateShort: "11/9",
        dayName: "",
        places: [
          {
            placeName: "Hyde Park",
            info: "Mon-Sun 5 AM-12 AM",
            address: "Hyde Park, London W2 2UH, UK",
            imgURL: "https://i.imgur.com/tZBnXz4.jpg",
            lat: 51.502777,
            long: -0.151250,
            geocode: [51.502777, -0.151250]
          },
          {
            placeName: "Buckingham Palace",
            info: "Tours Start at 9am",
            address: "Buckingham Palace, London SW1A 1AA, UK",
            imgURL: "https://i.imgur.com/lw40mp9.jpg",
            lat: 51.501476,
            long: -0.140634,
            geocode: [51.501476, -0.140634]
          }
        ]
      },
      {
        day: "Friday, November 10",
        dayName: "",
        dayShort: "Fri",
        dateShort: "11/10",
        places: [
          {
            placeName: "Borough Market",
            info: "Closed Mondays, Tues-Sun 10 AM-5 PM",
            address: "Borough Market, London SE1 9AL, UK",
            imgURL: "https://i.imgur.com/9KiBKqI.jpg",
            geocode: [51.50544, -0.091249]
          },
          {
            placeName: "Trafalgar Square",
            info: "Open 24 hours",
            address: "Trafalgar Sq, London WC2N 5DS, UK",
            imgURL: "https://i.imgur.com/xwY6Bdd.jpg",
            geocode: [51.50806, -0.12806]
          }
        ]
      },
      {
        day: "Saturday, November 11",
        dayName: "",
        dayShort: "Sat",
        dateShort: "11/11",
        places: [
          {
            placeName: "Borough Market",
            info: "Closed Mondays, Tues-Sun 10 AM-5 PM",
            address: "Borough Market, London SE1 9AL, UK",
            imgURL: "https://i.imgur.com/9KiBKqI.jpg",
            geocode: [51.50544, -0.091249]
          },
          {
            placeName: "Trafalgar Square",
            info: "Open 24 hours",
            address: "Trafalgar Sq, London WC2N 5DS, UK",
            imgURL: "https://i.imgur.com/xwY6Bdd.jpg",
            geocode: [51.50806, -0.12806]
          }
        ]
      }
    ]
  }
  useEffect(() => {
    // for loop thru each day index
    // merge each day.places to larger list called allDays.places
    // [ {gc: } {gc: } {gc: } {gc: } ]
    tripDays['allDays'] = {
      places: []
    }
    for (let i = 0; i < tripDays.days.length; i++) {
      // console.log(tripDays.days[i])
      for (let j = 0; j < tripDays.days[i].places.length; j++) {
        tripDays.allDays.places.push(tripDays.days[i].places[j])
        // console.log(tripDays.days[i].places[j])
      }
    }
    setMarkers(tripDays.allDays.places)
    console.log(tripDays)
  }, [])



  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  const showDayPanel = () => {
    const dayPanel = document.getElementById('dayPanel')
    const dayPanelBody = document.getElementById('dayPanelBody')
    const showDayPanelBtn = document.getElementById('showDayPanelBtn')
    dayPanel.style.width = '200px'
    dayPanel.style.borderRight = '2px solid gainsboro'
    showDayPanelBtn.classList.add('o-none')
    dayPanelBody.classList.remove('d-none')
    wait(200).then(() => {
      dayPanelBody.classList.remove('o-none')
    })
  }
  const hideDayPanel = () => {
    const dayPanel = document.getElementById('dayPanel')
    const dayPanelBody = document.getElementById('dayPanelBody')
    const showDayPanelBtn = document.getElementById('showDayPanelBtn')
    dayPanelBody.classList.add('o-none')
    wait(200).then(() => {
      dayPanel.style.width = '30px'
      dayPanel.style.borderRight = 'none'
      dayPanelBody.classList.add('d-none')
      showDayPanelBtn.classList.remove('o-none')
    })
  }

  const rotateSymbol = (id, deg) => {
    const symbol = document.getElementById(`expandArrow-${id}`)
    symbol.style.transform = `rotate(${deg}deg)`
  }

  const expandFlow = (id) => {
    const flowZero = document.getElementById(`flow-${id}`)
    const flowBodyZero = document.getElementById(`flowBody-${id}`)
    const placeCount = document.getElementById(`placeCount-${id}`)
    flowZero.style.height = `${flowBodyZero.offsetHeight}px`
    rotateSymbol(id, '0')
    wait(100).then(() => {
      flowBodyZero.classList.remove('o-none')
      placeCount.classList.add('o-none')
      wait(500).then(() => {
        flowZero.style.removeProperty('height')
      })
    })
  }
  const collapseFlow = (id) => {
    const flowZero = document.getElementById(`flow-${id}`)
    const flowBodyZero = document.getElementById(`flowBody-${id}`)
    const placeCount = document.getElementById(`placeCount-${id}`)
    flowBodyZero.classList.add('o-none')
    flowZero.style.height = `${flowBodyZero.offsetHeight}px`
    wait(100).then(() => {
      flowZero.style.height = '0px'
      placeCount.classList.remove('o-none')
      rotateSymbol(id, '-90')
    })
  }

  const toggleFlow = (id) => {
    const flowZero = document.getElementById(`flow-${id}`)
    const flowBodyZero = document.getElementById(`flowBody-${id}`)
    console.log(id)
    if (flowZero.style.height === '0px') {
      expandFlow(id)
    } else {
      collapseFlow(id)
    }
  }
  const addSearchOpen = (id) => {
    const addPlacesBtn = document.getElementById(`addPlacesBtn-${id}`)
    const searchBar = document.getElementById(`searchBar-${id}`)
    const addPlaceExpand = document.getElementById(`addPlace-expand-${id}`)
    addPlacesBtn.classList.add('d-none')
    searchBar.classList.remove('d-none')
    addPlaceExpand.style.height = '70px'
    wait(100).then(() => {
      searchBar.classList.remove('o-none')
    })
  }
  const addSearchClose = (id) => {
    const addPlacesBtn = document.getElementById(`addPlacesBtn-${id}`)
    const searchBar = document.getElementById(`searchBar-${id}`)
    const addPlaceExpand = document.getElementById(`addPlace-expand-${id}`)
    searchBar.classList.add('o-none')
    wait(100).then(() => {
      addPlacesBtn.classList.remove('d-none')
      searchBar.classList.add('d-none')
      addPlaceExpand.style.height = '30px'
    })
  }

  const flowBoxSize = (id) => {
    const flowBox = document.getElementById(`flowBox-${id}`)
    let height = flowBox.offsetHeight
    console.log(height)
  }

  let refs = useRef([])
  useEffect(() => {
    refs.current = refs.current.slice(0, tripDays.days.length)
  }, [])

  // const myRef  = useRef(null);
  // const executeScroll = () => myRef.current.scrollIntoView();
  const scrollToSection = (refID) => {
    // console.log('scrolling')
    // console.log(refs)
    window.scrollTo({
      top: refs.current[refID].offsetTop,
      behavior: "smooth"
    })
  }



  return (
    <>
      <div className="itinerary-page flx-r">
        <div id='dayPanel' className="itinerary-c1">
          <div onClick={() => showDayPanel()} id='showDayPanelBtn' className="arrowToOpen">
            <span className="material-symbols-outlined o-50 xx-large onHover-fade position-fixed z-1 top-128">
              keyboard_double_arrow_right
            </span>
          </div>
          <div className="dayPanelContainer">
            <div id='dayPanelBody' className="it-column1 position-fixed ml-3 flx-c align-c o-none d-none">
              <img onClick={() => scrollToEl(el)} src="https://i.imgur.com/46q31Cx.png" alt="" className="vertical-logo" />

              <div onClick={() => hideDayPanel()} className="arrowToClose my-2">
                <span className="material-symbols-outlined o-50 xx-large right onHover-fade">
                  keyboard_double_arrow_left
                </span>
              </div>

              <button className="btn-secondaryflex">
                <span className="material-symbols-outlined btn-symbol v-align x-large">
                  expand_more
                </span>
                <p className="inline v-align white-text">Location #1</p>
              </button>

              <div className="it-datesPanel w-100 flx-c mt-3">
                {Array.isArray(tripDays.days) ? tripDays.days.map((day, id) => {
                  return <div key={id} onClick={() => scrollToSection(id)} className="day-date flx-r onHover-fade pointer">
                    <p className="it-dateBlock my-1 flx-1 gray-text">{day.dayShort}</p>
                    <p className="it-dayBlock my-1 flx-1 gray-text">{day.dateShort}</p>
                  </div>
                }) : null
                }

              </div>
            </div>
          </div>

        </div>
        <div className="itinerary-c2 flx-1">
          <div className="page-container96">
            <Link to='/add-places' className=''>
                    <span className="material-symbols-outlined v-tbott mr-2">
                        arrow_back
                    </span>
                    <p className="inline large purple-text">Back</p>
                </Link>
            <p className="page-heading-bold m-0">Hey {auth.currentUser ? auth.currentUser.displayName : "Josh"},</p>
            <p className="page-heading-bold m-0 mb-2">Here's your trip itinerary</p>
            <div className="flx-r onHover-fadelite">
                    <p className="mt-1 mb-3 purple-text"><span className="material-symbols-outlined v-bott mr-2">
                        add
                    </span>Add hotel or other accommodation***</p>
                </div>
            <div className="itinerary-flow mt-3">

              {Array.isArray(tripDays.days) ? tripDays.days.map((day, i) => {
                return <div ref={el => refs.current[i] = el} key={i}>
                  <FlowBox id={i} toggleFlow={toggleFlow} addSearchOpen={addSearchOpen} addSearchClose={addSearchClose} day={day} />
                </div>
              }) : null
              }


            </div>
            

          </div>
        </div>
        <div className="itinerary-c3 flx-1">
          <div className="sticky">

            <div className="it-map">
              <OpenMap markers={markers} />
            </div>

            <div className="page-subheading-bold my-3">Suggested places</div>

            <div className="hideOverFlow flx-c">
              <div className="suggestion-row flx-">

                <div className="card-model inflex position-relative flx-c mr-3">
                  <div className="addIcon position-absolute flx onHover-fade pointer">
                    <span className="material-symbols-outlined m-auto">
                      add
                    </span>
                  </div>
                  <img src="https://i.imgur.com/lw40mp9.jpg" alt="" className="cardModel-img" />
                  <div className="cardModel-text">
                    <div className="page-subsubheading">Title of place</div>
                    <p className="m-0">Info</p>
                  </div>
                </div>

                <div className="card-model inflex position-relative flx-c mr-3">
                  <div className="addIcon position-absolute flx onHover-fade pointer">
                    <span className="material-symbols-outlined m-auto">
                      add
                    </span>
                  </div>
                  <img src="https://i.imgur.com/lw40mp9.jpg" alt="" className="cardModel-img" />
                  <div className="cardModel-text">
                    <div className="page-subsubheading">Title of place</div>
                    <p className="m-0">Info</p>
                  </div>
                </div>

                {/* <div className="card-model inflex position-relative flx-c mr-3">
                <div className="addIcon position-absolute flx onHover-fade pointer">
                  <span className="material-symbols-outlined m-auto">
                    add
                  </span>
                </div>
                <img src="https://i.imgur.com/lw40mp9.jpg" alt="" className="cardModel-img" />
                <div className="cardModel-text">
                  <div className="page-subsubheading">Title of place</div>
                  <p className="m-0">Info</p>
                </div>
              </div> */}


              </div></div>

          </div>

          

          <div className="empty-6"></div>


        </div>

      </div>
        <div className="save-btn-row flx-r just-ce mt-5">
            <button className="btn-outlineflex w-1h large center-text mx-2">Save</button>
            <button className="btn-primaryflex w-2h large center-text mx-2">Complete Itinerary</button>
          </div>
    </>
  )
}
