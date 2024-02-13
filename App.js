import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'
import Weather from './components/Weather'

export default function App() {
    return (
        <View style={styles.container}>
            <Weather />
            <StatusBar style="auto" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'darkgrey',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 50,
    },
})

