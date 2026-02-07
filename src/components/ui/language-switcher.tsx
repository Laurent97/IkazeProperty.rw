'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' }
]

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = (newLocale: string) => {
    startTransition(() => {
      // Simple approach: split pathname and replace first segment if it's a locale
      const segments = pathname.split('/').filter(Boolean)
      const [firstSegment, ...restSegments] = segments
      
      // Check if first segment is a locale
      const locales = ['en', 'fr', 'rw']
      let newPathname: string
      
      if (firstSegment && locales.includes(firstSegment)) {
        // Replace existing locale
        newPathname = `/${newLocale}/${restSegments.join('/')}`
      } else {
        // Add new locale to beginning
        newPathname = `/${newLocale}${pathname}`
      }
      
      router.push(newPathname)
    })
  }

  const currentLanguage = languages.find(lang => lang.code === locale)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isPending} className="px-4 py-2">
          <Globe className="h-4 w-4 mr-3" />
          {currentLanguage?.flag}
          <span className="ml-3">{currentLanguage?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => switchLanguage(language.code)}
            className={`px-4 py-3 ${locale === language.code ? 'bg-accent' : ''}`}
          >
            <span className="mr-3">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
