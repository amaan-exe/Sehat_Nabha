"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { Type, Contrast, Volume2, Keyboard, Eye, Mic, Languages } from "lucide-react"
import { type Language, getTranslation } from "@/lib/translations"

interface AccessibilitySettings {
  fontSize: number
  highContrast: boolean
  voiceEnabled: boolean
  keyboardNavigation: boolean
  screenReaderMode: boolean
  language: Language
  reducedMotion: boolean
  largeButtons: boolean
}

interface AccessibilityControlsProps {
  language: Language
  onLanguageChange: (language: Language) => void
  onSettingsChange?: (settings: AccessibilitySettings) => void
}

export function AccessibilityControls({ language, onLanguageChange, onSettingsChange }: AccessibilityControlsProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 16,
    highContrast: false,
    voiceEnabled: false,
    keyboardNavigation: false,
    screenReaderMode: false,
    language: language,
    reducedMotion: false,
    largeButtons: false,
  })

  const t = getTranslation(language)

  useEffect(() => {
    // Load accessibility settings from localStorage
    const savedSettings = localStorage.getItem("accessibility-settings")
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      setSettings((prev) => ({ ...prev, ...parsed, language }))
    }
  }, [language])

  useEffect(() => {
    // Apply accessibility settings to document
    const root = document.documentElement

    // Font size
    root.style.setProperty("--accessibility-font-size", `${settings.fontSize}px`)

    // High contrast
    if (settings.highContrast) {
      root.classList.add("high-contrast")
    } else {
      root.classList.remove("high-contrast")
    }

    // Large buttons
    if (settings.largeButtons) {
      root.classList.add("large-buttons")
    } else {
      root.classList.remove("large-buttons")
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add("reduced-motion")
    } else {
      root.classList.remove("reduced-motion")
    }

    // Screen reader mode
    if (settings.screenReaderMode) {
      root.classList.add("screen-reader-mode")
    } else {
      root.classList.remove("screen-reader-mode")
    }

    // Save settings
    localStorage.setItem("accessibility-settings", JSON.stringify(settings))

    // Notify parent component
    if (onSettingsChange) {
      onSettingsChange(settings)
    }
  }, [settings, onSettingsChange])

  const updateSetting = <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const speakText = (text: string) => {
    if (settings.voiceEnabled && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-US"
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Eye className="h-5 w-5" />
          <span>Accessibility Settings</span>
        </CardTitle>
        <CardDescription>Customize the app for better accessibility and usability</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Language Selection */}
        <div className="space-y-3">
          <Label className="flex items-center space-x-2">
            <Languages className="h-4 w-4" />
            <span>{t.selectLanguage}</span>
          </Label>
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
              <SelectItem value="pa">ਪੰਜਾਬੀ (Punjabi)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Font Size */}
        <div className="space-y-3">
          <Label className="flex items-center space-x-2">
            <Type className="h-4 w-4" />
            <span>Text Size: {settings.fontSize}px</span>
          </Label>
          <Slider
            value={[settings.fontSize]}
            onValueChange={([value]) => updateSetting("fontSize", value)}
            min={12}
            max={24}
            step={1}
            className="w-full"
          />
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateSetting("fontSize", Math.max(12, settings.fontSize - 2))}
            >
              A-
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateSetting("fontSize", Math.min(24, settings.fontSize + 2))}
            >
              A+
            </Button>
          </div>
        </div>

        {/* High Contrast */}
        <div className="flex items-center justify-between">
          <Label className="flex items-center space-x-2">
            <Contrast className="h-4 w-4" />
            <span>{t.highContrast}</span>
          </Label>
          <Switch
            checked={settings.highContrast}
            onCheckedChange={(checked) => updateSetting("highContrast", checked)}
          />
        </div>

        {/* Voice Features */}
        <div className="flex items-center justify-between">
          <Label className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4" />
            <span>{t.voiceInput}</span>
          </Label>
          <Switch
            checked={settings.voiceEnabled}
            onCheckedChange={(checked) => updateSetting("voiceEnabled", checked)}
          />
        </div>

        {/* Screen Reader Mode */}
        <div className="flex items-center justify-between">
          <Label className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>{t.screenReader}</span>
          </Label>
          <Switch
            checked={settings.screenReaderMode}
            onCheckedChange={(checked) => updateSetting("screenReaderMode", checked)}
          />
        </div>

        {/* Keyboard Navigation */}
        <div className="flex items-center justify-between">
          <Label className="flex items-center space-x-2">
            <Keyboard className="h-4 w-4" />
            <span>{t.keyboardNavigation}</span>
          </Label>
          <Switch
            checked={settings.keyboardNavigation}
            onCheckedChange={(checked) => updateSetting("keyboardNavigation", checked)}
          />
        </div>

        {/* Large Buttons */}
        <div className="flex items-center justify-between">
          <Label className="flex items-center space-x-2">
            <span>Large Buttons</span>
          </Label>
          <Switch
            checked={settings.largeButtons}
            onCheckedChange={(checked) => updateSetting("largeButtons", checked)}
          />
        </div>

        {/* Reduced Motion */}
        <div className="flex items-center justify-between">
          <Label className="flex items-center space-x-2">
            <span>Reduce Motion</span>
          </Label>
          <Switch
            checked={settings.reducedMotion}
            onCheckedChange={(checked) => updateSetting("reducedMotion", checked)}
          />
        </div>

        {/* Test Voice */}
        {settings.voiceEnabled && (
          <div className="pt-4 border-t">
            <Button onClick={() => speakText(t.appName + " - " + t.success)} className="w-full" variant="outline">
              <Mic className="h-4 w-4 mr-2" />
              Test Voice Output
            </Button>
          </div>
        )}

        {/* Accessibility Status */}
        <div className="pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            {settings.highContrast && <Badge variant="secondary">High Contrast</Badge>}
            {settings.voiceEnabled && <Badge variant="secondary">Voice Enabled</Badge>}
            {settings.screenReaderMode && <Badge variant="secondary">Screen Reader</Badge>}
            {settings.largeButtons && <Badge variant="secondary">Large Buttons</Badge>}
            {settings.reducedMotion && <Badge variant="secondary">Reduced Motion</Badge>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
