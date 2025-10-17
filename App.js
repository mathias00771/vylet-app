import React, { useEffect, useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { UserProvider } from "./contextos/UserProvider.js";
import { AuthProvider } from "./contextos/authProvider.js";
import { AdminProvider } from "./contextos/AdminProvider.js";
import { HotelProvider } from "./contextos/HotelProvider.js";

// Screens
import HomeScreem from "./screens/HomeScreem.js";
import RegistrarUsu from "./screens/RegistrarUsu.js";
import LoginUsu from "./screens/loginUsu.js";
import PantallaUno from "./screens/PantallaUno.js";
import Ciudades from "./screens/user/ciudad/DetallesCiudad.js";
import ciudad from "./screens/user/ciudad/Ciudades.js";
import turismo from "./screens/user/turismo/Turismo.js";
import detalleDestino from "./screens/user/turismo/DetallesTurismo.js";
import hoteles from "./screens/user/hotel/Hoteles.js";
import detalleHotel from "./screens/user/hotel/DetallesHotel.js";
import DetallesFiestas from "./screens/user/festividad/DetallesFiestas.js";
import DetallesRestaurantes from "./screens/user/restaurante/DetallesRestaurantes.js"
import Fiestas from "./screens/user/festividad/Fiestas.js";
import buses from "./screens/user/buses/Buses.js";
import detalleBus from "./screens/user/buses/DetallesBuses.js";
import PerfilModal from "./componets/PerfilModal.js";
import MiInformacion from "./componets/MiInformacion.js";
import Camara from './componets/Camara.js';
import GestionUsuarios from './componets/admin/gestion_usu.js';
import EditarUsuario from './componets/admin/EditarUsuario.js';
import PanelAdmin from './componets/admin/panel_admin.js';
import DetallesMenu from './componets/DetallesMenu.js';
import Diversion from './screens/user/divercion/Diversion.js';
import Restaurantes from './screens/user/restaurante/Restaurantes.js';
import Pruebas from './screens/Pruebas.js';

import PermisosScreen from './screens/PermisosScreen.js';

import FormularioEdicionCiudad from './componets/admin/formularios/FormularioEdicionCiudad.js';
import FormularioEdicionDiversion from './componets/admin/formularios/FormularioEdicionDiversion.js';
import FormularioEdicionHoteles from './componets/admin/formularios/hotel/FormularioEdicionHoteles.js';

const Stack = createNativeStackNavigator();

// Encabezado base
const baseHeader = (title) => ({
  title,
  headerStyle: {
    backgroundColor: '#061529ff',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 200,
  },
});

// Protección contra errores de render
function SafeRender({ children }) {
  try {
    return children;
  } catch (error) {
    console.error('Error de render:', error);
    return <Text style={{ color: 'red', padding: 20 }}>Error al cargar componente</Text>;
  }
}

export default function App() {
  const [esPrimeraVez, setEsPrimeraVez] = useState(null);

  useEffect(() => {
    const verificarPrimerInicio = async () => {
      const valor = await AsyncStorage.getItem('esPrimeraVez');
      if (valor === null) {
        await AsyncStorage.setItem('esPrimeraVez', 'false');
        setEsPrimeraVez(true);
      } else {
        setEsPrimeraVez(false);
      }
    };
    verificarPrimerInicio();
  }, []);
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AdminProvider>
          <UserProvider>
            <HotelProvider>
              <NavigationContainer>
                <Stack.Navigator initialRouteName={esPrimeraVez ? 'permisos' : 'HomeScreem'}>
                  <Stack.Screen name="permisos" component={PermisosScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="HomeScreem" component={HomeScreem} options={{ headerShown: false }} />
                  <Stack.Screen name="LoginUsu" component={LoginUsu} options={{ headerShown: false }} />
                  <Stack.Screen name="RegistrarUsu" component={RegistrarUsu} options={{ headerShown: false }} />
                  <Stack.Screen name="PerfilModal" component={PerfilModal} options={{ presentation: 'transparentModal', headerShown: false }} />
                  <Stack.Screen name="Inicio" component={PantallaUno} options={{ headerShown: false }} />
                  <Stack.Screen name="pruebas" component={Pruebas} options={{ headerShown: false }} />
                  {/* ... el resto de tus pantallas */}
                  {/* Pantallas con ícono de perfil */}
                  <Stack.Screen name="restaurantes" component={Restaurantes} options={({ navigation }) => ({
                    ...baseHeader('Restaurantes'),
                    headerRight: () => (
                      <TouchableOpacity onPress={() => navigation.navigate('PerfilModal')} style={{ marginRight: 16 }}>
                        <Icon name="account" size={30} color="#fff" />
                      </TouchableOpacity>
                    ),
                  })} />
                  <Stack.Screen name="diversion" component={Diversion} options={({ navigation }) => ({
                    ...baseHeader('Diversión'),
                    headerRight: () => (
                      <TouchableOpacity onPress={() => navigation.navigate('PerfilModal')} style={{ marginRight: 16 }}>
                        <Icon name="account" size={30} color="#fff" />
                      </TouchableOpacity>
                    ),
                  })} />
                  <Stack.Screen name="detallesMenu" component={DetallesMenu} options={({ navigation }) => ({
                    ...baseHeader('Detalles del menú'),
                    headerRight: () => (
                      <TouchableOpacity onPress={() => navigation.navigate('PerfilModal')} style={{ marginRight: 16 }}>
                        <Icon name="account" size={30} color="#fff" />
                      </TouchableOpacity>
                    ),
                  })} />
                  <Stack.Screen name="GestionUsuarios" component={GestionUsuarios} options={({ navigation }) => ({
                    ...baseHeader('Gestión de usuarios'),
                    headerRight: () => (
                      <TouchableOpacity onPress={() => navigation.navigate('PerfilModal')} style={{ marginRight: 16 }}>
                        <Icon name="account" size={30} color="#fff" />
                      </TouchableOpacity>
                    ),
                  })} />
                  <Stack.Screen name="Ciudades" component={Ciudades} options={({ navigation }) => ({
                    ...baseHeader('Ciudades'),
                    headerRight: () => (
                      <TouchableOpacity onPress={() => navigation.navigate('PerfilModal')} style={{ marginRight: 16 }}>
                        <Icon name="account" size={30} color="#fff" />
                      </TouchableOpacity>
                    ),
                  })} />
                  <Stack.Screen name="ciudad" component={ciudad} options={({ navigation }) => ({
                    ...baseHeader('Ciudad'),
                    headerRight: () => (
                      <TouchableOpacity onPress={() => navigation.navigate('PerfilModal')} style={{ marginRight: 16 }}>
                        <Icon name="account" size={30} color="#fff" />
                      </TouchableOpacity>
                    ),
                  })} />
                  <Stack.Screen name="hoteles" component={hoteles} options={({ navigation }) => ({
                    ...baseHeader('Hoteles'),
                    headerRight: () => (
                      <TouchableOpacity onPress={() => navigation.navigate('PerfilModal')} style={{ marginRight: 16 }}>
                        <Icon name="account" size={30} color="#fff" />
                      </TouchableOpacity>
                    ),
                  })} />
                  <Stack.Screen name="turismo" component={turismo} options={({ navigation }) => ({
                    ...baseHeader('Turismo'),
                    headerRight: () => (
                      <TouchableOpacity onPress={() => navigation.navigate('PerfilModal')} style={{ marginRight: 16 }}>
                        <Icon name="account" size={30} color="#fff" />
                      </TouchableOpacity>
                    ),
                  })} />
                  <Stack.Screen name="detalleDestino" component={detalleDestino} options={({ navigation }) => ({
                    ...baseHeader('Destino'),
                    headerRight: () => (
                      <TouchableOpacity onPress={() => navigation.navigate('PerfilModal')} style={{ marginRight: 16 }}>
                        <Icon name="account" size={30} color="#fff" />
                      </TouchableOpacity>
                    ),
                  })} />
                  <Stack.Screen name="detalleHotel" component={detalleHotel} options={({ navigation }) => ({
                    ...baseHeader('Hotel'),
                    headerRight: () => (
                      <TouchableOpacity onPress={() => navigation.navigate('PerfilModal')} style={{ marginRight: 16 }}>
                        <Icon name="account" size={30} color="#fff" />
                      </TouchableOpacity>
                    ),
                  })} />
                  <Stack.Screen name="detallesFiestas" component={DetallesFiestas} options={({ navigation }) => ({
                    ...baseHeader('Fiesta'),
                    headerRight: () => (
                      <TouchableOpacity onPress={() => navigation.navigate('PerfilModal')} style={{ marginRight: 16 }}>
                        <Icon name="account" size={30} color="#fff" />
                      </TouchableOpacity>
                    ),
                  })} />
                  <Stack.Screen name="detallesRestaurantes" component={DetallesRestaurantes} options={({ navigation }) => ({
                    ...baseHeader('Restaurante'),
                    headerRight: () => (
                      <TouchableOpacity onPress={() => navigation.navigate('PerfilModal')} style={{ marginRight: 16 }}>
                        <Icon name="account" size={30} color="#fff" />
                      </TouchableOpacity>
                    ),
                  })} />
                  <Stack.Screen name="fiestas" component={Fiestas} options={({ navigation }) => ({
                    ...baseHeader('Fiestas'),
                    headerRight: () => (
                      <TouchableOpacity onPress={() => navigation.navigate('PerfilModal')} style={{ marginRight: 16 }}>
                        <Icon name="account" size={30} color="#fff" />
                      </TouchableOpacity>
                    ),
                  })} />
                  <Stack.Screen name="buses" component={buses} options={({ navigation }) => ({
                    ...baseHeader('Buses'),
                    headerRight: () => (
                      <TouchableOpacity onPress={() => navigation.navigate('PerfilModal')} style={{ marginRight: 16 }}>
                        <Icon name="account" size={30} color="#fff" />
                      </TouchableOpacity>
                    ),
                  })} />
                  <Stack.Screen name="detalleBus" component={detalleBus} options={({ navigation }) => ({
                    ...baseHeader('Bus'),
                    headerRight: () => (
                      <TouchableOpacity onPress={() => navigation.navigate('PerfilModal')} style={{ marginRight: 16 }}>
                        <Icon name="account" size={30} color="#fff" />
                      </TouchableOpacity>
                    ),
                  })} />
                  <Stack.Screen name="EditarUsuario" component={EditarUsuario} options={({ navigation }) => ({
                    ...baseHeader('EditarUsuario'),
                    headerRight: () => (
                      <TouchableOpacity onPress={() => navigation.navigate('PerfilModal')} style={{ marginRight: 16 }}>
                        <Icon name="account" size={30} color="#fff" />
                      </TouchableOpacity>
                    ),
                  })} />

                  <Stack.Screen name="PanelAdmin" options={({ navigation }) => ({
                    ...baseHeader('PanelAdmin'),
                    headerRight: () => (
                      <TouchableOpacity onPress={() => navigation.navigate('PerfilModal')} style={{ marginRight: 16 }}>
                        <Icon name="account" size={30} color="#fff" />
                      </TouchableOpacity>
                    ),
                  })}>
                    {() => (
                      <SafeRender>
                        <PanelAdmin />
                      </SafeRender>
                    )}
                  </Stack.Screen>

                  <Stack.Screen name="formularioEdicionCiudad" component={FormularioEdicionCiudad} options={({ navigation }) => ({
                    ...baseHeader('Edicion'),
                    headerRight: () => (
                      <TouchableOpacity onPress={() => navigation.navigate('PerfilModal')} style={{ marginRight: 16 }}>
                        <Icon name="account" size={30} color="#fff" />
                      </TouchableOpacity>
                    ),
                  })} />
                  <Stack.Screen name="formularioEdicionDiversion" component={FormularioEdicionDiversion} options={({ navigation }) => ({
                    ...baseHeader('Edicion'),
                    headerRight: () => (
                      <TouchableOpacity onPress={() => navigation.navigate('PerfilModal')} style={{ marginRight: 16 }}>
                        <Icon name="account" size={30} color="#fff" />
                      </TouchableOpacity>
                    ),
                  })} />
                  <Stack.Screen name="formularioEdicionHoteles" component={FormularioEdicionHoteles} options={({ navigation }) => ({
                    ...baseHeader('Edicion'),
                    headerRight: () => (
                      <TouchableOpacity onPress={() => navigation.navigate('PerfilModal')} style={{ marginRight: 16 }}>
                        <Icon name="account" size={30} color="#fff" />
                      </TouchableOpacity>
                    ),
                  })} />

                  <Stack.Screen name="MiInformacion" component={MiInformacion} options={{
                    title: 'Mi Información',
                    headerStyle: {
                      backgroundColor: '#061529ff',
                      elevation: 0,
                      shadowOpacity: 0,
                      borderBottomWidth: 0,
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                      color: '#fff',
                      fontWeight: 'bold',
                      marginLeft: 200,
                    },
                  }} />

                  <Stack.Screen name="Camara" component={Camara} options={{ headerShown: false }} />

                </Stack.Navigator>
              </NavigationContainer>
            </HotelProvider>
          </UserProvider>
        </AdminProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
