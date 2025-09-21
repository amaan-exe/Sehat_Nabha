export type Language = "en" | "hi" | "pa"

export interface Translations {
  // App basics
  appName: string
  onlineMode: string
  offlineMode: string

  // Authentication
  selectLanguage: string
  enterPhone: string
  phoneNumber: string
  sendOTP: string
  enterOTP: string
  verifyOTP: string
  selectRole: string
  patient: string
  doctor: string
  pharmacist: string
  admin: string
  continue: string

  // Common UI
  dashboard: string
  profile: string
  settings: string
  logout: string
  save: string
  cancel: string
  edit: string
  delete: string
  search: string
  filter: string
  loading: string
  error: string
  success: string
  warning: string
  info: string

  // Patient interface
  myHealth: string
  healthRecords: string
  telemedicine: string
  findMedicine: string
  symptomChecker: string
  emergency: string
  bookConsultation: string
  viewPrescriptions: string
  medicalHistory: string

  // Doctor interface
  patientQueue: string
  consultation: string
  prescriptions: string
  patientRecords: string
  schedule: string
  startConsultation: string
  endConsultation: string
  writePrescription: string

  // Pharmacy interface
  inventory: string
  orders: string
  suppliers: string
  reports: string
  lowStock: string
  expiringMedicines: string
  updateStock: string
  processOrder: string

  // Admin interface
  userManagement: string
  analytics: string
  healthData: string
  systemMonitor: string
  totalUsers: string
  activeConsultations: string

  // Accessibility
  increaseTextSize: string
  decreaseTextSize: string
  highContrast: string
  voiceInput: string
  screenReader: string
  keyboardNavigation: string

  // Emergency
  callAmbulance: string
  emergencyContact: string
  urgentHelp: string

  // Health conditions (common in Punjab)
  diabetes: string
  hypertension: string
  heartDisease: string
  respiratory: string
  mentalHealth: string

  // Time and dates
  today: string
  yesterday: string
  thisWeek: string
  thisMonth: string
  morning: string
  afternoon: string
  evening: string

  // Status messages
  connectionLost: string
  workingOffline: string
  syncingData: string
  dataUpdated: string
  prescriptionSent: string
  appointmentBooked: string
}

export const translations: Record<Language, Translations> = {
  en: {
    // App basics
    appName: "Sehat Nabha",
    onlineMode: "Online",
    offlineMode: "Offline",

    // Authentication
    selectLanguage: "Select Language",
    enterPhone: "Enter Phone Number",
    phoneNumber: "Phone Number",
    sendOTP: "Send OTP",
    enterOTP: "Enter OTP",
    verifyOTP: "Verify OTP",
    selectRole: "Select Your Role",
    patient: "Patient",
    doctor: "Doctor",
    pharmacist: "Pharmacist",
    admin: "Administrator",
    continue: "Continue",

    // Common UI
    dashboard: "Dashboard",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    search: "Search",
    filter: "Filter",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Information",

    // Patient interface
    myHealth: "My Health",
    healthRecords: "Health Records",
    telemedicine: "Telemedicine",
    findMedicine: "Find Medicine",
    symptomChecker: "Symptom Checker",
    emergency: "Emergency",
    bookConsultation: "Book Consultation",
    viewPrescriptions: "View Prescriptions",
    medicalHistory: "Medical History",

    // Doctor interface
    patientQueue: "Patient Queue",
    consultation: "Consultation",
    prescriptions: "Prescriptions",
    patientRecords: "Patient Records",
    schedule: "Schedule",
    startConsultation: "Start Consultation",
    endConsultation: "End Consultation",
    writePrescription: "Write Prescription",

    // Pharmacy interface
    inventory: "Inventory",
    orders: "Orders",
    suppliers: "Suppliers",
    reports: "Reports",
    lowStock: "Low Stock",
    expiringMedicines: "Expiring Medicines",
    updateStock: "Update Stock",
    processOrder: "Process Order",

    // Admin interface
    userManagement: "User Management",
    analytics: "Analytics",
    healthData: "Health Data",
    systemMonitor: "System Monitor",
    totalUsers: "Total Users",
    activeConsultations: "Active Consultations",

    // Accessibility
    increaseTextSize: "Increase Text Size",
    decreaseTextSize: "Decrease Text Size",
    highContrast: "High Contrast",
    voiceInput: "Voice Input",
    screenReader: "Screen Reader",
    keyboardNavigation: "Keyboard Navigation",

    // Emergency
    callAmbulance: "Call Ambulance",
    emergencyContact: "Emergency Contact",
    urgentHelp: "Urgent Help",

    // Health conditions
    diabetes: "Diabetes",
    hypertension: "Hypertension",
    heartDisease: "Heart Disease",
    respiratory: "Respiratory Issues",
    mentalHealth: "Mental Health",

    // Time and dates
    today: "Today",
    yesterday: "Yesterday",
    thisWeek: "This Week",
    thisMonth: "This Month",
    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Evening",

    // Status messages
    connectionLost: "Connection lost, working offline",
    workingOffline: "Working offline - data will sync when connection is restored",
    syncingData: "Syncing data...",
    dataUpdated: "Data updated successfully",
    prescriptionSent: "Prescription sent to pharmacy",
    appointmentBooked: "Appointment booked successfully",
  },

  hi: {
    // App basics
    appName: "सेहत नभा",
    onlineMode: "ऑनलाइन",
    offlineMode: "ऑफलाइन",

    // Authentication
    selectLanguage: "भाषा चुनें",
    enterPhone: "फोन नंबर दर्ज करें",
    phoneNumber: "फोन नंबर",
    sendOTP: "OTP भेजें",
    enterOTP: "OTP दर्ज करें",
    verifyOTP: "OTP सत्यापित करें",
    selectRole: "अपनी भूमिका चुनें",
    patient: "मरीज़",
    doctor: "डॉक्टर",
    pharmacist: "फार्मासिस्ट",
    admin: "प्रशासक",
    continue: "जारी रखें",

    // Common UI
    dashboard: "डैशबोर्ड",
    profile: "प्रोफाइल",
    settings: "सेटिंग्स",
    logout: "लॉगआउट",
    save: "सेव करें",
    cancel: "रद्द करें",
    edit: "संपादित करें",
    delete: "हटाएं",
    search: "खोजें",
    filter: "फिल्टर",
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    success: "सफलता",
    warning: "चेतावनी",
    info: "जानकारी",

    // Patient interface
    myHealth: "मेरी सेहत",
    healthRecords: "स्वास्थ्य रिकॉर्ड",
    telemedicine: "टेलीमेडिसिन",
    findMedicine: "दवा खोजें",
    symptomChecker: "लक्षण जांचकर्ता",
    emergency: "आपातकाल",
    bookConsultation: "परामर्श बुक करें",
    viewPrescriptions: "नुस्खे देखें",
    medicalHistory: "चिकित्सा इतिहास",

    // Doctor interface
    patientQueue: "मरीज़ों की कतार",
    consultation: "परामर्श",
    prescriptions: "नुस्खे",
    patientRecords: "मरीज़ के रिकॉर्ड",
    schedule: "समय सारणी",
    startConsultation: "परामर्श शुरू करें",
    endConsultation: "परामर्श समाप्त करें",
    writePrescription: "नुस्खा लिखें",

    // Pharmacy interface
    inventory: "इन्वेंटरी",
    orders: "ऑर्डर",
    suppliers: "आपूर्तिकर्ता",
    reports: "रिपोर्ट",
    lowStock: "कम स्टॉक",
    expiringMedicines: "समाप्त होने वाली दवाएं",
    updateStock: "स्टॉक अपडेट करें",
    processOrder: "ऑर्डर प्रोसेस करें",

    // Admin interface
    userManagement: "उपयोगकर्ता प्रबंधन",
    analytics: "विश्लेषण",
    healthData: "स्वास्थ्य डेटा",
    systemMonitor: "सिस्टम मॉनिटर",
    totalUsers: "कुल उपयोगकर्ता",
    activeConsultations: "सक्रिय परामर्श",

    // Accessibility
    increaseTextSize: "टेक्स्ट साइज़ बढ़ाएं",
    decreaseTextSize: "टेक्स्ट साइज़ घटाएं",
    highContrast: "उच्च कंट्रास्ट",
    voiceInput: "आवाज़ इनपुट",
    screenReader: "स्क्रीन रीडर",
    keyboardNavigation: "कीबोर्ड नेवीगेशन",

    // Emergency
    callAmbulance: "एम्बुलेंस बुलाएं",
    emergencyContact: "आपातकालीन संपर्क",
    urgentHelp: "तत्काल सहायता",

    // Health conditions
    diabetes: "मधुमेह",
    hypertension: "उच्च रक्तचाप",
    heartDisease: "हृदय रोग",
    respiratory: "श्वसन संबंधी समस्याएं",
    mentalHealth: "मानसिक स्वास्थ्य",

    // Time and dates
    today: "आज",
    yesterday: "कल",
    thisWeek: "इस सप्ताह",
    thisMonth: "इस महीने",
    morning: "सुबह",
    afternoon: "दोपहर",
    evening: "शाम",

    // Status messages
    connectionLost: "कनेक्शन टूट गया, ऑफलाइन काम कर रहे हैं",
    workingOffline: "ऑफलाइन काम कर रहे हैं - कनेक्शन वापस आने पर डेटा सिंक होगा",
    syncingData: "डेटा सिंक हो रहा है...",
    dataUpdated: "डेटा सफलतापूर्वक अपडेट हुआ",
    prescriptionSent: "नुस्खा फार्मेसी को भेजा गया",
    appointmentBooked: "अपॉइंटमेंट सफलतापूर्वक बुक हुआ",
  },

  pa: {
    // App basics
    appName: "ਸਿਹਤ ਨਭਾ",
    onlineMode: "ਆਨਲਾਈਨ",
    offlineMode: "ਆਫਲਾਈਨ",

    // Authentication
    selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ",
    enterPhone: "ਫੋਨ ਨੰਬਰ ਦਾਖਲ ਕਰੋ",
    phoneNumber: "ਫੋਨ ਨੰਬਰ",
    sendOTP: "OTP ਭੇਜੋ",
    enterOTP: "OTP ਦਾਖਲ ਕਰੋ",
    verifyOTP: "OTP ਤਸਦੀਕ ਕਰੋ",
    selectRole: "ਆਪਣੀ ਭੂਮਿਕਾ ਚੁਣੋ",
    patient: "ਮਰੀਜ਼",
    doctor: "ਡਾਕਟਰ",
    pharmacist: "ਫਾਰਮਾਸਿਸਟ",
    admin: "ਪ੍ਰਸ਼ਾਸਕ",
    continue: "ਜਾਰੀ ਰੱਖੋ",

    // Common UI
    dashboard: "ਡੈਸ਼ਬੋਰਡ",
    profile: "ਪ੍ਰੋਫਾਈਲ",
    settings: "ਸੈਟਿੰਗਾਂ",
    logout: "ਲਾਗਆਉਟ",
    save: "ਸੇਵ ਕਰੋ",
    cancel: "ਰੱਦ ਕਰੋ",
    edit: "ਸੰਪਾਦਨ",
    delete: "ਮਿਟਾਓ",
    search: "ਖੋਜੋ",
    filter: "ਫਿਲਟਰ",
    loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
    error: "ਗਲਤੀ",
    success: "ਸਫਲਤਾ",
    warning: "ਚੇਤਾਵਨੀ",
    info: "ਜਾਣਕਾਰੀ",

    // Patient interface
    myHealth: "ਮੇਰੀ ਸਿਹਤ",
    healthRecords: "ਸਿਹਤ ਰਿਕਾਰਡ",
    telemedicine: "ਟੈਲੀਮੈਡਿਸਿਨ",
    findMedicine: "ਦਵਾਈ ਲੱਭੋ",
    symptomChecker: "ਲੱਛਣ ਜਾਂਚਕਰਤਾ",
    emergency: "ਐਮਰਜੈਂਸੀ",
    bookConsultation: "ਸਲਾਹ ਬੁੱਕ ਕਰੋ",
    viewPrescriptions: "ਨੁਸਖੇ ਵੇਖੋ",
    medicalHistory: "ਮੈਡੀਕਲ ਇਤਿਹਾਸ",

    // Doctor interface
    patientQueue: "ਮਰੀਜ਼ਾਂ ਦੀ ਕਤਾਰ",
    consultation: "ਸਲਾਹ",
    prescriptions: "ਨੁਸਖੇ",
    patientRecords: "ਮਰੀਜ਼ ਦੇ ਰਿਕਾਰਡ",
    schedule: "ਸਮਾਂ ਸਾਰਣੀ",
    startConsultation: "ਸਲਾਹ ਸ਼ੁਰੂ ਕਰੋ",
    endConsultation: "ਸਲਾਹ ਖਤਮ ਕਰੋ",
    writePrescription: "ਨੁਸਖਾ ਲਿਖੋ",

    // Pharmacy interface
    inventory: "ਇਨਵੈਂਟਰੀ",
    orders: "ਆਰਡਰ",
    suppliers: "ਸਪਲਾਇਰ",
    reports: "ਰਿਪੋਰਟਾਂ",
    lowStock: "ਘੱਟ ਸਟਾਕ",
    expiringMedicines: "ਖਤਮ ਹੋਣ ਵਾਲੀਆਂ ਦਵਾਈਆਂ",
    updateStock: "ਸਟਾਕ ਅਪਡੇਟ ਕਰੋ",
    processOrder: "ਆਰਡਰ ਪ੍ਰੋਸੈਸ ਕਰੋ",

    // Admin interface
    userManagement: "ਯੂਜ਼ਰ ਮੈਨੇਜਮੈਂਟ",
    analytics: "ਵਿਸ਼ਲੇਸ਼ਣ",
    healthData: "ਸਿਹਤ ਡੇਟਾ",
    systemMonitor: "ਸਿਸਟਮ ਮਾਨੀਟਰ",
    totalUsers: "ਕੁੱਲ ਯੂਜ਼ਰ",
    activeConsultations: "ਸਰਗਰਮ ਸਲਾਹਾਂ",

    // Accessibility
    increaseTextSize: "ਟੈਕਸਟ ਸਾਈਜ਼ ਵਧਾਓ",
    decreaseTextSize: "ਟੈਕਸਟ ਸਾਈਜ਼ ਘਟਾਓ",
    highContrast: "ਉੱਚ ਕੰਟਰਾਸਟ",
    voiceInput: "ਆਵਾਜ਼ ਇਨਪੁੱਟ",
    screenReader: "ਸਕਰੀਨ ਰੀਡਰ",
    keyboardNavigation: "ਕੀਬੋਰਡ ਨੈਵੀਗੇਸ਼ਨ",

    // Emergency
    callAmbulance: "ਐਂਬੂਲੈਂਸ ਬੁਲਾਓ",
    emergencyContact: "ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ",
    urgentHelp: "ਤੁਰੰਤ ਮਦਦ",

    // Health conditions
    diabetes: "ਸ਼ੂਗਰ",
    hypertension: "ਹਾਈ ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ",
    heartDisease: "ਦਿਲ ਦੀ ਬਿਮਾਰੀ",
    respiratory: "ਸਾਹ ਸੰਬੰਧੀ ਸਮੱਸਿਆਵਾਂ",
    mentalHealth: "ਮਾਨਸਿਕ ਸਿਹਤ",

    // Time and dates
    today: "ਅੱਜ",
    yesterday: "ਕੱਲ੍ਹ",
    thisWeek: "ਇਸ ਹਫਤੇ",
    thisMonth: "ਇਸ ਮਹੀਨੇ",
    morning: "ਸਵੇਰ",
    afternoon: "ਦੁਪਹਿਰ",
    evening: "ਸ਼ਾਮ",

    // Status messages
    connectionLost: "ਕਨੈਕਸ਼ਨ ਟੁੱਟ ਗਿਆ, ਆਫਲਾਈਨ ਕੰਮ ਕਰ ਰਹੇ ਹਾਂ",
    workingOffline: "ਆਫਲਾਈਨ ਕੰਮ ਕਰ ਰਹੇ ਹਾਂ - ਕਨੈਕਸ਼ਨ ਵਾਪਸ ਆਉਣ 'ਤੇ ਡੇਟਾ ਸਿੰਕ ਹੋਵੇਗਾ",
    syncingData: "ਡੇਟਾ ਸਿੰਕ ਹੋ ਰਿਹਾ ਹੈ...",
    dataUpdated: "ਡੇਟਾ ਸਫਲਤਾਪੂਰਵਕ ਅਪਡੇਟ ਹੋਇਆ",
    prescriptionSent: "ਨੁਸਖਾ ਫਾਰਮੇਸੀ ਨੂੰ ਭੇਜਿਆ ਗਿਆ",
    appointmentBooked: "ਅਪਾਇੰਟਮੈਂਟ ਸਫਲਤਾਪੂਰਵਕ ਬੁੱਕ ਹੋਇਆ",
  },
}

export function getTranslation(language: Language): Translations {
  return translations[language]
}
