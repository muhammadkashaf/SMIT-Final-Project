import React, { Component } from "react";
import { View, ScrollView, StyleSheet, AsyncStorage, TouchableOpacity, Text, TextInput, Picker, Button, Image } from "react-native";
import firebase from 'firebase/app';
import {  Permissions, Location, ImagePicker } from 'expo';
import marker from '../../assets/icons8-marker.png';
import 'firebase/firestore';
import Loader from "../Loader/Loader";
import { Avatar } from 'react-native-elements';



export default class Dashboard extends Component {


    constructor(props) {
        super(props);

        this.state = ({
            loading: true,
            // availible: false,
            // isMapReady: false,
            // latitude: 24.0000000,
            // longitude: 66.0000000,
            // latitudeDelta: 0.02,
            // longitudeDelta: 0.02,
            // condition: false,
            designation: "service1",
            service: "user",
            phone: null,
            name: null,
            image: '',
            cate: []
        })
    }

    async componentWillMount(){

        const db = firebase.firestore();

        const user = await AsyncStorage.getItem('userToken');
        this.setState({uid: user});
        
        db.collection("categories").get().then(ca =>{
            ca.docs.forEach(cat =>{

                var a = {name:cat.data().name}
                this.setState({
                    cate: [...this.state.cate,a]
                })
            })
        })

        db.collection('users').where('uid','==',user).get().then(res =>{
            // alert(user)
            if (res.size) {
                
                
                res.docs.forEach(data =>{
                    if (data.data().user) {

                        this.setState({
                            loading: false,
                            availible: true, 
                            name: data.data().name, 
                            phone: data.data().phone, 
                            image: data.data().image,
                            // latitude: data.data().latitude,
                            // longitude: data.data().longitude,
                            designation: 'User'
                        })

                    } else {
                        
                        this.setState({
                            loading: false,
                            availible: true, 
                            name: data.data().name, 
                            phone: data.data().phone, 
                            image: data.data().image,
                            // latitude: data.data().latitude,
                            // longitude: data.data().longitude,
                            designation: 'Service Provider',
                            services: true,
                            service: data.data().service
                        })

                    }
                })
                
                
                
            } else {
                this.setState({loading: false});
            }
            
        })

    }

    // componentDidMount() {
    //     this._getLocationAsync()
    // }

    signOut = async () => {
        AsyncStorage.clear();
        this.props.navigation.navigate('login');
    }

    // _getLocationAsync = async () => {
    //     let { status } = await Permissions.askAsync(Permissions.LOCATION);
    //     await Permissions.askAsync(Permissions.CAMERA_ROLL);
    //     await Permissions.askAsync(Permissions.CAMERA);
    //     if (status !== 'granted') {
    //         this.setState({
    //             errorMessage: 'Permission to access location was denied',
    //         });
    //     }

    //     let location = await Location.getCurrentPositionAsync({});
    //     this.setState({ location, condition: true });
    //     console.log('current location===', location)

    // };


    // onMapLayout = () => {
    //     this.setState({ isMapReady: true });
    // }


    // onRegionChange = region => {
    //     this.setState({
    //         region
    //     })
    // }

    submit = () => {
        const {uid, phone, designation, service, name, image, location} = this.state;
        const db = firebase.firestore();
        // alert(designation)
        if (!phone || !designation || !name || !image || !location) {
            alert('Please fill all the fields','',"error");
        } else {
            
            if (designation == "service provider" && !service) {
                alert('Please select Service','',"error");
            } else {
                
                if (designation == "sp") {
                    
                    db.collection('users').add({
                        uid,
                        name,
                        phone,
                        serviceProvider: true,
                        service,
                        user: false,
                        image,
                        location,
                        // longitude: this.state.region.longitude,
                        // latitude: this.state.region.latitude
                    }).then(() =>{
                        alert("Data inserted successfully");
                        this.componentWillMount()
                    })

                } else {
                    
                    db.collection('users').add({
                        uid,
                        name,
                        phone,
                        image,
                        user: true,
                        location,
                        serviceProvider: false,
                        // longitude: this.state.region.longitude,
                        // latitude: this.state.region.latitude
                    }).then(() =>{
                        alert("Data inserted successfully");
                        this.componentWillMount()
                    })

                }

            }

        }
    }

    onChangeText = (key, val) => {
        this.setState({ [key]: val})
      }

    _pickImage = async () => {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });

        this._handleImagePicked(pickerResult);
    };

    _handleImagePicked = async pickerResult => {
        try {
            this.setState({ uploading: true });

            if (!pickerResult.cancelled) {
                uploadUrl = await uploadImageAsync(pickerResult.uri);
                console.log('image  ===>>>', uploadUrl)
                this.setState({ image: uploadUrl });
            }
        } catch (e) {
            console.log(e);
            alert('Upload failed, sorry :(');
        } finally {
            this.setState({ uploading: false });
        }
    };  


    render() {
        const { availible, designation, phone, name, service, services, image, loading, location, cate } = this.state;

        return (
            <ScrollView scrollEventThrottle={16}>
            {!loading ?
                <View>
                {!availible ?
                <View style={styles.container}>
                    <View style={styles.first}>
                        {image ? 
                        <Avatar rounded size="xlarge" source={{ uri: image }} />
                        :
                        <View>
                            <Text style={styles.text}>Please Upload Your Image</Text>
                            <Button style={styles.input} title='upload image' onPress={this._pickImage} />
                        </View>
                        }
                    </View>                            
                    <View style={styles.second}>
                        <Text style={styles.text}>Your Name:</Text>
                        <TextInput placeholder="Enter Your Name" onChangeText={val => this.onChangeText('name', val)} value={name} style={styles.input} />
                    </View>
                    <View style={styles.second}>
                        <Text style={styles.text}>Your Phone:</Text>
                        <TextInput placeholder="Enter Your Phone" keyboardType="numeric" onChangeText={val => this.onChangeText('phone', val)} value={phone} style={styles.input} />
                    </View>
                    <View style={styles.second}>
                        <Text style={styles.text}>Your Location:</Text>
                        <TextInput placeholder="Enter Your Location name" onChangeText={val => this.onChangeText('location', val)} value={location} style={styles.input} />
                    </View>
                    <View style={styles.second}>
                        <Text style={styles.text}>Select:</Text>
                        <Picker
                            selectedValue={designation}
                            style={{ height: 50, width: 250 }}
                            onValueChange={(val, itemIndex) =>
                                this.setState({ designation: val })
                            }>
                            <Picker.Item label="User" value="user" />
                            <Picker.Item label="Service Provider" value="sp" />
                        </Picker>
                    </View>
                    {designation == "sp" &&
                        <View style={styles.second}>
                            <Text style={styles.text}>Services:</Text>
                            <Picker
                                selectedValue={this.state.service}
                                style={{ height: 50, width: 250 }}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({ service: itemValue })
                                }>
                                {/* {cate && cate.map((item,index) =>
                                    <Picker.Item key={index} label={item.name} value={item.name} /> */}
                                )} 

                                {/* <Picker.Item label="Transport" value="transport" />
                                <Picker.Item label="Electrician" value="electric" />
                                <Picker.Item label="Laundry" value="laundry" />
                                <Picker.Item label="Plumber" value="plumber" />
                                <Picker.Item label="Cleaning" value="cleaning" /> */}
                                
                            </Picker>
                        </View>
                    }
                    <Text style={styles.text}>Select location:</Text>
                    <View >
                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        </View>
                        {/* {this.state.condition &&
                            <View> */}
                                {/* <MapView showsBuildings
                                    style={{ flex: 2, height: 200, width: 250 }}
                                    initialRegion={{
                                        latitude: this.state.location.coords.latitude,
                                        longitude: this.state.location.coords.longitude,
                                        latitudeDelta: 0.00358723958820065,
                                        longitudeDelta: 0.00250270688370961,
                                    }}
                                    onRegionChangeComplete={this.onRegionChange}
                                >

                                </MapView> */}
                                {/* <View style={styles.markerFixed}>
                                    <Image style={styles.marker} source={marker} />
                                </View>
                            </View>} */}

                    </View>


                    <View>
                        <TouchableOpacity style={styles.btn}>
                            <Text style={styles.btn_text} onPress={this.submit}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                :
                <View style={styles.table1}>
                    <Avatar rounded size="xlarge" source={{ uri: image }} />
                    <View style={styles.table}>
                        <View style={styles.tableStyle}><Text style={{fontSize: 20 }}>Name:</Text></View>
                        <View style={styles.tableStyle}><Text style={{fontSize: 20 }}>{name}</Text></View>
                    </View>
                    <View style={styles.table}>
                        <View style={styles.tableStyle}><Text style={{fontSize: 20 }}>Phone:</Text></View>
                        <View style={styles.tableStyle}><Text style={{fontSize: 20 }}>{phone}</Text></View>
                    </View>
                    <View style={styles.table}>
                        <View style={styles.tableStyle}><Text style={{fontSize: 20 }}>Designation:</Text></View>
                        <View style={styles.tableStyle}><Text style={{fontSize: 20 }}>{designation}</Text></View>
                    </View>
                    {services && 
                    <View style={styles.table}>
                    <View style={styles.tableStyle}><Text style={{fontSize: 20 }}>Service:</Text></View>
                    <View style={styles.tableStyle}><Text style={{fontSize: 20 }}>{service}</Text></View>
                    </View>}
                    {/* <View style={styles.table}>
                        <View style={styles.tableStyle}><Text style={{fontSize: 20 }}>Latitude:</Text></View>
                        <View style={styles.tableStyle}><Text style={{fontSize: 16 }}>{latitude}</Text></View>
                    </View>
                    <View style={styles.table}>
                        <View style={styles.tableStyle}><Text style={{fontSize: 20 }}>Longitude:</Text></View>
                        <View style={styles.tableStyle}><Text style={{fontSize: 16 }}>{longitude}</Text></View>
                    </View> */}
                </View>}      
                  
                  <Button style={{marginTop: 30,}} title='SignOut' onPress={this.signOut}/>

                </View>
                :
                <Loader />
                }   
            </ScrollView>
        );
    }
}

async function uploadImageAsync(uri) {
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });
    console.log('this is blob =>>', blob)

    const ref = firebase.storage().ref().child("images/" + Math.random().toString().substring(2, 6))
    const snapshot = await ref.put(blob);

    const url = snapshot.ref.getDownloadURL();
    console.log('this url ==>>', url)
    // blob.close();


    return await snapshot.ref.getDownloadURL();
}


const styles = StyleSheet.create({
    // map: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     paddingTop: Expo.Constants.statusBarHeight,
    //     backgroundColor: '#ecf0f1',
    //     padding: 5,
    //     marginTop: 20
    // },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btn: {
        width: 120,
        height: 50,
        marginTop: 40,
        borderRadius: 5,
        backgroundColor: '#28a745'
    },
    btn_text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: '500',
        alignSelf: 'center'
    },
    first: {
        marginTop: 60,
    },
    second: {
        marginTop: 40,
    },
    text: {
        fontSize: 20
    },
    input: {
        height: 40,
        width: 250,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        // borderRadius: 5,
        fontSize: 20
    },
    // markerFixed: {
    //     left: '50%',
    //     marginLeft: -24,
    //     marginTop: -48,
    //     position: 'absolute',
    //     top: '50%'
    // },
    // marker: {
    //     height: 48,
    //     width: 48
    // },
    table1: {
        flex: 1, 
        alignSelf: 'center',
        alignItems: 'center', 
        borderRadius: 5,
        borderWidth:1, 
        borderColor: 'grey', 
        marginTop: 50 
    },
    table: {
        flex: 1, 
        alignSelf: 'center', 
        flexDirection: 'row', 
        borderRadius: 5,
        borderWidth:1, 
        borderColor: 'grey', 
        marginTop: 20
    },
    tableStyle:{ 
        flex: 1, 
        alignSelf: 'center', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: 30, 
        borderWidth:1, 
        borderRadius: 5, 
        borderColor: 'grey'
    }
});