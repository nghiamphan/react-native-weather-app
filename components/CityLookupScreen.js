import React, { useState } from 'react'
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native'
import { Divider, List, Searchbar } from 'react-native-paper'
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
                setSearchedCities(data)
            }

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
                onClearIconPress={() => setSearchedCities([])}
                style={styles.searchbar}
            />

            {searchedCities.length > 0 && (
                <ScrollView style={styles.list_section}>
                    <List.Section>
                        {searchedCities.map((city) => (
                            <View key={city.id}>
                                <List.Item
                                    key={city.id}
                                    title={city.title}
                                    onPress={() => onFetchWeather(city)}
                                />
                                <Divider />
                            </View>
                        ))}
                    </List.Section>
                </ScrollView>
            )}
            {weatherData && <Weather weatherData={weatherData} />}
        </View>
    )
}

const styles = StyleSheet.create({
    searchbar: {
        width: '95%',
        alignSelf: 'center',
        borderRadius: 5,
        backgroundColor: 'lightgray',
    },
    list_section: {
        marginTop: 0,
        width: '95%',
        minHeight: 0,
        maxHeight: 300,
        alignSelf: 'center',
        backgroundColor: 'gray',
    },
})

export default CityLookup

