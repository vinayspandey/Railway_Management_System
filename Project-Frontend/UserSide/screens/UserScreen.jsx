import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import logo from "../assets/logo.png";
import BASE_URL from "../config";

const UserScreen = ({ route }) => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [trains, setTrains] = useState([]);
  const [user, setUser] = useState(null); // State to store logged-in user details
  const [currentDateTime, setCurrentDateTime] = useState(new Date()); // For time and date
  const navigation = useNavigation();

  // Check if the user is logged in
  useEffect(() => {
    const checkLoggedInUser = async () => {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        setUser(JSON.parse(userData)); // Set the logged-in user
      } else {
        navigation.navigate("UserLogin"); // Redirect to login if not logged in
      }
    };

    // Start interval to update currentDateTime every second
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    checkLoggedInUser();

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [navigation]);

  // Format the date
  const formattedDate = currentDateTime.toLocaleDateString('en-US', {
    weekday: 'long', // "Monday"
    year: 'numeric', // "2025"
    month: 'long',   // "March"
    day: 'numeric',  // "9"
  });

  const handleSearch = async () => {
    if (!source || !destination) {
      Alert.alert("Error", "Please enter both source and destination.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(`${BASE_URL}/train/search`, {
        params: { Source: source, Destination: destination },
      });

      if (response.data.length > 0) {
        setTrains(response.data); // Store the search results
        navigation.navigate("TrainList", { trains: response.data }); // Navigate to a new screen to display results
      } else {
        Alert.alert("No Trains Found", "No trains are available for the given source and destination.");
      }
    } catch (error) {
      console.error("Search error:", error);
      Alert.alert("Error", "Failed to fetch train details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // If user is not logged in, show nothing (or a loading indicator)
  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Logo in the center */}
      <Image source={logo} style={styles.logo} />
      <Text style={styles.datetime}>
        {formattedDate} | {currentDateTime.toLocaleTimeString()} {/* Time in HH:MM:SS format */}
      </Text>
      {/* Welcome Message */}
      <Text style={styles.welcomeText}>Welcome Back, {user.name}!</Text>

      {/* Train search section */}
      <View style={styles.searchContainer}>
        <Text style={styles.title}>Search Train</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Source"
          value={source}
          onChangeText={setSource}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Destination"
          value={destination}
          onChangeText={setDestination}
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Search</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e1f5fe",
  },
  logo: {
    width: 150,
    height: 150,
    position: "absolute",
    top: "10%", // Adjust this to center the logo vertically
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    position: "absolute",
    top: "40%", // Position below the logo
  },
  searchContainer: {
    width: "80%",
    position: "absolute",
    bottom: "20%", // Adjust this to position the search section
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  datetime: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
};

export default UserScreen;
