import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';

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
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Bem-vindo(a) ao DOXA</Text>
        <Text style={styles.subtitle}>Faça login para continuar</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            placeholderTextColor="#888"
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
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerLink} onPress={handleNavigateToRegister}>
          <Text style={styles.registerLinkText}>
            Não tem uma conta? <Text style={styles.registerLinkTextBold}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050510',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0A0',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#E0E0E0',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#1A1A24',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2A2A35',
  },
  loginButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
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
    color: '#A0A0A0',
    fontSize: 14,
  },
  registerLinkTextBold: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
});
