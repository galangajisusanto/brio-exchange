import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, Alert } from 'react-native';
import Colors from '../styles/Colors';
import VerticalSpace from '../components/VerticalSpace';
import BiometricService from '../../services/BiometricService';
import BrioStyles from '../styles/BrioStyles';


export default function LoginScreen({ navigation }) {

    const handleBiometricLogin = async () => {
        console.log('🚀 Starting biometric login process...');
        try {

            const result = await BiometricService.authenticateWithBiometrics();

            if (result.success) {
                console.log('✅ Login successful!');
                navigation.replace('CurrencyExchangeIndex');



            } else {
                console.log('❌ Login failed:', result.error);
                Alert.alert('Authentication Failed', result.error);
            }
        } catch (error) {
            console.error('❌ Unexpected login error:', error);
            Alert.alert('Error', 'An unexpected error occurred during authentication.');
        } finally {
            console.log('Login process completed');
        }
    };

    return (
        <View style={BrioStyles.container}>
            <StatusBar style="dark" />

            <ImageBackground
                source={require('../../../assets/images/login-background.png')}
                style={BrioStyles.backgroundImage}
                resizeMode="contain">

                {/* Content */}
                <View style={BrioStyles.content}>
                    <Image
                        source={require('../../../assets/images/brio-xchange-logo.png')}
                        resizeMode="contain"
                    />
                    <VerticalSpace height={17} />
                    <Text style={[BrioStyles.titleText, { fontSize: 30 }]}>brioXchange</Text>
                    <VerticalSpace height={8} />
                    <Text style={BrioStyles.regularText}>Your daily exchange rate management</Text>
                    {/* Login Button */}
                    <VerticalSpace height={36} />
                    <TouchableOpacity style={BrioStyles.primaryButton} onPress={handleBiometricLogin}>
                        <Text style={BrioStyles.primaryButtonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>

            {/* Footer */}
            <View style={BrioStyles.footer}>
                <Text style={BrioStyles.captionText}>powered by</Text>
                <VerticalSpace height={2} />
                <Image
                    source={require('../../../assets/images/brio-hr-logo.png')}
                    resizeMode="contain"
                />
            </View>
        </View>
    );
}
