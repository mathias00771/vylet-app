import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../contextos/authProvider';

export default function DetallesTurismo() {
  const {userToken, checkUserToken} = useAuth();
  const navigation = useNavigation();

  const galeria = [
    { id: 'g1', imagen: require('../../../assets/vyletlogo.jpg') },
    { id: 'g2', imagen: require('../../../assets/vyletlogo.jpg') },
    { id: 'g3', imagen: require('../../../assets/vyletlogo.jpg') },
    { id: 'g4', imagen: require('../../../assets/vyletlogo.jpg') },
  ];

  const servicios = [
    {
      id: 's1',
      nombre: 'Restaurante El Mirador',
      distancia: 2,
      imagen: require('../../../assets/vyletlogo.jpg'),
      destino: 'hoteles',
    },
    {
      id: 's2',
      nombre: 'Hotel Quito Imperial',
      distancia: 3,
      imagen: require('../../../assets/vyletlogo.jpg'),
      destino: 'detalleHotel',
    },
    {
      id: 's3',
      nombre: 'Agencia Andes Tours',
      distancia: 0.8,
      imagen: require('../../../assets/vyletlogo.jpg'),
      destino: 'detalleAgencia',
    },
  ];

  useEffect(() => {
    if (!userToken){
      navigation.reset({index: 0, routes: [{ name: 'LoginUsu' }]});
    }
  }, [userToken])

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Imagen principal con título */}
        <View style={styles.promocion}>
          <Image source={require('../../../assets/vyletlogo.jpg')} style={styles.imagenPromocional} />
          <View style={styles.overlayPromocion}>
            <Text style={styles.titulo}>EL PANECILLO</Text>
            <Text style={styles.subtitulo}>Lugar turístico para toda la familia</Text>
          </View>
        </View>

        {/* Carrusel de galería */}
        <FlatList
          data={galeria}
          horizontal
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.cardGaleria}>
              <Image source={item.imagen} style={styles.imagenGaleria} />
            </View>
          )}
        />

        {/* Sección ¿QUÉ OFRECEMOS? con precios */}
        <View style={styles.infoBox}>
          <Text style={styles.seccionTitulo}>¿QUÉ OFRECEMOS?</Text>
          <View style={styles.ofrecemosFila}>
            {/* Columna izquierda */}
            <View style={styles.ofrecemosTexto}>
              <Text style={styles.detalle}>✅ Pet friendly</Text>
              <Text style={styles.detalle}>📵 Sin wifi</Text>
              <Text style={styles.detalle}>🎧 DJ en vivo</Text>
              <Text style={styles.detalle}>📞 0983897277</Text>
              <Text style={styles.detalle}>🅿️ Parqueadero</Text>
            </View>

            {/* Columna derecha */}
            <View style={styles.preciosColumn}>
              <View style={styles.precioCirculo}>
                <Text style={styles.precioTexto}>Adultos</Text>
                <Text style={styles.precioValor}>$5</Text>
              </View>
              <View style={styles.precioCirculo}>
                <Text style={styles.precioTexto}>Niños</Text>
                <Text style={styles.precioValor}>$2.50</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.botonIr}>
            <Text style={styles.botonTexto}>IR</Text>
          </TouchableOpacity>

        </View>

        {/* Servicios cercanos */}
        <Text style={styles.seccionTitulo}>Servicios cercanos</Text>
        <FlatList
          data={servicios}
          horizontal
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.cardServicio}
              onPress={() => navigation.navigate(item.destino)}
            >
              <Image source={item.imagen} style={styles.imagenServicio} />
              <View style={styles.overlay}>
                <Text style={styles.overlayTexto}>{item.nombre}</Text>
                <Text style={styles.overlayTexto}>{item.distancia}KM</Text>
              </View>
            </TouchableOpacity>
          )}
        />
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
    paddingTop: 0,
  },
  promocion: {
    position: 'relative',
    marginBottom: 0,
  },
  imagenPromocional: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  overlayPromocion: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
  cardGaleria: {
    width: 110,
    height: 100,
    borderRadius: 5,
    marginRight: 8,
    overflow: 'hidden',
    marginBottom: 16,
    marginTop: 10,
  },
  imagenGaleria: {
    width: '100%',
    height: '100%',
  },
  seccionTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    marginTop: 12,
  },
  infoBox: {
    backgroundColor: '#173151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  ofrecemosFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ofrecemosTexto: {
    flex: 1,
    paddingRight: 12,
  },
  detalle: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
  },
  preciosColumn: {
    justifyContent: 'space-between',
  },
  precioCirculo: {
    width: 55,
    height: 55,
    borderRadius: 45,
    backgroundColor: '#0077B6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  precioTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
  },
  precioValor: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },

  botonIr: {
    marginTop: 16,
    backgroundColor: '#0077B6',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardServicio: {
    width: 160,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    backgroundColor: '#173151',
  },
  imagenServicio: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  overlayTexto: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
