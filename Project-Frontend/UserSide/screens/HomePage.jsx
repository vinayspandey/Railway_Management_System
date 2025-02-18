import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert, 
   ScrollView 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, CommonActions } from "@react-navigation/native";
import axios from "axios";
import logo from "../assets/logo.png";
import BASE_URL from "../config";

const HomeScreen = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const navigation = useNavigation();

  useEffect(() => {
    const clearStorage = async () => {
      await AsyncStorage.clear();
    };
    clearStorage();
  
    setTimeout(() => {
      if (navigation.canGoBack()) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Home" }],
          })
        );
      }
    }, 100); // Delay ensures the navigator is ready
  
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [navigation]);
  

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

      console.log("API Response:", response.data);

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        navigation.navigate("NonLogin", { trains: response.data });
      } else {
        Alert.alert("No Trains Found", "No trains available for the given source and destination.");
      }
    } catch (error) {
      console.error("Search error:", error);
      Alert.alert("Error", "Failed to fetch train details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.datetime}>
          {currentDateTime.toLocaleDateString()} | {currentDateTime.toLocaleTimeString()}
        </Text>

        <View style={styles.loginContainer}>
          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("UserLogin")}>
            <Text style={styles.loginButtonText}>User Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("AdminLogin")}>
            <Text style={styles.loginButtonText}>Admin Login</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardContainer}>
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
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Search</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    
  );
};

const styles = {
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#e1f5fe" },
  logo: { width: 150, height: 150, position: "absolute", top: "20%" },
  datetime: { fontSize: 16, fontWeight: "bold", color: "#000", marginBottom: 10 },
  loginContainer: { position: "absolute", top: 20, right: 20, flexDirection: "row", gap: 10 },
  loginButton: { backgroundColor: "#007BFF", padding: 10, borderRadius: 8, marginTop: 40 },
  loginButtonText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  cardContainer: { width: "80%", backgroundColor: "#fff", borderRadius: 10, padding: 20, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 4 }, elevation: 5, position: "absolute", bottom: "20%" },
  searchContainer: { alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { width: "100%", padding: 12, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 10, backgroundColor: "#fff" },
  button: { backgroundColor: "#007BFF", padding: 12, borderRadius: 8, width: "100%", alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
};

export default HomeScreen;
