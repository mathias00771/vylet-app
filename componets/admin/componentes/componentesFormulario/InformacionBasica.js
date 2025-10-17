import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { colors } from '../../../../styles/colors';


export default function InformacionBasica({ data, setData, onNext }) {
  const safeText = (text) => (text || '').toUpperCase();
  const safeNumber = (text) => (text || '').replace(/[^0-9.]/g, '');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paso 1 de 5</Text>

      <TextInput
        style={styles.input}
        value={data.nombre ?? ''}
        onChangeText={(text) => setData({ ...data, nombre: safeText(text) })}
        placeholder="Nombre del hotel"
        placeholderTextColor="#aaa"
      />

      <TextInput
        style={styles.input}
        value={data.pais ?? ''}
        onChangeText={(text) => setData({ ...data, pais: safeText(text) })}
        placeholder="País"
        placeholderTextColor="#aaa"
      />

      <TextInput
        style={styles.input}
        value={data.ciudad ?? ''}
        onChangeText={(text) => setData({ ...data, ciudad: safeText(text) })}
        placeholder="Ciudad"
        placeholderTextColor="#aaa"
      />

      <TextInput
        style={styles.input}
        value={data.celular ?? ''}
        onChangeText={(text) => setData({ ...data, celular: text.replace(/[^0-9]/g, '') })}
        placeholder="Celular"
        placeholderTextColor="#aaa"
        keyboardType="phone-pad"
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        value={data.descripcion ?? ''}
        onChangeText={(text) => setData({ ...data, descripcion: text })}
        placeholder="Descripción"
        placeholderTextColor="#aaa"
        multiline
      />

      <View style={styles.row}>
        <TextInput
          style={styles.inputHalf}
          value={data.presioMin ?? ''}
          onChangeText={(text) => setData({ ...data, presioMin: safeNumber(text) })}
          placeholder="Precio mínimo"
          placeholderTextColor="#aaa"
          keyboardType="decimal-pad"
        />
        <TextInput
          style={styles.inputHalf}
          value={data.presioMax ?? ''}
          onChangeText={(text) => setData({ ...data, presioMax: safeNumber(text) })}
          placeholder="Precio máximo"
          placeholderTextColor="#aaa"
          keyboardType="decimal-pad"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={onNext}>
        <Text style={styles.buttonText}>Siguiente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  title: { color: 'rgba(255, 255, 255, 1)', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: {
    backgroundColor: '#173151',
    color: '#fff',
    padding: Platform.OS === 'ios' ? 12 : 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  inputHalf: {
    flex: 1,
    backgroundColor: '#173151',
    color: '#fff',
    padding: 10,
    borderRadius: 10,
    marginRight: 5,
  },
  row: { flexDirection: 'row' },
  button: {
    backgroundColor: colors.buttonBg,
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
