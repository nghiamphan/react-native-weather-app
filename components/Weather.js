import React, { useState } from 'react'
import { Image, Keyboard, View } from 'react-native'
import { List, Searchbar, Text } from 'react-native-paper'
import weatherService from '../services/weather'

const Weather = () => {
    const [query, setQuery] = useState('')
    const [searchedCities, setSearchedCities] = useState([])
    const [weatherData, setWeatherData] = useState(null)

    const onSearchCity = async () => {
        if (query) {
            const data = await weatherService.fetchCities(query)

            data.map((city) => {
                city.title = `${city.name}, ${city.admin1 !== undefined ? city.admin1 + ', ' : ''}${
                    city.country
                }`
            })
            setSearchedCities(data)
            Keyboard.dismiss()
        }
    }

    const onFetchWeather = async (city) => {
        const data = await weatherService.fetchWeather(city.latitude, city.longitude)
        setWeatherData(data)
        setSearchedCities([])
    }

    return (
        <View>
            <Searchbar
                label="location"
                placeholder="Search for a city..."
                value={query}
                onChangeText={(text) => setQuery(text)}
                onIconPress={onSearchCity}
                onSubmitEditing={onSearchCity}
                style={{ width: 300, alignSelf: 'center' }}
            />

            <List.Section>
                {searchedCities &&
                    searchedCities.map((city) => (
                        <List.Item key={city.id} title={city.title} onPress={() => onFetchWeather(city)} />
                    ))}
            </List.Section>
            {weatherData && (
                <>
                    <Image
                        source={{ uri: weatherData.weather_icon_url }}
                        style={{ width: 150, height: 150, alignSelf: 'center' }}
                    />
                    <Text variant="titleLarge">{weatherData.weather_description}</Text>
                    <Text variant="labelLarge">Temperature</Text>
                    <Text variant="titleLarge">
                        {weatherData.current_weather.temperature}{' '}
                        {weatherData.current_weather_units.temperature}
                    </Text>
                    <Text variant="labelLarge">Wind</Text>
                    <Text variant="titleLarge">
                        {weatherData.current_weather.windspeed}{' '}
                        {weatherData.current_weather_units.windspeed}
                    </Text>
                </>
            )}
        </View>
    )
}

export default Weather

