import React, { useRef, useState, useEffect, useContext } from 'react'
import usePlacesAutocomplete from 'use-places-autocomplete';
import { DataContext } from '../Context/DataProvider';
import { useLoadScript } from '@react-google-maps/api';
const GoogleSearch = ({ addPlaceFunction, tripMapBounds, mapViewBounds, isLoaded, searchMapViewBounds,  searchLimit, styleProfile }) => {
    if (!isLoaded) return null;
    const { textFunctions, modifyInfo, getBestCategory } = useContext(DataContext);

    // [search bar code]
    const searchRef = useRef(null);
    // autocomplete api
    const { ready, value, setValue, suggestions: { status, data }, clearSuggestions } = usePlacesAutocomplete({
        requestOptions: {
            locationRestriction: searchMapViewBounds && mapViewBounds ? mapViewBounds : tripMapBounds,
            // region: "uk"
        },
        debounce: 300
    });
    // update search text in input and remove session storage
    useEffect(() => {
        // console.log({ value, status, data });
        if (searchRef.current) {
            searchRef.current.value = value;
        }

        // console.log(data)

        // important! - clears cache so that the defined location bias in autocomplete hook is able to takeover
        sessionStorage.removeItem('upa');


    }, [value])

    const handleSelect = async (autoCompletePlace) => {
        // setValue(address, false);
        setValue("");
        clearSuggestions();
        if (searchRef.current) {
            searchRef.current.value = "";
        }
        loadPlace(autoCompletePlace);

    }
    const handleReset = () => {
        setValue("");
        clearSuggestions();
        if (searchRef.current) {
            searchRef.current.value = "";
            searchRef.current.focus();
        }
    }

    const getPlace = async (autoCompletePlace) => {
        // may need error handling
        const { Place } = await google.maps.importLibrary("places");

        // Use place ID to create a new Place instance.
        const place = new Place({
            id: autoCompletePlace.place_id,
            requestedLanguage: "en",
        });

        // Call fetchFields, passing the desired data fields.
        await place.fetchFields({
            // fields: ["displayName", "formattedAddress", "location", "rating", "regularOpeningHours", "businessStatus"],
            fields: ["formattedAddress", "location", "rating", "photos", "regularOpeningHours", "editorialSummary", "internationalPhoneNumber", "websiteURI"],
        });
        // const results = await getGeocode({ address: place.formattedAddress });
        // console.log(simplifyWebsite(place.websiteURI))
        // console.log(place.internationalPhoneNumber)
        // console.log(place.websiteUri)

        // Log the result
        // console.log(place.displayName);
        // console.log(place.formattedAddress);
        // console.log(place.regularOpeningHours.periods)
        // console.log(place.regularOpeningHours.weekdayDescriptions)
        // console.log(place.location);
        // console.log(place)
        // console.log(place.photos)
        // setUri(place.photos[0].getURI())
        // console.log(place.rating)
        // console.log(autoCompletePlace.types)

        let newPlace = {
            placeName: autoCompletePlace.structured_formatting.main_text,
            info: place.regularOpeningHours ? modifyInfo(place.regularOpeningHours.weekdayDescriptions) : "", // biz hours - regularOpeningHours ["Day: 00:00 AM - 00:00 PM",...]
            summary: place.editorialSummary,
            address: place.formattedAddress,
            phoneNumber: place.internationalPhoneNumber,
            website: place.websiteURI,
            imgURL: place.photos.length > 0 ? place.photos[0].getURI() : "https://i.imgur.com/QsPqFMbh.jpg", // photos - getURI
            category: textFunctions.capitalize(getBestCategory(autoCompletePlace.types).replace(/_/g, " ")), // ?? .make better
            favorite: false,
            lat: place.location.lat(),
            long: place.location.lng(),
            geocode: [place.location.lat(), place.location.lng()],
            placeId: autoCompletePlace.place_id,
            rating: place.rating ? place.rating.toFixed(1) : null
        }
        console.log(newPlace)
        return newPlace

    }
   
    

    
    const loadPlace = async (autoCompletePlace) => {
        const newPlace = await getPlace(autoCompletePlace);
        addPlaceFunction(newPlace);

    };


    // check for establishments in search and show see locations option in dropdown
    useEffect(() => {
        if (searchLimit > 3) {
            updateEstablishmentOption();
        };
    }, [data]);

    const [establishmentOption, setEstablishmentOption] = useState(null);
    const updateEstablishmentOption = () => {
        let result = null;
        let duplicates = {};
        let mostDuplications = 0;
        let mostDuplicated = null;
        if (data) {
            for (let i = data.length - 1; i > -1; i--) {
                let place = data[i];
                if (place.types.includes("establishment")) {
                    result = {
                        placeName: place.structured_formatting.main_text,
                    }
                    if (!Object.keys(duplicates).includes(result.placeName)) {
                        duplicates[result.placeName] = 1;
                    } else {
                        duplicates[result.placeName] += 1;
                    }
                    if (duplicates[result.placeName] > mostDuplications) {
                        mostDuplications = duplicates[result.placeName];
                        mostDuplicated = result.placeName;
                    }
                }
            }
        }
        // only capture the 'mode' establishment if it comes up more than once in the search
        if (mostDuplications > 1) {
            setEstablishmentOption({
                placeName: mostDuplicated
            });
        } else {
            setEstablishmentOption(null);
        }
    };

    const [selectedStyle, setSelectedStyle] = useState({
        searchContainer: {},
        searchBar: {},
        searchInput: {}
    });
    useEffect(() => {
        if (styleProfile === "flowbox") {
            setSelectedStyle(stylings.flowbox);
        } else if (styleProfile === "googlemap") {
            setSelectedStyle(stylings.googlemap);
        }
    }, []);
    const stylings = {
        flowbox: {
            searchBar: {
                width: "100%",
            },
            searchContainer: {
                width: "100%",
                height: "70px",
                zIndex: "1",
            },
            searchInput: {
                border: "1px solid gainsboro",
                boxShadow: "none",
            },
        },
        googlemap: {
            searchBar: {
                width: "90%",
            },
            searchContainer: {
                width: "calc(95% - 40px)",
                height: "90px",
            },
            searchInput: {
                border: "none",
            },
        }
    }
    


    return (
        <div
            className="searchBar-container flx-c position-absolute z-1"
            style={selectedStyle.searchContainer}
        >
            <div className="searchBar position-relative w-90 flx align-c" style={selectedStyle.searchBar}>
                {value.length === 0 ?
                    <span className="material-symbols-outlined google-icon-overlay-right">
                        search
                    </span>
                    :
                    <span onClick={() => handleReset()} className="material-symbols-outlined google-icon-overlay-right pointer">
                        close
                    </span>
                }

                <input
                    ref={searchRef}
                    onChange={e => setValue(e.target.value)}
                    type="text"
                    autoComplete="off"
                    className={`google-input ${status === "OK" && "resultsLoaded"}`}
                    placeholder='Search places...'
                    disabled={!ready}
                    style={selectedStyle.searchInput}
                />

                {status === "OK" &&
                    <div id='autocomplete-container' className="google-searchBar-dropdown z-1 flx-c">
                        {establishmentOption &&
                            <div className="option">
                                <div className="img">
                                    <span className="material-symbols-outlined">
                                        search
                                    </span>
                                </div>
                                <div className="flx-c">
                                    <p className="m-0 truncated"><strong>{establishmentOption.placeName}</strong></p>
                                    <p className="m-0 small gray-text bold500 truncated">See locations</p>
                                </div>
                            </div>
                        }
                        {data.map((place, index) => {
                            let placeName = place.structured_formatting.main_text;
                            let hasAddress = place.structured_formatting.secondary_text ? true : false;
                            let address = place.structured_formatting.secondary_text;
                            let limit = establishmentOption ? searchLimit - 1 : searchLimit;
                            return hasAddress && index < limit && <div key={index} onClick={() => handleSelect(place)} className="option">
                                {/* <img src="https://i.imgur.com/ukt1lYj.png" alt="" className="img" /> */}
                                <div className="img">
                                    <span className="material-symbols-outlined">location_on</span>
                                </div>
                                <div className="flx-c">
                                    <p className="m-0 truncated"><strong>{placeName}</strong></p>
                                    <p className="m-0 small gray-text bold500 truncated">{address}</p>
                                </div>
                            </div>
                        })}

                    </div>
                }
            </div>

        </div>
    )
}
export default GoogleSearch;