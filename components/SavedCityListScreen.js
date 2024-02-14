import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import connectToSqlite from '../db/sqlite'
import weatherService from '../services/weather'

const SavedCityListScreen = () => {
    const [cities, setCities] = useState([])
    const db = connectToSqlite()

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM cities', [], async (tx, { rows: { _array } }) => {
                const weatherDataPromises = _array.map(async (city) => {
                    const data = await weatherService.fetchWeather(city.latitude, city.longitude)
                    city.weather_description = data.weather_description
                    city.temperature = data.current_weather.temperature
                    city.temperature_units = data.current_weather_units.temperature
                    return city
                })

                const weatherData = await Promise.all(weatherDataPromises)
                setCities(weatherData)
            })
        })
    }, [])

    const onRemoveLocation = (city) => {
        db.transaction((tx) => {
            tx.executeSql('DELETE FROM cities WHERE id = ?', [city.id])
        })

        setCities(cities.filter((c) => c.id !== city.id))
    }

    return (
        <View>
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
        </View>
    )
}

export default SavedCityListScreen

