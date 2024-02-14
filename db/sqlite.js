import { Platform } from 'react-native'
import * as SQLite from 'expo-sqlite'

const connectToSqlite = () => {
    if (Platform.OS === 'web') {
        return {
            transaction: () => {
                return { executeSql: () => {} }
            },
        }
    }

    const db = SQLite.openDatabase('weather.db')
    return db
}

export default connectToSqlite

