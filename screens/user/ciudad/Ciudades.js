import { API_URL } from '@env';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../contextos/authProvider';
import {colors} from '../../../styles/colors'
import CargandoOverlay from '../../../componets/CargandoOverlay'


const regiones = ['COSTA', 'SIERRA', 'ORIENTE', 'GALAPAGOS'];

export default function Ciudades() {
  const { userToken } = useAuth();
  const [regionActiva, setRegionActiva] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [ciudades, setCiudades] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (!userToken) {
      navigation.reset({ index: 0, routes: [{ name: 'LoginUsu' }] });
      return;
    }
    cargarCiudades(1);
  }, [userToken]);

  const cargarCiudades = async (paginaSolicitada) => {
    if (cargando || paginaSolicitada > totalPaginas) return;
    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/ciudades/delante/?pagina=${paginaSolicitada}&limite=100`);
      const data = await res.json();
      setCiudades(prev => paginaSolicitada === 1 ? data.ciudades : [...prev, ...data.ciudades]);
      setPagina(data.pagina);
      setTotalPaginas(data.totalPaginas);
    } catch (err) {
      console.error('Error al cargar ciudades:', err);
    } finally {
      setCargando(false);
    }
  };

  const filtrarCiudades = () => {
    return ciudades.filter(c =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
      (regionActiva ? c.region === regionActiva : true)
    );
  };

  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    if (isBottom) {
      cargarCiudades(pagina + 1);
    }
  };

  if (cargando) return <CargandoOverlay />

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <View style={styles.container}>
        <Text style={styles.titulo}>ESCOGE LA CIUDAD QUE DESEAS CONOCER</Text>

        <TextInput
          style={styles.input}
          placeholder="NOMBRE DE LA CIUDAD"
          placeholderTextColor="#ccc"
          value={busqueda}
          onChangeText={setBusqueda}
        />

        <View style={styles.filtros}>
          {regiones.map(region => (
            <TouchableOpacity
              key={region}
              style={[
                styles.botonFiltro,
                regionActiva === region && styles.botonActivo,
              ]}
              onPress={() => setRegionActiva(region)}
            >
              <Text style={styles.textoFiltro}>{region}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.carrusel}
          contentContainerStyle={{ paddingBottom: 30 }}
          // onScroll={handleScroll}
          scrollEventThrottle={400}
        >
          {filtrarCiudades().map(ciudad => (
            <TouchableOpacity
              key={ciudad.id_ciudad}
              style={styles.card}
              onPress={() => navigation.navigate('Ciudades', { id: ciudad.id_ciudad })}

            >
              <Image
                source={{ uri: ciudad.imagen }}
                style={styles.imagenCiudad}
              />
              <View style={styles.overlay}>
                <Text style={styles.nombreCiudad}>{ciudad.nombre}</Text>
              </View>

            </TouchableOpacity>
          ))}          
        </ScrollView>
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
    padding: 20,
    paddingBottom: 0,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 15,
    color: '#fff',
  },
  filtros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  botonFiltro: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#173151',
  },
  botonActivo: {
    backgroundColor: '#0077b6',
  },
  textoFiltro: {
    color: '#fff',
    fontWeight: 'bold',
  },
  carrusel: {
    marginTop: 10,
  },
  card: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
    height: 150,
    backgroundColor: '#173151',
  },
  imagenCiudad: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
  },
  nombreCiudad: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
