import React, { Component } from "react";
import { View, StyleSheet, Dimensions, Image, TouchableHighlight, AsyncStorage, ScrollView, } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
// import { Icon } from 'react-native-elements'
import {ImagePicker,Permissions} from 'expo';
import { Text, SearchBar } from 'react-native-elements';
import firebase from 'firebase/app';
import 'firebase/firestore';

const {height,width} = Dimensions.get('window');


class Services extends Component {
    
    constructor(props){
        super(props)    

        this.state = ({
            uid: null,
            search: '',
            selectedIndex: 1
        })
        this.updateIndex = this.updateIndex.bind(this);
    }

    async componentWillMount(){

        const db = firebase.firestore();
        const user = await AsyncStorage.getItem('userToken');
        this.setState({uid: user});

        
        db.collection("users").where("uid","==",user).get().then(re =>{
            
            re.docs.forEach(res =>{
                // console.log(res.data());
                
                this.setState({lat: res.data().latitude, lon: res.data().longitude});
            })

        })
     

    }

    updateSearch = search => {
        this.setState({ search });
    }; 

    updateIndex (selectedIndex) {
        this.setState({selectedIndex})
      }

    render() {
        
        const {uid, search, lat, lon, selectedIndex } = this.state;
        return (
            <ScrollView>
            <View style={styles.container}>
            {/* <CategorySwitchNavigator /> */}
                <View>
                    <SearchBar
                        placeholder="Type Here..."
                        onChangeText={this.updateSearch}
                        value={search} 
                        lightTheme={true}
                        round={true}
                        containerStyle={{backgroundColor: '#fff', height: 50, width: 400,}}
                    />
                </View>
                    
                <View style={styles.head}>
                    <Text style={styles.heading}>Services</Text>
                </View>
                <View style={styles.first}>
                    <View style={styles.service1}>
                    {/* <Icon name='rowing' color="red" /> */}
                        <TouchableHighlight onPress={() => this.props.navigation.navigate('Category',{name: 'carpenter', uid, lat, lon})}>
                            <Image style={styles.img} source={require('../../assets/carpenter.png')} />
                        </TouchableHighlight>
                            <Text style={styles.txt}>Carpenter</Text>
                    </View>
                    <View style={styles.service1}>
                        <TouchableHighlight onPress={() => this.props.navigation.navigate('Category',{name: 'transport', uid, lat, lon})}>
                            <Image style={styles.img} source={require('../../assets/driver.png')} />
                        </TouchableHighlight>
                        <Text style={styles.txt}>Transport</Text>
                    </View>
                </View>
                <View style={styles.second}>
                    <View style={styles.services}>
                        <TouchableHighlight onPress={() => this.props.navigation.navigate('Category',{name: 'electric', uid, lat, lon})}>
                            <Image style={styles.img} source={require('../../assets/electric.png')} />
                        </TouchableHighlight>
                        <Text style={styles.txt}>Electrician</Text>
                    </View>
                    <View style={styles.services}>
                        <TouchableHighlight onPress={() => this.props.navigation.navigate('Category',{name: 'laundry', uid, lat, lon})}>
                            <Image style={styles.img} source={require('../../assets/laundry.png')} />
                        </TouchableHighlight>
                        <Text style={styles.txt}>Laundry</Text>
                    </View>
                </View>    
                <View style={styles.third}>
                    <View style={styles.services}>
                        <TouchableHighlight onPress={() => this.props.navigation.navigate('Category',{name: 'plumber', uid, lat, lon})}>
                            <Image style={styles.img} source={require('../../assets/plumber.png')} />
                        </TouchableHighlight>
                        <Text style={styles.txt}>Plumber</Text>
                    </View>
                    <View style={styles.services}>
                        <TouchableHighlight onPress={() => this.props.navigation.navigate('Category',{name: 'cleaning', uid, lat, lon})}>
                            <Image style={styles.img} source={require('../../assets/clean.png')} />
                        </TouchableHighlight>
                        <Text style={styles.txt}>Cleaning</Text>
                    </View>
                </View>    


            </View>
            </ScrollView>
        );
    }
}


export default Services;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'center'
    },
    head:{
        
        marginBottom: 5
    },
    heading:{
        fontSize: 35,
        fontWeight: '500',
    },
    first: {
        flex: 1,
        flexDirection: 'row',
        // marginTop:50
    },
    second: {
        flex: 1,
        flexDirection: 'row',
        // marginBottom: 10,
    },
    third: {
        flex: 1,
        flexDirection: 'row',
        // marginBottom: 50,
    },
    service1: {
        width: width/2, 
        height: 160, 
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },
    services: {
        width: width/2, 
        height: 160, 
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1,
        borderBottomWidth: 1,
    },
    img: {
        width: 80, 
        height: 80
    },
    txt: {
        fontSize: 20,
        fontWeight: '500',
        marginTop: 10,
    },
});

// Carpenters
// Plumbers
// Electricians
// Notary Services
// driver
// transport
// laundry Services

// House Deep Cleaning
// Appliance Repair