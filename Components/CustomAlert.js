import { Modal, StyleSheet, Text, Pressable, View } from "react-native";

const CustomAlert = (props) => {
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.modalVisible}
      >
        <View style={styles.centeredView}>
          <View
            style={
              props.Mode === "light" ? styles.modalView : styles.modalViewD
            }
          >
            <Text
              style={
                props.Mode === "light" ? styles.modalText : styles.modalTextD
              }
            >
              {props.TextAlert}
            </Text>
            <Pressable
              style={styles.button}
              onPress={() => props.setModalVisible(!props.modalVisible)}
            >
              <Text style={styles.textStyle}>Ok</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,
  },
  modalView: {
    width: 250,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 35,
    opacity: 0.9,
  },

  modalViewD: {
    width: 250,
    margin: 20,
    backgroundColor: "black",
    borderRadius: 5,
    padding: 35,
    opacity: 0.9,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: "black",
  },
  modalTextD: {
    marginBottom: 15,
    textAlign: "center",
    color: "white",
  },
  button: {
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#9CB9D8",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CustomAlert;
