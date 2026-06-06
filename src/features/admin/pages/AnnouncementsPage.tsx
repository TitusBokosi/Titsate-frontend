import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import { Plus, Trash2, Loader2, Megaphone, ToggleLeft, ToggleRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Announcement {
  id: string
  title: string
  content: string
  isActive: boolean
  createdAt: string
}

export function AnnouncementsPage() {
  const [form, setForm] = useState({ title: '', content: '' })
  const queryClient = useQueryClient()

  const { data: announcements, isLoading } = useQuery<Announcement[]>({
    queryKey: ['admin', 'announcements'],
    queryFn: async () => {
      const res = await api.get('/admin/announcements')
      return res.data.data
    }
  })

  const createMutation = useMutation({
    mutationFn: (data: typeof form) => api.post('/admin/announcements', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'announcements'] })
      setForm({ title: '', content: '' })
      toast.success('Announcement created')
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to create')
  })

  const toggleMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/announcements/${id}/toggle`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'announcements'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/announcements/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'announcements'] })
      toast.success('Announcement deleted')
    }
  })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Title and content are required')
      return
    }
    createMutation.mutate(form)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
        <p className="text-muted-foreground">Create and manage platform-wide announcements for all users.</p>
      </div>

      {/* Create Form */}
      <Card className="border-none bg-card/50 shadow-md ring-1 ring-white/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Megaphone className="size-5 text-primary" />
            Create New Announcement
          </CardTitle>
          <CardDescription>This will be shown to all users on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              placeholder="Announcement title (e.g. 'New courses available!')"
              value={form.title}
              onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
            />
            <textarea
              placeholder="Write your announcement message here..."
              value={form.content}
              onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
              rows={4}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending
                ? <Loader2 className="size-4 animate-spin mr-2" />
                : <Plus className="size-4 mr-2" />}
              Publish Announcement
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-10 animate-spin text-primary" />
          </div>
        ) : !announcements?.length ? (
          <div className="text-center py-16 border border-dashed rounded-xl text-muted-foreground">
            <Megaphone className="size-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">No announcements yet.</p>
            <p className="text-sm">Create one above to notify all users.</p>
          </div>
        ) : announcements.map((a) => (
          <Card
            key={a.id}
            className={cn(
              "border-none shadow-sm ring-1 transition-all",
              a.isActive ? "ring-primary/20 bg-primary/5" : "ring-white/5 bg-card/50 opacity-60"
            )}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-base">{a.title}</CardTitle>
                    <Badge className={a.isActive ? "bg-green-600" : "bg-muted text-muted-foreground"}>
                      {a.isActive ? 'Live' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{a.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(a.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => toggleMutation.mutate(a.id)}
                    title={a.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {a.isActive
                      ? <ToggleRight className="size-5 text-green-500" />
                      : <ToggleLeft className="size-5 text-muted-foreground" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:bg-destructive/10"
                    onClick={() => deleteMutation.mutate(a.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
