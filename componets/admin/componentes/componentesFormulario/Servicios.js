import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SERVICIOS } from '../../../../utils/Servicios';
import { colors } from '../../../../styles/colors';

export default function Servicios({ data, setData, onNext, onBack }) {
  const toggleServicio = (servicio) => {
    const nuevos = data.serviciosSeleccionados.includes(servicio)
      ? data.serviciosSeleccionados.filter((s) => s !== servicio)
      : [...data.serviciosSeleccionados, servicio];
    setData({ ...data, serviciosSeleccionados: nuevos });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Servicios disponibles</Text>
      <View style={styles.grid}>
        {SERVICIOS.map((servicio) => (
          <TouchableOpacity
            key={servicio}
            style={[
              styles.checkboxItem,
              data.serviciosSeleccionados.includes(servicio) && styles.checkboxItemSelected,
            ]}
            onPress={() => toggleServicio(servicio)}
          >
            <Text style={styles.checkboxText}>{servicio}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={onBack}>
          <Text style={styles.buttonText}>Anterior</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onNext}>
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  subtitle: { color: '#fff', fontSize: 16, marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  checkboxItem: {
    backgroundColor: '#173151',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    margin: 5,
  },
  checkboxItemSelected: {
    backgroundColor: '#0077B6',
  },
  checkboxText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  button: { backgroundColor: colors.buttonBg, padding: 10, borderRadius: 10, flex: 1, marginHorizontal: 5 },
  buttonText: { color: '#fff', textAlign: 'center' },
});
