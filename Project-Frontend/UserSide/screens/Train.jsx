import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet, Modal } from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import BASE_URL from "../config";

const Train = () => {
  const [trains, setTrains] = useState([]);
  const [trainData, setTrainData] = useState({ TrainNo: "", Source: "", Destination: "", ArrivalTime: "", DepartureTime: "", Date: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [editingTrain, setEditingTrain] = useState(null);
  const [selectedTrain, setSelectedTrain] = useState(null); // New state for viewing train details

  useEffect(() => {
    fetchTrains();
  }, []);

  const fetchTrains = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/train`);
      setTrains(response.data);
    } catch (error) {
      console.error("Error fetching trains", error);
    }
  };

  const addOrUpdateTrain = async () => {
    try {
      if (editingTrain) {
        await axios.put(`${BASE_URL}/train/${editingTrain.TrainNo}`, trainData);
      } else {
        await axios.post(`${BASE_URL}/train`, trainData);
      }
      fetchTrains();
      resetForm();
    } catch (error) {
      console.error("Error saving train", error);
    }
  };

  const editTrain = (train) => {
    setTrainData(train);
    setEditingTrain(train);
    setModalVisible(true);
  };

  const deleteTrain = async (TrainNo) => {
    try {
      await axios.delete(`${BASE_URL}/train/${TrainNo}`);
      fetchTrains();
    } catch (error) {
      console.error("Error deleting train", error);
    }
  };

  const resetForm = () => {
    setTrainData({ TrainNo: "", Source: "", Destination: "", ArrivalTime: "", DepartureTime: "", Date: "" });
    setEditingTrain(null);
    setModalVisible(false);
  };

  const viewTrainDetails = (train) => {
    setSelectedTrain(train);
    setDetailsModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <FlatList
        data={trains}
        keyExtractor={(item) => item.TrainNo.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.trainName}>{item.TrainNo} - {item.Source} to {item.Destination}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => viewTrainDetails(item)}>
                <Ionicons name="eye" size={24} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => editTrain(item)}>
                <Ionicons name="pencil" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTrain(item.TrainNo)}>
                <Ionicons name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Add Train</Text>
      </TouchableOpacity>

      {/* Train Details Modal */}
      <Modal visible={detailsModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.detailsModalContainer}>
            <Text style={styles.sectionTitle}>Train Details</Text>
            {selectedTrain && (
              <>
                <Text style={styles.detailText}>Train No: {selectedTrain.TrainNo}</Text>
                <Text style={styles.detailText}>Source: {selectedTrain.Source}</Text>
                <Text style={styles.detailText}>Destination: {selectedTrain.Destination}</Text>
                <Text style={styles.detailText}>Arrival Time: {selectedTrain.ArrivalTime}</Text>
                <Text style={styles.detailText}>Departure Time: {selectedTrain.DepartureTime}</Text>
                <Text style={styles.detailText}>Date: {selectedTrain.Date}</Text>
              </>
            )}
            <TouchableOpacity style={styles.cancelButton} onPress={() => setDetailsModalVisible(false)}>
              <Text style={styles.addButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add/Edit Train Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.sectionTitle}>{editingTrain ? "Edit Train" : "Add Train"}</Text>
          <TextInput
            style={styles.input}
            placeholder="TrainNo"
            value={trainData.TrainNo}
            onChangeText={(text) => setTrainData({ ...trainData, TrainNo: text })}
            editable={!editingTrain}
          />
          <TextInput style={styles.input} placeholder="Source" value={trainData.Source} onChangeText={(text) => setTrainData({ ...trainData, Source: text })} />
          <TextInput style={styles.input} placeholder="Destination" value={trainData.Destination} onChangeText={(text) => setTrainData({ ...trainData, Destination: text })} />
          <TextInput style={styles.input} placeholder="ArrivalTime" value={trainData.ArrivalTime} onChangeText={(text) => setTrainData({ ...trainData, ArrivalTime: text })} />
          <TextInput style={styles.input} placeholder="DepartureTime" value={trainData.DepartureTime} onChangeText={(text) => setTrainData({ ...trainData, DepartureTime: text })} />
          <TextInput style={styles.input} placeholder="Date" value={trainData.Date} onChangeText={(text) => setTrainData({ ...trainData, Date: text })} />

          <TouchableOpacity style={styles.addButton} onPress={addOrUpdateTrain}>
            <Text style={styles.addButtonText}>{editingTrain ? "Update Train" : "Save Train"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
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
  trainName: { fontSize: 18, fontWeight: "bold" },
  iconContainer: { flexDirection: "row", gap: 16 },
  modalContainer: { flex: 1, padding: 20, justifyContent: "center" },
  detailsModalContainer: { backgroundColor: "white", padding: 20, borderRadius: 10, alignItems: "center" },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  detailText: { fontSize: 16, marginBottom: 5 },
  addButton: { backgroundColor: "blue", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 16 },
  cancelButton: { backgroundColor: "red", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 16 },
  addButtonText: { color: "white", fontSize: 18, fontWeight: "bold" }
});

export default Train;
