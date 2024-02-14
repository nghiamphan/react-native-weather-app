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

// return a promise that resolves with the results of the SQL query
const executeSql = (sql, params) => {
    const db = connectToSqlite()

    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                sql,
                params,
                (innerTx, results) => {
                    resolve(results)
                },
                (innerTx, error) => {
                    reject(error)
                }
            )
        })
    })
}

// middleware function to handle errors when executing SQL
const executeSqlWithErrorHandling = async (sql, params) => {
    try {
        const results = await executeSql(sql, params)
        return results
    } catch (error) {
        console.error(`Error executing SQL: ${sql}`, error)
        throw error
    }
}

const createTable = async () => {
    await executeSqlWithErrorHandling(
        'CREATE TABLE IF NOT EXISTS cities (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, latitude REAL, longitude REAL)',
        []
    )
}

const getAllCities = async () => {
    const results = await executeSqlWithErrorHandling('SELECT * FROM cities', [])
    return results.rows._array
}

const getCityByName = async (name) => {
    const results = await executeSqlWithErrorHandling('SELECT * FROM cities WHERE name = ?', [name])
    return results.rows._array[0]
}

const addCity = async ({ locationName, latitude, longitude }) => {
    await executeSqlWithErrorHandling('INSERT INTO cities (name, latitude, longitude) VALUES (?, ?, ?)', [
        locationName,
        latitude,
        longitude,
    ])
}

const removeCity = async (id) => {
    await executeSqlWithErrorHandling('DELETE FROM cities WHERE id = ?', [id])
}

export default connectToSqlite
export { createTable, getAllCities, getCityByName, addCity, removeCity }

