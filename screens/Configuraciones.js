import React, { useState, useRef, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contextos/authProvider.js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from "../styles/colors.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { UserContext } from "../contextos/UserProvider.js";


const { width } = Dimensions.get("window");

export default function Configuraciones() {
  const navigation = useNavigation();
  const { userToken, checkUserToken } = useAuth();
  const { usuario, dataUsuario } = useContext(UserContext);

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
  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom", "left", "right"]}>
      <View style={styles.container}>
        {/* <View style={{ padding: 10 }}>
          <Text style={{ ...styles.title }}>VYLET</Text>
          <Text style={{ ...styles.title, fontSize: 13, color: "#ffffff75"}}>Configuraciones</Text>
        </View> */}

        <View style={styles.bodyConfig}>
          <View
            style={{
              flexDirection: "column",
              gap: 1,
            }}
          >
            <TouchableOpacity style={styles.touchableSettingsBody} onPress={() => {navigation.navigate("informacionPersonalConfig")}}>
              <MaterialCommunityIcons
                name="account-details"
                size={24}
                color="#fff"
                
              />
              <Text
                style={{ ...styles.title, fontSize: 14, color: "#ffffffff" }}
              >
                Informacion personal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.touchableSettingsBody} onPress={() => {navigation.navigate("seguridadConfig")}}>
             <MaterialCommunityIcons name="lock" size={24} color="#fff" />

              <Text
                style={{ ...styles.title, fontSize: 14, color: "#ffffffff" }}
              >
                Seguridad
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.touchableSettingsBody} onPress={() => {Linking.openURL("https://play.google.com/store/")}}>
              <MaterialCommunityIcons name="star" size={24} color="#fff" />

              <Text
                style={{ ...styles.title, fontSize: 14, color: "#ffffffff" }}
              >
                Calificanos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.touchableSettingsBody}>
              <MaterialCommunityIcons name="shield" size={24} color="#fff" />

              <Text
                style={{ ...styles.title, fontSize: 14, color: "#ffffffff" }}
              >
                Politicas y Privacidad
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.touchableSettingsBody}>
              <MaterialCommunityIcons name="file-document-outline" size={24} color="#fff" />

              <Text
                style={{ ...styles.title, fontSize: 14, color: "#ffffffff" }}
              >
                Terminos y Condiciones
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.touchableSettingsBody}>
              <MaterialCommunityIcons name="email" size={24} color="#fff" />

              <Text
                style={{ ...styles.title, fontSize: 14, color: "#ffffffff" }}
              >
                Contactanos
              </Text>
            </TouchableOpacity>

            

            <TouchableOpacity style={{...styles.touchableSettingsBody, marginTop: 20, backgroundColor: "#b10000ff"}} onPress={cerrarSesion}>
              <MaterialCommunityIcons name="logout" size={24} color="#fff" />

              <Text
                style={{ ...styles.title, fontSize: 14, color: "#ffffffff" }}
              >
                Cerrar sesion
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.contenedorBg,
  },
  container: {
    flex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#fff",
    fontSize: 16,
  },

  topContainer: {
    marginVertical: 10,
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#041831ff",
    borderRadius: 15,
  },

  bodyConfig: {
    marginVertical: 5,

    borderRadius: 15,
  },

  imageProfile: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },

  touchableSettingsBody: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    padding: 15,
    backgroundColor: "#041831ff",
    marginVertical: 2,
  },
});
