import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { AppState } from "react-native"; // Import AppState for React Native
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import HomeScreen from "./HomePage";
import TrainList from "./TrainList";
import UserLogin from "./UserLogin";
import UserRegistration from "./UserRegistration";
import Passenger from "./AddPassenger";
import BookTicket from "./BookTicket";
import AdminDrawer from "./AdminDrawer";
import AdminLogin from "./Login";
import NonLogin from "./NonLogin";
import UserDrawer from "./UserDrawer";
import UserScreen from "./UserScreen";

// Initialize Stack Navigator
const Stack = createNativeStackNavigator();

const Launcher = () => {
  // Clear AsyncStorage when the app is closed or goes into background
  useEffect(() => {
    const appStateListener = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "background" || nextAppState === "inactive") {
        clearAsyncStorage(); // Clear AsyncStorage
      }
    });

    // Cleanup the listeners on component unmount
    return () => {
      appStateListener.remove();
    };
  }, []);

  // Function to clear AsyncStorage
  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      console.log("AsyncStorage cleared on app close or tab unload.");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AdminDrawer" component={AdminDrawer} options={{ headerShown: false }} />
        <Stack.Screen name="TrainList" component={TrainList} options={{ headerShown: true }} />
        <Stack.Screen name="UserLogin" component={UserLogin} options={{ headerShown: true }} />
        <Stack.Screen name="AddPassenger" component={Passenger} options={{ headerShown: true }} />
        <Stack.Screen name="UserRegistration" component={UserRegistration} options={{ headerShown: true }} />
        <Stack.Screen name="AdminLogin" component={AdminLogin} options={{ headerShown: true }} />
        <Stack.Screen name="BookTicket" component={BookTicket} options={{ headerShown: true }} />
        <Stack.Screen name="NonLogin" component={NonLogin} options={{ headerShown: false }} />
        <Stack.Screen name="UserDrawer" component={UserDrawer} options={{ headerShown: false }} />
        
        
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
};

export default Launcher;
