import React, { Component } from "react";
import { ScrollView, View, StyleSheet, Button, AsyncStorage, TextInput} from "react-native";
import firebase from 'firebase/app';
import 'firebase/firestore';
import Loader from "../Loader/Loader";
import { Card, Icon, Text, Input } from 'react-native-elements';
import Modal from "react-native-modal";


class UserProfile extends Component {

    constructor(props){
        super(props);

        this.state = ({
            loading: true,
            id: 'id',
            profile: [],
            isModalVisible: false,
            amount: ""
        })

    }

    async componentWillMount(){

        const db = firebase.firestore();
        const user = await AsyncStorage.getItem('userToken');
        this.setState({uid: user});

        db.collection("users").where("uid","==",user).get().then(re =>{
            
            re.docs.forEach(res =>{
                
                this.setState({lat: res.data().latitude, lon: res.data().longitude,name: res.data().name});
            })

        })

    }

    _toggleModal = () =>
        this.setState({ isModalVisible: !this.state.isModalVisible });

    sendAmount(id) {

        const {uid, amount, name, lat, lon} = this.state;
        var {user_name,user_lat,user_lon,user_service} = this.state.profile[0];
        const db = firebase.firestore();

        if (!amount) {
            alert("Please select an amount");
        }
        else {

            db.collection("offers").add({
                [uid]: true,
                [id]: false,
                sender: uid,
                amount,
                reciever: id,
                user_name,
                user_lat,
                user_lon,
                user_service,
                name,
                lat,
                done: false,
                request: false,
                lon,
                rating: 0
            }).then(res => {

                this.setState({ isModalVisible: false });
                alert("Offer sended successfully");
                this.props.navigation.navigate('Service');

            })

        }

    }
    
    render() {
        
        const { loading, id, profile } = this.state
        var user_id = this.props.navigation.getParam("id");
        const db = firebase.firestore();
        
        if (!user_id) {
            this.props.navigation.navigate('Category');
        } else {
        
            if (user_id != id) {

                db.collection("users").where("uid", "==", user_id).get().then(res => {

                    res.docs.forEach(user => {

                        var a = { user_uid: user.data().uid, user_name: user.data().name, user_phone: user.data().phone, user_service: user.data().service, user_lat: user.data().latitude, user_lon: user.data().longitude, user_image: user.data().image }
                        this.setState({ profile: [a], loading: false, id: user.data().id })

                    })

                })

            }
        }
        return (
            <View style={styles.container}>
                <ScrollView scrollEventThrottle={16}>
                    <View style={styles.container}>
                        {!loading ?
                            <View>

                                {!profile.length ?
                                    <View style={styles.container}>
                                        <Text>{response}</Text>
                                    </View>
                                    :
                                    profile.map((item, index) =>

                                        <View key={index}>
                                            <Card containerStyle={{ width: 380 }} titleStyle={{ fontSize: 30 }}
                                                
                                                image={{ uri: item.user_image }}>
                                                <Text h4 style={{ marginBottom: 10 }}>
                                                    Name: {item.user_name}
                                                </Text>
                                                <Text h4 style={{ marginBottom: 5 }}>
                                                    Phone: {item.user_phone}
                                                </Text> 
                                                <Text h4 style={{ marginBottom: 5 }}>
                                                    Service: {item.user_service}
                                                </Text>   
                                                <Button style={styles.btn} 
                                                    buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                                                    title='Send Offer' onPress={this._toggleModal} />
                                                {/* <Button style={styles.btn} color='#4FD54D' */}
                                            </Card>
                                        </View>
                                    )}
                            </View>
                            :
                            <Loader />
                        }

                    </View>
                    <View style={{ flex: 1 }}>
                        <Modal style={{ height: 200 }} isVisible={this.state.isModalVisible} animationIn='slideInUp'>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#BAECE7' }}>
                                <Text h3>Amount!</Text>
                                <TextInput
                                    style={{ height: 40, marginTop:50, width: 200, borderRadius: 5, borderColor: 'gray', borderWidth: 1 }}
                                    onChangeText={(amount) => this.setState({ amount })} keyboardType="numeric"
                                    value={this.state.text}
                                />
                                <View style={{marginTop: 20,width: 150 }}> 
                                    <Button title='Send' onPress={()=>this.sendAmount(user_id)}/>
                                </View>
                            </View>
                                <Button onPress={this._toggleModal} title="Close" icon={<Icon name="close" size={15} color="white" />} />
                        </Modal>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
export default UserProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btn:{
        marginTop: 10
    },
    modal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#BAECE7',
    }
});