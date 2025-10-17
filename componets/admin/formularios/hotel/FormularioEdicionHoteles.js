import { API_URL } from '@env';
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../../../../contextos/UserProvider';
import { useAdmin } from '../../../../contextos/AdminProvider';
import { useAuth } from '../../../../contextos/authProvider';
import { SERVICIOS } from '../../../../utils/Servicios';
import CargandoOverlay from '../../../CargandoOverlay';

const FormularioEdicionHotel = ({ onCancelForm }) => {
  const { identificadorCi } = useAuth();
  const { getUbication } = useUser();
  const { region, setRegion, direccion, setDireccion, buscarDireccion } = useAdmin();
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const [hotel, setHotel] = useState(null);
  const [imagenes, setImagenes] = useState({});
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [cargando, setCargando] = useState(true);

  const mapRef = useRef(null);

  

  const seleccionarImagen = async (campo) => {
    try {
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!resultado.canceled) {
        setImagenes((prev) => ({
          ...prev,
          [campo]: resultado.assets[0],
        }));
      }
    } catch (error) {
      Alert.alert('Error al seleccionar imagen');
    }
  };

  const toggleServicio = (servicio) => {
    const nuevos = serviciosSeleccionados.includes(servicio)
      ? serviciosSeleccionados.filter((s) => s !== servicio)
      : [...serviciosSeleccionados, servicio];
    setServiciosSeleccionados(nuevos);
  };

  const actualizarHotel = async () => {
    setCargando(true);
    try {
      const formData = new FormData();
      formData.append('nombre_hotel', hotel.nombre_hotel);
      formData.append('comen_hotel', hotel.comen_hotel);
      formData.append('face_hotel', hotel.face_hotel);
      formData.append('inta_hotel', hotel.inta_hotel);
      formData.append('What_hotel', hotel.What_hotel);
      formData.append('tiktok_hotel', hotel.tiktok_hotel);
      formData.append('pagina_hotel', hotel.pagina_hotel);
      formData.append('contacto_hotel', hotel.contacto_hotel);
      formData.append('lati_hotel', region.latitude.toString());
      formData.append('long_hotel', region.longitude.toString());
      formData.append('ciregistro_hotel', identificadorCi);
      formData.append('pais', hotel.pais);
      formData.append('ciud_hotel', hotel.ciud_hotel);
      formData.append('celu_hotel', hotel.celu_hotel);
      formData.append('prec_hotel', hotel.prec_hotel);
      formData.append('servicios_hotel', JSON.stringify(serviciosSeleccionados));
      formData.append('direccion_hotel', hotel.direccion_hotel);

      for (const campo in imagenes) {
        const img = imagenes[campo];
        if (img?.uri?.startsWith('file://')) {
          formData.append(campo, {
            uri: img.uri,
            name: `${campo}.jpg`,
            type: 'image/jpeg',
          });
        }
      }

      const res = await fetch(`${API_URL}/hoteles/${id}`, {
        method: 'PUT',
        body: formData,
      });

      const result = await res.json();
      Alert.alert('✅', result.mensaje || 'Hotel actualizado correctamente');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('❌', 'Error al actualizar hotel');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const obtenerUbicacion = async () => {
      const a = await getUbication(region.latitude, region.longitude);
      
      if (a?.[0]?.formattedAddress) {
      setHotel((prev) => ({
        ...prev,
        direccion_hotel: a[0].formattedAddress,
      }));
    }
    };
    obtenerUbicacion();
  }, [region]);

  useEffect(() => {
    const cargarHotel = async () => {
      try {
        const res = await fetch(`${API_URL}/hoteles/${id}`);
        const data = await res.json();
        setHotel(data);
        setRegion({
          latitude: parseFloat(data.lati_hotel),
          longitude: parseFloat(data.long_hotel),
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        setServiciosSeleccionados(JSON.parse(data.servicios_hotel || '[]'));
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar el hotel');
      } finally {
        setCargando(false);
      }
    };
    cargarHotel();
  }, [id]);

  if (cargando || !hotel) return <CargandoOverlay />;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView>
        <View style={{ paddingHorizontal: 10 }}>
          <Text style={{ ...styles.titles, fontSize: 18, marginBottom: 30 }}>
            Formulario para edición de hoteles
          </Text>

          <TextInput style={styles.input} value={hotel.nombre_hotel} onChangeText={(v) => setHotel({ ...hotel, nombre_hotel: v })} placeholder="Nombre del hotel" placeholderTextColor="#aaa" />
          <TextInput style={styles.input} value={hotel.pais} onChangeText={(v) => setHotel({ ...hotel, pais: v })} placeholder="País" placeholderTextColor="#aaa" />
          <TextInput style={styles.input} value={hotel.ciud_hotel} onChangeText={(v) => setHotel({ ...hotel, ciud_hotel: v })} placeholder="Ciudad" placeholderTextColor="#aaa" />
          <TextInput style={styles.input} value={hotel.prec_hotel} onChangeText={(v) => setHotel({ ...hotel, prec_hotel: v })} placeholder="Precio" placeholderTextColor="#aaa" />
          <TextInput style={[styles.input, { height: 100 }]} value={hotel.comen_hotel} onChangeText={(v) => setHotel({ ...hotel, comen_hotel: v })} placeholder="Descripción" placeholderTextColor="#aaa" multiline textAlignVertical="top" />

          <Text style={styles.titles}>Redes y contacto</Text>
          <TextInput style={styles.input} value={hotel.face_hotel} onChangeText={(v) => setHotel({ ...hotel, face_hotel: v })} placeholder="Facebook" placeholderTextColor="#aaa" />
          <TextInput style={styles.input} value={hotel.inta_hotel} onChangeText={(v) => setHotel({ ...hotel, inta_hotel: v })} placeholder="Instagram" placeholderTextColor="#aaa" />
          <TextInput style={styles.input} value={hotel.tiktok_hotel} onChangeText={(v) => setHotel({ ...hotel, tiktok_hotel: v })} placeholder="TikTok" placeholderTextColor="#aaa" />
          <TextInput style={styles.input} value={hotel.pagina_hotel} onChangeText={(v) => setHotel({ ...hotel, pagina_hotel: v })} placeholder="Página web" placeholderTextColor="#aaa" />
          <TextInput style={styles.input} value={hotel.What_hotel} onChangeText={(v) => setHotel({ ...hotel, What_hotel: v })} placeholder="WhatsApp" placeholderTextColor="#aaa" />
          <TextInput style={styles.input} value={hotel.contacto_hotel} onChangeText={(v) => setHotel({ ...hotel, contacto_hotel: v })} placeholder="Contacto" placeholderTextColor="#aaa" />
          <TextInput style={styles.input} value={hotel.celu_hotel} onChangeText={(v) => setHotel({ ...hotel, celu_hotel: v })} placeholder="Celular" placeholderTextColor="#aaa" />

          <Text style={styles.titles}>Imágenes</Text>
          <TouchableOpacity onPress={() => seleccionarImagen('baner_hotel')}>
            <Image source={{ uri: imagenes.baner_hotel?.uri || hotel.baner_hotel }} style={styles.imagenGrande} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => seleccionarImagen('portada_hotel')}>
            <Image source={{ uri: imagenes.portada_hotel?.uri || hotel.portada_hotel }} style={styles.imagenGrande} />
          </TouchableOpacity>

          <View style={styles.gridimg}>
            {['img1_hot', 'img2_hot', 'img3_hot', 'img4_hot', 'img5_hot'].map((campo) => (
              <TouchableOpacity key={campo} onPress={() => seleccionarImagen(campo)}>
                <Image source={{ uri: imagenes[campo]?.uri || hotel[campo] }} style={styles.imagenPequena} />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Servicios disponibles</Text>
          <View style={styles.grid}>
            {SERVICIOS.map((servicio) => (
              <TouchableOpacity
                key={servicio}
                style={[
                  styles.checkboxItem,
                  serviciosSeleccionados.includes(servicio) && styles.checkboxItemSelected,
                ]}
                onPress={() => toggleServicio(servicio)}
              >
                <Text style={styles.checkboxText}>{servicio}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.titles}>Ubicación</Text>
          <View>
            <Text style={styles.subtitles}>
              {hotel.direccion_hotel}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: "center", marginTop: 5 }}>
            <TextInput
              style={{ ...styles.input, width: '85%' }}
              placeholder="Buscar dirección..."
              value={direccion}
              onChangeText={setDireccion}
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity style={{ ...styles.saveButton, width: "13%", borderRadius: 20 }} onPress={buscarDireccion}>
              <Icon name="search" size={15} color="#fff" />
            </TouchableOpacity>
          </View>

          <MapView
            ref={mapRef}
            provider="google"
            style={{ height: 200, marginVertical: 20 }}
            region={region}
            onPress={(e) => {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              setRegion({ ...region, latitude, longitude });
            }}
          >
            <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
          </MapView>

          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={{ ...styles.saveButton, width: "48%", marginRight: "4%" }}
              onPress={actualizarHotel}
            >
              <Text style={styles.saveText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.saveButton, width: "48%", backgroundColor: "#e74c3c" }}
              onPress={onCancelForm}
            >
              <Text style={styles.saveText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FormularioEdicionHotel;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a1a2f',
  },
  titles: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
   subtitles: {
    color: "#c9c9c9ff",
    fontSize: 13
  },
  input: {
    backgroundColor: '#ffffff1e',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 14,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagenGrande: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    marginBottom: 10,
    resizeMode: 'cover',

  },
  imagenPequena: {
    width: '50%',
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 10,


  },
  label: {
    color: '#fcf9f9ff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,


  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',


  },
  gridimg: {
    flexDirection: 'row',
    flexWrap: 'wrap',


  },
  checkboxItem: {
    backgroundColor: '#ffffff1e',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  checkboxItemSelected: {
    backgroundColor: '#2ecc71',
  },
  checkboxText: {
    color: '#fff',
    fontSize: 14,
  },
});
