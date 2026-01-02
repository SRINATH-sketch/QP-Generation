import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Alert, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function PreviewScreen({ route, navigation }) {
    const { query, syllabusFiles, outcomeFiles, textbookFiles, attachments } = route.params || {};

    // State to hold the single generated paper's sections
    const [sections, setSections] = useState([]);
    const [isGenerating, setIsGenerating] = useState(true);

    useEffect(() => {
        // Simulate generation delay
        const timer = setTimeout(() => {

            // Default AIML Mock Data if no pattern regex matches
            let parsedSections = [];
            const pattern = query || "";

            // Regex for pattern matching (Part-A 10Q etc)
            const partRegex = /(Part[- ]?[A-Z0-9]+|Section[- ]?[A-Z0-9]+).*?(\d+)\s*Q/gi;
            let match;

            while ((match = partRegex.exec(pattern)) !== null) {
                parsedSections.push({
                    title: match[1],
                    count: parseInt(match[2], 10)
                });
            }

            // Default AIML specific questions if no pattern is provided
            if (parsedSections.length === 0) {
                // AIML Mock Data
                const aimlQuestionsA = [
                    "Define Artificial Intelligence and list its applications.",
                    "What is the difference between Supervised and Unsupervised learning?",
                    "Define Overfitting and Underfitting in Machine Learning.",
                    "What is a Confusion Matrix? Explain its parameters.",
                    "Define Perceptron."
                ];
                const aimlQuestionsB = [
                    "Explain the Backpropagation algorithm with a neat diagram.",
                    "Differentiate between K-Nearest Neighbors (KNN) and K-Means Clustering.",
                    "Explain the architecture of Convolutional Neural Networks (CNN).",
                    "List and explain different Activation functions used in Neural Networks."
                ];

                setSections([
                    {
                        title: "PART - A",
                        questions: aimlQuestionsA.map((text, i) => ({ id: `a_${i}`, text, selected: true }))
                    },
                    {
                        title: "PART - B",
                        questions: aimlQuestionsB.map((text, i) => ({ id: `b_${i}`, text, selected: true }))
                    },
                    {
                        title: "PART - C",
                        questions: [
                            { id: 'c_1', text: "Explain Support Vector Machines (SVM) in detail.", selected: true },
                            { id: 'c_2', text: "Discuss the A* Search algorithm with an example.", selected: true },
                            { id: 'c_3', text: "Explain the concept of Reinforcement Learning.", selected: true }
                        ]
                    }
                ]);
            } else {
                // Generate generic mock questions if user provided a specific pattern
                setSections(parsedSections.map((sec, secIdx) => ({
                    title: sec.title,
                    questions: Array.from({ length: sec.count }, (_, qIdx) => ({
                        id: `s${secIdx}_q${qIdx}`,
                        text: `Q${qIdx + 1}. Mock AIML Question for ${sec.title}. Explain the concept...`,
                        selected: true
                    }))
                })));
            }

            setIsGenerating(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [query]);

    const toggleQuestion = (sectionIndex, questionId) => {
        setSections(prev => prev.map((sec, idx) => {
            if (idx !== sectionIndex) return sec;
            return {
                ...sec,
                questions: sec.questions.map(q =>
                    q.id === questionId ? { ...q, selected: !q.selected } : q
                )
            };
        }));
    };

    const handleFinalDownload = () => {
        // Calculate selected questions
        let count = 0;
        sections.forEach(s => s.questions.forEach(q => { if (q.selected) count++ }));
        Alert.alert("Download Question Paper", `Generating PDF with ${count} selected questions...`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Review & Download</Text>
                <TouchableOpacity onPress={handleFinalDownload}>
                    <Ionicons name="cloud-download-outline" size={24} color="#3b82f6" />
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <ScrollView contentContainerStyle={styles.content}>

                {isGenerating ? (
                    <View style={styles.loadingContainer}>
                        <Ionicons name="sync" size={40} color="#3b82f6" style={styles.spinningIcon} />
                        <Text style={styles.loadingText}>Analyzing Syllabus & Generating Questions...</Text>
                        <Text style={styles.subLoadingText}>Generating AIML related questions...</Text>
                    </View>
                ) : (
                    <View style={styles.paperContainer}>
                        <View style={styles.paperHeader}>
                            <Text style={styles.uniName}>B.E / B.Tech DEGREE EXAMINATION</Text>
                            <Text style={styles.examTitle}>ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING</Text>
                            <Text style={styles.subText}>Regulation 2026 | Semester VI</Text>
                        </View>

                        {sections.map((section, secIdx) => (
                            <View key={secIdx} style={styles.sectionBlock}>
                                <View style={styles.sectionHeaderBox}>
                                    <Text style={styles.sectionTitle}>{section.title}</Text>
                                    <View style={styles.line} />
                                </View>

                                {section.questions.map((q, qIdx) => (
                                    <TouchableOpacity
                                        key={q.id}
                                        style={styles.questionItem}
                                        onPress={() => toggleQuestion(secIdx, q.id)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.checkboxContainer}>
                                            <Ionicons
                                                name={q.selected ? "checkbox" : "square-outline"}
                                                size={22}
                                                color={q.selected ? "#3b82f6" : "#9CA3AF"}
                                            />
                                        </View>
                                        <View style={styles.questionTextBox}>
                                            <Text style={[styles.questionText, !q.selected && styles.disabledText]}>
                                                {qIdx + 1}. {q.text}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

            </ScrollView>

            {/* Bottom Action Button */}
            {!isGenerating && (
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.downloadButton} onPress={handleFinalDownload}>
                        <Text style={styles.downloadButtonText}>Download Final Question Paper</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 10 }} />
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    content: {
        padding: 15,
        paddingBottom: 100, // Space for footer
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    subLoadingText: {
        marginTop: 5,
        color: '#6B7280',
    },
    paperContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        minHeight: 500,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    paperHeader: {
        alignItems: 'center',
        marginBottom: 30,
        borderBottomWidth: 2,
        borderBottomColor: '#111827',
        paddingBottom: 15,
    },
    uniName: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'center',
        color: '#111827',
        marginBottom: 5,
    },
    examTitle: {
        fontSize: 16,
        fontWeight: '900',
        textTransform: 'uppercase',
        textAlign: 'center',
        color: '#111827',
        marginBottom: 5,
    },
    subText: {
        fontSize: 12,
        color: '#6B7280',
    },
    sectionBlock: {
        marginBottom: 25,
    },
    sectionHeaderBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Centered Header
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111827',
        marginHorizontal: 10, // Changed from marginRight
        textAlign: 'center',
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
        maxWidth: 50, // Short decorative lines
    },
    questionItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        paddingVertical: 4,
        paddingHorizontal: 10, // Add padding
        justifyContent: 'center', // Center content
    },
    checkboxContainer: {
        marginRight: 12,
        marginTop: 2,
    },
    questionTextBox: {
        flex: 1,
        alignItems: 'center', // Center text block
    },
    questionText: {
        fontSize: 15,
        color: '#374151',
        lineHeight: 22,
        textAlign: 'center', // Center Alignment
    },
    disabledText: {
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    downloadButton: {
        backgroundColor: '#3b82f6',
        paddingVertical: 14,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    downloadButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
