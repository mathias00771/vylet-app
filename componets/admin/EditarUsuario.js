import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { API_URL } from '@env';

export default function EditarUsuario({ route, navigation }) {
  const { usuario } = route.params;

  const [correo, setCorreo] = useState('');
  const [celular, setCelular] = useState('');
  const [tipo, setTipo] = useState('');
  const [actualizando, setActualizando] = useState(false);

  useEffect(() => {
    if (usuario) {
      setCorreo(usuario.correo || '');
      setCelular(String(usuario.celular || ''));
      setTipo(usuario.tipo_usuario || '');
    }
  }, [usuario]);

  const actualizarUsuario = async () => {
    if (!correo || !celular || !tipo) {
      Alert.alert('❌', 'Todos los campos son obligatorios');
      return;
    }

    setActualizando(true);
    try {
      const response = await fetch(`${API_URL}/usuarios/actualizar-usuario/${usuario.id_usuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo,
          celular,
          tipo_usuario: tipo,
        }),
      });

      const resultado = await response.json();
      Alert.alert('✅', resultado.mensaje || 'Usuario actualizado');
      navigation.goBack();
    } catch (error) {
      Alert.alert('❌', 'Error al actualizar usuario');
    } finally {
      setActualizando(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Editar Usuario</Text>

      {actualizando && (
        <ActivityIndicator size="small" color="#fff" style={{ marginBottom: 10 }} />
      )}

      <TextInput
        style={styles.input}
        value={correo}
        onChangeText={setCorreo}
        placeholder="Correo"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        editable={!actualizando}
      />

      <TextInput
        style={styles.input}
        value={celular}
        onChangeText={setCelular}
        placeholder="Celular"
        placeholderTextColor="#aaa"
        keyboardType="phone-pad"
        editable={!actualizando}
      />

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Tipo de usuario</Text>
        <Picker
          selectedValue={tipo}
          onValueChange={(value) => setTipo(value)}
          style={styles.picker}
          dropdownIconColor="#fff"
          enabled={!actualizando}
        >
          <Picker.Item label="Admin" value="admin" />
          <Picker.Item label="Moderador" value="moderador" />
          <Picker.Item label="Asociado" value="asociado" />
          <Picker.Item label="Trabajadores" value="trabajadores" />
          <Picker.Item label="Usuario" value="usuario" />
        </Picker>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, actualizando && { opacity: 0.5 }]}
        onPress={actualizarUsuario}
        disabled={actualizando}
      >
        <Text style={styles.saveText}>Guardar Cambios</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
        disabled={actualizando}
      >
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0a1a2f',
    flex: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#ffffff1e',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  pickerContainer: {
    backgroundColor: '#ffffff1e',
    borderRadius: 8,
    marginBottom: 16,
  },
  label: {
    color: '#8fa3b8',
    fontSize: 14,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  picker: {
    color: '#fff',
    marginHorizontal: 10,
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
