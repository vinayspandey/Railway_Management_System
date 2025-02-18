import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, TextInput, StyleSheet, Modal } from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import BASE_URL from "../config";

const Station = () => {
  const [stations, setStations] = useState([]);
  const [stationData, setStationData] = useState({ StationNo: "", Name: "", TrainNo: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStation, setEditingStation] = useState(null);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/station`);
      setStations(response.data);
    } catch (error) {
      console.error("Error fetching stations", error);
    }
  };

  const addOrUpdateStation = async () => {
    try {
      if (editingStation) {
        await axios.put(`${BASE_URL}/station/${editingStation.StationNo}`, stationData);
      } else {
        await axios.post(`${BASE_URL}/station`, stationData);
      }
      fetchStations();
      setStationData({ StationNo: "", Name: "", TrainNo: "" });
      setEditingStation(null);
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving station", error);
    }
  };

  const editStation = (station) => {
    setStationData(station);
    setEditingStation(station);
    setModalVisible(true);
  };

  const deleteStation = async (StationNo) => {
    try {
      await axios.delete(`${BASE_URL}/station/${StationNo}`);
      fetchStations();
    } catch (error) {
      console.error("Error deleting station", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Stations</Text>
      <FlatList
        data={stations}
        keyExtractor={(item) => item.StationNo.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.stationInfo}>{item.StationNo} - {item.Name} (Train: {item.TrainNo})</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => editStation(item)}>
                <Ionicons name="pencil" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteStation(item.StationNo)}>
                <Ionicons name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Add Station</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.sectionTitle}>{editingStation ? "Edit Station" : "Add Station"}</Text>
          <TextInput style={styles.input} placeholder="StationNo" value={stationData.StationNo} onChangeText={(text) => setStationData({ ...stationData, StationNo: text })} editable={!editingStation} />
          <TextInput style={styles.input} placeholder="Name" value={stationData.Name} onChangeText={(text) => setStationData({ ...stationData, Name: text })} />
          <TextInput style={styles.input} placeholder="TrainNo" value={stationData.TrainNo} onChangeText={(text) => setStationData({ ...stationData, TrainNo: text })} />
          <TouchableOpacity style={styles.addButton} onPress={addOrUpdateStation}>
            <Text style={styles.addButtonText}>{editingStation ? "Update Station" : "Save Station"}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
  style={styles.cancelButton} 
  onPress={() => { 
    setModalVisible(false); 
    setEditingStation(null); 
    setStationData({ StationNo: "", Name: "", TrainNo: "" }); // Reset form
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
  stationInfo: { fontSize: 18, fontWeight: "bold" },
  iconContainer: { flexDirection: "row", gap: 16 },
  addButton: { backgroundColor: "blue", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 16 },
  addButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  modalContainer: { flex: 1, padding: 20, justifyContent: "center" },
  input: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5 },
  cancelButton: { backgroundColor: "red", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 16 }
});

export default Station;
