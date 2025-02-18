import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Alert } from "react-native";
import { Image } from "react-native";
import logo from "../assets/logo.png";
import { Platform } from "react-native";

const NonLogin = ({ route, navigation }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentDateTime(new Date());
      }, 1000);
      return () => clearInterval(interval);
    }, []);
  
    const formattedDate = currentDateTime.toLocaleDateString('en-US', {
      weekday: 'long', // "Monday"
      year: 'numeric', // "2025"
      month: 'long',   // "March"
      day: 'numeric',  // "9"
    });
  const { trains } = route.params; // Trains data passed from HomeScreen

  const handleTrainSelect = (train) => {
    if (Platform.OS === "web") {
      window.alert("Please login to book a ticket.");
      navigation.navigate("Home"); // Navigate after alert
    } else {
      Alert.alert(
        "Login Required",
        "Please login to book a ticket.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Home"),
          },
        ],
        { cancelable: false }
      );
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>Available Trains</Text>
      <Text style={styles.datetime}>
            {formattedDate} | {currentDateTime.toLocaleTimeString()} {/* Time in HH:MM:SS format */}
          </Text>
      <FlatList
        data={trains}
        keyExtractor={(item) => item.TrainNo.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.trainItem}
            onPress={() => handleTrainSelect(item)}
          >
            <Text style={styles.trainText}>Train No: {item.TrainNo}</Text>
            <Text style={styles.trainText}>Source: {item.Source}</Text>
            <Text style={styles.trainText}>Destination: {item.Destination}</Text>
            <Text style={styles.trainText}>Departure: {item.DepartureTime}</Text>
            <Text style={styles.trainText}>Arrival: {item.ArrivalTime}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#e1f5fe",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  trainItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  trainText: {
    fontSize: 16,
    marginBottom: 5,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 10,
  },
  datetime: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
});

export default NonLogin;