import { useState } from 'react'
import { Alert, Image, View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { useFocusEffect } from '@react-navigation/core'
import { addCity, getAllCities, getCityByName } from '../db/sqlite'

const Weather = ({ weatherData }) => {
    const [saved, setSaved] = useState(false)

    if (!weatherData) {
        return <View></View>
    }

    useFocusEffect(() => {
        const checkCityExist = async () => {
            const city = await getCityByName(weatherData.locationName)
            if (city) {
                setSaved(true)
            } else {
                setSaved(false)
            }
        }
        checkCityExist()
    })

    const onAddLocation = async (weatherData) => {
        const cities = await getAllCities()
        if (cities.length >= 4) {
            Alert.alert('Error', 'You can only save up to 4 locations')
            return
        }
        addCity(weatherData)
        setSaved(true)
    }

    return (
        <View>
            <Text variant="headlineSmall" style={{ alignSelf: 'center' }}>
                {weatherData.locationName}
            </Text>
            <Image
                source={{ uri: weatherData.weather_icon_url }}
                style={{ width: 150, height: 150, alignSelf: 'center' }}
            />
            <Text variant="titleLarge">{weatherData.weather_description}</Text>
            <Text variant="labelLarge">Temperature</Text>
            <Text variant="titleLarge">
                {weatherData.current_weather.temperature} {weatherData.current_weather_units.temperature}
            </Text>
            <Text variant="labelLarge">Wind</Text>
            <Text variant="titleLarge">
                {weatherData.current_weather.windspeed} {weatherData.current_weather_units.windspeed}
            </Text>
            <Button
                icon={saved ? 'check' : 'plus'}
                mode="contained"
                disabled={saved}
                onPress={() => onAddLocation(weatherData)}
                style={{ width: 200, alignSelf: 'center' }}
            >
                {saved ? 'Already saved' : 'Save Location'}
            </Button>
        </View>
    )
}

export default Weather

