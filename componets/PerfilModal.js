import { API_URL } from '@env';
import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  Linking,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../contextos/UserProvider';
import { useAuth } from '../contextos/authProvider';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { InteractionManager } from 'react-native';

const { height } = Dimensions.get('window');

export default function PerfilModal() {
  const { userToken, checkUserToken } = useAuth();
  const { usuario, dataUsuario } = useContext(UserContext);
  const navigation = useNavigation();

  const [imagen, setImagen] = useState(null);
  const [navegando, setNavegando] = useState(false);

  const obtenerFotoPerfil = () => {
    if (usuario?.foto_use) {
      const url = API_URL.slice(0, -3) + usuario.foto_use.slice(22);
      setImagen(url);
    }
  };

  const cerrarSesion = async () => {
    await AsyncStorage.multiRemove([
      'token',
      'identificador',
      'tipo_usuario',
      'nombre_usuario',
    ]);
    await dataUsuario();
    await checkUserToken();
    navigation.navigate('LoginUsu');
  };

  const navegarSeguro = (screen, params = {}) => {
    if (navegando) return;
    setNavegando(true);
    InteractionManager.runAfterInteractions(() => {
      navigation.navigate(screen, params);
    });
  };

  useFocusEffect(
    useCallback(() => {
      setNavegando(false);
    }, [])
  );

  useEffect(() => {
    if (!userToken) {
      navigation.reset({ index: 0, routes: [{ name: 'LoginUsu' }] });
    }
  }, [userToken]);

  useEffect(() => {
    obtenerFotoPerfil();
  }, [usuario]);

  return (
    <SafeAreaView style={styles.overlay} edges={['bottom', 'left', 'right']}>
      <View style={styles.modalContent}>
        <TouchableOpacity style={styles.closeIcon} onPress={() => navigation.goBack()}>
          <Text style={styles.closeIconText}>✕</Text>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.modalTitle}>Panel de Usuario</Text>

          {navegando && (
            <ActivityIndicator size="small" color="#fff" style={{ marginBottom: 10 }} />
          )}

          <View style={styles.profileRow}>
            <Image
              source={imagen ? { uri: imagen } : require('../assets/vyletlogo.jpg')}
              style={styles.profileImage}
            />

            <View style={styles.infoColumn}>
              {usuario ? (
                <View style={styles.infoRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.nombrePrincipal}>{usuario.nombres}</Text>
                    <Text style={styles.value}>{usuario.cedula}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.infoButton}
                    onPress={() => navegarSeguro('MiInformacion')}
                    disabled={navegando}
                  >
                    <Text style={styles.infoButtonText}>Mi perfil 📝</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.value}>Cargando datos...</Text>
              )}
            </View>
          </View>

          <View style={styles.quickActions}>
            {usuario?.tipo_usuario === 'cliente' && (
              <>
                <TouchableOpacity style={styles.actionButton} onPress={() => navegarSeguro('Favoritos')} disabled={navegando}>
                  <Text style={styles.actionText}>⭐ Mis favoritos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => navegarSeguro('Configuracion')} disabled={navegando}>
                  <Text style={styles.actionText}>⚙️ Configuración</Text>
                </TouchableOpacity>
              </>
            )}

            {usuario?.tipo_usuario === 'admin' && (
              <>
                <TouchableOpacity style={styles.actionButton} onPress={() => {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Inicio' }],
                  });
                }} disabled={navegando}>
                  <Text style={styles.actionText}>Inicio</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => navegarSeguro('GestionUsuarios')} disabled={navegando}>
                  <Text style={styles.actionText}>Gestión de usuarios</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => navegarSeguro('PanelAdmin')} disabled={navegando}>
                  <Text style={styles.actionText}>Panel administrativo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => navegarSeguro('PanelAdmin')} disabled={navegando}>
                  <Text style={styles.actionText}>Registrar locales</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=-0.1175119,-78.463616`)}>
                  <Text style={styles.actionText}>Prueba maps</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => navegarSeguro('pruebas')} disabled={navegando}>
                  <Text style={styles.actionText}>Pruebas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => navegarSeguro('Configuracion')} disabled={navegando}>
                  <Text style={styles.actionText}>⚙️ Configuración</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={cerrarSesion}>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    height: height * 0.65,
    backgroundColor: '#0a1a2f',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 10,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  closeIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  closeIconText: {
    fontSize: 30,
    color: '#ff0101b9',
    backgroundColor: '#0a1a2f',
    borderRadius: 30,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#fff',
    marginRight: 16,
  },
  infoColumn: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nombrePrincipal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  value: {
    color: '#afafafff',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoButton: {
    backgroundColor: '#173151',
    padding: 8,
    borderRadius: 8,
    marginLeft: 10,
  },
  infoButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  quickActions: {
    marginBottom: 20,
  },
  actionButton: {
    height: 50,
    backgroundColor: '#173151',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#d62828',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
