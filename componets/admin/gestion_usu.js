import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { API_URL } from '@env';

export default function GestionUsuarios() {
  const navigation = useNavigation();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [navegando, setNavegando] = useState(false);

  const obtenerUsuarios = async () => {
    try {
      const response = await fetch(`${API_URL}/usuarios/`);
      const data = await response.json();
      setUsuarios(data);
      setUsuariosFiltrados(data);
    } catch (error) {
      Alert.alert('❌', 'Error al obtener usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  useEffect(() => {
    const texto = busqueda.toLowerCase();
    const filtrados = usuarios.filter((u) =>
      u.cedula?.toLowerCase().includes(texto) ||
      u.nombres?.toLowerCase().includes(texto) ||
      u.apellidos?.toLowerCase().includes(texto)
    );
    setUsuariosFiltrados(filtrados);
  }, [busqueda, usuarios]);

  useFocusEffect(
    useCallback(() => {
      setNavegando(false);
    }, [])
  );

  const cambiarTipo = async (id, tipoActual) => {
    const nuevoTipo = tipoActual === 'admin' ? 'cliente' : 'admin';
    try {
      const response = await fetch(`${API_URL}/usuarios/actualizar-tipo/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo_usuario: nuevoTipo }),
      });

      const resultado = await response.json();
      Alert.alert('✅', resultado.mensaje || 'Tipo actualizado');
      obtenerUsuarios(); // refrescar lista
    } catch (error) {
      Alert.alert('❌', 'Error al actualizar tipo');
    }
  };

  const renderItem = ({ item }) => {
    const foto = item.foto_use?.startsWith('http')
      ? item.foto_use
      : `${API_URL}/usuarios/${item.foto_use}`;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          if (navegando) return;
          setNavegando(true);
          navigation.navigate('EditarUsuario', { usuario: item });
        }}
      >
        <Image
  source={{ uri: API_URL.slice(0, -3) + item.foto_use.slice(22, 1000) }}
  style={styles.avatar}
/>
        <View style={styles.info}>
          <Text style={styles.nombre}>{item.nombres} {item.apellidos}</Text>
          <Text style={styles.correo}>{item.cedula}</Text>
          <Text style={styles.tipo}>{item.tipo_usuario}</Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => cambiarTipo(item.id_usuario, item.tipo_usuario)}
        >
          <Text style={styles.editText}>Cambiar tipo</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar por cédula o nombre"
        placeholderTextColor="#aaa"
        value={busqueda}
        onChangeText={setBusqueda}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : usuariosFiltrados.length > 0 ? (
        <FlatList
          data={usuariosFiltrados}
          keyExtractor={(item) => item.id_usuario.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <Text style={styles.emptyText}>No se encontraron usuarios</Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1a2f',
    padding: 20,
  },
  input: {
    backgroundColor: '#ffffff1e',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff1e',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  nombre: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  correo: {
    color: '#ccc',
    fontSize: 14,
  },
  tipo: {
    color: '#8fa3b8',
    fontSize: 13,
    marginTop: 4,
  },
  editButton: {
    backgroundColor: '#173151',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  editText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
});
