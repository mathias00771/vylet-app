import React, { useState, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../contextos/authProvider';

const { width } = Dimensions.get('window');

export default function DetallesFiestas() {
  const {userToken, checkUserToken} = useAuth();
  const navigation = useNavigation();
  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerRef = useRef(null);

  const banners = [
    {
      id: 'b1',
      titulo: '¡Viva Quito!',
      subtitulo: '684 AÑOS DE FUNDACIÓN',
      fondo: require('../../../assets/vyletlogo.jpg'),
    },
    {
      id: 'b2',
      titulo: 'Fiestas de la ciudad',
      subtitulo: 'Tradición, cultura y alegría',
      fondo: require('../../../assets/vyletlogo.jpg'),
    },
    {
      id: 'b3',
      titulo: 'Orgullo Quiteño',
      subtitulo: 'Celebra con tu gente',
      fondo: require('../../../assets/vyletlogo.jpg'),
    },
  ];

  const categorias = [
    { id: '1', nombre: 'Hoteles', icono: '🏨' },
    { id: '2', nombre: 'Turismo', icono: '🗺️' },
    { id: '3', nombre: 'Restaurantes', icono: '🍽️' },
    { id: '4', nombre: 'Diversión', icono: '🎉' },
  ];

  const eventos = [
    {
      id: 'e1',
      titulo: 'Te Deum',
      fecha: '20 de noviembre - 08h00',
      descripcion: 'Acto religioso de agradecimiento',
      lugar: 'Iglesia de Nuestra Señora de la Merced',
    },
    {
      id: 'e2',
      titulo: 'Fiesta Centro',
      fecha: '21 de noviembre - 16h00',
      descripcion: 'Entrega de 2.000 títulos de propiedad con muestra artística de identidad quiteña.',
      lugar: 'Plaza de San Francisco',
    },
    {
      id: 'e3',
      titulo: 'Desfile Cultural',
      fecha: '22 de noviembre - 10h00',
      descripcion: 'Recorrido con comparsas, música y danza tradicional.',
      lugar: 'Av. Amazonas',
    },
    {
      id: 'e4',
      titulo: 'Concierto de Gala',
      fecha: '23 de noviembre - 19h00',
      descripcion: 'Presentación de artistas nacionales e internacionales.',
      lugar: 'Teatro Nacional Sucre',
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
        {/* Carrusel de banners */}
        <View>
          <FlatList
            data={banners} 
            horizontal
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            ref={bannerRef}
            onScroll={e => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / (width - 32)
              );
              setBannerIndex(index);
            }}
            renderItem={({ item }) => (
              <View style={styles.bannerCarrusel}>
                <Image source={item.fondo} style={styles.bannerImagen} />
                <View style={styles.bannerOverlay}>
                  <Text style={styles.bannerTitulo}>{item.titulo}</Text>
                  <Text style={styles.bannerSubtitulo}>{item.subtitulo}</Text>
                </View>
              </View>
            )}
          />

          {/* Indicadores de página */}
          <View style={styles.indicadores}>
            {banners.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.punto,
                  bannerIndex === i && styles.puntoActivo,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Categorías */}
        <View style={styles.categorias}>
          {categorias.map(cat => (
            <TouchableOpacity key={cat.id} style={styles.categoriaCard}>
              <Text style={styles.categoriaIcono}>{cat.icono}</Text>
              <Text style={styles.categoriaTexto}>{cat.nombre}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Calendario de fiestas */}
        <Text style={styles.seccionTitulo}>Calendario de Fiestas de Quito</Text>
        {eventos.map(evento => (
          <View key={evento.id} style={styles.eventoCard}>
            <Text style={styles.eventoTitulo}>{evento.titulo}</Text>
            <Text style={styles.eventoFecha}>{evento.fecha}</Text>
            <Text style={styles.eventoDescripcion}>{evento.descripcion}</Text>
            <Text style={styles.eventoLugar}>📍 {evento.lugar}</Text>
          </View>
        ))}
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
  bannerCarrusel: {
    width: width - 32,
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImagen: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
  },
  bannerTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  bannerSubtitulo: {
    fontSize: 14,
    color: '#ccc',
  },
  indicadores: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  punto: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  puntoActivo: {
    backgroundColor: '#00b4d8',
  },
  categorias: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  categoriaCard: {
    backgroundColor: '#173151',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    width: '23%',
  },
  categoriaIcono: {
    fontSize: 24,
    marginBottom: 4,
    color: '#fff',
  },
  categoriaTexto: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
  seccionTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  eventoCard: {
    backgroundColor: '#173151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  eventoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  eventoFecha: {
    fontSize: 14,
    color: '#00b4d8',
    marginBottom: 4,
  },
  eventoDescripcion: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
  },
  eventoLugar: {
    fontSize: 13,
    color: '#ccc',
  },
});
