import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useAuth } from '../context/AuthContext';

export default function Home() {

  const { authData, logout } = useAuth();

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Home</Text>

      {authData.callID && <Text>Call ID: {authData.callID}</Text>}
      {authData.idusu && <Text>ID Usuário: {authData.idusu}</Text>}
      {authData.jsessionid && <Text>JSession ID: {authData.jsessionid}</Text>}
      {authData.kID && <Text>K ID: {authData.kID}</Text>}

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutBtnText}>Logout</Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  },

  title: {
    fontSize: 20,
    marginBottom: 20
  },

  logoutBtn: {
    backgroundColor: '#6C56F2',
    width: '100%',
    marginTop: 20,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  logoutBtnText: {
    color: '#FFFFFF'
  }
})