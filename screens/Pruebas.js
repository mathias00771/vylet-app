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

export default function Pruebas() {
  const navigation = useNavigation();
  const { usuario, dataUsuario } = useContext(UserContext);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
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
});
