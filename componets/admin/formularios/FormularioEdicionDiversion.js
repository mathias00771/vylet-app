import { API_URL } from '@env';
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    Alert,
    ScrollView
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/FontAwesome5'
import * as ImagePicker from 'expo-image-picker';
import { useAdmin } from '../../../contextos/AdminProvider';
import { useAuth } from '../../../contextos/authProvider';
import { Picker } from '@react-native-picker/picker';
import { SERVICIOS } from '../../../utils/Servicios';
import CargandoOverlay from '../../CargandoOverlay'

import { SafeAreaView } from 'react-native-safe-area-context';

const GridFotos = ({ id, onChange }) => {
    const { diversiones } = useAdmin();
    const [banner, setBanner] = useState(null);
    const [portada, setPortada] = useState(null);
    const [otras, setOtras] = useState([]);

    const seleccionarImagenes = async (tipo) => {
        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: tipo === 'otras',
            quality: 1,
        });

        if (!resultado.canceled) {
            if (tipo === 'banner') setBanner(resultado.assets[0]);
            else if (tipo === 'portada') setPortada(resultado.assets[0]);
            else if (tipo === 'otras') setOtras(resultado.assets);
        }
    };

    const handleFotos = () => {
        const diversionSeleccionada = diversiones.find((c) => c.id_diver === id);
        if (diversionSeleccionada) {
            
            if (diversionSeleccionada.baner_diver.length !== 0) {
                setBanner({ uri: diversionSeleccionada?.baner_diver || '' })
            }
            if (diversionSeleccionada.portada_diver.length !== 0 ) {
                setPortada({ uri: diversionSeleccionada?.portada_diver  || ''})
            }
            const imagenes = [
                { uri: diversionSeleccionada?.img1_diver.length !== 0 ? diversionSeleccionada?.img1_diver : '' },
                { uri: diversionSeleccionada?.img2_diver.length !== 0 ? diversionSeleccionada?.img2_diver : '' },
                { uri: diversionSeleccionada?.img3_diver.length !== 0 ? diversionSeleccionada?.img3_diver : '' },
                { uri: diversionSeleccionada?.img4_diver.length !== 0 ? diversionSeleccionada?.img4_diver : '' },
                { uri: diversionSeleccionada?.img5_diver.length !== 0 ? diversionSeleccionada?.img5_diver : '' },
            ].filter((img) => img.uri)
            if (imagenes.length !== 0) {
                setOtras(imagenes)
            }
        }
    }

    const solicitarPermisos = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Necesitas permitir acceso a tus fotos.');
        }
    };
    useEffect(() => {
        solicitarPermisos();
        handleFotos()
    }, []);

    useEffect(() => {

        onChange({ banner, portada, otras });
    }, [banner, portada]);


    return (
        <View style={styles.container}>
            <Text style={styles.titles}>Fotos</Text>

            <View style={styles.containerBoxes}>
                <TouchableOpacity
                    style={styles.touchableItemImageTotally}
                    onPress={() => seleccionarImagenes('banner')}
                >
                    {banner ? (
                        <Image source={{ uri: banner?.uri }} style={styles.banner} />
                    ) : (
                        <Text style={{ color: '#fff' }}>Banner</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.containerBoxes}>
                <TouchableOpacity
                    style={styles.touchableItemImageTotally}
                    onPress={() => seleccionarImagenes('portada')}
                >
                    {portada ? (
                        <Image source={{ uri: portada?.uri }} style={styles.portada} />
                    ) : (
                        <Text style={{ color: '#fff' }}>Portada</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.containerBoxes}>
                <TouchableOpacity
                    style={styles.touchableItemImage}
                    onPress={() => seleccionarImagenes('otras')}
                >
                    <Text style={{ color: '#fff' }}>Subir más fotos</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.grid}>
                {otras.map((img, index) => (
                    <View key={index} style={styles.item}>
                        <Image source={{ uri: img?.uri }} style={styles.image} />
                    </View>
                ))}
            </View>
        </View>
    );
};

function FormularioEdicionDiversion({ onCancelForm }) {
    const { identificadorCi } = useAuth();
    const route = useRoute();
    const { id } = route.params;
    const { region, buscarDireccion, direccion, setDireccion, setRegion, setCargando, cargando, diversiones } = useAdmin();

    const [imagenes, setImagenes] = useState({ banner: null, portada: null, otras: [] });
    const [nombre, setNombre] = useState('');
    const [banner, setBanner] = useState(null); // imagen
    const [portada, setPortada] = useState(null); // imagen
    const [descripcion, setDescripcion] = useState('');
    const [pais, setPais] = useState('');
    const [provincia, setProvincia] = useState('');
    const [facebook, setFacebook] = useState('');
    const [instagram, setInstagram] = useState('');
    const [paginaWeb, setPaginaWeb] = useState('');
    const [tiktok, setTiktok] = useState('');
    const [whatsapp, setWhatsapp] = useState('');

    const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);

    const handleInformacion = () => {
        const diversionSeleccionada = diversiones.find((c) => c.id_diver === id);



        if (!diversionSeleccionada && !diversiones[id]) { console.log("No hay id o no hay diversiones por favor verifica"); return }
        const servicios = "Wi-Fi,Parqueadero,Comida,Zona infantil";
        const arrayServicios = servicios.split(',');

        setNombre(diversionSeleccionada.nombre_diver);
        setPais(diversionSeleccionada.pais)
        setProvincia(diversionSeleccionada.provin_ciud)
        setDescripcion(diversionSeleccionada.descrip_diver)
        setServiciosSeleccionados(arrayServicios)

    };


    const toggleServicio = (servicio) => {
        const nuevos = serviciosSeleccionados.includes(servicio)
            ? serviciosSeleccionados.filter((s) => s !== servicio)
            : [...serviciosSeleccionados, servicio];

        setServiciosSeleccionados(nuevos);
    };


    const mapRef = useRef(null);

    const guardarDiversion = async () => {
        setCargando(true)
        try {
            const formData = new FormData();
            formData.append('nombre_diver', nombre);
            formData.append('descrip_diver', descripcion);
            formData.append('serv_dive', serviciosSeleccionados);
            formData.append('latitud_ciud', region.latitude.toString());
            formData.append('long_ciud', region.longitude.toString());
            formData.append('ci_diver', identificadorCi);
            formData.append('pais', pais || '');
            formData.append('provin_ciud', provincia || '');


            const { banner, portada, otras } = imagenes;
            if (banner) {
                formData.append('baner_diver', {
                    uri: banner.uri,
                    name: 'banner.jpg',
                    type: 'image/jpeg',
                });
            }

            if (portada) {
                formData.append('portada_diver', {
                    uri: portada.uri,
                    name: 'portada.jpg',
                    type: 'image/jpeg',
                });
            }


            if (otras) {
                otras.forEach((img, index) => {
                    if (img?.uri) {
                        formData.append(`img${index + 1}_diver`, {
                            uri: img.uri,
                            name: `img${index + 1}.jpg`,
                            type: 'image/jpeg',
                        });
                    }
                });
            }

            // formData._parts.forEach(([key, value]) => {
            //     if (Array.isArray(value)) {
            //         console.log(`🔹 ${key}: [${value.join(', ')}]`);
            //     } else if (typeof value === 'object' && value?.uri) {
            //         console.log(`🖼️ ${key}: { uri: ${value.uri}, name: ${value.name}, type: ${value.type} }`);
            //     } else {
            //         console.log(`🔸 ${key}: ${value}`);
            //     }
            // });


            const res = await fetch(`${API_URL}/diversion`, {
                method: 'POST',
                body: formData,

            });

            const result = await res.json();
            Alert.alert('✅', result.mensaje);
            setCargando(false)
            onCancelForm(); // cerrar formulario
        } catch (error) {
            console.error(error);
            Alert.alert('❌', 'Error al guardar ciudad');
        }
    };
    useEffect(() => {
        handleInformacion()
    }, [])

    if (cargando) { return (<CargandoOverlay />) }

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
            <ScrollView>
                <View style={{ padding: 10 }}>
                    <Text style={{ ...styles.titles, fontSize: 18, marginBottom: 30 }}>Formulario para diversion</Text>

                    <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Nombre de la diversion" placeholderTextColor="#aaa" />
                    <TextInput style={styles.input} value={pais} onChangeText={setPais} placeholder="País" placeholderTextColor="#aaa" />
                    <TextInput style={styles.input} value={provincia} onChangeText={setProvincia} placeholder="Provincia de la diversion" placeholderTextColor="#aaa" />

                    <TextInput style={[styles.input, { height: 100 }]} value={descripcion} onChangeText={setDescripcion} placeholder="Descripción" placeholderTextColor="#aaa" multiline />
                    <View style={styles.containerNetworks}>
                        <View style={styles.rowNetworks}>
                            <Icon name="facebook" size={27} color="#007AFF" />
                            <TextInput
                                style={{ ...styles.input, width: '90%', marginBottom: 0 }}
                                value={facebook}
                                onChangeText={setFacebook}
                                placeholder="https://facebook.com/tu-pagina"
                                placeholderTextColor="#747474ff"
                            />
                        </View>
                        <View style={styles.rowNetworks}>
                            <Icon name="instagram" size={25} color="#C13584" />
                            <TextInput
                                style={{ ...styles.input, width: '90%', marginBottom: 0 }}
                                value={instagram}
                                onChangeText={setInstagram}
                                placeholder="https://instagram.com/tu-pagina"
                                placeholderTextColor="#747474ff"
                            />
                        </View>
                        <View style={styles.rowNetworks}>
                            <Icon2 name="tiktok" size={20} color="#FE2C55" />
                            <TextInput
                                style={{ ...styles.input, width: '90%', marginBottom: 0 }}
                                value={tiktok}
                                onChangeText={setTiktok}
                                placeholder="https://instagram.com/tu-pagina"
                                placeholderTextColor="#747474ff"
                            />
                        </View>
                        <View style={styles.rowNetworks}>
                            <Icon name="globe" size={20} color="#ffffffff" />
                            <TextInput
                                style={{ ...styles.input, width: '90%', marginBottom: 0 }}
                                value={paginaWeb}
                                onChangeText={setPaginaWeb}
                                placeholder="https://tupaginaweb.com"
                                placeholderTextColor="#747474ff"
                            />
                        </View>
                        <View style={styles.rowNetworks}>
                            <Icon name="whatsapp" size={20} color="#25D366" />
                            <TextInput
                                style={{ ...styles.input, width: '90%', marginBottom: 0 }}
                                value={whatsapp}
                                onChangeText={setWhatsapp}
                                placeholder="Ingresa tu numero de whatsapp"
                                placeholderTextColor="#747474ff"
                            />
                        </View>

                    </View>

                    <GridFotos onChange={setImagenes} id={id} />

                    <View>
                        <Text style={styles.label}>Servicios disponibles</Text>
                        <View style={styles.grid}>
                            {SERVICIOS.map((servicio) => (
                                <TouchableOpacity
                                    key={servicio}
                                    style={[
                                        styles.checkboxItem,
                                        serviciosSeleccionados.includes(servicio) && styles.checkboxItemSelected,
                                    ]}
                                    onPress={() => toggleServicio(servicio)}
                                >
                                    <Text style={styles.checkboxText}>{servicio}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <Text style={styles.titles}>Ubicación</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center', marginTop: 5 }}>
                        <TextInput style={{ ...styles.input, width: '85%' }} placeholder="Buscar dirección..." value={direccion} onChangeText={setDireccion} placeholderTextColor="#aaa" />
                        <TouchableOpacity style={{ ...styles.saveButton, width: '13%', borderRadius: '20%' }} onPress={buscarDireccion}>
                            <Icon name="search" size={15} color="#fff" />
                        </TouchableOpacity>
                    </View>



                    <MapView
                        ref={mapRef}
                        provider="google"
                        style={{ height: 200, marginVertical: 20 }}
                        region={region}
                        onPress={(e) => {
                            const { latitude, longitude } = e.nativeEvent.coordinate;
                            setCiudadData({ ...ciudadData, latitud_ciudad: latitude, longitud_ciudad: longitude });
                            setRegion({ ...region, latitude, longitude });
                        }}
                    >
                        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
                    </MapView>

                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={{ ...styles.saveButton, width: '48%', marginRight: '4%' }}
                            onPress={guardarDiversion}
                        >
                            <Text style={styles.saveText}>Guardar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ ...styles.saveButton, width: '48%', backgroundColor: '#e74c3c' }}
                            onPress={onCancelForm}
                        >
                            <Text style={styles.saveText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>

    );
}

export default FormularioEdicionDiversion;


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0a1a2f',
    },
    scrollContent: {
        padding: 20,
    },
    titles: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
        margin: 5,
    },
    pickerContainer: {
        backgroundColor: '#ffffff1e',
        borderRadius: 8,
        marginBottom: 16,
    },
    picker: {
        color: '#fff',
        marginHorizontal: 10,
    },
    saveText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#2ecc71',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#ffffff1e',
        color: '#fff',
        padding: 10,
        borderRadius: 8,
        marginBottom: 16,
        fontSize: 14,

    },
    container: {
        padding: 5,
    },
    label: {
        color: '#d8d8d8ff',
        fontSize: 13,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    banner: {
        width: '100%',
        height: 140,
        borderRadius: 12,

    },
    portada: {
        width: '100%',
        height: 140,
        borderRadius: 12,

    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 10
    },
    item: {
        width: '40%',
        aspectRatio: 1,
        marginBottom: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',


    },
    touchableItemImageTotally: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff1e',
        height: 140,
        borderRadius: 12,
    },

    touchableItemImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff1e',
        height: 50,
        borderRadius: 12,
    },
    containerBoxes: {
        marginBottom: 20,

    },
    rowNetworks: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'center',
        gap: 10,
        width: '100%',
        justifyContent: 'center'
    },
    containerNetworks: {
        gap: 10,
        marginVertical: 10,
        height: 300
    },
    checkboxItem: {
        backgroundColor: '#ffffff1e',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    checkboxItemSelected: {
        backgroundColor: '#2ecc71',
    },
    checkboxText: {
        color: '#fff',
        fontSize: 14,
    },

});
