import { useEffect, useState } from 'react'
import * as Location from 'expo-location'

import Weather from './Weather'
import weatherService from '../services/weather'
import { createTable } from '../db/sqlite'

const HomeScreen = ({ route, navigation }) => {
    const initialWeatherData = route.params?.initialWeatherData
    const [weatherData, setWeatherData] = useState(initialWeatherData)

    if (weatherData !== initialWeatherData && initialWeatherData !== undefined) {
        setWeatherData(initialWeatherData)
    }

    useEffect(() => {
        const askLocationPermission = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') {
                alert('Permission to access location was denied')
                return
            }

            const geocoding = await Location.getCurrentPositionAsync({})
            const data = await weatherService.fetchWeather(
                geocoding.coords.latitude,
                geocoding.coords.longitude
            )
            setWeatherData(data)
        }

        if (!initialWeatherData) {
            askLocationPermission()
        }
    }, [navigation])

    useEffect(() => {
        createTable()
    }, [])

    return <Weather weatherData={weatherData} />
}

export default HomeScreen

