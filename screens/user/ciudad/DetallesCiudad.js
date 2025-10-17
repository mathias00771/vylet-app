import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../../contextos/authProvider';
import { colors } from '../../../styles/colors';
import { API_URL } from '@env';

import { useAdmin } from '../../../contextos/AdminProvider';
import { useUser } from '../../../contextos/UserProvider'
import CargandoOverlay from '../../../componets/CargandoOverlay'




const servicios = [
  { label: 'Hoteles', icon: '🏨', route: 'hoteles' },
  { label: 'Turismo', icon: '🗺️', route: 'turismo' },
  { label: 'Festividad', icon: '🎊', route: 'fiestas' },
  { label: 'Diversión', icon: '🎭', route: 'diversion' },
  { label: 'Restaurante', icon: '🍽️', route: 'restaurantes' },
  { label: 'Tours', icon: '🚌', route: 'tours' },
];

const DetallesCiudad = () => {  
  const { getLocation, location, cargando, setCargando } = useUser();
  const { climaActual, obtenerClimaPorCiudad } = useAdmin();
  const { userToken } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;
  const [ciudad, setCiudad] = useState(null);
  const [distanciaKm, setDistanciaKm] = useState(null)
  const [latitudCiudad, setLatitudCiudad] = useState(null)
  const [longitudCiudad, setLongitudCiudad] = useState(null)

  const scaleAnim = useRef(new Animated.Value(0)).current;

  const handleIrAMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${ciudad.latitud_ciud},${ciudad.long_ciud}`;
    Linking.openURL(url)
  }



  useEffect(() => {
    // obtenerClimaPorCiudad('Guayaquil');
    if (!userToken) {
      navigation.reset({ index: 0, routes: [{ name: 'LoginUsu' }] });
      return;
    }

    const cargarCiudad = async () => {

      try {
        setCargando(true)
        getLocation()
        const res = await fetch(`${API_URL}/ciudades/${id}?latitud=${location.latitude}&longitud=${location.longitude}`);
        const data = await res.json();
        setDistanciaKm(data.distanciaKm)
        setCiudad(data);
        await obtenerClimaPorCiudad(data.nombre_ciud);
        
        setLatitudCiudad(data.latitud_ciud);
        setLongitudCiudad(data.long_ciud);
        setCargando(false)
      } catch (err) {
        console.error('Error al cargar ciudad:', err);
      } finally {
        setCargando(false);
      }
    };

    
    cargarCiudad();

  }, [userToken, id]);

  

  useEffect(() => {
    if (distanciaKm) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start();
    }
  }, [distanciaKm]);


  if (cargando || !ciudad) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <CargandoOverlay />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerImageContainer}>
          <Image source={{ uri: ciudad.baner_ciud }} style={styles.headerImage} />
        </View>

        <View style={styles.escudoWrapper}>
          <Animated.View style={[ { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity style={styles.distanciaBox} onPress={handleIrAMaps}>
              <Text style={styles.distanciaIcon}>📍</Text>
              <Text style={styles.distanciaTexto}>
                {distanciaKm ? `${distanciaKm} KM` : '...'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.cityTitle}>{ciudad.nombre_ciud}</Text>

          <View style={styles.infoDetails}>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>🌦️ Clima:</Text>
              <Text style={styles.valor}>
                {climaActual?.temperature ? `${climaActual.temperature}°C` : 'N/D'}
              </Text>

            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>🏷️ Código postal:</Text>
              <Text style={styles.valor}>{ciudad.codigo_postal || 'N/D'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>🗻 Elevación:</Text>
              <Text style={styles.valor}>{ciudad.elevacion_ciud ? `${ciudad.elevacion_ciud} msnm` : 'N/D'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>🧑‍🤝‍🧑 Población:</Text>
              <Text style={styles.valor}>{ciudad.poblacion_ciud || 'N/D'}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.busButton}
            onPress={() => navigation.navigate('buses')}
          >
            <Text style={styles.busButtonText}> Bus 🚌</Text>
          </TouchableOpacity>

          <View style={styles.containerTitle}>
            <Text style={styles.titleServices}>Servicios cerca de {ciudad.nombre_ciud}</Text>
          </View>

          <View style={styles.services}>
            {servicios.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.serviceCard}
                onPress={() => {
                  navigation.navigate(item.route, { ciudad: ciudad.nombre_ciud, longitudCiudad: ciudad.long_ciud, latitudCiudad: ciudad.latitud_ciud })
                }}
              >
                <Text style={styles.serviceIcon}>{item.icon}</Text>
                <Text style={styles.serviceText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>    
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a1a2f',
  },
  scrollContent: {},
  headerImageContainer: {
    alignItems: 'center',
  },
  headerImage: {
    width: '100%',
    height: 250,
  },
  escudoWrapper: {
    position: 'absolute',
    top: 10,
    left: '85%',
    zIndex: 10,
    alignItems: 'center',
  },
  escudo: {
    width: 35,
    height: 35,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#fff',
  },
  cityTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff63',
  },
  infoBox: {
    padding: 20,
    backgroundColor: colors.contenedorBg,
    marginTop: -60,
    borderTopEndRadius: 60,
    borderTopLeftRadius: 60,
  },
  infoDetails: {},
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#ccc',
    fontWeight: 'bold',
  },
  valor: {
    fontSize: 14,
    color: '#00b4d8',
  },
  busButton: {
    backgroundColor: '#09203aff',
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 25,
    marginTop: 12,
    alignItems: 'center',
  },
  busButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  containerTitle: {
    marginTop: 20,
  },
  titleServices: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  services: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  serviceCard: {
    width: '32%',
    backgroundColor: '#0f2239',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceIcon: {
    fontSize: 30,
    marginBottom: 6,
  },
  serviceText: {
    color: '#fff',
    fontSize: 10,
  },
  
  escudoWrapper: {
    position: 'absolute',
    top: 14,
    right: 5,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  distanciaBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  distanciaIcon: {
    fontSize: 18,
    color: '#fff',

  },

  distanciaTexto: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  
  
});

export default DetallesCiudad;
