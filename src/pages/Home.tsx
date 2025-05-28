import React from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import{ StatusBar } from 'expo-status-bar';
import {NavigationProp, useFocusEffect, useNavigation} from '@react-navigation/native';

import MapView, { LongPressEvent, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Place } from '../models/place.model';
import placeRepo from '../services/place.service';


export default function HomePage(){

    const navigation = useNavigation<NavigationProp<any>>();

    React.useEffect(() => {
        navigation.setOptions({headerShown: false})
    }, [])

    const [location, setLocation] =  React.useState<Location.LocationObject>();
    const [places, setPlaces] = React.useState<Place[]>([]);

    async function getCurrentLocation() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if(status !== 'granted'){
            Alert.alert('Permission to access Location was denied');
            return;
        }

        setLocation(await Location.getCurrentPositionAsync({}))
    }

    async function fetchPlaces() {        
        setPlaces(await placeRepo.getList());
    }

    React.useEffect(() => {
        getCurrentLocation()
        fetchPlaces();
    },[]);   

    useFocusEffect(() => {
        fetchPlaces();
    })

    function goToPlacePage(event: LongPressEvent){
        const coord = event.nativeEvent.coordinate;
        navigation.navigate('Place', coord );
    }

    function editPlacePage(place: Place) {
        navigation.navigate('Place', place);
    }

    
    return(
        <View style={ styles.container }>
            <StatusBar style="auto" />
            <MapView 
                style={styles.map}
                showsUserLocation={true}
                initialCamera={location && {
                    center: location.coords,
                    heading: 0, pitch: 0, zoom: 15
                }}
                onLongPress={goToPlacePage}>
                {places.map((place, index) => (
                    <Marker
                        key={index}
                        title={place.name}
                        onCalloutPress={() => editPlacePage(place)}
                        coordinate={{latitude: place.latitude, longitude: place.longitude}}
                        description={place.description}
                    />
                ))}

                </MapView>
            
        </View>
    )
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,       
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: '100%',
        height: '100%',
    }
});