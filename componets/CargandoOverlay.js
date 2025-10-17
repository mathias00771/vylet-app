import React from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions, Text } from 'react-native';

const CargandoOverlay = ({message}) => {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size={45} color="#fff"  />
      {message ? <Text style={{...styles.textos}}>{message}...</Text> : <Text style={styles.textos}>Cargando...</Text>}
      
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: Dimensions.get('window').width ,
    height: Dimensions.get('window').height ,    
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(6, 21, 41)',
    zIndex: 9999,    
  },
  textos: {
    color: "#fff",
    fontSize: 16    
  }
});

export default CargandoOverlay;
