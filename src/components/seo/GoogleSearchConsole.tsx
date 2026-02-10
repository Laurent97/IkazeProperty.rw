'use client'

interface GoogleSearchConsoleProps {
  verificationCode: string
}

export default function GoogleSearchConsole({ verificationCode }: GoogleSearchConsoleProps) {
  if (!verificationCode) {
    return null
  }

  return (
    <meta
      name="google-site-verification"
      content={verificationCode}
    />
  )
}
