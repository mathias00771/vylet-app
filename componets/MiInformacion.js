import { API_URL } from '@env';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { UserContext } from '../contextos/UserProvider';

export default function MiInformacion({ navigation }) {
  const { usuario } = useContext(UserContext);
  const [foto, setFoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [actualizando, setActualizando] = useState(false);

  const [correo, setCorreo] = useState('');
  const [cedula, setCedula] = useState('');
  const [celular, setCelular] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [pais, setPais] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');

  const cargarDatos = async () => {
    try {
      if (!usuario) return;

      setNombres(usuario.nombres || '');
      setApellidos(usuario.apellidos || '');
      setCedula(usuario.cedula || '');
      setCelular(String(usuario.celular || ''));
      setCorreo(usuario.correo || '');
      setCiudad(usuario.ciudad_use || '');
      setPais(usuario.pais_use || '');

      if (usuario.foto_use) {
         const ft = API_URL.slice(0, -3) + usuario.foto_use.slice(22, 1000) 
        setFoto(ft)
      }
    } catch (error) {
      console.log(error);
      Alert.alert('❌', 'No se pudo cargar la información del usuario');
    }
  };

  useEffect(() => {
    if (usuario) cargarDatos();
  }, [usuario]);

  const actualizarDatos = async () => {
    if (!correo || !celular) {
      Alert.alert('❌', 'Correo y celular son obligatorios');
      return;
    }

    setActualizando(true);
    try {
      const cedula = await AsyncStorage.getItem('identificador');

      const response = await fetch(`${API_URL}/usuarios/actualizar/${cedula}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          celular,
          correo,
          ciudad_use: ciudad,
          pais_use: pais,
        }),
      });

      const resultado = await response.json();
      Alert.alert('✅', resultado.mensaje || 'Datos actualizados');
      setModalVisible(false);
    } catch (error) {
      Alert.alert('❌', 'Error al actualizar los datos');
    } finally {
      setActualizando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.fotoContainer}>
          <Image
            source={foto ? { uri: foto } : require('../assets/vyletlogo.jpg')}
            style={styles.foto}
          />
          <TouchableOpacity
            style={styles.fotoBoton}
            onPress={() => navigation.navigate('Camara')}
            disabled={!usuario}
          >
            <Text style={styles.fotoBotonTexto}>📸 Tomar foto</Text>
          </TouchableOpacity>
        </View>

        {usuario ? (
          <View style={styles.infoBox}>
            <View style={styles.row}>
              <Text style={styles.label}>👤 Nombre:</Text>
              <Text style={styles.value}>{nombres} {apellidos}</Text>
              <TouchableOpacity style={styles.editInline} onPress={() => setModalVisible(true)}>
                <Text style={styles.editTextInline}>✏️</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>📧 Correo:</Text>
            <Text style={styles.value}>{correo || '—'}</Text>

            <Text style={styles.label}>🔐 Cédula:</Text>
            <Text style={styles.value}>{cedula}</Text>

            <Text style={styles.label}>📱 Celular:</Text>
            <Text style={styles.value}>{celular || '—'}</Text>

            <Text style={styles.label}>🏙️ Ciudad:</Text>
            <Text style={styles.value}>{ciudad || '—'}</Text>

            <Text style={styles.label}>🌍 País:</Text>
            <Text style={styles.value}>{pais || '—'}</Text>
          </View>
        ) : (
          <Text style={styles.loading}>Cargando datos...</Text>
        )}

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Información</Text>

              {actualizando && (
                <ActivityIndicator size="small" color="#fff" style={{ marginBottom: 10 }} />
              )}

              <TextInput
                style={styles.input}
                value={celular}
                onChangeText={setCelular}
                placeholder="Celular"
                keyboardType="phone-pad"
                placeholderTextColor="#aaa"
              />

              <TextInput
                style={styles.input}
                value={correo}
                onChangeText={setCorreo}
                placeholder="Correo"
                keyboardType="email-address"
                placeholderTextColor="#aaa"
              />
              <TextInput
                style={styles.input}
                value={ciudad}
                onChangeText={setCiudad}
                placeholder="Ciudad"
                placeholderTextColor="#aaa"
              />
              <TextInput
                style={styles.input}
                value={pais}
                onChangeText={setPais}
                placeholder="País"
                placeholderTextColor="#aaa"
              />

              <TouchableOpacity style={styles.saveButton} onPress={actualizarDatos} disabled={actualizando}>
                <Text style={styles.saveText}>Guardar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)} disabled={actualizando}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a1a2f',
  },
  container: {
    padding: 24,
    alignItems: 'flex-start',
    paddingTop: 0,
  },
  fotoContainer: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  foto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
    marginBottom: 10,
    resizeMode: 'cover',
  },
  fotoBoton: {
    backgroundColor: '#173151',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  fotoBotonTexto: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#ffffff1e',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 30,
  },
  label: {
    color: '#8fa3b8',
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  loading: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  editInline: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#ffffff22',
    borderRadius: 6,
  },
  editTextInline: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#0a1a2f',
    padding: 20,
    borderRadius: 12,
    width: '90%',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#ffffff33',
    color: '#fff',
    fontSize: 16,
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#d62828',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
