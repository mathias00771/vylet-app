import { API_URL } from '@env';
import React, { useContext, useEffect, useState, createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const HotelContext = createContext();

export const useHotel = () => {
  const context = useContext(HotelContext)
  if (!context) {
    throw new Error("useHotel must be used with in an HotelProvider")
  }
  return context
}

export const HotelProvider = ({ children }) => {
  const [hoteles, setHoteles] = useState([])
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(false)

  const obtenerHoteles = async (pagina = 1, limite = 6, ciudad = null, latitud = null, longitud = null) => {
    try {
      setCargando(true);

      const ciudadParam = ciudad?.trim().toUpperCase();
      const url = ciudadParam
        ? `${API_URL}/hoteles?pagina=${pagina}&limite=${limite}&ciudad=${encodeURIComponent(ciudadParam)}`
        : `${API_URL}/hoteles?pagina=${pagina}&limite=${limite}&latitud=${latitud}&lognitud=${longitud}`;

      const response = await fetch(url);

      if (response.status === 304) {
        console.log('No hay cambios en hoteles (304)');
        return;
      }

      if (!response.ok) {
        console.log('Error HTTP:', response.status);
        return;
      }

      const data = await response.json();

      if (!Array.isArray(data.hoteles)) {
        console.log('Respuesta inesperada:', data);
        setHoteles([]);
        return;
      }

      if (data.hoteles.length === 0) {
        setHoteles([]); 
        return;
      }


      setHoteles(data.hoteles);
    } catch (error) {
      console.error('Error al obtener hoteles en adminProvider:', error);
    } finally {
      setCargando(false);
    }
  };



  return (
    <HotelContext.Provider value={{ hoteles, obtenerHoteles,cargando }}>
      {children}
    </HotelContext.Provider>
  );
};
