import { API_URL, API_KEY_GOOGLE } from '@env';
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker, Polyline } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions';



const Pruebas = () => {
  const [origin, setOrigin] = useState({
    latitude: -0.122106,
    longitude: -78.467711,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001
  });
  const [destination, setDestination] = useState({
    latitude: -0.1088157,
    longitude: -78.4597532,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001
  });



  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.container}>
        <MapView style={styles.viewmap} initialRegion={origin}>
          <Marker coordinate={origin} draggable onDragEnd={(dir) => setOrigin(dir.nativeEvent.coordinate)} />
          <Marker coordinate={destination} draggable onDragEnd={(dir) => setDestination(dir.nativeEvent.coordinate) } />
            <MapViewDirections origin={origin} destination={destination} apikey={API_KEY_GOOGLE} />
            
        </MapView>

        <Text style={styles.version}>VS 1.0.0</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a1a2f',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  icon: {
    width: 24,
    height: 24,
    tintColor: '#ccc',
    marginRight: 10,
  },
  version: {
    color: '#fff',
    fontSize: 12,
    marginTop: 100,
  },
  viewmap: {
    width: "100%",
    height: "70%"
  }
});

export default Pruebas;
