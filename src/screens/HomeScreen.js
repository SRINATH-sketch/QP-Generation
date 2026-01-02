import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Dimensions, Alert, Modal, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';



const UploadCard = ({ title, onUpload, files, onRemove, isDarkMode }) => (
  <View style={[uploadStyles.card, isDarkMode && uploadStyles.cardDark]}>
    <Text style={[uploadStyles.cardTitle, isDarkMode && uploadStyles.textDark]}>{title}</Text>

    {/* Display Uploaded Files */}
    {files && files.length > 0 && (
      <View style={{ marginBottom: 15 }}>
        {files.map((file, index) => (
          <View key={index} style={[uploadStyles.fileItem, isDarkMode && uploadStyles.dashedBoxDark]}>
            <Ionicons name="document-text" size={24} color="#3b82f6" style={{ marginRight: 10 }} />
            <Text style={[uploadStyles.fileName, isDarkMode && uploadStyles.textDark, { flex: 1, textAlign: 'left', marginBottom: 0 }]} numberOfLines={1}>
              {file.name}
            </Text>
            <TouchableOpacity onPress={() => onRemove(index)}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    )}

    {/* Drop Zone (Always visible to allow adding more files) */}
    <TouchableOpacity style={[uploadStyles.dropZone, isDarkMode && uploadStyles.dropZoneDark]} onPress={onUpload}>
      <View style={[uploadStyles.dashedBox, isDarkMode && uploadStyles.dashedBoxDark]}>
        <Text style={[uploadStyles.dropText, isDarkMode && uploadStyles.textGrayDark]}>Drop your file here or</Text>
        <View style={uploadStyles.uploadBtn}>
          <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
          <Text style={uploadStyles.uploadBtnText}>Upload files</Text>
        </View>
        <Text style={[uploadStyles.limitText, isDarkMode && uploadStyles.textGrayDark]}>Maximum size allowed is 25MB.</Text>
        <Text style={[uploadStyles.formatText, isDarkMode && uploadStyles.textGrayDark]}>Supported formats are: pdf, docx</Text>
      </View>
    </TouchableOpacity>
  </View>
);

export default function HomeScreen({ navigation }) {
  const [patternQuery, setPatternQuery] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);

  // File States (Arrays)
  const [syllabusFiles, setSyllabusFiles] = useState([]);
  const [outcomeFiles, setOutcomeFiles] = useState([]);
  const [textbookFiles, setTextbookFiles] = useState([]);

  // Editable Profile State
  const [userName, setUserName] = useState('Dr. S. Kumar');

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(false);



  // Generic Attachments State
  const [attachments, setAttachments] = useState([]);

  const isGenerateEnabled = syllabusFiles.length > 0 && outcomeFiles.length > 0 && textbookFiles.length > 0 && (patternQuery.trim().length > 0 || attachments.length > 0);

  const handleSearch = () => {
    navigation.navigate('Preview', {
      query: patternQuery,
      syllabusFiles,
      outcomeFiles,
      textbookFiles,
      attachments,
      numSets: 1
    });
  };

  const handleUpload = async (setFiles) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', '*/*'],
        copyToCacheDirectory: true,
        multiple: true, // Allow multiple selection
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFiles(prev => [...prev, ...result.assets]);
      }
    } catch (err) {
      console.log("Error picking file: ", err);
      Alert.alert("Error", "Failed to select file");
    }
  };

  const removeFile = (setFiles, index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAttachment = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: true
      });

      if (!result.canceled && result.assets) {
        setAttachments(prev => [...prev, ...result.assets]);
      }
    } catch (err) {
      console.log("Error attaching file: ", err);
      Alert.alert("Error", "Failed to attach file");
    }
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };



  const handleLogout = () => {
    setShowProfileModal(false);
    navigation.replace('Login');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]} edges={['top', 'left', 'right']}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={{ flex: 1, height: '100%' }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
        scrollIndicatorInsets={{ right: 1 }}
        indicatorStyle="black"
      >

        {/* Header with Actions and Profile */}
        <View style={[styles.header, isDarkMode && styles.headerDark]}>
          <View style={[styles.logoContainer, isDarkMode && styles.logoContainerDark]}>
            <Text style={[styles.logoText, isDarkMode && styles.textDark]}>QP Generator</Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton} onPress={toggleDarkMode}>
              <Ionicons name={isDarkMode ? "sunny" : "moon"} size={22} color={isDarkMode ? "#E2E8F0" : "#4B5563"} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#EF4444" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.profileContainer} onPress={() => setShowProfileModal(true)}>
              <View style={styles.userInfo}>
                <Text style={[styles.userName, isDarkMode && styles.textDark]}>{userName}</Text>
                <Text style={[styles.userRole, isDarkMode && styles.textGrayDark]}>Professor</Text>
              </View>
              <View style={styles.avatar}>
                <Ionicons name="person" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>

          {/* Input Row */}
          <View style={styles.searchRow}>
            <View style={styles.searchContainer}>
              <View style={[styles.inputWrapper, isDarkMode && styles.inputWrapperDark]}>
                <Ionicons name="create-outline" size={26} color={isDarkMode ? "#9CA3AF" : "#9CA3AF"} style={{ marginRight: 15, marginTop: 5 }} />
                <TextInput
                  style={[styles.searchInput, isDarkMode && styles.textDark]}
                  placeholder="Enter Question Paper Pattern (e.g., Part-A 10Q, Part-B 5Q...)"
                  placeholderTextColor="#9CA3AF"
                  value={patternQuery}
                  onChangeText={setPatternQuery}
                  onSubmitEditing={handleSearch}
                  multiline={true}
                  showsVerticalScrollIndicator={false}
                />

                {/* Attachment Button */}
                <TouchableOpacity style={styles.attachButton} onPress={handleAttachment}>
                  <Ionicons name="add-circle" size={40} color="#3b82f6" />
                </TouchableOpacity>
              </View>

              {/* Attachments List */}
              {attachments.length > 0 && (
                <View style={styles.attachmentsContainer}>
                  {attachments.map((file, index) => (
                    <View key={index} style={[styles.attachmentChip, isDarkMode && styles.attachmentChipDark]}>
                      <Ionicons name="document-attach" size={16} color="#4B5563" style={{ marginRight: 5 }} />
                      <Text style={[styles.attachmentName, isDarkMode && styles.textDark]} numberOfLines={1}>
                        {file.name}
                      </Text>
                      <TouchableOpacity onPress={() => removeAttachment(index)} style={{ marginLeft: 5 }}>
                        <Ionicons name="close-circle" size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>


          {/* Upload Cards Section */}
          <View style={styles.uploadSectionContainer}>
            <UploadCard
              title="Upload Syllabus"
              files={syllabusFiles}
              onUpload={() => handleUpload(setSyllabusFiles)}
              onRemove={(index) => removeFile(setSyllabusFiles, index)}
              isDarkMode={isDarkMode}
            />
            <UploadCard
              title="Upload Course Outcome"
              files={outcomeFiles}
              onUpload={() => handleUpload(setOutcomeFiles)}
              onRemove={(index) => removeFile(setOutcomeFiles, index)}
              isDarkMode={isDarkMode}
            />
            <UploadCard
              title="Upload Textbook"
              files={textbookFiles}
              onUpload={() => handleUpload(setTextbookFiles)}
              onRemove={(index) => removeFile(setTextbookFiles, index)}
              isDarkMode={isDarkMode}
            />
          </View>

          <TouchableOpacity
            style={[styles.generateButton, !isGenerateEnabled && styles.generateButtonDisabled]}
            onPress={isGenerateEnabled ? handleSearch : null}
            activeOpacity={isGenerateEnabled ? 0.7 : 1}
          >
            <Text style={styles.generateButtonText}>Generate Question Paper</Text>
          </TouchableOpacity>

        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Contact with us</Text>
        </View>



      </ScrollView>


      {/* Profile Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showProfileModal}
        onRequestClose={() => setShowProfileModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode && styles.modalContentDark]}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowProfileModal(false)}>
              <Ionicons name="close" size={24} color={isDarkMode ? "#fff" : "#4B5563"} />
            </TouchableOpacity>

            <View style={styles.modalHeader}>
              <View style={styles.modalAvatar}>
                <Ionicons name="person" size={40} color="#fff" />
              </View>

              <View style={styles.nameEditContainer}>
                <TextInput
                  style={[styles.modalNameInput, isDarkMode && styles.textDark, isDarkMode && { borderBottomColor: '#374151' }]}
                  value={userName}
                  onChangeText={setUserName}
                  selectTextOnFocus={true}
                />
                <Ionicons name="pencil" size={16} color="#9CA3AF" style={{ marginLeft: 8 }} />
              </View>

              <Text style={[styles.modalRole, isDarkMode && styles.textGrayDark]}>Professor</Text>
            </View>

            <View style={styles.modalBody}>
              <View style={[styles.infoRow, isDarkMode && styles.infoRowDark]}>
                <Ionicons name="mail-outline" size={20} color="#6B7280" />
                <Text style={[styles.infoText, isDarkMode && styles.textGrayDark]}>s.kumar@university.edu</Text>
              </View>
              <View style={[styles.infoRow, isDarkMode && styles.infoRowDark]}>
                <Ionicons name="business-outline" size={20} color="#6B7280" />
                <Text style={[styles.infoText, isDarkMode && styles.textGrayDark]}>Dept. of Computer Science</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // On web, we need a fixed height for scrolling to work reliably if parent is not set
    height: Platform.OS === 'web' ? '100vh' : '100%',
    backgroundColor: '#F3F4F6',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  scrollContent: {
    paddingBottom: 200,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 20,
  },
  headerDark: {
    backgroundColor: '#1F2937',
    shadowColor: '#000',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconButton: {
    padding: 5,
  },
  logoContainer: {
    borderWidth: 1.5,
    borderColor: '#111827',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  logoContainerDark: {
    borderColor: '#F3F4F6',
  },
  logoText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  textDark: {
    color: '#F9FAFB',
  },
  textGrayDark: {
    color: '#9CA3AF',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    marginRight: 10,
    alignItems: 'flex-end',
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  userRole: {
    fontSize: 11,
    color: '#6b7280',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 40,
    zIndex: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '90%',
    maxWidth: 900,
    marginBottom: 30,
    gap: 15,
    zIndex: 50,
  },
  searchContainer: {
    flex: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    minHeight: 120,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    padding: 20,
    paddingRight: 15, // Reduced paddingRight to accommodate button if needed
    borderWidth: 1.5,
    borderColor: '#000',
    position: 'relative', // Ensure relative positioning for absolute children if we were using them
  },
  inputWrapperDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
    height: '100%',
    marginRight: 10, // Add margin to avoid overlapping with attach button
  },
  attachButton: {
    padding: 5,
    alignSelf: 'flex-end', // Align to bottom
  },
  attachmentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  attachmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    maxWidth: '100%',
  },
  attachmentChipDark: {
    backgroundColor: '#374151',
  },
  attachmentName: {
    fontSize: 12,
    color: '#374151',
    maxWidth: 150,
  },
  setsWrapper: {
    alignItems: 'center',
    position: 'relative',
    zIndex: 100,
    marginTop: 10,
  },
  setsLabelOutside: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4B5563',
    marginBottom: 5,
  },
  setsDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 12,
    width: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  dropdownDark: {
    backgroundColor: '#374151',
  },
  setsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 65,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    paddingVertical: 5,
    zIndex: 1000,
  },
  dropdownMenuDark: {
    backgroundColor: '#374151',
  },
  dropdownItem: {
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  uploadSectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    width: '95%',
    maxWidth: 1300,
    marginTop: 20,
    zIndex: 1,
  },

  footer: {
    padding: 20,
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: 320,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    position: 'relative',
  },
  modalContentDark: {
    backgroundColor: '#1F2937',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  nameEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalNameInput: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 2,
    textAlign: 'center',
    minWidth: 150,
  },
  modalRole: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  modalBody: {
    width: '100%',
    marginBottom: 25,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 8,
  },
  infoRowDark: {
    backgroundColor: '#374151',
  },
  infoText: {
    marginLeft: 10,
    color: '#374151',
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  generateButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 40,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 250,
    alignItems: 'center',
  },
  generateButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

const uploadStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: 380,
    maxWidth: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: '#1F2937',
    shadowColor: '#000',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
  },
  textDark: {
    color: '#F9FAFB',
  },
  textGrayDark: {
    color: '#9CA3AF',
  },
  dropZone: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 2,
  },
  dropZoneDark: {
    backgroundColor: '#374151',
  },
  dashedBox: {
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
  },
  dashedBoxDark: {
    borderColor: '#4B5563',
  },
  dropText: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 15,
  },
  uploadBtn: {
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
  },
  uploadBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  limitText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  formatText: {
    fontSize: 12,
    color: '#64748B',
  },
  filePreviewContainer: {
    borderWidth: 1.5,
    borderColor: '#3b82f6',
    borderStyle: 'dotted',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
    backgroundColor: '#EFF6FF',
  },
  fileIconContainer: {
    marginBottom: 10,
  },
  fileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
    textAlign: 'center',
  },
  fileSize: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 15,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b82f6',
    marginBottom: 8,
  },
  removeText: {
    color: '#EF4444',
    fontWeight: '600',
    marginLeft: 5,
    fontSize: 14,
  },
});
