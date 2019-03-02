import React, { Component } from "react";
import { ScrollView, AsyncStorage, Dimensions, Button,
    View,
    StyleSheet
} from "react-native";
import firebase from 'firebase/app';
import 'firebase/firestore';
import {Text, Card, Icon, Rating} from 'react-native-elements';
import Modal from "react-native-modal";

const {width} = Dimensions.get('window');

class Offers extends Component {

    constructor(props){
        super(props)

        this.state = ({
            loading:  true,
            sentOffers: [],
            sent: null,
            recivedoffers : [],
            recieve: null,
            len: 1,
            len1: 1,
            isModalVisible: false,
        })
    }

    async componentWillMount(){

        const user = await AsyncStorage.getItem('userToken');
        this.setState({uid: user});

        const {uid, len, len1, sentOffers, recivedoffers} = this.state;
        const db = firebase.firestore();
        
        if (len != sentOffers.length) {


            if (uid) {


                db.collection("offers").where("sender", "==", uid).onSnapshot(res => {
                    this.setState({ sentOffers: [] })
                    
                    if (res.docs.length) {

                        res.docs.forEach(off => {

                            var c = { offerid: off.id , rid: off.data().reciever, rname: off.data().user_name, rlat: off.data().user_lat, rlon: off.data().user_lon, rservice: off.data().user_service, sid: off.data().sender, sname: off.data().name, slat: off.data().lat, slon: off.data().lon, done: off.data().done, location: off.data().location, amount: off.data().amount, request: off.data().request, rating: off.data().rating }
                            this.setState({ sentOffers: [...this.state.sentOffers, c], loading: false, len: res.docs.length });

                        })

                    } else {

                        this.setState({ loading: false, sent: "No sent data found", sentOffers: [] });

                    }

                })

            }

        }

        if (len1 != recivedoffers.length) {

            if (uid) {


                db.collection("offers").where("reciever", "==", uid).onSnapshot(res => {
                    this.setState({ recivedoffers: [] })

                    if (res.docs.length) {

                        res.docs.forEach(off => {

                            var a = { offerid: off.id , rid: off.data().reciever, rname: off.data().user_name, rlat: off.data().user_lat, rlon: off.data().user_lon, rservice: off.data().user_service, sid: off.data().sender, sname: off.data().name, slat: off.data().lat, slon: off.data().lon, done: off.data().done, location: off.data().location, amount: off.data().amount ,request: off.data().request, rating: off.data().rating }
                            this.setState({ recivedoffers: [...this.state.recivedoffers, a], loading: false, len1: res.docs.length });

                        })


                    } else {

                        this.setState({ loading: false, recieve: "No received data found", recivedoffers: [] });

                    }

                })
            }

        }

    }

    ratingCompleted(rating) {

        console.log("Rating is: " + rating)
        this.setState({
            rate: rating
        })

      }

    _toggleModal(id) {
        this.setState({ isModalVisible: !this.state.isModalVisible, offerid: id });
    }

    accept(offid,recid,sendid){

      const db = firebase.firestore();
      
      db.collection("offers").doc(offid).update({
        [recid]: true,
        [sendid]: true,
        request: true

      })

    }

    decline(offid){

        const db = firebase.firestore();

        db.collection("offers").doc(offid).delete().then(() =>{
            alert("Offer successfully deleted!",offid);
        })

    }

    done(offid){

        const db = firebase.firestore();
      
        db.collection("offers").doc(offid).update({

          isModalVisible: false,
          done: true,
          rating: this.state.rate,
  
        })

    }

   

    render() {
        const {uid, sentOffers, sent, recivedoffers, recieve} = this.state;

        return (
            <ScrollView scrollEventThrottle={16}>
            <View style={styles.container}>
                    <View>

                        <View style={styles.recived}>
                            <Text h2>Recieved</Text>

                                {recivedoffers.length > 0 ?
                                    <View style={styles.container}>
                                        {recivedoffers.map((item, index) =>
                                            <View key={index}>
                                                <Card containerStyle={{ width: 380 }} titleStyle={{ fontSize: 30 }}>
                                                    <Text h3 style={{ marginBottom: 5 }}>
                                                        Sender Name: {item.sname}
                                                    </Text>
                                                    <Text h4 style={{ marginBottom: 5 }}>
                                                        Amount: {item.amount}
                                                    </Text>
                                                    <Text h4 style={{ marginBottom: 5 }}>
                                                        Location: {item.location}
                                                    </Text>
                                                    {item.done ? <View>
                                                        <Rating
                                                            readonly
                                                            startingValue={item.rating}
                                                        />
                                                        <Button
                                                            icon={<Icon name='code' color='#ffffff' />}
                                                            backgroundColor='#03A9F4' disabled={true}
                                                            buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                                                            title='DONE' onPress={() => alert("Finished")} />

                                                    </View> :
                                                        <View>
                                                            {item.request ?
                                                                <View>
                                                                    {/* <Button
                                                                        icon={<Icon name='code' color='#ffffff' />}
                                                                        backgroundColor='#03A9F4'
                                                                        buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                                                                        title='CHAT' onPress={() => this.props.navigation.navigate('Chat', { id: uid, userid: item.sid, offer: item.offerid, sendername: rname, recievename: })} /> */}
                                                                    <Button
                                                                        icon={<Icon name='code' color='#ffffff' />}
                                                                        backgroundColor='#03A9F4'
                                                                        buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                                                                        title='Direction' onPress={() => this.props.navigation.navigate('Map', { lat: item.slat, lon: item.slon })} />
                                                                </View>
                                                                :
                                                                <View>
                                                                    <Button title='Accept' color='#28a745' onPress={() => this.accept(item.offerid, uid, item.sid)} />
                                                                    <Button title='Decline' style={{ marginTop: 15, }} color='#dc3545' onPress={() => this.decline(item.offerid)} />
                                                                </View>
                                                            }
                                                        </View>
                                                    }
                                                </Card>
                                            </View>
                                        )}
                                    </View>
                                    :
                                    <View style={styles.container}>
                                        <Text>{recieve}</Text>
                                    </View>
                                }
                            
                        </View>

                        <View style={styles.sent}>

                            <Text h2>Sent</Text>
                                {sentOffers.length ?
                                    <View style={styles.container}>
                                        {sentOffers.map((item, index) =>
                                            <View key={index}>
                                                <Card containerStyle={{ width: 380 }} titleStyle={{ fontSize: 30 }}>
                                                    <Text h3 style={{ marginBottom: 5 }}>
                                                        Name: {item.rname}
                                                    </Text>
                                                    <Text h4 style={{ marginBottom: 5 }}>
                                                        Serivce: {item.rservice}
                                                    </Text>
                                                    <Text h4 style={{ marginBottom: 5 }}>
                                                        Amount: {item.amount}
                                                    </Text>
                                                    {item.done ? <View>
                                                        <Rating
                                                            readonly
                                                            startingValue={item.rating}
                                                        />
                                                        <Button
                                                            icon={<Icon name='code' color='#ffffff' />}
                                                            backgroundColor='#03A9F4' disabled={true}
                                                            buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                                                            title='DONE' onPress={() => alert("Finished")}/>

                                                    </View> :
                                                        <View>
                                                            {item.request ?
                                                                <View>
                                                                    <Button
                                                                        icon={<Icon name='code' color='#ffffff' />}
                                                                        backgroundColor='#03A9F4'
                                                                        buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                                                                        title='CHAT' onPress={() => this.props.navigation.navigate('Chat', { id: uid, recieverid: item.rid, offer: item.offerid, sendername: item.sname, recievername: item.rname})} />
                                                                    <Button
                                                                        icon={<Icon name='code' color='#ffffff' />}
                                                                        backgroundColor='#03A9F4'
                                                                        buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                                                                        title='Direction' onPress={() => this.props.navigation.navigate('Map', { lat: item.slat, lon: item.slon })} />
                                                                    <Button
                                                                        icon={<Icon name='code' color='#ffffff' />}
                                                                        backgroundColor='#03A9F4'
                                                                        buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                                                                        title='DONE' onPress={() => this._toggleModal(item.offerid)} />
                                                                </View>
                                                                :
                                                                <View>
                                                                    <Button
                                                                        icon={<Icon name='code' color='#ffffff' />}
                                                                        backgroundColor='#03A9F4'
                                                                        buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                                                                        title='Direction' onPress={() => this.props.navigation.navigate('Map', { lat: item.rlat, lon: item.rlon })} />
                                                                </View>
                                                            }
                                                        </View>
                                                    }
                                                </Card>
                                            </View>
                                        )}
                                    </View>
                                    :
                                    <View style={styles.container}>
                                        <Text>{sent}</Text>
                                    </View>
                                }
                        </View>

                    </View>       
            </View>
                <View style={{ flex: 1 }}>
                    <Modal style={{ height: 200 }} isVisible={this.state.isModalVisible} animationIn='slideInUp'>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#BAECE7' }}>
                            <Text h3>Rating!</Text>
                            <Rating
                                showRating
                                onFinishRating={(rating) =>this.ratingCompleted(rating)}
                                style={{ paddingVertical: 10 }}
                            />
                            <View style={{ marginTop: 20, width: 150 }}>
                                <Button title='Send' onPress={() => this.done(this.state.offerid)} />
                            </View>
                        </View>
                        <Button onPress={() =>this._toggleModal(this.state.offerid)} title="Close" icon={<Icon name="close" size={15} color="white" />} />
                    </Modal>
                </View>
            </ScrollView>         
        );
    }
}
export default Offers;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    recived:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sent:{
        flex: 1,
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 2,
    }
});