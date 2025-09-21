"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Languages } from "lucide-react"
import type { Language } from "@/lib/translations"

interface LanguageSelectorProps {
  currentLanguage: Language
  onLanguageChange: (language: Language) => void
  compact?: boolean
}

export function LanguageSelector({ currentLanguage, onLanguageChange, compact = false }: LanguageSelectorProps) {
  const languages = [
    { code: "en" as Language, name: "English", nativeName: "English" },
    { code: "hi" as Language, name: "Hindi", nativeName: "हिंदी" },
    { code: "pa" as Language, name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  ]

  const currentLang = languages.find((lang) => lang.code === currentLanguage)

  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
            <Languages className="h-4 w-4" />
            <span className="text-xs">{currentLang?.code.toUpperCase()}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => onLanguageChange(language.code)}
              className={currentLanguage === language.code ? "bg-accent" : ""}
            >
              <div className="flex flex-col">
                <span className="font-medium">{language.nativeName}</span>
                <span className="text-xs text-muted-foreground">{language.name}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 mb-3">
        <Languages className="h-5 w-5" />
        <span className="font-medium">Select Language</span>
      </div>
      <div className="grid gap-2">
        {languages.map((language) => (
          <Button
            key={language.code}
            variant={currentLanguage === language.code ? "default" : "outline"}
            onClick={() => onLanguageChange(language.code)}
            className="justify-start h-auto p-4"
          >
            <div className="text-left">
              <div className="font-medium text-lg">{language.nativeName}</div>
              <div className="text-sm opacity-70">{language.name}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}
