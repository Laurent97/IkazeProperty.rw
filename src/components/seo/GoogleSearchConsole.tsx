'use client'

interface GoogleSearchConsoleProps {
  verificationCode: string
}

export default function GoogleSearchConsole({ verificationCode }: GoogleSearchConsoleProps) {
  // Only render if we have a real verification code (not the placeholder)
  if (!verificationCode || verificationCode === 'your-google-verification-code') {
    return null
  }

  return (
    <meta
      name="google-site-verification"
      content={verificationCode}
    />
  )
}
