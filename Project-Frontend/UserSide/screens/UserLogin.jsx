import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import logo from "../assets/logo.png";
import BASE_URL from "../config";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const navigation = useNavigation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/login`, { email, password });
      const { success, data } = response.data;

      if (success) {
        // Save user data to AsyncStorage
        await AsyncStorage.setItem("userData", JSON.stringify(data));

        // Navigate based on user type
        if (data.userType === "user") {
          navigation.navigate("UserDrawer");
        }
      } else {
        Alert.alert("Error", "Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to login. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>User Login</Text>
      <Text style={styles.datetime}>
        {currentDateTime.toLocaleDateString("en-US", {
          weekday: "long", // "Monday"
          year: "numeric", // "2025"
          month: "long", // "March"
          day: "numeric", // "9"
        })} | {currentDateTime.toLocaleTimeString()} {/* Time in HH:MM:SS format */}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", marginTop: 20 }}>
        <Text>Don't have an account? Sign up </Text>
        <TouchableOpacity onPress={() => navigation.navigate("UserRegistration")}>
          <Text style={{ color: "blue", fontWeight: "bold" }}>here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e1f5fe",
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

export default UserLogin;
