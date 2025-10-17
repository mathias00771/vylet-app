import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';

const filtros = ['FAMILIAR', 'DISCOTECAS', 'BAR/KARAOKE', 'Eventos'];
const distancias = ['TODOS', '30KM', '60KM', '100KM'];

export default function Diversion() {
  const [filtroActivo, setFiltroActivo] = useState(null);
  const [distanciaActiva, setDistanciaActiva] = useState('TODOS');
  const [busqueda, setBusqueda] = useState('');

  const resultados = [
    {
      nombre: 'V',
      descripcion: 'Diversión nocturna cercanas a Quito',
      estrellas: 4,
      distancia: '60KM',
      tipo: 'DISCOTECAS',
      imagen: require('../../../assets/vyletlogo.jpg'),
    },
    {
      nombre: 'Aguas termales',
      descripcion: 'Diversión nocturna cercanas a Quito',
      estrellas: 5,
      distancia: '60KM',
      tipo: 'FAMILIAR',
      imagen: require('../../../assets/vyletlogo.jpg'),
    },
    {
      nombre: 'Parque de diversiones',
      descripcion: 'Diversión nocturna cercanas a Quito',
      estrellas: 5,
      distancia: '60KM',
      tipo: 'FAMILIAR',
      imagen: require('../../../assets/vyletlogo.jpg'),
    },
    {
      nombre: 'Bar Central',
      descripcion: 'Ambiente relajado con música en vivo',
      estrellas: 4.5,
      distancia: '30KM',
      tipo: 'BAR',
      imagen: require('../../../assets/vyletlogo.jpg'),
    },
    {
      nombre: 'Karaoke Boom',
      descripcion: 'Canta tus canciones favoritas toda la noche',
      estrellas: 5,
      distancia: '100KM',
      tipo: 'KARAOKE',
      imagen: require('../../../assets/vyletlogo.jpg'),
    },
  ];

  const resultadosFiltrados = resultados.filter((item) => {
    const coincideTipo =
      filtroActivo === 'BAR/KARAOKE'
        ? item.tipo === 'BAR' || item.tipo === 'KARAOKE'
        : filtroActivo
        ? item.tipo === filtroActivo
        : true;

    const coincideBusqueda = busqueda
      ? item.nombre.toLowerCase().includes(busqueda.toLowerCase())
      : true;

    const coincideDistancia =
      distanciaActiva === 'TODOS' ? true : item.distancia === distanciaActiva;

    return coincideTipo && coincideBusqueda && coincideDistancia;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Buscar diversión nocturna</Text>

      <View style={styles.filtroBuscadorContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtroScroll}>
          <View style={styles.filtroRow}>
            {filtros.map((filtro) => (
              <TouchableOpacity
                key={filtro}
                style={[
                  styles.filtroBtn,
                  filtroActivo === filtro && styles.filtroActivo,
                ]}
                onPress={() => setFiltroActivo(filtro)}
              >
                <Text style={styles.filtroText} numberOfLines={1}>
                  {filtro}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {filtroActivo && (
          <View style={styles.buscadorContainer}>
            <TextInput
              style={styles.input}
              placeholder="NOMBRE DEL LUGAR"
              placeholderTextColor="#8fa3b8"
              value={busqueda}
              onChangeText={setBusqueda}
            />

            <View style={styles.distanciaRow}>
              {distancias.map((km) => (
                <TouchableOpacity
                  key={km}
                  style={[
                    styles.kmBtn,
                    distanciaActiva === km && styles.kmActivo,
                  ]}
                  onPress={() => setDistanciaActiva(km)}
                >
                  <Text style={styles.kmText}>{km}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      <ScrollView style={styles.resultados}>
        {resultadosFiltrados.map((item, index) => (
          <View key={index} style={styles.card}>
            <Image source={item.imagen} style={styles.cardImg} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardNombre}>{item.nombre}</Text>
              <Text style={styles.cardDesc}>{item.descripcion}</Text>
              <Text style={styles.cardEstrellas}>⭐ {item.estrellas}</Text>
              <Text style={styles.cardDistancia}>{item.distancia}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1a2f',
    padding: 20,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  filtroBuscadorContainer: {
    marginBottom: 12,
  },
  filtroScroll: {
    paddingBottom: 0,
  },
  filtroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filtroBtn: {
    backgroundColor: '#173151',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  filtroActivo: {
    backgroundColor: '#1e3a5f',
  },
  filtroText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  buscadorContainer: {
    marginTop: 8,
  },
  input: {
    backgroundColor: '#173151',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    marginBottom: 12,
  },
  distanciaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  kmBtn: {
    backgroundColor: '#173151',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  kmActivo: {
    backgroundColor: '#1e3a5f',
  },
  kmText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  resultados: {
    marginTop: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#112b45',
    borderRadius: 10,
    marginBottom: 14,
    overflow: 'hidden',
  },
  cardImg: {
    width: 100,
    height: 100,
  },
  cardInfo: {
    flex: 1,
    padding: 10,
  },
  cardNombre: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardDesc: {
    color: '#afafaf',
    fontSize: 13,
    marginVertical: 4,
  },
  cardEstrellas: {
    color: '#ffd700',
    fontSize: 14,
  },
  cardDistancia: {
    color: '#8fa3b8',
    fontSize: 12,
    marginTop: 2,
  },
});
