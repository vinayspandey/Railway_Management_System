import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../config";
import logo from "../assets/logo.png";

const BookTicket = ({ route, navigation }) => {
  const { train, passengers, TicketId, NoOfPassengers, TotalFare } = route.params;
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userData"); // Ensure the correct key
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserId(parsedUser.id); // Extract `id` from stored user object
        }
      } catch (error) {
        console.error("Error retrieving UserId:", error);
      }
    };
    fetchUserId();
  }, []);

  const confirmBooking = async () => {
    if (!userId) {
      Toast.show({
        type: "error",
        text1: "⚠️ User not found",
        text2: "Please log in again.",
      });
      setTimeout(() => {
        navigation.navigate("Home");
      }, 3000);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UserId: userId, // ✅ Corrected `id` to `userId`
          TrainNo: train.TrainNo,
          TicketId,
          NoOfPassengers,
          BookingDate: new Date().toISOString().split("T")[0], // Current Date
          TotalFare,
          passengers,
        }),
      });

      const data = await response.json();
      console.log("API Response:", data); // Debugging the response

      if ( data.success) {
        Toast.show({
          type: "success",
          text1: "✅ Booking Confirmed" `Your Ticket ID: ${TicketId}`,
          text2: "loging out in 3 seconds",
          text2: "Your ticket has been successfully booked.",
        });

        setTimeout(() => {
          navigation.navigate("Home");
        }, 3000);
      } else {
        Toast.show({
          type: "error",
          text1: data.message || "Please try again!",
          text2: `Your Ticket ID: ${TicketId}`,
        });
        setTimeout(() => {
          navigation.navigate("Home");
        }, 3000);
      }
    } catch (error) {
      console.error("Booking Error:", error);
      Toast.show({
        type: "error",
        text1: "⚠️ Error",
        text2: "An error occurred while booking the ticket.",
      });
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Image source={logo} style={styles.logo} />

      <View style={styles.card}>
        <Text style={styles.title}>Booking Details</Text>
        <Text>🚆 Train No: {train.TrainNo}</Text>
        <Text>📍 From: {train.Source}</Text>
        <Text>📍 To: {train.Destination}</Text>
        <Text>🕒 Departure: {train.DepartureTime}</Text>
        <Text>🕒 Arrival: {train.ArrivalTime}</Text>
        <Text>🎫 Ticket ID: {TicketId}</Text>
        <Text>👥 Passengers: {NoOfPassengers}</Text>
        <Text>💰 Total Fare: ₹{TotalFare}</Text>

        <TouchableOpacity style={styles.bookButton} onPress={confirmBooking}>
          <Text style={styles.bookButtonText}>Confirm Booking</Text>
        </TouchableOpacity>
      </View>

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#ececec", // Background color
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    position: "absolute",
    top: 30,
    right: 20,
    width: 100,
    height: 100,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    elevation: 5, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  bookButton: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  bookButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default BookTicket;
