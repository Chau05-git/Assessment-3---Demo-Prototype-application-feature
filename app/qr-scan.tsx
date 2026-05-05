import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';
import { useRef, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function QrScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedText, setScannedText] = useState<string | null>(null);
  const lastScanRef = useRef<{ data: string; ts: number } | null>(null);

  const onScanned = ({ data }: { data: string }) => {
    // Debounce: skip if same content within 2s
    const now = Date.now();
    if (
      lastScanRef.current &&
      lastScanRef.current.data === data &&
      now - lastScanRef.current.ts < 2000
    ) {
      return;
    }
    lastScanRef.current = { data, ts: now };

    if (scannedText) return; // already have a result

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setScannedText(data);
  };

  const speakText = () => {
    if (!scannedText) return;
    Speech.stop();
    Speech.speak(scannedText, {
      language: detectLang(scannedText),
      pitch: 1,
      rate: 1,
    });
  };

  const stopSpeaking = () => {
    Speech.stop();
  };

  const copyText = async () => {
    if (!scannedText) return;
    await Clipboard.setStringAsync(scannedText);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Copied', 'Text has been copied to clipboard.');
  };

  const shareText = async () => {
    if (!scannedText) return;
    await Clipboard.setStringAsync(scannedText);
    Alert.alert(
      'Copied for sharing',
      'Text copied to clipboard. Open Messages, Mail, or any chat app and paste.'
    );
  };

  const scanAgain = () => {
    setScannedText(null);
    lastScanRef.current = null;
  };

  const goToGenerator = () => {
    router.push('/qr-generate');
  };

  // Permission handling
  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={styles.statusText}>Checking camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.statusText}>
          Camera permission is required to scan QR codes.
        </Text>
        <Pressable style={styles.primaryBtn} onPress={requestPermission}>
          <Text style={styles.primaryBtnText}>Grant camera permission</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn} onPress={() => router.back()}>
          <Text style={styles.secondaryBtnText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Scan QR Code</Text>
        <Pressable onPress={goToGenerator} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>Create →</Text>
        </Pressable>
      </View>

      {!scannedText ? (
        <View style={styles.cameraWrap}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={onScanned}
          />
          {/* QR alignment frame */}
          <View style={styles.overlay}>
            <View style={styles.frame}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>
            <Text style={styles.scanHint}>Align the QR code inside the frame</Text>
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.resultArea}>
          <Text style={styles.resultLabel}>Scanned content:</Text>
          <View style={styles.resultBox}>
            <Text style={styles.resultText} selectable>
              {scannedText}
            </Text>
          </View>

          <View style={styles.actionGrid}>
            <Pressable style={styles.actionBtn} onPress={speakText}>
              <Text style={styles.actionIcon}>🔊</Text>
              <Text style={styles.actionLabel}>Read aloud</Text>
            </Pressable>
            <Pressable style={styles.actionBtn} onPress={stopSpeaking}>
              <Text style={styles.actionIcon}>⏹</Text>
              <Text style={styles.actionLabel}>Stop</Text>
            </Pressable>
            <Pressable style={styles.actionBtn} onPress={copyText}>
              <Text style={styles.actionIcon}>📋</Text>
              <Text style={styles.actionLabel}>Copy</Text>
            </Pressable>
            <Pressable style={styles.actionBtn} onPress={shareText}>
              <Text style={styles.actionIcon}>↗️</Text>
              <Text style={styles.actionLabel}>Share</Text>
            </Pressable>
          </View>

          <Pressable style={styles.primaryBtn} onPress={scanAgain}>
            <Text style={styles.primaryBtnText}>Scan another</Text>
          </Pressable>
        </ScrollView>
      )}
    </View>
  );
}

// Detect language for TTS — Vietnamese diacritics → Vietnamese voice
function detectLang(text: string): string {
  const viChars = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
  return viChars.test(text) ? 'vi-VN' : 'en-US';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  statusText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
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
  cameraWrap: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: 260,
    height: 260,
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: '#5a4def',
    borderWidth: 4,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  scanHint: {
    color: '#fff',
    marginTop: 24,
    fontSize: 14,
    textShadowColor: '#000',
    textShadowRadius: 4,
  },
  resultArea: {
    padding: 16,
    paddingTop: 32,
    alignItems: 'stretch',
  },
  resultLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resultBox: {
    backgroundColor: '#1f1f1f',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#5a4def',
  },
  resultText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  actionBtn: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1f1f1f',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  primaryBtn: {
    backgroundColor: '#5a4def',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtn: {
    marginTop: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#999',
  },
  secondaryBtnText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
});
