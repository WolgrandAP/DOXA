import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

export default function LoginScreen() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    
    console.log('Tentando fazer login com:', email);
    
    router.replace('/(tabs)');
  };

  const handleNavigateToRegister = () => {
    router.push('/(auth)/register');
  };

  return (
    <View style={styles.container}>
    <StatusBar barStyle="light-content" />
    
    {/* Background Gradient */}
    <LinearGradient
      colors={["#050510", "#050510", "#170326"]}
      style={StyleSheet.absoluteFill}
    />

        <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          style={styles.keyboardView} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Bem-vindo(a) ao DOXA</Text>
              <Text style={styles.subtitle}>Faça login para continuar</Text>
            </View>

         <View style={styles.cardOuter}>
              <BlurView intensity={15} tint="dark" style={styles.glassCard}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>E-mail</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite seu e-mail"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

        {/* Input de Senha */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Senha</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite sua senha"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>

        <TouchableOpacity onPress={handleLogin} activeOpacity={0.8} style={styles.loginButtonWrapper}>
                  <LinearGradient
                    colors={["#a855f7", "#7e22ce"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.loginButton}
                  >
                    <Text style={styles.loginButtonText}>Entrar</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.registerLink} onPress={handleNavigateToRegister}>
                  <Text style={styles.registerLinkText}>
                    Não tem uma conta? <Text style={styles.registerLinkTextBold}>Cadastre-se</Text>
                  </Text>
                </TouchableOpacity>
              </BlurView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050510',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  loginButtonWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
  },
  cardOuter: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  glassCard: {
    padding: 24,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
    fontWeight: '600',
    marginLeft: 4,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  loginButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 24,
    alignItems: 'center',
    paddingVertical: 10,
  },
  registerLinkText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  registerLinkTextBold: {
    color: '#c084fc',
    fontWeight: 'bold',
  },
});
