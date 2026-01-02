import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function SignupScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSignup = () => {
        // Navigate home on success (mock)
        navigation.replace('Home');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    <View style={styles.card}>
                        <View style={styles.header}>
                            <View style={styles.logoPlaceholder}>
                                <Ionicons name="person-add-outline" size={35} color="#3b82f6" />
                            </View>
                            <Text style={styles.headerTitle}>Create Account</Text>
                            <Text style={styles.headerSubtitle}>Join QP Generator today</Text>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Full Name</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChangeText={setName}
                                        placeholderTextColor="#999"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Email Address</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="name@example.com"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        placeholderTextColor="#999"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Password</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Create a password"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                        placeholderTextColor="#999"
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#666" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Confirm Password</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Re-enter password"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry={!showPassword}
                                        placeholderTextColor="#999"
                                    />
                                </View>
                            </View>

                            <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                                <Text style={styles.signupButtonText}>Sign Up</Text>
                            </TouchableOpacity>

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Already have an account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <Text style={styles.linkText}>Log in</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 30,
        width: '100%',
        maxWidth: 450,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    header: {
        marginBottom: 25,
        alignItems: 'center',
    },
    logoPlaceholder: {
        width: 60,
        height: 60,
        backgroundColor: '#EFF6FF',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 15,
        color: '#6B7280',
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 18,
    },
    label: {
        fontSize: 14,
        color: '#374151',
        marginBottom: 8,
        fontWeight: '600',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        backgroundColor: '#F9FAFB',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#111827',
    },
    signupButton: {
        backgroundColor: '#3b82f6',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    signupButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
    },
    footerText: {
        color: '#6B7280',
        fontSize: 15,
    },
    linkText: {
        color: '#3b82f6',
        fontSize: 15,
        fontWeight: 'bold',
    },
});
