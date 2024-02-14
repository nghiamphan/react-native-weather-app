import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as Location from 'expo-location'

import Weather from './components/Weather'
import weatherService from './services/weather'
import CityLookupScreen from './components/CityLookupScreen'

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

    const HomeScreen = (props) => {
        return <Weather {...props} weatherData={weatherData} />
    }

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
                            headerRight: () => (
                                <TouchableOpacity onPress={() => navigation.navigate('CityLookupScreen')}>
                                    <Icon name="search" size={25} />
                                </TouchableOpacity>
                            ),
                        })}
                    />
                    <Stack.Screen
                        name="CityLookupScreen"
                        component={CityLookupScreen}
                        options={{ title: 'Search' }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    )
}

