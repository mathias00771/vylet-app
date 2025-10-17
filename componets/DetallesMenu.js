// src/screens/QuitoInfoScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contextos/authProvider';
import { colors as color } from '../styles/colors';

const hoteles = [
  {
    id: 'b1',
    nombre: 'Jugo natural de mango',
    distancia: 10,
    imagen: require('../assets/vyletlogo.jpg'),
    estrellas: 4,
    precios: '$2.50',
    direccion: 'Bebida fria refrescante',
    destino: 'detalleBebida',
  },
  {
    id: 'b2',
    nombre: 'Café americano',
    distancia: 15,
    imagen: require('../assets/vyletlogo.jpg'),
    estrellas: 5,
    precios: '$1.80',
    direccion: 'Bebida caliente energizante',
    destino: 'detalleBebida',
  },
  {
    id: 'b3',
    nombre: 'Té de hierbas',
    distancia: 12,
    imagen: require('../assets/vyletlogo.jpg'),
    estrellas: 4,
    precios: '$2.00',
    direccion: 'Bebida caliente relajante',
    destino: 'detalleBebida',
  },
];

const filtros = ['TODOS', 30, 60, 100];

const DetallesMenu = ({ route }) => {
  const { userToken } = useAuth();
  const navigation = useNavigation();
  const [idRestaurante, setIdRestaurante] = useState(null);
  const [nombreRestaurante, setNombreRestaurante] = useState(null);
  const [menuComidaTipo, setMenuComidaTipo] = useState(null);
  const [tipoOriginal, setTipoOriginal] = useState(null);

  const [busqueda, setBusqueda] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('TODOS');

  const handleInformacion = (params) => {
    if (!params) return;
    setIdRestaurante(params.idRestaurante)
    setNombreRestaurante(params.nombreRestaurante)
    setMenuComidaTipo(params.tipo)
    setTipoOriginal(params.tipoOriginal)
  };

  const filtrarHoteles = () => {
    return hoteles.filter(hotel => {
      const coincideBusqueda = hotel.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideDistancia = filtroActivo === 'TODOS' || hotel.distancia <= filtroActivo;
      return coincideBusqueda && coincideDistancia;
    });
  };

  useEffect(() => {
    if (!userToken) {
      navigation.reset({ index: 0, routes: [{ name: 'LoginUsu' }] });
    }
    handleInformacion(route.params)
  }, [userToken]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>

        <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold', margin: 10 }}>{tipoOriginal}</Text>
        
        {/* <TouchableOpacity style={styles.card}>
          <Image source={require('../assets/cima.jpg')} style={styles.image} />

          <View style={styles.infoContainer}>
            <Text style={styles.nombre}>Mariscos con salsa verde</Text>
            <Text style={styles.descripcionCard}>Aqui va la descripcion del menu</Text>
            <Text style={styles.horario}>🕒 Horario</Text>

            <View style={styles.rating}>
              {[...Array(5)].map((_, i) => (
                <Text key={i} style={{ color: i < 2.2 ? '#FFD700' : '#ccc', fontSize: 18 }}>★</Text>
              ))}
            </View>
          </View>
        </TouchableOpacity> */}

        

         {/* Lista de hoteles */}
        <FlatList
          data={filtrarHoteles()}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate(item.destino)}
            >
              {/* Etiqueta de distancia */}
              

              {/* Imagen del hotel */}
              <Image source={item.imagen} style={styles.imagen} />

              {/* Información del hotel */}
              <View style={styles.info}>
                
                <Text style={styles.nombre}>{item.nombre}</Text>              
                <Text style={styles.nombre}></Text>              
                <Text style={styles.precios}>Precios {item.precios}</Text>
                <Text style={styles.direccion}>{item.direccion}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a1a2f',
  },
    //Estilos de carta con imagen up
  // card: {
  //   margin: 10,
  //   backgroundColor: color.cardColorBg,
  //   borderRadius: 12,
  //   overflow: 'hidden',
  //   shadowColor: '#ffff',
  //   shadowOpacity: 0.3,
  //   shadowRadius: 6,
  //   shadowOffset: { width: 0, height: 12},
    
  // },
  // image: {
  //   width: '100%',
  //   height: 100,
  //   resizeMode: 'cover',
  // },
  // infoContainer: {
  //   padding: 10,
  // },
  // nombre: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   color: '#ffffff',
  // },
  // descripcionCard: {
  //   fontSize: 14,
  //   color: 'rgba(135, 136, 136, 1)',
  //   marginVertical: 4,
  // },
  // horario: {
  //   fontSize: 13,
  //   color: color.valorColor,
  //   marginBottom: 6,
  // },
  // rating: {
  //   flexDirection: 'row',
  // },

  // Estilos de card con imagen a la izquierda

  card: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: color.cardColorBg,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    position: 'relative',
    margin: 5
  },
  distanciaTexto: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  imagen: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
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

export default DetallesMenu;
