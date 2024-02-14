import { useState } from 'react'
import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { useFocusEffect } from '@react-navigation/core'
import { addCity, getAllCities, getCityByName } from '../db/sqlite'

const Weather = ({ weatherData }) => {
    const [saved, setSaved] = useState(false)

    useFocusEffect(() => {
        const checkCityExist = async () => {
            if (weatherData) {
                const city = await getCityByName(weatherData.locationName)
                if (city) {
                    setSaved(true)
                } else {
                    setSaved(false)
                }
            }
        }
        checkCityExist()
    })

    if (!weatherData) {
        return <View></View>
    }

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
        <ScrollView style={styles.column}>
            <Text variant="headlineSmall" style={styles.titleCenter}>
                {weatherData.locationName}
            </Text>
            <Image source={{ uri: weatherData.weather_icon_url }} style={styles.image} />
            <Text variant="titleLarge" style={styles.titleCenter}>
                {weatherData.weather_description}
            </Text>

            <View style={styles.container}>
                <View style={styles.column}>
                    <Text variant="labelLarge">Temperature</Text>
                    <Text variant="titleLarge">
                        {weatherData.current_weather.temperature}
                        {weatherData.current_weather_units.temperature}
                    </Text>
                </View>
                <View style={styles.column}>
                    <Text variant="labelLarge">Wind</Text>
                    <Text variant="titleLarge">
                        {weatherData.current_weather.windspeed}{' '}
                        {weatherData.current_weather_units.windspeed}
                    </Text>
                </View>
            </View>

            <Button
                icon={saved ? 'check' : 'plus'}
                mode="contained"
                disabled={saved}
                onPress={() => onAddLocation(weatherData)}
                style={styles.button}
            >
                {saved ? 'Already saved' : 'Save Location'}
            </Button>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10,
    },
    column: {
        flexDirection: 'column',
        margin: 10,
        marginHorizontal: 20,
    },
    titleCenter: {
        alignSelf: 'center',
    },
    image: {
        width: 150,
        height: 150,
        alignSelf: 'center',
    },
    button: {
        width: 200,
        alignSelf: 'center',
        marginTop: 0,
    },
})

export default Weather

