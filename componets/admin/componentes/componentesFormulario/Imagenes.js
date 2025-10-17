import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { colors } from '../../../../styles/colors';


export default function Imagenes({ data, setData, onNext, onBack, seleccionarImagenes }) {
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Suba sus Imágenes</Text>

      {/* Banner */}
      <TouchableOpacity style={styles.imageBox} onPress={() => seleccionarImagenes('banner')}>
        {data.imagenes?.banner?.uri ? (
          <Image source={{ uri: data.imagenes.banner.uri }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imageText}>Seleccionar Banner</Text>
        )}
      </TouchableOpacity>

      {/* Portada */}
      <TouchableOpacity style={styles.imageBox} onPress={() => seleccionarImagenes('portada')}>
        {data.imagenes?.portada?.uri ? (
          <Image source={{ uri: data.imagenes.portada.uri }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imageText}>Seleccionar Portada</Text>
        )}
      </TouchableOpacity>

      {/* Otras imágenes */}
      <TouchableOpacity style={styles.imageBox} onPress={() => seleccionarImagenes('otras')}>
        <Text style={styles.imageText}>Subir más fotos</Text>
      </TouchableOpacity>

      {/* Vista previa de otras imágenes */}
      <View style={styles.grid}>
        {Array.isArray(data.imagenes?.otras) &&
          data.imagenes.otras.map((img, index) =>
            img?.uri ? (
              <Image key={index} source={{ uri: img.uri }} style={styles.imageThumb} />
            ) : null
          )}
      </View>

      {/* Navegación */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={onBack}>
          <Text style={styles.buttonText}>Anterior</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onNext}>
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  subtitle: { color: '#fff', fontSize: 16, marginBottom: 10 },
  imageBox: {
    backgroundColor: '#173151',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    width: '100%',
  },
  imageText: { color: '#aaa' },
  imagePreview: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  imageThumb: {
    width: 80,
    height: 80,
    margin: 5,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  button: {
    backgroundColor: colors.buttonBg,
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
