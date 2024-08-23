import React, { createContext, useEffect, useState } from 'react'
import { auth, firestore } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import axios from 'axios';


const DataProvider = (props) => {
    const [showNavbar, setShowNavbar] = useState(true);

    // [user code]
    const [user, setUser] = useState(null);
    const [userPreferences, setUserPreferences] = useState({
        landmarks: false,
        nature: false,
        shopping: false,
        food: false,
        nightclub: false,
        relaxation: false,
        entertainment: false,
        arts: false
    });
    // useEffect(() => {
    //     if (auth.currentUser) {
    //         setPreferences()
    //     }
    // }, [auth])
    const setPreferences = async () => {
        let prefs = await getDoc(doc(firestore, `userPreferences/${auth.currentUser.uid}`))
        // console.log(prefs.data())
        prefs = prefs.data()
        let userPref = {
            landmarks: prefs ? prefs.landmarks : false,
            nature: prefs ? prefs.nature : false,
            shopping: prefs ? prefs.shopping : false,
            food: prefs ? prefs.food : false,
            nightclub: prefs ? prefs.nightclub ? prefs.nightclub : false : false,
            relaxation: prefs ? prefs.relaxation : false,
            entertainment: prefs ? prefs.entertainment : false,
            arts: prefs ? prefs.arts : false
        }
        // console.log(userPref)
        setUserPreferences(userPref)
    }
    const [firstTimeUser, setFirstTimeUser] = useState({
        firstPlaceAdded: true,
        firstSignIn: true
    })


    // [current trip code]
    const [currentTrip, setCurrentTrip] = useState({
        tripID: null,
        tripName: "Londo-Fundo!",
        city: null,
        country: "",
        country_2letter: null,
        startDate: "",
        endDate: "",
        tripDuration: "",
        geocode: null,
        imgUrl: null,
        places: [],
        itinerary: null,
        itineraryFirstLoad: false
    });
    const clearCurrentTrip = () => {
        setCurrentTrip({
            tripID: null,
            tripName: "",
            city: null,
            country: "",
            country_2letter: null,
            startDate: "",
            endDate: "",
            tripDuration: "",
            geocode: null,
            imgUrl: null,
            places: [],
            itinerary: null,
            itineraryFirstLoad: false
        })
    }


    // for itinerary page only - decides which list is being displayed - vestigial code
    // const [placeListDisplay, setPlaceListDisplay] = useState('Itinerary') // Suggested Places, Saved Places
    // const [sidebarDisplayed, setSidebarDisplayed] = useState(false);
    // const showSidebar = () => {
    //     setSidebarDisplayed(true)
    //     console.log('show sidebar')
    // }
    // const hideSidebar = () => {
    //     setSidebarDisplayed(false)
    //     console.log('hide sidebar')
    // }
    const [signUpIsOpen, setSignUpIsOpen] = useState(false);
    const [authIndex, setAuthIndex] = useState(null);

    const [pageOpen, setPageOpen] = useState(null);

    // logout code currently disabled
    const logOut = () => {
        // window.localStorage.removeItem("userData");
        // window.localStorage.removeItem("userPref");
        // window.localStorage.removeItem("isLoggedIn");
        // console.log('remove loggedIn')
        signOut(auth).then(() => {
            console.log("user signed out")
        })
        console.log("this btn")
        // signOut(auth).then(() => {
        // console.log("user signed out")
        // setUser(null);
        // setLogoutStandby(true);
        // })
    }
    const [logoutStandby, setLogoutStandby] = useState(false);
    useEffect(() => {
        if (logoutStandby && !user) {
            // navigate('/') // can't navigate on a link element
            console.log("auth : ", auth)
            console.log("user: ", user)
        }
    }, [logoutStandby])

    // [mobile code]
    const [mobileMode, setMobileMode] = useState(false);
    const [mobileModeNarrow, setMobileModeNarrow] = useState(false);
    useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize, true)
        return window.removeEventListener('resize', handleResize);
    }, [])
    const handleResize = () => {
        // console.log("resizing function triggered")
        if (window.innerWidth <= 1024) {
            if (!mobileMode) {
                // console.log("mobile mode: on")
            }
            setMobileMode(true);
            if (window.innerWidth <= 600) {
                setMobileModeNarrow(true);
            } else {
                setMobileModeNarrow(false);
            }
        } else if (window.innerWidth > 1024) {
            if (mobileMode === true) {
                // console.log("mobile mode: off")
            }
            setMobileMode(false);
            setMobileModeNarrow(false);
        }
    }

    const tripUpdate = {
        tripName: function (new_name, trip_id) {
            // returns success/failed
            let url = `https://routewise-backend.onrender.com/places/update-trip/${trip_id}`
            let data = {
                tripName: new_name,
                startDate: null,
                endDate: null,
            }
            const response = axios.patch(url, data, {
                headers: { "Content-Type": "application/json" }
            }).then((response) => {
                console.log(response.data)
                currentTrip.tripName = new_name
                return "success"
            }).catch((error) => {
                console.log(error)
                // console.log("error caught")
                return "failed"
            })
        },
        tripDates: function (new_start_date, new_end_date, trip_id) {
            // returns success/failed/itinerary updated
            let url = `https://routewise-backend.onrender.com/places/update-trip/${trip_id}`
            let data = {
                tripName: null,
                startDate: new_start_date,
                endDate: new_end_date,
            }
            const response = axios.patch(url, data, {
                headers: { "Content-Type": "application/json" }
            }).then((response) => {
                console.log(response.data)
                let newItinerary = typeof response.data === "object"
                // let newItinerary = "days" in response.data ? true : false; // days in response data indicates data is an itinerary
                if (newItinerary) {
                    console.log('itinerary updated')
                    // update currentTrip itinerary w/ response.data
                    return "itinerary updated"
                } else {
                    return "success"
                }
            }).catch((error) => {
                console.log(error)
                // console.log("error caught")
                return "failed"
            })
        }
    }
    // helper functions
    const textFunctions = {
        capitalize: function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
        titalize: function (str) {
            const words = str.split(" ")
            for (let i = 0; i < words.length; i++) {
                words[i] = textFunctions.capitalize(words[i]);
            }
            return words.join(" ");
        }
    }
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
    const timeFunctions = {
        datinormal: function (systemDate, dateOrTime) {
            // system date => mm/dd/yyyy
            let day = systemDate.getDate().toString().length === 1 ? "0" + systemDate.getDate() : systemDate.getDate()
            let month = systemDate.getMonth().toString().length + 1 === 1 ? "0" + (systemDate.getMonth() + 1) : systemDate.getMonth() + 1
            if (month.toString().length === 1) {
                month = "0" + month
            }
            let fullYear = systemDate.getFullYear();
            let hour = systemDate.getHours().toString().length === 1 ? "0" + systemDate.getHours() : systemDate.getHours();
            let minutes = systemDate.getMinutes().toString().length === 1 ? "0" + systemDate.getMinutes() : systemDate.getMinutes();
            let timeConverted = hour + ":" + minutes;
            let dateConverted = month + "/" + day + "/" + fullYear;
            if (!dateOrTime || dateOrTime === "date") {
                return dateConverted;
            } else if (dateOrTime === "time") {
                return timeConverted
            } else if (dateOrTime === "dateAndTime" || dateOrTime === "timeAndDate") {
                return dateConverted + ", " + timeConverted;
            }
        },
        datify: function (normalDate) {
            // mm/dd/yyyy => mmm dd, yy
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            let day = normalDate.slice(3, 5)
            let monthNum = normalDate.slice(0, 2)
            if (monthNum.charAt(0) === "0") {
                monthNum = monthNum[1]
            }
            let fullYear = normalDate.slice(6)
            const month = months[monthNum - 1]
            if (day.charAt(0) === "0") {
                day = day[1]
            }
            let twoYear = fullYear.slice(2)
            return month + " " + day + ", " + twoYear
        },
        datidash: function (normalDate) {
            // mm/dd/yyyy => yyyy-mm-dd
            let year = normalDate.slice(6)
            let month = normalDate.slice(0, 2)
            let day = normalDate.slice(3, 5)
            return year + "-" + month + "-" + day
        },
        datiundash: function (dashDate) {
            // yyyy-mm-dd => mm/dd/yyyy
            let fullyear = dashDate.slice(0, 4)
            let month = dashDate.slice(5, 7)
            let day = dashDate.slice(8)
            return month + "/" + day + "/" + fullyear
        },
        daytoDate: function (days) {
            const year = new Date().getFullYear();
            const isLeapYear = year % 4 === 0;
            const totalDays = isLeapYear ? 366 : 365;
            if (days > totalDays) {
                return "Too many days"
            } else if (days < 0) {
                return "Number of days must be positive"
            }
            const months = {
                "01": 31,
                "02": isLeapYear ? 29 : 28,
                "03": 31,
                "04": 30,
                "05": 31,
                "06": 30,
                "07": 31,
                "08": 31,
                "09": 30,
                "10": 31,
                "11": 30,
                "12": 31,
            };
            // if days is less than or equal to month days then stop 
            const monthArr = Object.entries(months).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
            for (let i = 0; i < monthArr.length; i++) {
                const monthNum = monthArr[i][0];
                const monthDays = monthArr[i][1];
                if (days > monthDays) {
                    days -= monthDays;
                } else {
                    const dayOfTheMonth = days.toString().length === 2 ? days.toString() : "0" + days.toString();
                    const monthOfTheYear = monthNum;
                    return dayOfTheMonth + "/" + monthOfTheYear + "/" + year.toString();
                }
            }
            return "Function should never reach this point"
        },
        dateToDay: function (date) {
            // this func doesn't validate the date exists i.e. 01/32/2024 would take
            const year = new Date().getFullYear();
            const isLeapYear = year % 4 === 0;
            const dateMonth = date.slice(3, 5);
            const dateDays = parseInt(date.slice(0, 2));
            let days = 0;
            const months = {
                "01": 31,
                "02": isLeapYear ? 29 : 28,
                "03": 31,
                "04": 30,
                "05": 31,
                "06": 30,
                "07": 31,
                "08": 31,
                "09": 30,
                "10": 31,
                "11": 30,
                "12": 31,
            };
            const monthArr = Object.entries(months).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
            for (let i = 0; i < monthArr.length; i++) {
                const monthNum = monthArr[i][0];
                const monthDays = monthArr[i][1];
                if (dateMonth === monthNum) {
                    // add days from date
                    days += dateDays;
                    // stop
                    break;
                } else {
                    // add monthDays
                    days += monthDays;
                };
            };
            return days;
        },
        addDays: function (date, days) {
            let yearDay = dateToDay(date);
            yearDay += days;
            date = dayToDate(yearDay);
            return date;
        },
    }
    const mapBoxCategoryKey = {
        landmarks: { categoryQueries: ["tourist_attraction", "historic_site"], categoryTitle: "Landmarks & Attractions", imgUrl: 'https://i.imgur.com/nixatab.png' },
        nature: { categoryQueries: ["garden", "forest", "zoo", "vineyard", "aquarium", "planetarium"], categoryTitle: "Nature", imgUrl: 'https://i.imgur.com/kmZtRbp.png' },
        shopping: { categoryQueries: ["clothing_store", "shoe_store", "jewelry_store", "gift_shop", "shopping_mall"], categoryTitle: "Shopping", imgUrl: 'https://i.imgur.com/Fo8WLyJ.png' },
        food: { categoryQueries: ["restaurant", "food_and_drink", "fast_food", "bakery", "coffee_shop"], categoryTitle: "Food & Restaurants", imgUrl: 'https://i.imgur.com/K6ADmfR.png' },
        relaxation: { categoryQueries: ["salon", "spa", "nail_salon"], categoryTitle: "Spa & Relaxation", imgUrl: 'https://i.imgur.com/o8PJDZ5.png' },
        entertainment: { categoryQueries: ["entertainment", "theme_park", "bowling_alley", "laser_tag", "planetarium"], categoryTitle: "Music & Entertainment", imgUrl: 'https://i.imgur.com/A8Impx2.png' },
        arts: { categoryQueries: ["art", "art_gallery", "museum."], categoryTitle: "Arts & Culture", imgUrl: 'https://i.imgur.com/ExY7HDK.png' },
        nightclub: { categoryQueries: ["nightlife", "bar", "nightclub"], categoryTitle: "Nightlife", imgUrl: 'https://i.imgur.com/9fVucq9.png' },
    }
    const [suggestedPlaces, setSuggestedPlaces] = useState({
        loaded: false,
        places: [],
    });

    const repeatItems = (num) => {
        let arr = [];
        for (let i = 0; i < num; i++) {
            arr.push("")
        }
        return arr
    }


    // load place img
    const getCityImg = async (imgQuery) => {
        try {
            const response = await axios.get(`https://api.unsplash.com/search/photos/?client_id=S_tkroS3HrDo_0BTx8QtZYvW0IYo0IKh3xNSVrXoDxo&query=${imgQuery}`)
            return response.status === 200 ? response.data : "error"
        }
        catch (error) {
            console.log("getCityImg error!")
            return getCityImg2(imgQuery)
        }
    }
    const getCityImg2 = async (imgQuery) => {
        try {
            const response = await axios.get(`https://api.unsplash.com/search/photos/?client_id=yNFxfJ53K-d6aJhns-ssAkH1Xc5jMDUPLw3ATqWBn3M&query=${imgQuery}`)
            return response.status === 200 ? response.data : "error"
        }
        catch (error) {
            console.log("getCityImg2 error!")
            return "https://i.imgur.com/QsPqFMb.png"
        }

    }
    const loadCityImg = async (imgQuery) => {
        const data = await getCityImg(imgQuery)
        // console.log(data);
        if (typeof data === "string") {
            return data
        } else if (data.total === 0) {
            // backup image (gray routewise logo)
            return "https://i.imgur.com/QsPqFMb.png"
        } else {
            return data.results[0].urls.regular
        }
    };
    const abbvToStatesKey = {
        'AL': 'Alabama',
        'AK': 'Alaska',
        'AZ': 'Arizona',
        'AR': 'Arkansas',
        'CA': 'California',
        'CO': 'Colorado',
        'CT': 'Connecticut',
        'DE': 'Delaware',
        'FL': 'Florida',
        'GA': 'Georgia',
        'HI': 'Hawaii',
        'ID': 'Idaho',
        'IL': 'Illinois',
        'IN': 'Indiana',
        'IA': 'Iowa',
        'KS': 'Kansas',
        'KY': 'Kentucky',
        'LA': 'Louisiana',
        'ME': 'Maine',
        'MD': 'Maryland',
        'MA': 'Massachusetts',
        'MI': 'Michigan',
        'MN': 'Minnesota',
        'MS': 'Mississippi',
        'MO': 'Missouri',
        'MT': 'Montana',
        'NE': 'Nebraska',
        'NV': 'Nevada',
        'NH': 'New Hampshire',
        'NJ': 'New Jersey',
        'NM': 'New Mexico',
        'NY': 'New York',
        'NC': 'North Carolina',
        'ND': 'North Dakota',
        'OH': 'Ohio',
        'OK': 'Oklahoma',
        'OR': 'Oregon',
        'PA': 'Pennsylvania',
        'RI': 'Rhode Island',
        'SC': 'South Carolina',
        'SD': 'South Dakota',
        'TN': 'Tennessee',
        'TX': 'Texas',
        'UT': 'Utah',
        'VT': 'Vermont',
        'VA': 'Virginia',
        'WA': 'Washington',
        'WV': 'West Virginia',
        'WI': 'Wisconsin',
        'WY': 'Wyoming',
        'DC': 'District of Columbia',
        'AS': 'American Samoa',
        'GU': 'Guam',
        'MP': 'Northern Mariana Islands',
        'PR': 'Puerto Rico',
        'UM': 'United States Minor Outlying Islands',
        'VI': 'Virgin Islands'
    }
    const stateToAbbKey = {
        'Alabama': 'AL',
        'Alaska': 'AK',
        'Arizona': 'AZ',
        'Arkansas': 'AR',
        'California': 'CA',
        'Colorado': 'CO',
        'Connecticut': 'CT',
        'Delaware': 'DE',
        'Florida': 'FL',
        'Georgia': 'GA',
        'Hawaii': 'HI',
        'Idaho': 'ID',
        'Illinois': 'IL',
        'Indiana': 'IN',
        'Iowa': 'IA',
        'Kansas': 'KS',
        'Kentucky': 'KY',
        'Louisiana': 'LA',
        'Maine': 'ME',
        'Maryland': 'MD',
        'Massachusetts': 'MA',
        'Michigan': 'MI',
        'Minnesota': 'MN',
        'Mississippi': 'MS',
        'Missouri': 'MO',
        'Montana': 'MT',
        'Nebraska': 'NE',
        'Nevada': 'NV',
        'New Hampshire': 'NH',
        'New Jersey': 'NJ',
        'New Mexico': 'NM',
        'New York': 'NY',
        'North Carolina': 'NC',
        'North Dakota': 'ND',
        'Ohio': 'OH',
        'Oklahoma': 'OK',
        'Oregon': 'OR',
        'Pennsylvania': 'PA',
        'Rhode Island': 'RI',
        'South Carolina': 'SC',
        'South Dakota': 'SD',
        'Tennessee': 'TN',
        'Texas': 'TX',
        'Utah': 'UT',
        'Vermont': 'VT',
        'Virginia': 'VA',
        'Washington': 'WA',
        'West Virginia': 'WV',
        'Wisconsin': 'WI',
        'Wyoming': 'WY',
        'District of Columbia': 'DC',
        'American Samoa': 'AS',
        'Guam': 'GU',
        'Northern Mariana Islands': 'MP',
        'Puerto Rico': 'PR',
        'United States Minor Outlying Islands': 'UM',
        'Virgin Islands': 'VI'
    };
    const convertStateToAbbv = (state) => {
        if (Object.keys(stateToAbbKey).includes(textFunctions.titalize(state))) {
            return stateToAbbKey[textFunctions.titalize(state)];
        }
        return state;
    };
    const convertAbbvToState = (abbv) => {
        if (Object.keys(abbvToStatesKey).includes(abbv.toUpperCase())) {
            return abbvToStatesKey[abbv.toUpperCase()];
        }
        return abbv;
    };
    const isUSState = (state) => {
        if (Object.keys(stateToAbbKey).includes(textFunctions.titalize(state))) {
            return true;
        }
        return false;
    };
    const isStateAbbv = (abbv) => {
        if (Object.keys(abbvToStatesKey).includes(abbv.toUpperCase())) {
            return true;
        }
        return false;
    }

    const geoToLatLng = (geocode) => {
        return { lat: geocode[0], lng: geocode[1] }
    }
    const toLatitudeLongitude = (geo) => {
        let latitudeLongitude = {
            latitude: null,
            longitude: null,
        };
        if (geo.constructor == Array) {
            latitudeLongitude.latitude = geo[0];
            latitudeLongitude.longitude = geo[1];
        } else if (typeof geo === "object") {
            latitudeLongitude.latitude = geo.lat;
            latitudeLongitude.longitude = geo.lng;
        }
        return latitudeLongitude;
    };
    const generateTripMapBounds = (center) => {
        let lat = "";
        let lng = "";
        if (typeof center === "object") {
            lat = center.lat;
            lng = center.lng;
        } else if (center.constructor === Array) {
            lat = center[0];
            lng = center[1];
        }
        let latLngBnds = {
            // ~30 - 38 mile radius
            north: lat + 0.426,
            south: lat - 0.426,
            east: lng + 0.686,
            west: lng - 0.686,
        }
        return latLngBnds;
    }
    const convertInfoToMap = (openingHoursStr) => {
        if (openingHoursStr.toLowerCase().includes(":")) {

            let openingHoursArr = openingHoursStr.split(", ");
            let result = {}
            // loop thru arr
            for (let i = 0; i < openingHoursArr.length; i++) {
                // let day = openingHoursArr[i].slice(0, 3)
                // get day
                let day = openingHoursArr[i].split(": ")[0]
                // get opning hrs
                let hours = openingHoursArr[i].split(": ")[1]
                // update result object
                result[day] = hours;
            }
            return result;
        } else {
            return openingHoursStr;
        }
    }
    const renderRating = (num) => {
        // input = num from 0 to 5, returns array of star fill numbers

        const ratingArr = [];
        for (let i = 0; i < 5; i++) {
            if (num >= 1) {
                ratingArr.push(1);
                num -= 1;
                num = (Math.round(num * 10) / 10); // removes awkward recurring numbers
            } else if (num < 1) {
                if (num >= 0.8) {
                    ratingArr.push(1);
                } else if (num <= 0.2) {
                    ratingArr.push(0);
                } else {
                    ratingArr.push(0.5);
                }
                num = 0;
            }
        }
        return ratingArr;
    }
    const gIcon = "material-symbols-outlined";

    const numberToBgColor = (numString) => {
        let lastDigit = numString.slice(-1)
        if (lastDigit === "1") {
            return "#FF4856" // RED
        }
        if (lastDigit === "2") {
            return "#FFD84E" // YELLOW
        }
        if (lastDigit === "3") {
            return "#2185F9" // BLUE
        }
        if (lastDigit === "4") {
            return "#4CDE08" // GREEN
        }
        if (lastDigit === "5") {
            return "#FFA80A" // ORANGE
        }
        if (lastDigit === "6") {
            return "#FF52FF" // PINK
        }
        if (lastDigit === "7") {
            return "#14DCDC" // LIGHT BLUE
        }
        if (lastDigit === "8") {
            return "#CECDFE" // PURPLE
        }
        if (lastDigit === "9") {
            return "#A9743A" // BROWN
        }
        if (lastDigit === "0") {
            return "#42F2A8" // LIGHT GREEN
        }
        return null;
    }

    return (
        <DataContext.Provider value={{
            'mobileMode': mobileMode, 'mobileModeNarrow': mobileModeNarrow,
            'pageOpen': pageOpen, 'setPageOpen': setPageOpen, 'showNavbar': showNavbar, 'setShowNavbar': setShowNavbar,
            'user': user, 'setUser': setUser, 'signUpIsOpen': signUpIsOpen, 'setSignUpIsOpen': setSignUpIsOpen, 'authIndex': authIndex, 'setAuthIndex': setAuthIndex,
            'userPreferences': userPreferences, 'setUserPreferences': setUserPreferences, 'setPreferences': setPreferences,
            'currentTrip': currentTrip, 'setCurrentTrip': setCurrentTrip, 'clearCurrentTrip': clearCurrentTrip,
            'timeFunctions': timeFunctions, textFunctions, 'tripUpdate': tripUpdate, 'mapBoxCategoryKey': mapBoxCategoryKey,
            'suggestedPlaces': suggestedPlaces, 'setSuggestedPlaces': setSuggestedPlaces, 'loadCityImg': loadCityImg,
            'repeatItems': repeatItems, 'handleResize': handleResize, geoToLatLng, renderRating, wait, convertInfoToMap, gIcon, numberToBgColor,
            toLatitudeLongitude, stateToAbbKey, convertStateToAbbv, convertAbbvToState, isUSState, isStateAbbv, generateTripMapBounds
        }}>
            {props.children}
        </DataContext.Provider>
    )
}
export default DataProvider;
export const DataContext = createContext();