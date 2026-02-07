// Rwandan business hours and holiday schedule configuration

export const BUSINESS_HOURS = {
  // Standard business hours for IkazeProperty.rw
  weekdays: {
    monday: { open: '08:00', close: '18:00', isOpen: true },
    tuesday: { open: '08:00', close: '18:00', isOpen: true },
    wednesday: { open: '08:00', close: '18:00', isOpen: true },
    thursday: { open: '08:00', close: '18:00', isOpen: true },
    friday: { open: '08:00', close: '18:00', isOpen: true },
    saturday: { open: '09:00', close: '16:00', isOpen: true },
    sunday: { open: null, close: null, isOpen: false }
  },

  // Customer service specific hours
  customerService: {
    phone: {
      weekdays: { open: '08:00', close: '18:00' },
      saturday: { open: '09:00', close: '16:00' },
      sunday: { isOpen: false }
    },
    email: {
      responseTime: '24 hours',
      weekdays: { open: '08:00', close: '18:00' },
      saturday: { open: '09:00', close: '16:00' },
      sunday: { isOpen: false }
    },
    chat: {
      weekdays: { open: '08:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { isOpen: false }
    },
    whatsapp: {
      weekdays: { open: '08:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { isOpen: true } // WhatsApp available 24/7 for urgent issues
    }
  },

  // Emergency support
  emergency: {
    available: true,
    channels: ['whatsapp', 'phone'],
    responseTime: '2 hours',
    description: 'For urgent security or payment issues'
  }
}

// Rwandan public holidays for 2024-2025
export const RWANDAN_HOLIDAYS = [
  // 2024 Holidays
  {
    date: '2024-01-01',
    name: 'New Year\'s Day',
    localName: 'Umwaka Mushya',
    type: 'public',
    isObserved: true
  },
  {
    date: '2024-02-01',
    name: 'Heroes\' Day',
    localName: 'Umunsi w\'Abahizi',
    type: 'public',
    isObserved: true
  },
  {
    date: '2024-02-07',
    name: 'National Day of Commemoration',
    localName: 'Umunsi wo Kwibuka',
    type: 'public',
    isObserved: true
  },
  {
    date: '2024-04-07',
    name: 'Genocide Memorial Day',
    localName: 'Kwibuka',
    type: 'public',
    isObserved: true
  },
  {
    date: '2024-05-01',
    name: 'Labor Day',
    localName: 'Umunsi w\'Abakozi',
    type: 'public',
    isObserved: true
  },
  {
    date: '2024-07-01',
    name: 'Independence Day',
    localName: 'Umunsi w\'Ubwigenge',
    type: 'public',
    isObserved: true
  },
  {
    date: '2024-07-04',
    name: 'Liberation Day',
    localName: 'Umunsi w\'Kwivuka',
    type: 'public',
    isObserved: true
  },
  {
    date: '2024-08-15',
    name: 'Assumption Day',
    localName: 'Umunsi mukuru w\'Mariya',
    type: 'public',
    isObserved: true
  },
  {
    date: '2024-09-08',
    name: 'Victory Day',
    localName: 'Umunsi w\'Ishusho',
    type: 'public',
    isObserved: true
  },
  {
    date: '2024-12-25',
    name: 'Christmas Day',
    localName: 'Kirimasi',
    type: 'public',
    isObserved: true
  },
  {
    date: '2024-12-26',
    name: 'Boxing Day',
    localName: 'Umunsi ukurikira Kirimasi',
    type: 'public',
    isObserved: true
  },

  // 2025 Holidays (estimated dates)
  {
    date: '2025-01-01',
    name: 'New Year\'s Day',
    localName: 'Umwaka Mushya',
    type: 'public',
    isObserved: true
  },
  {
    date: '2025-02-01',
    name: 'Heroes\' Day',
    localName: 'Umunsi w\'Abahizi',
    type: 'public',
    isObserved: true
  },
  {
    date: '2025-04-07',
    name: 'Genocide Memorial Day',
    localName: 'Kwibuka',
    type: 'public',
    isObserved: true
  },
  {
    date: '2025-05-01',
    name: 'Labor Day',
    localName: 'Umunsi w\'Abakozi',
    type: 'public',
    isObserved: true
  },
  {
    date: '2025-07-01',
    name: 'Independence Day',
    localName: 'Umunsi w\'Ubwigenge',
    type: 'public',
    isObserved: true
  },
  {
    date: '2025-07-04',
    name: 'Liberation Day',
    localName: 'Umunsi w\'Kwivuka',
    type: 'public',
    isObserved: true
  },
  {
    date: '2025-12-25',
    name: 'Christmas Day',
    localName: 'Kirimasi',
    type: 'public',
    isObserved: true
  }
]

// Utility functions
export const isBusinessOpen = (date: Date = new Date()): boolean => {
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  const daySchedule = BUSINESS_HOURS.weekdays[dayName as keyof typeof BUSINESS_HOURS.weekdays]
  
  if (!daySchedule?.isOpen) return false
  
  // Check if it's a holiday
  if (isHoliday(date)) return false
  
  const currentTime = date.toTimeString().slice(0, 5) // HH:MM format
  return currentTime >= daySchedule.open! && currentTime <= daySchedule.close!
}

export const isHoliday = (date: Date): boolean => {
  const dateString = date.toISOString().split('T')[0]
  return RWANDAN_HOLIDAYS.some(holiday => holiday.date === dateString && holiday.isObserved)
}

export const getNextBusinessDay = (date: Date = new Date()): Date => {
  const nextDay = new Date(date)
  nextDay.setDate(nextDay.getDate() + 1)
  
  // Keep adding days until we find a business day that's not a holiday
  while (!isBusinessOpen(nextDay)) {
    nextDay.setDate(nextDay.getDate() + 1)
  }
  
  return nextDay
}

export const getBusinessHoursDisplay = (locale: 'en' | 'fr' | 'rw' = 'en'): string => {
  const translations = {
    en: {
      weekdays: 'Monday - Friday: 8:00 AM - 6:00 PM',
      saturday: 'Saturday: 9:00 AM - 4:00 PM',
      sunday: 'Sunday: Closed',
      holidays: 'Closed on Rwandan public holidays'
    },
    fr: {
      weekdays: 'Lundi - Vendredi : 8h00 - 18h00',
      saturday: 'Samedi : 9h00 - 16h00',
      sunday: 'Dimanche : Fermé',
      holidays: 'Fermé les jours fériés rwandais'
    },
    rw: {
      weekdays: 'Kuwa mbere na kuwa gatanu - 8:00 Z.M - 6:00 Z.M',
      saturday: 'Kuwa gatandatu - 9:00 Z.M - 4:00 Z.M',
      sunday: 'Kuwa cyumweri - Fungwe',
      holidays: 'Fungwe iminsi y\'ibiruhuko mu Rwanda'
    }
  }
  
  const t = translations[locale]
  return `${t.weekdays}\n${t.saturday}\n${t.sunday}\n${t.holidays}`
}

export const getUpcomingHolidays = (count: number = 5): Array<{date: string, name: string, localName: string, daysUntil: number}> => {
  const today = new Date()
  const todayString = today.toISOString().split('T')[0]
  
  return RWANDAN_HOLIDAYS
    .filter(holiday => holiday.date >= todayString)
    .slice(0, count)
    .map(holiday => {
      const holidayDate = new Date(holiday.date)
      const daysUntil = Math.ceil((holidayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      
      return {
        ...holiday,
        daysUntil
      }
    })
}

export const getCustomerServiceStatus = (channel: keyof typeof BUSINESS_HOURS.customerService): {
  isOpen: boolean
  nextOpenTime?: string
  responseTime?: string
} => {
  const now = new Date()
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  const channelConfig = BUSINESS_HOURS.customerService[channel]
  
  if (channel === 'whatsapp') {
    return {
      isOpen: true,
      responseTime: '2 hours for urgent issues'
    }
  }
  
  if (channel === 'email') {
    return {
      isOpen: true, // Email is always "open" but response time varies
      responseTime: (channelConfig as any).responseTime
    }
  }
  
  const daySchedule = (channelConfig as any)[dayName]
  
  if (daySchedule && typeof daySchedule === 'object' && 'open' in daySchedule) {
    const currentTime = now.toTimeString().slice(0, 5)
    const isOpen = currentTime >= daySchedule.open && currentTime <= daySchedule.close
    
    return {
      isOpen,
      responseTime: isOpen ? 'Immediate' : (channelConfig as any).responseTime
    }
  }
  
  return {
    isOpen: false,
    responseTime: (channelConfig as any).responseTime
  }
}

// Time zone utilities
export const RWANDA_TIMEZONE = 'Africa/Kigali'

export const getCurrentTimeInRwanda = (): Date => {
  return new Date(new Date().toLocaleString("en-US", { timeZone: RWANDA_TIMEZONE }))
}

export const formatRwandaTime = (date: Date, format: 'time' | 'datetime' | 'date' = 'time'): string => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: RWANDA_TIMEZONE,
  }
  
  switch (format) {
    case 'time':
      options.hour = '2-digit'
      options.minute = '2-digit'
      break
    case 'datetime':
      options.year = 'numeric'
      options.month = 'short'
      options.day = 'numeric'
      options.hour = '2-digit'
      options.minute = '2-digit'
      break
    case 'date':
      options.year = 'numeric'
      options.month = 'short'
      options.day = 'numeric'
      break
  }
  
  return date.toLocaleString('en-US', options)
}
