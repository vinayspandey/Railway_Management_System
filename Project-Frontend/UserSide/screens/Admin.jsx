import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet, Modal, Alert } from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import BASE_URL from "../config";

const AddAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [adminData, setAdminData] = useState({ Name: "", EmailId: "", Password: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin`);
      setAdmins(response.data);
    } catch (error) {
      console.error("Error fetching admins", error);
    }
  };

  const addOrUpdateAdmin = async () => {
    try {
      if (editingAdmin) {
        await axios.put(`${BASE_URL}/admin/${editingAdmin.AdminId}`, adminData);
      } else {
        await axios.post(`${BASE_URL}/admin`, adminData);
      }
      fetchAdmins();
      setAdminData({ Name: "", EmailId: "", Password: "" });
      setEditingAdmin(null);
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving admin", error);
    }
  };

  const editAdmin = (admin) => {
    setAdminData(admin);
    setEditingAdmin(admin);
    setModalVisible(true);
  };

  const deleteAdmin = async (AdminId) => {
    try {
      await axios.delete(`${BASE_URL}/admin/${AdminId}`);
      fetchAdmins();
    } catch (error) {
      console.error("Error deleting admin", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AddAdmin Management</Text>
      <FlatList
        data={admins}
        keyExtractor={(item) => item.AdminId.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.adminName}>{item.Name} ({item.EmailId})</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => editAdmin(item)}>
                <Ionicons name="pencil" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteAdmin(item.AdminId)}>
                <Ionicons name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Add AddAdmin</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.sectionTitle}>{editingAdmin ? "Edit AddAdmin" : "Add AddAdmin"}</Text>
          <TextInput style={styles.input} placeholder="Name" value={adminData.Name} onChangeText={(text) => setAdminData({ ...adminData, Name: text })} />
          <TextInput style={styles.input} placeholder="Email" value={adminData.EmailId} onChangeText={(text) => setAdminData({ ...adminData, EmailId: text })} />
          <TextInput style={styles.input} placeholder="Password" secureTextEntry value={adminData.Password} onChangeText={(text) => setAdminData({ ...adminData, Password: text })} />
          <TouchableOpacity style={styles.addButton} onPress={addOrUpdateAdmin}>
            <Text style={styles.addButtonText}>{editingAdmin ? "Update AddAdmin" : "Save AddAdmin"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => { setModalVisible(false); setEditingAdmin(null); }}>
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
  adminName: { fontSize: 18, fontWeight: "bold" },
  iconContainer: { flexDirection: "row", gap: 16 },
  addButton: { backgroundColor: "blue", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 16 },
  addButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  modalContainer: { flex: 1, padding: 20, justifyContent: "center" },
  input: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5 },
  cancelButton: { backgroundColor: "red", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 16 }
});

export default AddAdmin;
