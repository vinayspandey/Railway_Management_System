import React, { useState } from 'react';
import axios from "axios";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import { RadioButton } from 'react-native-paper'; // Correct way to handle radio buttons
import BASE_URL from '../config';



const UserRegistration = ({ navigation }) => {
  const [data, setData] = useState({
    Name: "",
    EmailId: "",
    Password: "",
    Gender: "Male",
    Age: "",
    MobileNo: "",
    City: "",
    State: "",
    Pincode: "",
  });

  // Handle form submission
  const HandleRegister = async () => {
    const { Name, EmailId, Password, Gender, Age, MobileNo, City, State, Pincode } = data;

    if (!Name || !EmailId || !Password || !Age || !MobileNo || !City || !State || !Pincode) {
      Toast.show({ type: 'error', text1: 'All fields are required!', visibilityTime: 3000 });
      return;
    }

    try {
      const result = await axios.post(`${BASE_URL}/user`, data);
      console.log(result);

      Toast.show({ type: 'success', text1: 'User Registration Successful!', visibilityTime: 3000 });

      setTimeout(() => {
        navigation.navigate('UserLogin');
      }, 3000);
    } catch (err) {
      console.log(err);
      Toast.show({ type: 'error', text1: 'Registration Failed!', visibilityTime: 3000 });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>User Registration</Text>

      <TextInput style={styles.input} placeholder="Name" value={data.Name} onChangeText={(value) => setData({ ...data, Name: value })} />
      <TextInput style={styles.input} placeholder="Email ID" keyboardType="email-address" value={data.EmailId} onChangeText={(value) => setData({ ...data, EmailId: value })} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={data.Password} onChangeText={(value) => setData({ ...data, Password: value })} />
      
      {/* Gender Selection using RadioButton */}
      <View style={styles.radioGroup}>
        <Text style={styles.label}>Gender</Text>
        <RadioButton.Group onValueChange={(value) => setData({ ...data, Gender: value })} value={data.Gender}>
          <View style={styles.radioButton}>
            <RadioButton value="Male" />
            <Text>Male</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton value="Female" />
            <Text>Female</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton value="Other" />
            <Text>Other</Text>
          </View>
        </RadioButton.Group>
      </View>

      <TextInput style={styles.input} placeholder="Age" keyboardType="numeric" value={data.Age} onChangeText={(value) => setData({ ...data, Age: value })} />
      <TextInput style={styles.input} placeholder="Mobile No" keyboardType="phone-pad" value={data.MobileNo} onChangeText={(value) => setData({ ...data, MobileNo: value })} />
      <TextInput style={styles.input} placeholder="City" value={data.City} onChangeText={(value) => setData({ ...data, City: value })} />
      <TextInput style={styles.input} placeholder="State" value={data.State} onChangeText={(value) => setData({ ...data, State: value })} />
      <TextInput style={styles.input} placeholder="Pincode" keyboardType="numeric" value={data.Pincode} onChangeText={(value) => setData({ ...data, Pincode: value })} />

      {/* Custom Styled Button */}
      <TouchableOpacity style={styles.button} onPress={HandleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      {/* Toast Component */}
      <Toast />
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: "#e1f5fe",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  radioGroup: {
    marginBottom: 15,
    width: '100%',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    width: '100%',
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserRegistration;
