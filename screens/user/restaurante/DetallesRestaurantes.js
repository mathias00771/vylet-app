// src/screens/QuitoInfoScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../contextos/authProvider';
import { colors as color } from '../../../styles/colors';
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon2 from 'react-native-vector-icons/FontAwesome5'

const DetallesRestaurantes = () => {
  const { userToken } = useAuth();
  const navigation = useNavigation();
  const [contactosValue, setContactosValue] = useState(false);

  const handleContactosVal = (val) => {
    setContactosValue(val);
  };

  const handleNavigateSocialNetwork = (url) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const menu = {
    desayuno: [
      { id: 'd1', nombre: 'Huevos con tocino', precio: '$5.00' },
      { id: 'd2', nombre: 'Panqueques con miel', precio: '$4.00' },
      { id: 'd3', nombre: 'Café y jugo natural', precio: '$3.00' },
    ],
    almuerzo: [
      { id: 'a1', nombre: 'Pollo a la parrilla con arroz', precio: '$10.00' },
      { id: 'a2', nombre: 'Ensalada César', precio: '$8.00' },
      { id: 'a3', nombre: 'Sopa del día', precio: '$6.00' },
    ],
    cena: [
      { id: 'c1', nombre: 'Filete de res con vegetales', precio: '$15.00' },
      { id: 'c2', nombre: 'Pasta Alfredo', precio: '$12.00' },
      { id: 'c3', nombre: 'Mariscos mixtos', precio: '$18.00' },
    ],
  };

  const restaurantes = [
    {
      id: 'r1',
      nombre: 'Restaurante El Mirador',
      imagen: require('../../../assets/vyletlogo.jpg'),
      destino: 'detalleRestaurante',
    },
    {
      id: 'r2',
      nombre: 'Café Colonial',
      imagen: require('../../../assets/vyletlogo.jpg'),
      destino: 'detalleRestaurante',
    },
    {
      id: 'r3',
      nombre: 'Café Colonial',
      imagen: require('../../../assets/vyletlogo.jpg'),
      destino: 'detalleRestaurante',
    },
  ];

  const contactos = () => {
    return (
      <View>
        <View style={{ ...styles.infoDetails, marginTop: 25 }}>
          <View style={styles.infoRow}>
            <View style={styles.rowDescription}>
              <Icon name="map-marker" size={20} color="#FF0000" />
              <Text style={{ ...styles.infoText, marginTop: 0, marginVertical: 15, color: "#d8d8d8ff" }}>Ubicacion</Text>
            </View>
            <Text style={{ ...styles.valor, textDecorationLine: 'underline', fontWeight: "", fontSize: 16 }} onPress={() => {
              handleNavigateSocialNetwork('https://maps.app.goo.gl/fxXXLpTM8X6gAANi8')
            }}>Av. hola soy mathias
            </Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.rowDescription}>
              <Icon name="facebook" size={20} color="#007AFF" />
              <Text style={{ ...styles.infoText, marginTop: 0, marginVertical: 15, color: "#d8d8d8ff" }}>Facebook</Text>

            </View>
            <Text style={{ ...styles.valor, textDecorationLine: 'underline', fontWeight: "", fontSize: 16 }} onPress={() => {
              handleNavigateSocialNetwork('https://www.facebook.com/profile.php?id=61578101222135')
            }}>El playon jaja
            </Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.rowDescription}>
              <Icon name="instagram" size={20} color="#C13584" />
              <Text style={{ ...styles.infoText, marginTop: 0, marginVertical: 15, color: "#d8d8d8ff" }}>Instagram</Text>
            </View>
            <Text style={{ ...styles.valor, textDecorationLine: 'underline', fontWeight: "", fontSize: 16 }} onPress={() => {
              handleNavigateSocialNetwork('https://www.facebook.com/profile.php?id=61578101222135')
            }}>El playon jaja
            </Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.rowDescription}>
              <Icon2 name="tiktok" size={20} color="#FE2C55" />

              <Text style={{ ...styles.infoText, marginTop: 0, marginVertical: 15, color: "#d8d8d8ff" }}>Tik tok</Text>
            </View>
            <Text style={{ ...styles.valor, textDecorationLine: 'underline', fontWeight: "", fontSize: 16 }} onPress={() => {
              handleNavigateSocialNetwork('https://www.facebook.com/profile.php?id=61578101222135')
            }}>El playon jaja
            </Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.rowDescription}>
              <Icon name="whatsapp" size={20} color="#25D366" />
              <Text style={{ ...styles.infoText, marginTop: 0, marginVertical: 15, color: "#d8d8d8ff" }}>Whatsapp</Text>
            </View>
            <Text style={{ ...styles.valor, textDecorationLine: 'underline', fontWeight: "", fontSize: 16 }} onPress={() => {
              handleNavigateSocialNetwork('https://www.facebook.com/profile.php?id=61578101222135')
            }}>0965423943
            </Text>
          </View>
        </View>
      </View>
    )
  }

  const handleNavigateRestaurante = (destino, props) => {
    const type = props.tipo
    const typeLower = type.toLowerCase()
    const noSpaces = typeLower.replace(/ /g, "_");
    props.tipo = noSpaces
    props.tipoOriginal = type
    navigation.navigate(destino, props);
  };

  useEffect(() => {
    if (!userToken) {
      navigation.reset({ index: 0, routes: [{ name: 'LoginUsu' }] });
    }
  }, [userToken]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerImageContainer}>
          <Image source={require('../../../assets/vyletlogo.jpg')} style={styles.headerImage} />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.cityTitle}>Carbon de palo</Text>
          <View style={styles.infoSelectTabs}>
            <TouchableOpacity style={styles.bottonTab} onPress={() => handleContactosVal(false)}>
              <Text style={styles.infoTextTabs}>Información</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottonTab} onPress={() => handleContactosVal(true)}>
              <Text style={styles.infoTextTabs}>Contactos</Text>
            </TouchableOpacity>
          </View>

          {!contactosValue ? (
            <View style={styles.infoDetails}>
              <Text style={styles.seccionTitulo}>Información del Restaurante</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoText}>
                  Ubicado en el corazón de Llano Chico, Sabor Andino es un restaurante acogedor que fusiona la tradición ecuatoriana con un toque contemporáneo.
                </Text>
              </View>
            </View>) : (contactos())
          }

          <Text style={{ ...styles.seccionTitulo, marginTop: 20 }}>Fotos del restaurante</Text>

          <FlatList
            data={restaurantes}
            horizontal
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.cardServicio}
                onPress={() => navigation.navigate(item.destino)}
              >
                <Image source={item.imagen} style={styles.imagenServicio} />
                <View style={styles.overlay}>
                  <Text style={styles.overlayTexto}>{item.nombre}</Text>
                </View>
              </TouchableOpacity>
            )}
          />

          <View style={styles.infoDetails}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
              <Text style={styles.seccionTituloMenu}>Menu</Text>
              {/* <TouchableOpacity onPress={() => { }}>
                <Text style={{ color: '#00b4d8', fontWeight: 'bold', fontSize: 17 }}>Ver todo</Text>
              </TouchableOpacity> */}
            </View>

            {/* <View>
              {Object.keys(menu).map((categoria) => (
                <View key={categoria} style={{ marginBottom: 15 }}>
                  <Text style={[styles.seccionTitulo, { fontSize: 13, textTransform: 'capitalize', marginBottom: 1 }]}>{categoria}</Text>
                  {menu[categoria].map((item) => (
                    <View key={item.id} style={styles.infoRow}>
                      <Text style={styles.infoTextMenu}>{item.nombre}</Text>
                      <Text style={styles.valor}>{item.precio}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View> */}

            <View style={styles.categories}>
              {[
                { label: 'Entradas', icon: '🥗', destino: 'detallesMenu', nombreRestaurante: "pepitocadela" },
                { label: 'Postres', icon: '🍰', destino: 'detallesMenu', nombreRestaurante: "pepitocadela" },
                { label: 'Bebidas', icon: '🧃', destino: 'detallesMenu', nombreRestaurante: "pepitocadela" },
                { label: 'Sopas y caldos', icon: '🍲', destino: 'detallesMenu', nombreRestaurante: "pepitocadela" },
                { label: 'Ensaladas', icon: '🥬', destino: 'detallesMenu', nombreRestaurante: "pepitocadela" },
                { label: 'Platos fuertes', icon: '🍖', destino: 'detallesMenu', nombreRestaurante: "pepitocadela" },
              ].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.categoryCard}
                  onPress={() => handleNavigateRestaurante(item.destino, { nombreRestaurante: item.nombreRestaurante, tipo: item.label, idRestaurante: 1 })}
                >
                  <Text style={styles.categoryIcon}>{item.icon}</Text>
                  <Text style={styles.categoryText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a1a2f',
  },
  headerImageContainer: {
    alignItems: 'center',
  },
  headerImage: {
    width: '100%',
    height: 250,
  },
  cityTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  infoBox: {
    padding: 20,
    backgroundColor: color.contenedorBg,

  },
  infoDetails: {
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoSelectTabs: {
    marginTop: 7,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoTextMenu: {
    color: '#5c677d',
    fontWeight: 'bold',
  },
  bottonTab: {
    width: '50%',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: color.valorColor,
    padding: 2,
    borderRadius: 5,
  },
  infoTextTabs: {
    fontSize: 18,
    color: '#0a1a2f',
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
    color: '#5c677d',
    fontWeight: 'bold',
    marginTop: 10,
  },
  valor: {
    fontSize: 14,
    color: color.valorColor,
  },
  seccionTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  seccionTituloMenu: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',

  },
  cardServicio: {
    position: 'relative',
    width: 160,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    backgroundColor: '#173151',
    marginTop: 20,
  },
  imagenServicio: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  overlayTexto: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  categoryCard: {
    width: '30%',
    backgroundColor: '#0f2239',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: 6,
    color: '#fff',
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  rowDescription: {
    flexDirection: 'row',

    textAlign: 'center',
    gap: 10,
  },

});

export default DetallesRestaurantes;
