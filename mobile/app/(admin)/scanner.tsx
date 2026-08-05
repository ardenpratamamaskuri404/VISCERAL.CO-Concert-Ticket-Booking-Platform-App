import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Vibration } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/theme';
import api from '../../src/api/axios';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import dayjs from 'dayjs';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const { logout } = useAuth();
  
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; ticket?: any } | null>(null);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Kami membutuhkan izin kamera untuk memindai tiket</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Izinkan Kamera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSec} onPress={() => router.back()}>
          <Text style={styles.btnTextSec}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned || loading) return;
    setScanned(true);
    setLoading(true);
    
    // Vibrate when QR is detected
    Vibration.vibrate(100);

    try {
      const response = await api.put('/tickets/checkin', { ticketCode: data });
      if (response.data && response.data.success) {
        setScanResult({
          success: true,
          message: response.data.message,
          ticket: response.data.ticket
        });
        // Double vibration for success
        Vibration.vibrate([0, 100, 100, 100]);
      }
    } catch (error: any) {
      setScanResult({
        success: false,
        message: error.response?.data?.message || 'Gagal memproses tiket',
      });
      // Long vibration for error
      Vibration.vibrate(500);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      {!scanned ? (
        <CameraView 
          style={styles.camera} 
          facing="back"
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        >
          <View style={styles.overlay}>
            <View style={styles.header}>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                <Ionicons name="exit-outline" size={24} color={Colors.white} />
                <Text style={styles.logoutTxt}>Keluar</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>GATE SCANNER</Text>
              <View style={{ width: 60 }} />
            </View>
            
            <View style={styles.scannerFrame}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
              <View style={styles.scanLine} />
            </View>
            
            <Text style={styles.instruction}>Arahkan QR Code tiket penonton ke dalam area ini</Text>
          </View>
        </CameraView>
      ) : (
        <View style={[styles.resultContainer, scanResult?.success ? styles.resultSuccess : styles.resultError]}>
          {loading ? (
            <View style={{ alignItems: 'center' }}>
              <ActivityIndicator size="large" color={Colors.white} />
              <Text style={styles.loadingText}>Memproses Tiket...</Text>
            </View>
          ) : (
            <View style={styles.resultContent}>
              <Ionicons 
                name={scanResult?.success ? "checkmark-circle" : "close-circle"} 
                size={120} 
                color={Colors.white} 
              />
              <Text style={styles.resultTitle}>
                {scanResult?.success ? 'AKSES DITERIMA' : 'AKSES DITOLAK'}
              </Text>
              <Text style={styles.resultMessage}>
                {scanResult?.message}
              </Text>
              
              {scanResult?.success && scanResult?.ticket && (
                <View style={styles.ticketInfo}>
                  <Text style={styles.ticketLabel}>Penonton</Text>
                  <Text style={styles.ticketValue}>{scanResult.ticket.order?.customerName || 'Unknown'}</Text>
                  
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                    <View>
                      <Text style={styles.ticketLabel}>Kategori</Text>
                      <Text style={styles.ticketValueSm}>{scanResult.ticket.category?.name || scanResult.ticket.seat?.category?.name || 'General'}</Text>
                    </View>
                    <View>
                      <Text style={styles.ticketLabel}>Kursi</Text>
                      <Text style={styles.ticketValueSm}>{scanResult.ticket.seat?.seatNumber || 'Standing / Bebas'}</Text>
                    </View>
                  </View>

                  {scanResult.ticket.event && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                      <View>
                        <Text style={styles.ticketLabel}>Tanggal Acara</Text>
                        <Text style={styles.ticketValueSm}>{dayjs(scanResult.ticket.event.eventDate).format('DD MMM YYYY')}</Text>
                      </View>
                      <View>
                        <Text style={styles.ticketLabel}>Open Gate</Text>
                        <Text style={styles.ticketValueSm}>{dayjs(scanResult.ticket.event.eventDate).subtract(1, 'hour').format('HH:mm')} WIB</Text>
                      </View>
                    </View>
                  )}
                </View>
              )}

              <TouchableOpacity 
                style={{ backgroundColor: Colors.obsidian, paddingHorizontal: 32, paddingVertical: 16, borderRadius: 12, marginTop: 20 }}
                onPress={() => {
                  setScanResult(null);
                  setScanned(false);
                }}
              >
                <Text style={{ color: Colors.white, fontSize: 16, fontWeight: 'bold' }}>TUTUP & LANJUT SCAN</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.obsidian, justifyContent: 'center' },
  text: { color: Colors.white, textAlign: 'center', marginBottom: 20, fontSize: 16 },
  btn: { backgroundColor: Colors.gold, padding: 16, borderRadius: 12, marginHorizontal: 20, marginBottom: 12 },
  btnSec: { backgroundColor: Colors.darkSurface, padding: 16, borderRadius: 12, marginHorizontal: 20 },
  btnText: { color: Colors.obsidian, textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  btnTextSec: { color: Colors.white, textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  camera: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 50 },
  header: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginTop: 20 },
  headerTitle: { color: Colors.white, fontSize: 20, fontWeight: '900', letterSpacing: 2 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  logoutTxt: { color: Colors.white, marginLeft: 6, fontWeight: 'bold' },
  scannerFrame: { width: 250, height: 250, position: 'relative' },
  corner: { position: 'absolute', width: 40, height: 40, borderColor: Colors.gold },
  cornerTL: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 16 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 16 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 16 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 16 },
  scanLine: { width: '100%', height: 2, backgroundColor: Colors.gold, position: 'absolute', top: '50%', opacity: 0.5 },
  instruction: { color: Colors.white, fontSize: 14, textAlign: 'center', paddingHorizontal: 40, marginBottom: 40 },
  resultContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  resultSuccess: { backgroundColor: '#166534' },
  resultError: { backgroundColor: '#991b1b' },
  resultContent: { alignItems: 'center', width: '100%' },
  resultTitle: { color: Colors.white, fontSize: 32, fontWeight: '900', marginTop: 20, marginBottom: 8, textAlign: 'center' },
  resultMessage: { color: 'rgba(255,255,255,0.8)', fontSize: 18, textAlign: 'center', marginBottom: 32 },
  loadingText: { color: Colors.white, marginTop: 16, fontSize: 18, fontWeight: 'bold' },
  ticketInfo: { backgroundColor: 'rgba(0,0,0,0.3)', width: '100%', padding: 20, borderRadius: 16, marginBottom: 40 },
  ticketLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, textTransform: 'uppercase', fontWeight: 'bold', marginBottom: 4 },
  ticketValue: { color: Colors.white, fontSize: 24, fontWeight: '900' },
  ticketValueSm: { color: Colors.gold, fontSize: 20, fontWeight: 'bold' },
  resumeText: { color: 'rgba(255,255,255,0.6)', fontSize: 14, fontStyle: 'italic', position: 'absolute', bottom: -50 }
});
