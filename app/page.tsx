"use client"
import { CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AvatarFallback } from "@/components/ui/avatar"
import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { CardTitle } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { CardContent } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import {
  Stethoscope,
  Users,
  Video,
  Clipboard,
  FileText,
  CalendarIcon,
  BarChart3,
  AlertTriangle,
  Clock,
  WifiOff,
  Plus,
  Edit,
  Phone,
  Download,
  Pill,
  Settings,
  Eye,
  Mic,
  Volume2,
  Heart,
  User,
  Brain,
  Activity,
  Calendar,
  LogOut,
  Search,
} from "lucide-react"
import { useOffline } from "@/hooks/use-offline"
import { OfflineIndicator } from "@/components/offline-indicator"
import { offlineDB } from "@/lib/offline-db"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Medicine {
  id: string
  name: string
  genericName: string
  manufacturer: string
  batchNumber: string
  expiryDate: string
  quantity: number
  minStockLevel: number
  price: number
  category: "tablet" | "syrup" | "injection" | "capsule" | "ointment"
  prescription: boolean
}

interface PrescriptionOrder {
  id: string
  patientName: string
  doctorName: string
  medicines: Array<{
    medicineId: string
    medicineName: string
    quantity: number
    dosage: string
    instructions: string
  }>
  status: "pending" | "processing" | "ready" | "dispensed"
  orderDate: string
  priority: "normal" | "urgent"
}

interface Prescription {
  id?: string
  patientId: string
  doctorId: string
  medicines: Array<{
    name: string
    dosage: string
    frequency: string
    duration: string
    instructions: string
  }>
  diagnosis: string
  notes: string
  date: string
}

interface AppUser {
  id: string
  name: string
  phone: string
  role: "patient" | "doctor" | "pharmacist" | "admin"
  language: "en" | "hi" | "pa"
}

interface Patient {
  id: string
  name: string
  age: number
  phone: string
  symptoms: string
  appointmentTime: string
  status: "waiting" | "in-consultation" | "completed"
  priority: "low" | "medium" | "high"
}

type Language = "en" | "hi" | "pa"
type UserRole = "patient" | "doctor" | "pharmacist" | "admin"

const translations = {
  en: {
    appName: "Sehat Nabha",
    onlineMode: "Online",
    offlineMode: "Offline",
    selectLanguage: "Select Language",
    enterPhone: "Enter Phone Number",
    enterOtp: "Enter OTP",
    selectRole: "Select Your Role",
    patient: "Patient",
    doctor: "Doctor",
    pharmacist: "Pharmacist",
    admin: "Admin",
    dashboard: "Dashboard",
    profile: "Profile",
    healthRecords: "Health Records",
    telemedicine: "Telemedicine",
    medicines: "Medicines",
    symptoms: "Symptoms",
    emergency: "Emergency",
    bookConsultation: "Book Consultation",
    findMedicine: "Find Medicine",
    checkSymptoms: "Check Symptoms",
    callAmbulance: "Call Ambulance",
    accessibility: "Accessibility",
    fontSize: "Font Size",
    highContrast: "High Contrast",
    voiceInput: "Voice Input",
    screenReader: "Screen Reader Mode",
    phoneVerification: "Phone Verification",
    enterPhoneNumber: "Enter your phone number to receive an OTP",
    phoneNumber: "Phone Number",
    sendOTP: "Send OTP",
    back: "Back",
    verifyOTP: "Verify OTP",
    otpSentTo: "OTP sent to",
    enterOTP: "Enter OTP",
    chooseYourRole: "Choose your role to continue",
    continue: "Continue",
    patientDescription: "Book appointments, view health records",
    doctorDescription: "Manage patients, prescribe medicines",
    pharmacistDescription: "Manage inventory, process prescriptions",
    adminDescription: "Manage users, system settings",
    welcome: "Welcome",
    connectWithDoctor: "Book a virtual consultation with a doctor",
    aiSymptomChecker: "Check your symptoms with our AI assistant",
    healthSummary: "Your Health Summary",
    recentActivity: "Recent Activity",
    viewFullRecords: "View Full Records",
    name: "Name",
    phone: "Phone",
    editProfile: "Edit Profile",
    noRecordsYet: "No health records yet",
    addRecord: "Add Health Record",
    bookConsultationDesc: "Book a consultation with a doctor online",
    bookNow: "Book Now",
    findMedicinesDesc: "Find medicines and pharmacies near you",
    searchMedicines: "Search Medicines",
    symptomCheckerDesc: "Check your symptoms with our AI symptom checker",
    startCheck: "Start Check",
    emergencyDesc: "Call ambulance or emergency services",
    editProfileDesc: "Edit your profile information",
  },
  hi: {
    appName: "सेहत नभा",
    onlineMode: "ऑनलाइन",
    offlineMode: "ऑफलाइन",
    selectLanguage: "भाषा चुनें",
    enterPhone: "फोन नंबर दर्ज करें",
    enterOtp: "ओटीपी दर्ज करें",
    selectRole: "अपनी भूमिका चुनें",
    patient: "मरीज़",
    doctor: "डॉक्टर",
    pharmacist: "फार्मासिस्ट",
    admin: "प्रशासक",
    dashboard: "डैशबोर्ड",
    profile: "प्रोफाइल",
    healthRecords: "स्वास्थ्य रिकॉर्ड",
    telemedicine: "टेलीमेडिसिन",
    medicines: "दवाइयां",
    symptoms: "लक्षण",
    emergency: "आपातकाल",
    bookConsultation: "परामर्श बुक करें",
    findMedicine: "दवा खोजें",
    checkSymptoms: "लक्षण जांचें",
    callAmbulance: "एम्बुलेंस बुलाएं",
    accessibility: "पहुंच",
    fontSize: "फ़ॉन्ट आकार",
    highContrast: "उच्च कंट्रास्ट",
    voiceInput: "आवाज़ इनपुट",
    screenReader: "स्क्रीन रीडर मोड",
    phoneVerification: "फ़ोन सत्यापन",
    enterPhoneNumber: "ओटीपी प्राप्त करने के लिए अपना फ़ोन नंबर दर्ज करें",
    phoneNumber: "फ़ोन नंबर",
    sendOTP: "ओटीपी भेजें",
    back: "वापस",
    verifyOTP: "ओटीपी सत्यापित करें",
    otpSentTo: "ओटीपी भेजा गया",
    enterOTP: "ओटीपी दर्ज करें",
    chooseYourRole: "जारी रखने के लिए अपनी भूमिका चुनें",
    continue: "जारी रखें",
    patientDescription: "अपॉइंटमेंट बुक करें, स्वास्थ्य रिकॉर्ड देखें",
    doctorDescription: "मरीजों का प्रबंधन करें, दवाएं लिखें",
    pharmacistDescription: "इन्वेंटरी प्रबंधित करें, नुस्खे संसाधित करें",
    adminDescription: "उपयोगकर्ताओं, सिस्टम सेटिंग्स को प्रबंधित करें",
    welcome: "स्वागत",
    connectWithDoctor: "डॉक्टर के साथ वर्चुअल परामर्श बुक करें",
    aiSymptomChecker: "हमारे एआई सहायक के साथ अपने लक्षणों की जांच करें",
    healthSummary: "आपका स्वास्थ्य सारांश",
    recentActivity: "हाल की गतिविधि",
    viewFullRecords: "पूर्ण रिकॉर्ड देखें",
    name: "नाम",
    phone: "फ़ोन",
    editProfile: "प्रोफ़ाइल संपादित करें",
    noRecordsYet: "अभी तक कोई स्वास्थ्य रिकॉर्ड नहीं है",
    addRecord: "स्वास्थ्य रिकॉर्ड जोड़ें",
    bookConsultationDesc: "ऑनलाइन डॉक्टर से परामर्श बुक करें",
    bookNow: "अभी बुक करें",
    findMedicinesDesc: "अपने आस-पास की दवाएं और फार्मेसियों का पता लगाएं",
    searchMedicines: "दवाएं खोजें",
    symptomCheckerDesc: "हमारे एआई लक्षण जांचकर्ता के साथ अपने लक्षणों की जांच करें",
    startCheck: "जांच शुरू करें",
    emergencyDesc: "एम्बुलेंस या आपातकालीन सेवाओं को कॉल करें",
    editProfileDesc: "अपनी प्रोफ़ाइल जानकारी संपादित करें",
  },
  pa: {
    appName: "ਸਿਹਤ ਨਭਾ",
    onlineMode: "ਆਨਲਾਈਨ",
    offlineMode: "ਆਫਲਾਈਨ",
    selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ",
    enterPhone: "ਫੋਨ ਨੰਬਰ ਦਾਖਲ ਕਰੋ",
    enterOtp: "ਓਟੀਪੀ ਦਾਖਲ ਕਰੋ",
    selectRole: "ਆਪਣੀ ਭੂਮਿਕਾ ਚੁਣੋ",
    patient: "ਮਰੀਜ਼",
    doctor: "ਡਾਕਟਰ",
    pharmacist: "ਫਾਰਮਾਸਿਸਟ",
    admin: "ਪ੍ਰਸ਼ਾਸਕ",
    dashboard: "ਡੈਸ਼ਬੋਰਡ",
    profile: "ਪ੍ਰੋਫਾਈਲ",
    healthRecords: "ਸਿਹਤ ਰਿਕਾਰਡ",
    telemedicine: "ਟੈਲੀਮੈਡੀਸਿਨ",
    medicines: "ਦਵਾਈਆਂ",
    symptoms: "ਲੱਛਣ",
    emergency: "ਐਮਰਜੈਂਸੀ",
    bookConsultation: "ਸਲਾਹ ਬੁੱਕ ਕਰੋ",
    findMedicine: "ਦਵਾਈ ਲੱਭੋ",
    checkSymptoms: "ਲੱਛਣ ਜਾਂਚੋ",
    callAmbulance: "ਐਂਬੂਲੈਂਸ ਬੁਲਾਓ",
    accessibility: "ਪਹੁੰਚ",
    fontSize: "ਫੌਂਟ ਸਾਈਜ਼",
    highContrast: "ਉੱਚ ਕੰਟਰਾਸਟ",
    voiceInput: "ਆਵਾਜ਼ ਇਨਪੁੱਟ",
    screenReader: "ਸਕਰੀਨ ਰੀਡਰ ਮੋਡ",
    phoneVerification: "ਫੋਨ ਤਸਦੀਕ",
    enterPhoneNumber: "OTP ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਆਪਣਾ ਫ਼ੋਨ ਨੰਬਰ ਦਰਜ ਕਰੋ",
    phoneNumber: "ਫੋਨ ਨੰਬਰ",
    sendOTP: "OTP ਭੇਜੋ",
    back: "ਵਾਪਸ",
    verifyOTP: "OTP ਤਸਦੀਕ ਕਰੋ",
    otpSentTo: "OTP ਭੇਜਿਆ ਗਿਆ",
    enterOTP: "OTP ਦਰਜ ਕਰੋ",
    chooseYourRole: "ਜਾਰੀ ਰੱਖਣ ਲਈ ਆਪਣੀ ਭੂਮਿਕਾ ਚੁਣੋ",
    continue: "ਜਾਰੀ ਰੱਖੋ",
    patientDescription: "ਮੁਲਾਕਾਤਾਂ ਬੁੱਕ ਕਰੋ, ਸਿਹਤ ਰਿਕਾਰਡ ਵੇਖੋ",
    doctorDescription: "ਮਰੀਜ਼ਾਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ, ਦਵਾਈਆਂ ਲਿਖੋ",
    pharmacistDescription: "ਇਨਵੈਂਟਰੀ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ, ਨੁਸਖੇ ਦੀ ਪ੍ਰਕਿਰਿਆ ਕਰੋ",
    adminDescription: "ਉਪਭੋਗਤਾਵਾਂ, ਸਿਸਟਮ ਸੈਟਿੰਗਾਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ",
    welcome: "ਜੀ ਆਇਆਂ ਨੂੰ",
    connectWithDoctor: "ਇੱਕ ਡਾਕਟਰ ਨਾਲ ਵਰਚੁਅਲ ਸਲਾਹ ਬੁੱਕ ਕਰੋ",
    aiSymptomChecker: "ਸਾਡੇ ਏਆਈ ਸਹਾਇਕ ਨਾਲ ਆਪਣੇ ਲੱਛਣਾਂ ਦੀ ਜਾਂਚ ਕਰੋ",
    healthSummary: "ਤੁਹਾਡਾ ਸਿਹਤ ਸੰਖੇਪ",
    recentActivity: "ਹਾਲ ਹੀ ਦੀ ਗਤੀਵਿਧੀ",
    viewFullRecords: "ਪੂਰੇ ਰਿਕਾਰਡ ਵੇਖੋ",
    name: "ਨਾਮ",
    phone: "ਫੋਨ",
    editProfile: "ਪ੍ਰੋਫਾਈਲ ਸੰਪਾਦਿਤ ਕਰੋ",
    noRecordsYet: "ਅਜੇ ਤੱਕ ਕੋਈ ਸਿਹਤ ਰਿਕਾਰਡ ਨਹੀਂ ਹੈ",
    addRecord: "ਸਿਹਤ ਰਿਕਾਰਡ ਸ਼ਾਮਲ ਕਰੋ",
    bookConsultationDesc: "ਆਨਲਾਈਨ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਬੁੱਕ ਕਰੋ",
    bookNow: "ਹੁਣੇ ਬੁੱਕ ਕਰੋ",
    findMedicinesDesc: "ਆਪਣੇ ਨੇੜੇ ਦਵਾਈਆਂ ਅਤੇ ਫਾਰਮੇਸੀਆਂ ਲੱਭੋ",
    searchMedicines: "ਦਵਾਈਆਂ ਲੱਭੋ",
    symptomCheckerDesc: "ਸਾਡੇ ਏਆਈ ਲੱਛਣ ਜਾਂਚਕਰਤਾ ਨਾਲ ਆਪਣੇ ਲੱਛਣਾਂ ਦੀ ਜਾਂਚ ਕਰੋ",
    startCheck: "ਜਾਂਚ ਸ਼ੁਰੂ ਕਰੋ",
    emergencyDesc: "ਐਂਬੂਲੈਂਸ ਜਾਂ ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਨੂੰ ਕਾਲ ਕਰੋ",
    editProfileDesc: "ਆਪਣੀ ਪ੍ਰੋਫਾਈਲ ਜਾਣਕਾਰੀ ਸੰਪਾਦਿਤ ਕਰੋ",
  },
}

export default function SehatNabhaApp() {
  const [language, setLanguage] = useState<Language>("en")
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium")
  const [highContrast, setHighContrast] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [screenReaderMode, setScreenReaderMode] = useState(false)

  const [step, setStep] = useState<"language" | "phone" | "otp" | "role" | "dashboard">("language")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [selectedRole, setSelectedRole] = useState<UserRole>("patient")
  const [user, setUser] = useState<AppUser | null>(null)
  const { isOnline, isSyncing, pendingSyncCount, saveOfflineData, getOfflineData, forcSync } = useOffline()

  const [activePatientTab, setActivePatientTab] = useState<
    "dashboard" | "profile" | "records" | "telemedicine" | "medicines" | "symptoms" | "emergency"
  >("dashboard")

  const [activeDoctorTab, setActiveDoctorTab] = useState<
    "dashboard" | "queue" | "consultation" | "prescriptions" | "patients" | "schedule"
  >("dashboard")

  const [activePharmacyTab, setActivePharmacyTab] = useState<
    "dashboard" | "inventory" | "prescriptions" | "orders" | "suppliers" | "reports"
  >("dashboard")

  const [activeAdminTab, setActiveAdminTab] = useState<
    "dashboard" | "users" | "analytics" | "health-data" | "system" | "settings"
  >("dashboard")

  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null)
  const [isInConsultation, setIsInConsultation] = useState(false)
  const [consultationNotes, setConsultationNotes] = useState("")
  const [newPrescription, setNewPrescription] = useState<Partial<Prescription>>({
    medicines: [{ name: "", dosage: "", frequency: "", duration: "", instructions: "" }],
    diagnosis: "",
    notes: "",
  })

  const [patientQueue] = useState<Patient[]>([
    {
      id: "1",
      name: "Rajesh Kumar",
      age: 45,
      phone: "+91 98765 43210",
      symptoms: "Fever, headache, body pain for 3 days",
      appointmentTime: "10:30 AM",
      status: "waiting",
      priority: "medium",
    },
    {
      id: "2",
      name: "Priya Singh",
      age: 32,
      phone: "+91 87654 32109",
      symptoms: "Chest pain, difficulty breathing",
      appointmentTime: "11:00 AM",
      status: "waiting",
      priority: "high",
    },
    {
      id: "3",
      name: "Harpreet Kaur",
      age: 28,
      phone: "+91 76543 21098",
      symptoms: "Regular checkup, diabetes follow-up",
      appointmentTime: "11:30 AM",
      status: "waiting",
      priority: "low",
    },
  ])

  const [medicineInventory, setMedicineInventory] = useState<Medicine[]>([
    {
      id: "1",
      name: "Paracetamol 500mg",
      genericName: "Acetaminophen",
      manufacturer: "Sun Pharma",
      batchNumber: "PCM001",
      expiryDate: "2025-12-31",
      quantity: 150,
      minStockLevel: 50,
      price: 2.5,
      category: "tablet",
      prescription: false,
    },
    {
      id: "2",
      name: "Amoxicillin 250mg",
      genericName: "Amoxicillin",
      manufacturer: "Cipla",
      batchNumber: "AMX002",
      expiryDate: "2025-08-15",
      quantity: 25,
      minStockLevel: 30,
      price: 8.0,
      category: "capsule",
      prescription: true,
    },
    {
      id: "3",
      name: "Metformin 500mg",
      genericName: "Metformin HCl",
      manufacturer: "Dr. Reddy's",
      batchNumber: "MET003",
      expiryDate: "2026-03-20",
      quantity: 200,
      minStockLevel: 100,
      price: 3.2,
      category: "tablet",
      prescription: true,
    },
    {
      id: "4",
      name: "Cough Syrup",
      genericName: "Dextromethorphan",
      manufacturer: "Himalaya",
      batchNumber: "CS004",
      expiryDate: "2025-06-30",
      quantity: 8,
      minStockLevel: 15,
      price: 45.0,
      category: "syrup",
      prescription: false,
    },
  ])

  const [prescriptionOrders, setPrescriptionOrders] = useState<PrescriptionOrder[]>([
    {
      id: "1",
      patientName: "Rajesh Kumar",
      doctorName: "Dr. Singh",
      medicines: [
        {
          medicineId: "1",
          medicineName: "Paracetamol 500mg",
          quantity: 10,
          dosage: "1 tablet",
          instructions: "Take twice daily after meals",
        },
        {
          medicineId: "2",
          medicineName: "Amoxicillin 250mg",
          quantity: 21,
          dosage: "1 capsule",
          instructions: "Take thrice daily for 7 days",
        },
      ],
      status: "pending",
      orderDate: "2024-12-17",
      priority: "normal",
    },
    {
      id: "2",
      patientName: "Priya Singh",
      doctorName: "Dr. Kaur",
      medicines: [
        {
          medicineId: "3",
          medicineName: "Metformin 500mg",
          quantity: 30,
          dosage: "1 tablet",
          instructions: "Take twice daily before meals",
        },
      ],
      status: "ready",
      orderDate: "2024-12-16",
      priority: "urgent",
    },
  ])

  const t = translations[language]

  useEffect(() => {
    const initOfflineDB = async () => {
      try {
        await offlineDB.init()
        console.log("[v0] Offline database initialized")

        // Load cached data if offline
        if (!isOnline) {
          const cachedMedicines = await getOfflineData("medicine")
          const cachedPrescriptions = await getOfflineData("prescription")

          if (cachedMedicines.length > 0) {
            setMedicineInventory(cachedMedicines)
            console.log("[v0] Loaded cached medicine data")
          }

          if (cachedPrescriptions.length > 0) {
            setPrescriptionOrders(cachedPrescriptions)
            console.log("[v0] Loaded cached prescription data")
          }
        }
      } catch (error) {
        console.error("[v0] Failed to initialize offline database:", error)
      }
    }

    initOfflineDB()
  }, [isOnline, getOfflineData])

  const updateMedicineStock = async (medicineId: string, newQuantity: number) => {
    const updatedInventory = medicineInventory.map((med) =>
      med.id === medicineId ? { ...med, quantity: newQuantity } : med,
    )
    setMedicineInventory(updatedInventory)

    // Save to offline storage
    try {
      const updatedMedicine = updatedInventory.find((med) => med.id === medicineId)
      if (updatedMedicine) {
        await saveOfflineData("medicine", medicineId, updatedMedicine)
      }
      console.log("[v0] Updated stock for medicine:", medicineId, "New quantity:", newQuantity)
    } catch (error) {
      console.error("[v0] Failed to save medicine update offline:", error)
    }
  }

  const updatePrescriptionStatus = async (orderId: string, newStatus: PrescriptionOrder["status"]) => {
    const updatedOrders = prescriptionOrders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order,
    )
    setPrescriptionOrders(updatedOrders)

    // Save to offline storage
    try {
      const updatedOrder = updatedOrders.find((order) => order.id === orderId)
      if (updatedOrder) {
        await saveOfflineData("prescription", orderId, updatedOrder)
      }
      console.log("[v0] Updated prescription status:", orderId, "New status:", newStatus)
    } catch (error) {
      console.error("[v0] Failed to save prescription update offline:", error)
    }
  }

  const getLowStockMedicines = () => {
    return medicineInventory.filter((med) => med.quantity <= med.minStockLevel)
  }

  const getExpiringMedicines = () => {
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)

    return medicineInventory.filter((med) => {
      const expiryDate = new Date(med.expiryDate)
      return expiryDate <= threeMonthsFromNow
    })
  }

  const startConsultation = (patient: Patient) => {
    console.log("[v0] Starting consultation with:", patient.name)
    // Implementation for starting consultation
  }

  const AccessibilityControls = () => (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur">
            <Settings className="h-4 w-4" />
            <span className="sr-only">{t.accessibility}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>{t.accessibility}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <div className="p-2 space-y-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t.fontSize}</Label>
              <div className="flex gap-1">
                {(["small", "medium", "large"] as const).map((size) => (
                  <Button
                    key={size}
                    variant={fontSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFontSize(size)}
                    className="flex-1"
                  >
                    {size === "small" ? "A" : size === "medium" ? "A" : "A"}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">{t.highContrast}</Label>
              <Button
                variant={highContrast ? "default" : "outline"}
                size="sm"
                onClick={() => setHighContrast(!highContrast)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">{t.voiceInput}</Label>
              <Button
                variant={voiceEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">{t.screenReader}</Label>
              <Button
                variant={screenReaderMode ? "default" : "outline"}
                size="sm"
                onClick={() => setScreenReaderMode(!screenReaderMode)}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  if (step === "language") {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-orange-50 relative overflow-hidden ${
          fontSize === "large" ? "text-lg" : fontSize === "small" ? "text-sm" : ""
        } ${highContrast ? "bg-black text-white" : ""}`}
      >
        <AccessibilityControls />
        
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Curved orange line */}
          <div className="absolute top-20 right-10 w-96 h-96 border-4 border-orange-400 rounded-full opacity-20"></div>
          <div className="absolute top-32 right-20 w-80 h-80 border-2 border-orange-300 rounded-full opacity-30"></div>
          
          {/* Feature bubbles */}
          <div className="absolute top-24 right-32 bg-white/80 backdrop-blur-sm rounded-full p-4 shadow-lg">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <p className="text-xs mt-2 text-center font-medium">Multilingual</p>
          </div>
          
          <div className="absolute top-40 right-16 bg-white/80 backdrop-blur-sm rounded-full p-4 shadow-lg">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">🏥</span>
            </div>
            <p className="text-xs mt-2 text-center font-medium">Healthcare</p>
          </div>
          
          <div className="absolute top-56 right-24 bg-white/80 backdrop-blur-sm rounded-full p-4 shadow-lg">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">📱</span>
            </div>
            <p className="text-xs mt-2 text-center font-medium">Digital</p>
          </div>
          
          <div className="absolute top-72 right-12 bg-white/80 backdrop-blur-sm rounded-full p-4 shadow-lg">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">❤️</span>
            </div>
            <p className="text-xs mt-2 text-center font-medium">Care</p>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Quote and branding */}
            <div className="space-y-8 animate-fadeInLeft">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <span className="text-white font-bold text-2xl">SN</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold gradient-text">Sehat Nabha</h1>
                  <p className="text-gray-600 text-lg">Rural Healthcare Platform</p>
                </div>
              </div>
              
              <div className="glass rounded-2xl p-8 shadow-2xl">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 animate-float">
                    <span className="text-white font-bold text-xl">💡</span>
                  </div>
                  <div>
                    <blockquote className="italic text-gray-700 text-xl leading-relaxed">
                      "I dream of a Digital India where quality healthcare percolates right up to the remotest regions powered by e-Healthcare."
                    </blockquote>
                    <p className="text-sm text-gray-600 mt-4 font-semibold">
                      Shri Narendra Modi, Hon'ble Prime Minister of India
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800">Bridging the Digital Health Divide</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Sehat Nabha is a step towards digital health equity to achieve Universal Health Coverage (UHC). 
                  We facilitate quick and easy access to healthcare services from your smartphones, bringing quality 
                  medical care to rural and remote areas.
                </p>
              </div>
            </div>

            {/* Right side - Language selection */}
            <div className="flex justify-center animate-fadeInRight">
              <Card className={`w-full max-w-lg ${highContrast ? "bg-gray-900 border-white" : "glass shadow-2xl"}`}>
                <CardHeader className="text-center pb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <span className="text-white font-bold text-2xl">🌐</span>
                  </div>
                  <CardTitle className="text-3xl font-bold gradient-text">Welcome</CardTitle>
                  <p className="text-gray-600 text-lg mt-2">Choose your preferred language</p>
                </CardHeader>
                <CardContent className="space-y-6 px-8 pb-8">
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold text-center block gradient-text">Select Language / भाषा चुनें / ਭਾਸ਼ਾ ਚੁਣੋ</Label>
                    <div className="grid gap-4">
                      {(["en", "hi", "pa"] as const).map((lang, index) => (
                        <Button
                          key={lang}
                          variant={language === lang ? "default" : "outline"}
                          className={`h-20 text-left justify-start transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                            highContrast ? "border-white" : ""
                          } ${
                            language === lang 
                              ? "bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 text-white border-0 shadow-lg" 
                              : "hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 border-2 hover:border-emerald-200"
                          }`}
                          onClick={() => {
                            setLanguage(lang)
                            setStep("phone")
                          }}
                          style={{
                            animationDelay: `${index * 150}ms`,
                            animation: 'fadeInUp 0.6s ease-out forwards'
                          }}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                              language === lang ? "bg-white/20 scale-110" : "bg-gradient-to-br from-emerald-100 to-blue-100"
                            }`}>
                              <span className={`text-xl font-bold transition-all duration-300 ${
                                language === lang ? "text-white" : "text-emerald-600"
                              }`}>
                                {lang === "en" ? "E" : lang === "hi" ? "हि" : "ਪ"}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-xl">
                                {lang === "en" ? "English" : lang === "hi" ? "हिंदी" : "ਪੰਜਾਬੀ"}
                              </div>
                              <div className="text-sm opacity-80">
                                {lang === "en" ? "English" : lang === "hi" ? "Hindi" : "Punjabi"}
                              </div>
                            </div>
                            {language === lang && (
                              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-white text-lg">✓</span>
                              </div>
                            )}
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === "phone") {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-orange-50 relative overflow-hidden ${
          fontSize === "large" ? "text-lg" : fontSize === "small" ? "text-sm" : ""
        } ${highContrast ? "bg-black text-white" : ""}`}
      >
        <AccessibilityControls />
        
        {/* Background decorative elements inspired by Healthy India */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Central doctor figure representation */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center opacity-10">
            <Stethoscope className="h-16 w-16 text-white" />
          </div>
          
          {/* Patient circles around the doctor */}
          <div className="absolute top-20 left-20 w-16 h-16 bg-pink-200 rounded-full flex items-center justify-center opacity-60">
            <User className="h-8 w-8 text-pink-600" />
          </div>
          <div className="absolute top-32 right-24 w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center opacity-60">
            <User className="h-8 w-8 text-orange-600" />
          </div>
          <div className="absolute bottom-32 left-32 w-16 h-16 bg-red-200 rounded-full flex items-center justify-center opacity-60">
            <User className="h-8 w-8 text-red-600" />
          </div>
          <div className="absolute bottom-20 right-20 w-16 h-16 bg-teal-200 rounded-full flex items-center justify-center opacity-60">
            <User className="h-8 w-8 text-teal-600" />
          </div>
          <div className="absolute top-40 left-1/2 w-16 h-16 bg-light-blue-200 rounded-full flex items-center justify-center opacity-60">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <div className="absolute bottom-40 right-1/2 w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center opacity-60">
            <User className="h-8 w-8 text-purple-600" />
          </div>
          
          {/* Connection lines */}
          <div className="absolute top-1/2 left-1/2 w-px h-20 bg-green-400 opacity-30 transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-20 h-px bg-green-400 opacity-30 transform -translate-x-1/2 -translate-y-1/2"></div>
          
          {/* Healthy India text representation */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <div className="text-2xl font-bold text-blue-600 opacity-20">स्वस्थ भारत</div>
            <div className="text-lg font-medium text-emerald-600 opacity-20">Healthy India</div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Visual representation */}
            <div className="hidden lg:block space-y-8 animate-fadeInLeft">
              <div className="text-center">
                <h1 className="text-5xl font-bold gradient-text mb-6">Sehat Nabha</h1>
                <p className="text-2xl text-gray-600 mb-8">Connecting Healthcare Across India</p>
              </div>
              
              {/* Central doctor with connected patients */}
              <div className="relative flex justify-center items-center">
                <div className="w-40 h-40 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                  <Stethoscope className="h-20 w-20 text-white" />
                </div>
                
                {/* Patient circles around doctor */}
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-pink-200 rounded-full flex items-center justify-center animate-float" style={{animationDelay: '0.5s'}}>
                  <User className="h-8 w-8 text-pink-600" />
                </div>
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center animate-float" style={{animationDelay: '1s'}}>
                  <User className="h-8 w-8 text-orange-600" />
                </div>
                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-red-200 rounded-full flex items-center justify-center animate-float" style={{animationDelay: '1.5s'}}>
                  <User className="h-8 w-8 text-red-600" />
                </div>
                <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-teal-200 rounded-full flex items-center justify-center animate-float" style={{animationDelay: '2s'}}>
                  <User className="h-8 w-8 text-teal-600" />
                </div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center animate-float" style={{animationDelay: '2.5s'}}>
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6 w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center animate-float" style={{animationDelay: '3s'}}>
                  <User className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              
              <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">स्वस्थ भारत</h2>
                <p className="text-2xl text-gray-600 mb-2">Healthy India</p>
                <p className="text-lg text-gray-500">Connecting patients with healthcare providers across the nation</p>
              </div>
            </div>

            {/* Right side - Login form */}
            <div className="flex justify-center animate-fadeInRight">
              <Card className={`w-full max-w-lg ${highContrast ? "bg-gray-900 border-white" : "glass shadow-2xl"}`}>
                <CardHeader className="text-center pb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <Phone className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold gradient-text">{t.phoneVerification}</CardTitle>
                  <p className="text-gray-600 text-lg mt-2">{t.enterPhoneNumber}</p>
                </CardHeader>
                <CardContent className="space-y-6 px-8 pb-8">
                  <div className="space-y-4">
                    <Label htmlFor="phone" className="text-lg font-semibold gradient-text">{t.phoneNumber}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`h-16 text-xl px-4 ${highContrast ? "border-white bg-gray-800" : "border-2 border-emerald-200 focus:border-emerald-500"}`}
                    />
                  </div>
                  <Button
                    onClick={() => {
                      if (phone.length >= 10) {
                        setStep("otp")
                      }
                    }}
                    className="w-full h-16 text-xl bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    disabled={phone.length < 10}
                  >
                    {t.sendOTP}
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => setStep("language")} 
                    className="w-full h-14 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-300"
                  >
                    {t.back}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === "otp") {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-purple-50 relative overflow-hidden ${
          fontSize === "large" ? "text-lg" : fontSize === "small" ? "text-sm" : ""
        } ${highContrast ? "bg-black text-white" : ""}`}
      >
        <AccessibilityControls />
        
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-emerald-200/20 to-blue-200/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-100/10 to-emerald-100/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-lg">
            <Card className={`${highContrast ? "bg-gray-900 border-white" : "glass shadow-2xl"}`}>
              <CardHeader className="text-center pb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                  <span className="text-white font-bold text-2xl">📱</span>
                </div>
                <CardTitle className="text-3xl font-bold gradient-text">{t.verifyOTP}</CardTitle>
                <p className="text-gray-600 text-lg mt-2">
                  {t.otpSentTo} <span className="font-semibold text-emerald-600">{phone}</span>
                </p>
                <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="text-sm text-emerald-700">
                    💡 <strong>Tip:</strong> Check your SMS inbox for the 6-digit verification code
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 px-8 pb-8">
                <div className="space-y-4">
                  <Label htmlFor="otp" className="text-lg font-semibold gradient-text">{t.enterOTP}</Label>
                  <div className="flex justify-center">
                    <Input
                      id="otp"
                      type="text"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className={`h-16 text-2xl text-center font-bold tracking-widest ${highContrast ? "border-white bg-gray-800" : "border-2 border-emerald-200 focus:border-emerald-500"}`}
                      maxLength={6}
                    />
                  </div>
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5, 6].map((digit) => (
                      <div
                        key={digit}
                        className={`w-8 h-8 rounded border-2 flex items-center justify-center text-lg font-bold ${
                          otp.length >= digit
                            ? "border-emerald-500 bg-emerald-100 text-emerald-700"
                            : "border-gray-300 bg-gray-50"
                        }`}
                      >
                        {otp[digit - 1] || ""}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <Button
                    onClick={() => {
                      if (otp.length === 6) {
                        setStep("role")
                      }
                    }}
                    className="w-full h-16 text-xl bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    disabled={otp.length !== 6}
                  >
                    {t.verifyOTP}
                  </Button>
                  <div className="flex justify-center space-x-4">
                    <Button 
                      variant="ghost" 
                      onClick={() => setStep("phone")} 
                      className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-300"
                    >
                      {t.back}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        // Resend OTP logic would go here
                        console.log("Resending OTP...")
                      }}
                      className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 transition-all duration-300"
                    >
                      Resend OTP
                    </Button>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Didn't receive the code? Check your spam folder or try again
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (step === "role") {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-orange-50 relative overflow-hidden ${
          fontSize === "large" ? "text-lg" : fontSize === "small" ? "text-sm" : ""
        } ${highContrast ? "bg-black text-white" : ""}`}
      >
        <AccessibilityControls />
        
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Subtle background patterns */}
          <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-emerald-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-br from-orange-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-100/10 to-emerald-100/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-2xl">
            <Card className={`${highContrast ? "bg-gray-900 border-white" : "bg-white/95 backdrop-blur-sm shadow-2xl"}`}>
              <CardHeader className="text-center pb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t.selectRole}
                </CardTitle>
                <p className="text-gray-600 text-lg mt-2">{t.chooseYourRole}</p>
              </CardHeader>
              <CardContent className="space-y-6 px-8 pb-8">
                <div className="grid gap-4">
                  {(["patient", "doctor", "pharmacist", "admin"] as const).map((role, index) => (
                    <Button
                      key={role}
                      variant={selectedRole === role ? "default" : "outline"}
                      className={`h-20 text-left justify-start transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                        highContrast ? "border-white" : ""
                      } ${
                        selectedRole === role 
                          ? "bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 text-white border-0 shadow-lg" 
                          : "hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 border-2 hover:border-emerald-200"
                      }`}
                      onClick={() => setSelectedRole(role)}
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'fadeInUp 0.6s ease-out forwards'
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                          selectedRole === role ? "bg-white/20 scale-110" : "bg-gradient-to-br from-emerald-100 to-blue-100"
                        }`}>
                          <span className={`text-2xl transition-all duration-300 ${
                            selectedRole === role ? "text-white" : "text-emerald-600"
                          }`}>
                            {role === "patient" ? "🏥" : role === "doctor" ? "👨‍⚕️" : role === "pharmacist" ? "💊" : "👨‍💼"}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-lg">{t[role]}</div>
                          <div className="text-sm opacity-80">{t[`${role}Description` as keyof typeof t]}</div>
                        </div>
                        {selectedRole === role && (
                          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">✓</span>
                          </div>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
                <div className="space-y-4 pt-4">
                  <Button
                    onClick={() => {
                      const newUser: AppUser = {
                        id: Date.now().toString(),
                        phone,
                        role: selectedRole,
                        name: `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} User`,
                        language,
                      }
                      setUser(newUser)
                      setStep("dashboard")
                    }}
                    className="w-full h-16 text-lg bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    disabled={!selectedRole}
                  >
                    {t.continue}
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => setStep("otp")} 
                    className="w-full h-12 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-300"
                  >
                    {t.back}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (step === "dashboard" && user?.role === "patient") {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border p-4 sticky top-0 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">{t.appName}</h1>
                <p className="text-sm text-muted-foreground">
                  {t.welcome}, {user?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <OfflineIndicator />
              <Button variant="ghost" size="sm" onClick={() => setUser(null)}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="bg-card border-b border-border p-2 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            {[
              { id: "dashboard", icon: BarChart3, label: t.dashboard },
              { id: "profile", icon: User, label: t.profile },
              { id: "records", icon: FileText, label: t.healthRecords },
              { id: "telemedicine", icon: Video, label: t.telemedicine },
              { id: "medicines", icon: Pill, label: t.medicines },
              { id: "symptoms", icon: Brain, label: t.symptoms },
              { id: "emergency", icon: Phone, label: t.emergency },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activePatientTab === tab.id ? "default" : "ghost"}
                size="sm"
                className="flex items-center space-x-2 whitespace-nowrap"
                onClick={() => setActivePatientTab(tab.id as any)}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </Button>
            ))}
          </div>
        </nav>

        {/* Patient Dashboard Content */}
        <main className="p-4 space-y-6">
          {activePatientTab === "dashboard" && (
            <div className="space-y-8">
              {/* Our Doctors Section */}
              <div className="space-y-8 animate-fadeInUp">
                <h2 className="text-4xl font-bold gradient-text">Our Doctors</h2>
                
                {/* Doctor Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Dr. Anil Kumar R */}
                  <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-scaleIn" style={{animationDelay: '0.1s'}}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                          <span className="text-white font-bold text-xl">A</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500 font-semibold">eSanjeevani</div>
                          <div className="text-xs text-gray-400">National Telemedicine Service</div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">Dr. Anil Kumar R</h3>
                        <p className="text-emerald-600 font-semibold text-lg">M.S, Orthopaedics</p>
                        <p className="text-sm text-gray-600 mt-2">Pathanamthitta, Adoor, Kerala</p>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center space-x-3 text-yellow-600 mb-4">
                        <span className="text-2xl animate-bounce">⭐</span>
                        <span className="text-sm font-semibold">9500+ Patients served on eSanjeevani</span>
                      </div>
                      <div className="flex justify-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center opacity-40 animate-float">
                          <Users className="h-10 w-10 text-gray-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Dr. Tresy Jose */}
                  <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-scaleIn" style={{animationDelay: '0.2s'}}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                          <span className="text-white font-bold text-xl">T</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500 font-semibold">eSanjeevani</div>
                          <div className="text-xs text-gray-400">National Telemedicine Service</div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">Dr. Tresy Jose</h3>
                        <p className="text-emerald-600 font-semibold text-lg">M.D, Dermatology</p>
                        <p className="text-sm text-gray-600 mt-2">Pathanamthitta, Adoor, Kerala</p>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center space-x-3 text-yellow-600 mb-4">
                        <span className="text-2xl animate-bounce">⭐</span>
                        <span className="text-sm font-semibold">22200+ Patients served on eSanjeevani</span>
                      </div>
                      <div className="flex justify-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center opacity-40 animate-float">
                          <Users className="h-10 w-10 text-gray-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Dr. Vineetha Sudheesh */}
                  <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-scaleIn" style={{animationDelay: '0.3s'}}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                          <span className="text-white font-bold text-xl">V</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500 font-semibold">eSanjeevani</div>
                          <div className="text-xs text-gray-400">National Telemedicine Service</div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">Dr. Vineetha Sudheesh</h3>
                        <p className="text-emerald-600 font-semibold text-lg">M.B.B.S, Paediatrics</p>
                        <p className="text-sm text-gray-600 mt-2">Pathanamthitta, Adoor, Kerala</p>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center space-x-3 text-yellow-600 mb-4">
                        <span className="text-2xl animate-bounce">⭐</span>
                        <span className="text-sm font-semibold">13000+ Patients served on eSanjeevani</span>
                      </div>
                      <div className="flex justify-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center opacity-40 animate-float">
                          <Users className="h-10 w-10 text-gray-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Navigation arrows */}
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" size="sm" className="w-10 h-10 rounded-full">
                    <span className="text-lg">‹</span>
                  </Button>
                  <Button variant="outline" size="sm" className="w-10 h-10 rounded-full">
                    <span className="text-lg">›</span>
                  </Button>
                </div>
              </div>

              {/* Features and Compliance Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">☁️</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-700">Cloud based</p>
                </div>
                
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">🏛️</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-700">EHR guidelines of MoHFW</p>
                </div>
                
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-700">ABDM compliant</p>
                </div>
                
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">🔒</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-700">Encryption</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <Card
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br from-emerald-50 to-blue-50"
                  onClick={() => setActivePatientTab("telemedicine")}
                >
                  <div className="flex items-center space-x-3">
                    <Video className="h-8 w-8 text-emerald-600" />
                    <div>
                      <h3 className="font-semibold text-emerald-800">{t.bookConsultation}</h3>
                      <p className="text-sm text-emerald-600">{t.connectWithDoctor}</p>
                    </div>
                  </div>
                </Card>
                <Card
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-purple-50"
                  onClick={() => setActivePatientTab("symptoms")}
                >
                  <div className="flex items-center space-x-3">
                    <Brain className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-blue-800">{t.checkSymptoms}</h3>
                      <p className="text-sm text-blue-600">{t.aiSymptomChecker}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Health Summary */}
              <Card className="bg-gradient-to-br from-gray-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-emerald-600" />
                    <span className="text-emerald-800">{t.healthSummary}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-3xl font-bold text-emerald-600">72</div>
                      <div className="text-sm text-gray-600">Heart Rate (BPM)</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-3xl font-bold text-blue-600">120/80</div>
                      <div className="text-sm text-gray-600">Blood Pressure</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full bg-white hover:bg-gray-50 border-emerald-200 text-emerald-700"
                    onClick={() => setActivePatientTab("records")}
                  >
                    {t.viewFullRecords}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activePatientTab === "profile" && (
            <div className="space-y-6 animate-fadeInUp">
              <h2 className="text-3xl font-bold gradient-text">My Profile</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="lg:col-span-2 bg-gradient-to-br from-emerald-50 to-blue-50 border-0 shadow-lg">
                  <CardHeader className="text-center pb-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <User className="h-12 w-12 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-800">{user?.name}</CardTitle>
                    <p className="text-emerald-600 font-semibold">Patient ID: {user?.id}</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{t.name}</label>
                        <p className="text-xl font-medium text-gray-800">{user?.name}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{t.phone}</label>
                        <p className="text-xl font-medium text-gray-800">{user?.phone}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Email</label>
                        <p className="text-xl font-medium text-gray-800">patient{user?.phone.slice(-4)}@sehatnabha.com</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Date of Birth</label>
                        <p className="text-xl font-medium text-gray-800">15 March 1985</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Gender</label>
                        <p className="text-xl font-medium text-gray-800">Male</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Blood Group</label>
                        <p className="text-xl font-medium text-gray-800">O+</p>
                      </div>
                    </div>
                    <Button className="w-full h-12 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <Edit className="h-4 w-4 mr-2" />
                      {t.editProfile}
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="space-y-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">Health Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-emerald-600">72</div>
                        <div className="text-sm text-gray-600">Heart Rate (BPM)</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-blue-600">120/80</div>
                        <div className="text-sm text-gray-600">Blood Pressure</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-purple-600">98.6°F</div>
                        <div className="text-sm text-gray-600">Temperature</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-pink-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">Activity Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Consultations</span>
                        <span className="font-semibold text-orange-600">12</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Prescriptions</span>
                        <span className="font-semibold text-orange-600">8</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Emergency Calls</span>
                        <span className="font-semibold text-orange-600">2</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activePatientTab === "records" && (
            <div className="space-y-6 animate-fadeInUp">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold gradient-text">Health Records</h2>
                <Button className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Plus className="h-4 w-4 mr-2" />
                  {t.addRecord}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Records */}
                <div className="lg:col-span-2 space-y-4">
                  <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-800">Recent Medical Records</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-emerald-500">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-800">General Checkup</h3>
                              <p className="text-sm text-gray-600">Dr. Anil Kumar R - Orthopedics</p>
                              <p className="text-xs text-gray-500">15 December 2024</p>
                            </div>
                            <Badge className="bg-emerald-100 text-emerald-700">Completed</Badge>
                          </div>
                          <p className="text-sm text-gray-700 mt-2">Routine health checkup. All vitals normal. Recommended regular exercise.</p>
                        </div>
                        
                        <div className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-800">Blood Test Results</h3>
                              <p className="text-sm text-gray-600">Dr. Tresy Jose - Dermatology</p>
                              <p className="text-xs text-gray-500">10 December 2024</p>
                            </div>
                            <Badge className="bg-blue-100 text-blue-700">Pending Review</Badge>
                          </div>
                          <p className="text-sm text-gray-700 mt-2">Complete blood count and lipid profile. Results within normal range.</p>
                        </div>
                        
                        <div className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-purple-500">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-800">X-Ray Report</h3>
                              <p className="text-sm text-gray-600">Dr. Vineetha Sudheesh - Pediatrics</p>
                              <p className="text-xs text-gray-500">5 December 2024</p>
                            </div>
                            <Badge className="bg-purple-100 text-purple-700">Available</Badge>
                          </div>
                          <p className="text-sm text-gray-700 mt-2">Chest X-ray shows clear lungs. No abnormalities detected.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">Record Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-emerald-600">15</div>
                        <div className="text-sm text-gray-600">Total Records</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-blue-600">8</div>
                        <div className="text-sm text-gray-600">This Month</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-purple-600">3</div>
                        <div className="text-sm text-gray-600">Pending</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-pink-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">Upcoming</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <div className="font-semibold text-gray-800">Follow-up Visit</div>
                        <div className="text-sm text-gray-600">Dr. Anil Kumar R</div>
                        <div className="text-xs text-orange-600">20 December 2024</div>
                      </div>
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <div className="font-semibold text-gray-800">Lab Test</div>
                        <div className="text-sm text-gray-600">Blood Sugar Test</div>
                        <div className="text-xs text-orange-600">25 December 2024</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activePatientTab === "telemedicine" && (
            <div className="space-y-6 animate-fadeInUp">
              <h2 className="text-3xl font-bold gradient-text">Telemedicine</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Available Doctors */}
                <div className="lg:col-span-2 space-y-4">
                  <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-800">Available Doctors</CardTitle>
                      <p className="text-gray-600">Book a consultation with our expert doctors</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white rounded-lg shadow-sm border border-emerald-200 hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">A</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">Dr. Anil Kumar R</h3>
                              <p className="text-sm text-emerald-600">Orthopedics</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-2" />
                              Available Now
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="text-yellow-500 mr-2">⭐</span>
                              4.8 Rating (9500+ patients)
                            </div>
                          </div>
                          <Button className="w-full mt-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white">
                            Book Now
                          </Button>
                        </div>
                        
                        <div className="p-4 bg-white rounded-lg shadow-sm border border-blue-200 hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">T</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">Dr. Tresy Jose</h3>
                              <p className="text-sm text-blue-600">Dermatology</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-2" />
                              Available in 30 min
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="text-yellow-500 mr-2">⭐</span>
                              4.9 Rating (22200+ patients)
                            </div>
                          </div>
                          <Button className="w-full mt-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                            Book Now
                          </Button>
                        </div>
                        
                        <div className="p-4 bg-white rounded-lg shadow-sm border border-purple-200 hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">V</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">Dr. Vineetha Sudheesh</h3>
                              <p className="text-sm text-purple-600">Pediatrics</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-2" />
                              Available Tomorrow
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="text-yellow-500 mr-2">⭐</span>
                              4.7 Rating (13000+ patients)
                            </div>
                          </div>
                          <Button className="w-full mt-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                            Book Now
                          </Button>
                        </div>
                        
                        <div className="p-4 bg-white rounded-lg shadow-sm border border-orange-200 hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">S</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">Dr. Sarah Wilson</h3>
                              <p className="text-sm text-orange-600">General Medicine</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-2" />
                              Available Now
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="text-yellow-500 mr-2">⭐</span>
                              4.6 Rating (8500+ patients)
                            </div>
                          </div>
                          <Button className="w-full mt-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full justify-start bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white">
                        <Video className="h-4 w-4 mr-2" />
                        Start Video Call
                      </Button>
                      <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                        <FileText className="h-4 w-4 mr-2" />
                        View Prescriptions
                      </Button>
                      <Button className="w-full justify-start bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Follow-up
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-pink-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">Recent Consultations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <div className="font-semibold text-gray-800">Dr. Anil Kumar R</div>
                        <div className="text-sm text-gray-600">Orthopedics</div>
                        <div className="text-xs text-orange-600">15 December 2024</div>
                      </div>
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <div className="font-semibold text-gray-800">Dr. Tresy Jose</div>
                        <div className="text-sm text-gray-600">Dermatology</div>
                        <div className="text-xs text-orange-600">10 December 2024</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activePatientTab === "medicines" && (
            <div className="space-y-6 animate-fadeInUp">
              <h2 className="text-3xl font-bold gradient-text">Medicines & Pharmacy</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Medicine Search */}
                <div className="lg:col-span-2 space-y-4">
                  <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-800">Find Medicines</CardTitle>
                      <p className="text-gray-600">Search for medicines and find nearby pharmacies</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex space-x-2">
                        <Input 
                          placeholder="Search medicines..." 
                          className="flex-1 h-12 text-lg"
                        />
                        <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-6">
                          <Pill className="h-4 w-4 mr-2" />
                          Search
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white rounded-lg shadow-sm border border-emerald-200">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                              <Pill className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">Paracetamol 500mg</h3>
                              <p className="text-sm text-emerald-600">Pain Relief</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-gray-600">Generic: Acetaminophen</div>
                            <div className="text-sm text-gray-600">Manufacturer: ABC Pharma</div>
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-emerald-600">₹25.00</span>
                              <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white rounded-lg shadow-sm border border-blue-200">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Pill className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">Amoxicillin 250mg</h3>
                              <p className="text-sm text-blue-600">Antibiotic</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-gray-600">Generic: Amoxicillin</div>
                            <div className="text-sm text-gray-600">Manufacturer: XYZ Pharma</div>
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-blue-600">₹45.00</span>
                              <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white rounded-lg shadow-sm border border-purple-200">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <Pill className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">Omeprazole 20mg</h3>
                              <p className="text-sm text-purple-600">Antacid</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-gray-600">Generic: Omeprazole</div>
                            <div className="text-sm text-gray-600">Manufacturer: DEF Pharma</div>
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-purple-600">₹35.00</span>
                              <Button size="sm" className="bg-purple-500 hover:bg-purple-600 text-white">
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white rounded-lg shadow-sm border border-orange-200">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                              <Pill className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">Metformin 500mg</h3>
                              <p className="text-sm text-orange-600">Diabetes</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-gray-600">Generic: Metformin</div>
                            <div className="text-sm text-gray-600">Manufacturer: GHI Pharma</div>
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-orange-600">₹28.00</span>
                              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Cart & Prescriptions */}
                <div className="space-y-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">Shopping Cart</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-white rounded">
                          <span className="text-sm">Paracetamol 500mg</span>
                          <span className="text-sm font-semibold">₹25</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-white rounded">
                          <span className="text-sm">Amoxicillin 250mg</span>
                          <span className="text-sm font-semibold">₹45</span>
                        </div>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between items-center font-semibold">
                          <span>Total:</span>
                          <span className="text-emerald-600">₹70</span>
                        </div>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white">
                        Checkout
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-pink-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">Recent Prescriptions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <div className="font-semibold text-gray-800">Dr. Anil Kumar R</div>
                        <div className="text-sm text-gray-600">3 medicines prescribed</div>
                        <div className="text-xs text-orange-600">15 December 2024</div>
                      </div>
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <div className="font-semibold text-gray-800">Dr. Tresy Jose</div>
                        <div className="text-sm text-gray-600">2 medicines prescribed</div>
                        <div className="text-xs text-orange-600">10 December 2024</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activePatientTab === "symptoms" && (
            <div className="space-y-6 animate-fadeInUp">
              <h2 className="text-3xl font-bold gradient-text">AI Symptom Checker</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Symptom Checker */}
                <div className="lg:col-span-2 space-y-4">
                  <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-800">Check Your Symptoms</CardTitle>
                      <p className="text-gray-600">Our AI-powered symptom checker can help identify potential health issues</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-lg font-semibold text-gray-700">What symptoms are you experiencing?</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                            {[
                              "Fever", "Headache", "Cough", "Nausea", "Fatigue", "Dizziness",
                              "Chest Pain", "Shortness of Breath", "Abdominal Pain", "Joint Pain", "Rash", "Sore Throat"
                            ].map((symptom, index) => (
                              <Button
                                key={symptom}
                                variant="outline"
                                className="h-12 text-sm border-2 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300"
                                style={{
                                  animationDelay: `${index * 50}ms`,
                                  animation: 'fadeInUp 0.6s ease-out forwards'
                                }}
                              >
                                {symptom}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-lg font-semibold text-gray-700">How long have you had these symptoms?</Label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                            {["Less than 1 day", "1-3 days", "4-7 days", "More than 1 week"].map((duration, index) => (
                              <Button
                                key={duration}
                                variant="outline"
                                className="h-12 text-sm border-2 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
                                style={{
                                  animationDelay: `${index * 100}ms`,
                                  animation: 'fadeInUp 0.6s ease-out forwards'
                                }}
                              >
                                {duration}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-lg font-semibold text-gray-700">Severity Level</Label>
                          <div className="flex space-x-3 mt-3">
                            {[
                              { level: "Mild", color: "emerald", description: "Barely noticeable" },
                              { level: "Moderate", color: "yellow", description: "Noticeable but manageable" },
                              { level: "Severe", color: "orange", description: "Significantly affects daily life" },
                              { level: "Critical", color: "red", description: "Requires immediate attention" }
                            ].map((item, index) => (
                              <Button
                                key={item.level}
                                variant="outline"
                                className={`h-16 flex-col border-2 hover:border-${item.color}-500 hover:bg-${item.color}-50 transition-all duration-300`}
                                style={{
                                  animationDelay: `${index * 150}ms`,
                                  animation: 'fadeInUp 0.6s ease-out forwards'
                                }}
                              >
                                <span className="font-semibold">{item.level}</span>
                                <span className="text-xs text-gray-600">{item.description}</span>
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <Button className="w-full h-16 text-xl bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <Brain className="h-5 w-5 mr-2" />
                        {t.startCheck}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* AI Analysis & Quick Tips */}
                <div className="space-y-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">AI Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                          <span className="font-semibold text-gray-800">Analysis Complete</span>
                        </div>
                        <p className="text-sm text-gray-600">Based on your symptoms, here are the most likely conditions:</p>
                        <div className="mt-3 space-y-2">
                          <div className="p-2 bg-emerald-50 rounded text-sm">
                            <span className="font-semibold text-emerald-700">Common Cold (85%)</span>
                          </div>
                          <div className="p-2 bg-blue-50 rounded text-sm">
                            <span className="font-semibold text-blue-700">Flu (12%)</span>
                          </div>
                          <div className="p-2 bg-yellow-50 rounded text-sm">
                            <span className="font-semibold text-yellow-700">Allergies (3%)</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-pink-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">Quick Health Tips</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <div className="font-semibold text-gray-800 text-sm">💧 Stay Hydrated</div>
                        <div className="text-xs text-gray-600">Drink 8-10 glasses of water daily</div>
                      </div>
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <div className="font-semibold text-gray-800 text-sm">😴 Get Enough Sleep</div>
                        <div className="text-xs text-gray-600">Aim for 7-9 hours of quality sleep</div>
                      </div>
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <div className="font-semibold text-gray-800 text-sm">🥗 Eat Healthy</div>
                        <div className="text-xs text-gray-600">Include fruits and vegetables in your diet</div>
                      </div>
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <div className="font-semibold text-gray-800 text-sm">🏃‍♂️ Exercise Regularly</div>
                        <div className="text-xs text-gray-600">At least 30 minutes of moderate activity</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activePatientTab === "emergency" && (
            <div className="space-y-6 animate-fadeInUp">
              <h2 className="text-3xl font-bold text-red-600">Emergency Services</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Emergency Actions */}
                <div className="lg:col-span-2 space-y-4">
                  <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-0 shadow-lg">
                    <CardHeader className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <span className="text-white font-bold text-3xl">🚑</span>
                      </div>
                      <CardTitle className="text-2xl font-bold text-red-600">Emergency Response</CardTitle>
                      <p className="text-gray-600">Get immediate medical assistance when you need it most</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button className="h-20 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                          <Phone className="h-6 w-6 mr-3" />
                          Call Ambulance
                        </Button>
                        <Button className="h-20 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                          <AlertTriangle className="h-6 w-6 mr-3" />
                          Emergency Alert
                        </Button>
                        <Button className="h-20 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                          <Users className="h-6 w-6 mr-3" />
                          Contact Family
                        </Button>
                        <Button className="h-20 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                          <FileText className="h-6 w-6 mr-3" />
                          Medical Info
                        </Button>
                      </div>
                      
                      <div className="p-4 bg-red-100 rounded-lg border border-red-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          <span className="font-semibold text-red-800">Emergency Instructions</span>
                        </div>
                        <ul className="text-sm text-red-700 space-y-1">
                          <li>• Stay calm and assess the situation</li>
                          <li>• Call emergency services immediately if life-threatening</li>
                          <li>• Provide clear location and situation details</li>
                          <li>• Follow emergency operator instructions</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Emergency Contacts & Quick Info */}
                <div className="space-y-4">
                  <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-red-800">Emergency Contacts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-white rounded-lg shadow-sm border-l-4 border-red-500">
                        <div className="font-semibold text-gray-800">Ambulance</div>
                        <div className="text-2xl font-bold text-red-600">108</div>
                        <div className="text-xs text-gray-600">24/7 Emergency Service</div>
                      </div>
                      <div className="p-3 bg-white rounded-lg shadow-sm border-l-4 border-orange-500">
                        <div className="font-semibold text-gray-800">Police</div>
                        <div className="text-2xl font-bold text-orange-600">100</div>
                        <div className="text-xs text-gray-600">Emergency Response</div>
                      </div>
                      <div className="p-3 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
                        <div className="font-semibold text-gray-800">Fire Service</div>
                        <div className="text-2xl font-bold text-blue-600">101</div>
                        <div className="text-xs text-gray-600">Fire & Rescue</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">Quick Medical Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <div className="font-semibold text-gray-800 text-sm">Blood Group</div>
                        <div className="text-lg font-bold text-red-600">O+</div>
                      </div>
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <div className="font-semibold text-gray-800 text-sm">Allergies</div>
                        <div className="text-sm text-gray-600">Penicillin, Shellfish</div>
                      </div>
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <div className="font-semibold text-gray-800 text-sm">Current Medications</div>
                        <div className="text-sm text-gray-600">Metformin, Lisinopril</div>
                      </div>
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <div className="font-semibold text-gray-800 text-sm">Emergency Contact</div>
                        <div className="text-sm text-gray-600">+91 98765 43210</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    )
  }

  if (step === "dashboard" && user?.role === "admin") {
    // Mock admin data
    const totalUsers = 1247
    const totalPatients = 892
    const totalDoctors = 23
    const totalPharmacists = 15
    const totalConsultations = 156
    const activeConsultations = 8
    const totalPrescriptions = 234
    const systemUptime = "99.8%"

    const regionData = [
      { district: "Amritsar", patients: 234, doctors: 8, pharmacies: 5, consultations: 45 },
      { district: "Ludhiana", patients: 198, doctors: 6, pharmacies: 4, consultations: 38 },
      { district: "Jalandhar", patients: 167, doctors: 4, pharmacies: 3, consultations: 32 },
      { district: "Patiala", patients: 145, doctors: 3, pharmacies: 2, consultations: 28 },
      { district: "Bathinda", patients: 148, doctors: 2, pharmacies: 1, consultations: 13 },
    ]

    const healthMetrics = [
      { condition: "Diabetes", cases: 234, trend: "+12%" },
      { condition: "Hypertension", cases: 189, trend: "+8%" },
      { condition: "Respiratory Issues", cases: 156, trend: "-5%" },
      { condition: "Heart Disease", cases: 98, trend: "+3%" },
      { condition: "Mental Health", cases: 67, trend: "+18%" },
    ]

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border p-4 sticky top-0 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">{t.appName} - Admin</h1>
                <p className="text-sm text-muted-foreground">System Administrator • {totalUsers} total users</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <OfflineIndicator />
              {pendingSyncCount > 0 && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span className="text-xs">{pendingSyncCount} pending</span>
                </Badge>
              )}
              <Badge variant="default" className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span className="text-xs">Uptime: {systemUptime}</span>
              </Badge>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="bg-card border-b border-border p-2 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            {[
              { id: "dashboard", icon: BarChart3, label: "Dashboard" },
              { id: "users", icon: Users, label: "User Management" },
              { id: "analytics", icon: FileText, label: "Analytics" },
              { id: "health-data", icon: Stethoscope, label: "Health Data" },
              { id: "system", icon: AlertTriangle, label: "System Monitor" },
              { id: "settings", icon: Edit, label: "Settings" },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeAdminTab === tab.id ? "default" : "ghost"}
                size="sm"
                className="flex items-center space-x-2 whitespace-nowrap"
                onClick={() => setActiveAdminTab(tab.id as any)}
              >
                <tab.icon className="h-4 w-4" />
                <span className="text-sm">{tab.label}</span>
              </Button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="p-4">
          {activeAdminTab === "dashboard" && (
            <div className="space-y-6 animate-fadeInUp">
              <h2 className="text-3xl font-bold gradient-text">Admin Dashboard</h2>
              
              {/* System Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-emerald-600">{totalUsers}</p>
                    <p className="text-sm text-gray-600 font-semibold">Total Users</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Video className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{activeConsultations}</p>
                    <p className="text-sm text-gray-600 font-semibold">Active Consultations</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Clipboard className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-purple-600">{totalPrescriptions}</p>
                    <p className="text-sm text-gray-600 font-semibold">Prescriptions Today</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-orange-600">{systemUptime}</p>
                    <p className="text-sm text-gray-600 font-semibold">System Uptime</p>
                  </CardContent>
                </Card>
              </div>

              {(!isOnline || pendingSyncCount > 0) && <OfflineIndicator showDetails={true} />}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Regional Health Overview */}
                <div className="lg:col-span-2">
                  <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-800">Punjab Regional Health Overview</CardTitle>
                      <p className="text-gray-600">Healthcare metrics across major districts</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {regionData.map((region, index) => (
                          <div key={region.district} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-emerald-200 hover:shadow-md transition-shadow" style={{
                            animationDelay: `${index * 100}ms`,
                            animation: 'fadeInUp 0.6s ease-out forwards'
                          }}>
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                                <BarChart3 className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">{region.district}</p>
                                <p className="text-sm text-gray-600">
                                  {region.patients} patients • {region.doctors} doctors • {region.pharmacies} pharmacies
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-emerald-600">{region.consultations}</p>
                              <p className="text-sm text-gray-600 font-semibold">Consultations</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">User Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-emerald-600">{totalPatients}</div>
                        <div className="text-sm text-gray-600">Patients</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-blue-600">{totalDoctors}</div>
                        <div className="text-sm text-gray-600">Doctors</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-purple-600">{totalPharmacists}</div>
                        <div className="text-sm text-gray-600">Pharmacists</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-pink-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">System Health</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Server Status</span>
                        <Badge className="bg-emerald-100 text-emerald-700">Online</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Database</span>
                        <Badge className="bg-emerald-100 text-emerald-700">Healthy</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">API Response</span>
                        <span className="font-semibold text-orange-600">45ms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Storage Used</span>
                        <span className="font-semibold text-orange-600">68%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Health Trends */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-800">Top Health Conditions</CardTitle>
                    <p className="text-gray-600">Most common conditions in rural Punjab</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {healthMetrics.map((metric, index) => (
                      <div key={metric.condition} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm" style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'fadeInUp 0.6s ease-out forwards'
                      }}>
                        <div>
                          <p className="font-semibold text-gray-800">{metric.condition}</p>
                          <p className="text-sm text-gray-600">{metric.cases} cases</p>
                        </div>
                        <Badge className={`${
                          metric.trend.startsWith("+") 
                            ? "bg-red-100 text-red-700" 
                            : "bg-emerald-100 text-emerald-700"
                        }`}>
                          {metric.trend}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-800">System Activity</CardTitle>
                    <p className="text-gray-600">Real-time system metrics</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="text-gray-600">Daily Active Users</span>
                      <span className="font-bold text-blue-600">456</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="text-gray-600">Consultations Today</span>
                      <span className="font-bold text-blue-600">{totalConsultations}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="text-gray-600">Medicine Orders</span>
                      <span className="font-bold text-blue-600">89</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="text-gray-600">Emergency Calls</span>
                      <span className="font-bold text-red-600">3</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeAdminTab === "users" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">User Management</h2>
                <div className="flex space-x-2">
                  <Input placeholder="Search users..." className="max-w-sm" />
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>

              {/* User Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">{totalPatients}</p>
                    <p className="text-sm text-muted-foreground">Patients</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Stethoscope className="h-8 w-8 text-secondary mx-auto mb-2" />
                    <p className="text-2xl font-bold">{totalDoctors}</p>
                    <p className="text-sm text-muted-foreground">Doctors</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Pill className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">{totalPharmacists}</p>
                    <p className="text-sm text-muted-foreground">Pharmacists</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="h-8 w-8 text-secondary mx-auto mb-2" />
                    <p className="text-2xl font-bold">5</p>
                    <p className="text-sm text-muted-foreground">Admins</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Users */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent User Registrations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "Rajesh Kumar", role: "patient", location: "Amritsar", date: "2024-12-17" },
                    { name: "Dr. Priya Singh", role: "doctor", location: "Ludhiana", date: "2024-12-16" },
                    { name: "Harpreet Kaur", role: "patient", location: "Jalandhar", date: "2024-12-16" },
                    { name: "Pharmacy Plus", role: "pharmacist", location: "Patiala", date: "2024-12-15" },
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.location} • {user.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {user.role}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {activeAdminTab === "analytics" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">System Analytics</h2>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Usage Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Daily Active Users</span>
                      <span className="font-bold">456</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weekly Active Users</span>
                      <span className="font-bold">1,234</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Active Users</span>
                      <span className="font-bold">3,456</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Session Duration</span>
                      <span className="font-bold">12m 34s</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Feature Usage</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { feature: "Telemedicine", usage: "78%", trend: "+12%" },
                      { feature: "Medicine Finder", usage: "65%", trend: "+8%" },
                      { feature: "Health Records", usage: "54%", trend: "+15%" },
                      { feature: "Symptom Checker", usage: "43%", trend: "+22%" },
                      { feature: "Emergency Services", usage: "12%", trend: "-3%" },
                    ].map((item) => (
                      <div key={item.feature} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.feature}</p>
                          <p className="text-sm text-muted-foreground">Usage: {item.usage}</p>
                        </div>
                        <Badge variant={item.trend.startsWith("+") ? "default" : "secondary"} className="text-xs">
                          {item.trend}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeAdminTab === "health-data" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Health Data Insights</h2>
                <Badge variant="outline">Punjab Rural Health Initiative</Badge>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Disease Prevalence by District</CardTitle>
                    <CardDescription>Most common health conditions across Punjab</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {regionData.map((region) => (
                        <div key={region.district} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{region.district}</span>
                            <span className="text-sm text-muted-foreground">{region.patients} patients</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="p-2 bg-destructive/10 rounded text-center">
                              <p className="font-medium">Diabetes</p>
                              <p>{Math.floor(region.patients * 0.26)}</p>
                            </div>
                            <div className="p-2 bg-secondary/10 rounded text-center">
                              <p className="font-medium">Hypertension</p>
                              <p>{Math.floor(region.patients * 0.21)}</p>
                            </div>
                            <div className="p-2 bg-primary/10 rounded text-center">
                              <p className="font-medium">Respiratory</p>
                              <p>{Math.floor(region.patients * 0.17)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Health Outcomes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Treatment Success Rate</span>
                      <span className="font-bold text-primary">87.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Patient Satisfaction</span>
                      <span className="font-bold text-primary">4.6/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Follow-up Compliance</span>
                      <span className="font-bold text-secondary">72.1%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Emergency Response Time</span>
                      <span className="font-bold text-primary">8.2 min</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeAdminTab === "system" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">System Monitor</h2>
                <Badge variant="default" className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>All Systems Operational</span>
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Health</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Server Status</span>
                      <Badge variant="default">Online</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Database</span>
                      <Badge variant="default">Healthy</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>API Response Time</span>
                      <span className="font-bold">245ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Storage Usage</span>
                      <span className="font-bold">67%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Offline Sync</span>
                      <Badge variant={pendingSyncCount === 0 ? "default" : "secondary"}>
                        {pendingSyncCount === 0 ? "Up to date" : `${pendingSyncCount} pending`}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Alerts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3 p-2 bg-secondary/10 rounded">
                      <AlertTriangle className="h-4 w-4 text-secondary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">High API usage detected</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-primary/10 rounded">
                      <Clock className="h-4 w-4 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Scheduled maintenance completed</p>
                        <p className="text-xs text-muted-foreground">6 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-destructive/10 rounded">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Database backup completed</p>
                        <p className="text-xs text-muted-foreground">12 hours ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeAdminTab === "settings" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">System Settings</h2>
                <Button size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>System Name</Label>
                      <Input defaultValue="Sehat Nabha - Rural Healthcare Platform" />
                    </div>
                    <div className="space-y-2">
                      <Label>Default Language</Label>
                      <Input defaultValue="Punjabi (ਪੰਜਾਬੀ)" />
                    </div>
                    <div className="space-y-2">
                      <Label>Emergency Contact</Label>
                      <Input defaultValue="+91 108 (Punjab Emergency)" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Feature Toggles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { feature: "Telemedicine", enabled: true },
                      { feature: "AI Symptom Checker", enabled: true },
                      { feature: "Medicine Delivery", enabled: false },
                      { feature: "Emergency Services", enabled: true },
                      { feature: "Health Records Sync", enabled: true },
                    ].map((toggle) => (
                      <div key={toggle.feature} className="flex items-center justify-between">
                        <span>{toggle.feature}</span>
                        <Badge variant={toggle.enabled ? "default" : "secondary"}>
                          {toggle.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    )
  }

  if (step === "dashboard" && user?.role === "pharmacist") {
    const lowStockCount = getLowStockMedicines().length
    const expiringCount = getExpiringMedicines().length
    const pendingOrders = prescriptionOrders.filter((order) => order.status === "pending").length
    const readyOrders = prescriptionOrders.filter((order) => order.status === "ready").length

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border p-4 sticky top-0 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Pill className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">{t.appName} - Pharmacy</h1>
                <p className="text-sm text-muted-foreground">
                  {user?.name} • {pendingOrders} pending orders
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <OfflineIndicator />
              {lowStockCount > 0 && (
                <Badge variant="destructive" className="flex items-center space-x-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span className="text-xs">{lowStockCount} Low Stock</span>
                </Badge>
              )}
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="bg-card border-b border-border p-2 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            {[
              { id: "dashboard", icon: BarChart3, label: "Dashboard" },
              { id: "inventory", icon: Pill, label: "Inventory" },
              { id: "prescriptions", icon: FileText, label: "Prescriptions" },
              { id: "orders", icon: Clock, label: "Orders" },
              { id: "suppliers", icon: Users, label: "Suppliers" },
              { id: "reports", icon: BarChart3, label: "Reports" },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activePharmacyTab === tab.id ? "default" : "ghost"}
                size="sm"
                className="flex items-center space-x-2 whitespace-nowrap"
                onClick={() => setActivePharmacyTab(tab.id as any)}
              >
                <tab.icon className="h-4 w-4" />
                <span className="text-sm">{tab.label}</span>
              </Button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="p-4">
          {activePharmacyTab === "dashboard" && (
            <div className="space-y-6">
              {!isOnline && (
                <Card className="border-secondary">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <WifiOff className="h-5 w-5 text-secondary" />
                      <div>
                        <p className="font-medium">Working Offline</p>
                        <p className="text-sm text-muted-foreground">
                          Inventory updates are saved locally and will sync when connection is restored.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Pill className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">{medicineInventory.length}</p>
                    <p className="text-sm text-muted-foreground">Total Medicines</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
                    <p className="text-2xl font-bold">{lowStockCount}</p>
                    <p className="text-sm text-muted-foreground">Low Stock</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="h-8 w-8 text-secondary mx-auto mb-2" />
                    <p className="text-2xl font-bold">{pendingOrders}</p>
                    <p className="text-sm text-muted-foreground">Pending Orders</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">{readyOrders}</p>
                    <p className="text-sm text-muted-foreground">Ready for Pickup</p>
                  </CardContent>
                </Card>
              </div>

              {/* Alerts */}
              {(lowStockCount > 0 || expiringCount > 0) && (
                <Card className="border-destructive">
                  <CardHeader>
                    <CardTitle className="text-destructive flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5" />
                      <span>Alerts</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {lowStockCount > 0 && (
                      <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                        <div>
                          <p className="font-medium text-destructive">{lowStockCount} medicines below minimum stock</p>
                          <p className="text-sm text-muted-foreground">Reorder required immediately</p>
                        </div>
                        <Button size="sm" onClick={() => setActivePharmacyTab("inventory")}>
                          View Details
                        </Button>
                      </div>
                    )}
                    {expiringCount > 0 && (
                      <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
                        <div>
                          <p className="font-medium text-secondary">{expiringCount} medicines expiring soon</p>
                          <p className="text-sm text-muted-foreground">Within next 3 months</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => setActivePharmacyTab("inventory")}>
                          Check Expiry
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Prescription Orders</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {prescriptionOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{order.patientName}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.medicines.length} medicines • Dr. {order.doctorName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            order.status === "pending" ? "secondary" : order.status === "ready" ? "default" : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                        {order.priority === "urgent" && (
                          <Badge variant="destructive" className="text-xs">
                            Urgent
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {activePharmacyTab === "inventory" && (
            <div className="space-y-6 animate-fadeInUp">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold gradient-text">Medicine Inventory</h2>
                <div className="flex space-x-4">
                  <Input placeholder="Search medicines..." className="w-80 h-12 text-lg" />
                  <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-6 h-12">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Medicine
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Medicine List */}
                <div className="lg:col-span-3 space-y-4">
                  {medicineInventory.map((medicine, index) => {
                    const isLowStock = medicine.quantity <= medicine.minStockLevel
                    const isExpiringSoon = getExpiringMedicines().some((m) => m.id === medicine.id)

                    return (
                      <Card 
                        key={medicine.id} 
                        className={`${
                          isLowStock 
                            ? "border-red-500 bg-gradient-to-br from-red-50 to-orange-50" 
                            : isExpiringSoon
                              ? "border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50"
                              : "bg-gradient-to-br from-emerald-50 to-blue-50"
                        } border-0 shadow-lg hover:shadow-xl transition-all duration-300`}
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animation: 'fadeInUp 0.6s ease-out forwards'
                        }}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                                isLowStock 
                                  ? "bg-gradient-to-br from-red-500 to-orange-500" 
                                  : isExpiringSoon
                                    ? "bg-gradient-to-br from-yellow-500 to-orange-500"
                                    : "bg-gradient-to-br from-emerald-500 to-blue-500"
                              }`}>
                                <Pill className="h-8 w-8 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <p className="font-semibold text-lg text-gray-800">{medicine.name}</p>
                                  {isLowStock && (
                                    <Badge className="bg-red-100 text-red-700">
                                      Low Stock
                                    </Badge>
                                  )}
                                  {isExpiringSoon && (
                                    <Badge className="bg-yellow-100 text-yellow-700">
                                      Expiring Soon
                                    </Badge>
                                  )}
                                  {medicine.prescription && (
                                    <Badge className="bg-blue-100 text-blue-700">
                                      Rx Required
                                    </Badge>
                                  )}
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-gray-600">
                                    <span className="font-semibold">Generic:</span> {medicine.genericName} • 
                                    <span className="font-semibold ml-2">Manufacturer:</span> {medicine.manufacturer}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-semibold">Batch:</span> {medicine.batchNumber} • 
                                    <span className="font-semibold ml-2">Expires:</span> {medicine.expiryDate}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-semibold">Category:</span> {medicine.category} • 
                                    <span className="font-semibold ml-2">Dosage:</span> {medicine.dosage}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="text-right space-y-3">
                              <div className="flex items-center space-x-6">
                                <div className="text-center">
                                  <p className="text-2xl font-bold text-gray-800">{medicine.quantity}</p>
                                  <p className="text-sm text-gray-600 font-semibold">In Stock</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-2xl font-bold text-emerald-600">₹{medicine.price}</p>
                                  <p className="text-sm text-gray-600 font-semibold">Per Unit</p>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const newQuantity = prompt(
                                      `Update stock for ${medicine.name}:`,
                                      medicine.quantity.toString(),
                                    )
                                    if (newQuantity && !isNaN(Number(newQuantity))) {
                                      updateMedicineStock(medicine.id, Number(newQuantity))
                                    }
                                  }}
                                  className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white"
                                >
                                  Update Stock
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Inventory Stats */}
                <div className="space-y-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">Inventory Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-emerald-600">{medicineInventory.length}</div>
                        <div className="text-sm text-gray-600">Total Medicines</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-red-600">{lowStockCount}</div>
                        <div className="text-sm text-gray-600">Low Stock</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-yellow-600">{expiringCount}</div>
                        <div className="text-sm text-gray-600">Expiring Soon</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-pink-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full justify-start bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Medicine
                      </Button>
                      <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                        <Search className="h-4 w-4 mr-2" />
                        Search Inventory
                      </Button>
                      <Button className="w-full justify-start bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activePharmacyTab === "prescriptions" && (
            <div className="space-y-6 animate-fadeInUp">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold gradient-text">Prescription Orders</h2>
                <div className="flex space-x-4">
                  <Badge className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-2 text-lg">
                    {prescriptionOrders.length} total orders
                  </Badge>
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 text-lg">
                    {prescriptionOrders.filter(o => o.priority === "urgent").length} urgent
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Prescription Orders */}
                <div className="lg:col-span-3 space-y-4">
                  {prescriptionOrders.map((order, index) => (
                    <Card 
                      key={order.id} 
                      className={`${
                        order.priority === "urgent" 
                          ? "border-red-500 bg-gradient-to-br from-red-50 to-orange-50" 
                          : "bg-gradient-to-br from-emerald-50 to-blue-50"
                      } border-0 shadow-lg hover:shadow-xl transition-all duration-300`}
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'fadeInUp 0.6s ease-out forwards'
                      }}
                    >
                      <CardContent className="p-6">
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-16 w-16">
                                <AvatarFallback className={`${
                                  order.priority === "urgent" 
                                    ? "bg-gradient-to-br from-red-500 to-orange-500" 
                                    : "bg-gradient-to-br from-emerald-500 to-blue-500"
                                } text-white font-bold text-lg`}>
                                  {order.patientName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-lg text-gray-800">{order.patientName}</p>
                                <p className="text-sm text-gray-600">
                                  Prescribed by Dr. {order.doctorName} • {order.orderDate}
                                </p>
                                <p className="text-xs text-gray-500">Order ID: {order.id}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge
                                className={`${
                                  order.status === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : order.status === "processing"
                                      ? "bg-blue-100 text-blue-700"
                                      : order.status === "ready"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {order.status}
                              </Badge>
                              {order.priority === "urgent" && (
                                <Badge className="bg-red-100 text-red-700">
                                  ⚠️ Urgent
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label className="text-lg font-semibold text-gray-700">Prescribed Medicines:</Label>
                            <div className="space-y-2">
                              {order.medicines.map((medicine, medIndex) => (
                                <div key={medIndex} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-emerald-200">
                                  <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{medicine.medicineName}</p>
                                    <p className="text-sm text-gray-600">
                                      <span className="font-semibold">Dosage:</span> {medicine.dosage} • 
                                      <span className="font-semibold ml-2">Qty:</span> {medicine.quantity} • 
                                      <span className="font-semibold ml-2">Instructions:</span> {medicine.instructions}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    {medicineInventory.find((m) => m.id === medicine.medicineId)?.quantity ||
                                    0 >= medicine.quantity ? (
                                      <Badge className="bg-emerald-100 text-emerald-700">
                                        ✅ Available
                                      </Badge>
                                    ) : (
                                      <Badge className="bg-red-100 text-red-700">
                                        ❌ Out of Stock
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex space-x-3">
                            {order.status === "pending" && (
                              <Button 
                                size="lg" 
                                onClick={() => updatePrescriptionStatus(order.id, "processing")}
                                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white"
                              >
                                Start Processing
                              </Button>
                            )}
                            {order.status === "processing" && (
                              <Button 
                                size="lg" 
                                onClick={() => updatePrescriptionStatus(order.id, "ready")}
                                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                              >
                                Mark Ready
                              </Button>
                            )}
                            {order.status === "ready" && (
                              <Button 
                                size="lg" 
                                onClick={() => updatePrescriptionStatus(order.id, "dispensed")}
                                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                              >
                                Mark Dispensed
                              </Button>
                            )}
                            <Button size="lg" variant="outline" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                              <FileText className="h-4 w-4 mr-2" />
                              Print Label
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Order Stats */}
                <div className="space-y-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">Order Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-emerald-600">
                          {prescriptionOrders.filter(o => o.status === "pending").length}
                        </div>
                        <div className="text-sm text-gray-600">Pending</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-blue-600">
                          {prescriptionOrders.filter(o => o.status === "processing").length}
                        </div>
                        <div className="text-sm text-gray-600">Processing</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-purple-600">
                          {prescriptionOrders.filter(o => o.status === "ready").length}
                        </div>
                        <div className="text-sm text-gray-600">Ready</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-pink-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full justify-start bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white">
                        <FileText className="h-4 w-4 mr-2" />
                        Process All Pending
                      </Button>
                      <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                        <Search className="h-4 w-4 mr-2" />
                        Search Orders
                      </Button>
                      <Button className="w-full justify-start bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activePharmacyTab === "orders" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Order Management</h2>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Order
                </Button>
              </div>

              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Reorder Required</CardTitle>
                    <CardDescription>Medicines below minimum stock level</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {getLowStockMedicines().map((medicine) => (
                        <div key={medicine.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{medicine.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Current: {medicine.quantity} • Min: {medicine.minStockLevel}
                            </p>
                          </div>
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Reorder
                          </Button>
                        </div>
                      ))}
                      {getLowStockMedicines().length === 0 && (
                        <p className="text-center text-muted-foreground py-4">All medicines are adequately stocked</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activePharmacyTab === "suppliers" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Suppliers</h2>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Supplier
                </Button>
              </div>

              <div className="grid gap-4">
                {[
                  { name: "Sun Pharma Distributors", contact: "+91 98765 43210", medicines: 45, rating: "4.8" },
                  { name: "Cipla Medical Supply", contact: "+91 87654 32109", medicines: 32, rating: "4.6" },
                  { name: "Dr. Reddy's Regional", contact: "+91 76543 21098", medicines: 28, rating: "4.9" },
                ].map((supplier, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>
                              {supplier.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{supplier.name}</p>
                            <p className="text-sm text-muted-foreground">{supplier.contact}</p>
                            <p className="text-sm text-muted-foreground">
                              {supplier.medicines} medicines • ★ {supplier.rating}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4 mr-2" />
                            Contact
                          </Button>
                          <Button size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            Order
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activePharmacyTab === "reports" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Reports & Analytics</h2>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Today's Sales</span>
                      <span className="font-bold">₹2,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span>This Week</span>
                      <span className="font-bold">₹18,200</span>
                    </div>
                    <div className="flex justify-between">
                      <span>This Month</span>
                      <span className="font-bold">₹75,600</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Selling Medicines</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { name: "Paracetamol 500mg", sold: 45, revenue: "₹112" },
                      { name: "Metformin 500mg", sold: 32, revenue: "₹102" },
                      { name: "Amoxicillin 250mg", sold: 18, revenue: "₹144" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.sold} units sold</p>
                        </div>
                        <span className="font-bold">{item.revenue}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    )
  }

  if (step === "dashboard" && user?.role === "doctor") {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border p-4 sticky top-0 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Stethoscope className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">{t.appName} - Doctor</h1>
                <p className="text-sm text-muted-foreground">
                  Dr. {user?.name} • {patientQueue.filter((p) => p.status === "waiting").length} patients waiting
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <OfflineIndicator />
              {isInConsultation && (
                <Badge variant="destructive" className="flex items-center space-x-1">
                  <Video className="h-3 w-3" />
                  <span className="text-xs">In Consultation</span>
                </Badge>
              )}
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="bg-card border-b border-border p-2 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            {[
              { id: "dashboard", icon: BarChart3, label: "Dashboard" },
              { id: "queue", icon: Users, label: "Patient Queue" },
              { id: "consultation", icon: Video, label: "Consultation" },
              { id: "prescriptions", icon: Clipboard, label: "Prescriptions" },
              { id: "patients", icon: FileText, label: "Patient Records" },
              { id: "schedule", icon: CalendarIcon, label: "Schedule" },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeDoctorTab === tab.id ? "default" : "ghost"}
                size="sm"
                className="flex items-center space-x-2 whitespace-nowrap"
                onClick={() => setActiveDoctorTab(tab.id as any)}
              >
                <tab.icon className="h-4 w-4" />
                <span className="text-sm">{tab.label}</span>
              </Button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="p-4">
          {activeDoctorTab === "dashboard" && (
            <div className="space-y-6 animate-fadeInUp">
              <h2 className="text-3xl font-bold gradient-text">Doctor Dashboard</h2>
              
              {!isOnline && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <WifiOff className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-medium text-orange-800">Working Offline</p>
                        <p className="text-sm text-orange-700">
                          Consultation notes and prescriptions are saved locally and will sync when connection is restored.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-emerald-600">{patientQueue.filter((p) => p.status === "waiting").length}</p>
                    <p className="text-sm text-gray-600 font-semibold">Patients Waiting</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Video className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{patientQueue.filter((p) => p.status === "completed").length}</p>
                    <p className="text-sm text-gray-600 font-semibold">Completed Today</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <AlertTriangle className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-red-600">{patientQueue.filter((p) => p.priority === "high").length}</p>
                    <p className="text-sm text-gray-600 font-semibold">Urgent Cases</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-purple-600">2.5h</p>
                    <p className="text-sm text-gray-600 font-semibold">Avg. Wait Time</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Next Patient */}
                <div className="lg:col-span-2">
                  {patientQueue.filter((p) => p.status === "waiting").length > 0 && (
                    <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-xl font-bold text-gray-800">Next Patient</CardTitle>
                        <p className="text-gray-600">Ready for consultation</p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-16 w-16">
                              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-blue-500 text-white font-bold text-lg">
                                {patientQueue[0].name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-lg text-gray-800">{patientQueue[0].name}</p>
                              <p className="text-sm text-gray-600">
                                Age {patientQueue[0].age} • {patientQueue[0].appointmentTime}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">{patientQueue[0].symptoms}</p>
                              <Badge className="mt-2 bg-emerald-100 text-emerald-700">
                                {patientQueue[0].priority} Priority
                              </Badge>
                            </div>
                          </div>
                          <Button 
                            onClick={() => startConsultation(patientQueue[0])}
                            className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                          >
                            <Video className="h-5 w-5 mr-2" />
                            Start Consultation
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full justify-start bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white">
                        <Video className="h-4 w-4 mr-2" />
                        Start Consultation
                      </Button>
                      <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                        <Clipboard className="h-4 w-4 mr-2" />
                        Write Prescription
                      </Button>
                      <Button className="w-full justify-start bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                        <FileText className="h-4 w-4 mr-2" />
                        View Records
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-pink-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">Today's Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Consultations</span>
                        <span className="font-semibold text-orange-600">24</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Prescriptions Written</span>
                        <span className="font-semibold text-orange-600">18</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Follow-ups Scheduled</span>
                        <span className="font-semibold text-orange-600">6</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Emergency Cases</span>
                        <span className="font-semibold text-red-600">2</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Recent Activity */}
              <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-800">Today's Activity</CardTitle>
                  <p className="text-gray-600">Recent consultations and activities</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border-l-4 border-emerald-500">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Video className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">Consultation with Rajesh Kumar</p>
                      <p className="text-sm text-gray-600">Completed • 9:30 AM • Duration: 25 minutes</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700">Completed</Badge>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clipboard className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">Prescription sent to Priya Singh</p>
                      <p className="text-sm text-gray-600">10:15 AM • 3 medications prescribed</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">Sent</Badge>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border-l-4 border-purple-500">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">Medical records updated for Amit Patel</p>
                      <p className="text-sm text-gray-600">11:45 AM • Follow-up scheduled</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700">Updated</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeDoctorTab === "queue" && (
            <div className="space-y-6 animate-fadeInUp">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold gradient-text">Patient Queue</h2>
                <div className="flex space-x-4">
                  <Badge className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-2 text-lg">
                    {patientQueue.length} patients
                  </Badge>
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 text-lg">
                    {patientQueue.filter(p => p.priority === "high").length} urgent
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Patient List */}
                <div className="lg:col-span-3 space-y-4">
                  {patientQueue.map((patient, index) => (
                    <Card 
                      key={patient.id} 
                      className={`${
                        patient.priority === "high" 
                          ? "border-red-500 bg-gradient-to-br from-red-50 to-orange-50" 
                          : "bg-gradient-to-br from-emerald-50 to-blue-50"
                      } border-0 shadow-lg hover:shadow-xl transition-all duration-300`}
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'fadeInUp 0.6s ease-out forwards'
                      }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-16 w-16">
                              <AvatarFallback className={`${
                                patient.priority === "high" 
                                  ? "bg-gradient-to-br from-red-500 to-orange-500" 
                                  : "bg-gradient-to-br from-emerald-500 to-blue-500"
                              } text-white font-bold text-lg`}>
                                {patient.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <p className="font-semibold text-lg text-gray-800">{patient.name}</p>
                                <Badge
                                  className={`${
                                    patient.priority === "high"
                                      ? "bg-red-100 text-red-700"
                                      : patient.priority === "medium"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-emerald-100 text-emerald-700"
                                  }`}
                                >
                                  {patient.priority}
                                </Badge>
                                <Badge 
                                  className={`${
                                    patient.status === "waiting"
                                      ? "bg-blue-100 text-blue-700"
                                      : patient.status === "in-consultation"
                                        ? "bg-purple-100 text-purple-700"
                                        : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {patient.status}
                                </Badge>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-gray-600">
                                  <span className="font-semibold">Age:</span> {patient.age} • 
                                  <span className="font-semibold ml-2">Time:</span> {patient.appointmentTime}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-semibold">Symptoms:</span> {patient.symptoms}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-semibold">Wait Time:</span> 15 minutes
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                                <FileText className="h-4 w-4 mr-2" />
                                Records
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => startConsultation(patient)}
                                disabled={patient.status !== "waiting"}
                                className={`${
                                  patient.priority === "high"
                                    ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                                    : "bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                                } text-white font-semibold`}
                              >
                                <Video className="h-4 w-4 mr-2" />
                                {patient.status === "waiting" ? "Start" : "View"}
                              </Button>
                            </div>
                            {patient.priority === "high" && (
                              <Badge className="bg-red-100 text-red-700 text-center">
                                ⚠️ Urgent Case
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Queue Stats */}
                <div className="space-y-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">Queue Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-emerald-600">
                          {patientQueue.filter(p => p.status === "waiting").length}
                        </div>
                        <div className="text-sm text-gray-600">Waiting</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-blue-600">
                          {patientQueue.filter(p => p.status === "in-consultation").length}
                        </div>
                        <div className="text-sm text-gray-600">In Consultation</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-red-600">
                          {patientQueue.filter(p => p.priority === "high").length}
                        </div>
                        <div className="text-sm text-gray-600">Urgent</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-pink-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full justify-start bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white">
                        <Users className="h-4 w-4 mr-2" />
                        View All Patients
                      </Button>
                      <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                        <Clock className="h-4 w-4 mr-2" />
                        Schedule Management
                      </Button>
                      <Button className="w-full justify-start bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Emergency Queue
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeDoctorTab === "consultation" && (
            <div className="space-y-6 animate-fadeInUp">
              <h2 className="text-3xl font-bold gradient-text">Live Consultation</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Video Consultation */}
                <div className="lg:col-span-2">
                  <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-800">Video Consultation</CardTitle>
                      <p className="text-gray-600">Connect with your patients in real-time</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {isInConsultation ? (
                        <div className="space-y-4">
                          <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                            <div className="text-center text-white">
                              <Video className="h-16 w-16 mx-auto mb-4" />
                              <p className="text-lg font-semibold">Live Consultation</p>
                              <p className="text-sm text-gray-400">Patient: {currentPatient?.name}</p>
                            </div>
                          </div>
                          <div className="flex justify-center space-x-4">
                            <Button className="bg-red-500 hover:bg-red-600 text-white">
                              <Phone className="h-4 w-4 mr-2" />
                              End Call
                            </Button>
                            <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                              <Mic className="h-4 w-4 mr-2" />
                              Mute
                            </Button>
                            <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                              <Video className="h-4 w-4 mr-2" />
                              Camera
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                            <Video className="h-12 w-12 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Active Consultation</h3>
                          <p className="text-gray-600 mb-6">Start a consultation from the patient queue</p>
                          <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white">
                            <Video className="h-4 w-4 mr-2" />
                            Start Consultation
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Consultation Tools */}
                <div className="space-y-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">Consultation Tools</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full justify-start bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white">
                        <Clipboard className="h-4 w-4 mr-2" />
                        Take Notes
                      </Button>
                      <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                        <FileText className="h-4 w-4 mr-2" />
                        View Records
                      </Button>
                      <Button className="w-full justify-start bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                        <Pill className="h-4 w-4 mr-2" />
                        Prescribe Medicine
                      </Button>
                      <Button className="w-full justify-start bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Follow-up
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-pink-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">Quick Notes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Symptoms</Label>
                        <Input placeholder="Enter symptoms..." className="h-10" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Diagnosis</Label>
                        <Input placeholder="Enter diagnosis..." className="h-10" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Treatment Plan</Label>
                        <Input placeholder="Enter treatment..." className="h-10" />
                      </div>
                      <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white">
                        Save Notes
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeDoctorTab === "prescriptions" && (
            <div className="space-y-6 animate-fadeInUp">
              <h2 className="text-3xl font-bold gradient-text">Prescriptions</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Prescription List */}
                <div className="lg:col-span-2 space-y-4">
                  <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-800">Recent Prescriptions</CardTitle>
                      <p className="text-gray-600">Manage and track patient prescriptions</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-emerald-500">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-800">Rajesh Kumar</h3>
                              <p className="text-sm text-gray-600">Age: 45 • ID: P001</p>
                              <p className="text-sm text-gray-600 mt-1">Prescribed: Paracetamol, Amoxicillin, Omeprazole</p>
                              <p className="text-xs text-gray-500">15 December 2024 • 9:30 AM</p>
                            </div>
                            <Badge className="bg-emerald-100 text-emerald-700">Completed</Badge>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-800">Priya Singh</h3>
                              <p className="text-sm text-gray-600">Age: 32 • ID: P002</p>
                              <p className="text-sm text-gray-600 mt-1">Prescribed: Metformin, Lisinopril</p>
                              <p className="text-xs text-gray-500">15 December 2024 • 10:15 AM</p>
                            </div>
                            <Badge className="bg-blue-100 text-blue-700">Sent</Badge>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-purple-500">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-800">Amit Patel</h3>
                              <p className="text-sm text-gray-600">Age: 28 • ID: P003</p>
                              <p className="text-sm text-gray-600 mt-1">Prescribed: Ibuprofen, Vitamin D</p>
                              <p className="text-xs text-gray-500">15 December 2024 • 11:45 AM</p>
                            </div>
                            <Badge className="bg-purple-100 text-purple-700">Pending</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Prescription Tools */}
                <div className="space-y-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full justify-start bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        New Prescription
                      </Button>
                      <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                        <Search className="h-4 w-4 mr-2" />
                        Search Medicines
                      </Button>
                      <Button className="w-full justify-start bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                        <FileText className="h-4 w-4 mr-2" />
                        View Templates
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-pink-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">Today's Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Prescriptions Written</span>
                        <span className="font-semibold text-orange-600">18</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Pending Approval</span>
                        <span className="font-semibold text-orange-600">3</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Digital Signatures</span>
                        <span className="font-semibold text-orange-600">15</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeDoctorTab === "patients" && (
            <div className="space-y-6 animate-fadeInUp">
              <h2 className="text-3xl font-bold gradient-text">Patient Records</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Patient List */}
                <div className="lg:col-span-2 space-y-4">
                  <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-800">Patient Database</CardTitle>
                      <p className="text-gray-600">Access and manage patient medical records</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex space-x-2">
                        <Input placeholder="Search patients..." className="flex-1 h-12 text-lg" />
                        <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-6">
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="p-4 bg-white rounded-lg shadow-sm border border-emerald-200 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-blue-500 text-white font-bold">
                                  RK
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-gray-800">Rajesh Kumar</h3>
                                <p className="text-sm text-gray-600">Age: 45 • Male • ID: P001</p>
                                <p className="text-sm text-gray-600">Last Visit: 15 Dec 2024</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                                <FileText className="h-4 w-4 mr-2" />
                                Records
                              </Button>
                              <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white rounded-lg shadow-sm border border-blue-200 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                                  PS
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-gray-800">Priya Singh</h3>
                                <p className="text-sm text-gray-600">Age: 32 • Female • ID: P002</p>
                                <p className="text-sm text-gray-600">Last Visit: 15 Dec 2024</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                                <FileText className="h-4 w-4 mr-2" />
                                Records
                              </Button>
                              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white rounded-lg shadow-sm border border-purple-200 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
                                  AP
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-gray-800">Amit Patel</h3>
                                <p className="text-sm text-gray-600">Age: 28 • Male • ID: P003</p>
                                <p className="text-sm text-gray-600">Last Visit: 15 Dec 2024</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                                <FileText className="h-4 w-4 mr-2" />
                                Records
                              </Button>
                              <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">Patient Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-emerald-600">156</div>
                        <div className="text-sm text-gray-600">Total Patients</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-blue-600">24</div>
                        <div className="text-sm text-gray-600">Today's Visits</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-purple-600">8</div>
                        <div className="text-sm text-gray-600">New Patients</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-pink-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full justify-start bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Patient
                      </Button>
                      <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                      <Button className="w-full justify-start bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeDoctorTab === "schedule" && (
            <div className="space-y-6 animate-fadeInUp">
              <h2 className="text-3xl font-bold gradient-text">Schedule Management</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Schedule Calendar */}
                <div className="lg:col-span-2">
                  <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-800">Today's Schedule</CardTitle>
                      <p className="text-gray-600">Manage your appointments and availability</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-emerald-500">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold text-gray-800">Morning Session</h3>
                              <p className="text-sm text-gray-600">9:00 AM - 12:00 PM</p>
                              <p className="text-sm text-gray-600">8 patients scheduled</p>
                            </div>
                            <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold text-gray-800">Afternoon Session</h3>
                              <p className="text-sm text-gray-600">2:00 PM - 5:00 PM</p>
                              <p className="text-sm text-gray-600">6 patients scheduled</p>
                            </div>
                            <Badge className="bg-blue-100 text-blue-700">Upcoming</Badge>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-purple-500">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold text-gray-800">Evening Session</h3>
                              <p className="text-sm text-gray-600">6:00 PM - 8:00 PM</p>
                              <p className="text-sm text-gray-600">4 patients scheduled</p>
                            </div>
                            <Badge className="bg-purple-100 text-purple-700">Scheduled</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Schedule Tools */}
                <div className="space-y-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full justify-start bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white">
                        <Calendar className="h-4 w-4 mr-2" />
                        Add Appointment
                      </Button>
                      <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                        <Clock className="h-4 w-4 mr-2" />
                        Set Availability
                      </Button>
                      <Button className="w-full justify-start bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                        <Users className="h-4 w-4 mr-2" />
                        View Patients
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-pink-50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800">Today's Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Appointments</span>
                        <span className="font-semibold text-orange-600">18</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Completed</span>
                        <span className="font-semibold text-orange-600">8</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Upcoming</span>
                        <span className="font-semibold text-orange-600">10</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Cancelled</span>
                        <span className="font-semibold text-red-600">2</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Add other doctor tabs content here */}
        </main>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 ${
        fontSize === "large" ? "text-lg" : fontSize === "small" ? "text-sm" : ""
      } ${highContrast ? "bg-black text-white" : ""}`}
    >
      <AccessibilityControls />

      {screenReaderMode && (
        <div className="sr-only" aria-live="polite" id="screen-reader-announcements">
          Current page: {activePatientTab || activeDoctorTab || activePharmacyTab || "dashboard"}
        </div>
      )}

      {/* Add other doctor tabs content here */}
    </div>
  )
}