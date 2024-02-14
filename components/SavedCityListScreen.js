import { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Button, Divider, Text } from 'react-native-paper'

import { getAllCities, removeCity } from '../db/sqlite'
import weatherService from '../services/weather'

const SavedCityListScreen = ({ navigation }) => {
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
    }, [navigation])

    const onRemoveLocation = (city) => {
        removeCity(city.id)
        setCities(cities.filter((c) => c.id !== city.id))
    }

    return (
        <ScrollView>
            {cities.map((city) => {
                return (
                    <View key={city.id}>
                        <View style={styles.list_item}>
                            <View style={[styles.column, styles.columnLeft]}>
                                <Text variant="titleMedium">{city.name}</Text>
                                <Text variant="titleMedium">{city.weather_description}</Text>
                            </View>

                            <View style={[styles.column, styles.columnRight]}>
                                <Text variant="displaySmall">{city.temperature}°</Text>
                            </View>

                            <View style={styles.column}>
                                <Button
                                    mode="contained"
                                    onPress={() => onRemoveLocation(city)}
                                    style={styles.button}
                                >
                                    <Text style={styles.buttoneText}>Remove</Text>
                                </Button>
                            </View>
                        </View>
                        <Divider />
                    </View>
                )
            })}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    list_item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10,
    },
    column: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    columnLeft: {
        width: '50%',
    },
    columnRight: {
        width: '25%',
    },
    button: {
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor: 'red',
    },
    buttoneText: {
        marginLeft: 0,
        marginRight: 0,
    },
})

export default SavedCityListScreen

