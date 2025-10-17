import { API_URL } from '@env';
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../contextos/UserProvider';
import { useAuth } from '../contextos/authProvider';
import { colors } from '../styles/colors';
import { LinearGradient } from 'expo-linear-gradient';


const LoginUsu = () => {
  const { checkUserToken, login } = useAuth()
  const { dataUsuario } = useContext(UserContext);
  const navigation = useNavigation();
  const [identificador, setIdentificador] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Verificar si ya hay sesión activa
  useEffect(() => {
    // const verificarSesion = async () => {
    //   const token = await AsyncStorage.getItem('token');
    //   if (token) {
    //     navigation.reset({
    //       index: 0,
    //       routes: [
    //         {
    //           name: 'Drawer',
    //           params: { screen: 'Inicio' },
    //         },
    //       ],
    //     });

    //   }
    // };
    // verificarSesion();
  }, []);

  const handleLogin = async () => {
    setLoading(true)
    // La funcion del login se encuentra en useAuth en ./contextos/authProvider.js
    const respuestaLogin = await login(identificador, contrasena)

    if (!respuestaLogin) {
      Alert.alert("Algo salio mal", respuestaLogin);
      setLoading(false);
      return
    }

    await dataUsuario()
    navigation.reset({
      index: 0,
      routes: [{ name: 'Inicio' }],
    });
    setLoading(false)
  };

  // ✅ Cargar identificador guardado
  useEffect(() => {
    const cargarIdentificador = async () => {
      const guardado = await AsyncStorage.getItem('identificador');
      if (guardado) setIdentificador(guardado);
    };
    cargarIdentificador();
  }, []);



  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <LinearGradient colors={['#061529ff', '#06254eff']} style={styles.container}>
        <Text style={styles.logo}>Vylet</Text>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Image source={require('../assets/vyletlogo.jpg')} style={styles.icon} />
            <TextInput
              placeholder="Correo, cédula o pasaporte"
              placeholderTextColor="#ccc"
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              value={identificador}
              onChangeText={setIdentificador}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Image source={require('../assets/vyletlogo.jpg')} style={styles.icon} />
            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="#ccc"
              secureTextEntry={!mostrarContrasena}
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              value={contrasena}
              onChangeText={setContrasena}
            />
            <TouchableOpacity onPress={() => setMostrarContrasena(!mostrarContrasena)}>
              <Icon
                name={mostrarContrasena ? 'eye-off' : 'eye'}
                size={22}
                color="#ccc"
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        <View style={styles.links}>
          <TouchableOpacity onPress={() => navigation.navigate('RegistrarUsu')}>
            <Text style={styles.linkText}>Registrar</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.linkText}>/</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>VS 1.0.0</Text>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.contenedorBg,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logo: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 50,
    marginTop: 50,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff1e',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#ccc',
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    height: 50,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  loginButton: {
    backgroundColor: '#000000ff',
    paddingVertical: 12,
    paddingHorizontal: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    width: 100,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 30,
  },
  linkText: {
    color: '#cccccc7a',
    fontSize: 14,
  },
  version: {
    color: '#fff',
    fontSize: 12,
    marginTop: 100,
  },
});

export default LoginUsu;
