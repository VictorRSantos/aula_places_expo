import React from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import{ StatusBar } from 'expo-status-bar';
import {NavigationProp, useNavigation} from '@react-navigation/native';

import MapView, { LongPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';


export default function HomePage(){

    const navigation = useNavigation<NavigationProp<any>>();

    React.useEffect(() => {
        navigation.setOptions({headerShown: false,
            title: 'Nosso mapa'
        })
    }, [])

    const [location, setLocation] =  React.useState<Location.LocationObject>();
    
    async function getCurrentLocation() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if(status !== 'granted'){
            Alert.alert('Permission to access Location was denied');
            return;
        }

        setLocation(await Location.getCurrentPositionAsync({}))
    }

    React.useEffect(() => {
        getCurrentLocation()
    },[]);   

    function goToPlacePage(event: LongPressEvent){
        const coord = event.nativeEvent.coordinate;
        navigation.navigate('Place', coord );
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
                onLongPress={goToPlacePage}
            />

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