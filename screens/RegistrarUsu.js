import {API_URL} from '@env'
import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const citiesByCountry = {
  Ecuador: ['Quito', 'Guayaquil', 'Cuenca', 'Ambato'],
  Colombia: ['Bogotá', 'Medellín', 'Cali'],
  Perú: ['Lima', 'Cusco', 'Arequipa'],
};

const RegistrarUsu = () => {
  
  const [docType, setDocType] = useState('cedula');
  const [docNumber, setDocNumber] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const navigation = useNavigation();

  const validarCedulaEcuatoriana = (cedula) => {
    if (!/^\d{10}$/.test(cedula)) return false;
    const provincia = parseInt(cedula.substring(0, 2));
    if (provincia < 1 || provincia > 24) return false;
    const digitos = cedula.split('').map(Number);
    const verificador = digitos.pop();
    let suma = 0;
    for (let i = 0; i < digitos.length; i++) {
      let mult = i % 2 === 0 ? digitos[i] * 2 : digitos[i];
      if (mult > 9) mult -= 9;
      suma += mult;
    }
    const resultado = 10 - (suma % 10);
    return verificador === (resultado === 10 ? 0 : resultado);
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${d.getFullYear()}`;
  };

  const handleRegister = async () => {
    
    if (
      !docNumber || !nombres || !apellidos || !celular ||
      !email || !password || !country || !city || !birthDate
    ) {
      Alert.alert('Campos incompletos', 'Por favor llena todos los campos.');
      return;
    }

    if (docType === 'cedula' && !validarCedulaEcuatoriana(docNumber)) {
      Alert.alert('Cédula inválida', 'La cédula ingresada no es válida.');
      return;
    }

    if (docType === 'pasaporte' && docNumber.length < 5) {
      Alert.alert('Pasaporte inválido', 'El número de pasaporte es demasiado corto.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Correo inválido', 'Por favor ingresa un correo válido.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Contraseña muy corta', 'Debe tener al menos 6 caracteres.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/usuarios/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cedula: docType === 'cedula' ? docNumber : '',
          pasaporte: docType === 'pasaporte' ? docNumber : '',
          nombres,
          apellidos,
          celular,
          correo: email,
          contrasena: password,
          fecha_nacimiento: birthDate.toISOString().split('T')[0],
          ciudad_use: city,
          pais_use: country,
          puntos_use: 0,
          tipo_usuario: 'cliente',
          fecha_creacion_use: new Date().toISOString().split('T')[0],
          foto_use: 'http://localhost:3000/uploads/imagen_prototipo.jpeg',
        }),
      });

      const data = await response.json();


      if (response.status === 201) {
        Alert.alert('Registro exitoso', data.mensaje);
      } else {
        Alert.alert('Error', data.mensaje || 'No se pudo registrar el usuario.');
      }
    } catch (error) {
      Alert.alert('Error de conexión', 'No se pudo conectar con el servidor.');
      console.error(error);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setBirthDate(selectedDate);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.container}>
        <Text style={styles.logo}>
          Vylet <Text style={styles.pin}>📍</Text>
        </Text>
        <View style={styles.segment}>
          <TouchableOpacity
            style={[styles.segmentBtn, docType === 'cedula' && styles.segmentBtnActive]}
            onPress={() => setDocType('cedula')}
          >
            <Text style={[styles.segmentText, docType === 'cedula' && styles.segmentTextActive]}>
              Cédula
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentBtn, docType === 'pasaporte' && styles.segmentBtnActive]}
            onPress={() => setDocType('pasaporte')}
          >
            <Text style={[styles.segmentText, docType === 'pasaporte' && styles.segmentTextActive]}>
              Pasaporte
            </Text>
          </TouchableOpacity>
        </View>
        {/* Scroll solo para los inputs */}
        <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
          {/* Tipo de documento */}


          {/* Todos los campos */}
          <View>
            {/* Número de documento */}
            <View style={styles.inputWrapper}>
              <Text style={styles.iconEmoji}>🪪</Text>
              <TextInput
                placeholder={docType === 'cedula' ? 'Número de cédula' : 'Número de pasaporte'}
                placeholderTextColor="#ccc"
                style={styles.input}
                value={docNumber}
                onChangeText={setDocNumber}
                keyboardType={docType === 'cedula' ? 'number-pad' : 'default'}
              />
            </View>


            {/* Nombres */}

            <View style={styles.inputWrapper}>
              <Text style={styles.iconEmoji}>🧑</Text>
              <TextInput
                placeholder="Nombres"
                placeholderTextColor="#ccc"
                style={styles.input}
                value={nombres}
                onChangeText={setNombres}
              />
            </View>

            {/* Apellidos */}
            <View style={styles.inputWrapper}>
              <Text style={styles.iconEmoji}>👨‍👩‍👧</Text>
              <TextInput
                placeholder="Apellidos"
                placeholderTextColor="#ccc"
                style={styles.input}
                value={apellidos}
                onChangeText={setApellidos}
              />
            </View>

            {/* Celular */}
            <View style={styles.inputWrapper}>
              <Text style={styles.iconEmoji}>📱</Text>
              <TextInput
                placeholder="Celular"
                placeholderTextColor="#ccc"
                style={styles.input}
                value={celular}
                onChangeText={setCelular}
                keyboardType="phone-pad"
              />
            </View>

            {/* Correo */}
            <View style={styles.inputWrapper}>
              <Text style={styles.iconEmoji}>📧</Text>
              <TextInput
                placeholder="Correo electrónico"
                placeholderTextColor="#ccc"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Contraseña */}
            <View style={styles.inputWrapper}>
              <Text style={styles.iconEmoji}>🔒</Text>
              <TextInput
                placeholder="Contraseña"
                placeholderTextColor="#ccc"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* País */}
            <View style={styles.inputWrapper}>
              <Text style={styles.iconEmoji}>🌎</Text>
              <Picker
                selectedValue={country}
                onValueChange={(value) => {
                  setCountry(value);
                  setCity('');
                }}
                style={styles.picker}
                dropdownIconColor="#ccc"
              >
                <Picker.Item label="Selecciona país" value="" />
                {Object.keys(citiesByCountry).map((c) => (
                  <Picker.Item key={c} label={c} value={c} />
                ))}
              </Picker>
            </View>

            {/* Ciudad */}
            {country && (
              <View style={styles.inputWrapper}>
                <Text style={styles.iconEmoji}>🏙️</Text>
                <Picker
                  selectedValue={city}
                  onValueChange={setCity}
                  style={styles.picker}
                  dropdownIconColor="#ccc"
                >
                  <Picker.Item label="Selecciona ciudad" value="" />
                  {citiesByCountry[country]?.map((c) => (
                    <Picker.Item key={c} label={c} value={c} />
                  ))}
                </Picker>
              </View>
            )}

            {/* Fecha de nacimiento */}
            <TouchableOpacity
              style={styles.inputWrapper}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.iconEmoji}>🎂</Text>
              <Text style={[styles.input, { color: birthDate ? '#fff' : '#ccc' }]}>
                {birthDate ? formatDate(birthDate) : 'Fecha de nacimiento'}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={birthDate || new Date(2000, 0, 1)}
                mode="date"
                display="default"
                onChange={onChangeDate}
                maximumDate={new Date()}
              />
            )}
          </View>
        </ScrollView>

        {/* Botón de registro */}
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerText}>Registrarme</Text>
        </TouchableOpacity>

        {/* Botón para volver al login */}
        <TouchableOpacity style={styles.loginRedirect} onPress={() => navigation.navigate('LoginUsu')}>
          <Text style={styles.loginRedirectText}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>

        <Text style={styles.version}>VS 1.0.0</Text>
      </View>
    </SafeAreaView>
  );


};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a1a2f',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#0a1a2f',
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  pin: {
    fontSize: 28,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: '#0f2239',
    borderRadius: 10,
    padding: 4,
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: '#173151',
  },
  segmentText: {
    color: '#8fa3b8',
    fontWeight: '600',
  },
  segmentTextActive: {
    color: '#fff',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a1524',
    borderRadius: 8,
    paddingHorizontal: 12,
    width: '100%',
    height: 52,
    marginBottom: 12,
  },
  iconEmoji: {
    fontSize: 18,
    marginRight: 10,
    color: '#ccc',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  picker: {
    flex: 1,
    color: '#fff',
    backgroundColor: 'transparent',
  },
  registerButton: {
    backgroundColor: '#173151',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  registerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  version: {
    color: '#8fa3b8',
    fontSize: 12,
    marginTop: 20,
    textAlign: 'center',
  },
  formScroll: {
    width: '100%',
    marginBottom: 20,
    height: "60%"
  },
  loginRedirect: {
    marginTop: 10,
    paddingVertical: 10,
  },
  loginRedirectText: {
    color: '#8fa3b8',
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default RegistrarUsu;
