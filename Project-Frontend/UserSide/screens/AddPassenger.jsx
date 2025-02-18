import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Passenger = ({ route }) => {
  const navigation = useNavigation();
  const { train } = route.params; // Receiving selected train details
  const [passengers, setPassengers] = useState([]);

  const addPassenger = () => {
    setPassengers([...passengers, { id: Date.now(), name: "", age: "" }]);
  };

  const removePassenger = (id) => {
    setPassengers(passengers.filter((p) => p.id !== id));
  };

  const updatePassenger = (id, field, value) => {
    setPassengers(
      passengers.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const bookTicket = () => {
    if (passengers.length === 0) {
      alert("Please add at least one passenger.");
      return;
    }

    // Generate random TicketId
    const TicketId = Math.floor(1000 + Math.random() * 9000);
    const NoOfPassengers = passengers.length;
    const TotalFare = NoOfPassengers * 100;

    // Navigate to BookTicket screen with booking details
    navigation.navigate("BookTicket", {
      train,
      passengers,
      TicketId,
      NoOfPassengers,
      TotalFare,
    });
  };

  return (
    <View style={styles.container}>
      {/* Train Details Section */}
      <View style={styles.trainDetails}>
        <Text style={styles.trainTitle}>Train Details</Text>
        <Text style={styles.trainText}>🚆 Train No: {train.TrainNo}</Text>
        <Text style={styles.trainText}>📍 Source: {train.Source}</Text>
        <Text style={styles.trainText}>📍 Destination: {train.Destination}</Text>
        <Text style={styles.trainText}>🕒 Departure: {train.DepartureTime}</Text>
        <Text style={styles.trainText}>🕒 Arrival: {train.ArrivalTime}</Text>
      </View>

      {/* Passenger Registration Section */}
      <Text style={styles.title}>Register Passengers</Text>
      <FlatList
        data={passengers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.passengerItem}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={item.name}
              onChangeText={(text) => updatePassenger(item.id, "name", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Age"
              keyboardType="numeric"
              value={item.age}
              onChangeText={(text) => updatePassenger(item.id, "age", text)}
            />
            <TouchableOpacity onPress={() => removePassenger(item.id)}>
              <Ionicons name="trash" size={24} color="red" style={styles.icon} />
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity onPress={addPassenger} style={styles.addButton}>
        <Ionicons name="add-circle" size={24} color="green" style={styles.icon} />
        <Text style={styles.addButtonText}>Add Passenger</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.bookButton} onPress={bookTicket}>
        <Text style={styles.bookButtonText}>Book Ticket</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  trainDetails: {
    backgroundColor: "#e3f2fd",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  trainTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color: "#0d47a1",
  },
  trainText: {
    fontSize: 16,
    marginBottom: 3,
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  passengerItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
    padding: 5,
  },
  icon: {
    marginLeft: 10,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    bottom: 100,
  },
  addButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "green",
    
  },
  bookButton: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    bottom: 100,
  },
  bookButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Passenger;
