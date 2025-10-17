import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../contextos/authProvider';

export default function Buses() {
  const {userToken, checkUserToken} = useAuth();

  const [filtroActivo, setFiltroActivo] = useState('TODOS');
  const navigation = useNavigation();

  const filtros = ['TODOS', 60, 200];

  const buses = [
    {
      id: 'b1',
      nombre: 'Coop TAC',
      imagen: require('../../../assets/vyletlogo.jpg'),
      pasajes: '20$ - 40$',
      telefonos: '3454235 - 0983654877',
      distancia: 40,
    },
    {
      id: 'b2',
      nombre: 'Coop TAC',
      imagen: require('../../../assets/vyletlogo.jpg'),
      pasajes: '20$ - 40$',
      telefonos: '3454235 - 0983654877',
      distancia: 60,
    },
    {
      id: 'b3',
      nombre: 'Coop TAC',
      imagen: require('../../../assets/vyletlogo.jpg'),
      pasajes: '20$ - 40$',
      telefonos: '3454235 - 0983654877',
      distancia: 200,
    },
    {
      id: 'b4',
      nombre: 'Coop TAC',
      imagen: require('../../../assets/vyletlogo.jpg'),
      pasajes: '20$ - 40$',
      telefonos: '3454235 - 0983654877',
      distancia: 180,
    },
  ];

  const filtrarBuses = () => {
    return buses.filter(bus => filtroActivo === 'TODOS' || bus.distancia <= filtroActivo);
  };

  useEffect(() => {
    if (!userToken){
      navigation.reset({index: 0, routes: [{ name: 'LoginUsu' }]});
    }
  }, [userToken])

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Filtros de distancia */}
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
                {filtro === 'TODOS' ? 'TODOS' : `OPCIÓN ${index} a ${filtro}KM`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>



        {/* Lista de buses */}
        <View style={styles.busSection}>
          <Text style={styles.seccionTitulo}>Opciones de buses de terminal</Text>
          {filtrarBuses().map(bus => (
            <TouchableOpacity
              key={bus.id}
              style={styles.cardBus}
              onPress={() => navigation.navigate('detalleBus', { data: bus })}
            >
              <View style={styles.infoBus}>
                <Text style={styles.nombreBus}>{bus.nombre}</Text>
                <Text style={styles.pasajes}>Pasaje {bus.pasajes}</Text>
                <Text style={styles.telefonos}>{bus.telefonos}</Text>
              </View>
              <Image source={bus.imagen} style={styles.imagenBus} />
            </TouchableOpacity>
          ))}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a1a2f',
  },
  scroll: {
    padding: 16,
  },
  filtros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  botonFiltro: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#173151',
  },
  filtroActivo: {
    backgroundColor: '#0077B6',
  },
  textoFiltro: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  imagenTerminal: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 24,
  },
  busSection: {
    marginBottom: 32,
  },
  seccionTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
 cardBus: {
  flexDirection: 'row',
  backgroundColor: '#173151',
  borderRadius: 12,
  marginBottom: 16,
  overflow: 'hidden',
  borderBottomWidth: 1,
  borderBottomColor: '#00b4d8',
  alignItems: 'center',
},
infoBus: {
  flex: 1,
  padding: 12,
},
imagenBus: {
  width: 100,
  height: 100,
  borderTopRightRadius: 12,
  borderBottomRightRadius: 12,
},
nombreBus: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#fff',
  marginBottom: 4,
},
pasajes: {
  fontSize: 14,
  color: '#ccc',
  marginBottom: 4,
},
telefonos: {
  fontSize: 13,
  color: '#00b3fada',
},

});
