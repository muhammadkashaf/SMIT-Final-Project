import React, { Component } from "react";
import { View,Image, StyleSheet } from "react-native";

class Loader extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Image source={require('../../assets/loader.gif')} />
            </View>
        );
    }
}
export default Loader;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 150,
    }
});