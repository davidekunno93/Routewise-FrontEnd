import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../Context/DataProvider";


const WorldCitiesSearchBar = ({ onInputChange }) => {
    const { gIcon, convertStateToAbbv } = useContext(DataContext);

    // world cities local api
    const [citySearchQuery, setCitySearchQuery] = useState("");
    const [cityAutocomplete, setCityAutocomplete] = useState([]);
    useEffect(() => {
        getWorldCities();
    }, [citySearchQuery]);
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
    

    

    const updateCityInput = (city) => {
        const cityInput = document.getElementById('cityInput');
        if (city.state) {
            cityInput.value = city.city_name + ", " + convertStateToAbbv(city.state);
        } else {
            cityInput.value = city.city_name;
        };
        setCityInput(cityInput.value);
    };


    const [cityInput, setCityInput] = useState("");
    useEffect(() => {
        setCityInput(citySearchQuery);
    }, [citySearchQuery]);
    useEffect(() => {
        onInputChange(cityInput);
    }, [cityInput]);


    return (
        <div className="inputBox">
            <input onChange={(e) => setCitySearchQuery(e.target.value)} id='cityInput' type='text' placeholder='City name e.g. Hawaii, Cancun, Rome' className={`calendarInput ${cityAutocomplete.length > 0 && citySearchQuery.length > 1 && "drop"} italic-placeholder`} autoComplete='off' required />
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
    )
}
export default WorldCitiesSearchBar;