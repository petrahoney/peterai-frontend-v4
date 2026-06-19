'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://47.254.144.78'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          window.location.href = '/auth/login'
          return
        }

        const [userRes, videosRes] = await Promise.all([
          axios.get(`${API_URL}/api/user/me?token=${token}`),
          axios.get(`${API_URL}/api/videos?token=${token}`)
        ])

        setUser(userRes.data)
        setVideos(videosRes.data)
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load data')
        if (err.response?.status === 401) {
          localStorage.removeItem('token')
          window.location.href = '/auth/login'
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">PETER AI Dashboard</h1>
          <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/auth/login' }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* User Info */}
        {user && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Welcome, {user.full_name}!</h2>
            <p className="text-gray-600">Email: {user.email}</p>
            <p className="text-gray-600">Plan: {user.is_premium ? 'Premium' : 'Free'}</p>
          </div>
        )}

        {/* Create Video Button */}
        <Link href="/dashboard/create" className="inline-block mb-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
          + Create New Video
        </Link>

        {/* Videos List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Your Videos</h3>
          </div>
          {videos.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No videos yet. Create one to get started!</div>
          ) : (
            <div className="divide-y">
              {videos.map((video: any) => (
                <div key={video.id} className="p-6 hover:bg-gray-50">
                  <h4 className="font-semibold text-lg">{video.title}</h4>
                  <p className="text-gray-600 text-sm mt-1">{video.prompt}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{video.status}</span>
                    {video.video_url && <a href={video.video_url} className="text-blue-600 hover:underline">Download</a>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
