# 🏥 Sehat Nabha - Rural Healthcare Platform

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/rajivdey2s-projects/v0-rural-healthcare-app)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> **Sehat Nabha** (ਸਿਹਤ ਨਭਾ / सेहत नभा) - A comprehensive digital healthcare platform designed specifically for rural communities in Punjab, India. The name translates to "Health Sky" in Punjabi, symbolizing our vision of accessible healthcare for everyone.

## 🌟 What is Sehat Nabha?

Sehat Nabha is a modern, multilingual healthcare platform that bridges the gap between rural communities and quality healthcare services. Built with accessibility and offline-first capabilities, it ensures that healthcare remains accessible even in areas with limited internet connectivity.

### 🎯 Key Features

#### 🏥 **Multi-Role Healthcare Platform**
- **Patients**: Access health records, book consultations, find medicines
- **Doctors**: Manage patient queue, conduct telemedicine sessions, write prescriptions
- **Pharmacists**: Manage inventory, process orders, track medicine availability
- **Administrators**: Monitor system analytics, manage users, oversee operations

#### 🌐 **Multilingual Support**
- **English** - For healthcare professionals and urban users
- **हिंदी (Hindi)** - Widely spoken across India
- **ਪੰਜਾਬੀ (Punjabi)** - Native language of Punjab region

#### ♿ **Accessibility First**
- **High Contrast Mode** - Better visibility for visually impaired users
- **Adjustable Text Size** - Customizable font sizes (12px - 24px)
- **Voice Input/Output** - Speech-to-text and text-to-speech capabilities
- **Screen Reader Support** - Full compatibility with assistive technologies
- **Keyboard Navigation** - Complete keyboard accessibility
- **Large Buttons** - Touch-friendly interface for elderly users
- **Reduced Motion** - Respects user's motion sensitivity preferences

#### 📱 **Offline-First Architecture**
- **Local Data Storage** - Critical data saved locally using IndexedDB
- **Background Sync** - Automatic data synchronization when online
- **Offline Indicators** - Clear status of connection and sync state
- **Queue Management** - Pending operations queued for later sync
- **Critical Data Caching** - Essential information always available

#### 🚨 **Emergency Features**
- **Emergency Contacts** - Quick access to ambulance and emergency services
- **Urgent Help** - One-tap emergency assistance
- **Critical Health Alerts** - Important health condition notifications

#### 💊 **Healthcare-Specific Features**
- **Telemedicine** - Video consultations with healthcare providers
- **Prescription Management** - Digital prescriptions with pharmacy integration
- **Symptom Checker** - AI-assisted symptom analysis
- **Medicine Finder** - Locate nearby pharmacies and medicine availability
- **Health Records** - Comprehensive medical history tracking
- **Appointment Booking** - Easy scheduling with healthcare providers

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful, customizable icons

### State Management & Data
- **React Hooks** - Modern state management
- **IndexedDB** - Client-side database for offline storage
- **Local Storage** - User preferences and settings
- **Background Sync** - Automatic data synchronization

### Accessibility & Internationalization
- **ARIA Compliance** - Full accessibility support
- **Multi-language Support** - English, Hindi, Punjabi
- **Responsive Design** - Mobile-first approach
- **Progressive Web App** - Installable and offline-capable

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Modern web browser with IndexedDB support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/sehat-nabha.git
   cd sehat-nabha
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## 📱 How to Use

### For Patients
1. **Select your language** (English/Hindi/Punjabi)
2. **Enter your phone number** for OTP verification
3. **Choose your role** as "Patient"
4. **Access your dashboard** with:
   - Health records and medical history
   - Book consultations with doctors
   - Find medicines and pharmacies
   - Emergency contacts and urgent help
   - Symptom checker for self-assessment

### For Healthcare Providers
1. **Complete authentication** with your credentials
2. **Access your role-specific dashboard**:
   - **Doctors**: Patient queue, consultations, prescriptions
   - **Pharmacists**: Inventory, orders, medicine tracking
   - **Admins**: Analytics, user management, system monitoring

### Accessibility Features
- **Adjust text size** using the A+ / A- buttons
- **Enable high contrast** for better visibility
- **Use voice input** for hands-free interaction
- **Navigate with keyboard** using Tab and arrow keys
- **Enable screen reader mode** for assistive technologies

## 🌍 Offline Capabilities

Sehat Nabha works seamlessly offline:

- **Data is saved locally** when you're offline
- **Automatic sync** when connection is restored
- **Clear indicators** show your connection status
- **Critical features** remain available without internet
- **Background sync** handles data updates automatically

## 🎨 Customization

### Language Support
The app supports three languages with full translations:
- English (`en`)
- Hindi (`hi`) 
- Punjabi (`pa`)

### Accessibility Settings
All accessibility features can be customized:
- Font size adjustment (12px - 24px)
- High contrast mode
- Voice input/output
- Screen reader compatibility
- Keyboard navigation
- Large button mode
- Reduced motion preferences

## 🤝 Contributing

We welcome contributions to make Sehat Nabha better for rural healthcare!

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Areas for Contribution
- **Accessibility improvements**
- **Additional language support**
- **Healthcare feature enhancements**
- **Offline functionality improvements**
- **UI/UX enhancements**
- **Documentation and translations**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Rural Healthcare Workers** - For their dedication and feedback
- **Punjab Community** - For embracing digital healthcare solutions
- **Open Source Community** - For the amazing tools and libraries
- **Accessibility Advocates** - For ensuring inclusive design

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/sehat-nabha/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/sehat-nabha/discussions)
- **Email**: support@sehatnabha.com

## 🌟 Vision

Our vision is to make quality healthcare accessible to every rural community in Punjab and beyond. Sehat Nabha is more than just an app - it's a bridge connecting communities to better health outcomes.

---

**Made with ❤️ for rural healthcare in Punjab, India**

*Sehat Nabha - Where technology meets compassion*
