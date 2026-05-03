import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function HomeScreen() {
  const [text, setText] = useState("");

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.inner}>
          <View style={styles.text_box}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Type something..."
              style={styles.text_input}
              autoCorrect={true}
              numberOfLines={6}
              multiline={true}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.demo_navigation}>
        <Pressable style={styles.bar_items}>
          <Text>Go to explore</Text>
        </Pressable>

        <Pressable style={styles.bar_items}>
          <Text>Go to where</Text>
        </Pressable>

        <Pressable style={styles.bar_items}>
          <Text>ehehe</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text_box: {
    backgroundColor: "#d8d7e4",
    width: 220,
    height: 150,
    borderRadius: 20,
    borderColor: "#598235",
    borderWidth: 2,
    padding: 10,
  },
  text_input: {
    flex: 1,
    backgroundColor: "#783030",
  },
  demo_navigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#b02020",
    paddingBottom: Platform.OS === "ios" ? 30 : 10,
  },
  bar_items: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5a4def",
    marginTop: 10,
  },
});
