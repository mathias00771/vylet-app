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

const lugares = [
  {
    id: '1',
    nombre: 'PANECILLO',
    descripcion: 'Esta toma se encuentra en el centro de Quito y ofrece una vista panorámica de la ciudad',
    distancia: 60,
    imagen: require('../../../assets/vyletlogo.jpg'),
    destino: 'detalleDestino',
  },
  {
    id: '2',
    nombre: 'Basílica del Voto Nacional',
    descripcion: 'Esta toma se encuentra en el centro de Quito y ofrece una vista panorámica de la ciudad',
    distancia: 100,
    imagen: require('../../../assets/vyletlogo.jpg'),
    destino: 'detalleDestino',
  },
  {
    id: '3',
    nombre: 'La Cima de la Libertad',
    descripcion: 'Esta toma se encuentra en el centro de Quito y ofrece una vista panorámica de la ciudad',
    distancia: 30,
    imagen: require('../../../assets/vyletlogo.jpg'),
    destino: 'detalleDestino',
  },
  {
    id: '4',
    nombre: 'Plaza de la Independencia',
    descripcion: 'Esta toma se encuentra en el centro de Quito y ofrece una vista panorámica de la ciudad',
    distancia: 20,
    imagen: require('../../../assets/vyletlogo.jpg'),
    destino: 'detalleDestino',
  },
];

const filtros = ['TODOS', 30, 60, 100];

export default function Turismo() {
  const {userToken, checkUserToken} = useAuth();
  const [busqueda, setBusqueda] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('TODOS');
  const navigation = useNavigation();

  const filtrarLugares = () => {
    return lugares.filter(lugar => {
      const coincideBusqueda = lugar.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideDistancia = filtroActivo === 'TODOS' || lugar.distancia <= filtroActivo;
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
        <TextInput
          style={styles.barraBusqueda}
          placeholder="NOMBRE DEL LUGAR"
          placeholderTextColor="#999"
          value={busqueda}
          onChangeText={setBusqueda}
        />

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
          data={filtrarLugares()}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate(item.destino)}
            >
              <Image source={item.imagen} style={styles.imagen} />
              <View style={styles.info}>
                <Text style={styles.nombre}>{item.nombre}</Text>
                <Text style={styles.descripcion}>{item.descripcion}</Text>
                <Text style={styles.distancia}>{item.distancia}KM</Text>
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
  backgroundColor: '#0a1a2f', // mismo fondo que el container
},
  container: {
    flex: 1,
    backgroundColor: '#0a1a2f', // fondo principal oscuro
    padding: 20,
    paddingBottom: 0,
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
    backgroundColor: '#173151', // fondo del input
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
  },
  imagen: {
    width: 120,
    height: "100%",
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
  descripcion: {
    fontSize: 14,
    color: '#ccc',
  },
  distancia: {
    fontSize: 14,
    color: '#0077B6',
    textAlign: 'right',
    fontWeight: 'bold',
  },
});

