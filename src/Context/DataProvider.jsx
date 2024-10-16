import React, { createContext, useEffect, useState } from 'react'
import { auth, firestore } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import axios from 'axios';
import { useLoadScript } from '@react-google-maps/api';
import { sendEmailVerification } from 'firebase/auth';


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
    const setPreferences = async () => {
        if (!auth.currentUser) return;
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
    };
    const [firstTimeUser, setFirstTimeUser] = useState({
        firstPlaceAdded: true,
        firstSignIn: true
    });

    const userPreferenceItems = {
        cards: {
            "landmarks": {
                userPreference: "landmarks",
                imgUrl: 'https://i.imgur.com/nixatab.png',
                title: 'Landmarks & Attractions'
            },
            "nature": {
                userPreference: "nature",
                imgUrl: 'https://i.imgur.com/kmZtRbp.png',
                title: 'Nature'
            },
            "shopping": {
                userPreference: "shopping",
                imgUrl: 'https://i.imgur.com/Fo8WLyJ.png',
                title: 'Shopping'
            },
            "food": {
                userPreference: "food",
                imgUrl: 'https://i.imgur.com/K6ADmfR.png',
                title: 'Food & Restaurants'
            },
            "arts": {
                userPreference: "arts",
                imgUrl: 'https://i.imgur.com/ExY7HDK.png',
                title: 'Arts & Culture'
            },
            "nightclub": {
                userPreference: "nightclub",
                imgUrl: 'https://i.imgur.com/9fVucq9.png',
                title: 'Nightlife'
            },
            "entertainment": {
                userPreference: "entertainment",
                imgUrl: 'https://i.imgur.com/A8Impx2.png',
                title: 'Music & Entertainment'
            },
            "relaxation": {
                userPreference: "relaxation",
                imgUrl: 'https://i.imgur.com/o8PJDZ5.png',
                title: 'Spa & Relaxation'
            },
        },
        order: ['landmarks', 'nature', 'shopping', 'food', 'arts', 'nightclub', 'entertainment', 'relaxation']
    };
    const [authControls, setAuthControls] = useState({
        isOpen: false,
        index: 0,
    });
    const authFunctions = {
        openSignUp: function () {
            setAuthControls({ ...authControls, isOpen: true, index: 0 });
        },
        openSignIn: function () {
            setAuthControls({ ...authControls, isOpen: true, index: 1 });
        },
        close: function () {
            setAuthControls({ ...authControls, isOpen: false, index: null });
        },
        resetPassword: function () {
            if (!auth.currentUser) return;
            auth.sendPasswordResetEmail(auth.currentUser.email);
            alert("Password reset email link has been sent to your email.");
        },
        sendEmailVerification: function () {
            if (!auth.currentUser) return;
            sendEmailVerification(auth.currentUser);
            alert("Email verification link sent. Please check your inbox.");
        },
    };


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
        itineraryFirstLoad: false,
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



    const [signUpIsOpen, setSignUpIsOpen] = useState(false);
    const [authIndex, setAuthIndex] = useState(null);

    const [pageOpen, setPageOpen] = useState(null);


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
    };
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    };
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
            let day = normalDate.slice(3, 5);
            let monthNum = normalDate.slice(0, 2);
            if (monthNum.charAt(0) === "0") {
                monthNum = monthNum[1];
            };
            let fullYear = normalDate.slice(6);
            const month = months[monthNum - 1];
            if (day.charAt(0) === "0") {
                day = day[1];
            };
            let twoYear = fullYear.slice(2);
            return month + " " + day + ", " + twoYear;
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
        dayToDate: function (days) {
            let year = new Date().getFullYear();
            let isLeapYear = year % 4 === 0;
            let totalDays = isLeapYear ? 366 : 365;
            if (days < 0) {
                return "Number of days must be positive"
            }
            while (days > totalDays) {
                days -= totalDays;
                year += 1;
                isLeapYear = year % 4 === 0;
                totalDays = isLeapYear ? 366 : 365;
            };
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
                    return monthOfTheYear + "/" + dayOfTheMonth + "/" + year.toString();
                }
            }
            return "Function should never reach this point"
        },
        dateToDay: function (date) {
            // this func doesn't validate the date exists i.e. 01/32/2024 would take
            const year = date.slice(6);
            const isLeapYear = year % 4 === 0;
            const dateMonth = date.slice(0, 2);
            const dateDays = parseInt(date.slice(3, 5));
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
            let yearDay = timeFunctions.dateToDay(date);
            yearDay += days;
            date = timeFunctions.dayToDate(yearDay);
            return date;
        },
        datishort: function (dashDate) {
            // converts from yyyy-mm-dd to mmm dd
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthNum = dashDate.slice(5, 7);
            const month = months[monthNum - 1];
            let day = dashDate.slice(8);
            if (day[0] === "0") {
                day = day[1];
            };
            return month + " " + day;
        },
        datishortRange: function (startDashDate, endDashDate) {
            // returns a range in (mmm dd - mmm dd) format
            const start = timeFunctions.datishort(startDashDate);
            const end = timeFunctions.datishort(endDashDate);
            const startMonth = start.slice(0, 3);
            const endMonth = end.slice(0, 3);

            if (startMonth === endMonth) {
                return start + " - " + end.slice(4);
            } else {
                return start + " - " + end;
            };
        },
    };
    const getCountryName = (country_2letter) => {
        const country_abbr = ['AF', 'AX', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AU', 'AT', 'AZ', 'BH', 'BS', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT', 'BO', 'BQ', 'BA', 'BW', 'BV', 'BR', 'IO', 'BN', 'BG', 'BF', 'BI', 'KH', 'CM', 'CA', 'CV', 'KY', 'CF', 'TD', 'CL', 'CN', 'CX', 'CC', 'CO', 'KM', 'CG', 'CD', 'CK', 'CR', 'CI', 'HR', 'CU', 'CW', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'ET', 'FK', 'FO', 'FJ', 'FI', 'FR', 'GF', 'PF', 'TF', 'GA', 'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN', 'GW', 'GY', 'HT', 'HM', 'VA', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IM', 'IL', 'IT', 'JM', 'JP', 'JE', 'JO', 'KZ', 'KE', 'KI', 'KP', 'KR', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MO', 'MK', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'NC', 'NZ', 'NI', 'NE', 'NG', 'NU', 'NF', 'MP', 'NO', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN', 'PL', 'PT', 'PR', 'QA', 'RE', 'RO', 'RU', 'RW', 'BL', 'SH', 'KN', 'LC', 'MF', 'PM', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SX', 'SK', 'SI', 'SB', 'SO', 'ZA', 'GS', 'SS', 'ES', 'LK', 'SD', 'SR', 'SJ', 'SZ', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TK', 'TO', 'TT', 'TN', 'TR', 'TM', 'TC', 'TV', 'UG', 'UA', 'AE', 'GB', 'US', 'UM', 'UY', 'UZ', 'VU', 'VE', 'VN', 'VG', 'VI', 'WF', 'EH', 'YE', 'ZM', 'ZW']
        const country_name = ['Afghanistan', 'Åland Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antarctica', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahrain', 'Bahamas', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia, Plurinational State of', 'Bonaire, Sint Eustatius and Saba', 'Bosnia and Herzegovina', 'Botswana', 'Bouvet Island', 'Brazil', 'British Indian Ocean Territory', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo', 'Democratic Republic of Congo', 'Cook Islands', 'Costa Rica', "Côte d'Ivoire", 'Croatia', 'Cuba', 'Curaçao', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands (Malvinas)', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia', 'French Southern Territories', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Heard Island and McDonald Islands', 'Holy See (Vatican City State)', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'North Korea', 'South Korea', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macao', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine, State of', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Réunion', 'Romania', 'Russian Federation', 'Rwanda', 'Saint Barthélemy', 'Saint Helena, Ascension and Tristan da Cunha', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Martin', 'Saint Pierre and Miquelon', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Sint Maarten ', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Georgia and the South Sandwich Islands', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Svalbard and Jan Mayen', 'Swaziland', 'Sweden', 'Switzerland', 'Syrian Arab Republic', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'United States Minor Outlying Islands', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela, Bolivarian Republic of', 'Viet Nam', '(British) Virgin Islands ', '(U.S.) Virgin Islands', 'Wallis and Futuna', 'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe']
        return country_abbr.includes(country_2letter) ? country_name[country_abbr.indexOf(country_2letter)] : null
    };
    const emailIsValid = (emailEntry) => {
        return String(emailEntry)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };


    const mapBoxCategoryKey = {
        landmarks: { categoryQueries: ["tourist_attraction", "historic_site"], categoryTitle: "Landmarks & Attractions", imgUrl: 'https://i.imgur.com/nixatab.png' },
        nature: { categoryQueries: ["garden", "forest", "zoo", "vineyard", "aquarium", "planetarium"], categoryTitle: "Nature", imgUrl: 'https://i.imgur.com/kmZtRbp.png' },
        shopping: { categoryQueries: ["clothing_store", "shoe_store", "jewelry_store", "gift_shop", "shopping_mall"], categoryTitle: "Shopping", imgUrl: 'https://i.imgur.com/Fo8WLyJ.png' },
        food: { categoryQueries: ["restaurant", "food_and_drink", "fast_food", "bakery", "coffee_shop"], categoryTitle: "Food & Restaurants", imgUrl: 'https://i.imgur.com/K6ADmfR.png' },
        relaxation: { categoryQueries: ["salon", "spa", "nail_salon"], categoryTitle: "Spa & Relaxation", imgUrl: 'https://i.imgur.com/o8PJDZ5.png' },
        entertainment: { categoryQueries: ["entertainment", "theme_park", "bowling_alley", "laser_tag", "planetarium"], categoryTitle: "Music & Entertainment", imgUrl: 'https://i.imgur.com/A8Impx2.png' },
        arts: { categoryQueries: ["art", "art_gallery", "museum."], categoryTitle: "Arts & Culture", imgUrl: 'https://i.imgur.com/ExY7HDK.png' },
        nightclub: { categoryQueries: ["nightlife", "bar", "nightclub"], categoryTitle: "Nightlife", imgUrl: 'https://i.imgur.com/9fVucq9.png' },
    };
    const googleCategoryKey = {
        landmarks: { categoryQueries: ["tourist_attraction", "historical_landmark"], categoryTitle: "Landmarks & Attractions", imgUrl: 'https://i.imgur.com/nixatab.png' },
        nature: { categoryQueries: ["park", "national_park", "hiking_area", "zoo", "aquarium"], categoryTitle: "Nature", imgUrl: 'https://i.imgur.com/kmZtRbp.png' },
        shopping: { categoryQueries: ["shopping_mall", "department_store", "clothing_store", "gift_shop"], categoryTitle: "Shopping", imgUrl: 'https://i.imgur.com/Fo8WLyJ.png' },
        food: { categoryQueries: ["restaurant", "cafe", "bakery", "coffee_shop"], categoryTitle: "Food & Restaurants", imgUrl: 'https://i.imgur.com/K6ADmfR.png' },
        relaxation: { categoryQueries: ["spa", "beauty_salon"], categoryTitle: "Spa & Relaxation", imgUrl: 'https://i.imgur.com/o8PJDZ5.png' },
        entertainment: { categoryQueries: ["amusement_park", "casino", "bowling_alley"], categoryTitle: "Music & Entertainment", imgUrl: 'https://i.imgur.com/A8Impx2.png' },
        arts: { categoryQueries: ["art_gallery", "museum", "performing_arts_center"], categoryTitle: "Arts & Culture", imgUrl: 'https://i.imgur.com/ExY7HDK.png' },
        nightclub: { categoryQueries: ["bar", "night_club"], categoryTitle: "Nightlife", imgUrl: 'https://i.imgur.com/9fVucq9.png' },
    };
    const googlePlaceTypeKey = {
        "tourist_attraction": {
            categoryTitle: "Landmarks & Attractions",
            userPreference: "landmarks",
        },
        "historical_landmark": {
            categoryTitle: "Landmarks & Attractions",
            userPreference: "landmarks",
        },
        "park": {
            categoryTitle: "Nature",
            userPreference: "nature",
        },
        "national_park": {
            categoryTitle: "Nature",
            userPreference: "nature",
        },
        "hiking_area": {
            categoryTitle: "Nature",
            userPreference: "nature",
        },
        "zoo": {
            categoryTitle: "Nature",
            userPreference: "nature",
        },
        "aquarium": {
            categoryTitle: "Nature",
            userPreference: "nature",
        },
        "shopping_mall": {
            categoryTitle: "Shopping",
            userPreference: "shopping",
        },
        "department_store": {
            categoryTitle: "Shopping",
            userPreference: "shopping",
        },
        "clothing_store": {
            categoryTitle: "Shopping",
            userPreference: "shopping",
        },
        "gift_shop": {
            categoryTitle: "Shopping",
            userPreference: "shopping",
        },
        "restaurant": {
            categoryTitle: "Food & Restaurants",
            userPreference: "food",
        },
        "cafe": {
            categoryTitle: "Food & Restaurants",
            userPreference: "food",
        },
        "bakery": {
            categoryTitle: "Food & Restaurants",
            userPreference: "food",
        },
        "coffee_shop": {
            categoryTitle: "Food & Restaurants",
            userPreference: "food",
        },
        "spa": {
            categoryTitle: "Spa & Relaxation",
            userPreference: "spa",
        },
        "beauty_salon": {
            categoryTitle: "Spa & Relaxation",
            userPreference: "spa",
        },
        "amusement_park": {
            categoryTitle: "Music & Entertainment",
            userPreference: "entertainment",
        },
        "casino": {
            categoryTitle: "Music & Entertainment",
            userPreference: "entertainment",
        },
        "bowling_alley": {
            categoryTitle: "Music & Entertainment",
            userPreference: "entertainment",
        },
        "art_gallery": {
            categoryTitle: "Arts & Culture",
            userPreference: "art",
        },
        "museum": {
            categoryTitle: "Arts & Culture",
            userPreference: "art",
        },
        "performing_arts_center": {
            categoryTitle: "Arts & Culture",
            userPreference: "art",
        },
        "bar": {
            categoryTitle: "Nightlife",
            userPreference: "nightclub",
        },
        "night_club": {
            categoryTitle: "Nightlife",
            userPreference: "nightclub",
        },
    };
    const [topSites, setTopSites] = useState({
        loaded: false,
        places: [],
    });
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
    const modifyInfo = (openingHoursArr) => {
        let result = "";
        // make string
        // replace days with short days
        for (let i = 0; i < openingHoursArr.length; i++) {
            openingHoursArr[i] = openingHoursArr[i].replace(",", ";");
        }
        let openingHoursStr = openingHoursArr.join(", ")
        result = openingHoursStr.replace("Monday", "Mon").replace("Tuesday", "Tue").replace("Wednesday", "Wed").replace("Thursday", "Thu").replace("Friday", "Fri").replace("Saturday", "Sat").replace("Sunday", "Sun")
        return result;
    }
    const getBestCategory = (categoryArr) => {
        // remove meal delivery, point of interest
        // negate tourist attraction if museum, park, restaurant
        // sublocality_level_#, sublocality, locality
        let bestCategory = "";
        if (categoryArr.length > 1) {
            if (categoryArr.includes("meal_delivery")) {
                categoryArr.splice(categoryArr.indexOf("meal_delivery"), 1);
            }
            if (categoryArr.includes("point_of_interest")) {
                categoryArr.splice(categoryArr.indexOf("point_of_interest"), 1);
            }
        };

        bestCategory = categoryArr[0];
        if (bestCategory === "tourist_attraction" || bestCategory === "establishment") {
            for (let i = 0; i < categoryArr.length; i++) {
                if (categoryArr[i] === "museam" || categoryArr[i] === "restaurant" || categoryArr[i] === "park") {
                    bestCategory = categoryArr[i];
                }
            }
        };

        if (bestCategory.includes("locality")) {
            bestCategory = "area";
        }
        return bestCategory;
    };

    const gLibrary = ["core", "maps", "places", "marker"];
    // const { googleScriptIsLoaded } = useLoadScript({
    //     id: 'google-maps-script',
    //     googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_API_KEY,
    //     libraries: gLibrary
    // });
    const getGoogleImg = async (photoName) => {
        let url = `https://places.googleapis.com/v1/${photoName}/media?key=${import.meta.env.VITE_APP_GOOGLE_API_KEY}&maxWidthPx=512`;
        const response = await fetch(url)
        return response.url
    };

    const gIcon = "material-symbols-outlined";

    const numberToBgColor = (numString) => {
        let lastDigit = numString.slice(-1)
        if (lastDigit === "1") {
            return "#FF4856" // RED
        }
        if (lastDigit === "2") {
            return "#FFED4E" // YELLOW
        }
        if (lastDigit === "3") {
            return "#2185F9" // BLUE
        }
        if (lastDigit === "4") {
            return "#4CDE08" // GREEN
        }
        if (lastDigit === "5") {
            return "#FF8A00" // ORANGE
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
    };

    return (
        <DataContext.Provider value={{
            'mobileMode': mobileMode, 'mobileModeNarrow': mobileModeNarrow,
            'pageOpen': pageOpen, 'setPageOpen': setPageOpen, 'showNavbar': showNavbar, 'setShowNavbar': setShowNavbar,
            'user': user, 'setUser': setUser, 'signUpIsOpen': signUpIsOpen, 'setSignUpIsOpen': setSignUpIsOpen, 'authIndex': authIndex, 'setAuthIndex': setAuthIndex,
            'userPreferences': userPreferences, 'setUserPreferences': setUserPreferences, 'setPreferences': setPreferences,
            'currentTrip': currentTrip, 'setCurrentTrip': setCurrentTrip, 'clearCurrentTrip': clearCurrentTrip,
            'timeFunctions': timeFunctions, textFunctions, 'tripUpdate': tripUpdate, 'mapBoxCategoryKey': mapBoxCategoryKey,
            'suggestedPlaces': suggestedPlaces, 'setSuggestedPlaces': setSuggestedPlaces, 'loadCityImg': loadCityImg,
            'repeatItems': repeatItems, 'handleResize': handleResize, geoToLatLng, renderRating, wait, convertInfoToMap,
            gIcon, numberToBgColor, toLatitudeLongitude, stateToAbbKey, convertStateToAbbv, convertAbbvToState, isUSState,
            isStateAbbv, generateTripMapBounds, modifyInfo, getBestCategory, getGoogleImg, googleCategoryKey,
            googlePlaceTypeKey, userPreferenceItems, topSites, setTopSites, authControls, authFunctions, getCountryName, gLibrary,
            emailIsValid
        }}>
            {props.children}
        </DataContext.Provider>
    )
}
export default DataProvider;
export const DataContext = createContext();