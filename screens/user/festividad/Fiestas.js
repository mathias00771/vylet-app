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

export default function Fiestas() {
  const {userToken, checkUserToken} = useAuth();
  const [busqueda, setBusqueda] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('TODOS');
  const navigation = useNavigation();

  const filtros = ['TODOS', 10, 50, 100];

  const festividades = [
    {
      id: 'f1',
      ciudad: 'Quito',
      evento: 'Fiestas de Quito',
      fecha: 'Del 12 al 26 de junio de 2025',
      descripcion: '',
      imagen: require('../../../assets/vyletlogo.jpg'),
      distancia: 5,
    },
    {
      id: 'f2',
      ciudad: 'Ibarra',
      evento: 'Fiestas de Quito',
      descripcion: 'Sumérgete en festividades propias de la ciudad de Quito en honor a su historia.',
      imagen: require('../../../assets/vyletlogo.jpg'),
      distancia: 80,
    },
    {
      id: 'f3',
      ciudad: 'Cuenca',
      evento: 'Fiestas de Quito',
      descripcion: 'Sumérgete en festividades propias de la ciudad de Quito en honor a su historia.',
      imagen: require('../../../assets/vyletlogo.jpg'),
      distancia: 300,
    },
    {
      id: 'f4',
      ciudad: 'Loja',
      evento: 'Fiestas de Quito',
      descripcion: 'Sumérgete en festividades propias de la ciudad de Quito en honor a su historia.',
      imagen: require('../../../assets/vyletlogo.jpg'),
      distancia: 500,
    },
  ];

  const filtrarFestividades = () => {
    return festividades.filter(f => {
      const coincideBusqueda = f.ciudad.toLowerCase().includes(busqueda.toLowerCase());
      const coincideDistancia = filtroActivo === 'TODOS' || f.distancia <= filtroActivo;
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
          placeholder="NOMBRE DE LA CIUDAD"
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

        {/* Lista de festividades */}
        <FlatList
          data={filtrarFestividades()}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('detallesFiestas', { data: item })}
            >
              <Image source={item.imagen} style={styles.imagen} />
              <View style={styles.info}>
                <Text style={styles.ciudad}>{item.ciudad}</Text>
                <Text style={styles.evento}>{item.evento}</Text>
                {item.fecha && <Text style={styles.fecha}>{item.fecha}</Text>}
                {item.descripcion && <Text style={styles.descripcion}>{item.descripcion}</Text>}
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
    marginBottom: 16,
    backgroundColor: '#173151',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagen: {
    width: '100%',
    height: 140,
  },
  info: {
    padding: 12,
  },
  ciudad: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  evento: {
    fontSize: 16,
    color: '#00b4d8',
    marginBottom: 4,
  },
  fecha: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
  },
  descripcion: {
    fontSize: 13,
    color: '#ccc',
  },
});
