import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, TextInput, StyleSheet, Image, ScrollView } from "react-native";
import { Card, Button, IconButton } from "react-native-paper";
import axios from "axios";
import moment from "moment";
import logo from "../assets/logo.png"; // Ensure the logo is placed correctly in assets
import BASE_URL from "../config";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState(moment().format("MMMM Do YYYY, h:mm:ss a"));

  useEffect(() => {
    fetchUsers();
    const timer = setInterval(() => {
      setCurrentDateTime(moment().format("MMMM Do YYYY, h:mm:ss a"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${ BASE_URL }/user`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchBookings = async (userId) => {
    try {
      console.log(`Fetching bookings for user: ${userId}`);
      const response = await axios.get(`${BASE_URL}/user/${userId}/bookings`);
      
      if (response.data.length === 0) {
        console.log("No bookings found");
      } else {
        console.log("Bookings:", response.data);
      }
      
      setBookings(response.data);
      setSelectedUser(userId);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };
  

  const deleteUser = async (userId) => {
    Alert.alert("Confirm", "Are you sure you want to delete this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: async () => {
          try {
            await axios.delete(`${ BASE_URL }/user/${userId}`);
            fetchUsers();
          } catch (error) {
            console.error("Error deleting user:", error);
          }
        },
      },
    ]);
  };

  const startEditing = (user) => {
    setEditingUser(user);
    setUpdatedName(user.Name);
    setUpdatedEmail(user.EmailId);
  };

  const updateUser = async () => {
    if (!editingUser) return;

    try {
      await axios.put(`${ BASE_URL }/user/${editingUser.UserId}`, {
        Name: updatedName,
        EmailId: updatedEmail,
      });

      setEditingUser(null);
      setUpdatedName("");
      setUpdatedEmail("");
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.Name.toLowerCase().includes(search.toLowerCase()) ||
    user.EmailId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={logo} style={styles.logo} />

      {/* Current Date & Time */}
      <Text style={styles.dateTime}>{currentDateTime}</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search by Name or Email"
        value={search}
        onChangeText={setSearch}
      />

      {editingUser ? (
        <View style={styles.editContainer}>
          <Text style={styles.editTitle}>Edit User</Text>
          <TextInput value={updatedName} onChangeText={setUpdatedName} placeholder="Name" style={styles.input} />
          <TextInput value={updatedEmail} onChangeText={setUpdatedEmail} placeholder="Email" style={styles.input} />
          <Button mode="contained" onPress={updateUser} style={styles.updateButton}>Update</Button>
          <Button mode="outlined" onPress={() => setEditingUser(null)} style={styles.cancelButton}>Cancel</Button>
        </View>
      ) : selectedUser ? (
        <View style={{ flex: 1 }}>
          <Text style={styles.subtitle}>User Bookings</Text>
          <ScrollView style={{ maxHeight: 400 }}>
            <FlatList
              data={bookings}
              keyExtractor={(item) => item.BookingId.toString()}
              renderItem={({ item }) => (
                <Card style={styles.card}>
                  <Card.Content>
                    <Text>Train No: {item.TrainNo}</Text>
                    <Text>Ticket ID: {item.TicketId}</Text>
                    <Text>Passengers: {item.NoOfPassengers}</Text>
                    <Text>Total Fare: {item.TotalFare}</Text>
                    <Text>Booking Date: {item.BookingDate}</Text>
                  </Card.Content>
                </Card>
              )}
            />
          </ScrollView>
          <Button mode="contained" onPress={() => setSelectedUser(null)} style={styles.backButton}>Back</Button>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.UserId.toString()}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.userText}>Name: {item.Name}</Text>
                <Text>Email: {item.EmailId}</Text>
                <Text>City: {item.City}</Text>
              </Card.Content>
              <Card.Actions>
                <IconButton icon="pencil" color="green" onPress={() => startEditing(item)} />
                <IconButton icon="delete" color="red" onPress={() => deleteUser(item.UserId)} />
                <IconButton icon="eye" color="blue" onPress={() => fetchBookings(item.UserId)} />
              </Card.Actions>
            </Card>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#e1f5fe", },
  logo: { width: 100, height: 100, alignSelf: "center", marginBottom: 10 },
  dateTime: { fontSize: 16, textAlign: "center", marginBottom: 10, color: "#0277bd" },
  searchBar: { borderWidth: 1, padding: 10, borderRadius: 5, marginBottom: 10, backgroundColor: "white" },
  card: { marginBottom: 10, padding: 10, borderRadius: 10, elevation: 3 },
  userText: { fontSize: 18, fontWeight: "bold" },
  editContainer: { padding: 15, backgroundColor: "white", borderRadius: 10 },
  editTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  updateButton: { backgroundColor: "green", marginBottom: 10 },
  cancelButton: { borderColor: "gray", marginBottom: 10 },
  backButton: { backgroundColor: "gray", marginTop: 10 },
  subtitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
});

export default AdminPanel;
