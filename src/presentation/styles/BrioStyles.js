import { StyleSheet } from 'react-native';
import Colors from './Colors';

const BrioStyles = StyleSheet.create({
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
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
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
    secondaryButton: {
        backgroundColor: Colors.WHITE,
        borderWidth: 1,
        borderColor: Colors.GREEN,
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 16,
        width: '100%',
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: Colors.GREEN,
        fontSize: 16,
        fontWeight: '500',
    },
    primaryButtonText: {
        color: Colors.WHITE,
        fontSize: 19,
        fontWeight: '500',
    },
    titleText: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.COFFEE_700,
    },
    subTitleText: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.COFFEE_700,
    },
    regularText: {
        fontSize: 14,
        fontWeight: '400',
        color: Colors.COFFEE_700,
    },
    captionText: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.COFFEE_700,
    },

});

export default BrioStyles;