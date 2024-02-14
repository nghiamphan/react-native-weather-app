import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as Location from 'expo-location'

import Weather from './components/Weather'
import weatherService from './services/weather'
import CityLookupScreen from './components/CityLookupScreen'
import SavedCityListScreen from './components/SavedCityListScreen'
import connectToSqlite from './db/sqlite'

const Stack = createNativeStackNavigator()

export default function App() {
    const [weatherData, setWeatherData] = useState(null)

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

        askLocationPermission()
    }, [])

    useEffect(() => {
        const db = connectToSqlite()

        db.transaction((tx) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS cities (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, latitude REAL, longitude REAL)'
            )
        })
    }, [])

    const HomeScreen = (props) => {
        return <Weather {...props} weatherData={weatherData} />
    }

    const CityLookupNavigation = (navigation) => (
        <Pressable onPress={() => navigation.navigate('CityLookupScreen')}>
            <Icon name="search" size={25} />
        </Pressable>
    )

    const SavedCityListNavigation = (navigation) => (
        <Pressable onPress={() => navigation.navigate('SavedCityListScreen')}>
            <Icon name="list" size={25} />
        </Pressable>
    )

    return (
        <>
            <StatusBar style="auto" />
            <NavigationContainer theme={{ colors: { background: 'darkgrey' } }}>
                <Stack.Navigator>
                    <Stack.Screen
                        name="HomeScreen"
                        component={HomeScreen}
                        options={({ navigation }) => ({
                            title: 'Home',
                            headerRight: () => CityLookupNavigation(navigation),
                            headerLeft: () => SavedCityListNavigation(navigation),
                        })}
                    />
                    <Stack.Screen
                        name="CityLookupScreen"
                        component={CityLookupScreen}
                        options={({ navigation }) => ({
                            title: 'Search',
                            headerRight: () => SavedCityListNavigation(navigation),
                        })}
                    />
                    <Stack.Screen
                        name="SavedCityListScreen"
                        component={SavedCityListScreen}
                        options={({ navigation }) => ({
                            title: 'Locations',
                            headerRight: () => CityLookupNavigation(navigation),
                        })}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    )
}

