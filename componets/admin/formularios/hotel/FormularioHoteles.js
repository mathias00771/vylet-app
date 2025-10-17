import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import InformacionBasica from '../../componentes/componentesFormulario/InformacionBasica';
import RedesContacto from '../../componentes/componentesFormulario/RedesContacto';
import Imagenes from '../../componentes/componentesFormulario/Imagenes';
import Servicios from '../../componentes/componentesFormulario/Servicios';
import Ubicacion from '../../componentes/componentesFormulario/Ubicacion';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../../../contextos/authProvider';
import { useAdmin } from '../../../../contextos/AdminProvider';
import { API_URL } from '@env';

export default function FormularioHoteles({ onCancelForm }) {
  const [step, setStep] = useState(1);
  const { identificadorCi } = useAuth();
  const { region } = useAdmin();

  const [formData, setFormData] = useState({
    nombre: '',
    pais: '',
    ciudad: '',
    celular: '',
    descripcion: '',
    presioMin: '',
    presioMax: '',
    facebook: '',
    instagram: '',
    tiktok: '',
    paginaWeb: '',
    whatsapp: '',
    contacto: '',
    imagenes: { banner: null, portada: null, otras: [] },
    serviciosSeleccionados: [],
    direccion: '',
    address: '',
  });

  const avanzar = () => {
    if (step === 1) {
      const { nombre, pais, ciudad, celular, descripcion, presioMin, presioMax } = formData;
      if (!nombre || !pais || !ciudad || !celular || !descripcion || !presioMin || !presioMax) {
        Alert.alert('❌', 'Completa todos los campos del paso 1.');
        return;
      }
    }
    if (step === 3) {
      const { imagenes } = formData;
      if (!imagenes.banner?.uri || !imagenes.portada?.uri) {
        Alert.alert('❌', 'Selecciona al menos Banner y Portada.');
        return;
      }
    }
    if (step === 5) {
      if (!region?.latitude || !region?.longitude || !formData.address) {
        Alert.alert('❌', 'Selecciona una ubicación válida en el mapa.');
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const retroceder = () => setStep((prev) => prev - 1);

  const seleccionarImagenes = async (tipo) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita acceso a la galería.');
        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: tipo === 'otras',
        quality: 1,
      });

      if (resultado.canceled || !resultado.assets || resultado.assets.length === 0) return;

      if (tipo === 'banner') {
        setFormData((prev) => ({
          ...prev,
          imagenes: { ...prev.imagenes, banner: resultado.assets[0] },
        }));
      } else if (tipo === 'portada') {
        setFormData((prev) => ({
          ...prev,
          imagenes: { ...prev.imagenes, portada: resultado.assets[0] },
        }));
      } else if (tipo === 'otras') {
        if (resultado.assets.length > 10) {
          Alert.alert('Máximo 10 imágenes permitidas');
          return;
        }
        setFormData((prev) => ({
          ...prev,
          imagenes: { ...prev.imagenes, otras: resultado.assets },
        }));
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  };

  const guardarHotel = async () => {
    const {
      nombre, descripcion, pais, presioMin, presioMax, imagenes,
      ciudad, celular, facebook, instagram, tiktok, paginaWeb,
      whatsapp, contacto, serviciosSeleccionados, direccion, address
    } = formData;

    if (
      !nombre || !descripcion || !pais ||
      !region?.latitude || !region?.longitude ||
      !presioMin || !presioMax ||
      !imagenes.banner?.uri || !imagenes.portada?.uri
    ) {
      Alert.alert('❌', 'Por favor completa todos los campos obligatorios.');
      return;
    }

    try {
      const formDataToSend = new FormData();
      const rangoPresio = `${presioMin} - ${presioMax}`;
      formDataToSend.append('nombre_hotel', nombre.trim());
      formDataToSend.append('prec_hotel', rangoPresio);
      formDataToSend.append('ciud_hotel', ciudad.trim());
      formDataToSend.append('celu_hotel', celular.trim());
      formDataToSend.append('comen_hotel', descripcion.trim());
      formDataToSend.append('face_hotel', facebook.trim());
      formDataToSend.append('inta_hotel', instagram.trim());
      formDataToSend.append('What_hotel', whatsapp.trim());
      formDataToSend.append('tiktok_hotel', tiktok.trim());
      formDataToSend.append('pagina_hotel', paginaWeb.trim());
      formDataToSend.append('contacto_hotel', contacto.trim());
      formDataToSend.append('lati_hotel', region.latitude.toString());
      formDataToSend.append('long_hotel', region.longitude.toString());
      formDataToSend.append('ciregistro_hotel', identificadorCi);
      formDataToSend.append('pais', pais.trim());
      formDataToSend.append('servicios_hotel', JSON.stringify(serviciosSeleccionados));
      formDataToSend.append('direccion_hotel', address.trim());

      const getMimeType = (uri) => uri.endsWith('.png') ? 'image/png' : 'image/jpeg';

      if (imagenes.banner?.uri?.startsWith('file://')) {
        formDataToSend.append('baner_hotel', {
          uri: imagenes.banner.uri,
          name: 'banner.jpg',
          type: getMimeType(imagenes.banner.uri),
        });
      }
      if (imagenes.portada?.uri?.startsWith('file://')) {
        formDataToSend.append('portada_hotel', {
          uri: imagenes.portada.uri,
          name: 'portada.jpg',
          type: getMimeType(imagenes.portada.uri),
        });
      }

      imagenes.otras.forEach((img, index) => {
        if (img?.uri?.startsWith('file://')) {
          formDataToSend.append(`img${index + 1}_hot`, {
            uri: img.uri,
            name: `img${index + 1}.jpg`,
            type: getMimeType(img.uri),
          });
        }
      });

      const res = await fetch(`${API_URL}/hoteles`, {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await res.json();
      Alert.alert('✅', result.mensaje);
      onCancelForm();
    } catch (error) {
      console.error(error);
      Alert.alert('❌', 'Error al guardar hotel');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
      {step === 1 && (
        <InformacionBasica data={formData} setData={setFormData} onNext={avanzar} />
      )}
      {step === 2 && (
        <RedesContacto data={formData} setData={setFormData} onNext={avanzar} onBack={retroceder} />
      )}
      {step === 3 && (
        <Imagenes data={formData} setData={setFormData} onNext={avanzar} onBack={retroceder} seleccionarImagenes={seleccionarImagenes} />
      )}
      {step === 4 && (
        <Servicios data={formData} setData={setFormData} onNext={avanzar} onBack={retroceder} />
      )}
      {step === 5 && (
        <Ubicacion data={formData} setData={setFormData} onSubmit={guardarHotel} onBack={retroceder} onCancel={onCancelForm} />
      )}
    </ScrollView>
  );
}
