import * as Loaction from "expo-location";
import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  Dimensions,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
const API_KEY = "3bf71cf712084d8ab3b092fa4f35731a";

const icons = {
  Clear: "day-sunny",
  Clouds: "cloudy",
  Rain: "rain",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Drizzle: "day-rain",
  Thunderstorm: "lightning",
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
export default function App() {
  const [days, setDays] = useState([]);
  const [location, setLocation] = useState("Loading...");
  const [ok, setOk] = useState(true);

  const ask = async () => {
    const { granted } = await Loaction.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Loaction.getCurrentPositionAsync();
    const city = await Loaction.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setLocation(city[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json.daily);
  };
  useEffect(() => {
    ask();
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: "orange" }}>
      <StatusBar style="light" />
      <View style={styles.CitySection}>
        <Text style={styles.CityText}>{location}</Text>
      </View>

      <ScrollView
        horizontal={true}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerstyle={styles.WeatherSection}
      >
        {days.length === 0 && location ? (
          <View
            style={{
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT * 0.8,
              height: "90%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator color="black" size={"large"} />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.WeatherElement}>
              <Text style={styles.DateText}>
                {new Date(day.dt * 1000).toString().substring(0, 10)}
              </Text>
              <View style={styles.CityDivision}>
                <Text style={styles.WeatherCityText}>{location}</Text>
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={90}
                  color="black"
                />
              </View>
              <View style={styles.TempSection}>
                <View style={styles.TempDivision}>
                  <MaterialIcons name="arrow-upward" size={24} color="black" />
                  <Text style={styles.TempText}>
                    {parseInt(day.temp.max).toFixed(0)}℃
                  </Text>
                </View>
                <View style={styles.TempDivision}>
                  <MaterialIcons
                    name="arrow-downward"
                    size={24}
                    color="black"
                  />
                  <Text style={styles.TempText}>
                    {parseInt(day.temp.max).toFixed(0)}℃
                  </Text>
                </View>
                <View style={styles.TempDivision}>
                  <Ionicons name="water-outline" size={24} color="black" />
                  <Text style={styles.TempText}>{day.humidity}%</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {days.length === 0 && location ? (
        <View />
      ) : (
        <View style={styles.DaySection}>
          {days.slice(0, 5).map((day, index) => (
            <View key={index} style={styles.Day}>
              <Text style={styles.DayText}>
                {new Date(day.dt * 1000).toString().substring(0, 3)}
              </Text>
              <View style={styles.DayIconText}>
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={28}
                  color="black"
                />
              </View>
              <Text style={styles.DayText}>
                {parseInt(day.temp.max).toFixed(0)}℃
              </Text>
              <Text style={styles.DayText}>
                {parseInt(day.temp.min).toFixed(0)}℃
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  CitySection: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  CityText: {
    fontSize: 28,
    fontWeight: "800",
  },
  WeatherSection: {
    flex: 5,
    margin: 18,
  },

  WeatherElement: {
    width: SCREEN_WIDTH,
    padding: 18,
  },
  DateText: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "500",
  },
  WeatherCityText: {
    fontSize: 68,
    fontWeight: "600",
    marginBottom: 5,
    marginRight: 60,
  },
  CityDivision: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  TempSection: {
    flex: 1,
    flexDirection: "row",
  },
  TempDivision: {
    flexDirection: "row",
    marginRight: 25,
    alignItems: "center",
  },
  TempText: {
    fontSize: 18,
    fontWeight: "600",
  },
  DaySection: {
    flex: 7,
    flexDirection: "row",
    margin: 18,
  },
  Day: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  DayText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 5,
  },
  DayIconText: {
    margin: 10,
  },
});
