import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faMagnifyingGlass, faWater, faWind } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import clearImage from './images/clear.png';
import rainImage from './images/rain.png';
import snowImage from './images/snow.png';
import cloudImage from './images/cloud.png';
import mistImage from './images/mist.png';

function WeatherApp() {
    const APIKey = '477a9e5d5875943dc15f6a5e28d184e0';
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(false);
    const [sunrise, setSunrise] = useState(null);
    const [sunset, setSunset] = useState(null);

    const weatherImageMap = {
        Clear: clearImage,
        Rain: rainImage,
        Snow: snowImage,
        Clouds: cloudImage,
        Haze: mistImage
    };

    const handleSearchClick = async () => {
        const inputCity = city.trim();

        if (inputCity === '') {
            return;
        }

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&units=metric&appid=${APIKey}`
            );
            const json = await response.json();

            if (json.cod === '404') {
                setError(true);
                setWeatherData(null);
            } else {
                setError(false);
                setWeatherData(json);

                // Fetch sunrise and sunset times
                setSunrise(new Date(json.sys.sunrise * 1000));
                setSunset(new Date(json.sys.sunset * 1000));
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearchClick();
        }
    };

    const containerStyle = {
        height: weatherData || error ? '630px' : '100px', // Adjust the height here
        transition: '0.6s ease-out'
    };

    return (
        <div className="container" style={containerStyle}>
            <div className="search-box">
                <i><FontAwesomeIcon icon={faLocationDot} className="icon" /></i>
                <input
                    type="text"
                    placeholder="Enter your location"
                    className="custom-input"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button className="search-button" onClick={handleSearchClick}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            </div>

            {error && (
                <div className="not-found">
                    <img src="images/404.png" alt="Not Found" />
                    <p>Oops! Invalid location :/</p>
                </div>
            )}

            {weatherData && (
                <div>
                    <div className="weather-box fadeIn">
                        <img
                            src={weatherImageMap[weatherData.weather[0].main]}
                            alt={weatherData.weather[0].description}
                        />
                        <p className="temperature">
                            {parseInt(weatherData.main.temp)}
                            <span>°C</span>
                        </p>
                        <p className="description">{weatherData.weather[0].description}</p>
                    </div>
                    <div className="weather-details fadeIn">
                        <div className="humidity">
                            <i><FontAwesomeIcon icon={faWater} /></i>
                            <div className="text">
                                <span>{weatherData.main.humidity}%</span>
                                <p>Humidity</p>
                            </div>
                        </div>
                        <div className="wind">
                            <i><FontAwesomeIcon icon={faWind} /></i>
                            <div className="text">
                                <span>{parseInt(weatherData.wind.speed)} Km/h</span>
                                <p>Wind Speed</p>
                            </div>
                        </div>
                    </div>
                    <div className="sunrise-sunset">
                        <p className="sunrise-animation">Sunrise: {sunrise && sunrise.toLocaleTimeString()}</p>
                        <p className="sunset-animation">Sunset: {sunset && sunset.toLocaleTimeString()}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WeatherApp;
