import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    resetError = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <ScrollView contentContainerStyle={styles.content}>
                        <Text style={styles.title}>Something went wrong</Text>
                        <Text style={styles.subtitle}>
                            The application encountered an error and cannot continue.
                        </Text>

                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>
                                {this.state.error && this.state.error.toString()}
                            </Text>
                        </View>

                        <TouchableOpacity style={styles.button} onPress={this.resetError}>
                            <Text style={styles.buttonText}>Try Again</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEF2F2', // Light red background
        paddingTop: 50,
    },
    content: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#991B1B',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#7F1D1D',
        textAlign: 'center',
        marginBottom: 30,
    },
    errorBox: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FCA5A5',
        width: '100%',
        marginBottom: 30,
    },
    errorText: {
        color: '#EF4444',
        fontFamily: 'monospace',
        fontSize: 14,
    },
    button: {
        backgroundColor: '#DC2626',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
