import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserScreen from "./UserScreen";
import Profile from "./Profile";
import UserBookingsScreen from "./UserBookingsScreen";


const Drawer = createDrawerNavigator();

const handleLogout = async (navigation) => {
  try {
    await AsyncStorage.removeItem("userData");
    console.log("User logged out!");
    navigation.replace("Home");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

const UserDrawer = () => {
  return (
    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: "#42a5f5", // Light Blue header
        },
        headerTintColor: "#fff", // White text in the header
        headerRight: () => (
          <TouchableOpacity onPress={() => handleLogout(navigation)} style={{ marginRight: 15 }}>
            <Text>
              <Icon name="exit-to-app" size={24} color="white" />
            </Text>
          </TouchableOpacity>
        ),
        drawerStyle: {
          backgroundColor: "#e1f5fe", // Light blue background for the drawer
          paddingTop: 20, // Optional: add padding to top if necessary
        },
        drawerActiveTintColor: "#1e88e5", // Active drawer item color (darker blue)
        drawerInactiveTintColor: "#000", // Inactive drawer item color (black)
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: "bold",
        },
      })}
    >
      <Drawer.Screen
        name="UserHome"
        component={UserScreen}
        options={{
          drawerIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerIcon: ({ color, size }) => <Icon name="person" color={color} size={size} />,
        }}
      />
      
      <Drawer.Screen
        name="My_Bookings"
        component={UserBookingsScreen}
        options={{
          drawerIcon: ({ color, size }) => <Icon name="schedule" color={color} size={size} />,
        }}
      />
      
    </Drawer.Navigator>
  );
};

export default UserDrawer;
