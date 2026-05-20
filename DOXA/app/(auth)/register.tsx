import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (name.trim() === '' || email.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem. Tente novamente.');
      return;
    }
    
    console.log('Criando conta para:', name, email);
    
    Alert.alert('Sucesso', 'Sua conta foi criada!', [
      { 
        text: 'OK', 
        onPress: () => router.replace('/(tabs)')
      }
    ]);
  };

  const handleNavigateToLogin = () => {
    router.back(); 
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Junte-se ao DOXA hoje mesmo</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome"
            placeholderTextColor="#888"
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
          />
        </View>

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

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Crie uma senha forte"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirmar Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Repita sua senha"
            placeholderTextColor="#888"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginLink} onPress={handleNavigateToLogin}>
          <Text style={styles.loginLinkText}>
            Já tem uma conta? <Text style={styles.loginLinkTextBold}>Faça login</Text>
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050510',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    marginBottom: 32,
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
  registerButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 24,
    alignItems: 'center',
    paddingVertical: 10,
  },
  loginLinkText: {
    color: '#A0A0A0',
    fontSize: 14,
  },
  loginLinkTextBold: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
});