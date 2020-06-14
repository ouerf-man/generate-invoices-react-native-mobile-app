
import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Modal, TouchableHighlight, ActivityIndicator, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ListItem, Button, Input } from 'react-native-elements';
import { Icon } from 'react-native-vector-icons/FontAwesome';
import database from '@react-native-firebase/database';


function DeleteButton() {
  return <Button
    title="Supprimer"
    icon={<Icon
      name="fa-trash"
      size={15}
      color="red"
    />}
  />
}
export default class AddElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalUpdateVisible: false,
      isLoading: false,
      errorRead: null,
      composant: "",
      ref: "",
      prix: "",
      data: [{}],
      keys: [],
      selected:0,
      changeable:{}
    }
  }

  readAllData() {
    database()
      .ref('composants')
      .once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          this.setState({ errorRead: null, data: Object.values(snapshot.val()), keys: Object.keys(snapshot.val()) })
        } else {
          this.setState({ errorRead: 'Aucun element trouvé', isLoading: false })
        }
      })
      .catch((e) => console.log(e))
  }

  componentDidMount() {
    this.readAllData()
  }



  handleDelete(i) {
    const ref = database().ref('composants/' + this.state.keys[i])
    ref.remove()
      .then(() => {
        Alert.alert('element supprimé avec succée')
        this.readAllData()
      })
    this.setState()
  }

  requestDeletePermission(i) {
    Alert.alert('Confirmation', 'Sur bech tfasa5?', [{
      text: "Cancel",
      style: "cancel"
    },
    {
      text: "Oui",
      onPress: () => this.handleDelete(i)
    }])
  }

  handleSubmit() {
    this.setState({ isLoading: true })
    const newReference = database()
      .ref('/composants')
      .push();
    newReference.set({
      composant: this.state.composant,
      ref: this.state.ref,
      prix: this.state.prix
    }).then(() => {
      this.setState({ isLoading: false })
      this.setState({ modalVisible: !this.state.modalVisible });
      this.setState({ composant: "", prix: "", ref: "" })
      this.readAllData()
    })
      .catch(() => {
        this.setState({ isLoading: false })
        Alert.alert(
          'Erreur',
          'problèmes de connexion internet',
          [
            {
              text: 'Ok',
              onPress: () => this.setState({ composant: "", prix: "", ref: "" }),
              style: 'cancel'
            },
          ]
        );
      })

  }

  render() {
    return (
      <View>
        <View style={styles.title}>
          <Text style={{ fontSize: 20 }}>
            Liste des composants disponible
            </Text>
        </View>
        <ScrollView style={styles.elements}>
          <View>
            {
              !this.state.errorRead ? (this.state.data[0].prix  ?
                this.state.data.map((el, i) => {
                  return <TouchableHighlight key={i} onPress={() => this.setState({ selected: i, modalUpdateVisible: true , changeable:el})}>
                    <ListItem
                      title={el.composant}
                      subtitle={el.ref}
                      rightSubtitle={el.prix + " TND"}
                      bottomDivider
                      rightIcon={
                        {
                          name: 'trash',
                          type: 'font-awesome',
                          size: 30,
                          color: 'red',
                          onPress: () => this.requestDeletePermission(i)
                        }
                      }
                    />
                  </TouchableHighlight>
                })
                : <ActivityIndicator style={{ marginTop: "50%" }} size="large" />)
                : <Text style={{ color: 'red', fontSize: 20, marginTop: "50%", textAlign: 'center' }}>{this.state.errorRead}</Text>
            }

          </View>
        </ScrollView>
        <View style={styles.add}>
          <Button
            title="Ajouter"
            buttonStyle={{
              width: width / 3,
              borderRadius: 20,
              padding: 10,
              elevation: 2
            }}
            onPress={() => this.setState({ modalVisible: !this.state.modalVisible })}
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
                <Input
                  placeholder='Composant'
                  inputStyle={{ width: width / 2 }}
                  onChangeText={(text) => this.setState({ composant: text })}
                />
                <Input
                  placeholder='Réference'
                  onChangeText={(text) => this.setState({ ref: text })}
                />
                <Input
                  placeholder='prix'
                  keyboardType="decimal-pad"
                  onChangeText={(text) => {
                    let parts = text.split(',');
                    if (parts.length > 1) this.setState({ prix: parseFloat(text) })
                    else {
                      this.setState({ prix: parseFloat(parts[0] + '.' + parts[1]) })
                    }
                  }}
                />
              </View>
              <View style={{ flex: 2, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={() => {
                    this.handleSubmit()
                  }}
                >
                  {
                    this.state.isLoading ? <ActivityIndicator /> : <Text style={styles.textStyle}>Confimer</Text>
                  }

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

        {/* UPDATE MODAL HEREEEE*/}

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalUpdateVisible}
          onRequestClose={() => {
            this.setState({ modalUpdateVisible: false })
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalText}>Veuillez Saisir les données du composant</Text>
              </View>
              <View style={{ flex: 6, flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%" }}>
                <Input
                  value={this.state.changeable.composant}
                  placeholder='Composant'
                  inputStyle={{ width: width / 2 }}
                  onChangeText={(text) => {
                    let aux = Object.assign({}, this.state.changeable);
                    aux.composant = text;
                    this.setState({changeable : aux})
                  }
                }
                />
                <Input
                  value={this.state.changeable.ref}
                  placeholder='Réference'
                  onChangeText={(text) => {
                    let aux = Object.assign({}, this.state.changeable);
                    aux.ref = text;
                    this.setState({changeable : aux})
                  }}
                />
                <Input
                  placeholder='prix'
                  keyboardType="decimal-pad"
                  onChangeText={(text) => {
                    let aux = Object.assign({}, this.state.changeable);
                    let parts = text.split(',');
                    if (parts.length == 1) {
                      aux.prix = parseFloat(text)
                    }
                    else {
                      aux.prix = parseFloat(parts[0] + '.' + parts[1])
                    }
                    this.setState({changeable:aux})
                  }}
                />
              </View>
              <View style={{ flex: 2, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={() => {
                    this.handleSubmitUpdate(this.state.selected)
                  }}
                >
                  {
                    this.state.isLoading ? <ActivityIndicator /> : <Text style={styles.textStyle}>Confimer</Text>
                  }

                </TouchableHighlight>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#eb515f" }}
                  onPress={() => {
                    this.setState({ modalUpdateVisible: !this.state.modalUpdateVisible });
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
      </View>
    );


  }

  handleSubmitUpdate(i){
    this.setState({ isLoading: true })
    database()
    .ref('/composants/'+this.state.keys[i])
    .update({
      composant: this.state.changeable.composant,
      ref: this.state.changeable.ref,
      prix: this.state.changeable.prix
    })
    .then(() => {
      this.setState({ isLoading: false })
      this.setState({ modalUpdateVisible: !this.state.modalUpdateVisible });
      this.setState({ composant: "", prix: "", ref: "",selected:'',changeable:{} })
      this.readAllData()
    })
      .catch(() => {
        this.setState({ isLoading: false })
        Alert.alert(
          'Erreur',
          'problèmes de connexion internet',
          [
            {
              text: 'Ok',
              onPress: () => this.setState({ composant: "", prix: "", ref: "",selected:'',changeable:{} }),
              style: 'cancel'
            },
          ]
        );
      })
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
    backgroundColor: "#e2dede",
    height: 6 * height / 10,
    borderBottomWidth: 1,
    borderColor: "#20232a",
  },
  add: {
    justifyContent: 'center',
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
})