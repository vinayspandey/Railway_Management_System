import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BASE_URL from "../config";

const UserBookingsScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        console.log("Stored userData:", userData);
  
        if (!userData) {
          console.error("User data not found in AsyncStorage");
          return;
        }
  
        const parsedUserData = JSON.parse(userData);
        console.log("Parsed user ID:", parsedUserData?.id); // Now accessing directly from parsedUserData
  
        const userId = parsedUserData.id;  // Access the 'id' directly
        const response = await axios.get(`${BASE_URL}/user/${userId}/bookings`);
        
        console.log("Bookings response:", response.data); // Debugging
  
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBookings();
  }, []);
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Bookings</Text>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : bookings.length === 0 ? (
        <Text style={styles.noBookings}>No bookings found</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.BookingId.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.bookingText}>Train No: {item.TrainNo}</Text>
              <Text style={styles.bookingText}>Ticket ID: {item.TicketId}</Text>
              <Text style={styles.bookingText}>Passengers: {item.NoOfPassengers}</Text>
              <Text style={styles.bookingText}>Booking Date: {item.BookingDate}</Text>
              <Text style={styles.bookingText}>Total Fare: ₹{item.TotalFare}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#e1f5fe" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  card: { padding: 16, borderWidth: 1, borderRadius: 8, marginBottom: 8, backgroundColor: "#fff" },
  bookingText: { fontSize: 16, fontWeight: "500", marginBottom: 4 },
  noBookings: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginTop: 20 },
});

export default UserBookingsScreen;
