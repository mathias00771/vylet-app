import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../../styles/colors';


export default function RedesContacto({ data, setData, onNext, onBack }) {
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Redes sociales</Text>
      <TextInput style={styles.input} value={data.facebook} onChangeText={(text) => setData({ ...data, facebook: text })} placeholder="Facebook" placeholderTextColor="#aaa" />
      <TextInput style={styles.input} value={data.instagram} onChangeText={(text) => setData({ ...data, instagram: text })} placeholder="Instagram" placeholderTextColor="#aaa" />
      <TextInput style={styles.input} value={data.tiktok} onChangeText={(text) => setData({ ...data, tiktok: text })} placeholder="TikTok" placeholderTextColor="#aaa" />
      <TextInput style={styles.input} value={data.paginaWeb} onChangeText={(text) => setData({ ...data, paginaWeb: text })} placeholder="Página web" placeholderTextColor="#aaa" />
      <TextInput style={styles.input} value={data.whatsapp} onChangeText={(text) => setData({ ...data, whatsapp: text })} placeholder="WhatsApp" placeholderTextColor="#aaa" keyboardType="phone-pad" />
      <TextInput style={styles.input} value={data.contacto} onChangeText={(text) => setData({ ...data, contacto: text })} placeholder="Correo o contacto" placeholderTextColor="#aaa" />
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={onBack}><Text style={styles.buttonText}>Anterior</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onNext}><Text style={styles.buttonText}>Siguiente</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  subtitle: { color: '#fff', fontSize: 16, marginBottom: 10 },
  input: { backgroundColor: '#173151', color: '#fff', padding: 10, borderRadius: 10, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  button: { backgroundColor: colors.buttonBg, padding: 10, borderRadius: 10, flex: 1, marginHorizontal: 5 },
  buttonText: { color: '#fff', textAlign: 'center' },
});
