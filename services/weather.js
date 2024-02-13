import wmo_weather_code from '../db/wmo_weather_code.json'

const fetchCities = async (query) => {
    if (query) {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5`
        const response = await fetch(url)
        const data = await response.json()
        return data.results
    }
}

const fetchWeather = async (latitude, longitude) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    const response = await fetch(url)
    const data = await response.json()

    if (data.current_weather.weathercode.is_day === 1) {
        data.weather_description = wmo_weather_code[data.current_weather.weathercode].day.description
        data.weather_icon_url = wmo_weather_code[data.current_weather.weathercode].day.image
    } else {
        data.weather_description = wmo_weather_code[data.current_weather.weathercode].night.description
        data.weather_icon_url = wmo_weather_code[data.current_weather.weathercode].night.image
    }

    console.log(data)

    return data
}

export default { fetchCities, fetchWeather }
