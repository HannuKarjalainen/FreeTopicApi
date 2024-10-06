import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  const api_key = 'katso palautustekstitiedostosta';
  const url = 'https://api.openweathermap.org/data/2.5/weather?';
  const icon_url = 'https://openweathermap.org/img/wn/';

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      getWeather(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  const getWeather = async (lat, lon) => {
    const address = `${url}lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`;
    try {
      const response = await axios.get(address);
      setWeatherData(response.data);
      setLoading(false);
    } catch (error) {
      alert('Error fetching weather data:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {weatherData && (
        <View style={styles.weatherContainer}>
          <Text style={styles.title}>Weather in your location</Text>
          <Text style={styles.temp}>{weatherData.main.temp}°C</Text>
          <Text>Wind: {weatherData.wind.speed} m/s</Text>
          <Text>Direction: {weatherData.wind.deg}°</Text>
          <Text>{weatherData.weather[0].description}</Text>
          <Image
            style={styles.icon}
            source={{ uri: `${icon_url}${weatherData.weather[0].icon}@2x.png` }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  weatherContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  temp: {
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  icon: {
    width: 100,
    height: 100,
    marginVertical: 20,
  },
});