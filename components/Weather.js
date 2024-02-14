import { useState } from 'react'
import { Image, View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import connectToSqlite from '../db/sqlite'
import { useFocusEffect } from '@react-navigation/core'

const Weather = ({ weatherData }) => {
    const [saved, setSaved] = useState(false)

    if (!weatherData) {
        return <View></View>
    }

    const db = connectToSqlite()

    useFocusEffect(() => {
        const checkDb = async () => {
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM cities WHERE name = ?',
                    [weatherData.locationName],
                    (tx, results) => {
                        if (results.rows.length > 0) {
                            setSaved(true)
                        } else {
                            setSaved(false)
                        }
                    }
                )
            })
        }
        checkDb()
    })

    const onAddLocation = (weatherData) => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM cities WHERE name = ?',
                [weatherData.locationName],
                (tx, results) => {
                    if (results.rows.length === 0) {
                        tx.executeSql('INSERT INTO cities (name, latitude, longitude) VALUES (?, ?, ?)', [
                            weatherData.locationName,
                            weatherData.latitude,
                            weatherData.longitude,
                        ])
                    }
                    setSaved(true)
                }
            )
        })
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

