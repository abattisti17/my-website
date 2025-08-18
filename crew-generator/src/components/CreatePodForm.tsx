import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { supabase } from '../lib/supabase'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner'

interface CreatePodFormProps {
  eventId: string
  onSuccess?: (podId: string) => void
}

export default function CreatePodForm({ eventId, onSuccess }: CreatePodFormProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [podName, setPodName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('You must be signed in to create a pod')
      return
    }

    if (!podName.trim()) {
      toast.error('Please enter a pod name')
      return
    }

    setLoading(true)
    
    try {
      // Create the pod
      const { data: pod, error: podError } = await supabase
        .from('pods')
        .insert({
          event_id: eventId,
          name: podName.trim(),
          created_by: user.id
        })
        .select()
        .single()

      if (podError) throw podError

      // Add creator as first member
      const { error: memberError } = await supabase
        .from('pod_members')
        .insert({
          pod_id: pod.id,
          user_id: user.id,
          role: 'creator'
        })

      if (memberError) throw memberError

      toast.success('Pod created! Welcome to your crew! 🎉')
      
      if (onSuccess) {
        onSuccess(pod.id)
      }
    } catch (error) {
      console.error('Error creating pod:', error)
      toast.error('Failed to create pod. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Pod</CardTitle>
        <CardDescription>
          Start a small group (max 5 members) for planning and chatting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="podName">Pod Name</Label>
            <Input
              id="podName"
              value={podName}
              onChange={(e) => setPodName(e.target.value)}
              placeholder="Front Row Squad"
              maxLength={50}
              required
            />
            <p className="text-sm text-gray-500">
              Give your pod a fun name that represents your vibe!
            </p>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? '🚀 Creating Pod...' : '✨ Create Pod'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
