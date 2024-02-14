import { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { getAllCities, removeCity } from '../db/sqlite'
import weatherService from '../services/weather'

const SavedCityListScreen = () => {
    const [cities, setCities] = useState([])

    useEffect(() => {
        const fetchCitiesAndWeather = async () => {
            const cities = await getAllCities()
            const weatherDataPromises = cities.map(async (city) => {
                const data = await weatherService.fetchWeather(city.latitude, city.longitude)
                city.weather_description = data.weather_description
                city.temperature = data.current_weather.temperature
                city.temperature_units = data.current_weather_units.temperature
                return city
            })

            const weatherData = await Promise.all(weatherDataPromises)
            setCities(weatherData)
        }

        fetchCitiesAndWeather()
    }, [])

    const onRemoveLocation = (city) => {
        removeCity(city.id)
        setCities(cities.filter((c) => c.id !== city.id))
    }

    return (
        <ScrollView>
            {cities.map((city) => {
                return (
                    <View key={city.id}>
                        <Text variant="titleLarge">{city.name}</Text>
                        <Text variant="titleLarge">{city.weather_description}</Text>
                        <Text variant="titleLarge">
                            {city.temperature} {city.temperature_units}
                        </Text>
                        <Button icon="minus" mode="contained" onPress={() => onRemoveLocation(city)}>
                            Remove
                        </Button>
                    </View>
                )
            })}
        </ScrollView>
    )
}

export default SavedCityListScreen

