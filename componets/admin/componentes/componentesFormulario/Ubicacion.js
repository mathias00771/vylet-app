import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAdmin } from '../../../../contextos/AdminProvider';
import { useUser } from '../../../../contextos/UserProvider';

export default function PasoUbicacion({ data, setData, onSubmit, onBack, onCancel }) {
  const mapRef = useRef(null);
  const { direccion, setDireccion, buscarDireccion, region, setRegion } = useAdmin();
  const { getUbication } = useUser();

  useEffect(() => {
    const obtenerUbicacion = async () => {
      const resultado = await getUbication(region?.latitude, region?.longitude);
      if (resultado?.[0]?.formattedAddress) {
        setData({ ...data, address: resultado[0].formattedAddress });
      }
    };
    if (region?.latitude && region?.longitude) {
      obtenerUbicacion();
    }
  }, [region]);

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Ubicación</Text>
      <Text style={styles.address}>{data.address}</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.inputSearch}
          placeholder="Buscar dirección..."
          value={direccion}
          onChangeText={setDireccion}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.searchButton} onPress={buscarDireccion}>
          <Icon name="search" size={15} color="#fff" />
        </TouchableOpacity>
      </View>
      {region?.latitude && region?.longitude && (
        <MapView
          ref={mapRef}
          provider="google"
          style={styles.map}
          region={region}
          onPress={(e) => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            setRegion({ ...region, latitude, longitude });
          }}
        >
          <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
        </MapView>
      )}
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={onBack}>
          <Text style={styles.buttonText}>Anterior</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#2ecc71' }]} onPress={onSubmit}>
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#e74c3c' }]} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  subtitle: { color: '#fff', fontSize: 16, marginBottom: 10 },
  address: { color: '#ccc', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  inputSearch: {
    flex: 1,
    backgroundColor: '#173151',
    color: '#fff',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#0077B6',
    padding: 10,
    borderRadius: 10,
  },
  map: {
    height: 200,
    marginVertical: 20,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#0077B6',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});
