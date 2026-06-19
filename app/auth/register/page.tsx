'use client'

import { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://47.254.144.78'

export default function RegisterPage() {
  const [formData, setFormData] = useState({ email: '', username: '', password: '', full_name: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await axios.post(`${API_URL}/api/auth/register`, formData)
      setSuccess(true)
      setTimeout(() => window.location.href = '/auth/login', 2000)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Join PETER AI</h1>

        {success && <div className="p-3 bg-green-100 text-green-700 rounded mb-4">Registration successful! Redirecting...</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} placeholder="Full Name" className="w-full px-4 py-2 border rounded-lg" required />
          <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Email" className="w-full px-4 py-2 border rounded-lg" required />
          <input type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} placeholder="Username" className="w-full px-4 py-2 border rounded-lg" required />
          <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Password" className="w-full px-4 py-2 border rounded-lg" required />
          {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account? <Link href="/auth/login" className="text-blue-600 font-semibold">Login</Link>
        </p>
      </div>
    </div>
  )
}
