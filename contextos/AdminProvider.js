import React, {
  useState,
  useRef,
  useContext,
  createContext,
  useEffect,
} from 'react';
import { API_URL, API_KEY_GOOGLE } from '@env';

export const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [direccion, setDireccion] = useState('');
  const [region, setRegion] = useState({
    latitude: -0.22985,
    longitude: -78.52495,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [ciudades, setCiudades] = useState([]);
  const [diversiones, setDiversiones] = useState([])
  const [restaurantes, setRestaurantes] = useState([])
  const [hoteles, setHoteles] = useState([])
  const [cargando, setCargando] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [climaActual, setClimaActual] = useState(null);



  const mapRef = useRef(null);

  const obtenerRestaurantes = async (pagina = 1, limite = 6) => {
    setCargando(true);
    try {
      const response = await fetch(`${API_URL}/restaurantes?pagina=${pagina}&limite=${limite}`);

      if (response.status === 304) {
        console.log('No hay cambios en ciudades (304)');
        return;
      }

      if (!response.ok) {
        console.log('Error HTTP:', response.status);
        return;
      }
      const data = await response.json();

      if (!Array.isArray(data.restaurantes)) {
        console.log('Respuesta inesperada:', data);
        return;
      }

      setRestaurantes(data.restaurantes);
      setPaginaActual(data.pagina);
      setTotalPaginas(data.totalPaginas);
      setCargando(false);
    } catch (error) {
      console.error('Error al obtener diversiones en adminProvider:', error);
    } finally {
      setCargando(false);
    }
  }

  const obtenerDiversion = async (pagina = 1, limite = 6) => {
    setCargando(true);
    try {
      const response = await fetch(`${API_URL}/diversion?pagina=${pagina}&limite=${limite}`);

      if (response.status === 304) {
        console.log('No hay cambios en ciudades (304)');
        return;
      }

      if (!response.ok) {
        console.log('Error HTTP:', response.status);
        return;
      }
      const data = await response.json();

      if (!Array.isArray(data.diversiones)) {
        console.log('Respuesta inesperada:', data);
        return;
      }

      setDiversiones(data.diversiones);
      setPaginaActual(data.pagina);
      setTotalPaginas(data.totalPaginas);
      setCargando(false);
    } catch (error) {
      console.error('Error al obtener diversiones en adminProvider:', error);
    } finally {
      setCargando(false);
    }
  }

  const obtenerHoteles = async (pagina = 1, limite = 6) => {
    setCargando(true);
    try {
      const response = await fetch(`${API_URL}/hoteles?pagina=${pagina}&limite=${limite}`);

      if (response.status === 304) {
        console.log('No hay cambios en ciudades (304)');
        return;
      }

      if (!response.ok) {
        console.log('Error HTTP:', response.status);
        return;
      }


      const data = await response.json();

      

      if (!Array.isArray(data.hoteles)) {
        console.log('Respuesta inesperada:', data);
        return;
      }

      setHoteles(data.hoteles);
      setPaginaActual(data.pagina);
      setTotalPaginas(data.totalPaginas);
      setCargando(false);
    } catch (error) {
      console.error('Error al obtener hoteles en adminProvider:', error);
    } finally {
      setCargando(false);
    }
  }

  const obtenerCiudades = async (pagina = 1, limite = 8) => {
    setCargando(true);
    try {
      const response = await fetch(`${API_URL}/ciudades?pagina=${pagina}&limite=${limite}`);

      if (response.status === 304) {
        console.log('No hay cambios en ciudades (304)');
        return;
      }

      if (!response.ok) {
        console.log('Error HTTP:', response.status);
        return;
      }


      const data = await response.json();

      if (!Array.isArray(data.ciudades)) {
        console.log('Respuesta inesperada:', data);
        return;
      }

      setCiudades(data.ciudades);
      setPaginaActual(data.pagina);
      setTotalPaginas(data.totalPaginas);
      setCargando(false);
    } catch (error) {
      console.error('Error al obtener ciudades:', error);
    } finally {
      setCargando(false);
    }
  };


  const buscarDireccion = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          direccion
        )}&key=${API_KEY_GOOGLE}`
      );
      const data = await response.json();

      if (data.status === 'OK') {
        const location = data.results[0].geometry.location;
        const nuevaRegion = {
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };
        setRegion(nuevaRegion);
        mapRef.current?.animateToRegion(nuevaRegion, 1000);
      } else {
        alert('No se encontró la dirección');
      }
    } catch (error) {
      console.error('Error al buscar dirección:', error)

    }
  };

  const obtenerClimaPorCiudad = async (nombreCiudad) => {
    setCargando(true)
    try {
      const response = await fetch(
        `https://www.meteosource.com/api/v1/free/point?place_id=${encodeURIComponent(nombreCiudad)}&sections=all&timezone=UTC&language=en&units=metric&key=nfch3ka4xajgicfbjfylhcr2r292si9s6rzybg7o`
        // https://www.meteosource.com/api/v1/free/point?place_id=london&sections=all&timezone=UTC&language=en&units=metric&key=YOUR-API-KEY

      );

      if (!response.ok) {
        console.log('Error al obtener clima:', response.status);
        setClimaActual(null);
        return;
      }

      const data = await response.json();
      setClimaActual(data.current);
    } catch (error) {
      console.error('Error al obtener clima por ciudad:', error);
      setClimaActual(null);
    } finally {
      setCargando(false);
    }
  };


  useEffect(() => {
    obtenerCiudades(); // ✅ ahora sí se llama al cargar
  }, []);

  return (
    <AdminContext.Provider
      value={{
        region,
        buscarDireccion,
        direccion,
        setDireccion,
        setRegion,
        ciudades,
        obtenerCiudades,
        cargando,
        setCargando,
        paginaActual,
        totalPaginas,
        setPaginaActual,
        mapRef,
        climaActual,
        obtenerClimaPorCiudad,
        obtenerDiversion,
        diversiones,
        obtenerHoteles,
        hoteles,
        obtenerRestaurantes,
        restaurantes
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
