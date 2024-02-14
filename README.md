# React Native Weather App

## Instruction

First, to install dependencies. run:

```
npm install
```

If there is an error or npm fails to install, try:

```
npm install --force
```

To run:

```
npm start
```

## App Structure & Navigation

An React Native app with three primary screens, each dedicated to different aspects of weather data display and interaction. Navigation utilizes Stack method. There are options to navigate among the screens on the top bar.

### Screen 1: Home Screen (<i>HomeScreen.js</i>)

On startup, use <b>expo-location</b> to automatically show weather data for the user's
current spot.

### Screen 2: Search & Display Weather (<i>CityLookupScreen.js</i>)

Enable users to look up and see weather details for any specified city.

Features:

-   Input field for city names.
-   Show weather info for searched locations.
-   "Save Location" button to keep locations in a list for easy access later (Seen
    in Screen 3).
-   Disable saving if more than 4 cities are saved.

### Screen 3: Saved Locations (<i>SavedCityListScreen.js</i>)

Display a list of locations saved by the user.

Features:

-   Fetch and display the weather data of the saved locations.
-   Click on a city will navigate to the Home Screen that will display the weather data of that city in detail.
-   "Remove" button that allows deleting a city from the saved list.

## Data Fetching

Use the Open Meteo API (https://open-meteo.com/) for accessing weather and
geocoding data for both the user's current and searched locations.

## Location Services

Integrate <b>expo-location</b> to obtain the user's current location for the first screen.

## Data Storage

Use <b>expo-sqlite</b> to store and manage the list of saved locations.

## User Interface

Use <b>React Native Paper</b>.
