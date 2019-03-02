import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    Button, ScrollView
} from "react-native";
import firebase from 'firebase/app';
import 'firebase/firestore';
import Loader from "../Loader/Loader";
import { Card, Icon } from 'react-native-elements';

var category = "";

class Category extends Component {
    
    constructor(props) {
        super(props);
        
        // category = this.props.navigation.getParam('name','')
        this.state = ({
            fun: false,
            loading: true,
            name: '',
            ab: 'a',
            response: '',
            use: [],
            cat: 'a'
            //     name: this.props.navigation.getParam('name')
        })
        
        
        
        // this.setState({name: category})
    }
    // componentDidUpdate(){
        
    //     // alert('dsdssd');

    // }
    

    // componentWillMount(){

    //     const category = this.props.navigation.getParam('name')
    //     this.setState({name: category})
    //     // alert(category)

    // }

    // componentWillUnmount(){
    //     this.setState({name: ""})
    // }

    // a = ()=>{
        // alert(category)
        // if (this.state.name != b) {
        //     this.setState({category: b})
        // }
    // }

    // a();

    // static getDerivedStateFromProps(props,state){
    //     console.log('*******',props.navigation.state.params.name);
    //     console.log('*******',props.navigation.getParam('name'));
        
    //     return {
    //         name: props.navigation.state.params.name
    //     };
    // }

    // componentDidUpdate(){

    //     console.log("sssss");
        

    // }
    
        // componentWillMount(){
        //     console.log("a");
    
        // }

        a(category){
            const db = firebase.firestore();
            var t = this;
            
            db.collection('users').where('service','==', category).get().then(res =>{
                   
                // console.log(category);
                
                if (res.docs.length) {
    
                    res.docs.forEach(user =>{
                        
                        console.log(user.data().uid);
        
                            var a = {user_id: user.data().uid, user_name: user.data().name, phone: user.data().phone, lat: user.data().latitude, lon: user.data().longitude, image: user.data().image};
                            t.setState({use: [...t.state.use,a], loading: false, response: 'abc', cat: category, fun: true,});
                    
                    })
    
                }
                else{
                     this.setState({loading: false, response: "No result Found", fun: true, cat: category});
                }
            })
        }

    b = () => {

    //     const { loading, response, use, fun, cat } = this.state;
    //     const db = firebase.firestore();
    //     var id = this.props.navigation.getParam('uid');
    //     var category = this.props.navigation.getParam('name');
        
    //     var t = this;

    //     console.log(id);


    //     if (category != cat) {


    //         db.collection('users').where('service', '==', category).get().then(res => {

    //             console.log(category);
    //             debugger
    //             if (res.docs.length) {

    //                 res.docs.forEach(user => {

    //                     console.log(user.data().uid);

    //                     var a = { user_id: user.data().uid, user_name: user.data().name, phone: user.data().phone, lat: user.data().latitude, lon: user.data().longitude, image: user.data().image };
    //                     t.setState({ use: [...t.state.use, a], loading: false, response: 'abc', cat: category, fun: true, });

    //                 })

    //             }
    //             else {
    //                 this.setState({ loading: false, response: "No result Found", fun: true, cat: category, use: [] });
    //             }
    //         })
    //     }

    //     return(
            
    //             )
    }
    
    distance(lat1, lon1, lat2, lon2) {
        
        var unit = "K"
            if ((lat1 == lat2) && (lon1 == lon2)) {
                return 0;
            }
            else {
                var radlat1 = Math.PI * lat1/180;
                var radlat2 = Math.PI * lat2/180;
                var theta = lon1-lon2;
                var radtheta = Math.PI * theta/180;
                var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                if (dist > 1) {
                    dist = 1;
                }
                dist = Math.acos(dist);
                dist = dist * 180/Math.PI;
                dist = dist * 60 * 1.1515;
                if (unit=="K") { dist = dist * 1.609344 }
                if (unit=="N") { dist = dist * 0.8684 }
                this.setState(dist);
            }
        }

    render() {

        const { loading, response, cat, dist } = this.state;
        const db = firebase.firestore();
        var id = this.props.navigation.getParam('uid');
        var lat = this.props.navigation.getParam('lat');
        var lon = this.props.navigation.getParam('lon');
        var category = this.props.navigation.getParam('name');
        
        var t = this;
        var unit = "K"

        if (category != cat) {

            if (!category) {
                this.props.navigation.navigate('Service');
            } else {

                db.collection('users').where('service', '==', category).get().then(res => {
                    this.setState({ loading: true, use: [] })
                    // console.log(category);
                    // debugger
                    if (res.docs.length) {

                        res.docs.forEach(user => {
                            
                            // ()=> this.distance(lat,lon,user.data().latitude,user.data().longitude);

                            
                                debugger
                                var radlat1 = Math.PI * lat / 180;
                                var radlat2 = Math.PI * user.data().latitude / 180;
                                var theta = lon - user.data().longitude;
                                var radtheta = Math.PI * theta / 180;
                                var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                                if (dist > 1) {
                                    dist = 1;
                                }
                                dist = Math.acos(dist);
                                dist = dist * 180 / Math.PI;
                                dist = dist * 60 * 1.1515;
                                if (unit == "K") { dist = dist * 1.609344 }
                                if (unit == "N") { dist = dist * 0.8684 }
                                // this.setState(dist);
                                
                                if (dist < 10) {
                                    var a = { user_id: user.data().uid, user_name: user.data().name, user_phone: user.data().phone, user_lat: user.data().latitude, user_lon: user.data().longitude, user_image: user.data().image };
                                    t.setState({ use: [...t.state.use, a], loading: false, response: 'abc', cat: category });
                                }
                                else{
                                    this.setState({ loading: false, response: "No result Found", cat: category, use: [] });
                                }
                            

                            

                        })

                    }
                    else {
                        this.setState({ loading: false, response: "No result Found", cat: category, use: [] });
                    }
                })
            }
        }

        return (
            <View style={styles.container}>
                <ScrollView scrollEventThrottle={16}>
                    <View style={styles.container}>
                        {!loading ?
                            <View>

                                {!this.state.use.length ?
                                    <View style={styles.container}>
                                    <Text>{response}</Text>
                                    </View>
                                    :
                                    this.state.use.map((item, index) =>

                                        <View key={index}>
                                            {/* <Text>{item}</Text> */}
                                            <Card containerStyle={{width: 380}} titleStyle={{fontSize: 30}}
                                                title={item.user_name}
                                                image={{ uri: item.user_image }}>
                                                <Text style={{ marginBottom: 5 }}>
                                                    
                                                </Text>
                                                <Button
                                                    icon={<Icon name='code' color='#ffffff' />}
                                                    backgroundColor='#03A9F4'
                                                    buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                                                    title='VIEW PROFILE' onPress={() => this.props.navigation.navigate('UserProfile',{id: item.user_id})} />
                                            </Card>
                                        </View>
                                    )}
                            </View>
                            :
                            <Loader />
                        }

                    </View>
                </ScrollView>
            </View>
        );
    }
}
export default Category;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});