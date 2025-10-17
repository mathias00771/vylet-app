import React, { useState, useRef, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contextos/authProvider';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../styles/colors.js'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Camera, CameraType, useCameraPermissions, CameraView } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';



const { width } = Dimensions.get('window');


export default function PermisosScreen() {
  const navigation = useNavigation();
  const [permissionCamera, requestPermissionCamera] = useCameraPermissions();

  const solicitarTodosLosPermisos = async () => {
    try {
      // 📍 Ubicación
      const ubicacion = await Location.requestForegroundPermissionsAsync();
      if (ubicacion.status !== 'granted') {
        Alert.alert('Permiso de ubicación denegado');
      }

      // 📷 Cámara
      const camara = await requestPermissionCamera();
      if (!camara.granted) {
        Alert.alert('Permiso de cámara denegado');
      }

      // 🖼️ Galería
      //   const galeria = await MediaLibrary.requestPermissionsAsync();
      //   if (galeria.status !== 'granted') {
      //     Alert.alert('Permiso de galería denegado');
      //   }

      // ✅ Si todos fueron concedidos 

      //   &&
      //     galeria.status === 'granted'
      if (
        ubicacion.status === 'granted' &&
        camara.granted
      ) {
        Alert.alert('✅ Todos los permisos fueron otorgados');
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Inicio', //Inicio
            },
          ],
        });
      }

    } catch (error) {
      console.log('Error al solicitar permisos:', error);
      Alert.alert('❌ Error al solicitar permisos');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#061529ff', '#06254eff']}
        style={styles.container}
      >

        <View style={{
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%"
        }}>
          <View>
            <Text style={{
              color: "#ffffff75",
              fontWeight: "bold",
              fontSize: 20
            }}>
              Bienvenido a
            </Text>
            <Text style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: 60
            }}>
              VYLET
            </Text>
          </View>
          <View>
            {/* <Text style={{
              color: "#b9b9b9ce",
              fontSize: 12
            }}>
              Nuestra aplicacion requiere de ciertos permisos de tu celular para funcionar correctamente, otorgalos para que no haya inconvenientes
            </Text> */}


            <Image source={require('../assets/permisosimagen.png')} style={{
              resizeMode: "cover",
              width: 300,
              height: 300
            }} />
            <Text style={{
              color: "#b9b9b9ce",
              fontSize: 12
            }}>
              Otorga permisos a la aplicacion para poder obtener una mejor experiencia
            </Text>
          </View>
          <View style={{

          }}>
            <TouchableOpacity style={{
              backgroundColor: colors.fristButtonBg,
              padding: 15,
              borderRadius: 20,
              flexDirection: "row",
              justifyContent: "space-between"
            }}
              onPress={solicitarTodosLosPermisos}
            >
              <Text style={{
                color: "#fff"
              }}>
                Otorgar permisos
              </Text>
              <MaterialCommunityIcons name="arrow-right" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a1a2f',
  },

  container: {
    flex: 1,

    padding: 30
  },
  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },

});
