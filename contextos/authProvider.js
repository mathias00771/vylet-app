import { API_URL } from '@env';
import React, { useContext, useEffect, useState, createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used with in an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [identificadorCi, setIdentificadorCi] = useState(null)

  const login = async (identificador, contrasena) => {
    if (!identificador || !contrasena) {
      return "Por favor ingresa tus datos"
    }
    try {
      const response = await fetch(`${API_URL}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identificador, contrasena }),
      });

      const data = await response.json();

      if (!response.ok) return data.mensaje
      
      const { token, usuario } = data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('identificador', identificador);
      await AsyncStorage.setItem('tipo_usuario', usuario.tipo_usuario);
      await AsyncStorage.setItem('nombre_usuario', usuario.nombres);

      setIdentificadorCi(identificador)
      await checkUserToken()

      return response.ok
    } catch (error) {
      console.log(error)
      return error.message;
    } 
  }

  const putUser = async () => {
    const identificador = await AsyncStorage.getItem('identificador');
    setIdentificadorCi(identificador)
  }

  const checkUserToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      setUserToken(token);
    } catch (error) {
      console.error('Error retrieving user token:', error);
    }
  }
  useEffect(() => {
    checkUserToken()
    putUser()
  }, []);


  return (
    <AuthContext.Provider value={{ userToken, checkUserToken, login, identificadorCi }}>
      {children}
    </AuthContext.Provider>
  );
};
