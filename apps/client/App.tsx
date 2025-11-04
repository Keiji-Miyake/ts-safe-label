import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { api } from './lib/apiClient';

export default function App() {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // API からデータを取得
  const fetchGreeting = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getGreeting();
      setMessage(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
      console.error('API エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  // コンポーネントマウント時に API を呼び出し
  useEffect(() => {
    fetchGreeting();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>expo-workers-monorepo</Text>
      <Text style={styles.subtitle}>Expo + Cloudflare Workers</Text>

      <View style={styles.content}>
        {loading ? (
          <>
            <ActivityIndicator size="large" color="#0066cc" />
            <Text style={styles.loadingText}>API から読み込み中...</Text>
          </>
        ) : error ? (
          <>
            <Text style={styles.errorText}>❌ {error}</Text>
            <TouchableOpacity style={styles.button} onPress={fetchGreeting}>
              <Text style={styles.buttonText}>再試行</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.message}>✅ {message}</Text>
            <TouchableOpacity style={styles.button} onPress={fetchGreeting}>
              <Text style={styles.buttonText}>再読み込み</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>API: http://localhost:8787</Text>
        <Text style={styles.infoText}>Client: http://localhost:8081</Text>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    width: '100%',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  message: {
    fontSize: 18,
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  info: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#999',
    marginVertical: 2,
  },
});
