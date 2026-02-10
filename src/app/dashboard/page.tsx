import { redirect } from 'next/navigation'

export default function DashboardPage() {
  // Redirect to the English dashboard by default
  redirect('/en/dashboard')
}
