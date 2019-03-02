import React, { Component } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage } from "react-native";
import * as firebase from 'firebase';
import Loader from "../Loader/Loader";



class login extends Component {

    constructor(props) {
        super(props);

        this.state = ({
            loading: false,
            user: null
        });
    }

    logIn = async () => {
        this.setState({ loading: true })
        try {
            const db = firebase.firestore();
            const {
                type,
                token,
                expires,
                permissions,
                declinedPermissions,
            } = await Expo.Facebook.logInWithReadPermissionsAsync('374883879972328', {
                permissions: ['public_profile'],
            });
            if (type === 'success') {
                // Get the user's name using Facebook's Graph API
                const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
                debugger

                var aid = await response.json().then((uid) => {
                    db.collection("block").where("id", "==", uid.id).get().then(res => {

                        if (res.docs.length) {
                            alert("You had been blocked by the admin");
                            this.setState({ loading: false })
                        } else {
                            this.setState({ uid: uid.id });
                            this.toke();
                        }

                    })
                })


            } else {
                // type === 'cancel'
            }
        } catch ({ message }) {
            alert(`Facebook Login Error: ${message}`);
        }
    }

    toke = async () => {

        const token = await AsyncStorage.setItem('userToken', `${this.state.uid}`).then(() => {
            this.props.navigation.navigate('App');
        });

    }

    render() {
        const { user, loading } = this.state;
        return (
            <View style={styles.container_fluid}>
                {!loading ?
                    <View>
                        <View style={styles.head}>
                            <Image style={{ width: 180, height: 180 }} source={require('../../assets/logo1.png')} />
                            <Text style={styles.heading}>Welcome to User Service Provider App</Text>
                        </View>

                        <View style={styles.container}>
                            <TouchableOpacity style={styles.btn}>
                                <Text style={styles.btn_text} onPress={this.logIn.bind(this)}>Log In with Facebook</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                    :
                    <Loader />
                }
            </View>
        );
    }
}
export default login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container_fluid: {
        flex: 1,
        alignItems: 'center'
    },
    head: {
        marginTop: 30,
        alignItems: 'center'
    },
    heading: {
        fontSize: 78,
        color: 'black',

    },
    btn_text: {
        color: '#fff',
        fontSize: 30,
        alignSelf: 'center'
    },
    btn: {
        justifyContent: 'center',
        alignSelf: 'center',
        height: 60,
        width: 320,
        color: '#fff',
        fontSize: 24,
        backgroundColor: '#14629D',
    }
});