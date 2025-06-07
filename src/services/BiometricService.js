import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';

class BiometricService {

    // Check if biometric authentication is available
    static async isBiometricAvailable() {
        try {
            const isAvailable = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            return {
                isAvailable,
                isEnrolled,
                canUseBiometric: isAvailable && isEnrolled
            };
        } catch (error) {
            console.error('Error checking biometric availability:', error);
            return {
                isAvailable: false,
                isEnrolled: false,
                canUseBiometric: false
            };
        }
    }

    // Get available authentication types
    static async getSupportedAuthenticationTypes() {
        try {
            const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
            return types;
        } catch (error) {
            console.error('Error getting authentication types:', error);
            return [];
        }
    }

    // Get the biometric type name for display
    static async getBiometricTypeName() {
        try {
            const authTypes = await this.getSupportedAuthenticationTypes();

            if (authTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
                return 'Face ID';
            } else if (authTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
                return 'Fingerprint';
            } else if (authTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
                return 'Iris';
            } else {
                return 'Biometric';
            }
        } catch (error) {
            console.error('Error getting biometric type:', error);
            return 'Biometric';
        }
    }

    // Authenticate with biometrics only
    static async authenticateWithBiometrics() {
        try {
            console.log('🔐 Starting biometric authentication...');

            const biometricStatus = await this.isBiometricAvailable();
            console.log('Biometric status:', biometricStatus);

            if (!biometricStatus.canUseBiometric) {
                const errorMsg = !biometricStatus.isAvailable
                    ? 'Biometric hardware is not available on this device.'
                    : 'No biometric credentials are enrolled. Please set up biometric authentication in your device settings.';

                console.log('❌ Biometric not available:', errorMsg);
                return { success: false, error: errorMsg };
            }

            const biometricType = await this.getBiometricTypeName();
            console.log('Using biometric type:', biometricType);

            const authResult = await LocalAuthentication.authenticateAsync({
                promptMessage: `Use ${biometricType} to access BrioXchange`,
                subPromptMessage: 'Touch the sensor or look at the camera',
                cancelLabel: 'Cancel',
                disableDeviceFallback: true, // Disable fallback to device PIN/password
                requireConfirmation: false, // Don't require additional confirmation
            });

            console.log('Authentication result:', authResult);

            if (authResult.success) {
                console.log('✅ Biometric authentication successful');
                return { success: true, data: authResult };
            } else {
                let errorMessage = 'Authentication failed';

                switch (authResult.error) {
                    case 'UserCancel':
                        errorMessage = 'Authentication was cancelled by user';
                        break;
                    case 'UserFallback':
                        errorMessage = 'User tried to use fallback authentication';
                        break;
                    case 'SystemCancel':
                        errorMessage = 'Authentication was cancelled by the system';
                        break;
                    case 'PasscodeNotSet':
                        errorMessage = 'Device passcode is not set';
                        break;
                    case 'BiometricNotAvailable':
                        errorMessage = 'Biometric authentication is not available';
                        break;
                    case 'BiometricNotEnrolled':
                        errorMessage = 'No biometric credentials are enrolled';
                        break;
                    case 'TouchIDLockout':
                    case 'BiometricLockout':
                        errorMessage = 'Too many failed attempts. Please try again later.';
                        break;
                    default:
                        errorMessage = `Authentication failed: ${authResult.error}`;
                }

                console.log('❌ Authentication failed:', errorMessage);
                return { success: false, error: errorMessage };
            }
        } catch (error) {
            console.error('❌ Biometric authentication error:', error);
            return { success: false, error: 'An unexpected error occurred during authentication' };
        }
    }

}

export default BiometricService;