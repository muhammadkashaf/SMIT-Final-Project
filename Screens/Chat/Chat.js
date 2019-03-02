import React, { Component } from "react";
import {
    Dimensions, TextInput, ScrollView,
    View,
    StyleSheet, Button, AsyncStorage
} from "react-native";
import { Text, Icon } from "react-native-elements";
import firebase from 'firebase/app';
import 'firebase/firestore';
import { ListItem } from 'react-native-elements'

const { width, height } = Dimensions.get("window");

class Chat extends Component {

    constructor(props) {
        super(props);

        this.state = ({
            message: "",
            mesag: [],
            list: [],
            lis: false,
            offid: ''
        })
    }

    async componentWillMount() {

        const db = firebase.firestore();
        const user = await AsyncStorage.getItem('userToken');
        this.setState({ uid: user });

        db.collection("chat").where(`${user}`, "==", true).onSnapshot(res => {

            if (res.docs.length) {

                res.docs.forEach(li => {

                    if (li.data().recieverid != user) {

                        var a = { id: li.id, name: li.data().recievername, id2: li.data().recieverid, offerid: li.data().offer}
                        this.setState({ list: [...this.state.list, a], lis: true });
                        
                    } else {
                        
                        var a = { id: li.id, name: li.data().sendername, id2: li.data().senderid, offerid: li.data().offer}
                        this.setState({ list: [...this.state.list, a], lis: true });

                    }
                })

            }
            else {

            }

        })

    }

    lsit(id){
        debugger
        const db = firebase.firestore();
        const {uid} = this.state;

        db.collection("chat").where(`${id}`, "==", true).onSnapshot(res => {

            if (res.docs.length) {
                this.setState({list: []})

                res.docs.forEach(li => {

                    if (li.data().recieverid != uid) {

                        var a = { id: li.id, name: li.data().recievername, id2: li.data().recieverid, offerid: li.data().offer}
                        this.setState({ list: [...this.state.list, a], lis: true });
                        
                    } else {
                        
                        var a = { id: li.id, name: li.data().sendername, id2: li.data().senderid, offerid: li.data().offer}
                        this.setState({ list: [...this.state.list, a], lis: true });

                    }

                })

            }
            else {

            }

        })
    }

    send() {
        const { message, uid, id2, offid, sendername, recievername } = this.state;
        // var id1 = this.props.navigation.getParam('id');
        // var id2 = this.props.navigation.getParam("userid");
        const db = firebase.firestore();
        var DateNew = new Date();
        var currentTime = DateNew.toLocaleTimeString();
        debugger
        if (uid && id2 && offid) {
            debugger


            db.collection("chat").where(`${uid}`, "==", true).where(`${id2}`, "==", true).where("offer", "==", offid).onSnapshot(res => {

                if (res.docs.length) {

                    db.collection("chat").doc(res.docs[0].id).collection("messages").add({
                        message,
                        sender: uid,
                        reciever: id2,
                        Time: currentTime,
                        Date: new Date()
                    }).then(() => {
                        this.setState({ message: "" })
                    })

                } else {

                    db.collection("chat").add({

                        [uid]: true,
                        [id2]: true,
                        offer: offid,
                        sendername,
                        recievername,
                        recieverid: id2,
                        senderid: uid

                    }).then(res => {

                        db.collection("chat").doc(res.id).collection("messages").add({
                            message,
                            sender: uid,
                            reciever: id2,
                            Time: currentTime,
                            Date: new Date()
                        }).then(() => {
                            this.setState({ message: "" })
                        })

                    })

                }

            })


        }// if
        else{

            if (uid && id2) {

                db.collection("chat").where(`${uid}`, "==", true).where(`${id2}`, "==", true).onSnapshot(res => {

                    if (res.docs.length) {

                        db.collection("chat").doc(res.docs[0].id).collection("messages").add({
                            message,
                            sender: uid,
                            reciever: id2,
                            Time: currentTime,
                            Date: new Date()
                        }).then(() => {
                            this.setState({ message: "" })
                        })
                    }
                });

            }// if

        }// else
}

    sendMessage(id,id2,offer) {

        // const {uid} = this.state;
        const db = firebase.firestore();

        // db.collection("chat").doc(id).onSnapshot(a =>{

        //     if (li.data().recieverid != user) {

        //         this.setState({ id2: a.data().recieverid });
                
        //     } else {
                
        //         this.setState({ id2: a.data().senderid});

        //     }
            
        // })

        db.collection("chat").doc(id).collection("messages").orderBy("Date").onSnapshot(res =>{

            if(res.docs.length){
                this.setState({mesag: []});

                res.docs.forEach(msg =>{

                    var a = { sender: msg.data().sender, reciever: msg.data().reciever, message: msg.data().message };
                    this.setState({ mesag: [...this.state.mesag, a],id2, offid: offer, lis: false})

                })

            }

        })

    }

    render() {

        const { mesag, uid, message, lis, list } = this.state;
        var id1 = this.props.navigation.getParam('id');
        var id2 = this.props.navigation.getParam("recieverid");
        var offid = this.props.navigation.getParam("offer");
        var sendername = this.props.navigation.getParam("sendername");
        var recievername = this.props.navigation.getParam("recievername");
        debugger
        const db = firebase.firestore();

        if (this.state.id1 != id1 && this.state.id2 != id2) {


            db.collection("chat").where(`${id1}`, "==", true).where(`${id2}`, "==", true).where("offer", "==", offid).onSnapshot(res => {
                if (res.docs.length) {

                    db.collection("chat").doc(res.docs[0].id).collection("messages").orderBy("Date").onSnapshot(ms => {
                        if (ms.docs.length) {

                            if (mesag.length != ms.docs.length) {
                                this.setState({ mesag: [] })
                                ms.forEach(msg => {

                                    var a = { sender: msg.data().sender, reciever: msg.data().reciever, message: msg.data().message }


                                    this.setState({
                                        id1, id2, offid, sendername, recievername, mesag: [...this.state.mesag, a], lis:false
                                    })


                                })

                            }


                        } else {

                            this.setState({
                                id1, id2, offid, sendername, recievername
                            })

                        }
                    })


                } else {

                    this.setState({
                        id1, id2, offid, sendername, recievername
                    })

                }
            })

        }





        return (
            <ScrollView scrollEventThrottle={16}>
            <View style={{ flex: 1 }}>

                {lis ?
                    <View>
                        {list.map((item, i) => (
                            <ListItem
                                containerStyle={{ height: 70, width: width, backgroundColor: '#F5F4F4', borderWidth: 1 }}
                                key={i}
                                title={item.name}
                                titleStyle={{ fontSize: 18, fontWeight: '400' }}
                                onPress={() => this.sendMessage(item.id,item.id2,item.offerid)}
                                chevron={true}
                            />
                        ))}
                    </View>
                    :
                    <View style={styles.container}>
                        <View style={styles.chat}>
                            <View style={styles.head}>
                                <View style={styles.icon}>
                                    <Icon name="chevron-left" type='font-awesome' color='#fff' onPress={() =>this.lsit(uid)} />
                                </View>
                                <View style={styles.chathead}>
                                    <Text h2 style={{ color: "#fff"}}>Chat</Text>
                                </View>
                            </View>
                            <ScrollView scrollEventThrottle={16}>
                                <View style={styles.message}>

                                    {mesag.length > 0 ?
                                        <View>
                                            {mesag.map((item, index) =>
                                                <View key={index}>
                                                    {uid == item.sender ?

                                                        <Text style={styles.msg2}>{item.message}</Text>
                                                        :
                                                        <Text style={styles.msg1}>{item.message}</Text>
                                                    }
                                                </View>

                                            )}
                                        </View>
                                        :
                                        <View></View>
                                    }

                                </View>
                            </ScrollView>
                            <View style={styles.input}>
                                <TextInput
                                    style={{ height: 40, borderWidth: 3 }}
                                    placeholder="Type your message!"
                                    onChangeText={(message) => this.setState({ message })}
                                    value={message}
                                />
                                <Button title='Send' onPress={() => this.send()} />
                            </View>
                        </View>
                    </View>
                }
            </View>
            </ScrollView>
        );
    }
}
export default Chat;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    chat: {
        flex: 1,
        width: width,
        height: height * .8,
        borderWidth: 2,
        borderColor: "#0000",
    },
    head: {
        display: 'flex',
        // flex: 1,
        flexDirection: "row",
        height: 70,
        backgroundColor: "#007bff",
        // justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    chathead: {
        // flex: '1',
        justifyContent: 'center',
        // justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 140,
        // alignSelf: "flex-end"
    },
    icon:{
        // flex: 2,
        // justifyContent: 'flex-start'
        // marginRight: 280,
    //     marginTop: 20,
    },
    message: {
        borderWidth: 2,
        borderColor: 'red',
        height: height * .53,
    },
    input: {
        flex: 1,
        height: 50,
        // borderWidth: 2,
        flexDirection: "column",
        justifyContent: "flex-end",
        backgroundColor: "#fff"
    },
    msg1: {
        backgroundColor: "rgba(46, 135, 223, 0.45)",
        width: width * .5,
        fontWeight: '400',
        fontSize: 20,
        margin: 10,
        padding: 10,
        borderRadius: 5,
        borderTopLeftRadius: 0,
        justifyContent: "flex-start"
        // #80CFE9
    },
    msg2: {
        backgroundColor: "rgba(46, 135, 223, 0.45)",
        width: width * .5,
        fontWeight: '400',
        fontSize: 20,
        margin: 10,
        padding: 10,
        borderRadius: 5,
        borderTopRightRadius: 0,
        textAlign: 'right',
        alignSelf: 'flex-end',
        // alignItems: 'flex-end'
    }
});