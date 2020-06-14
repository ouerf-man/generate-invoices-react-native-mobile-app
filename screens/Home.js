import React from "react"
import { View, StyleSheet, Image, Dimensions } from "react-native"
import { Button } from "react-native-elements"
const Home = ({navigation}) => {
    return (
        <View>
            <View style={styles.header}>
                <Image
                    source={require('./logo.png')}
                    style={{ width: 120, height: 120 }}
                />
            </View>
            <View style={styles.body}>
                <Button
                    buttonStyle={{...styles.btn , backgroundColor:"#219ac6"}}
                    title="Devis"
                    onPress={()=> navigation.navigate('devis')}
                />
                <Button
                    buttonStyle={styles.btn}
                    title="Ajouter un composant"
                    type="outline"
                    titleStyle={{color:"#219ac6"}}
                    onPress={()=> navigation.navigate('ajout')}
                />
            </View>
        </View>
    )
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    header: {
        height: height / 3 + 10,
        backgroundColor: "#219ac6",
        justifyContent: "center",
        alignItems: "center",
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40
    },
    body: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        height: 2 * height / 3
    },
    btn: {
        marginRight: width/20,
        width: width/3,
        height:"8%"
    }
})

export default Home;