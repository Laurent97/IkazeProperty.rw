import { redirect } from 'next/navigation'

export default function DashboardPage() {
  // Redirect to the dashboard based on user role
  redirect('/dashboard/user')
}
