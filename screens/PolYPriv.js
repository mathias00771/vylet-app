import React, { useState, useRef, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contextos/authProvider';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../styles/colors.js'
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Checkbox from 'expo-checkbox';




const { width } = Dimensions.get('window');


export default function PolYPriv() {
  const [aceptaPoliticas, setAceptaPoliticas] = useState(false);


  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#061529ff', '#06254eff']}
        style={styles.container}
      >

        <View style={{
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%"
        }}>
          <View>
            <Text style={{
              color: "#ffffff75",
              fontWeight: "bold",
              fontSize: 20
            }}>
              Seguridad
            </Text>
            <Text style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: 50
            }}>
              VYLET
            </Text>
          </View>
          <View>
            {/* <Text style={{
              color: "#b9b9b9ce",
              fontSize: 12
            }}>
              Nuestra aplicacion requiere de ciertos permisos de tu celular para funcionar correctamente, otorgalos para que no haya inconvenientes
            </Text> */}


            <Image source={require('../assets/polyprivimagen.png')} style={{
              resizeMode: "cover",
              width: 300,
              height: 400
            }} />
            <Text style={{
              color: "#b9b9b9ce",
              fontSize: 12
            }}>
              Es hora de nuestra Legalidad como APP, por favor lee detenidamente la <Text style={{
                color: "#007AFF",
                textDecorationLine: "underline",
                fontWeight: "bold",
                fontSize: 13
              }}>Politica y Privacidad</Text> de nuestra app y aceptalas, dandonos el conentimiento para poder usar la informacion necesaria.
            </Text>
          </View>

          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox
                value={aceptaPoliticas}
                onValueChange={setAceptaPoliticas}
                color={aceptaPoliticas ? '#007AFF' : undefined}
              />
              <TouchableOpacity>
                <Text onPress={() => setAceptaPoliticas(!aceptaPoliticas)} style={{ marginLeft: 8, color: "#fff"}}>Acepto las políticas y privacidad</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{

          }}>
            <TouchableOpacity style={{
              backgroundColor: colors.fristButtonBg,
              padding: 15,
              borderRadius: 20,
              flexDirection: "row",
              justifyContent: "space-between"
            }}

            >
              <Text style={{
                color: "#fff"
              }}>
                Continuar
              </Text>
              <MaterialCommunityIcons name="arrow-right" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a1a2f',
  },

  container: {
    flex: 1,

    padding: 30
  },
  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },

});
