// Mock console methods to reduce noise in tests
global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
};

// Mock React Native modules
jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native');
    return {
        ...RN,
        Platform: {
            ...RN.Platform,
            OS: 'ios',
            select: jest.fn((obj) => obj.ios),
        },
        Dimensions: {
            get: jest.fn(() => ({ width: 375, height: 812 })),
        },
        Alert: {
            alert: jest.fn(),
        },
        NativeModules: {
            ...RN.NativeModules,
            SettingsManager: {
                settings: {
                    AppleLocale: 'en_US',
                    AppleLanguages: ['en'],
                },
            },
        },
    };
});

// Mock Expo modules
jest.mock('expo-status-bar', () => ({
    StatusBar: 'StatusBar',
}));

jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons',
    MaterialIcons: 'MaterialIcons',
}));

// Mock navigation
jest.mock('@react-navigation/native', () => {
    return {
        useFocusEffect: jest.fn(),
        useNavigation: () => ({
            navigate: jest.fn(),
            goBack: jest.fn(),
            setParams: jest.fn(),
            addListener: jest.fn(),
        }),
        useRoute: () => ({
            params: {},
        }),
    };
});

// Global test timeout
jest.setTimeout(10000);