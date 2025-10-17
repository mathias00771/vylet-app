import { API_URL } from '@env';
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getDistanceInKm} from '../utils/getDistanceInKm';

export const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used with in an UserProvider")
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [usuario, setUsuario] = useState([]);
  const [location, setLocation] = useState(null);
  const [ubication, setUbication] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState(null);
  const [cargando, setCargando] = useState(false)
  const [cargandoLocalizacion, setCargandoLocalizacion] = useState(false)


  const getUbication = async (latitude = null, longitude = null) => {
    try {
      const result = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (result.length > 0) {
        setAddress(result[0]);
        setUbication(result[0]);
        // const distancia = getDistanceInKm(
        //   latitude, longitude, // ubicación actual
        //   -0.1175119, -78.463616,14 // Quito, por ejemplo
        // );
        return [result[0]]
      } else {
        console.log('No se encontró dirección para esas coordenadas');
      }
    } catch (err) {
      console.log('Error al buscar dirección: ' + err.message);
    }
  };

  const getLocation = async () => {
    setCargandoLocalizacion(true)
    try {            
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado');
        setCargandoLocalizacion(false)
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);   
      setCargandoLocalizacion(false)   
      return true
      // await getUbication(loc.coords.latitude, loc.coords.longitude);
    } catch (err) {
      console.log(err);
      setCargandoLocalizacion(false)
      
    }finally{
      setCargandoLocalizacion(false)
      
    }
  };

  const dataUsuario = async () => {
    const cedula = await AsyncStorage.getItem('identificador');
    const token = await AsyncStorage.getItem('token');
    

    try {
      const response = await fetch(`${API_URL}/usuarios/cedula/${cedula}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
      });

      const datos = await response.json();
      
      
      setUsuario(datos[0])
      return "datos actualizados"
    } catch (error) {

      console.log('Error en fetch:', error);
    }
  };

  useEffect(() => {
    // getLocation()
    dataUsuario()
    
  }, [])


  return (
    <UserContext.Provider value={{ usuario, dataUsuario, location, setLocation, ubication, address,getLocation, cargando, setCargando, getUbication, setCargandoLocalizacion, cargandoLocalizacion}}>
      {children}
    </UserContext.Provider>
  );
};
