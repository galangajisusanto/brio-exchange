import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../styles/Colors';
import BrioStyles from '../styles/BrioStyles';
import VerticalSpace from './VerticalSpace';
import { StatusBar } from 'expo-status-bar';

const { height: screenHeight } = Dimensions.get('window');

export default function DeleteConfirmationDialog({
    visible,
    onCancel,
    onConfirm,
    title = "Confirm Delete?",
    message = "This action cannot be undone"
}) {
    const slideAnim = React.useRef(new Animated.Value(300)).current;
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 300,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const handleOverlayPress = () => {
        onCancel();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onCancel}
        >
            <StatusBar style="dark" translucent />
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={handleOverlayPress}
            >
                <Animated.View
                    style={[
                        styles.overlay,
                        {
                            opacity: fadeAnim,
                        }
                    ]}
                >
                    <TouchableOpacity
                        style={styles.bottomSheetContainer}
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <Animated.View
                            style={[
                                styles.bottomSheet,
                                {
                                    transform: [{ translateY: slideAnim }],
                                }
                            ]}
                        >
                            {/* Handle/Indicator */}
                            <View style={styles.handle} />

                            {/* Delete icon */}
                            <Ionicons name="trash-outline" size={48} color={Colors.ERROR} />


                            {/* Title */}
                            <VerticalSpace height={26} />
                            <Text style={BrioStyles.subTitleText}>{title}</Text>

                            {/* Message */}
                            <VerticalSpace height={12} />
                            <Text style={BrioStyles.regularText}>{message}</Text>
                            <VerticalSpace height={75} />
                            {/* Buttons */}
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[BrioStyles.secondaryButton, { flex: 1 }]}
                                    onPress={onCancel}
                                >
                                    <Text style={BrioStyles.secondaryButtonText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[BrioStyles.primaryButton, { flex: 1, backgroundColor: Colors.ERROR }]}
                                    onPress={onConfirm}
                                >
                                    <Text style={[BrioStyles.primaryButtonText, { fontSize: 16 }]}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </TouchableOpacity>
                </Animated.View>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    bottomSheetContainer: {
        justifyContent: 'flex-end',
        flex: 1,
    },
    bottomSheet: {
        backgroundColor: Colors.WHITE,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 24,
        paddingHorizontal: 20,
        paddingBottom: 40,
        alignItems: 'center',
        minHeight: 280,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: Colors.GRAY,
        borderRadius: 2,
        marginBottom: 90,
        alignSelf: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
});