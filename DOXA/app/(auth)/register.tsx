import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

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
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            <View style={styles.header}>
              <Text style={styles.title}>Criar Conta</Text>
              <Text style={styles.subtitle}>Junte-se ao DOXA hoje mesmo</Text>
            </View>

        <View style={styles.cardOuter}>
              <BlurView intensity={15} tint="dark" style={styles.glassCard}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Nome Completo</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite seu nome"
                    placeholderTextColor="rgba(255,255,255,0.3)"
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
                    placeholderTextColor="rgba(255,255,255,0.3)"
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
                    placeholderTextColor="rgba(255,255,255,0.3)"
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
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                </View>

        <TouchableOpacity onPress={handleRegister} activeOpacity={0.8} style={styles.registerButtonWrapper}>
                  <LinearGradient
                    colors={["#a855f7", "#7e22ce"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.registerButton}
                  >
                    <Text style={styles.registerButtonText}>Cadastrar</Text>
                  </LinearGradient>
                </TouchableOpacity>

      <TouchableOpacity style={styles.loginLink} onPress={handleNavigateToLogin}>
                  <Text style={styles.loginLinkText}>
                    Já tem uma conta? <Text style={styles.loginLinkTextBold}>Faça login</Text>
                  </Text>
                </TouchableOpacity>
              </BlurView>
            </View>

          </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
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
  registerButtonWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
  },
  registerButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  loginLinkTextBold: {
    color: '#c084fc',
    fontWeight: 'bold',
  },
});