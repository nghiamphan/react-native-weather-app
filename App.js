import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

import HomeScreen from './components/HomeScreen'
import CityLookupScreen from './components/CityLookupScreen'
import SavedCityListScreen from './components/SavedCityListScreen'

const Stack = createNativeStackNavigator()

export default function App() {
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

