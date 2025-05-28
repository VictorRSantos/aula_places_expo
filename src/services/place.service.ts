import AsyncStorage from '@react-native-async-storage/async-storage';
import { Place } from '../models/place.model';

const PLACE_DOC__KEY = 'place_doc_key';

class PlaceService {

    private async setList(places: Place[]) {
        try {
            const json = JSON.stringify(places);
            await AsyncStorage.setItem(PLACE_DOC__KEY, json);            
        } catch (error) {
            console.error('Error saving places:', error);
        }
    }

    private equals(p1: Place, p2: Place) {
        return p1.latitude === p2.latitude && p1.longitude === p2.longitude;
    }

    public async getList(){
        const json = await AsyncStorage.getItem(PLACE_DOC__KEY);
        
        if(json) return JSON.parse(json) as Place[];

        return [] as Place[];
    }

    public async save(place: Place) {
        const places = await this.getList();

        const saved = places.find(p => this.equals(p, place));

        if(saved) {
            // Update existing place
            saved.name = place.name;
            saved.description = place.description;
        } else {
            // Add new place
            places.push(place);
        }

        await this.setList(places);

    }

    public async remove(place: Place) {
        let places = await this.getList();
                
        places = places.filter(p => this.equals(p, place));

        await this.setList(places);        
    }
}

const placeRepo = new PlaceService();
export default placeRepo;