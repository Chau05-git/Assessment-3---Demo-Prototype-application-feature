import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const MAX_LEN = 500;

export default function QrGenerateScreen() {
  const params = useLocalSearchParams<{ initialText?: string }>();
  const initial = (params.initialText ?? '').slice(0, MAX_LEN);
  const [text, setText] = useState(initial);
  const [showQR, setShowQR] = useState(initial.length > 0);

  const generateQR = () => {
    if (!text.trim()) {
      Alert.alert('Empty', 'Please enter some text before generating a QR code.');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowQR(true);
  };

  const reset = () => {
    setShowQR(false);
  };

  const copyText = async () => {
    await Clipboard.setStringAsync(text);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Copied', 'Text has been copied to clipboard.');
  };

  const goToScanner = () => {
    router.push('/qr-scan');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Generate QR Code</Text>
        <Pressable onPress={goToScanner} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>Scan →</Text>
        </Pressable>
      </View>

      {!showQR ? (
        <View style={styles.inputArea}>
          <TextInput
            value={text}
            onChangeText={(t) => t.length <= MAX_LEN && setText(t)}
            placeholder="Type the text you want to share..."
            placeholderTextColor="#999"
            style={styles.textInput}
            multiline
            autoFocus
            returnKeyType="done"
            onSubmitEditing={generateQR}
          />
          <Text style={styles.counter}>
            {text.length} / {MAX_LEN} characters
          </Text>
          <Pressable
            style={[styles.primaryBtn, !text.trim() && styles.btnDisabled]}
            onPress={generateQR}
            disabled={!text.trim()}
          >
            <Text style={styles.primaryBtnText}>Generate QR Code</Text>
          </Pressable>
          <Text style={styles.hint}>
            Tip: pressing Enter in the input also generates the QR.
          </Text>
        </View>
      ) : (
        <View style={styles.qrArea}>
          <View style={styles.qrBox}>
            <QRCode
              value={text}
              size={260}
              color="#1a1a1a"
              backgroundColor="#ffffff"
            />
          </View>
          <Text style={styles.qrCaption}>
            Show this QR to another device camera or use the app's Scan feature.
          </Text>
          <Text style={styles.qrPreview} numberOfLines={3}>
            {text}
          </Text>

          <View style={styles.actionRow}>
            <Pressable style={styles.actionBtn} onPress={copyText}>
              <Text style={styles.actionBtnText}>Copy text</Text>
            </Pressable>
            <Pressable style={styles.actionBtn} onPress={reset}>
              <Text style={styles.actionBtnText}>Edit</Text>
            </Pressable>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 12,
    backgroundColor: '#1a1a1a',
  },
  headerBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  headerBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  inputArea: {
    flex: 1,
    padding: 16,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1a1a1a',
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 200,
  },
  counter: {
    textAlign: 'right',
    color: '#666',
    fontSize: 12,
    marginTop: 8,
  },
  primaryBtn: {
    marginTop: 16,
    backgroundColor: '#5a4def',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnDisabled: {
    backgroundColor: '#ccc',
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  hint: {
    textAlign: 'center',
    color: '#888',
    fontSize: 12,
    marginTop: 12,
  },
  qrArea: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  qrCaption: {
    marginTop: 16,
    textAlign: 'center',
    color: '#444',
    fontSize: 14,
    paddingHorizontal: 24,
  },
  qrPreview: {
    marginTop: 12,
    color: '#888',
    fontSize: 13,
    fontStyle: 'italic',
    paddingHorizontal: 24,
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  actionBtn: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
