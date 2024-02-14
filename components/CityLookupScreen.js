import React, { useState } from 'react'
import { Keyboard, View } from 'react-native'
import { List, Searchbar } from 'react-native-paper'
import Weather from './Weather'
import weatherService from '../services/weather'

const CityLookup = () => {
    const [query, setQuery] = useState('')
    const [searchedCities, setSearchedCities] = useState([])
    const [weatherData, setWeatherData] = useState(null)

    const onSearchCity = async () => {
        if (query) {
            const data = await weatherService.fetchCities(query)

            if (data) {
                data.map((city) => {
                    city.title = `${city.name}, ${city.admin1 !== undefined ? city.admin1 + ', ' : ''}${
                        city.country
                    }`
                })
            }
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
            {weatherData && <Weather weatherData={weatherData} />}
        </View>
    )
}

export default CityLookup

