import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../contextos/authProvider';

const restaurantes = [
  {
    id: 'r1',
    nombre: 'Carbon de palo',
    distancia: 20,
    imagen: require('../../../assets/vyletlogo.jpg'),
    estrellas: 5,
    precios: '20-250$',
    direccion: 'Av. La Mariscal y Río Coca',
    destino: 'detallesRestaurantes',
  },
  {
    id: 'r2',
    nombre: 'WYM SPORT',
    distancia: 60,
    imagen: require('../../../assets/vyletlogo.jpg'),
    estrellas: 4,
    precios: '30-180$',
    direccion: 'Av. Amazonas y República',
    destino: 'detallesRestaurantes',
  },
];

const filtros = ['TODOS', 30, 60, 100];

export default function Restaurantes() {
  const {userToken, checkUserToken} = useAuth();
  const [busqueda, setBusqueda] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('TODOS');
  const [contactosValue, setContactosValue] = useState(false);
  const navigation = useNavigation();

  const handleContactosVal = () => {
    setContactosValue(!contactosValue);
  };

  const filtrarRestaurantes = () => {
    return restaurantes.filter(restaurante => {
      const coincideBusqueda = restaurante.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideDistancia = filtroActivo === 'TODOS' || restaurante.distancia <= filtroActivo;
      return coincideBusqueda && coincideDistancia;
    });
  };

  useEffect(() => {
    if (!userToken){
      navigation.reset({index: 0, routes: [{ name: 'LoginUsu' }]});
    }
  }, [userToken])

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <View style={styles.container}>
        {/* Barra de búsqueda */}
        <TextInput
          style={styles.barraBusqueda}
          placeholder="Nombre del restaurante"
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
                {filtro === 'TODOS' ? 'TODOS' : `${filtro}KM`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filtrarRestaurantes()}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate(item.destino)}
            >
              {/* Etiqueta de distancia */}
              <View style={styles.distanciaTag}>
                <Text style={styles.distanciaTexto}>{item.distancia}KM</Text>
              </View>

              <Image source={item.imagen} style={styles.imagen} />

              <View style={styles.info}>
                <Text style={styles.nombre}>{item.nombre}</Text>
                <Text style={styles.estrellas}>{'⭐'.repeat(item.estrellas)}</Text>
                <Text style={styles.precios}>{item.precios}</Text>
                <Text style={styles.direccion}>{item.direccion}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a1a2f',
  },
  container: {
    flex: 1,
    backgroundColor: '#0a1a2f',
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
    height: 120,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  estrellas: {
    fontSize: 14,
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
});
