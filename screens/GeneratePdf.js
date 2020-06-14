
import React, { Component } from 'react';
import { Alert, PermissionsAndroid, Platform, Text, TouchableHighlight, View, StyleSheet, Dimensions, Picker, Modal, ScrollView } from 'react-native';
import { Button, Input, ListItem } from "react-native-elements"
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import database from '@react-native-firebase/database';
import { HTML } from "../html"
import Prompt from 'react-native-prompt';
import numeral from "numeral"

export default class GeneratePdf extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: new Array(),
      composants: [],
      modalVisible: false,
      keys: [],
      selectedComposant: null,
      qte: 1,
      remise: 0,
      tva: 0,
      client: "",
      prompt: false,
      tt: 0,
      totaleLettre: '',
      ref: '',
      type:'facture'
    }
  }

  componentDidMount() {
    database()
      .ref('composants')
      .once('value')
      .then(snapshot => {
        this.setState({ composants: Object.values(snapshot.val()), keys: Object.keys(snapshot.val()), })
        this.setState({ selectedComposant: this.state.keys[0] })
      })
      .catch((e) => {
        console.log(e)
      })
  }

  deleteEl(i) {
    console.log(i)
    let newD = this.state.data
    newD.splice(i, 1);
    this.setState({ data: newD })
  }

   getFactureRef() {
    database().ref('refs').once('value')
      .then((snap) => {
        if (this.state.type == 'facture') {

          if (snap.val() && snap.val().fac) {
            this.setState({ ref: (snap.val().fac.val + 1) })
            console.log(this.state.ref)
            database().ref('refs/fac').update({
              val: snap.val().fac.val + 1
            })
          }
          else {
            this.setState({ ref: 1 })
            database().ref('refs/fac').set({val:1})
          }
        }
        else if (this.state.type == 'devis'){
          if (snap.val() && snap.val().dev ) {
            this.setState({ ref: snap.val().dev.val + 1 })
            database().ref('refs/dev').update({
              val: snap.val().dev.val + 1
            })
          }
          else {
            this.setState({ ref: 1 })
            database().ref('refs/dev').set({val:1})
          }
        }
        
      }).catch((e)=>console.log(e))
      .finally(()=>{
        database().ref(this.state.type).push().set({
          ref: this.state.ref,
          client: this.state.client,
          ttc: this.state.tt,
          data: this.state.data,
          date: new Date().toISOString()
        }).then(()=>{
          this.requestRunTimePermission()
        })
        .catch(()=>Alert.alert('erreur, jareb mara o5ra'))
      })
  }

  calculateTotal() {
    let data = this.state.data
    let ttb = 0
    let ttn = 0
    let ttt = 0
    let tt = 0
    data.forEach(element => {
      ttt += (element.prix * element.tva) / 100
      ttn += (element.prix * element.quantity - element.prix * element.remise / 100)
    });

    tt = ttn + ttt
    this.setState({ tt: tt })
    
  }

  handleSubmit() {
    let added = {}
    let comp = this.state.composants[this.state.keys.indexOf(this.state.selectedComposant)]
    added.refC = comp.ref
    added.composant = comp.composant
    added.prix = comp.prix
    added.remise = this.state.remise
    added.quantity = this.state.qte
    added.tva = this.state.tva
    let newData = this.state.data
    newData.push(added)
    this.setState({
      data: newData, modalVisible: false,
      qte: 1,
      remise: 0,
      tva: 0,
    })
  }

  requestRunTimePermission = () => {
    var that = this;
    async function externalStoragePermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs access to Storage data.',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          that.createPDF_File();
        } else {
          alert('WRITE_EXTERNAL_STORAGE permission denied');
        }
      } catch (err) {
        Alert.alert('Write permission err', err);
        console.warn(err);
      }
    }

    if (Platform.OS === 'android') {
      externalStoragePermission();
    } else {
      this.createPDF_File();
    }
  }



  async createPDF_File() {
    let options = {
      // HTML Content for PDF.
      // I am putting all the HTML code in Single line but if you want to use large HTML code then you can use + Symbol to add them.
      html: HTML(this.state.data, this.state.client, this.state.totaleLettre, this.state.type, this.state.ref),
      // Setting UP File Name for PDF File.
      fileName: `${this.state.client}--${new Date().toISOString()}`,

      //File directory in which the PDF File Will Store.
      directory: this.state.type == 'facture' ? 'factures' : 'devis',
    };

    let file = await RNHTMLtoPDF.convert(options);

    Alert.alert("Fichier créer avec succcé");  
  }


  render() {
    return (
      <View>
        <View style={styles.title}>
          <Text style={{ fontSize: 20 }}>
            Génerer une facture
            </Text>
        </View>
        <View style={styles.elements}>
          <View style={{ height: "15%", justifyContent: "center" }}>
            <Button
              title="Ajouter un élement"
              onPress={() => this.setState({ modalVisible: !this.state.modalVisible })}
              buttonStyle={{
                width: width / 2,
                borderRadius: 20,
                padding: 10,
                elevation: 2
              }}
            />
          </View>
          <ScrollView style={{
            borderTopWidth: 1,
            borderColor: "#20232a",
            backgroundColor: "#e2dede",
            width: "100%",
            height: "35%"
          }}>
            {
              this.state.data.map((el, i) =>
                (<TouchableHighlight key={i} onPress={()=> console.log(numeral(275.5).format('0,0.000'))}>
                  <ListItem
                    title={el.composant}
                    subtitle={`quatité = ${el.quantity}`}
                    rightSubtitle={el.prix + " TND "}
                    bottomDivider
                    rightIcon={
                      {
                        name: 'trash',
                        type: 'font-awesome',
                        size: 30,
                        color: 'red',
                        onPress: () => this.deleteEl(i)
                      }
                    }
                  />
                </TouchableHighlight>
                )
              )
            }
          </ScrollView>

          <View style={{ height: "50%", flexDirection: "column", justifyContent: "center", width: "100%" }}>
            <Input
              placeholder='Client'
              keyboardType="name-phone-pad"
              onChangeText={(text) => this.setState({ client: text })}
            />
            <Picker selectedValue={this.state.type} onValueChange={(val) => { this.setState({ type: val }) }}>
              <Picker.Item label={"facture"} value={"facture"}/>
              <Picker.Item label={"devis"} value={"devis"}/>
            </Picker>
          </View>
        </View>

        <View style={styles.add}>
          <Button
            title="Génerer le pdf"
            buttonStyle={{
              width: width / 3,
              borderRadius: 20,
              padding: 10,
              elevation: 2,
            }}
            onPress={() => { this.calculateTotal(); this.setState({ prompt: !this.state.prompt }) }}
          />
        </View>


        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({ modalVisible: false })
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalText}>Veuillez Saisir les données du composant</Text>
              </View>
              <View style={{ flex: 6, flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%" }}>
                <Picker style={{ width: "100%" }} selectedValue={this.state.selectedComposant} onValueChange={(val) => { this.setState({ selectedComposant: val }) }}>
                  {
                    this.state.composants.map((el, i) => {
                      return <Picker.Item key={i} label={el.composant} value={this.state.keys[i]} />
                    })
                  }
                </Picker>
                <Input
                  placeholder='Quantité'
                  keyboardType="numeric"
                  onChangeText={(text) => this.setState({ qte: text })}
                />
                <Input
                  placeholder='remise'
                  keyboardType="decimal-pad"
                  onChangeText={(text) => this.setState({ remise: text })}
                />
                <Input
                  placeholder='TVA'
                  keyboardType="decimal-pad"
                  onChangeText={(text) => this.setState({ tva: text })}
                />
              </View>
              <View style={{ flex: 2, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={() => {
                    this.handleSubmit()
                  }}
                >
                  <Text style={styles.textStyle}>Confimer</Text>

                </TouchableHighlight>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#eb515f" }}
                  onPress={() => {
                    this.setState({ modalVisible: !this.state.modalVisible });
                  }}
                >
                  {
                    this.state.isLoading ? <ActivityIndicator /> : <Text style={styles.textStyle}>Annuler</Text>
                  }
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
        <Prompt
          title={`${this.state.tt} vers lettres`}
          placeholder="عشرين دينار"
          visible={this.state.prompt}
          onCancel={() => this.setState({
            prompt: false,
          })}
          onChangeText={(text) => this.setState({ totaleLettre: text })}
          onSubmit={(value) => {
            this.setState({
              prompt: false,
            })
            this.getFactureRef()
          }} />
      </View>
    )
  }
}
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({

  title: {
    borderBottomWidth: 1,
    borderColor: "#20232a",
    height: height / 10,
    alignItems: "center",
    justifyContent: "center"
  },
  elements: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: 7 * height / 10,
    borderBottomWidth: 1,
    borderColor: "#20232a",
  },
  add: {
    marginTop: "8%",
    alignItems: 'center',
    height: 2 * height / 10
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 7 * width / 8,
    height: 3 * height / 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginRight: 15
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});