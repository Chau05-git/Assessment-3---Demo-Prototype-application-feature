import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function HomeScreen() {
  const [text, setText] = useState('');

  const goToGenerate = () => {
    Keyboard.dismiss();
    Haptics.selectionAsync();
    router.push({
      pathname: '/qr-generate',
      params: text.trim() ? { initialText: text } : {},
    });
  };

  const goToScan = () => {
    Keyboard.dismiss();
    Haptics.selectionAsync();
    router.push('/qr-scan');
  };

  const clearText = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setText('');
  };

  const hasText = text.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <View style={styles.text_box}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type something..."
            placeholderTextColor="#bbb"
            style={styles.text_input}
            autoCorrect={true}
            multiline={true}
            textAlignVertical="top"
            blurOnSubmit={false}
          />
        </View>

        {hasText && (
          <Pressable style={styles.qr_preview} onPress={goToGenerate}>
            <QRCode value={text} size={110} />
            <Text style={styles.qr_label}>Tap to share</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.demo_navigation}>
        <Pressable style={styles.bar_items} onPress={goToGenerate}>
          <Text style={styles.bar_text}>Create QR</Text>
        </Pressable>

        <Pressable style={styles.bar_items} onPress={goToScan}>
          <Text style={styles.bar_text}>Scan QR</Text>
        </Pressable>

        <Pressable style={styles.bar_items} onPress={clearText}>
          <Text style={styles.bar_text}>Clear</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_box: {
    backgroundColor: '#d8d7e4',
    width: 220,
    height: 150,
    borderRadius: 20,
    borderColor: '#598235',
    borderWidth: 2,
    padding: 10,
  },
  text_input: {
    flex: 1,
    backgroundColor: '#783030',
    color: '#fff',
    padding: 6,
    borderRadius: 8,
  },
  qr_preview: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  qr_label: {
    marginTop: 8,
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  demo_navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#b02020',
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
  },
  bar_items: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5a4def',
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bar_text: {
    color: '#fff',
    fontWeight: '600',
  },
});
