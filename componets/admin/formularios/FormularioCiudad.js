import { API_URL } from '@env';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { useAdmin } from '../../../contextos/AdminProvider';
import { useAuth } from '../../../contextos/authProvider';
import { Picker } from '@react-native-picker/picker';

const GridFotos = ({ onChange }) => {
  const [banner, setBanner] = useState(null);
  const [portada, setPortada] = useState(null);
  const [otras, setOtras] = useState([]);

  useEffect(() => {
    const solicitarPermisos = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitas permitir acceso a tus fotos.');
      }
    };
    solicitarPermisos();
  }, []);

  useEffect(() => {
    
    onChange({ banner, portada, otras });
  }, [banner, portada]);

  const seleccionarImagenes = async (tipo) => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: tipo === 'otras',
      quality: 1,
    });

    if (!resultado.canceled) {
      if (tipo === 'banner') setBanner(resultado.assets[0]);
      else if (tipo === 'portada') setPortada(resultado.assets[0]);
      // else if (tipo === 'otras') setOtras(resultado.assets);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titles}>Fotos</Text>

      <View style={styles.containerBoxes}>
        <TouchableOpacity
          style={styles.touchableItemImageTotally}
          onPress={() => seleccionarImagenes('banner')}
        >
          {banner ? (
            <Image source={{ uri: banner.uri }} style={styles.banner} />
          ) : (
            <Text style={{ color: '#fff' }}>Banner</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.containerBoxes}>
        <TouchableOpacity
          style={styles.touchableItemImageTotally}
          onPress={() => seleccionarImagenes('portada')}
        >
          {portada ? (
            <Image source={{ uri: portada.uri }} style={styles.portada} />
          ) : (
            <Text style={{ color: '#fff' }}>Portada</Text>
          )}
        </TouchableOpacity>
      </View>
{/* 
      <View style={styles.containerBoxes}>
        <TouchableOpacity
          style={styles.touchableItemImage}
          onPress={() => seleccionarImagenes('otras')}
        >
          <Text style={{ color: '#fff' }}>Subir más fotos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {otras.map((img, index) => (
          <View key={index} style={styles.item}>
            <Image source={{ uri: img.uri }} style={styles.image} />
          </View>
        ))}
      </View> */}
    </View>
  );
};

function FormularioCiudad({ onCancelForm }) {
  const {identificadorCi} = useAuth();
  const { region, buscarDireccion, direccion, setDireccion, setRegion } = useAdmin();
  const [ciudad, setCiudad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ciudadData, setCiudadData] = useState({});
  const [regionCiud,setRegionCiud]=useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [elevacion, setElevacion] = useState('');
  const [poblacion, setPoblacion] = useState('');
  const [posicionImg, setPosicionImg] = useState('');
  const [imagenes, setImagenes] = useState({ banner: null, portada: null, otras: [] });
  const [provincia,setProvincia]=useState('');
  const [pais,setPais]=useState('');

  const mapRef = useRef(null);

  const guardarCiudad = async () => {
    
    
    try {
      const formData = new FormData();
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
      formData.append('provin_ciud', provincia || '');
      formData.append('region_ciud',regionCiud)

      const { banner, portada, otras } = imagenes;
      if (banner) {
        formData.append('baner_ciud', {
          uri: banner.uri,
          name: 'banner.jpg',
          type: 'image/jpeg',
        });
      }

      if (portada) {
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
     
      const res = await fetch(`${API_URL}/ciudades`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await res.json();
      Alert.alert('✅', result.mensaje);
      onCancelForm(); // cerrar formulario
    } catch (error) {
      console.error(error);
      Alert.alert('❌', 'Error al guardar ciudad');
    }
  };


  return (
    <View style={{ padding: 10 }}>
      <Text style={{ ...styles.titles, fontSize: 18, marginBottom: 30 }}>Formulario para ciudades</Text>

      <TextInput style={styles.input} value={ciudad} onChangeText={setCiudad} placeholder="Nombre de la ciudad" placeholderTextColor="#aaa" />
      <TextInput style={styles.input} value={pais} onChangeText={setPais} placeholder="País" placeholderTextColor="#aaa" />
      <TextInput style={styles.input} value={provincia} onChangeText={setProvincia} placeholder="Provincia" placeholderTextColor="#aaa" />
       <TextInput style={styles.input} value={regionCiud} onChangeText={setRegionCiud} placeholder="Region" placeholderTextColor="#aaa" />
      
      <TextInput style={styles.input} value={codigoPostal} onChangeText={setCodigoPostal} placeholder="Código Postal" placeholderTextColor="#aaa" />
      <TextInput style={styles.input} value={elevacion} onChangeText={setElevacion} placeholder="Elevación" placeholderTextColor="#aaa" keyboardType="numeric"/>
      <TextInput style={styles.input} value={poblacion} onChangeText={setPoblacion} placeholder="Población" placeholderTextColor="#aaa" keyboardType="numeric" />

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Posición Imagen</Text>
        <Picker selectedValue={posicionImg} onValueChange={setPosicionImg} style={styles.picker} dropdownIconColor="#fff">
          <Picker.Item label="Selecciona posición" value="" />
          <Picker.Item label="1" value="1" />
          <Picker.Item label="2" value="2" />
          <Picker.Item label="3" value="3" />
          <Picker.Item label="4" value="4" />
        </Picker>
      </View>

      <TextInput style={[styles.input, { height: 100 }]} value={descripcion} onChangeText={setDescripcion} placeholder="Descripción" placeholderTextColor="#aaa" multiline />

      <GridFotos onChange={setImagenes} />

      <Text style={styles.titles}>Ubicación</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center', marginTop: 5 }}>
        <TextInput style={{ ...styles.input, width: '85%' }} placeholder="Buscar dirección..." value={direccion} onChangeText={setDireccion} placeholderTextColor="#aaa" />
        <TouchableOpacity style={{ ...styles.saveButton, width: '13%', borderRadius: '20%' }} onPress={buscarDireccion}>
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

      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={{ ...styles.saveButton, width: '48%', marginRight: '4%' }}
          onPress={guardarCiudad}
        >
          <Text style={styles.saveText}>Guardar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.saveButton, width: '48%', backgroundColor: '#e74c3c' }}
          onPress={onCancelForm}
        >
          <Text style={styles.saveText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default FormularioCiudad;


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
