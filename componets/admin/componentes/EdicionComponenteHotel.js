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
import { SafeAreaView } from 'react-native-safe-area-context';
import {colors} from '../../../styles/colors'
import CargandoOverlay from '../../CargandoOverlay';

const ITEMS_POR_PAGINA = 6;

const EdicionComponenteHotel = ({ onCancelForm }) => {
  const {
    cargando,
    paginaActual,
    totalPaginas,
    setPaginaActual,
    obtenerHoteles,
    hoteles
  } = useAdmin();

  const navigation = useNavigation();
  const [navegando, setNavegando] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [hotelesFiltrados, setHotelesFiltrados] = useState([]);

  useFocusEffect(
    useCallback(() => {
      setNavegando(false);
      obtenerHoteles(paginaActual, ITEMS_POR_PAGINA);
    }, [paginaActual])
  );

  useEffect(() => {
    const texto = busqueda.toLowerCase();
    const filtrados = hoteles.filter((h) =>
      h.nombre_hotel?.toLowerCase().includes(texto)
    );
    setHotelesFiltrados(filtrados);
  }, [busqueda, hoteles]);

  const handleNavigate = (id) => {
    if (navegando || !id) return;
    setNavegando(true);
    navigation.navigate('formularioEdicionHoteles', { id });
  };

  const renderHotel = (item, key) => (
    <View style={styles.itemContainer} key={item.id_hotel || key}>
      <TouchableOpacity
        style={styles.hoteles}
        onPress={() => handleNavigate(item.id_hotel)}
        disabled={navegando}
      >
        <View style={styles.containerDescription}>
          <Text style={styles.nombre}>{item.nombre_hotel}</Text>
          <Text style={styles.subtitulo}>Edición</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  if (cargando) return (<SafeAreaView>
    <CargandoOverlay />
  </SafeAreaView>);

  const listaHoteles = busqueda ? hotelesFiltrados : hoteles;

  return (
    
    <View style={styles.containerBoxes}>
      <Text style={styles.titles}>Hoteles</Text>

      <TextInput
        style={styles.input}
        placeholder="🔍 Buscar hotel por nombre"
        placeholderTextColor="#aaa"
        value={busqueda}
        onChangeText={setBusqueda}
      />

      {navegando ? (
        <ActivityIndicator size="small" color="#fff" style={{ marginBottom: 10 }} />
      ) : hoteles.length === 0 ? (
        <Text style={styles.emptyText}>No hay hoteles registrados.</Text>
      ) : listaHoteles.length === 0 ? (
        <Text style={styles.emptyText}>No se encontraron coincidencias con “{busqueda}”.</Text>
      ) : (
        listaHoteles.map(renderHotel)
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
  hoteles: {
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

export default EdicionComponenteHotel;
