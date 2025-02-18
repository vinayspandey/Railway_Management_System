import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet, Modal } from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import BASE_URL from "../config";

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [scheduleData, setScheduleData] = useState({ ScheduleId: "", TrainNo: "", StationNo: "", ArrivalTime: "", DepartureTime: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/schedule`);
      setSchedules(response.data);
    } catch (error) {
      console.error("Error fetching schedules", error);
    }
  };

  const resetForm = () => {
    setScheduleData({ ScheduleId: "", TrainNo: "", StationNo: "", ArrivalTime: "", DepartureTime: "" });
    setEditingSchedule(null);
  };

  const addOrUpdateSchedule = async () => {
    try {
      if (editingSchedule) {
        await axios.put(`${BASE_URL}/schedule/${editingSchedule.ScheduleId}`, scheduleData);
      } else {
        await axios.post(`${BASE_URL}/schedule`, scheduleData);
      }
      fetchSchedules();
      resetForm(); // Reset the form after submission
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving schedule", error);
    }
  };

  const editSchedule = (schedule) => {
    setScheduleData(schedule);
    setEditingSchedule(schedule);
    setModalVisible(true);
  };

  const deleteSchedule = async (ScheduleId) => {
    try {
      await axios.delete(`${BASE_URL}/schedule/${ScheduleId}`);
      fetchSchedules();
    } catch (error) {
      console.error("Error deleting schedule", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Schedules</Text>
      <FlatList
        data={schedules}
        keyExtractor={(item) => item.ScheduleId.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.scheduleInfo}>{item.ScheduleId} - Train: {item.TrainNo}, Station: {item.StationNo}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => editSchedule(item)}>
                <Ionicons name="pencil" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteSchedule(item.ScheduleId)}>
                <Ionicons name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => { resetForm(); setModalVisible(true); }}>
        <Text style={styles.addButtonText}>Add Schedule</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.sectionTitle}>{editingSchedule ? "Edit Schedule" : "Add Schedule"}</Text>
          <TextInput style={styles.input} placeholder="ScheduleId" value={scheduleData.ScheduleId} onChangeText={(text) => setScheduleData({ ...scheduleData, ScheduleId: text })} editable={!editingSchedule} />
          <TextInput style={styles.input} placeholder="TrainNo" value={scheduleData.TrainNo} onChangeText={(text) => setScheduleData({ ...scheduleData, TrainNo: text })} />
          <TextInput style={styles.input} placeholder="StationNo" value={scheduleData.StationNo} onChangeText={(text) => setScheduleData({ ...scheduleData, StationNo: text })} />
          <TextInput style={styles.input} placeholder="ArrivalTime" value={scheduleData.ArrivalTime} onChangeText={(text) => setScheduleData({ ...scheduleData, ArrivalTime: text })} />
          <TextInput style={styles.input} placeholder="DepartureTime" value={scheduleData.DepartureTime} onChangeText={(text) => setScheduleData({ ...scheduleData, DepartureTime: text })} />
          <TouchableOpacity style={styles.addButton} onPress={addOrUpdateSchedule}>
            <Text style={styles.addButtonText}>{editingSchedule ? "Update Schedule" : "Save Schedule"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => { setModalVisible(false); resetForm(); }}>
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
  scheduleInfo: { fontSize: 18, fontWeight: "bold" },
  iconContainer: { flexDirection: "row", gap: 16 },
  addButton: { backgroundColor: "blue", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 16 },
  addButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  modalContainer: { flex: 1, padding: 20, justifyContent: "center" },
  input: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5 },
  cancelButton: { backgroundColor: "red", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 16 }
});

export default Schedule;
