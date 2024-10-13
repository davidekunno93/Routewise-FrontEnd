import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { NameTripModal } from '../NameTripModal';
import axios from 'axios';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';
import format from 'date-fns/format';
import { SpecifyCity } from '../SpecifyCity';
import { Loading } from '../../components/Loading/Loading';
import { LoadingModal } from '../../components/Loading/LoadingModal';
import { auth, firestore } from '../../firebase';
import { DataContext } from '../../Context/DataProvider';
import { Link, useNavigate, useRouteError } from 'react-router-dom';
import { LoadingScreen } from '../../components/Loading/LoadingScreen';
import EditTripModal from '../../components/EditTripModal';
import { doc, getDoc } from 'firebase/firestore';
import LoadingFullscreen from '../../components/Loading/LoadingFullscreen';
import './dashboard.scoped.css';
import FeaturedTripSquare from '../../components/FeaturedTripCard/FeaturedTripSquare';
import CarouselWiper from '../../components/Carousel/CarouselWiper';
import PreferenceCard from '../../components/PreferenceCard/PreferenceCard';



export const Dashboard = () => {

    const cards2_dict = {
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
    }
    // login require
    const { user, currentTrip, setCurrentTrip, clearCurrentTrip,
        mobileMode, mobileModeNarrow, userPreferences, setPreferences, setSignUpIsOpen,
        setPageOpen, timeFunctions, gIcon, convertStateToAbbv, convertAbbvToState, isStateAbbv
    } = useContext(DataContext);
    const [openTripModal, setOpenTripModal] = useState(false)
    const [loading, setLoading] = useState(false);
    const [translationIndex, setTranslationIndex] = useState(0);
    const [fullTranslated, setFullTranslated] = useState(false);
    const [calendarOpen, setCalendarOpen] = useState(false)
    const [cityText, setCityText] = useState(null);
    const [tripData, setTripData] = useState(null);
    const [specifyCityOpen, setSpecifyCityOpen] = useState(false);
    const [cityOptions, setCityOptions] = useState([
        {
            name: "Rome",
            state: "",
            country: "Italy"
        },
        {
            name: "Barcelona",
            state: "",
            country: "Spain"
        },
        {
            name: "Houston",
            state: "Texas",
            country: "US"
        }
    ]);
    const [userTrips, setUserTrips] = useState({
        isLoaded: false,
        trips: []
    });
    const resetPageOpen = () => {
        setPageOpen(null);
    }

    useLayoutEffect(() => {
        // console.log(user, Object.entries(userPreferences));
        setPreferences();
        setPageOpen('dashboard');
        return resetPageOpen;
    }, []);

    const cityInputRef = useRef(null);

    const [isLoadingTrips, setIsLoadingTrips] = useState(false);
    // get user trips code
    const getUserTripsData = async () => {
        const response = await axios.get(`https://routewise-backend.onrender.com/places/trips/${auth.currentUser.uid}`)
        return response.status === 200 ? response.data : "error - it didn't work"
    }

    const loadUserTripsData = async () => {
        setIsLoadingTrips(true);
        let data = await getUserTripsData();

        let upcomingTripsArr = []
        let pastTripsArr = []
        // sort trips into past and upcoming
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                // let endDate = data[i].end_date
                // let yday = new Date(new Date().valueOf() - 1000*60*60*24)
                if (new Date(timeFunctions.datiundash(data[i].end_date)) > new Date((new Date().valueOf() - 1000 * 60 * 60 * 24))) {
                    upcomingTripsArr.push(data[i])
                } else {
                    pastTripsArr.push(data[i])
                }
            }

            upcomingTripsArr.sort((a, b) => new Date(timeFunctions.datiundash(a.start_date)) - new Date(timeFunctions.datiundash(b.start_date)))
            pastTripsArr.sort((a, b) => new Date(timeFunctions.datiundash(b.start_date)) - new Date(timeFunctions.datiundash(a.start_date)))
            const allTripsArr = upcomingTripsArr.concat(pastTripsArr);
            setUserTrips({ trips: allTripsArr, isLoaded: true });
            // sort upcoming trips from old to future
            // add past trips ordered from new to old
            // the page will grab the first ~5 trips

        } else {
            setUserTrips({
                isLoaded: true,
                trips: []
            });
        };



        setIsLoadingTrips(false);
    };

    useLayoutEffect(() => {
        if (!auth.currentUser) return;
        loadUserTripsData();
    }, [user]);


    const apiKey = 'ka/g7nybqosAgLyFNCod1A==WBv07XT0PI2TrXTO'


    // carousel
    const cities = [
        {
            name: 'Paris',
            imgUrl: 'https://i.imgur.com/JnLJKbEl.jpg'
        },
        {
            name: 'Rome',
            imgUrl: 'https://i.imgur.com/HJJEIntl.jpg'
        },
        {
            name: 'London',
            imgUrl: 'https://i.imgur.com/sCT1BpFl.jpg'
        },
        {
            name: 'New York City',
            imgUrl: 'https://i.imgur.com/RxO0dfyl.jpg'
        },
        {
            name: 'Tokyo',
            imgUrl: 'https://i.imgur.com/JMgMvzPl.png'
        },
        {
            name: 'Miami',
            imgUrl: 'https://i.imgur.com/F6fkD7Ol.jpg'
        },
        {
            name: 'Dubai',
            imgUrl: 'https://i.imgur.com/OWmQg9Ll.jpgg'
        }
    ]
    const featuredTrips = [
        {
            destination: "Vancouver, Canada",
            numberOfDays: 8,
            numberOfPlaces: 32,
            summary: "Thrill-seeking in Vancouver!",
            imgUrl: "https://i.imgur.com/WnlEhfqh.jpg",
            flagImgUrl: "https://i.imgur.com/J2cz7mCh.jpg",
            trip: {
                tripID: null,
                tripName: "Thrill-seeking in Vancouver!",
                city: "Vancouver",
                country: "Canada",
                country_2letter: "CA",
                startDate: "2024-09-23",
                endDate: "2024-09-30",
                geocode: [49.2827, -123.1207],
                tripDuration: 8,
                imgUrl: "https://i.imgur.com/egL9NRQh.jpg",
                places: [],
                itinerary: {
                    "day_order": [
                        "day-1",
                        "day-2",
                        "day-3",
                        "day-4",
                        "day-5",
                        "day-6",
                        "day-7",
                        "day-8"
                    ],
                    "days": {
                        "day-1": {
                            "date_converted": "Monday, September 23",
                            "date_formatted": "Mon, 23 Sep 2024 00:00:00 GMT",
                            "date_short": "09/23",
                            "day_id": 1836,
                            "day_short": "Mon",
                            "id": "day-1",
                            "placeIds": [1, 17, 23, 28]
                        },
                        "day-2": {
                            "date_converted": "Tuesday, September 24",
                            "date_formatted": "Tue, 24 Sep 2024 00:00:00 GMT",
                            "date_short": "09/24",
                            "day_id": 1837,
                            "day_short": "Tue",
                            "id": "day-2",
                            "placeIds": [12, 25, 3, 13]
                        },
                        "day-3": {
                            "date_converted": "Wednesday, September 25",
                            "date_formatted": "Wed, 25 Sep 2024 00:00:00 GMT",
                            "date_short": "09/25",
                            "day_id": 1838,
                            "day_short": "Wed",
                            "id": "day-3",
                            "placeIds": [35, 22, 4, 10]
                        },
                        "day-4": {
                            "date_converted": "Thursday, September 26",
                            "date_formatted": "Thu, 26 Sep 2024 00:00:00 GMT",
                            "date_short": "09/26",
                            "day_id": 1839,
                            "day_short": "Thu",
                            "id": "day-4",
                            "placeIds": [38, 18, 20, 21]
                        },
                        "day-5": {
                            "date_converted": "Friday, September 27",
                            "date_formatted": "Fri, 27 Sep 2024 00:00:00 GMT",
                            "date_short": "09/27",
                            "day_id": 1840,
                            "day_short": "Fri",
                            "id": "day-5",
                            "placeIds": [8, 7, 32, 34]
                        },
                        "day-6": {
                            "date_converted": "Saturday, September 28",
                            "date_formatted": "Sat, 28 Sep 2024 00:00:00 GMT",
                            "date_short": "09/28",
                            "day_id": 1841,
                            "day_short": "Sat",
                            "id": "day-6",
                            "placeIds": [24, 29, 30, 26]
                        },
                        "day-7": {
                            "date_converted": "Sunday, September 29",
                            "date_formatted": "Sun, 29 Sep 2024 00:00:00 GMT",
                            "date_short": "09/29",
                            "day_id": 1842,
                            "day_short": "Sun",
                            "id": "day-7",
                            "placeIds": [14, 36, 2, 15]
                        },
                        "day-8": {
                            "date_converted": "Monday, September 30",
                            "date_formatted": "Mon, 30 Sep 2024 00:00:00 GMT",
                            "date_short": "09/30",
                            "day_id": 1843,
                            "day_short": "Mon",
                            "id": "day-8",
                            "placeIds": [5, 6, 31, 19]
                        }
                    },
                    "places": {
                        1: {
                            "address": "24480 Fern Crescent, Maple Ridge, BC V4R 2S1, Canada",
                            "category": "Park",
                            "day_id": 1836,
                            "favorite": false,
                            "geocode": [49.2754387, -122.5154058],
                            "id": 1,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJLfu9PdebhlQRgp71o2-R60c/photos/AelY_CuV8V3JH3pm-ayrDhuWSqvxYjOasjOXG9PyHHE9THZfPaMVHWN1pwhGbA8z1adT_CDfm6QoPtPhnmC2I_WVUg7FtVIkTS2Xb9X8b3mkbmF_zNaYmk_DvJLR_Nq8iqM7A5QNtpDzn70uviFqgzN3atMdGXFvY-UhJWfL/media?maxWidthPx=720&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: 7:00 AM - 11:00 PM, Tue: 7:00 AM - 11:00 PM, Wed: 7:00 AM - 11:00 PM, Thu: 7:00 AM - 11:00 PM, Fri: 7:00 AM - 11:00 PM, Sat: 7:00 AM - 11:00 PM, Sun: 7:00 AM - 11:00 PM",
                            "lat": 49.2754387,
                            "long": -122.5154058,
                            "phoneNumber": "+1 604-466-8325",
                            "placeName": "Golden Ears Park",
                            "place_id": 3319,
                            "rating": "4.7",
                            "summary": "Large park offering water recreation on Alouette Lake, 3 campgrounds & extensive hiking trails.",
                            "website": "https://bcparks.ca/golden-ears-park/"
                        },
                        2: {
                            "address": "4700 Kingsway, Burnaby, BC V5H 4M5, Canada",
                            "category": "Establishment",
                            "day_id": 1842,
                            "favorite": false,
                            "geocode": [49.2273037, -122.9999839],
                            "id": 2,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJB7RfXFl2hlQRpb-Vv0SYE3A/photos/AelY_CtElhg9kMOHF7lNfH0XyPRfciqTg2VUd97KLnUTl_XU5u9WDHXv7oU_Jw8f09vAmYY0rxBfFTGd7cZR7n7YS6e948R8S3gCn_0IE-vKOUx-vGoC1Qb6Bb9XYtaQMvgypDJjRi_-zl_jXBMfzbumMS8Sn_C7alf9cMEe/media?maxWidthPx=871&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: 10:00 AM - 9:00 PM, Tue: 10:00 AM - 9:00 PM, Wed: 10:00 AM - 9:00 PM, Thu: 10:00 AM - 9:00 PM, Fri: 10:00 AM - 9:00 PM, Sat: 10:00 AM - 9:00 PM, Sun: 11:00 AM - 7:00 PM",
                            "lat": 49.2273037,
                            "long": -122.9999839,
                            "phoneNumber": "+1 604-438-4715",
                            "placeName": "Metropolis at Metrotown",
                            "place_id": 3320,
                            "rating": "4.3",
                            "summary": "Expansive shopping mall with almost 400 stores, restaurants & services, including a movie theater.",
                            "website": "https://www.metropolisatmetrotown.com/?utm_source=google-business-profile&utm_medium=organic&utm_campaign=metropolis-at-metrotown&utm_id=65229"
                        },
                        3: {
                            "address": "1510 Commercial Dr, Vancouver, BC V5L 2Y7, Canada",
                            "category": "Restaurant",
                            "day_id": 1837,
                            "favorite": false,
                            "geocode": [49.2711635, -123.0693181],
                            "id": 3,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJqyN6rDhxhlQRqg9-Y5l1Zaw/photos/AelY_CtXibrYcFJS6QLCsIFSKCAIsGqw7MI4GT060tlkbrsfN6tXJ9yopxrZbDnmqD48PbKafKIJ4T7UuSpEGY086C_SYVKggTwhkdNl7voXSTYAV2yFdc-bO23eCAy0oDUkmsxPdcgBE8UoU0vlZIJRLj5xSf9YXASmY3o-/media?maxWidthPx=4608&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: 4:00 - 10:00 PM, Tue: 4:00 - 10:00 PM, Wed: 4:00 - 10:00 PM, Thu: 4:00 - 10:00 PM, Fri: 12:00 - 11:30 PM, Sat: 12:00 - 11:30 PM, Sun: 12:00 - 10:00 PM",
                            "lat": 49.2711635,
                            "long": -123.0693181,
                            "phoneNumber": "+1 604-251-7586",
                            "placeName": "Sopra Sotto Pizzeria",
                            "place_id": 3321,
                            "rating": "4.4",
                            "summary": null,
                            "website": "http://www.soprasotto.ca/"
                        },
                        4: {
                            "address": "305 Water St, Vancouver, BC V6B 1B9, Canada",
                            "category": "Establishment",
                            "day_id": 1838,
                            "favorite": false,
                            "geocode": [49.2844086, -123.1088716],
                            "id": 4,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJ36zlvedzhlQRAFUUd93cPgg/photos/AelY_Cssg7ds9FAUTl9pS_H15av00Y2Sm0u99UCj-jhQE3FlBfbqfY8POfFxeejQKQGyi3j_TAlkqfMsnyK4AHvC1Z1OvsCDKSvt1UvDzaEYgkYkIbsySjq4-Hc4g3I7wpl3hjQLPJQM0sQHoclO9hEwffVpegnYVIfCySNO/media?maxWidthPx=3072&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: Open 24 hours, Tue: Open 24 hours, Wed: Open 24 hours, Thu: Open 24 hours, Fri: Open 24 hours, Sat: Open 24 hours, Sun: Open 24 hours",
                            "lat": 49.2844086,
                            "long": -123.1088716,
                            "phoneNumber": "+1 604-873-7000",
                            "placeName": "Gastown Steam Clock",
                            "place_id": 3322,
                            "rating": "4.5",
                            "summary": "Built in 1977, this well-known, antique-style clock is powered by steam & whistles to tell the time.",
                            "website": null
                        },
                        5: {
                            "address": "Vancouver, BC V6G 1Z4, Canada",
                            "category": "Park",
                            "day_id": 1843,
                            "favorite": false,
                            "geocode": [49.3042584, -123.1442523],
                            "id": 5,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJo-QmrYxxhlQRFuIJtJ1jSjY/photos/AelY_CsdhlIj8r9XAtC-nqzISEV89UViCMog22ua-YY4sUDWNUjJXbPAQEF1Cch0UYhbOIIHR8M3-1JpfheSDNk28RTuXXPSzqAVKy5ET7UuVv3t2C8PpfFcLSCnK64IUOPI1zny8t3dBIqwp2lD-FalF3din-7Yw2YMYXYK/media?maxWidthPx=4080&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: 9:00 AM - 5:00 PM, Tue: 9:00 AM - 5:00 PM, Wed: 9:00 AM - 5:00 PM, Thu: 9:00 AM - 5:00 PM, Fri: 9:00 AM - 5:00 PM, Sat: 9:00 AM - 5:00 PM, Sun: 9:00 AM - 5:00 PM",
                            "lat": 49.3042584,
                            "long": -123.1442523,
                            "phoneNumber": "+1 604-681-6728",
                            "placeName": "Stanley Park",
                            "place_id": 3323,
                            "rating": "4.8",
                            "summary": "Vancouver's largest urban park has beaches, trails & family attractions, plus a picturesque seawall.",
                            "website": "http://vancouver.ca/parks-recreation-culture/stanley-park.aspx"
                        },
                        6: {
                            "address": "845 Avison Way, Vancouver, BC V6G 3E2, Canada",
                            "category": "Aquarium",
                            "day_id": 1843,
                            "favorite": false,
                            "geocode": [49.3004876, -123.1308774],
                            "id": 6,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJp2zKeo1xhlQRWOMOmCcWJV8/photos/AelY_CsSgAYaaoZ7KHJSpJJVONVNXH-5GkI8OE1Fa0R4G2Xt6Oo4WSkpoGIzq07rmkIEThyHoGZCg1d42KtH7_Z_OAAeExS3iv1yqn5qxE4s3oM1xqryHVEnh86Qs7K_-SCzmXFmxk7RkWMMevOjGsyeSMxa6M9SGbD2jJhp/media?maxWidthPx=4032&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: 9:30 AM - 5:30 PM, Tue: 9:30 AM - 5:30 PM, Wed: 9:30 AM - 5:30 PM, Thu: 9:30 AM - 5:30 PM, Fri: 9:30 AM - 5:30 PM, Sat: 9:30 AM - 5:30 PM, Sun: 9:30 AM - 5:30 PM",
                            "lat": 49.3004876,
                            "long": -123.1308774,
                            "phoneNumber": "+1 778-655-9554",
                            "placeName": "Vancouver Aquarium",
                            "place_id": 3324,
                            "rating": "4.5",
                            "summary": "Popular kid-friendly attraction showcases local & exotic aquatic life with a focus on conservation.",
                            "website": "https://www.vanaqua.org/"
                        },
                        7: {
                            "address": "6301 Crescent Rd, Vancouver, BC V6T 1Z2, Canada",
                            "category": "Park",
                            "day_id": 1840,
                            "favorite": false,
                            "geocode": [49.2693791, -123.2564979],
                            "id": 7,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJ463WQ7FyhlQR-LzU0BG7Qz0/photos/AelY_CuQQ9r2b3_GSP5_eqT0s_EckgeKz_CZHtI8Q46g3QtE1lUZAhglxWd0eBTeaLwnRH1TO5-a-vkfIaQdkYmbX5vD2i-8MsEG-QYk-5IFIqHrCXNQ8GzObApfrl4Tq-0zI23K5SGrcJCwBXaRNiyXkz-ycNkVMr30a3Tx/media?maxWidthPx=4032&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: Open 24 hours, Tue: Open 24 hours, Wed: Open 24 hours, Thu: Open 24 hours, Fri: Open 24 hours, Sat: Open 24 hours, Sun: Open 24 hours",
                            "lat": 49.2693791,
                            "long": -123.2564979,
                            "phoneNumber": "+1 604-822-6000",
                            "placeName": "UBC Rose Garden",
                            "place_id": 3325,
                            "rating": "4.7",
                            "summary": null,
                            "website": "http://www.maps.ubc.ca/PROD/index_detail.php?locat1=N026"
                        },
                        8: {
                            "address": "Wreck Beach, SW Marine Dr, Vancouver, BC V6T 1Z4, Canada",
                            "category": "Natural feature",
                            "day_id": 1840,
                            "favorite": false,
                            "geocode": [49.2621955, -123.2615183],
                            "id": 8,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJUzqZj0oNhlQRSzlBeYd5v-0/photos/AelY_CujIx4ZMzOxlduxkSTMGbUlevy7PAcEPFLQINw8ScQChBIzfNMPCJXsS-PhQ0pO_g9KRrxuESQmHba4nB3nB05YLXD5OkqwDLGRx65A2Gccf1x3jMK81hAjQY1S06cjuOUe1aKZXi6IXO1hPHwTyJ3Kp3XIYdnc46MY/media?maxWidthPx=4000&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: 8:00 AM - 8:00 PM, Tue: 8:00 AM - 8:00 PM, Wed: 8:00 AM - 8:00 PM, Thu: 8:00 AM - 8:00 PM, Fri: 8:00 AM - 8:00 PM, Sat: 8:00 AM - 8:00 PM, Sun: 8:00 AM - 8:00 PM",
                            "lat": 49.2621955,
                            "long": -123.2615183,
                            "phoneNumber": null,
                            "placeName": "Wreck Beach",
                            "place_id": 3326,
                            "rating": "4.7",
                            "summary": "Sandy, 7.8km stretch known as North America's largest official naturist beach.",
                            "website": null
                        },
                        9: {
                            "address": "Kitsilano Beach, Vancouver, BC, Canada",
                            "category": "Natural feature",
                            "day_id": 1837,
                            "favorite": false,
                            "geocode": [49.2754238, -123.153535],
                            "id": 9,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJHUYfoDVyhlQRrGFzpe5fhaQ/photos/AelY_CupNTKa5_q3YsYpe1kKiVBki-sZZy0bS8Fwrz-R3eHoOoiGUAjx6ROYzamEICMg4X6v_R8fo_ZfHfiw5X7M0vQMbO9a11Dwe1d9DGupVPzATmoLdwi7CGV9hI3lQTJrcaGFOazSPEER5hxa5Z7akElqPyvUtbsH6fwS/media?maxWidthPx=4000&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": false,
                            "info": "",
                            "lat": 49.2754238,
                            "long": -123.153535,
                            "phoneNumber": null,
                            "placeName": "Kitsilano Beach",
                            "place_id": 3327,
                            "rating": "4.6",
                            "summary": "Popular urban beach offering sandy shores, a playground, volleyball courts & a huge saltwater pool.",
                            "website": "http://vancouver.ca/parks-recreation-culture/kitsilano-beach.aspx"
                        },
                        10: {
                            "address": "2042 W 4th Ave, Vancouver, BC V6J 1M9, Canada",
                            "category": "Restaurant",
                            "day_id": 1838,
                            "favorite": false,
                            "geocode": [49.267915, -123.15143],
                            "id": 10,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJT7myb1hzhlQRsEFaHH_FXOU/photos/AelY_CvALoUsyxbnw44UTReZnheUi1C11pf0Ld6foXqtwUQSb6-g7ycLg-GfEJv5d2QF6wFviOBoN-dgpM_IrUFUFIgRBq05zznPUw9foIx1kIbWhh8c4DIqcbF8hOhacKSV54RfLnS2ALygQHHCTnXMsQCpbjNB1mdKAWHt/media?maxWidthPx=4608&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: Closed, Tue: 9:00 AM - 4:00 PM, Wed: 9:00 AM - 4:00 PM, Thu: 9:00 AM - 4:00 PM, Fri: 9:00 AM - 4:00 PM, Sat: 9:00 AM - 4:00 PM, Sun: 9:00 AM - 4:00 PM",
                            "lat": 49.267915,
                            "long": -123.15143,
                            "phoneNumber": "+1 604-736-8828",
                            "placeName": "Their There",
                            "place_id": 3328,
                            "rating": "4.4",
                            "summary": null,
                            "website": "http://www.theirthere.ca/"
                        },
                        11: {
                            "address": "555 Great Northern Way, Vancouver, BC V5T 1E1, Canada",
                            "category": "Food",
                            "day_id": 1843,
                            "favorite": false,
                            "geocode": [49.267036, -123.0925892],
                            "id": 11,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJZzxdHW9xhlQRKS9s0XXYUZQ/photos/AelY_Cu4yoTWj0MGGxhQD-S_tsDdjJp5Uw6A8-j9_KAHDukh9JuvFLVR85ltb17MH5X1veFs6XDFXe5sa-UuOPyQtcjbVdNDEICahzGJdUpL3NQJGHBlvqb52QhSKbDC60wsotyQUs8W600BXqlf0Qh8yP2vo8Emp9w_65sk/media?maxWidthPx=3456&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": false,
                            "info": "Mon: 8:00 AM - 4:00 PM, Tue: 8:00 AM - 4:00 PM, Wed: 8:00 AM - 4:00 PM, Thu: 8:00 AM - 4:00 PM, Fri: 8:00 AM - 4:00 PM, Sat: 9:00 AM - 5:00 PM, Sun: 9:00 AM - 5:00 PM",
                            "lat": 49.267036,
                            "long": -123.0925892,
                            "phoneNumber": null,
                            "placeName": "Nemesis Coffee GNW",
                            "place_id": 3329,
                            "rating": "4.3",
                            "summary": null,
                            "website": "https://www.nemesis.coffee/"
                        },
                        12: {
                            "address": "20256 56 Ave, Langley, BC V3A 3Y5, Canada",
                            "category": "Restaurant",
                            "day_id": 1837,
                            "favorite": false,
                            "geocode": [49.1039579, -122.6613624],
                            "id": 12,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJ4T6K-tTPhVQRxnZSA5mShuY/photos/AelY_Cv9Aj4gPgGI_AgBEdDSXZSczVuE0D1cUr7A8CN9lHLDByOQcHHnbSqxx7Psyf1GjeRZFvhVKYUWrwPLsjvhop4l7HOykPq6AhMyzFWM6O0wNqW12G7tVxRXTP1BlsrSBs6biaPkuUyQNZjdbCifolpyTtjCG33-zvqb/media?maxWidthPx=1280&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: 11:00 AM - 8:00 PM, Tue: Closed, Wed: 11:00 AM - 8:00 PM, Thu: 11:00 AM - 9:00 PM, Fri: 11:00 AM - 9:00 PM, Sat: 11:00 AM - 9:00 PM, Sun: 11:00 AM - 8:00 PM",
                            "lat": 49.1039579,
                            "long": -122.6613624,
                            "phoneNumber": "+1 604-510-1787",
                            "placeName": "Pho Tam Langley",
                            "place_id": 3330,
                            "rating": "4.7",
                            "summary": null,
                            "website": "https://order.ubereats.com/vancouver/food-delivery/Pho%20Tam%20Vietnamese%20Restaurant/n-Kd6-7FThKQ_MrTVyACNw/?utm_source=web-restaurant-manager"
                        },
                        13: {
                            "address": "1996 Kingsway, Vancouver, BC V5N 2S9, Canada",
                            "category": "Food",
                            "day_id": 1837,
                            "favorite": false,
                            "geocode": [49.2450891, -123.0653888],
                            "id": 13,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJ7xClTa92hlQRL7mlmoiHeUg/photos/AelY_CthOrIo5trWDyDqWIK9hE0hHnDVL8yJ_FDOA9_9hMM5dUIqC_eE17taNsA_qWvC2JuRv1Azdw8eBwMDfgbVSyOSvxc3kjAjF1JGsxyp-Qd2ncmBTXM0BefXnrE29qdmfLJSuAJyP1mJR-PPtybQJf0yaOku45K6iWJ6/media?maxWidthPx=2813&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: Closed, Tue: 10:30 AM - 2:30 PM, Wed: 10:30 AM - 2:30 PM, Thu: 10:30 AM - 2:30 PM, Fri: 10:30 AM - 2:30 PM, Sat: 10:30 AM - 2:30 PM, Sun: 10:30 AM - 2:30 PM",
                            "lat": 49.2450891,
                            "long": -123.0653888,
                            "phoneNumber": "+1 604-875-9740",
                            "placeName": "Pho Duy Restaurant",
                            "place_id": 3331,
                            "rating": "4.2",
                            "summary": null,
                            "website": null
                        },
                        14: {
                            "address": "4567 Lougheed Hwy., Burnaby, BC V5C 3Z6, Canada",
                            "category": "Establishment",
                            "day_id": 1842,
                            "favorite": false,
                            "geocode": [49.2681552, -123.0005819],
                            "id": 14,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJs9jfATF3hlQRQLAQmrvxpqk/photos/AelY_CuqNhEzr0m6voik7m7Igljsk-WcnXutc1VJDukXsdQod-4QPR1i6CmKzXvVHk6OoTEQj1eRPJgvCNLzQMxaPXxI9WZhI5UUjh2TS7uzcpcWKO7eG1fHgtDOVFSfBaLDIhBW1iIsqNP5KkVNCex7kE0AjiLc7y0qmLCQ/media?maxWidthPx=3778&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: 10:00 AM - 8:00 PM, Tue: 10:00 AM - 8:00 PM, Wed: 10:00 AM - 8:00 PM, Thu: 10:00 AM - 9:00 PM, Fri: 10:00 AM - 9:00 PM, Sat: 10:00 AM - 9:00 PM, Sun: 11:00 AM - 7:00 PM",
                            "lat": 49.2681552,
                            "long": -123.0005819,
                            "phoneNumber": "+1 604-298-7314",
                            "placeName": "Brentwood Mall",
                            "place_id": 3332,
                            "rating": "3.9",
                            "summary": null,
                            "website": "https://theamazingbrentwood.com/"
                        },
                        15: {
                            "address": "Trout Lake, Vancouver, BC V5N, Canada",
                            "category": "Establishment",
                            "day_id": 1842,
                            "favorite": false,
                            "geocode": [49.2562519, -123.0622902],
                            "id": 15,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJzaq7R7N2hlQRvzDhJk7twls/photos/AelY_CskjGji31PWhlXljNHIwb7_V6pdNLjlGeFfg9NyoHlVoMReljqkzVNRv-oL2pbuhAx_4oiKyG8WcJ0OA0ZMxdplz0N52rET-QgYu8y4nMNgAAYf7lrAdqKxBoE1YW6fuq30YP9_sVlU484n4Fc-UQfQEcjqAknsaPHG/media?maxWidthPx=4800&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "",
                            "lat": 49.2562519,
                            "long": -123.0622902,
                            "phoneNumber": null,
                            "placeName": "Trout Lake",
                            "place_id": 3333,
                            "rating": "4.6",
                            "summary": null,
                            "website": null
                        },
                        16: {
                            "address": "560 Seymour St, Vancouver, BC V6B 0A8, Canada",
                            "category": "Establishment",
                            "day_id": null,
                            "favorite": false,
                            "geocode": [49.2831592, -123.1145291],
                            "id": 16,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJ62A9n0pxhlQRBHEroUDFLWw/photos/AelY_CsDYFM0phNfGIwNgssjkCXrNHLMcbrSd3V1YU9HnHAM9DHc_bMV257RDsmo8VE60z4j1aQoGFcrb1NIXIRClC9q2MqDuJ3SQF-81-kKoi49U_klKVfmgilL1GskHs9hFCL0DZJ5JonmyrDMeIUs4jM5SxDxAuYbL2Ic/media?maxWidthPx=3475&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": false,
                            "info": "Mon: Closed, Tue: Closed, Wed: Closed, Thu: 10:00 PM - 2:00 AM, Fri: 10:00 PM - 3:00 AM, Sat: 10:00 PM - 3:00 AM, Sun: Closed",
                            "lat": 49.2831592,
                            "long": -123.1145291,
                            "phoneNumber": "+1 778-863-3111",
                            "placeName": "Levels Nightclub",
                            "place_id": 3334,
                            "rating": "3.1",
                            "summary": "Sleek locale featuring top 40 & electronica DJs, a dance floor, VIP tables & a full bar.",
                            "website": "http://levelsvancouver.ca/"
                        },
                        17: {
                            "address": "4807 Main St, Vancouver, BC V5V 3R9, Canada",
                            "category": "Establishment",
                            "day_id": 1836,
                            "favorite": false,
                            "geocode": [49.2417876, -123.1018068],
                            "id": 17,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJ75lsKAp0hlQRxERNSi-eDZ4/photos/AelY_CvgpNtQA6_Wvir6EPrGduNPPc1iRQ4dV0-NVxjb7p6gs9tdBxjx3Lj45ClC20UaLCGoS6g3QFs2gzrH-WViw-1oLqrd4ql29V6nJ9EX56ntE-Rl7fWq5S0gNUghoU53cEobR3Szu2biX81sTLfeUj0rI4OwM28YQoPS/media?maxWidthPx=1042&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: 7:00 AM - 5:00 PM, Tue: 7:00 AM - 5:00 PM, Wed: 7:00 AM - 5:00 PM, Thu: 7:00 AM - 5:00 PM, Fri: 7:00 AM - 5:00 PM, Sat: 7:00 AM - 5:00 PM, Sun: 7:00 AM - 5:00 PM",
                            "lat": 49.2417876,
                            "long": -123.1018068,
                            "phoneNumber": "+1 604-569-4807",
                            "placeName": "Matchstick Riley Park",
                            "place_id": 3336,
                            "rating": "4.2",
                            "summary": "Espresso & elevated light bites served in a cool space with subway tiles & wooden, community tables.",
                            "website": "http://www.matchstickyvr.com/"
                        },
                        18: {
                            "address": "200 Granville St #70, Vancouver, BC V6C 1S4, Canada",
                            "category": "Restaurant",
                            "day_id": 1839,
                            "favorite": false,
                            "geocode": [49.2870179, -123.1130106],
                            "id": 18,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJlyu4u4NxhlQRkUpN_iFwl8Q/photos/AelY_CvKT4-XNeEaXYPTtAJflkqiOfVwIo1_Ulc6RFQ7SC01IPGWM4SYtKAi6NL1ACok6RRbdylHVtZDod74zeaz_AvFyUQ5bS0whZD0XLSf7ZxMpSU8Z-LYn0LufbmqYf9mh11ga765-lJ5mVqo3GeVOvHloLLD3OnkCTjt/media?maxWidthPx=1210&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: 11:30 AM - 10:00 PM, Tue: 11:30 AM - 10:00 PM, Wed: 11:30 AM - 10:00 PM, Thu: 11:30 AM - 10:00 PM, Fri: 11:30 AM - 10:00 PM, Sat: 12:00 - 10:00 PM, Sun: 12:00 - 10:00 PM",
                            "lat": 49.2870179,
                            "long": -123.1130106,
                            "phoneNumber": "+1 604-568-3900",
                            "placeName": "Miku Vancouver",
                            "place_id": 3337,
                            "rating": "4.5",
                            "summary": "Sushi & sustainable seafood are served in a sophisticated setting with a patio & water views.",
                            "website": "http://www.mikurestaurant.com/"
                        },
                        19: {
                            "address": "1032 Alberni St, Vancouver, BC V6E 1A3, Canada",
                            "category": "Bar",
                            "day_id": 1843,
                            "favorite": false,
                            "geocode": [49.2845363, -123.1228402],
                            "id": 19,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJu1r9tIFxhlQRsfy5cILqdDs/photos/AelY_Cul2pChRmj_PU5jWtUPqg3RAXLXPTvYPisw7Cu9UuSKr0WriJYmDOmFwD5viPG1JVtSRD9HRpsgOKrO_NOwOue86f-W-9WMFP7X3Cno_W2lXSWOczuuavaass4GO7h5h6gJ-Gh8HKnWkK8BK_vjNKwhQruGT64vOzAw/media?maxWidthPx=4077&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: 11:30 AM - 12:00 AM, Tue: 11:30 AM - 12:00 AM, Wed: 11:30 AM - 12:00 AM, Thu: 11:30 AM - 12:00 AM, Fri: 11:30 AM - 12:00 AM, Sat: 11:30 AM - 12:00 AM, Sun: 11:30 AM - 12:00 AM",
                            "lat": 49.2845363,
                            "long": -123.1228402,
                            "phoneNumber": "+1 604-637-0777",
                            "placeName": "Black+Blue",
                            "place_id": 3338,
                            "rating": "4.4",
                            "summary": "Bustling 3-level steakhouse with luxe decor, rare cuts of beef & a custom meat locker for dry-aging.",
                            "website": "https://blackandbluesteakhouse.ca/vancouver-home/?utm_source=GoogleBusinessProfile&utm_medium=Website&utm_campaign=MapLabs"
                        },
                        20: {
                            "address": "Vancouver, BC V5Y, Canada",
                            "category": "Park",
                            "day_id": 1839,
                            "favorite": false,
                            "geocode": [49.241757, -123.1126193],
                            "id": 20,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJIcZrTvVzhlQRiKTnD03vt7Q/photos/AelY_Cu6vJIPpvYoBXoP0HdUBq2F6CHF3wbnK9rdvit8umZQ4LpJmsn44QXATAkNPu1TxC72_2LQFcfn8ZENG-vbpuKmyOzeZPpRKQISLphh2o7gGeoTghj1AB-55gFO5FYcNLfD6UCLNa9mQGU-n9AwDuClxcMqf-5vduSv/media?maxWidthPx=4032&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: 6:00 AM - 10:00 PM, Tue: 6:00 AM - 10:00 PM, Wed: 6:00 AM - 10:00 PM, Thu: 6:00 AM - 10:00 PM, Fri: 6:00 AM - 10:00 PM, Sat: 6:00 AM - 10:00 PM, Sun: 6:00 AM - 10:00 PM",
                            "lat": 49.241757,
                            "long": -123.1126193,
                            "phoneNumber": "+1 604-873-7000",
                            "placeName": "Queen Elizabeth Park",
                            "place_id": 3339,
                            "rating": "4.7",
                            "summary": "Urban landmark on a hill featuring manicured gardens, a conservatory, sculptures & sports courts.",
                            "website": "https://vancouver.ca/parks-recreation-culture/queen-elizabeth-park.aspx"
                        },
                        21: {
                            "address": "5251 Oak St, Vancouver, BC V6M 4H1, Canada",
                            "category": "Park",
                            "day_id": 1839,
                            "favorite": false,
                            "geocode": [49.239569, -123.1325405],
                            "id": 21,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJwW3HeIZzhlQRVxJgWI8VjAg/photos/AelY_Cv85dm_sssxAPpW3Ysss6eZKKU49DgvNKWigik9nTedZJyP6hFvQo8ZQndNcYW8ZKlT8qHJauRC5t5Enf2IdsvY69oOqcMcXBtUWa2g6DNZQuha--ezpox3o2GV0DQ_rSWGZwHCggzHBv9uGzlbdrvQu42RPb-jEE76/media?maxWidthPx=4032&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: 9:00 AM - 7:00 PM, Tue: 9:00 AM - 7:00 PM, Wed: 9:00 AM - 7:00 PM, Thu: 9:00 AM - 7:00 PM, Fri: 9:00 AM - 7:00 PM, Sat: 9:00 AM - 7:00 PM, Sun: 9:00 AM - 7:00 PM",
                            "lat": 49.239569,
                            "long": -123.1325405,
                            "phoneNumber": "+1 604-257-8463",
                            "placeName": "VanDusen Botanical Garden",
                            "place_id": 3340,
                            "rating": "4.7",
                            "summary": "Space with ever-changing greenery, flowers & art installations plus fine dining & a casual cafe.",
                            "website": "https://vancouver.ca/parks-recreation-culture/vandusen-botanical-garden.aspx"
                        },
                        22: {
                            "address": "8351 River Rd, Richmond, BC V6X 1Y4, Canada",
                            "category": "Establishment",
                            "day_id": 1838,
                            "favorite": false,
                            "geocode": [49.194577, -123.1305692],
                            "id": 22,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJQ7wAFCR1hlQRL7RB8W3XeOU/photos/AelY_CsdzIp_YhNMpTPTpVJCPrO4JnZp_YjrCk8wmQscdo6RHIjFgGVjaltzOYzx8-UP4FyrJbeXgmLPRETJ8eLqK4xcjVZnzwdY_fXqM0-5IJypfRv5zMtHaG7s6NSlvYKJLQh-pRqpy7WqUpk6e08-AeBCOrqc4znVSKJf/media?maxWidthPx=4096&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: Closed, Tue: Closed, Wed: Closed, Thu: Closed, Fri: 7:00 PM - 12:00 AM, Sat: 7:00 PM - 12:00 AM, Sun: 7:00 - 11:00 PM",
                            "lat": 49.194577,
                            "long": -123.1305692,
                            "phoneNumber": "+1 604-244-8448",
                            "placeName": "Richmond Night Market",
                            "place_id": 3341,
                            "rating": "3.3",
                            "summary": null,
                            "website": "http://www.richmondnightmarket.com/"
                        },
                        23: {
                            "address": "3320 Jacombs Rd Unit 1, Richmond, BC V6V 1Z6, Canada",
                            "category": "Home goods store",
                            "day_id": 1836,
                            "favorite": false,
                            "geocode": [49.1890883, -123.0790622],
                            "id": 23,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJ-_fdMKd1hlQRPf4nf0VyevE/photos/AelY_CtY4lpfFRuucI-3hynL2aaOUmV5UfADzLJx56E9yWnefteIjk4raaALX9uyMbMxKQ_r-U5kVlfwWh5xpcsGfwOIV8T9CwHFGWmENrD1jeM5IiL0-vSfaeN7ZSS9qwojjKb6O2aAasK9WcOZbJ6bdZdlwhooZfpjB6ie/media?maxWidthPx=4032&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: 10:00 AM - 9:00 PM, Tue: 10:00 AM - 9:00 PM, Wed: 10:00 AM - 9:00 PM, Thu: 10:00 AM - 9:00 PM, Fri: 10:00 AM - 9:00 PM, Sat: 10:00 AM - 8:00 PM, Sun: 10:00 AM - 7:00 PM",
                            "lat": 49.1890883,
                            "long": -123.0790622,
                            "phoneNumber": "+1 866-866-4532",
                            "placeName": "IKEA Richmond",
                            "place_id": 3342,
                            "rating": "4.1",
                            "summary": "Scandinavian chain selling ready-to-assemble furniture, plus textiles, lighting & home decor.",
                            "website": "https://www.ikea.com/ca/en/stores/richmond/?utm_source=google&utm_medium=organic&utm_campaign=map&utm_content=richmond"
                        },
                        24: {
                            "address": "3800 Bayview St, Richmond, BC V7E 4R7, Canada",
                            "category": "Food",
                            "day_id": 1841,
                            "favorite": false,
                            "geocode": [49.123929, -123.1843443],
                            "id": 24,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJ170JiUThhVQR2uY6eymTnoA/photos/AelY_CtRCjoV90StDJWsXmDbBpPR51BJDtv5vgnUNeRZVoTRmL_panfrDNJkPzJGzJGPsgPZXBm0kMD29xJ2LNrekSt5bHcKWmhllPQq5OdadQVwofLD9UAYreGiIVq4o6nU46C52nMuri39Ia9cQFLLTjkgf2EgnQruwwao/media?maxWidthPx=4032&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: 8:00 AM - 6:30 PM, Tue: 8:00 AM - 6:30 PM, Wed: 8:00 AM - 6:30 PM, Thu: 8:00 AM - 6:30 PM, Fri: 8:00 AM - 6:30 PM, Sat: 8:00 AM - 6:30 PM, Sun: 8:00 AM - 6:30 PM",
                            "lat": 49.123929,
                            "long": -123.1843443,
                            "phoneNumber": "+1 604-272-5539",
                            "placeName": "Steveston Fisherman's Wharf",
                            "place_id": 3343,
                            "rating": "4.6",
                            "summary": "Floating seafood market on fishing trawlers, with the chance to buy seasonal shrimp, crab & halibut.",
                            "website": "https://stevestonharbour.com/fishermans-wharf/"
                        },
                        25: {
                            "address": "2135 W 41st Ave, Vancouver, BC V6M 1Z6, Canada",
                            "category": "Store",
                            "day_id": 1837,
                            "favorite": false,
                            "geocode": [49.2347102, -123.1565069],
                            "id": 25,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJc4flUnpzhlQR8POkv22_Qac/photos/AelY_CvMfEzXdKwLIDxMNEXUNluefryzcYmRY5dMrHfSXUa1u3yR_pwjQvswslXF-DMg6v-7c4dBjs99DFD753_WmrEsiPPKcw0SfTnvrOi3no9dADaloaHXB0l2UZAJ9HSs7fRLP9xnGAE2ZDNvqH_LyJy8xjvWZ0dPuIKm/media?maxWidthPx=2877&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: 11:00 AM - 9:00 PM, Tue: 11:00 AM - 9:00 PM, Wed: 11:00 AM - 9:00 PM, Thu: 11:00 AM - 9:00 PM, Fri: 11:00 AM - 10:00 PM, Sat: 11:00 AM - 10:00 PM, Sun: 11:00 AM - 9:00 PM",
                            "lat": 49.2347102,
                            "long": -123.1565069,
                            "phoneNumber": "+1 604-263-5054",
                            "placeName": "Nana's Green Tea",
                            "place_id": 3344,
                            "rating": "4.3",
                            "summary": "Compact operation with a contemporary ambiance offering fancy teas, plus miso soup & desserts.",
                            "website": "https://sevenleavestea.com/"
                        },
                        26: {
                            "address": "4151 Hazelbridge Wy, Richmond, BC V6X 4J7, Canada",
                            "category": "Shopping mall",
                            "day_id": 1841,
                            "favorite": false,
                            "geocode": [49.1841117, -123.1335429],
                            "id": 26,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJZdtWPSZ1hlQRJa3mr4CwOi8/photos/AelY_Cv6LxLA9pxiJ5xxPfqoX1K4SaWsPb-aUiU0hXpH4i_iO5-qYa8gZSEh0WAOYA6C_pK0NRXTaRlnXgWlXA7zq2Mz3bC1tD8COCb-iZW-9sIXkmXhj52kh9TP4D00LIU0-NumbS33Z5evaoTGzR37W93SYO92-T_LLlXh/media?maxWidthPx=3729&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: 11:00 AM - 7:00 PM, Tue: 11:00 AM - 7:00 PM, Wed: 11:00 AM - 7:00 PM, Thu: 11:00 AM - 7:00 PM, Fri: 11:00 AM - 8:00 PM, Sat: 11:00 AM - 8:00 PM, Sun: 11:00 AM - 7:00 PM",
                            "lat": 49.1841117,
                            "long": -123.1335429,
                            "phoneNumber": "+1 604-270-1234",
                            "placeName": "Aberdeen Centre",
                            "place_id": 3346,
                            "rating": "4.0",
                            "summary": "Big indoor mall with diverse Asian retailers & eateries, including a dollar store & a food court.",
                            "website": "http://www.aberdeencentre.com/"
                        },
                        27: {
                            "address": "3700 No. 3 Rd, Richmond, BC V6X 3X2, Canada",
                            "category": "Grocery or supermarket",
                            "day_id": 1841,
                            "favorite": false,
                            "geocode": [49.1863717, -123.1328771],
                            "id": 27,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJjdLRoCd1hlQRZS0TOm2sHfA/photos/AelY_Cu08MoS7zVM5WE_MeOvMi-GsDUz6MdAEZLsCFhyYuE5Zu1aOJSQgo6A6vOidA3P0Az5EnQYTKLOdKKcEp5dazN23b3KKLZ4ul1i13tnqAf4kn7lSs6iL0JAFGtwkUgtKx92H-k1yo_2ZgW9XsaShRPb05s2_wTqiZ08/media?maxWidthPx=4032&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": false,
                            "info": "Mon: 9:00 AM - 10:00 PM, Tue: 9:00 AM - 10:00 PM, Wed: 9:00 AM - 10:00 PM, Thu: 9:00 AM - 10:00 PM, Fri: 9:00 AM - 10:00 PM, Sat: 9:00 AM - 10:00 PM, Sun: 9:00 AM - 10:00 PM",
                            "lat": 49.1863717,
                            "long": -123.1328771,
                            "phoneNumber": "+1 604-231-0601",
                            "placeName": "Yaohan Centre",
                            "place_id": 3347,
                            "rating": "3.9",
                            "summary": "Shopping complex featuring Asian retailers, including a grocery store, along with a food court.",
                            "website": "http://www.yaohancentre.com/"
                        },
                        28: {
                            "address": "Unit1316, 8368 Capstan Wy, Richmond, BC V6X 4B4, Canada",
                            "category": "Cafe",
                            "day_id": 1836,
                            "favorite": false,
                            "geocode": [49.1872652, -123.1302458],
                            "id": 28,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJ94LONPR1hlQRKDa4FThq2EY/photos/AelY_CscJMya0fqYZMguYyRe0cj6gAtS9sZXYKvQVZDWj1WIUrU49OZYWp-NkUqtIVxf5gD5QXM9v3Q7zCBAGyMWtn1aWJhAHBA959SUV3dDxZcHD4uvIfRpr0YDs01XXAg-q2h_IwR4MfAKA10N95Lue1dTRN0i3Nkh5y5m/media?maxWidthPx=4000&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: 12:00 - 10:00 PM, Tue: 12:00 - 10:00 PM, Wed: 12:00 - 10:00 PM, Thu: 12:00 - 10:00 PM, Fri: 12:00 - 10:00 PM, Sat: 12:00 - 10:00 PM, Sun: 12:00 - 10:00 PM",
                            "lat": 49.1872652,
                            "long": -123.1302458,
                            "phoneNumber": "+1 604-285-5997",
                            "placeName": "MACU TEA- Capstan Way",
                            "place_id": 3348,
                            "rating": "4.4",
                            "summary": null,
                            "website": "https://www.instagram.com/macutea.bc/"
                        },
                        29: {
                            "address": "6551 No. 3 Rd, Richmond, BC V6Y 2B6, Canada",
                            "category": "Shopping mall",
                            "day_id": 1841,
                            "favorite": false,
                            "geocode": [49.1672705, -123.1384481],
                            "id": 29,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJDz5vqMsKhlQRDr0Xeb-CLjY/photos/AelY_Cu2Q1yvQ7fyvkIfiRlfk78b0b4fUNFOSGcCW_gBf_AQVy2j0dykEPTyrZ7HRa0NyYWq4QHGVCS5PPStHXSRqEwmqlNVoL92nauTxqDwCxl9fALlfqupuSDwzUuL6TFOZMiaIBu5vGHG3GhVyeROeTIN_XCz6o2SWEpx/media?maxWidthPx=1080&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: 10:00 AM - 9:00 PM, Tue: 10:00 AM - 9:00 PM, Wed: 10:00 AM - 9:00 PM, Thu: 10:00 AM - 9:00 PM, Fri: 10:00 AM - 9:00 PM, Sat: 10:00 AM - 9:00 PM, Sun: 11:00 AM - 7:00 PM",
                            "lat": 49.1672705,
                            "long": -123.1384481,
                            "phoneNumber": "+1 604-713-7467",
                            "placeName": "CF Richmond Centre",
                            "place_id": 3349,
                            "rating": "4.2",
                            "summary": "Large, light-filled mall with familiar stores, plus counter-serve eateries & sit-down restaurants.",
                            "website": "https://shops.cadillacfairview.com/property/cf-richmond-centre"
                        },
                        30: {
                            "address": "5951 No. 3 Rd Unit 200, Richmond, BC V6X 2E3, Canada",
                            "category": "Food",
                            "day_id": 1841,
                            "favorite": false,
                            "geocode": [49.1708599, -123.1370615],
                            "id": 30,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJm9FoVjN1hlQRe7ATPx9deoY/photos/AelY_CslhwgSK7ycMIhUIeRteSa4LpudMTRqeVG8ImsveiF5z4CG88bpQDFBJzqzaNFx0pgafWdL7CfqpLgySwGwIU7rU99oSirem3PXeB0HftwYkPFO_j1Iwjf1HdVTQkmipzvWbmPFmFmb89APSOsteDlSe_ELDUxpeCo/media?maxWidthPx=4032&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: 9:00 AM - 3:00 PM; 5:30 - 10:00 PM, Tue: 9:00 AM - 3:00 PM; 5:30 - 10:00 PM, Wed: 9:00 AM - 3:00 PM; 5:30 - 10:00 PM, Thu: 9:00 AM - 3:00 PM; 5:30 - 10:00 PM, Fri: 9:00 AM - 3:00 PM; 5:30 - 10:00 PM, Sat: 9:00 AM - 3:00 PM; 5:30 - 10:00 PM, Sun: 9:00 AM - 3:00 PM; 5:30 - 10:00 PM",
                            "lat": 49.1708599,
                            "long": -123.1370615,
                            "phoneNumber": "+1 604-249-0080",
                            "placeName": "Empire Seafood Restaurant (Richmond)",
                            "place_id": 3350,
                            "rating": "4.0",
                            "summary": "Upscale eatery serving contemporary Chinese cuisine, including seafood, with many dim sum options.",
                            "website": "http://www.empirerestaurant.ca/"
                        },
                        31: {
                            "address": "1100 Robson St, Vancouver, BC V6E 1B2, Canada",
                            "category": "Clothing store",
                            "day_id": 1843,
                            "favorite": false,
                            "geocode": [49.2845862, -123.1252497],
                            "id": 31,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJVUty9YBxhlQRzsGy5YPpbBk/photos/AelY_CsoNoKwBAUApCKVZoogJWmlmnfNhq2dInlI7QHMdhTiwy-9ll5h38M8UdxjJ_6LGrgjxWIBloSWKJeKbt4J6b7L-9yfQkOhDQN7froCELj06ZLn_gKeX-mmGzUauld0E7VRyPgQN4aMvXi7COhqODSxv4Xd07ZYp4Qw/media?maxWidthPx=4032&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: 10:00 AM - 9:30 PM, Tue: 10:00 AM - 9:30 PM, Wed: 10:00 AM - 9:30 PM, Thu: 10:00 AM - 10:00 PM, Fri: 10:00 AM - 10:00 PM, Sat: 10:00 AM - 10:00 PM, Sun: 10:00 AM - 9:30 PM",
                            "lat": 49.2845862,
                            "long": -123.1252497,
                            "phoneNumber": "+1 604-684-3251",
                            "placeName": "Aritzia",
                            "place_id": 3351,
                            "rating": "3.6",
                            "summary": "Chain of eclectic boutiques, stocked with trendy women's clothing & accessories.",
                            "website": "https://www.aritzia.com/en/store?StoreID=aritzia-robson-vancouver"
                        },
                        32: {
                            "address": "2153 W 4th Ave, Vancouver, BC V6K 1N7, Canada",
                            "category": "Restaurant",
                            "day_id": 1840,
                            "favorite": false,
                            "geocode": [49.268274, -123.154001],
                            "id": 32,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJS1MJoNZzhlQRDDUvOzoHHZU/photos/AelY_Ct9S-V4az4LiFWvCJDDNxKMLWtY5VuC5m_AH79v6I1WzS8Xyzkt1wYdN5xVW7cBkA31ArggoFwRgC2nXDZfWUEPV8zgQYGVOZFyCN1cFQeSDh3ShcbqCIMlb4nYRZ0vuNdUijcfgR6ywwm7KiaxxJRLgn0xO9ygE9UJ/media?maxWidthPx=2172&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: 8:00 AM - 2:30 PM, Tue: 8:00 AM - 2:30 PM, Wed: 8:00 AM - 2:30 PM, Thu: 8:00 AM - 2:30 PM, Fri: 8:00 AM - 2:30 PM, Sat: 8:00 AM - 3:00 PM, Sun: 8:00 AM - 3:00 PM",
                            "lat": 49.268274,
                            "long": -123.154001,
                            "phoneNumber": "+1 604-423-3350",
                            "placeName": "Jam Cafe Kitsilano",
                            "place_id": 3352,
                            "rating": "4.6",
                            "summary": null,
                            "website": "https://jamcafes.com/"
                        },
                        33: {
                            "address": "560 Seymour St, Vancouver, BC V6B 0A8, Canada",
                            "category": "Establishment",
                            "day_id": 1836,
                            "favorite": false,
                            "geocode": [49.2831592, -123.1145291],
                            "id": 33,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJ62A9n0pxhlQRBHEroUDFLWw/photos/AelY_Cuh-B6bTd0CH7CU_dFnTf06zY6UPfszHFs0DJTEBEjiuNb3MAxYbsg-Uw9yjkKm021Fdw173aPDKn0_H1WFMEdSb9vhEUOSBN58TxLsR5TigFce_tdwFZ5RNz3QAuVenzTjBqk11qmKKCxq6St9o_g_-5pKx8uSLeO8/media?maxWidthPx=3475&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": false,
                            "info": "Mon: Closed, Tue: Closed, Wed: Closed, Thu: 10:00 PM - 2:00 AM, Fri: 10:00 PM - 3:00 AM, Sat: 10:00 PM - 3:00 AM, Sun: Closed",
                            "lat": 49.2831592,
                            "long": -123.1145291,
                            "phoneNumber": "+1 778-863-3111",
                            "placeName": "Levels Nightclub",
                            "place_id": 3353,
                            "rating": "3.1",
                            "summary": "Sleek locale featuring top 40 & electronica DJs, a dance floor, VIP tables & a full bar.",
                            "website": "http://levelsvancouver.ca/"
                        },
                        34: {
                            "address": "2153 W 4th Ave, Vancouver, British Columbia V6K 1N7",
                            "category": "breakfast spot",
                            "day_id": 1840,
                            "favorite": false,
                            "geocode": [49.268335, -123.153952],
                            "id": 34,
                            "imgURL": "https://images.unsplash.com/photo-1594012531621-23dc573ba808?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzAyODV8MHwxfHNlYXJjaHwxfHxKYW0tQ2FmZXxlbnwwfHx8fDE3MjQyOTE2MjR8MA&ixlib=rb-4.0.3&q=80&w=1080",
                            "in_itinerary": true,
                            "info": "",
                            "lat": 49.268335,
                            "long": -123.153952,
                            "phoneNumber": null,
                            "placeName": "Jam Cafe",
                            "place_id": 3356,
                            "rating": null,
                            "summary": null,
                            "website": null
                        },
                        35: {
                            "address": "White Rock, BC V4A, Canada",
                            "category": "Tourist attraction",
                            "day_id": 1838,
                            "favorite": false,
                            "geocode": [49.0171089, -122.8056869],
                            "id": 35,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJ1Zb2TufDhVQRj2JOgo3uUvw/photos/AelY_CsGT8ziLGsKuS79s56rwKIXsBfdewf7dgyGOozdsUKgzlt9z984zTbJ73N14JPtZBKINGSU7jOsp72LUp0F51J2ScEC49PV37X_6uTs1Anv6Ytg0o2im6FG3INda3ayaovxQQP9q1yaaTf0Z2DD91wnNA8ydKap5ar2/media?maxWidthPx=4032&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: Open 24 hours, Tue: Open 24 hours, Wed: Open 24 hours, Thu: Open 24 hours, Fri: Open 24 hours, Sat: Open 24 hours, Sun: Open 24 hours",
                            "lat": 49.0171089,
                            "long": -122.8056869,
                            "phoneNumber": null,
                            "placeName": "White Rock Pier",
                            "place_id": 3386,
                            "rating": "4.8",
                            "summary": null,
                            "website": null
                        },
                        36: {
                            "address": "3596 E Hastings St, Vancouver, BC V5K 2A7, Canada",
                            "category": "Establishment",
                            "day_id": 1842,
                            "favorite": false,
                            "geocode": [49.2810072, -123.0260286],
                            "id": 36,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJ41wfngxxhlQRCPXU-tD5zxQ/photos/AelY_CuM6ENgCUDk3R9GwF7DQecZWSPiiTl6V_bo5JvQAX7Dk5fPHWNuN01a3W1VhbgkFdbnNAipKg_LZP5OEk8XqUsXubI6QIZ_faMT_zNBqok_37uLGaJEfKYE4Y7XoKDbkqYPFQYLMstMA-5P0ToJBOEXFeMPsA8Q4Adc/media?maxWidthPx=4080&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: Closed, Tue: Closed, Wed: 10:00 AM - 8:00 PM, Thu: 10:00 AM - 8:00 PM, Fri: 10:00 AM - 8:00 PM, Sat: 10:00 AM - 8:00 PM, Sun: 10:00 AM - 4:00 PM",
                            "lat": 49.2810072,
                            "long": -123.0260286,
                            "phoneNumber": "+1 604-423-5969",
                            "placeName": "Kanadell Japanese Bakery",
                            "place_id": 3387,
                            "rating": "4.7",
                            "summary": null,
                            "website": "https://www.kanadell.com/"
                        },
                        37: {
                            "address": "7800 Vivian Dr, Vancouver, BC V5S 2E6, Canada",
                            "category": "Tourist attraction",
                            "day_id": 1840,
                            "favorite": false,
                            "geocode": [49.212453, -123.0477333],
                            "id": 37,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJqW57tcF1hlQRCFnyi2kJn_U/photos/AelY_CskQeNWvV1jsua2LM0xRSQy2D01iqYyNT4Xk74sbnR_AOmH9Zm3CmykO_-8A6tEiUfHZt49g0N9KmjOGBSCfN8CUxXfutrzbxrBx1WjlSHQup9XBdxX-2nnRaJPjVJjGK3pMW6z592lEcdCDxpzZVsG2h2k7vJd9nmA/media?maxWidthPx=2009&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": false,
                            "info": "Mon: 6:00 AM - 8:00 PM, Tue: 6:00 AM - 8:00 PM, Wed: 6:00 AM - 8:00 PM, Thu: 6:00 AM - 8:00 PM, Fri: 6:00 AM - 8:00 PM, Sat: 6:00 AM - 8:00 PM, Sun: 6:00 AM - 8:00 PM",
                            "lat": 49.212453,
                            "long": -123.0477333,
                            "phoneNumber": "+1 604-257-6925",
                            "placeName": "Fraserview Golf Course",
                            "place_id": 3390,
                            "rating": "4.5",
                            "summary": "Well-maintained 18-hole, par-72 course with tree-lined fairways, putting greens & driving range.",
                            "website": "https://vancouver.ca/parks-recreation-culture/fraserview-golf-course.aspx"
                        },
                        38: {
                            "address": "10320 152A St, Surrey, BC V3R 7P6, Canada",
                            "category": "Restaurant",
                            "day_id": 1839,
                            "favorite": false,
                            "geocode": [49.1897845, -122.799234],
                            "id": 38,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJkQdbDxPXhVQRT7wD-dFbV0w/photos/AelY_CviwWGPnGHfRiFloq8aYwAe_R38FINiHkzS6cllyTTZs5LfZwZsIIU5-VWtrifFXufJHORcEsB951YubLcf6lYuxZArP1oF233dKYko97l33XEDhSDDdajSK5KA7BLHsBMFDOIUj_ueE7uXiGWhvgCP3OhcpFF0Q2Vg/media?maxWidthPx=4656&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: 11:30 AM - 9:30 PM, Tue: 11:30 AM - 9:30 PM, Wed: 11:30 AM - 9:30 PM, Thu: 11:30 AM - 9:30 PM, Fri: 11:30 AM - 10:00 PM, Sat: 11:30 AM - 10:00 PM, Sun: 11:30 AM - 9:30 PM",
                            "lat": 49.1897845,
                            "long": -122.799234,
                            "phoneNumber": "+1 604-931-8284",
                            "placeName": "Sushi California",
                            "place_id": 3391,
                            "rating": "4.2",
                            "summary": "Roomy, understated chain outlet offering an extensive menu of sushi dishes & a take-out option.",
                            "website": "https://sushi-california.com/"
                        }
                    },
                    "places_last": 38,
                    "saved_places": {
                        "addresses": [
                            "555 Great Northern Way, Vancouver, BC V5T 1E1, Canada",
                            "Kitsilano Beach, Vancouver, BC, Canada",
                            "560 Seymour St, Vancouver, BC V6B 0A8, Canada",
                            "3700 No. 3 Rd, Richmond, BC V6X 3X2, Canada",
                            "560 Seymour St, Vancouver, BC V6B 0A8, Canada",
                            "7800 Vivian Dr, Vancouver, BC V5S 2E6, Canada"
                        ],
                        "placesIds": [11, 9, 16, 27, 33, 37]
                    },
                    "trip_id": "410"
                },
                itineraryFirstLoad: false,
            },
        },
        {
            destination: "Tokyo, Japan",
            numberOfDays: 3,
            numberOfPlaces: 17,
            summary: "Quick trip to Tokyo",
            imgUrl: "https://i.imgur.com/P0uFgr1h.jpg",
            flagImgUrl: "https://i.imgur.com/ynHaCOHh.jpg",
            trip: {
                tripID: null,
                tripName: "Quick trip to Tokyo",
                city: "Tokyo",
                country: "Japan",
                country_2letter: "JP",
                startDate: "2024-08-31",
                endDate: "2024-09-02",
                geocode: [35.6764, 139.6500],
                tripDuration: 3,
                imgUrl: "https://i.imgur.com/egL9NRQh.jpg",
                places: [],
                itinerary: {
                    "day_order": [
                        "day-1",
                        "day-2",
                        "day-3"
                    ],
                    "days": {
                        "day-1": {
                            "date_converted": "Saturday, August 31",
                            "date_formatted": "Sat, 31 Aug 2024 00:00:00 GMT",
                            "date_short": "08/31",
                            "day_id": 1852,
                            "day_short": "Sat",
                            "id": "day-1",
                            "placeIds": [3, 2, 13, 15]
                        },
                        "day-2": {
                            "date_converted": "Sunday, September 01",
                            "date_formatted": "Sun, 01 Sep 2024 00:00:00 GMT",
                            "date_short": "09/01",
                            "day_id": 1853,
                            "day_short": "Sun",
                            "id": "day-2",
                            "placeIds": [11, 10, 12, 17]
                        },
                        "day-3": {
                            "date_converted": "Monday, September 02",
                            "date_formatted": "Mon, 02 Sep 2024 00:00:00 GMT",
                            "date_short": "09/02",
                            "day_id": 1854,
                            "day_short": "Mon",
                            "id": "day-3",
                            "placeIds": [9, 5, 6, 7]
                        }
                    },
                    "places": {
                        1: {
                            "address": "4-chōme-2-8 Shibakōen, Minato City, Tokyo 105-0011, Japan",
                            "category": "Shopping mall",
                            "day_id": 1852,
                            "favorite": false,
                            "geocode": [35.6585805, 139.7454329],
                            "id": 1,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJCewJkL2LGGAR3Qmk0vCTGkg/photos/AelY_Ctu5-_Q1XsZdyfdJQaoNMvEfG0jPlXU04VVkHEn5oV6xQLENNus1XJ-9ct0BWHChLgV4bl8rZSemsajS1zQF0-ReGol8FAvPfJKi5DhTq4Ptsev_ixGHEjMRGekWUjkgHlokG-OSFTBBHfPx4KnFomXZptQemhIO6os/media?maxWidthPx=3600&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": false,
                            "info": "Mon: 9:00 AM - 10:30 PM, Tue: 9:00 AM - 10:30 PM, Wed: 9:00 AM - 10:30 PM, Thu: 9:00 AM - 10:30 PM, Fri: 9:00 AM - 10:30 PM, Sat: 9:00 AM - 10:30 PM, Sun: 9:00 AM - 10:30 PM",
                            "lat": 35.6585805,
                            "long": 139.7454329,
                            "phoneNumber": "+81 3-3433-5111",
                            "placeName": "Tokyo Tower",
                            "place_id": 3392,
                            "rating": "4.5",
                            "summary": "Reminiscent of the Eiffel Tower, this landmark features observation areas & other attractions.",
                            "website": "https://www.tokyotower.co.jp/"
                        },
                        2: {
                            "address": "1-1 Maihama, Urayasu, Chiba 279-0031, Japan",
                            "category": "Amusement park",
                            "day_id": 1852,
                            "favorite": false,
                            "geocode": [35.6306579, 139.8828695],
                            "id": 2,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJzaLT0Bl9GGARX3OJ1IrbKdo/photos/AelY_CvWeoh2KnljyUkuku8WayJIkB8zQCJCilYuXRpE1lVL3VUMZ4GKlYa18_yDLn-OmxPdBKssprr0kTEY9xbzxwZnUfLCriijFBVVWNEJFhltpxRAzKRpvFzOXcN1WBg5hIr8hWOor9nKCKQ7Y39XhJHGyYkYJXqzCYAN/media?maxWidthPx=2993&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "",
                            "lat": 35.6306579,
                            "long": 139.8828695,
                            "phoneNumber": "+81 45-330-5211",
                            "placeName": "Tokyo Disney Resort",
                            "place_id": 3393,
                            "rating": "4.6",
                            "summary": null,
                            "website": "https://www.tokyodisneyresort.jp/"
                        },
                        3: {
                            "address": "1-13 Maihama, Urayasu, Chiba 279-8511, Japan",
                            "category": "Tourist attraction",
                            "day_id": 1852,
                            "favorite": false,
                            "geocode": [35.6267108, 139.8850779],
                            "id": 3,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJszdHEQN9GGARJS23SnAdR0E/photos/AelY_CseeFQRe4BxOaBTct6Gr8aMiwl-dDtzacwjAI4A8MlhTvihJW5TjVQ3PAkfY69hflmeFZqpS0zLpsWqPbhezBu4oeE8GwZAHgbKnmmQ5WttixO88kN5Y8XfyokiVMlt4add9PguE4DNOnUOuYinPjnI29WDDHXPLvzY/media?maxWidthPx=4032&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "",
                            "lat": 35.6267108,
                            "long": 139.8850779,
                            "phoneNumber": "+81 45-330-5211",
                            "placeName": "Tokyo DisneySea",
                            "place_id": 3394,
                            "rating": "4.6",
                            "summary": "Part of the Disney resort, this large park has 7 themed ports of call with rides, shows & dining.",
                            "website": "https://www.tokyodisneyresort.jp/tds/"
                        },
                        4: {
                            "address": "Japan, 〒150-6145 Tokyo, Shibuya City, Shibuya, 2-chōme−24−１２ 14階・45階・46階・屋上",
                            "category": "Tourist attraction",
                            "day_id": 1854,
                            "favorite": false,
                            "geocode": [35.6584466, 139.7021636],
                            "id": 4,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJ4Rr2JWiLGGARcyRSHuZ-9G8/photos/AelY_Ct1qiZo6TD1qDDVPkuSSsSwgy7usoUKTggV08m-8fcggkMEUUnfUzLAJMC33UicO320wOfNx6nJ7d5jhDLeLDdNC8JOdrVTnigqfnm6qcgoROTf0YURzxx0tfxPKqv9dmPUM6V7PLtmwtPsuUQxy2LAceBSaHP27hVr/media?maxWidthPx=3024&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": false,
                            "info": "Mon: 10:00 AM - 10:30 PM, Tue: 10:00 AM - 10:30 PM, Wed: 10:00 AM - 10:30 PM, Thu: 10:00 AM - 10:30 PM, Fri: 10:00 AM - 10:30 PM, Sat: 10:00 AM - 10:30 PM, Sun: 10:00 AM - 10:30 PM",
                            "lat": 35.6584466,
                            "long": 139.7021636,
                            "phoneNumber": "+81 3-4221-0229",
                            "placeName": "SHIBUYA SKY",
                            "place_id": 3395,
                            "rating": "4.6",
                            "summary": "A 360° open-air observation deck located on the roof of the Shibuya Scramble Square skyscraper.",
                            "website": "https://www.shibuya-scramble-square.com/sky/"
                        },
                        5: {
                            "address": "21 Udagawacho, Shibuya City, Tokyo 150-0042, Japan",
                            "category": "Establishment",
                            "day_id": 1854,
                            "favorite": false,
                            "geocode": [35.659482, 139.7005596],
                            "id": 5,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJK9EM68qLGGARacmu4KJj5SA/photos/AelY_CtzJpPFvs5uTpByBAt67Oyer41NKa8t3rtm3tcavjaPvi3KJzV5SLwT0NyFa389ejWgTrW80QC_qvGcD9rdLXjeUeDqVMKE-2JwNUd3UYzF7r8844v-EVil0AECOqSW5KyB8PL3Ke1AL_bmNs3mamv8YKSHlXDaTGz5/media?maxWidthPx=3840&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "",
                            "lat": 35.659482,
                            "long": 139.7005596,
                            "phoneNumber": null,
                            "placeName": "Shibuya Scramble Crossing",
                            "place_id": 3396,
                            "rating": "4.5",
                            "summary": null,
                            "website": null
                        },
                        6: {
                            "address": "3-chōme-38-1 Shinjuku, Shinjuku City, Tokyo 160-0022, Japan",
                            "category": "Transit station",
                            "day_id": 1854,
                            "favorite": false,
                            "geocode": [35.6896067, 139.7005713],
                            "id": 6,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJH7qx1tCMGGAR1f2s7PGhMhw/photos/AelY_CtbGf91s4FmStKAiwobhMIYci19Fg7kzTySpesrmZaIWYCo8x0e8sP2bhl45_nhMPpqLWRGbrIm56HdPeiZwjK_Jyn7vD3KKwQu1mygzqB1SpzZOamakCSfribOCrUaAawvo3BoiAuNv5bu-gwOgmCTzZFDtqXH7_xI/media?maxWidthPx=3205&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "",
                            "lat": 35.6896067,
                            "long": 139.7005713,
                            "phoneNumber": null,
                            "placeName": "Shinjuku Station",
                            "place_id": 3397,
                            "rating": "3.8",
                            "summary": null,
                            "website": "http://www.jreast.co.jp/estation/station/info.aspx?StationCd=866"
                        },
                        7: {
                            "address": "1-1 Yoyogikamizonochō, Shibuya City, Tokyo 151-8557, Japan",
                            "category": "Establishment",
                            "day_id": 1854,
                            "favorite": false,
                            "geocode": [35.6763976, 139.6993259],
                            "id": 7,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJ5SZMmreMGGARcz8QSTiJyo8/photos/AelY_CtqqfHoAfg7pgefCcU_Aes0ts4GrIKJq2q9DH0NUNIffkOcOh6D3kZ-omOiU2rf212-UdM2XdlcvnraXzwN9HuV1xzuPnOtAQNs3M9Uo7S-SPBphvd0fgOc0azu3OshJ_JcknitrYkq3lcvjVCbv3C1kScPkzUIhThY/media?maxWidthPx=1719&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "",
                            "lat": 35.6763976,
                            "long": 139.6993259,
                            "phoneNumber": "+81 3-3379-5511",
                            "placeName": "Meiji Jingu",
                            "place_id": 3398,
                            "rating": "4.6",
                            "summary": "Surrounded by forest, this venerable Shinto shrine features a seasonal iris garden.",
                            "website": "https://www.meijijingu.or.jp/"
                        },
                        8: {
                            "address": "1 Chome-2 Nishishinjuku, Shinjuku City, Tokyo 160-0023, Japan",
                            "category": "Establishment",
                            "day_id": 1853,
                            "favorite": false,
                            "geocode": [35.6929614, 139.6995724],
                            "id": 8,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJP9eKBdeMGGAR0zzBXJNVj5A/photos/AelY_Cs1AM7RI1i_44ODmAtovG-pkc4Iy81oEda3TKIScAEOzBo2D27JvTDwa1HUcQgH3ZZjHojyUY2tx9Q1f1HPZ6_FI6OLmVNNdknsACB3jf9p2dRMaTBh6YwESPFIM7DUJc8cSz9dptglP9zP0m9fZ9sy9eMW6vn20ss8/media?maxWidthPx=3024&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": false,
                            "info": "Mon: Open 24 hours, Tue: Open 24 hours, Wed: Open 24 hours, Thu: Open 24 hours, Fri: Open 24 hours, Sat: Open 24 hours, Sun: Open 24 hours",
                            "lat": 35.6929614,
                            "long": 139.6995724,
                            "phoneNumber": null,
                            "placeName": "Omoide Yokocho",
                            "place_id": 3399,
                            "rating": "4.1",
                            "summary": "Landmark alleyway featuring a selection of food stalls for simple fare & alcoholic drinks.",
                            "website": "http://shinjuku-omoide.com/"
                        },
                        9: {
                            "address": "6-chōme-1-16 Toyosu, Koto City, Tokyo 135-0061, Japan",
                            "category": "Amusement park",
                            "day_id": 1854,
                            "favorite": false,
                            "geocode": [35.6491207, 139.7897739],
                            "id": 9,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJSeco5wiJGGARItbTS8lQ5G0/photos/AelY_CsdJl8stvldQwwndNSdxUWSntSnuqS6rqi3WJsG8NiWoCDcBOMWIWuru-0359QlgZ4cXz21w--eULrmZOHB2mc-Is3qWbOhVXmAjIfybVgpYm6UA12J0CW2u8X2cjVaMSoXysFyCZHYr8iI69G5BdN03ACrZM_bN8sf/media?maxWidthPx=3648&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: 9:00 AM - 10:00 PM, Tue: 9:00 AM - 10:00 PM, Wed: 9:00 AM - 10:00 PM, Thu: 9:00 AM - 10:00 PM, Fri: 9:00 AM - 10:00 PM, Sat: 9:00 AM - 10:00 PM, Sun: 9:00 AM - 10:00 PM",
                            "lat": 35.6491207,
                            "long": 139.7897739,
                            "phoneNumber": null,
                            "placeName": "teamLab Planets",
                            "place_id": 3400,
                            "rating": "4.5",
                            "summary": null,
                            "website": "https://www.teamlab.art/jp/e/planets/"
                        },
                        10: {
                            "address": "2-chōme-3-1 Asakusa, Taito City, Tokyo 111-0032, Japan",
                            "category": "Establishment",
                            "day_id": 1853,
                            "favorite": false,
                            "geocode": [35.7147651, 139.7966553],
                            "id": 10,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJ8T1GpMGOGGARDYGSgpooDWw/photos/AelY_CsXn8N6SutVyl77sLjYxSI95HL-gaF6canGaTVtckb0qm5INSVWAFrJT2dhZo-a3QXh00faXQ0wWb8MYoHDXrFVun9Mjden2pH-XrOfjukcQqQugX0SFTIm8d4mwbRl9JC5mpPPimyPie_iwS5hYK_giWcvKq3-xTGq/media?maxWidthPx=4800&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "",
                            "lat": 35.7147651,
                            "long": 139.7966553,
                            "phoneNumber": "+81 3-3842-0181",
                            "placeName": "Senso-Ji Tempel",
                            "place_id": 3401,
                            "rating": "4.5",
                            "summary": "Completed in 645, this temple, Tokyo's oldest, was built to honor Kannon, the goddess of mercy.",
                            "website": "https://www.senso-ji.jp/"
                        },
                        11: {
                            "address": "Asakusa, Taito City, Tokyo 111-0032, Japan",
                            "category": "Geocode",
                            "day_id": 1853,
                            "favorite": false,
                            "geocode": [35.7185858, 139.7958849],
                            "id": 11,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJM1N_BMKOGGARZ0DHgTj9hHw/photos/AelY_Cv-RUYq7xKNEeYUxjhg3X6tS4PsbFeMO_4Vk0iM9yZBISR31w4eInLn3p3wI-DUQXtp7mLHvUJ80AJ2wfKmWZ8ZjInKsr9I08ByA-L3uxth8QiqPgUoGRGNQz6xieL_2Mmo5OjPOPaiB0JJanztVdzGT6ucxTv-1yIR/media?maxWidthPx=3464&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "",
                            "lat": 35.7185858,
                            "long": 139.7958849,
                            "phoneNumber": null,
                            "placeName": "Asakusa",
                            "place_id": 3402,
                            "rating": null,
                            "summary": "Traditional district featuring an ancient Buddhist temple, street-food stalls, craft shops & more.",
                            "website": null
                        },
                        12: {
                            "address": "6 Chome-10 Ueno, Taito City, Tokyo 110-0005, Japan",
                            "category": "Tourist attraction",
                            "day_id": 1853,
                            "favorite": false,
                            "geocode": [35.708978, 139.7747155],
                            "id": 12,
                            "imgURL": "https://lh3.googleusercontent.com/places/ANXAkqEJvIW8B2fcyqZAERApPTMck1vPtKqzTQs-W3WGrdrCHSOsUTI9OpfMDsaBIj3062EXNKjl9LhVnG0_AzDv8Bo9ToLGE8eesPg=s4800-w512",
                            "in_itinerary": true,
                            "info": "Mon: 10:00 AM - 8:00 PM, Tue: 10:00 AM - 8:00 PM, Wed: 10:00 AM - 8:00 PM, Thu: 10:00 AM - 8:00 PM, Fri: 10:00 AM - 8:00 PM, Sat: 10:00 AM - 8:00 PM, Sun: 10:00 AM - 8:00 PM",
                            "lat": 35.708978,
                            "long": 139.7747155,
                            "phoneNumber": "+81 3-3832-5053",
                            "placeName": "Ueno Ameyoko Shopping Street",
                            "place_id": 3447,
                            "rating": "4.2",
                            "summary": "",
                            "website": "http://www.ameyoko.net/"
                        },
                        13: {
                            "address": "2-chōme-16-2 Sotokanda, Chiyoda City, Tokyo 101-0021, Japan",
                            "category": "Tourist attraction",
                            "day_id": 1852,
                            "favorite": false,
                            "geocode": [35.7020186, 139.7678943],
                            "id": 13,
                            "imgURL": "https://lh3.googleusercontent.com/places/ANXAkqF8BgjgHyBVFkYphnmesbEsoIeeXPrAvmQ10xvr9EhW2lopaI85uTdF1_R88lIHixqOI3ieB8NZwVWxR7JS4ESEcwMKpuMMlnA=s4800-w512",
                            "in_itinerary": true,
                            "info": "Mon: Open 24 hours, Tue: Open 24 hours, Wed: Open 24 hours, Thu: Open 24 hours, Fri: Open 24 hours, Sat: Open 24 hours, Sun: Open 24 hours",
                            "lat": 35.7020186,
                            "long": 139.7678943,
                            "phoneNumber": "+81 3-3254-0753",
                            "placeName": "Kanda Myoujin Shrine",
                            "place_id": 3448,
                            "rating": "4.4",
                            "summary": "Venerable Shinto shrine moved to its current locale in 1616, with vibrant vermilion & gold coloring.",
                            "website": "http://www.kandamyoujin.or.jp/"
                        },
                        14: {
                            "address": "1-chōme-3-61 Kōraku, Bunkyo City, Tokyo 112-0004, Japan",
                            "category": "Stadium",
                            "day_id": 1852,
                            "favorite": false,
                            "geocode": [35.7056396, 139.7518913],
                            "id": 14,
                            "imgURL": "https://lh3.googleusercontent.com/places/ANXAkqFI1KuO8rc63pPA4aPL3HyHE2EgmpPTF5ilq_2OU96QrMKX3-oBk6Hocy7HYIUclgxWOQ2lFIGuIX2wi7_lT72c18jO8OlVlnI=s4800-w512",
                            "in_itinerary": false,
                            "info": "",
                            "lat": 35.7056396,
                            "long": 139.7518913,
                            "phoneNumber": "+81 3-5800-9999",
                            "placeName": "Tokyo Dome",
                            "place_id": 3449,
                            "rating": "4.2",
                            "summary": "This iconic domed stadium hosts baseball games & other sporting events, plus concerts & exhibitions.",
                            "website": "https://www.tokyo-dome.co.jp/dome/"
                        },
                        15: {
                            "address": "1 Chome-3 Azabudai, Minato City, Tokyo 106-0041, Japan",
                            "category": "Tourist attraction",
                            "day_id": 1852,
                            "favorite": false,
                            "geocode": [35.6615447, 139.7408302],
                            "id": 15,
                            "imgURL": "https://lh3.googleusercontent.com/places/ANXAkqEPxRV5q5Z6JyqkC5FUw5cGJbJDrJwHnFzZdOK8UnKdOUfhHxg2sJWrKkUcaC3K-FfC9zD1zVQLtbIajkARqJQYgvabRM5W-DA=s4800-w512",
                            "in_itinerary": true,
                            "info": "",
                            "lat": 35.6615447,
                            "long": 139.7408302,
                            "phoneNumber": "",
                            "placeName": "Azabudai Hills",
                            "place_id": 3450,
                            "rating": "4.2",
                            "summary": "",
                            "website": "https://www.azabudai-hills.com/index.html"
                        },
                        16: {
                            "address": "Japan, 〒160-0022 Tokyo, Shinjuku City, Shinjuku, 3-chōme−38−１ ルミネエスト新宿 地下 ２階",
                            "category": "Bakery",
                            "day_id": 1854,
                            "favorite": false,
                            "geocode": [35.6912505, 139.7011419],
                            "id": 16,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJ13PJM1CNGGAR0s9NCyVpyHE/photos/AXCi2Q5By9fMKTAmddPaLk4eSM47UxdZTZ25YixY9uVC8snvYaGIkLH0MFh6uVgBfvlyo_N-vIpEhDQjLY7uapZIjTc8-u5Aj1UYKSKdsJfO1FQiIpdXraXFtK-s0EANrTJn7yCkfn_IG_K_f90bheQCvEff2TYvmJ8dRCEg/media?maxWidthPx=2448&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": false,
                            "info": "Mon: 11:00 AM - 8:00 PM, Tue: 11:00 AM - 8:00 PM, Wed: 11:00 AM - 8:00 PM, Thu: 11:00 AM - 8:00 PM, Fri: 11:00 AM - 8:00 PM, Sat: 11:00 AM - 8:00 PM, Sun: 11:00 AM - 8:00 PM",
                            "lat": 35.6912505,
                            "long": 139.7011419,
                            "phoneNumber": "+81 3-5366-1538",
                            "placeName": "HARBS ハーブス ルミネエスト新宿店",
                            "place_id": 3451,
                            "rating": "4.2",
                            "summary": null,
                            "website": "http://www.harbs.co.jp/harbs/concept.html"
                        },
                        17: {
                            "address": "Japan, 〒160-0021 Tokyo, Shinjuku City, Kabukichō, 1-chōme−17−１０ CR.B&Vビル 地下 1 階",
                            "category": "Restaurant",
                            "day_id": 1853,
                            "favorite": false,
                            "geocode": [35.6943949, 139.7015417],
                            "id": 17,
                            "imgURL": "https://places.googleapis.com/v1/places/ChIJp1Kx1dmMGGARvbZ_YYRx0vQ/photos/AXCi2Q5NFPJICrK36V0Q6fY3LNfQ-8Bk6UPgzzpn_hviBtgSxuVeBsG39s8UgXKlia0DzML267HvIK7RRF-Fm7UQz8nNAgM6WlCmVT8S-tZiZuS-IL-ooOgkN8hLw2bkYJJbo-AHllOdLaHdVdvjzNIYDDxJUs1R72vjaq4D/media?maxWidthPx=960&key=AIzaSyDSb_2EDA9dG4bMW6QtRcTrqHy3MkLmxPU",
                            "in_itinerary": true,
                            "info": "Mon: Open 24 hours, Tue: Open 24 hours, Wed: Open 24 hours, Thu: Open 24 hours, Fri: Open 24 hours, Sat: Open 24 hours, Sun: Open 24 hours",
                            "lat": 35.6943949,
                            "long": 139.7015417,
                            "phoneNumber": "+81 50-3733-3393",
                            "placeName": "Ichiran Shinjuku Kabuki-cho",
                            "place_id": 3467,
                            "rating": "4.3",
                            "summary": "Informal ramen restaurant with a specialty for tonkotsu ramen in a pork bone broth.",
                            "website": "https://ichiran.com/shop/tokyo/kabukicho/"
                        }
                    },
                    "places_last": 17,
                    "saved_places": {
                        "addresses": [
                            "1-chōme-3-61 Kōraku, Bunkyo City, Tokyo 112-0004, Japan",
                            "Japan, 〒160-0022 Tokyo, Shinjuku City, Shinjuku, 3-chōme−38−１ ルミネエスト新宿 地下 ２階",
                            "4-chōme-2-8 Shibakōen, Minato City, Tokyo 105-0011, Japan",
                            "1 Chome-2 Nishishinjuku, Shinjuku City, Tokyo 160-0023, Japan",
                            "Japan, 〒150-6145 Tokyo, Shibuya City, Shibuya, 2-chōme−24−１２ 14階・45階・46階・屋上"
                        ],
                        "placesIds": [14, 16, 1, 8, 4]
                    },
                    "trip_id": "413"
                },
                itineraryFirstLoad: false,
            },
        },
    ];

    const slideCarouselRight = () => {
        let carousel = document.getElementById('cityCarouselInner')
        let translatedWidth = window.innerWidth * 0.9 + translationIndex * 350
        let carouselWidth = cities.length * 350 - 50
        let fullTranslateWidth = carouselWidth - window.innerWidth * 0.9
        let test = cities.length * 350 - 50 - 350
        if (translatedWidth > cities.length * 350 - 50 - 350) {
            carousel.style.transform = `translateX(-${fullTranslateWidth}px)`
            setFullTranslated(true)
        } else {
            setTranslationIndex(translationIndex + 1)
        }
    }
    const slideCarouselLeft = () => {
        if (translationIndex > 0) {
            setTranslationIndex(translationIndex - 1)
            setFullTranslated(false);
        }
    }


    const openNameTripModal = () => {
        setOpenTripModal(true)
    }
    const closeNameTripModal = () => {
        setOpenTripModal(false)
    }

    // calendar
    const [range, setRange] = useState([
        {
            startDate: null, // new Date(),
            endDate: null, // addDays(new Date(), 7),
            key: 'selection'
        }
    ])
    const rangePlaceholder = [
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]
    const calendarSectionRef = useRef(null);
    const toggleCalendarOpen = () => {
        if (calendarOpen) {
            setCalendarOpen(false);
        } else {
            setCalendarOpen(true);
        }
    }
    const hideOnClickOutsideCalendar = (e) => {
        if (calendarSectionRef.current && !calendarSectionRef.current.contains(e.target)) {
            setCalendarOpen(false);
        }
    }
    useEffect(() => {
        document.addEventListener('click', hideOnClickOutsideCalendar);
        return () => document.removeEventListener('click', hideOnClickOutsideCalendar);
    }, [])
    useEffect(() => {
        // setCalendar(format(new Date(), 'MM/dd/yyyy'))
        document.addEventListener('keydown', hideOnEscape, true)
        return () => document.removeEventListener('keydown', hideOnEscape, true)
    }, [])
    useEffect(() => {
        document.addEventListener('click', hideOnClickOutside, true)
        return () => document.removeEventListener('click', hideOnClickOutside, true)
    }, [])
    useEffect(() => {
        document.addEventListener('click', hidePopUpOnClickOutside, true)
        return () => document.removeEventListener('click', hidePopUpOnClickOutside, true)
    }, [])
    const hideOnEscape = (e) => {
        if (e.key === "Escape") {
            setCalendarOpen(false)
            closeUserTripPopup()
        }
    }
    const hideOnClickOutside = (e) => {
        if (refOne.current && !refOne.current.contains(e.target)) {
            setCalendarOpen(false)
            // closeUserTripPopup()
        }
    }
    const refOne = useRef(null);
    const hidePopUpOnClickOutside = (e) => {
        if (refPopUp.current && !refPopUp.current.contains(e.target) && e.target.id.split("-")[0] !== ("userTripPopUpBtn")) {
            closeUserTripPopup();
        }
    }
    const refPopUp = useRef(null);


    const openSignUp = () => {
        setSignUpIsOpen(true);
    }



    const getCity = async () => {
        let cityInput = document.getElementById('cityInput');
        if (!user) {
            openSignUp()
        } else if (user.emailVerified === false) {
            alert("Please verify your email first. Check your email for a verification link.");
        } else {
            if (!cityInput.value) {
                // if there is no city entered --> please enter city name
                cityInput.classList.add('entry-error')
                alert("Please enter a city destination")
            } else if (!range[0].startDate || !range[0].endDate) {
                alert("Please enter a start and end date for your trip")
            } else {
                // if there is a city entered
                startLoading();
                // if the user input includes a "," -- it contains city and state/country
                let cityName = cityInput.value;
                if (cityName.includes(",")) {
                    // let cityNoSpaces = cityName.replace(/ /g, '')
                    const cityArr = cityName.split(', ')
                    let url = "";
                    if (isStateAbbv(cityArr[1])) {
                        url = `https://api.api-ninjas.com/v1/geocoding?city=${cityArr[0]}&state=${convertAbbvToState(cityArr[1])}&country=US`
                    } else {
                        url = `https://api.api-ninjas.com/v1/geocoding?city=${cityArr[0]}&country=${cityArr[1]}`
                    };
                    const response = await axios.get(url, {
                        headers: { 'X-Api-Key': apiKey }
                    }).then((response => {
                        openNewTrip(response)
                    }))
                        .catch((error) => {
                            console.log(error)
                            stopLoading()
                        })
                    // go to TripName Modal automatically
                } else {
                    // if user enters just a city name with no ","
                    const response = await axios.get(`https://api.api-ninjas.com/v1/geocoding?city=${cityName}`, {
                        headers: { 'X-Api-Key': apiKey }
                    }).then((response => openNewTrip(response)))
                        .catch((error) => {
                            console.log(error)
                            stopLoading()
                            alert("City was not found")
                        })
                }
            }
        }
    };

    const getCountryName = (country_2letter) => {
        const country_abbr = ['AF', 'AX', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AU', 'AT', 'AZ', 'BH', 'BS', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT', 'BO', 'BQ', 'BA', 'BW', 'BV', 'BR', 'IO', 'BN', 'BG', 'BF', 'BI', 'KH', 'CM', 'CA', 'CV', 'KY', 'CF', 'TD', 'CL', 'CN', 'CX', 'CC', 'CO', 'KM', 'CG', 'CD', 'CK', 'CR', 'CI', 'HR', 'CU', 'CW', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'ET', 'FK', 'FO', 'FJ', 'FI', 'FR', 'GF', 'PF', 'TF', 'GA', 'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN', 'GW', 'GY', 'HT', 'HM', 'VA', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IM', 'IL', 'IT', 'JM', 'JP', 'JE', 'JO', 'KZ', 'KE', 'KI', 'KP', 'KR', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MO', 'MK', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'NC', 'NZ', 'NI', 'NE', 'NG', 'NU', 'NF', 'MP', 'NO', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN', 'PL', 'PT', 'PR', 'QA', 'RE', 'RO', 'RU', 'RW', 'BL', 'SH', 'KN', 'LC', 'MF', 'PM', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SX', 'SK', 'SI', 'SB', 'SO', 'ZA', 'GS', 'SS', 'ES', 'LK', 'SD', 'SR', 'SJ', 'SZ', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TK', 'TO', 'TT', 'TN', 'TR', 'TM', 'TC', 'TV', 'UG', 'UA', 'AE', 'GB', 'US', 'UM', 'UY', 'UZ', 'VU', 'VE', 'VN', 'VG', 'VI', 'WF', 'EH', 'YE', 'ZM', 'ZW']
        const country_name = ['Afghanistan', 'Åland Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antarctica', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahrain', 'Bahamas', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia, Plurinational State of', 'Bonaire, Sint Eustatius and Saba', 'Bosnia and Herzegovina', 'Botswana', 'Bouvet Island', 'Brazil', 'British Indian Ocean Territory', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo', 'Democratic Republic of Congo', 'Cook Islands', 'Costa Rica', "Côte d'Ivoire", 'Croatia', 'Cuba', 'Curaçao', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands (Malvinas)', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia', 'French Southern Territories', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Heard Island and McDonald Islands', 'Holy See (Vatican City State)', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'North Korea', 'South Korea', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macao', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine, State of', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Réunion', 'Romania', 'Russian Federation', 'Rwanda', 'Saint Barthélemy', 'Saint Helena, Ascension and Tristan da Cunha', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Martin', 'Saint Pierre and Miquelon', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Sint Maarten ', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Georgia and the South Sandwich Islands', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Svalbard and Jan Mayen', 'Swaziland', 'Sweden', 'Switzerland', 'Syrian Arab Republic', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'United States Minor Outlying Islands', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela, Bolivarian Republic of', 'Viet Nam', '(British) Virgin Islands ', '(U.S.) Virgin Islands', 'Wallis and Futuna', 'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe']
        return country_abbr.includes(country_2letter) ? country_name[country_abbr.indexOf(country_2letter)] : null
    }

    const openNewTrip = (response) => {
        // if no response catch error***
        let data = response.data
        let geocode = [data[0].latitude, data[0].longitude]
        let countryName = getCountryName(data[0].country)
        let tripInfo = {
            cityName: data[0].name,
            state: data[0].state,
            country: countryName,
            country_2letter: data[0].country,
            destinationLat: geocode[0],
            destinationLong: geocode[1],
            geocode: geocode,
            startDate: format(range[0].startDate, "MM/dd/yyyy"),
            endDate: format(range[0].endDate, "MM/dd/yyyy"),
        };
        if (typeof tripInfo.state === 'undefined') {
            tripInfo.state = ""
        };
        let dataNew = []
        let states = []
        for (let i = 0; i < data.length; i++) {
            if (!states.includes(data[i].state)) {
                dataNew.push(data[i])
            }
            states.push(data[i].state)
        };
        setCityOptions(dataNew)

        setTripData(tripInfo)
        stopLoading()
        openNameTripModal()

        // take first response.data index and use name/state/country/lat/lon 
        // coerse to tripData and open Name Trip modal, using tripData as props
    }

    const changeCity = () => {
        setOpenTripModal(false)
        setSpecifyCityOpen(true)
    }


    const updateCityInput = (city) => {
        const cityInput = document.getElementById('cityInput');
        if (city.state) {
            cityInput.value = city.city_name + ", " + convertStateToAbbv(city.state);
        } else {
            cityInput.value = city.city_name;
        }
    }

    const closeSpecifyCity = () => {
        setSpecifyCityOpen(false);
    }

    useEffect(() => {
        if (cityText) {
            if (cityText.length > 0) {
                let cityInput = document.getElementById('cityInput')
                cityInput.classList.remove('entry-error')
            }
        }
    }, [cityText])

    const startLoading = () => {
        setLoading(true);
    }
    const stopLoading = () => {
        setLoading(false);
    }

    const [modalWidth, setModalWidth] = useState(450);



    useEffect(() => {
        window.addEventListener("resize", resizeModal, false)
    }, [])

    const resizeModal = () => {
        if (window.innerWidth < 425) {
            setModalWidth(240)
        } else if (window.innerWidth > 425 && window.innerWidth < 600) {
            setModalWidth(300)
        } else if (window.innerWidth >= 600) {
            setModalWidth(450)
        }
        if (window.innerWidth < 600) {

        }
    }



    const toggleUserTripPopup = (index) => {
        let popUp = document.getElementById(`userTrip-popUp-${index}`)
        popUp.classList.toggle('d-none')
    }

    const closeUserTripPopup = () => {
        let popUps = document.getElementsByClassName('popUp')
        for (let i = 0; i < popUps.length; i++) {
            popUps[i].classList.add('d-none')
        }
    }

    // [user trip slider code]
    const sliderWindowRef = useRef(null);
    const sliderInnerRef = useRef(null);
    const [sliderControls, setSliderControls] = useState({
        offset: 0,
        maxOffset: 0,
        windowWidth: null,
        innerWidth: null,
        scrollSize: 240,
        buttonsHidden: false,
    });
    const sliderFunctions = {
        initialize: function () {
            if (!sliderWindowRef.current || !sliderInnerRef.current) return;
            let extraScrollWidth = 24;
            let maxOffset = sliderInnerRef.current.scrollWidth > sliderWindowRef.current.clientWidth ? (sliderInnerRef.current.scrollWidth + extraScrollWidth) - sliderWindowRef.current.clientWidth : 0;
            setSliderControls({
                ...sliderControls,
                maxOffset: maxOffset,
                windowWidth: sliderWindowRef.current.clientWidth,
                innerWidth: sliderInnerRef.current.scrollWidth + extraScrollWidth,
                buttonsHidden: maxOffset > 0 ? false : true,
            });
        },
        pushRight: function () {
            let maxOffset = sliderControls.maxOffset;
            let offset = sliderControls.offset;
            let scrollSize = sliderControls.scrollSize;
            if (maxOffset - scrollSize > offset) {
                setSliderControls({ ...sliderControls, offset: offset + scrollSize })
            } else {
                setSliderControls({ ...sliderControls, offset: maxOffset });
            };
        },
        pushLeft: function () {
            let minOffset = 0;
            let offset = sliderControls.offset;
            let scrollSize = sliderControls.scrollSize;
            if (minOffset + scrollSize < offset) {
                setSliderControls({ ...sliderControls, offset: offset - scrollSize })
            } else {
                setSliderControls({ ...sliderControls, offset: minOffset });
            };
        },
    };
    useEffect(() => {
        // re-initialize slider controls on page resize
        if (sliderWindowRef.current && sliderInnerRef.current) {
            sliderFunctions.initialize();
        };
        window.addEventListener('resize', sliderFunctions.initialize)
        return () => window.removeEventListener('resize', sliderFunctions.initialize)
    }, [sliderWindowRef.current ?? null, sliderInnerRef.current ?? null]);

    const navigate = useNavigate()

    const tripFunctions = {
        clearTrips: function () {
            clearCurrentTrip()
        },
        deleteTrip: function (trip) {

        },
        editDetails: function (trip) {

        },
        viewAnalytics: function (trip) {

        },
        viewPlaces: function (trip) {

        },
        viewTrip: function (trip) {

        },
    };

    const viewTrip = async (trip, navigation) => {
        // check if email verified
        if (auth.currentUser.emailVerified === false) {
            alert("Please verify your email first");
            return;
        };
        clearCurrentTrip()
        setIsLoading(true)
        if (navigation === "itinerary") {
            let url = `https://routewise-backend.onrender.com/places/trip/${trip.trip_id}`
            const response = await axios.get(url)
            console.log({ ...trip, itinerary: response.data });
            // const response = await axios.get("https://routewise-backend.onrender.com/places/trip/254")
            return response.status === 200 ? loadItinerary({ ...trip, itinerary: response.data }) : alert('Something went wrong. Please try again.')
        } else if (navigation === "places") {
            let url = `https://routewise-backend.onrender.com/places/get-places/${trip.trip_id}`
            const response = await axios.get(url)
            // const response = await axios.get("https://routewise-backend.onrender.com/places/trip/254")
            return response.status === 200 ? loadPlaces(response.data, trip) : alert('Something went wrong. Please try again.')
        };
    };
    const loadPlaces = (place_list, trip) => {
        // console.log(place_list)
        let placesList = []
        for (let i = 0; i < place_list.length; i++) {
            let place = {
                category: place_list[i].category,
                favorite: place_list[i].favorite,
                placeId: place_list[i].geoapify_placeId,
                id: place_list[i].local_id,
                place_id: place_list[i].place_id, // db
                // tripId : place_list[i].trip_id,
                long: place_list[i].long,
                lat: place_list[i].lat,
                geocode: [place_list[i].lat, place_list[i].long],
                imgURL: place_list[i].place_img,
                info: place_list[i].info,
                placeName: place_list[i].place_name,
                address: place_list[i].place_address,
            }
            placesList.push(place)
        }
        // console.log(placesList)
        let currentTripCopy = {
            tripID: trip.trip_id,
            tripName: trip.trip_name,
            city: trip.dest_city,
            country: trip.dest_country,
            country_2letter: trip.dest_country_2letter,
            startDate: trip.start_date,
            endDate: trip.end_date,
            tripDuration: trip.duration,
            geocode: [trip.dest_lat, trip.dest_long],
            imgUrl: trip.dest_img,
            places: placesList,
            itinerary: null,
            itineraryFirstLoad: false
        };
        // console.log(response.data)
        // console.log(currentTripCopy)
        setIsLoading(false);
        setCurrentTrip(currentTripCopy);
        navigate('/add-places');
    };
    const loadItinerary = (trip, firstLoad) => {
        let currentTripCopy = {};
        if (trip.trip_id) {
            // trip.trip_id means the trip object came from the database
            currentTripCopy = {
                tripID: trip.trip_id,
                tripName: trip.trip_name,
                city: trip.dest_city,
                country: trip.dest_country,
                country_2letter: trip.dest_country_2letter,
                startDate: trip.start_date,
                endDate: trip.end_date,
                tripDuration: trip.duration,
                geocode: [trip.dest_lat, trip.dest_long],
                imgUrl: trip.dest_img,
                places: Object.values(trip.itinerary.places),
                itinerary: trip.itinerary,
                itineraryFirstLoad: firstLoad ? true : false
            };
        } else {
            currentTripCopy = trip;
        };
        setIsLoading(false);
        setCurrentTrip(currentTripCopy);
        navigate('/itinerary');
    }
    const [isLoading, setIsLoading] = useState(false);
    const stopLoadingScreen = () => {
        setIsLoading(false);
    };

    const deleteTrip = (trip) => {
        let url = `https://routewise-backend.onrender.com/places/delete-trip/${trip.trip_id}`
        const response = axios.delete(url)
            .then((response) => {
                // console.log(response.data)
                loadUserTripsData()
                closeUserTripPopup()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    // test updating trip
    const testUpdateTrip = async (trip_id) => {
        let url = `http://localhost:5000/places/update_trip/${trip_id}`
        let data = {
            tripName: "New Trip Name",
            startDate: null,
            endDate: null
        }
        const response = await axios.patch(url, data, {
            headers: { "Content-Type": "application/json" }
        }).then((response) => {
            console.log(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }


    // edit trip modal code
    const [editTripModalOpen, setEditTripModalOpen] = useState(false)
    const openEditTripModal = (trip) => {
        setTripToEdit(trip)
        setEditTripModalOpen(true);
    }
    const closeEditTripModal = () => {
        setTripToEdit(null)
        setEditTripModalOpen(false);
    }
    const [tripToEdit, setTripToEdit] = useState(null);





    const [awaitingItinerary, setAwaitingItinerary] = useState(false);
    const testItinerary = () => {
        // test itinerary object
        let testObject = {
            tripID: "",
            places_last: 8,
            places: {
                1: {
                    id: 1,
                    placeName: "Traflagar Square",
                    info: "Open 24 hours",
                    address: "Trafalgar Sq, London WC2N 5DS, UK",
                    imgURL: "https://i.imgur.com/xwY6Bdd.jpg",
                    lat: 51.50806,
                    long: -0.12806,
                    geocode: [51.50806, -0.12806],
                    favorite: true,
                    place_id: null
                },
                2: {
                    id: 2,
                    placeName: "Tate Modern",
                    info: "Mon-Sun 10 AM-6 PM",
                    address: "Bankside, London SE1 9TG, UK",
                    imgURL: "https://i.imgur.com/FYc6OB3.jpg",
                    lat: 51.507748,
                    long: -0.099469,
                    geocode: [51.507748, -0.099469],
                    favorite: false,
                    place_id: null
                },
                3: {
                    id: 3,
                    placeName: "Hyde Park",
                    info: "Mon-Sun 5 AM-12 AM",
                    address: "Hyde Park, London W2 2UH, UK",
                    imgURL: "https://i.imgur.com/tZBnXz4.jpg",
                    lat: 51.502777,
                    long: -0.151250,
                    geocode: [51.502777, -0.151250],
                    favorite: false,
                    place_id: null
                },
                4: {
                    id: 4,
                    placeName: "Buckingham Palace",
                    info: "Tours Start at 9am",
                    address: "Buckingham Palace, London SW1A 1AA, UK",
                    imgURL: "https://i.imgur.com/lw40mp9.jpg",
                    lat: 51.501476,
                    long: -0.140634,
                    geocode: [51.501476, -0.140634],
                    favorite: true,
                    place_id: null
                },
                5: {
                    id: 5,
                    placeName: "Borough Market",
                    info: "Closed Mondays, Tues-Sun 10 AM-5 PM",
                    address: "Borough Market, London SE1 9AL, UK",
                    imgURL: "https://i.imgur.com/9KiBKqI.jpg",
                    lat: 51.50544,
                    long: -0.091249,
                    geocode: [51.50544, -0.091249],
                    favorite: true,
                    place_id: null
                },
                6: {
                    id: 6,
                    placeName: "Traflagar Square",
                    info: "Open 24 hours",
                    address: "Trafalgar Sq, London WC2N 5DS, UK",
                    imgURL: "https://i.imgur.com/xwY6Bdd.jpg",
                    lat: 51.50806,
                    long: -0.12806,
                    geocode: [51.50806, -0.12806],
                    favorite: false,
                    place_id: null
                },
                7: {
                    id: 7,
                    placeName: "Borough Market",
                    info: "Closed Mondays, Tues-Sun 10 AM-5 PM",
                    address: "Borough Market, London SE1 9AL, UK",
                    imgURL: "https://i.imgur.com/9KiBKqI.jpg",
                    lat: 51.50544,
                    long: -0.091249,
                    geocode: [51.50544, -0.091249],
                    favorite: false,
                    place_id: null
                },
                8: {
                    id: 8,
                    placeName: "Traflagar Square",
                    info: "Open 24 hours",
                    address: "Trafalgar Sq, London WC2N 5DS, UK",
                    imgURL: "https://i.imgur.com/xwY6Bdd.jpg",
                    lat: 51.50806,
                    long: -0.12806,
                    geocode: [51.50806, -0.12806],
                    favorite: false,
                    place_id: null
                }
            },
            days: {
                "day-1": {
                    id: "day-1",
                    date_converted: "Wednesday, November 8",
                    day_short: "Wed",
                    date_short: "11/8",
                    dayName: "",
                    placeIds: [2]
                },
                "day-2": {
                    id: "day-2",
                    date_converted: "Thursday, November 9",
                    day_short: "Thurs",
                    date_short: "11/9",
                    dayName: "",
                    placeIds: [3, 4]
                },
                "day-3": {
                    id: "day-3",
                    date_converted: "Friday, November 10",
                    dayName: "",
                    day_short: "Fri",
                    date_short: "11/10",
                    placeIds: [5, 6]
                },
                "day-4": {
                    id: "day-4",
                    date_converted: "Saturday, November 11",
                    dayName: "",
                    day_short: "Sat",
                    date_short: "11/11",
                    placeIds: [7, 8, 1]
                }

            },
            "day_order": ["day-1", "day-2", "day-3", "day-4"]
        }
        // set current trip itinerary to test object
        let currentTripCopy = { ...currentTrip }
        currentTripCopy.itinerary = testObject
        setAwaitingItinerary(true);
        setCurrentTrip(currentTripCopy)
        // navigate to itinerary
    }
    useEffect(() => {
        if (awaitingItinerary && currentTrip.itinerary) {
            setAwaitingItinerary(false)
            navigate('/itinerary')
        }
    }, [currentTrip]);

    // world cities local api
    const [citySearchQuery, setCitySearchQuery] = useState("");
    const [cityAutocomplete, setCityAutocomplete] = useState([]);
    const getWorldCities = async () => {
        if (citySearchQuery.length > 1) {
            let url = 'https://davidekunno93.github.io/worldcities_api/worldcities.json';
            const response = await fetch(url)
                .then(response => response.json())
                .then(data => {
                    let results = [];
                    let limit = 5;
                    for (let i = 0; i < data.length; i++) {
                        if (results.length === limit) {
                            break;
                        } else if (data[i].city_name.toLowerCase().includes(citySearchQuery.toLowerCase())) {
                            results.push(data[i]);
                        }
                    };
                    setCityAutocomplete(results);
                })
        } else {
            setCityAutocomplete([]);
        };
    };
    useEffect(() => {
        getWorldCities();
    }, [citySearchQuery]);


    const featuredTripSquares = featuredTrips.map((trip, index) => {
        return (
            <FeaturedTripSquare
                trip={trip}
                key={index}
                index={index}
                loadItinerary={loadItinerary}
            />
        )
    });
    const popularDestRef = useRef(null);

    return (
        <>
            <LoadingFullscreen />
            <LoadingModal open={loading} width={modalWidth} height={500} onClose={() => stopLoading()} />
            <LoadingScreen open={isLoading} loadObject={"itinerary"} loadingMessage={"Please wait while your itinerary is loading..."} waitTime={10000} currentTrip={currentTrip} onClose={stopLoadingScreen} />
            <EditTripModal open={editTripModalOpen} trip={tripToEdit} loadItinerary={loadItinerary} loadUserTripsData={loadUserTripsData} onClose={closeEditTripModal} />
            <SpecifyCity open={specifyCityOpen} cities={cityOptions} tripData={tripData} setTripData={setTripData} getCountryName={getCountryName} openNameTripModal={openNameTripModal} onClose={() => closeSpecifyCity()} />
            <NameTripModal open={openTripModal} tripData={tripData} changeCity={() => changeCity()} currentTrip={currentTrip} setCurrentTrip={setCurrentTrip} clearCurrentTrip={clearCurrentTrip} onClose={() => closeNameTripModal()} />
            <div className="page-container90 mt-4">
                <h1 className="page-subsubheading-bold inline-block mb-5">Hi {auth.currentUser && auth.currentUser.displayName} </h1><img src="https://i.imgur.com/4i6xYjB.png" alt="" className="xsmall-pic ml-2" />
                {/* <button onClick={() => testItinerary()} className="btn-primaryflex">Test Itinerary</button> */}
                {/* start trip selection box */}
                <div className={`selection-box ${mobileMode && "mobile"} flx-c`}>
                    <div className="box-title flx-2 flx-c just-ce"><p className='my-3'>Start planning your next adventure</p></div>
                    <div className={`box-items flx-3 ${mobileMode ? "flx-c" : "flx-r"} gap-4 mb-4 flx-wrap`}>
                        <div className="item-location flx-3 flx-c just-en">
                            <div className="">
                                <div className="box-heading dark-text page-subsubheading">Where are you headed?</div>
                                <div className="inputBox">
                                    <input ref={cityInputRef} onChange={(e) => setCitySearchQuery(e.target.value)} id='cityInput' type='text' placeholder='City name e.g. Hawaii, Cancun, Rome' className={`calendarInput ${cityAutocomplete.length > 0 && citySearchQuery.length > 1 && "drop"} italic-placeholder`} autoComplete='off' required />
                                    <div className={`auto-dropdown ${cityAutocomplete.length > 0 && citySearchQuery.length > 1 ? "show" : "hide"}`}>
                                        {cityAutocomplete.length > 0 && citySearchQuery.length > 1 && cityAutocomplete.map((city, index) => {
                                            return <div key={index} onClick={() => { updateCityInput(city); setCityAutocomplete([]) }} className="option">
                                                <span className={gIcon + " large"}>location_on</span>
                                                <div className="text">
                                                    <p className="m-0 city">
                                                        {city.city_name}
                                                        {city.state ? `, ${convertStateToAbbv(city.state)}` : ""}
                                                        {city.isCapital && <><span> </span><span className={gIcon + " small"}>star</span></>},&nbsp;
                                                    </p>
                                                    <p className="m-0 country">{city.country_name}</p>
                                                </div>
                                            </div>
                                        })}

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`item-dates ${mobileMode && "mobile"} flx- flx-c just-en`}>
                            <div className="box-heading dark-text page-subsubheading">When will you be there?</div>
                            <div ref={refOne} className="calendarWrap">
                                {/* <span onClick={() => setCalendarOpen(true)} className="material-symbols-outlined position-absolute inputIcon-right xx-large o-50 pointer">
                                    date_range
                                </span> */}
                                {/* <input
                                    onClick={() => setCalendarOpen(calendarOpen => !calendarOpen)}
                                    // value={`${range[0].startDate && range[0].endDate ? format(range[0].startDate, "MM/dd/yyyy")+"      |      "+format(range[0].endDate, "MM/dd/yyyy") : "Start Date   End Date" } `} 
                                    value={` ${format(range[0].startDate, "MM/dd/yyyy")}            -to-           ${format(range[0].endDate, "MM/dd/yyyy")} `}
                                    className="calendarInput pointer"
                                    readOnly
                                /> */}
                                <div ref={calendarSectionRef} className="calendarSection">

                                    <div onClick={() => toggleCalendarOpen()} className="calendarInput pointer">
                                        <div className="startDateInput flx-1">
                                            <span className={`material-symbols-outlined ${range[0].startDate ? "purple-text" : "lightgray-text"}`}>date_range</span>
                                            <p className={`m-0 ${range[0].startDate ? null : "lightgray-text"}`}>{range[0].startDate ? timeFunctions.datify(format(range[0].startDate, "MM/dd/yyyy")) : "Start Date"}</p>
                                        </div>
                                        <hr className='h-40' />
                                        <div className="endDateInput flx-1">
                                            <span className={`material-symbols-outlined ${range[0].endDate ? "purple-text" : "lightgray-text"}`}>date_range</span>
                                            <p className={`m-0 ${range[0].endDate ? null : "lightgray-text"}`}>{range[0].startDate ? timeFunctions.datify(format(range[0].endDate, "MM/dd/yyyy")) : "End Date"}</p>
                                        </div>
                                    </div>
                                    <div>
                                        {calendarOpen &&
                                            <DateRange
                                                onChange={item => setRange([item.selection])}
                                                editableDateInputs={true}
                                                moveRangeOnFirstSelection={false}
                                                ranges={range[0].startDate ? range : rangePlaceholder}
                                                months={2}
                                                direction='vertical'
                                                className='calendarElement'
                                            />
                                        }
                                    </div>
                                </div>
                            </div>
                            {/* <input type='text' placeholder='Start Date | End Date' className='input-normal2' /> */}
                        </div>
                        <div className="item-addtrip flxstyle-respond">
                            <button onClick={() => getCity()} className="btn-primaryflex2 mt-3">Add Trip</button>
                        </div>
                    </div>
                </div>
                {/* end start trip selection box */}

                {/* my trips */}
                <div className="flx-r align-r just-sb mb-3">
                    <p className="m-0 page-subsubheading-bold mt-5">My Trips</p>
                    {userTrips.isLoaded && userTrips.trips.length > 4 ?
                        <Link to='/mytrips'>
                            <div className="flx-r align-c">
                                <p className="m-0 purple-text page-text">See all trips</p>
                                <span className="material-symbols-outlined ml-1 purple-text large">
                                    arrow_forward
                                </span>
                            </div>
                        </Link>
                        : null}
                </div>
                {isLoadingTrips && auth.currentUser &&
                    // <p className='m-0'>Loading...</p>
                    <div className="loadingDiv">
                        <Loading noMascot={true} noText={true} />
                    </div>
                }
                {userTrips.isLoaded ?
                    <>
                        {!userTrips.trips.length > 0 &&
                            <>
                                <p className="m-0 gray-text">No trips created. <span onClick={() => cityInputRef.current && cityInputRef.current.focus()} className="purple-text bold500 pointer">Enter a city</span>  to start!</p>
                                {/* <p className="m-0 gray-text small">Come back after you've created a trip to view created itineraries</p> */}
                            </>
                        }
                        <div ref={sliderWindowRef} className="slider-window">
                            <div ref={sliderInnerRef} className="slider-inner" style={{ transform: `translateX(-${sliderControls.offset}px) ` }}>

                                {/* <div className={`userTrips ${mobileMode && "just-se"} flx-r flx-wrap gap-8`}> */}
                                {userTrips.trips.map((trip, index) => {

                                    if (index < 5) {
                                        return <div className="slider-item">
                                            <div key={index} className="userTrip-box">
                                                <div ref={refPopUp}>
                                                    <div id={`userTrip-popUp-${index}`} className="popUp d-none">
                                                        <div onClick={(() => { openEditTripModal(trip); closeUserTripPopup() })} className="option">
                                                            <p className="m-0">Edit trip details</p>
                                                            <span className="material-symbols-outlined large mx-1">
                                                                edit
                                                            </span>
                                                        </div>
                                                        <div onClick={() => viewTrip(trip, trip.is_itinerary ? 'itinerary' : 'places')} className="option">
                                                            <p className="m-0">Edit Itinerary</p>
                                                            <span className="material-symbols-outlined large mx-1">
                                                                map
                                                            </span>
                                                        </div>

                                                        <div onClick={() => deleteTrip(trip)} className="option">
                                                            <p className="m-0">Delete trip</p>
                                                            <span className="material-symbols-outlined large mx-1">
                                                                delete
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span id={`userTripPopUpBtn-${index}`} onClick={() => toggleUserTripPopup(index)} className="material-symbols-outlined vertIcon">
                                                        more_vert
                                                    </span>
                                                </div>
                                                <div className="destImgDiv">
                                                    <img onClick={() => viewTrip(trip, trip.is_itinerary ? 'itinerary' : 'places')} src={trip.dest_img} alt="" className="destImg pointer" />
                                                </div>
                                                <div className="box-text-container">
                                                    <p className="m-0 box-title truncated">{trip.trip_name}</p>
                                                    <div className="flx-r">
                                                        <p className="m-0 gray-text">{timeFunctions.datishortRange(trip.start_date, trip.end_date)}</p>
                                                        <p className="m-0 gray-text">&nbsp; &#9679; &nbsp;</p>
                                                        <p className="m-0 gray-text">{trip.duration} {trip.duration > 1 ? "days" : "day"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                })}
                                {/* </div> */}

                            </div>
                        </div>

                    </>
                    : null}
                {!sliderControls.buttonsHidden &&
                    <div className="slider-buttons">
                        <button onClick={() => sliderFunctions.pushLeft()} className="slider-button left" data-disabled={sliderControls.offset === 0}>
                            <span className={gIcon}>arrow_back</span>
                        </button>
                        <button onClick={() => sliderFunctions.pushRight()} className="slider-button right" data-disabled={sliderControls.offset === sliderControls.maxOffset}>
                            <span className={gIcon}>arrow_forward</span>
                        </button>
                    </div>
                }
                {/* end my trips */}

                {/* user preferences selection */}
                <div className="myTravelPreferences-section mt-5">
                    <div className="flx-r align-c gap-8 mb-4">
                        <p className="page-subsubheading-bold">My Travel Preferences</p>
                        <Link to='/survey-update'><p className="m-0 purple-text mt-h">Edit</p></Link>
                    </div>

                    <div className={`preference-cards flx-r flx-wrap gap-6 ${mobileMode && "just-ce"}`}> 
                        {/* {userPreferences && Object.values(userPreferences).includes(true) ? Object.entries(userPreferences).map((category, index) => {
                            let categoryName = category[0]
                            let selected = category[1] // this is the boolean value of the interest
                            return selected && <div key={index} className="card2-frozen" style={{ maxWidth: 167 }}>
                                <div className="green-checkbox">
                                    <span className="material-symbols-outlined white-text m-auto">
                                        check
                                    </span>
                                </div>
                                <div className="card2-imgDiv">
                                    <img src={cards2_dict[categoryName].imgUrl} alt="" className="card2-img" />
                                </div>
                                <div className="card2-text flx-1">
                                    <div className="card2-title">{cards2_dict[categoryName].title}</div>
                                </div>
                            </div>
                        })
                            :
                            <p className="m-0">Add <span className="purple-text bold500">Travel Preferences</span> to get personalized suggestions for your trips!</p>
                        } */}
                        {userPreferences && Object.values(userPreferences).includes(true) ? Object.entries(userPreferences).map((category, index) => {
                            let categoryName = category[0]
                            let selected = category[1] // this is the boolean value of the interest
                            return selected && (
                                <PreferenceCard
                                    key={index}
                                    preference={categoryName}
                                    checkedOnly
                                    frozen
                                />
                            )
                        })
                            :
                            <p className="m-0">Add <span className="purple-text bold500">Travel Preferences</span> to get personalized suggestions for your trips!</p>
                        }
                    </div>
                </div>
                {/* end user preferences selection */}

                {/* world map code */}
                {/* <div className="map my-5 flx">
                    <OpenMap mapCenter={mapCenter} zoom={2} />

                </div> */}

                <div ref={popularDestRef} className="popular-destinations my-6">
                    <div className="page-subsubheading-bold my-3">Featured Trips</div>
                    <CarouselWiper
                        items={featuredTripSquares}
                        width={mobileModeNarrow ? "70vw" : 300}
                        height={mobileModeNarrow ? "72vw" : 312}
                        containerRef={popularDestRef}
                        position={mobileMode ? "center" : "left"}
                    />


                    {/* <div className="btns mb-10">
                        <button onClick={() => slideCarouselLeft()} className={translationIndex === 0 ? 'btn-primaryflex-disabled' : 'btn-carousel-special hover-left'}>
                            <span className="material-symbols-outlined mt-1 white-text">
                                arrow_back
                            </span>
                        </button>
                        <button onClick={() => slideCarouselRight()} className={fullTranslated === true ? "btn-primaryflex-disabled right" : "btn-carousel-special right hover-right"}>
                            <span className="material-symbols-outlined mt-1 white-text">
                                arrow_forward
                            </span>
                        </button>
                    </div> */}

                </div>
            </div>
        </>
    )
}
