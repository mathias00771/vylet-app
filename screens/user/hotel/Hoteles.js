import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import { colors } from '../../../styles/colors'
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../contextos/authProvider';
import { useHotel } from '../../../contextos/HotelProvider';
import { useUser } from '../../../contextos/UserProvider';
import CargandoOverlay from '../../../componets/CargandoOverlay';

const filtros = ['TODOS', 100, 60, 30];

export default function Hoteles() {
  const route = useRoute();
  const { ciudad, longitudCiudad, latitudCiudad } = route.params || {};
  const { getUbication, getLocation, location, cargando, setLocation, setCargando } = useUser();
  const { obtenerHoteles, hoteles, cargando: cargandoHoteles } = useHotel();
  const { userToken, checkUserToken } = useAuth();
  const navigation = useNavigation();

  const [busqueda, setBusqueda] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('TODOS');
  const [hotelesConUbicacion, setHotelesConUbicacion] = useState([]);
  const [cargandoDoc, setCargandoDoc] = useState(false)
  const { isHoteles, setIsHoteles } = useState(false)



  const renderEstrellas = (valor) => {
    const estrellasLlenas = '★'.repeat(valor);
    const estrellasVacias = '☆'.repeat(6 - valor);
    return estrellasLlenas + estrellasVacias;
  };

  const handleGetLocation = async () => {
    await getLocation();
  }

  const esperarUbicacion = async (maxIntentos = 10, intervalo = 1000) => {
    let intentos = 0;
    while (!location && intentos < maxIntentos) {
      await new Promise((resolve) => setTimeout(resolve, intervalo));
      intentos++;
    }
    return location;
  };

  useEffect(() => {
    const iniciar = async () => {
      if (!userToken) {
        navigation.reset({ index: 0, routes: [{ name: 'LoginUsu' }] });
        return;
      }

      if (!location) {
        await handleGetLocation(); // inicia la petición
        const loc = await esperarUbicacion(); // espera hasta que esté lista
        if (loc) setLocation(loc);
      }
    };

    iniciar();
  }, [userToken]);

  // 1. Si hay ciudad, actualiza la ubicación una sola vez
  useEffect(() => {
    if (ciudad && latitudCiudad && longitudCiudad) {
      setLocation({ latitude: latitudCiudad, longitude: longitudCiudad });
    }
  }, [ciudad, latitudCiudad, longitudCiudad]);

  // 2. Cuando location esté lista, carga hoteles
  useEffect(() => {
    if (!location) return;

    if (ciudad) {
      obtenerHoteles(1, 8, ciudad);
    } else {
      obtenerHoteles(1, 6, null, location.latitude, location.longitude);
    }
  }, [location]);

  useEffect(() => {
    const procesarHoteles = async () => {
      setCargandoDoc(true);

      if (!location) {
        setCargandoDoc(false);
        return;
      }

      if (hoteles.length === 0) {
        setHotelesConUbicacion([]);
        setCargandoDoc(false);
        return;
      }

      try {
        setHotelesConUbicacion(hoteles);
      } catch (error) {
        console.log('Error al procesar hoteles:', error);
      } finally {
        setCargandoDoc(false);
      }
    };

    procesarHoteles();
  }, [hoteles, location]);


  const hotelesFiltrados = useMemo(() => {
    if (!hotelesConUbicacion || hotelesConUbicacion.length === 0) return [];

    return hotelesConUbicacion.filter((hotel) => {
      const coincideBusqueda = hotel.nombre_hotel
        .toLowerCase()
        .includes(busqueda.toLowerCase());

      const coincideDistancia =
        filtroActivo === 'TODOS' ||
        (hotel.distanciaKm !== undefined && hotel.distanciaKm <= filtroActivo);

      return coincideBusqueda && coincideDistancia;
    });
  }, [hotelesConUbicacion, busqueda, filtroActivo]);



  if (cargando || cargandoHoteles || cargandoDoc) return <CargandoOverlay />


  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <View style={styles.container}>

        {cargandoHoteles || cargando || cargandoDoc ? (
          <CargandoOverlay />
        ) : hotelesFiltrados.length > 0 ? (
          <>
            {/* Barra de búsqueda */}
            <TextInput
              style={styles.barraBusqueda}
              placeholder="Nombre hotel"
              placeholderTextColor="#999"
              value={busqueda}
              onChangeText={setBusqueda}
            />

            {/* Filtros por distancia */}
            <View style={styles.filtros}>
              {filtros.map((filtro, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.botonFiltro,
                    filtroActivo === filtro && styles.filtroActivo,
                  ]}
                  onPress={() => setFiltroActivo(filtro)}
                >
                  <Text style={styles.textoFiltro}>
                    {filtro === 'TODOS' ? 'TODOS' : ` ${filtro} KM`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Lista de hoteles */}
            <ScrollView>
              {hotelesFiltrados.map((hotel) => (
                <TouchableOpacity
                  key={hotel.id_hotel}
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate('detalleHotel', {
                      hotel,
                    })
                  }
                >
                  <View style={styles.distanciaTag}>
                    <Text style={styles.distanciaTexto}>
                      {hotel.distanciaKm} KM
                    </Text>
                  </View>

                  <Image
                    source={{ uri: hotel.portada_hotel }}
                    style={styles.imagen}
                  />

                  <View style={styles.info}>
                    <Text style={styles.nombre}>{hotel.nombre_hotel}</Text>
                    <Text style={styles.estrellas}>
                      {renderEstrellas(hotel?.promedio_estrellas || 0)}
                    </Text>
                    <Text style={styles.precios}>Precios {hotel.prec_hotel}</Text>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.direccion}
                    >
                      {hotel.direccion_hotel}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        ) : (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ ...styles.titles, fontSize: 20 }}>
              Lo sentimos
            </Text>
            <Text style={{ ...styles.titles, fontSize: 13, fontWeight: "normal" }}>
              No se encontraron hoteles registrados
            </Text>
          </View>
        )}





      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.contenedorBg,
  },
  container: {
    flex: 1,
    backgroundColor: colors.contenedorBg,
    padding: 16,
  },
  barraBusqueda: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#173151',
  },
  filtros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  botonFiltro: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#173151',
  },
  filtroActivo: {
    backgroundColor: '#0077B6',
  },
  textoFiltro: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#173151',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    position: 'relative',
  },
  distanciaTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#0077B6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  distanciaTexto: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  imagen: {
    width: 120,
    height: 130,
    backgroundColor: '#ccc',
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  estrellas: {
    fontSize: 20,
    color: '#ffd700',
  },
  precios: {
    fontSize: 14,
    color: '#00b4d8',
  },
  direccion: {
    fontSize: 13,
    color: '#ccc',
  },
  titles: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    margin: 5,
  },
});
