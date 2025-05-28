import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import {Button, StyleSheet, TextInput, View, Text, Alert} from 'react-native';
import { LatLng } from 'react-native-maps';
import { Place } from '../models/place.model';
import placeRepo from '../services/place.service';

export default function PlacePage(){

  const navigate = useNavigation();
  const route = useRoute();

  const coords = route.params as Place

  const [name, setName] = React.useState(coords.name ? coords.name : '');
  const [description, setDescription] = React.useState(coords.description ? coords.description : '');

  async function save(){
    if(!name ||name === ''){
      Alert.alert('Nome é obrigatorio');
      return;
    } 

    const place: Place = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      name, description
    }

    placeRepo.save(place).then(() => {
      navigate.goBack();
    })
  }
  return (
    <View style={styles.container}>
      <View>
        <Text>Latitude: {coords.latitude}</Text>
        <Text>Longitude: {coords.longitude}</Text>
      </View>

      <Text style={styles.label}>Informe o nome do novo local</Text>     
      
      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          value={name}
          placeholder='Informe o nome do local'
          autoFocus={true}
          onChangeText={setName}
          />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputDesc}
          multiline numberOfLines={10}
          placeholder='Informe a descrição do local'
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
          />
      </View>

      <View style={styles.buttonView}>
        <Button title="Salvar" onPress={save} />
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    padding: 20,
  },
  label:{
    padding: 20,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  }, 
  inputView:{
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  input: {
    height: 40,    
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  inputDesc: {
    height: 160,    
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
    textAlign:'justify'
  },
  buttonView:{
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
})
