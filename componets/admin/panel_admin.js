import { API_URL } from '@env';
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';

import FormularioDiversion from './formularios/hotel/FormularioHoteles'
import FormularioCiudad from './formularios/FormularioCiudad';
import FormularioHoteles from './formularios/hotel/FormularioHoteles';
import FormularioRestaurante from './formularios/FormularioRestaurante'
import EdicionComponenteCiudad from './componentes/EdicionComponenteCiudad';
import EdicionComponenteDiversion from './componentes/EdicionComponenteDiversion';
import EdicionComponenteHotel from './componentes/EdicionComponenteHotel';
import EdicionComponenteRestaurante from './componentes/EdicionComponenteRestaurante';


import { colors } from '../../styles/colors';
import {useAdmin} from '../../contextos/AdminProvider'
import CargandoOverlay from '../CargandoOverlay'

export default function PanelAdmin() {
  const {cargando, setCargando} = useAdmin()
  const [categoria, setCategoria] = useState('');
  const [enAgregar, setEnAgregar] = useState(false);
  const [enEditar, setEnEditar] = useState(false);
  const [mostrarSelector, setMostrarSelector] = useState(true);  

  const handleCancelForm = () => {
    setCategoria('');
    setEnEditar(false);
    setEnAgregar(false);
    setMostrarSelector(true);
    setCargando(false);
  };

  const iniciarAccion = (modo) => {
    if (!categoria) {
      console.log('No hay ninguna categoría seleccionada');
      return;
    }
    setCargando(true);
    setTimeout(() => {
      setMostrarSelector(false);
      setEnAgregar(modo === 'agregar');
      setEnEditar(modo === 'editar');
      setCargando(false);
    }, 300); // Simula carga y evita render inmediato
  };

  
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.pickerContainer}>
          {mostrarSelector && (
            <View style={styles.containerCategoria}>
              <Text style={styles.titles}>Selecciona una categoría</Text>
              <Picker
                selectedValue={categoria}
                onValueChange={(value) => setCategoria(value)}
                style={styles.picker}
                dropdownIconColor="#fff"
              >
                <Picker.Item label="-- Selecciona --" value="" />
                <Picker.Item label="Fiesta" value="fiesta" />
                <Picker.Item label="Ciudad" value="ciudad" />
                <Picker.Item label="Lugar turístico" value="turismo" />
                <Picker.Item label="Hotel" value="hotel" />
                <Picker.Item label="Diversión" value="diversion" />
                <Picker.Item label="Restaurante" value="restaurante" />
              </Picker>

              <ScrollView horizontal contentContainerStyle={styles.scrollViewButtons}>
                <TouchableOpacity
                  style={[styles.buttonTab, cargando && { opacity: 0.5 }]}
                  onPress={() => iniciarAccion('agregar')}
                  disabled={cargando}
                >
                  <Text style={styles.textTab}>Agregar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.buttonTab, cargando && { opacity: 0.5 }]}
                  onPress={() => iniciarAccion('editar')}
                  disabled={cargando}
                >
                  <Text style={styles.textTab}>Editar</Text>
                </TouchableOpacity>
              </ScrollView>

              {cargando && (
                <ActivityIndicator size="small" color="#fff" style={{ marginBottom: 10 }} />
              )}
            </View>
          )}

          {!mostrarSelector && categoria === 'hotel' && enAgregar && (
            <FormularioHoteles onCancelForm={handleCancelForm} />
          )}
          {!mostrarSelector && categoria === 'ciudad' && enAgregar && (
            <FormularioCiudad onCancelForm={handleCancelForm} />
          )}
          {!mostrarSelector && categoria === 'diversion' && enAgregar && (
            <FormularioDiversion onCancelForm={handleCancelForm} />
          )}
          {!mostrarSelector && categoria === 'restaurante' && enAgregar && (
            <FormularioRestaurante onCancelForm={handleCancelForm} />
          )}
          
          {!mostrarSelector && categoria === 'ciudad' && enEditar && (
            <EdicionComponenteCiudad onCancelForm={handleCancelForm} />
          )}
          {!mostrarSelector && categoria === 'diversion' && enEditar && (
            <EdicionComponenteDiversion onCancelForm={handleCancelForm} />
          )}
          {!mostrarSelector && categoria === 'hotel' && enEditar && (
            <EdicionComponenteHotel onCancelForm={handleCancelForm} />
          )}
          {!mostrarSelector && categoria === 'restaurante' && enEditar && (
            <EdicionComponenteRestaurante onCancelForm={handleCancelForm} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.contenedorBg,
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
    borderRadius: 8,
    marginBottom: 16,
  },
  picker: {
    color: '#fff',
    marginHorizontal: 10,
  },
  containerCategoria: {
    padding: 5,
    backgroundColor: colors.contenedorBg,
    borderRadius: 10,
  },
  scrollViewButtons: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    gap: 10,
    marginBottom: 10,
  },
  buttonTab: {
    borderRadius: 10,
    backgroundColor: colors.buttonTabBg,
    width: 135,
    padding: 10,
  },
  textTab: {
    color: '#fff',
    textAlign: 'center',
  },
});
