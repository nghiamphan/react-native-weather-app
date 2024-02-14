import { Image, View } from 'react-native'
import { Text } from 'react-native-paper'

const Weather = ({ weatherData }) => {
    if (!weatherData) {
        return <View></View>
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
        </View>
    )
}

export default Weather

