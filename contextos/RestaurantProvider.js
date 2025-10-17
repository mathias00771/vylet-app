import { API_URL } from '@env';
import React, { createContext, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getDistanceInKm} from '../utils/getDistanceInKm';

export const RestaurantContext = createContext();

export const useRestaurant = () => {
  const context = useContext(RestaurantContext)
  if (!context) {
    throw new Error("useRestaurant must be used with in an RestaurantProvider")
  }
  return context
}

export const RestaurantProvider = ({ children }) => {
  return (
    <UserContext.Provider value={{ }}>
      {children}
    </UserContext.Provider>
  );
};
