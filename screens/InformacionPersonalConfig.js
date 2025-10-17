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
  Alert,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contextos/authProvider";

import { colors } from "../styles/colors.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { UserContext } from "../contextos/UserProvider.js";
import CargandoOverlay from "../componets/CargandoOverlay.js";
import { ImageBackground } from "react-native";

const { width } = Dimensions.get("window");

export default function InformacionPersonalConfig() {
  const navigation = useNavigation();
  const { usuario, dataUsuario } = useContext(UserContext);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [celular, setCelular] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [pais, setPais] = useState("");
  const [actualizando, setActualizando] = useState(false);

  const [imagen, setImagen] = useState(null);

  const [visible, setVisible] = useState(false);

  const [imagenInvalida, setImagenInvalida] = useState(false);

  const obtenerFotoPerfil = () => {
    if (usuario?.foto_use) {
      const url = API_URL.slice(0, -3) + usuario.foto_use.slice(22);
      setImagen(url);
    }
  };

  const actualizarUsuario = async () => {
    if (!correo || !celular || !nombre || !apellido) {
      Alert.alert("❌", "Todos los campos son obligatorios");
      return;
    }

    setActualizando(true);
    try {
      const response = await fetch(
        `${API_URL}/usuarios/actualizar/${usuario?.cedula}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombres: nombre,
            apellidos: apellido,
            correo,
            celular,
          }),
        }
      );

      const resultado = await response.json();
      await dataUsuario();
      Alert.alert("✅", resultado.mensaje || "Usuario actualizado");
    } catch (error) {
      Alert.alert("❌", "Error al actualizar usuario");
    } finally {
      setActualizando(false);
    }
  };

  const handleGuardarInformacion = () => {
    actualizarUsuario();
    setModoEdicion(!modoEdicion);
  };
  const handleInformacionForm = () => {
    setNombre(usuario?.nombres);
    setApellido(usuario?.apellidos);
    setCorreo(usuario?.correo);
    setCelular(usuario?.celular.toString());

    setCiudad(usuario?.ciudad_use);
    setPais(usuario?.pais_use);
  };

  useEffect(() => {
    if (!usuario) {
      console.error(
        "No se pudo extraer la informacion de usuario algo salio mal"
      );
      return;
    }
    handleInformacionForm();
    obtenerFotoPerfil()
  }, [usuario]);

  if (actualizando) {
    return <CargandoOverlay />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom", "left", "right"]}>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.topContainer}>
            <TouchableOpacity onPress={() => setVisible(true)}>
              <Image
                style={styles.imageProfile}
                source={
                  !imagen || imagenInvalida ? require("../assets/vyleticono.png") : { uri: imagen }
                }
                onError={(e) => setImagenInvalida(true)}
              />
            </TouchableOpacity>
            <Text style={{ ...styles.title }}>
              {" "}
              {usuario?.nombres} {usuario?.apellidos}
            </Text>
            <Text style={{ ...styles.title, fontSize: 13, color: "#ffffff75" }}>
              {usuario?.tipo_usuario}
            </Text>
          </View>

          <View style={styles.bodyConfig}>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                {!modoEdicion ? (
                  <>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                      onPress={() => setModoEdicion(!modoEdicion)}
                    >
                      <MaterialCommunityIcons
                        name="pencil"
                        size={24}
                        color="#fff"
                      />
                      <Text style={{ color: "#fff" }}>Editar</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                      onPress={handleGuardarInformacion}
                    >
                      <MaterialCommunityIcons
                        name="content-save"
                        size={24}
                        color="#7bff00ff"
                      />
                      <Text style={{ color: "#7bff00ff" }}>Guardar</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
            <Text style={{ ...styles.title, marginBottom: 15 }}>
              Informacion personal
            </Text>
            <View>
              <Text style={{ ...styles.title, fontSize: 15 }}>Nombres</Text>

              <TextInput
                style={{
                  ...styles.title,
                  fontSize: 15,
                  paddingLeft: 5,
                  color: "#ffffff9d",
                  fontWeight: "noraml",
                  borderBottomWidth: modoEdicion ? 1 : 0,
                  borderBottomColor: "#ffffff60",
                  paddingBottom: 4,
                }}
                readOnly={modoEdicion ? false : true}
                onChangeText={setNombre}
                value={nombre}
              />

              <Text style={{ ...styles.title, fontSize: 15 }}>Apellidos</Text>

              <TextInput
                style={{
                  ...styles.title,
                  fontSize: 15,
                  paddingLeft: 5,
                  color: "#ffffff9d",
                  fontWeight: "noraml",
                  borderBottomWidth: modoEdicion ? 1 : 0,
                  borderBottomColor: "#ffffff60",
                  paddingBottom: 4,
                }}
                readOnly={modoEdicion ? false : true}
                onChangeText={setApellido}
                value={apellido}
              />

              <Text style={{ ...styles.title, fontSize: 15 }}>Correo</Text>

              <TextInput
                style={{
                  ...styles.title,
                  fontSize: 15,
                  paddingLeft: 5,
                  color: "#ffffff9d",
                  fontWeight: "noraml",
                  borderBottomWidth: modoEdicion ? 1 : 0,
                  borderBottomColor: "#ffffff60",
                  paddingBottom: 4,
                }}
                readOnly={modoEdicion ? false : true}
                onChangeText={setCorreo}
                value={correo}
              />

              <Text style={{ ...styles.title, fontSize: 15 }}>Celular</Text>

              <TextInput
                style={{
                  ...styles.title,
                  fontSize: 15,
                  paddingLeft: 5,
                  color: "#ffffff9d",
                  fontWeight: "noraml",
                  borderBottomWidth: modoEdicion ? 1 : 0,
                  borderBottomColor: "#ffffff60",
                  paddingBottom: 4,
                }}
                readOnly={modoEdicion ? false : true}
                onChangeText={setCelular}
                value={celular}
              />

              <Text style={{ ...styles.title, fontSize: 15 }}>Ciudad</Text>

              <TextInput
                style={{
                  ...styles.title,
                  fontSize: 15,
                  paddingLeft: 5,
                  color: "#ffffff9d",
                  fontWeight: "noraml",
                }}
                readOnly
                value={ciudad}
              />

              <Text style={{ ...styles.title, fontSize: 15 }}>Pais</Text>

              <TextInput
                style={{
                  ...styles.title,
                  fontSize: 15,
                  paddingLeft: 5,
                  color: "#ffffff9d",
                  fontWeight: "noraml",
                }}
                readOnly
                value={pais}
              />

              {/* <TouchableOpacity
              style={{
                ...styles.touchableSettingsBody,
                marginTop: 20,
                backgroundColor: "#b10000ff",
              }}
            >
              <MaterialCommunityIcons name="delete" size={24} color="#fff" />

              <Text
                style={{ ...styles.title, fontSize: 14, color: "#ffffffff" }}
              >
                Eliminar cuenta
              </Text>
            </TouchableOpacity> */}
            </View>
          </View>
        </ScrollView>
      </View>
      <Modal visible={visible} transparent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#000000ab",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {!imagen || imagenInvalida ? (
            <Text
              style={{
                color: "white",
              }}
            >
              ¡Imagen por default de VYLET!
            </Text>
          ) : null}
          <ImageBackground
            source={
                  !imagen || imagenInvalida ? require("../assets/vyleticono.png") : { uri: imagen }
                }
            style={{
              width: "100%",
              height: "70%",
              justifyContent: "flex-end",
              alignItems: "center",

              overflow: "hidden",
            }}
            imageStyle={{ borderRadius: 500 }}
          >
            {/* Botón Cerrar */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "80%",
              }}
            >
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#202020",
                    padding: 20,
                    borderRadius: 50,
                  }}
                  onPress={() => navigation.navigate('Camara',{onSelfie: true})}
                >
                  <MaterialCommunityIcons
                    name="image-refresh"
                    size={24}
                    color="#fff"
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    color: "white",
                    width: 90,
                    textAlign: "center",
                  }}
                >
                  Cambio de foto
                </Text>
              </View>

              <View
                style={{
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => setVisible(false)}
                  style={{
                    backgroundColor: "#202020",
                    padding: 20,
                    borderRadius: 50,
                  }}
                >
                  <MaterialCommunityIcons name="close" size={24} color="#fff" />
                </TouchableOpacity>
                <Text
                  style={{
                    color: "white",
                  }}
                >
                  Cerrar
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>
      </Modal>
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
    padding: 15,
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
    padding: 20,
    backgroundColor: "#041831ff",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },

  bodyConfig: {
    marginVertical: 10,
    backgroundColor: "#041831ff",
    borderRadius: 10,
    padding: 15,
  },

  imageProfile: {
    width: 70,
    height: 70,
    borderRadius: 40,
    margin: 10,
  },

  touchableSettingsBody: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#041831ff",
    marginVertical: 2,
    borderRadius: 10,
  },
});
