import { API_URL } from '@env';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { useAdmin } from '../../../contextos/AdminProvider';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../../contextos/authProvider';

const GridFotos = ({ id, onChange }) => {
  const { ciudades } = useAdmin();
  const [banner, setBanner] = useState(null);
  const [portada, setPortada] = useState(null);

  const handleFotos = () => {
    const ciudadSeleccionada = ciudades.find((c) => c.id_ciudad === id);
    if (ciudadSeleccionada) {
      setBanner(ciudadSeleccionada.baner_ciud)
      setPortada(ciudadSeleccionada.portada_ciud)
    }
  }

  const seleccionarImagenes = async (tipo) => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: tipo === 'otras',
      quality: 1,
    });

    if (!resultado.canceled) {
      if (tipo === 'banner') setBanner(resultado.assets[0]);
      else if (tipo === 'portada') setPortada(resultado.assets[0]);
    }
  };

  const getImageSource = (img) => {
    if (!img) return null;
    if (typeof img === 'string') return { uri: img };
    if (img.uri) return { uri: img.uri };
    return null;
  };

  const solicitarPermisos = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitas permitir acceso a tus fotos para seleccionar imágenes.');
    }
  };
  useEffect(() => {
    solicitarPermisos();
    handleFotos()
  }, []);

  useEffect(() => {
    onChange({ banner, portada });
  }, [banner, portada]);




  return (
    <View style={styles.container}>
      <Text style={styles.titles}>Fotos</Text>

      <View style={styles.containerBoxes}>
        <TouchableOpacity
          style={styles.touchableItemImageTotally}
          onPress={() => seleccionarImagenes('banner')}
        >
          {banner ? (<Image source={getImageSource(banner)} style={styles.banner} />) : (<Text style={{ color: '#fff' }}>Banner</Text>)}
        </TouchableOpacity>

      </View>

      <View style={styles.containerBoxes}>
        <TouchableOpacity
          style={styles.touchableItemImageTotally}
          onPress={() => {
            seleccionarImagenes('portada')
          }}
        >
          {portada ? (<Image source={getImageSource(portada)} style={styles.portada} />) : (<Text style={{ color: '#fff' }}>Portada</Text>)}
        </TouchableOpacity>
      </View>
    </View>
  );
};

function FormularioEdicionCiudad({ onCancelForm }) {
  const { identificadorCi } = useAuth()
  const route = useRoute();
  const { id } = route.params;
  const navigation = useNavigation();


  const { region, buscarDireccion, direccion, setDireccion, setRegion, ciudades, obtenerCiudades } = useAdmin();
  const [ciudad, setCiudad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [ciudadData, setCiudadData] = useState({});
  const [codigoPostal, setCodigoPostal] = useState('');
  const [elevacion, setElevacion] = useState('');
  const [poblacion, setPoblacion] = useState('');
  const [posicionImg, setPosicionImg] = useState('');
  const [pais, setPais] = useState('');
  const [provincia, setProvincia] = useState('');
  const mapRef = useRef(null);
  const [banner1, setBanner1] = useState(null);
  const [portada1, setPortada1] = useState(null);
  const [imagenes, setImagenes] = useState({ banner: null, portada: null });
  const [cargando, setCargando] = useState(true);
  const [regionCiud, setRegionCiud] = useState('');


  const editarCiudad = async () => {
    try {
      const formData = new FormData();

      const ciudadSeleccionada = ciudades.find((c) => c.id_ciudad === id);

      formData.append('nombre_ciud', ciudad);
      formData.append('descripcion_ciud', descripcion);
      formData.append('codigo_postal', codigoPostal);
      formData.append('elevacion_ciud', elevacion);
      formData.append('poblacion_ciud', poblacion);
      formData.append('pocicion_img', posicionImg);
      formData.append('latitud_ciud', region.latitude.toString());
      formData.append('long_ciud', region.longitude.toString());
      formData.append('ci_registro', identificadorCi);
      formData.append('pais', pais || '');
      formData.append('provincia_ciud', provincia || '');
      formData.append('region_ciud', regionCiud || '');

      const { banner, portada, otras } = imagenes;


      // Imágenes

      if (banner?.uri) {
        formData.append('baner_ciud', {
          uri: banner.uri,
          name: 'banner.jpg',
          type: 'image/jpeg',
        });
      }

      if (portada?.uri) {
        formData.append('portada_ciud', {
          uri: portada.uri,
          name: 'portada.jpg',
          type: 'image/jpeg',
        });
      }



      // otras.forEach((img, index) => {
      //   if (img?.uri) {
      //     formData.append(`img${index + 1}_ciud`, {
      //       uri: img.uri,
      //       name: `img${index + 1}.jpg`,
      //       type: 'image/jpeg',
      //     });
      //   }
      // });




      const res = await fetch(`${API_URL}/ciudades/${ciudadSeleccionada.id_ciudad}`, {
        method: 'PUT',
        body: formData,

      });

      const result = await res.json();
      console.log(result.mensaje);
      obtenerCiudades()
      navigation.goBack();
      // Actualizar la lista de ciudades en el contexto
    } catch (error) {
      console.log('Error al guardar ciudad', error);


    }
  };

  const handleInformacion = () => {
    const ciudadSeleccionada = ciudades.find((c) => c.id_ciudad === id);

    

    if (!ciudadSeleccionada && !ciudades[id]) { console.log("No hay id o no hay ciudades por favor verifica"); return }

    setCiudad(ciudadSeleccionada.nombre_ciud);
    setUbicacion(`${ciudadSeleccionada.latitud_ciud}, ${ciudadSeleccionada.long_ciud}`);
    setCiudadData(ciudadSeleccionada);
    setCodigoPostal(ciudadSeleccionada.codigo_postal);
    setElevacion(String(ciudadSeleccionada.elevacion_ciud));
    setPoblacion(String(ciudadSeleccionada.poblacion_ciud));
    setPosicionImg(ciudadSeleccionada.pocicion_img);
    setDescripcion(ciudadSeleccionada.descripcion_ciud)
    setPais(ciudadSeleccionada.pais);
    setRegionCiud(ciudadSeleccionada.region_ciud);
    setProvincia(ciudadSeleccionada.provin_ciud);
    setRegion({
      latitude: parseFloat(ciudadSeleccionada.latitud_ciud),
      longitude: parseFloat(ciudadSeleccionada.long_ciud),
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });


  };

  useEffect(() => {

    // obtenerClimaPorCiudad('Guayaquil');
    setBanner1(imagenes.banner)
    setPortada1(imagenes.portada)
  }, [imagenes])



  useEffect(() => {
    if (!id || !Array.isArray(ciudades) || ciudades.length === 0) return;

    handleInformacion(); // o pasa ciudadSeleccionada como argumento si prefieres

  }, [id, ciudades]);
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView>
        <View style={{ paddingHorizontal: 10 }}>
          <Text style={{ ...styles.titles, fontSize: 18, marginBottom: 30, }}>Formulario para edicion de ciudades</Text>
          {/* <View>
            {cargandoClima ? (
              <ActivityIndicator />
            ) : climaActual ? (
              <Text>Temperatura: {climaActual.temperature}°C</Text>
            ) : (
              <Text>No se pudo obtener el clima</Text>
            )}
          </View> */}
          <TextInput
            style={[styles.input, { height: 50 }]}
            value={ciudad}
            onChangeText={setCiudad}
            placeholder="Nombre de la ciudad"
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={[styles.input, { height: 50 }]}
            value={pais}
            onChangeText={setPais}
            placeholder="Pais"
            placeholderTextColor="#aaa"
          />

          <TextInput
            style={[styles.input, { height: 50 }]}
            value={provincia}
            onChangeText={setProvincia}
            placeholder="Provincia"
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={[styles.input, { height: 50 }]}
            value={regionCiud}
            onChangeText={setRegionCiud}
            placeholder="Region"
            placeholderTextColor="#aaa"
          />

          <TextInput
            style={[styles.input, { height: 50 }]}
            value={codigoPostal}
            onChangeText={setCodigoPostal}
            placeholder="Codigo Postal"
            placeholderTextColor="#aaa"
            multiline
          />
          <TextInput
            style={[styles.input, { height: 50 }]}
            value={elevacion}
            onChangeText={(text) => {
              const soloNumeros = text.replace(/[^0-9]/g, '');
              setElevacion(soloNumeros);
            }}
            placeholder="Elevación"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
          />

          <TextInput
            style={[styles.input, { height: 50 }]}
            value={poblacion}
            onChangeText={(text) => {
              const soloNumeros = text.replace(/[^0-9]/g, '');
              setPoblacion(soloNumeros);
            }}
            placeholder="Población"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Posición Imagen</Text>
            <Picker
              selectedValue={posicionImg}
              onValueChange={(value) => setPosicionImg(value)}
              style={styles.picker}
              dropdownIconColor="#fff"
            >
              <Picker.Item label="Selecciona posición" value="" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
            </Picker>
          </View>
          <TextInput
            style={[styles.input, { height: 100 }]}
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Descripción"
            placeholderTextColor="#aaa"
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />

          <GridFotos id={id} onChange={setImagenes} />

          <Text style={styles.titles}>
            Ubicacion
          </Text>

          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: "center", marginTop: 5 }}>
            <TextInput
              style={{ ...styles.input, width: '85%', }}
              placeholder="Buscar dirección..."
              value={direccion}
              onChangeText={setDireccion}
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity style={{ ...styles.saveButton, width: "13%", borderRadius: "20%" }} onPress={buscarDireccion}>
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
              setCiudadData({ ...ciudadData, latitud_ciudad: latitude, longitud_ciudad: longitude });
              setRegion({ ...region, latitude, longitude });

            }}
          >
            <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
          </MapView>
          <View style={{ flexDirection: 'row', }}>

            <TouchableOpacity
              style={{ ...styles.saveButton, width: "48%", marginRight: "4%" }}
              onPress={editarCiudad}
            >
              <Text style={styles.botonTexto}>Guardar </Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ ...styles.saveButton, width: "48%", marginRight: "4%", backgroundColor: "#e74c3c" }} onPress={onCancelForm}>
              <Text style={styles.saveText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default FormularioEdicionCiudad;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a1a2f',
  },
  scrollContent: {
    padding: 20,
  },
  titles: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    margin: 5,
  },
  pickerContainer: {
    backgroundColor: '#ffffff1e',
    borderRadius: 8,
    marginBottom: 16,
  },
  picker: {
    color: '#fff',
    marginHorizontal: 10,
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
  input: {
    backgroundColor: '#ffffff1e',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 14,

  },
  container: {
    padding: 5,
  },
  label: {
    color: '#d8d8d8ff',
    fontSize: 13,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  banner: {
    width: '100%',
    height: 140,
    borderRadius: 12,

  },
  portada: {
    width: '100%',
    height: 140,
    borderRadius: 12,

  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  item: {
    width: '40%',
    aspectRatio: 1,
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',


  },
  touchableItemImageTotally: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff1e',
    height: 140,
    borderRadius: 12,
  },

  touchableItemImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff1e',
    height: 50,
    borderRadius: 12,
  },
  containerBoxes: {
    marginBottom: 20,

  },

});
