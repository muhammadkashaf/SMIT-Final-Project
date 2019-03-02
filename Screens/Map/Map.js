import * as React from 'react';
import { Text, View, StyleSheet,AsyncStorage} from 'react-native';
import {MapView} from 'expo';



export default class Maap extends React.Component {

state ={
  latitude:24.0000000,
  longitude:66.0000000,
  condition:false
}




  

_getLocationAsync = async () => {

    //++++ this is use for getting current location if you are not save in anyncStorage....

    // let { status } = await Expo.Permissions.askAsync(Expo.Permissions.LOCATION);
    // if (status !== 'granted') {
    //   this.setState({
    //     errorMessage: 'Permission to access location was denied',
    //   });
    // }

    // let location = await Expo.Location.getCurrentPositionAsync({});
    // this.setState({ location ,condition:true });
    // console.log('current location===',location)


    //+++this is data for giting priviously save current location of the user ..

    await AsyncStorage.getItem('userLocation')
    .then(req => JSON.parse(req)) 
    .then(location => {console.log('geting location');this.setState({location,condition:true})})
    .catch(error => console.log('error!'));
    
  }; 

  

 


// componentDidMount(){
//   this._getLocationAsync()
// }

  render() {
  

    return (
      <View style={styles.container}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        
      </View>
       {this.state.condition && <MapView 
        style={{flex:8}}
        initialRegion={{
          latitude:this.state.location.coords.latitude,
          longitude:this.state.location.coords.longitude,
          latitudeDelta: 0.0922 ,
          longitudeDelta: 0.0421 ,
        }}
        >

        <MapView.Marker
        coordinate={this.state.location.coords}
        title={'Your Location'}
        pinColor={'black'}
        />


        {/* here you pput the latitude and longitude of services provider */}
        <MapView.Marker
        coordinate={{latitude:24.9387003,longitude:66.9935333}}
        title={'service provider'}
        />

        </MapView>}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  
});