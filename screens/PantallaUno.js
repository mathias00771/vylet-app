import { API_URL } from "@env";
import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contextos/authProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../styles/colors";
import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground } from "react-native";
import { useUser } from "../contextos/UserProvider";
import * as Haptics from "expo-haptics";
import CargandoOverlay from "../componets/CargandoOverlay";

import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const banners = [
  {
    id: "1",
    image:
      "https://cdn.dribbble.com/userupload/13118950/file/original-cfaebacb75910a02e08e618b7ab2a067.jpg",
    title: "¡Solo por tiempo limitado!",
    text: "Escoge tus metas, corre corriendo",
  },
  {
    id: "2",
    image:
      "https://www.pichincha.com/sites/default/files/styles/hero_landing/public/2025-10/banner-home-mundial-4.jpg.webp?itok=DwvNUi6N",
    title: "Compra con Banco Pichincha",
    text: "Por tus compras rembolsa 5%",
  },
  {
    id: "3",
    image:
      "https://img.freepik.com/psd-gratis/plantilla-banner-portada-facebook-menu-comida-restaurante_120329-5497.jpg",
    title: "Que te valga Krunch",
    text: "Descubre las mejores promociones en comidas",
  },
  {
    id: "4",
    image:
      "https://cdn.dribbble.com/userupload/13118950/file/original-cfaebacb75910a02e08e618b7ab2a067.jpg",
    title: "Ver más",
    text: "",
    isVerMas: true,
  },
];

const PantallaUno = () => {
  const navigation = useNavigation();
  const { usuario, cargandoLocalizacion, getLocation, location } = useUser();
  const { userToken, checkUserToken } = useAuth();
  const [imagen, setImagen] = useState(null);
  const [flatListReady, setFlatListReady] = useState(false);
  const flatListRef = useRef();

  const obtenerFotoPerfil = () => {
    if (usuario?.foto_use) {
      const url = API_URL.slice(0, -3) + usuario.foto_use.slice(22);
      setImagen(url);
    }
  };

  const handleScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);

    if (index === 3) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      // navigation.navigate('VerMasScreen');
    }
  };

  useEffect(() => {
    obtenerFotoPerfil();
  }, [usuario]);

  useEffect(() => {
    if (!userToken) {
      navigation.reset({ index: 0, routes: [{ name: "LoginUsu" }] });
    }
  }, [userToken]);

  useEffect(() => {
    if (!location) {
      getLocation();
    }
  }, []);

  useEffect(() => {
    if (!flatListReady) return;

    const scroll = () => {
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({
          offset: width * 1,
          animated: true,
        });

        setTimeout(() => {
          flatListRef.current?.scrollToOffset({
            offset: width * 2,
            animated: true,
          });
        }, 2000);
      }
    };

    const timer = setTimeout(scroll, 2000);

    return () => clearTimeout(timer);
  }, [flatListReady]);

  const renderItem = ({ item }) => {
    const isVerMas = item.isVerMas;

    return (
      <>
        {isVerMas ? (
          <TouchableOpacity>
            <LinearGradient
              colors={["#061529", "#112c4ecc"]} // 👈 degradado sutil del mismo tono
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: width - 25,
                height: 100,
                justifyContent: "center",
                padding: 30,
                borderRadius: 20,
              }}
            >
              <View
                style={{
                  color: "white",
                  fontSize: 18,
                  marginHorizontal: 10,
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "white", fontSize: 18 }}>Ver más</Text>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={24}
                  color="white"
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity>
            <ImageBackground
              source={{ uri: item.image }}
              style={{ width, height: 100 }}
              imageStyle={{ borderRadius: 10 }}
            >
              <LinearGradient
                colors={["rgba(6,21,41,.9)", "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.8, y: 0 }}
                style={{ flex: 1, justifyContent: "center", padding: 20 }}
              >
                <View style={{ width: 170 }}>
                  <Text style={{ color: "white", fontSize: 18 }}>
                    {item.title}
                  </Text>
                  {item.text ? (
                    <Text style={{ color: "#dadadaff" }} numberOfLines={2}>
                      {item.text}
                    </Text>
                  ) : null}
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        )}
      </>
    );
  };

  if (cargandoLocalizacion) {
    return <CargandoOverlay message={"Cargando informacion"} />;
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "bottom", "left", "right"]}
    >
      <ScrollView style={styles.scroll}>
        <View style={styles.containerWelcom}>
          <View style={styles.insadeWelcom}>
            <View style={styles.insadeFrits}>
              <View>
                <TouchableOpacity
                  onPress={() => navigation.navigate("PerfilModal")}
                >
                  <Image
                    source={
                      imagen
                        ? { uri: imagen }
                        : require("../assets/vyletlogo.jpg")
                    }
                    style={styles.profileImage}
                  />
                </TouchableOpacity>
              </View>
              <View>
                <Text style={styles.titles}>Hola {usuario?.nombres}</Text>
                <Text style={styles.subtitles}>Bienvenido a VYLET</Text>
              </View>
            </View>
            <View style={styles.insadeSecond}>
              {/* <TouchableOpacity>
                <MaterialCommunityIcons name="magnify" size={28} color="#fff" />
              </TouchableOpacity> */}
              <TouchableOpacity>
                <MaterialCommunityIcons
                  name="bell-ring"
                  size={25}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ marginVertical: 10 }}>
          <FlatList
            ref={flatListRef}
            onLayout={() => {
              setFlatListReady(true);
            }}
            data={banners}
            horizontal
            pagingEnabled
            snapToInterval={width} // 👈 fuerza el scroll por ancho exacto
            scrollEnabled={true}
            nestedScrollEnabled={true}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            onMomentumScrollEnd={handleScrollEnd}
            style={{ height: 100 }}
          />
        </View>

        {/* <ImageBackground
          source={{ uri: 'https://cdn.dribbble.com/userupload/13118950/file/original-cfaebacb75910a02e08e618b7ab2a067.jpg' }}
          style={styles.vyletAds}
          imageStyle={styles.vyletAdsImage}
        >
          <LinearGradient
            colors={['rgba(6,21,41,.9)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: .8, y: 0 }}
            style={styles.vyletAdsGradient}
          >
            <View style={styles.vyletAdsFrist}>
              <Text style={styles.vyletAdsTitle}>¡Solo por tiempo limitado!</Text>
              <Text style={styles.vyletAdsText}>Escoge tus metas, corre corriendo</Text>
            </View>
          </LinearGradient>
        </ImageBackground> */}

        {/* <Text style={{...styles.titles, paddingHorizontal: 10}}>
          Servicios
          </Text> */}

        <View style={styles.categories}>
          <ScrollView horizontal>
            {[
              { label: "Ciudades", icon: "city", destino: "ciudad" },
              { label: "Hoteles", icon: "bed", destino: "hoteles" },
              { label: "Turismo", icon: "map-marker", destino: "turismo" },
              { label: "Festividad", icon: "party-popper", destino: "fiestas" },
              {
                label: "Diversión",
                icon: "emoticon-happy",
                destino: "diversion",
              },
              { label: "Restaurantes", icon: "food", destino: "restaurantes" },
            ].map((item, index) => (
              <View style={styles.categoryCard} key={index}>
                <View>
                  <TouchableOpacity
                    style={styles.categoryTouchable}
                    onPress={() => navigation.navigate(item.destino)}
                  >
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={35}
                      color="rgba(255, 255, 255, 1)"
                    />
                  </TouchableOpacity>
                  <Text style={{ ...styles.categoryText, color: "#fff" }}>
                    {item.label}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.activities}>
          <View>
            <Text style={styles.titles}>Recomendaciones para ti</Text>
            <Text style={styles.subtitles}>
              Sitios familiares con energia positiva.
            </Text>
          </View>

          <View style={styles.recomendations}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.scrollRecomedations}
            >
              <View style={styles.card}>
                <Image
                  source={{
                    uri: "https://res.cloudinary.com/dtomqkhpu/image/upload/v1759520145/ciudades/o2am76b0daytmi11y7eo.jpg",
                  }}
                  style={styles.cardImage}
                />
                <View style={styles.bodyCard}>
                  <Text style={styles.cardTitle}>
                    LA QUINTA BY WYNDHAM QUITO
                  </Text>
                  <Text style={{ ...styles.cardSubtitle, fontSize: 13 }}>
                    Hotel de lujo quito libre para poder visitar La Carolina
                  </Text>
                  <Text style={styles.cardPrice}>Precio: 10 - 100 $</Text>
                </View>
              </View>

              <View style={styles.card}>
                <Image
                  source={{
                    uri: "https://res.cloudinary.com/dtomqkhpu/image/upload/v1759520144/ciudades/ppw2tcserdeatyqy9clc.jpg",
                  }}
                  style={styles.cardImage}
                />
                <View style={styles.bodyCard}>
                  <Text style={styles.cardTitle}>LA QUINTA GUAYAQUIL</Text>
                  <Text style={{ ...styles.cardSubtitle, fontSize: 13 }}>
                    Hotel de lujo quito libre.
                  </Text>
                  <Text style={styles.cardPrice}>Precio: 10 - 100 $</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.contenedorBg,
  },
  scroll: {
    height: "100%",
    backgroundColor: colors.contenedorBg,
    padding: 10,
  },

  containerWelcom: {
    width: "100%",
    marginBottom: 20,
  },
  insadeWelcom: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  insadeFrits: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  insadeSecond: {
    flexDirection: "row",
    gap: 10,
  },
  titles: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  subtitles: {
    color: "#c9c9c9ff",

    fontSize: 13,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#fff",
  },

  categories: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 5,
  },
  categoryCard: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap",
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: 6,
    color: "#fff",
  },
  categoryText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  categoryTouchable: {
    backgroundColor: "#0d2644ff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  vyletAds: {
    height: 120,
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 16,
  },

  vyletAdsImage: {
    resizeMode: "cover",
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },

  vyletAdsGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  vyletAdsFrist: {
    flex: 1,
  },

  vyletAdsTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  vyletAdsText: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 4,
  },
  activities: {
    padding: 10,
    marginTop: 5,
  },
  recomendations: {
    marginVertical: 20,
  },

  card: {
    maxWidth: 190,
    minWidth: 190,
    marginRight: 20,
  },

  cardImage: {
    height: "45%",
    resizeMode: "cover",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  bodyCard: {
    padding: 10,
    backgroundColor: "#0d2644ff",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    maxHeight: 130,
    minHeight: 130,
  },

  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  cardSubtitle: {
    color: "#ccc",
    fontSize: 13,
  },
  cardPrice: {
    marginTop: 15,
    color: "#00b4d8",
    fontSize: 12,
  },
});

export default PantallaUno;
