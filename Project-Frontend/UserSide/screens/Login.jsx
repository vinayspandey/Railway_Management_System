import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Toast from 'react-native-toast-message'; // Import Toast
import logo from "../assets/logo.png";
import BASE_URL from "../config";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

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
  const HandleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error',
        text2: 'Please enter both email and password.',
      });
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/login`, { email, password });
      const { success, data } = response.data;

      if (success) {
        await AsyncStorage.setItem("userData", JSON.stringify(data));

        if (data.userType === "admin") {
          navigation.navigate("AdminDrawer");
        }
      } else {
        // Show toast message for invalid credentials
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error',
          text2: 'Invalid credentials. Please check your email and password.',
        });
      }
    } catch (error) {
      console.error(error);
      // Show toast message for login failure
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error',
          text2: 'Failed to login. Please try again.',
        });
      
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={logo} style={styles.logo} />
      <Text style={styles.datetime}>
            {formattedDate} | {currentDateTime.toLocaleTimeString()} {/* Time in HH:MM:SS format */}
          </Text>
      <Text style={styles.title}>Admin Login</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* AdminLogin Button */}
      <TouchableOpacity style={styles.button} onPress={HandleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e8f4f8", // New background color
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
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
    width: "80%",
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

export default AdminLogin;
