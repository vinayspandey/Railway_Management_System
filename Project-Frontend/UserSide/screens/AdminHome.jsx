import React,{ useState, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, Card } from "react-native-paper";
import logo from "../assets/logo.png";

function AdminHome() {
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
  return (
    <View style={styles.container}>
      {/* App Logo */}
      <Image source={logo} style={styles.logo} />
      <Text style={styles.datetime}>
            {formattedDate} | {currentDateTime.toLocaleTimeString()} {/* Time in HH:MM:SS format */}
          </Text>

      {/* Welcome Card */}
      <Card style={styles.card}>
        <Card.Title title="Train Management System" titleStyle={styles.title} />
        <Card.Content>
          <Text style={styles.subtitle}>
            Welcome to the Train Management System. Use the navigation bar to access different functionalities.
          </Text>
        </Card.Content>
      </Card>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e1f5fe", // Light blue background
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  card: {
    width: "90%",
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    elevation: 5, // Shadow effect
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0277bd", // Dark blue
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    color: "#555",
  },

  datetime: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
 
});

export default AdminHome;
