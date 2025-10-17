import { API_URL } from '@env';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Animated,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../contextos/authProvider';
import { useUser } from '../../../contextos/UserProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../styles/colors';


const { width } = Dimensions.get('window');

const ICONOS_SERVICIOS = {
  "wi-fi": "wifi",
  "parqueadero": "car",
  "restaurante": "silverware-fork-knife",
  "zona infantil": "baby-face-outline",
  "acepta mascotas": "dog",
  "piscina": "pool",
  "aire acondicionado": "air-conditioner",
  "desayuno incluido": "coffee",
  "gym": "dumbbell",
};

export default function DetalleHotel({ route }) {
  const { hotel } = route.params;
  const { location } = useUser();
  const { userToken } = useAuth();
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const [imagenExpandida, setImagenExpandida] = useState(null);
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    if (!userToken) {
      navigation.reset({ index: 0, routes: [{ name: 'LoginUsu' }] });
    }

    if (hotel?.distanciaKm) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start();
    }

    obtenerComentarios();
  }, [userToken]);

  const obtenerComentarios = async () => {
    try {
      const response = await fetch(`${API_URL}/comentarios/${hotel.id_hotel}`);
      const data = await response.json();
      if (response.ok) {
        setComentarios(data);
      } else {
        console.warn('Error al obtener comentarios:', data.mensaje);
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  const handleIrAMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${hotel.lati_hotel},${hotel.long_hotel}`;
    Linking.openURL(url);
  };

  const renderEstrellas = (valor) => {
    const estrellasLlenas = '★'.repeat(valor);
    const estrellasVacias = '☆'.repeat(6 - valor);
    return estrellasLlenas + estrellasVacias;
  };

  const imagenesHotel = [
    hotel.img1_hot,
    hotel.img2_hot,
    hotel.img3_hot,
    hotel.img4_hot,
    hotel.img5_hot,
  ].filter(Boolean);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.promocion}>
          <Image source={{ uri: hotel?.baner_hotel }} style={styles.imagenPrincipal} />
          <View style={styles.botonesBanner}>
            <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
              <TouchableOpacity style={styles.distanciaBox} onPress={handleIrAMaps}>
                <Text style={styles.distanciaIcon}>📍</Text>
                <Text style={styles.distanciaTexto}>
                  {hotel?.distanciaKm ? `${hotel?.distanciaKm} KM` : '...'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          <View style={styles.infoBox}>
            <View style={styles.hotelHeader}>
              <Text style={styles.nombreHotel}>{hotel?.nombre_hotel}</Text>
              <MaterialCommunityIcons name="heart" size={24} color="#ff4d6d" />
            </View>

            <View style={styles.direccionPrecioFila}>
              <Text style={styles.direccionHotel}>📍 {hotel?.direccion_hotel}</Text>
              <Text style={styles.precioHotel}>{hotel?.prec_hotel} $</Text>
            </View>

            <Text style={styles.estrellasHotel}>
              {renderEstrellas(hotel?.promedio_estrellas || 0)}
            </Text>

            <Text style={styles.tituloDescripcion}>Descripción</Text>
            <Text style={styles.descripcionHotel}>{hotel?.comen_hotel}</Text>

            <Text style={styles.tituloDescripcion}>Servicios</Text>
            <View>
              {(() => {
                const servicios = Array.isArray(hotel.servicios_hotel)
                  ? hotel.servicios_hotel
                  : JSON.parse(hotel.servicios_hotel || '[]');

                const serviciosValidos = servicios
                  .map(s => s?.trim().toLowerCase())
                  .filter(s => ICONOS_SERVICIOS[s]);

                if (serviciosValidos.length === 0) {
                  return <Text style={styles.detalle}>Este hotel no tiene servicios registrados.</Text>;
                }

                return (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 0 }}
                  >
                    {serviciosValidos.map((nombre, index) => {
                      const icono = ICONOS_SERVICIOS[nombre];
                      return (
                        <View key={index} style={styles.servicioBox}>
                          <MaterialCommunityIcons
                            name={icono}
                            size={20}
                            color="#3068b1ff"
                          />
                          <Text style={styles.servicioTexto}>{nombre}</Text>
                        </View>
                      );
                    })}
                  </ScrollView>
                );
              })()}
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Galería del Hotel</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.fiestasScroll}
              >
                {imagenesHotel.map((url, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.fiestasCard}
                    onPress={() => setImagenExpandida(url)}
                  >
                    <Image source={{ uri: url }} style={styles.fiestasImage} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <Text style={styles.tituloDescripcion}>Contactos / Redes sociales </Text>
            <View style={styles.contactosGrid}>
              {[
                {
                  label: 'Celular',
                  icon: 'phone',
                  value: hotel?.celu_hotel,
                  color: '#00b4d8',
                  action: `tel:${hotel?.celu_hotel}`,
                },
                {
                  label: 'Email',
                  icon: 'email',
                  value: hotel?.correo_hotel,
                  color: '#0077b6',
                  action: `mailto:${hotel?.correo_hotel}`,
                },
                {
                  label: 'Web',
                  icon: 'web',
                  value: hotel?.pagina_hotel,
                  color: '#023e8a',
                  action: hotel?.pagina_hotel?.startsWith('http') ? hotel.web_hotel : `https://${hotel?.pagina_hotel}`,
                },
                {
                  label: 'Facebook',
                  icon: 'facebook',
                  value: hotel?.face_hotel,
                  color: '#1877F2',
                  action: `instagram://user?username=${hotel?.face_hotel}`,
                },
                {
                  label: 'Instagram',
                  icon: 'instagram',
                  value: '${hotel?.inta_hotel}',
                  color: '#E1306C',
                  action: `instagram://user?username=${hotel?.inta_hotel}`,

                },

                {
                  label: 'WhatsApp',
                  icon: 'whatsapp',
                  value: hotel?.celu_hotel,
                  color: '#25D366',
                  action: `https://wa.me/${hotel?.contacto_hotel}`,
                },
                {
                  label: 'TikTok',
                  icon: 'tiktok',
                  value: `@${hotel?.tiktok_usuario}`,
                  color: '#000000',
                  action: `tiktok://user?username=${hotel?.tiktok_usuario}`,
                
                },
              {
                label: 'Comentarios',
              icon: 'comment-text',
              value: hotel?.total_comentarios,
              color: '#f5a623',
              action: null, // No acción para comentarios
                },
              ].map((item, index) => {
                const isClickable = item.action && item.value;
              return (
              <TouchableOpacity
                key={index}
                style={styles.contactoCard}
                activeOpacity={isClickable ? 0.7 : 1}
                onPress={() => isClickable && Linking.openURL(item.action)}
              >
                <MaterialCommunityIcons name={item.icon} size={26} color={item.color} />
                <Text style={[styles.contactoCardLabel, { color: item.color }]}>{item.label}</Text>

              </TouchableOpacity>
              );
              })}
            </View>

            <Text style={styles.titles}>Comentarios:</Text>
            {comentarios.length === 0 ? (
              <Text style={styles.detalle}>No hay comentarios aún.</Text>
            ) : (
              comentarios.map((c, index) => (
                <View key={index} style={styles.comentarioBox}>
                  <Text style={styles.comentarioUsuario}>{c.usuario_rating}</Text>
                  <Text style={styles.comentarioEstrellas}>⭐ {c.puntuacion}</Text>
                  <Text style={styles.comentarioTexto}>{c.comentario}</Text>
                  <Text style={styles.comentarioFecha}>{new Date(c.fecha_rating).toLocaleDateString()}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {imagenExpandida && (
        <View style={styles.overlayExpandida}>
          <TouchableOpacity style={styles.cerrarExpandida} onPress={() => setImagenExpandida(null)}>
            <MaterialCommunityIcons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <Image source={{ uri: imagenExpandida }} style={styles.imagenExpandida} />
        </View>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  // 🧱 Contenedor principal
  safeArea: {
    flex: 1,
    backgroundColor: colors.contenedorBg,
  },
  scroll: {
    flexGrow: 1,
  },

  // 🖼️ Banner principal
  promocion: {
    position: 'relative',
  },
  imagenPrincipal: {
    width: '100%',
    height: 250,
  },
  botonesBanner: {
    position: 'absolute',
    top: 14,
    right: 5,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  distanciaBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanciaIcon: {
    fontSize: 18,
    color: '#fff',
  },
  distanciaTexto: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },

  // 📦 Caja de información
  infoBox: {
    marginTop: -25,
    backgroundColor: colors.contenedorBg,
    borderRadius: 12,
    borderTopEndRadius: 40,
    borderTopLeftRadius: 40,
    padding: 23,
    elevation: 6,
    zIndex: 10,
    width: '100%',
    height: '100%',
  },

  // 🏨 Encabezado del hotel
  hotelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  nombreHotel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
    flexShrink: 1,
  },

  direccionPrecioFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  direccionHotel: {
    fontSize: 13,
    color: '#ccc',
    flex: 1,
  },
  precioHotel: {
    fontSize: 16,
    color: '#00b4d8',
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 40,
  },

  estrellasHotel: {
    fontSize: 22,
    color: '#ffee00',
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: -10,
  },

  // 📝 Descripción
  tituloDescripcion: {
    color: "#ddd",
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 10,
    marginBottom: 6,
  },
  descripcionHotel: {
    fontSize: 15,
    color: '#ddd',
    lineHeight: 20,
    marginBottom: 10,
  },

  // 🛎️ Servicios
  titles: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 6,
  },
  servicioBox: {
    width: width * 0.3,
    backgroundColor: '#ffffffec',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    elevation: 1,
    flexDirection: 'row',
    gap: 5,
    padding: 6,
  },
  servicioTexto: {
    fontSize: 9,
    textAlign: 'center',
    color: '#061529ff',
    flexShrink: 1,
  },

  // 🖼️ Galería
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  fiestasScroll: {
    paddingHorizontal: 10,
  },
  fiestasCard: {
    width: 160,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    backgroundColor: '#173151',
    marginBottom: 30,
  },
  fiestasImage: {
    width: '100%',
    height: '100%',
  },

  // 🔍 Imagen expandida flotante
  overlayExpandida: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  imagenExpandida: {
    width: '90%',
    height: '60%',
    resizeMode: 'contain',
    borderRadius: 12,
  },
  cerrarExpandida: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1000,
  },

  // 📞 Contactos y redes
  contactosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
  },

  contactoCard: {
    width: '47%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    elevation: 2,
  },

  contactoCardLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 6,
  },

  contactoCardValor: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    marginTop: 4,
  },

  // 💬 Comentarios
  comentarioBox: {
    backgroundColor: '#ffffffc9',
    padding: 12,
    marginVertical: 8,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  comentarioUsuario: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#061529',
    marginBottom: 4,
  },
  comentarioEstrellas: {
    color: '#f5a623',
    fontSize: 14,
    marginBottom: 4,
  },
  comentarioTexto: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  comentarioFecha: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
});
