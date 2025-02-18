import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BASE_URL from "../config";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");

        if (!userData) {
          console.error("User data not found in AsyncStorage");
          return;
        }

        const parsedUserData = JSON.parse(userData);
        const userId = parsedUserData.id; // Directly access 'id'

        const response = await axios.get(`${BASE_URL}/user/${userId}`);
        console.log("API Response:", response.data); // Log the response to check data structure
        setUserDetails(response.data[0]); // Correctly access the first element of the array

      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (userDetails) {
      console.log("User Details:", userDetails); // Log user details after setting state
    }
  }, [userDetails]);

  if (loading) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  if (!userDetails) {
    return <Text style={styles.errorText}>Unable to fetch user details.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <View style={styles.card}>
        <Text style={styles.detailText}>Name: {userDetails.Name}</Text>
        <Text style={styles.detailText}>Gender: {userDetails.Gender}</Text>
        <Text style={styles.detailText}>Age: {userDetails.Age}</Text>
        <Text style={styles.detailText}>Mobile No: {userDetails.MobileNo}</Text>
        <Text style={styles.detailText}>City: {userDetails.City}</Text>
        <Text style={styles.detailText}>State: {userDetails.State}</Text>
        <Text style={styles.detailText}>Pincode: {userDetails.Pincode}</Text>
        <Text style={styles.detailText}>Email: {userDetails.EmailId}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#e1f5fe" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  card: { padding: 16, borderWidth: 1, borderRadius: 8, marginBottom: 8, backgroundColor: "#fff" },
  detailText: { fontSize: 16, fontWeight: "500", marginBottom: 4 },
  errorText: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginTop: 20, color: "red" },
});

export default Profile;
