import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, TextInput, StyleSheet, Modal } from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import BASE_URL from "../config";

const Route = () => {
  const [routes, setRoutes] = useState([]);
  const [routeData, setRouteData] = useState({ RouteId: "", TrainNo: "", StationNo: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/route`);
      setRoutes(response.data);
    } catch (error) {
      console.error("Error fetching routes", error);
    }
  };

  const addOrUpdateRoute = async () => {
    try {
      if (editingRoute) {
        await axios.put(`${BASE_URL}/route/${editingRoute.RouteId}`, routeData);
      } else {
        await axios.post(`${BASE_URL}/route`, routeData);
      }
      fetchRoutes();
      setRouteData({ RouteId: "", TrainNo: "", StationNo: "" });
      setEditingRoute(null);
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving route", error);
    }
  };

  const editRoute = (route) => {
    setRouteData(route);
    setEditingRoute(route);
    setModalVisible(true);
  };

  const deleteRoute = async (RouteId) => {
    try {
      await axios.delete(`${BASE_URL}/route/${RouteId}`);
      fetchRoutes();
    } catch (error) {
      console.error("Error deleting route", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Routes</Text>
      <FlatList
        data={routes}
        keyExtractor={(item) => item.RouteId.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.routeInfo}>{item.RouteId} - Train: {item.TrainNo}, Station: {item.StationNo}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => editRoute(item)}>
                <Ionicons name="pencil" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteRoute(item.RouteId)}>
                <Ionicons name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Add Route</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.sectionTitle}>{editingRoute ? "Edit Route" : "Add Route"}</Text>
          <TextInput style={styles.input} placeholder="RouteId" value={routeData.RouteId} onChangeText={(text) => setRouteData({ ...routeData, RouteId: text })} editable={!editingRoute} />
          <TextInput style={styles.input} placeholder="TrainNo" value={routeData.TrainNo} onChangeText={(text) => setRouteData({ ...routeData, TrainNo: text })} />
          <TextInput style={styles.input} placeholder="StationNo" value={routeData.StationNo} onChangeText={(text) => setRouteData({ ...routeData, StationNo: text })} />
          <TouchableOpacity style={styles.addButton} onPress={addOrUpdateRoute}>
            <Text style={styles.addButtonText}>{editingRoute ? "Update Route" : "Save Route"}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
  style={styles.cancelButton} 
  onPress={() => { 
    setModalVisible(false); 
    setEditingRoute(null); 
    setRouteData({ RouteId: "", TrainNo: "", StationNo: "" }); // Reset form fields
  }}
>
  <Text style={styles.addButtonText}>Cancel</Text>
</TouchableOpacity>

        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16,backgroundColor: "#e1f5fe" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  card: { flexDirection: "row", justifyContent: "space-between", padding: 16, borderWidth: 1, borderRadius: 8, marginBottom: 8 },
  routeInfo: { fontSize: 18, fontWeight: "bold" },
  iconContainer: { flexDirection: "row", gap: 16 },
  addButton: { backgroundColor: "blue", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 16 },
  addButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  modalContainer: { flex: 1, padding: 20, justifyContent: "center" },
  input: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5 },
  cancelButton: { backgroundColor: "red", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 16 }
});

export default Route;
