import React, { useLayoutEffect, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../../contextos/authProvider';

export default function DetalleBuses() {
  const { userToken } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const { data } = route.params;

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
  }, [navigation]);

  useEffect(() => {
    if (!userToken) {
      navigation.reset({ index: 0, routes: [{ name: 'LoginUsu' }] });
    }
  }, [userToken]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={data.imagen} style={styles.imagen} resizeMode="cover" />

        <View style={styles.card}>
          <Text style={styles.nombre}>{data.nombre}</Text>
          <Text style={styles.telefonos}>📞 Contacto: {data.telefonos}</Text>
        </View>

        <View style={styles.botones}>
          <TouchableOpacity
            style={styles.boton}
            onPress={() => navigation.navigate('TerminalCarcelen')}
          >
            <Text style={styles.textoBoton}>Volver al terminal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.boton}
            onPress={() => navigation.navigate('QuitoInfoScreen')}
          >
            <Text style={styles.textoBoton}>Ir a Quito</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a1a2f',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  imagen: {
    width: '100%',
    height: 250,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  card: {
    backgroundColor: '#122b45',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  nombre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  pasajes: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 8,
  },
  telefonos: {
    fontSize: 16,
    color: '#ccc',
  },
  botones: {
    marginHorizontal: 16,
    marginTop: 10,
  },
  boton: {
    backgroundColor: '#0077B6',
    paddingVertical: 14,
    borderRadius: 30,
    marginBottom: 12,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
