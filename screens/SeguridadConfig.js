import { API_URL } from "@env";
import React, { useState, useRef, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contextos/authProvider";

import { colors } from "../styles/colors.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { UserContext } from "../contextos/UserProvider.js";

const { width } = Dimensions.get("window");

export default function SeguridadConfig() {
  const navigation = useNavigation();
  const { usuario, dataUsuario } = useContext(UserContext);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.imagenContainer}>
          <View>
            <Image
              source={require("../assets/seguridadimagen.png")}
              style={{
                resizeMode: "cover",
                width: 180,
                height: 180,
              }}
            />
          </View>
          <View style={{padding: 7}}>
            <Text
              style={{ ...styles.title, fontSize: 32, textAlign: "center" }}
            >
              Proteccion de cuenta
            </Text>
            <Text
              style={{
                ...styles.subtitle,
                textAlign: "center",
                color: "#ffffff75",
                paddingHorizontal: 20,
              }}
            >
              Protege tu cuenta activando las diferentes funciones que VYLET te
              ofrece. Cuida tus datos y no los pases a extraños
            </Text>
          </View>
        </View>
        <ScrollView>
          <View style={styles.bodyConfig}>
            <Text style={{ ...styles.title, padding: 10 }}>General</Text>
            <View
              style={{
                flexDirection: "column",
                gap: 5,
              }}
            >
              <TouchableOpacity
                style={styles.touchableSecurityBody}
                onPress={() => {
                  console.log("asd");
                }}
              >
                <MaterialCommunityIcons
                  name="lock-pattern"
                  size={24}
                  color="#fff"
                />
                <Text
                  style={{ ...styles.title, fontSize: 14, color: "#ffffffff" }}
                >
                  Agregar passcode
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.touchableSecurityBody}
                onPress={() => {
                  console.log("asd");
                }}
              >
                <MaterialCommunityIcons
                  name="shield-lock"
                  size={24}
                  color="#fff"
                />
                <Text
                  style={{ ...styles.title, fontSize: 14, color: "#ffffffff" }}
                >
                  Activar autenticación en dos pasos (2FA)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.touchableSecurityBody}
                onPress={() => {
                  console.log("asd");
                }}
              >
                <MaterialCommunityIcons
                  name="form-textbox-password"
                  size={24}
                  color="#fff"
                />
                <Text
                  style={{ ...styles.title, fontSize: 14, color: "#ffffffff" }}
                >
                  Cambiar contraseña
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.touchableSecurityBody}
                onPress={() => {
                  console.log("asd");
                }}
              >
                <MaterialCommunityIcons
                  name="email-sync"
                  size={24}
                  color="#fff"
                />
                <Text
                  style={{ ...styles.title, fontSize: 14, color: "#ffffffff" }}
                >
                  Cambiar correo de recuperacion
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.touchableSecurityBody}
                onPress={() => {
                  console.log("asd");
                }}
              >
                <MaterialCommunityIcons name="email" size={24} color="#fff" />
                <Text
                  style={{ ...styles.title, fontSize: 14, color: "#ffffffff" }}
                >
                  Notificaciones en correo
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.touchableSecurityBody}
                onPress={() => {
                  console.log("asd");
                }}
              >
                <MaterialCommunityIcons name="power" size={24} color="#fff" />
                <Text
                  style={{ ...styles.title, fontSize: 14, color: "#ffffffff" }}
                >
                  Cerrar todas las sesiones
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{}}>
              <Text style={{ ...styles.title, padding: 10 }}>
                Zona de riesgo
              </Text>
              <TouchableOpacity
                style={{
                  ...styles.touchableSecurityBody,
                  backgroundColor: "red",
                }}
                onPress={() => {
                  console.log("asd");
                }}
              >
                <MaterialCommunityIcons
                  name="account-off"
                  size={24}
                  color="#fff"
                />
                <Text
                  style={{ ...styles.title, fontSize: 14, color: "#ffffffff" }}
                >
                  Deshabilitar cuenta
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  ...styles.touchableSecurityBody,
                  backgroundColor: "#8f0000ff",
                  marginTop: 15,
                }}
                onPress={() => {
                  console.log("asd");
                }}
              >
                <MaterialCommunityIcons
                  name="account-remove"
                  size={24}
                  color="#fff"
                />
                <Text
                  style={{ ...styles.title, fontSize: 14, color: "#ffffffff" }}
                >
                  Eliminar cuenta
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  imagenContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  bodyConfig: {
    marginVertical: 1,
  },
  touchableSecurityBody: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#041831ff",
    marginVertical: 2,
    borderRadius: 10,
  },
});
