import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAdmin } from '../../../contextos/AdminProvider';
import CargandoOverlay from '../../CargandoOverlay';

const ITEMS_POR_PAGINA = 6;

const EdicionComponenteCiudad = ({ onCancelForm }) => {
  const {
    ciudades = [],
    obtenerCiudades,
    cargando,
    paginaActual,
    totalPaginas,
    setPaginaActual,
  } = useAdmin();

  const navigation = useNavigation();
  const [navegando, setNavegando] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtradas, setFiltradas] = useState([]);

  useFocusEffect(
    useCallback(() => {
      setNavegando(false);
      obtenerCiudades(paginaActual, ITEMS_POR_PAGINA);
    }, [paginaActual])
  );

  useEffect(() => {
    const texto = busqueda.toLowerCase();
    const resultado = ciudades.filter((c) =>
      c.nombre_ciud?.toLowerCase().includes(texto)
    );
    setFiltradas(resultado);
  }, [busqueda, ciudades]);

  const handleNavigate = (id) => {
    if (navegando || !id) return;
    setNavegando(true);
    navigation.navigate('formularioEdicionCiudad', { id });
  };

  const renderCiudad = (item, key) => (
    <View style={styles.itemContainer} key={item.id_ciudad || key}>
      <TouchableOpacity
        style={styles.ciudades}
        onPress={() => handleNavigate(item.id_ciudad)}
        disabled={navegando}
      >
        <View style={styles.containerDescription}>
          <Text style={styles.nombre}>{item.nombre_ciud}</Text>
          <Text style={styles.subtitulo}>Edición</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  if (cargando) return <CargandoOverlay />;

  const lista = busqueda ? filtradas : ciudades;

  return (
    <View style={styles.containerBoxes}>
      <Text style={styles.titles}>Ciudades</Text>

      <TextInput
        style={styles.input}
        placeholder="🔍 Buscar por nombre"
        placeholderTextColor="#aaa"
        value={busqueda}
        onChangeText={setBusqueda}
      />

      {navegando ? (
        <ActivityIndicator size="small" color="#fff" style={{ marginBottom: 10 }} />
      ) : ciudades.length === 0 ? (
        <Text style={styles.emptyText}>No hay ciudades registradas.</Text>
      ) : lista.length === 0 ? (
        <Text style={styles.emptyText}>No se encontraron coincidencias con “{busqueda}”.</Text>
      ) : (
        lista.map(renderCiudad)
      )}

      {totalPaginas > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            style={[styles.pageButton, paginaActual === 1 && styles.disabled]}
            onPress={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
            disabled={paginaActual === 1}
          >
            <Text style={styles.pageText}>← Anterior</Text>
          </TouchableOpacity>

          <Text style={styles.pageIndicator}>
            Página {paginaActual} de {totalPaginas}
          </Text>

          <TouchableOpacity
            style={[styles.pageButton, paginaActual === totalPaginas && styles.disabled]}
            onPress={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
            disabled={paginaActual === totalPaginas}
          >
            <Text style={styles.pageText}>Siguiente →</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[styles.cancelButton, navegando && { opacity: 0.5 }]}
        onPress={onCancelForm}
        disabled={navegando}
      >
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  containerBoxes: {
    marginBottom: 20,
    
  },
  input: {
    backgroundColor: '#ffffff1e',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  itemContainer: {
    marginBottom: 10,
  },
  ciudades: {
    width: '100%',
    borderTopLeftRadius: 10,
  },
  containerDescription: {
    backgroundColor: '#173151',
    padding: 10,
    borderRadius: 15,
  },
  nombre: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  subtitulo: {
    color: '#aaaaaa',
    fontSize: 12,
    marginTop: 4,
  },
  emptyText: {
    color: '#aaa',
    marginTop: 10,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  pageButton: {
    padding: 8,
    backgroundColor: '#173151',
    borderRadius: 8,
  },
  pageText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pageIndicator: {
    color: '#ccc',
    fontSize: 14,
  },
  disabled: {
    opacity: 0.4,
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  titles: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default EdicionComponenteCiudad;
