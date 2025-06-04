import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ImageBackground } from 'react-native';
import Colors from '../styles/Colors';
import VerticalSpace from '../components/VerticalSpace';

export default function LoginScreen() {

    const handleLogin = () => {
        // Handle login logic here
        console.log('Login pressed');
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <ImageBackground
                source={require('../../../assets/images/login-background.png')}
                style={styles.backgroundImage}
                resizeMode="contain">

                {/* Content */}
                <View style={styles.content}>
                    <Image
                        source={require('../../../assets/images/brio-xchange-logo.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                    <VerticalSpace height={17} />
                    <Text style={[styles.titleText, { fontSize: 30 }]}>brioXchange</Text>
                    <VerticalSpace height={8} />
                    <Text style={styles.regularText}>Your daily exchange rate management</Text>
                    {/* Login Button */}
                    <VerticalSpace height={36} />
                    <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
                        <Text style={styles.primaryButtonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.captionText}>powered by</Text>
                <VerticalSpace height={2} />
                <Image
                    source={require('../../../assets/images/brio-hr-logo.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        marginTop: 50,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 30,
    },
    footer: {
        alignItems: 'center',
        paddingBottom: 40,
    },
    primaryButton: {
        backgroundColor: '#02A284',
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 16,
        width: '100%',
        alignItems: 'center',
    },
    primaryButtonText: {
        color: Colors.WHITE,
        fontSize: 19,
        fontWeight: '500',
    },
    titleText: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.TEXT_PRIMARY,
    },
    subTitleText: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.TEXT_PRIMARY,
    },
    regularText: {
        fontSize: 14,
        fontWeight: '400',
        color: Colors.TEXT_PRIMARY,
    },
    captionText: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.TEXT_PRIMARY,
    },
});