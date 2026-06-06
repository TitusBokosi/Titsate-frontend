import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  User, 
  Lock, 
  Trash2, 
  Loader2, 
  AlertTriangle,
} from 'lucide-react'
import { useUpdateProfile, useUpdatePassword, useDeleteMyAccount } from '../hooks/useUsers'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/providers/AuthProvider'

const profileSchema = z.object({
  firstname: z.string().min(2, 'First name must be at least 2 characters'),
  lastname: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  verifiedPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.verifiedPassword, {
  message: "Passwords don't match",
  path: ["verifiedPassword"],
})

export function UserDashboardSettings({ user }: { user: any }) {
  const navigate = useNavigate()
  const { logout } = useAuthContext()
  const updateProfile = useUpdateProfile()
  const updatePass = useUpdatePassword()
  const deleteAccount = useDeleteMyAccount()

  const [isDeleting, setIsDeleting] = useState(false)

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    },
  })

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
  })

  const onUpdateProfile = (data: z.infer<typeof profileSchema>) => {
    updateProfile.mutate(data, {
      onSuccess: () => {
        toast.success('Profile updated successfully')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to update profile')
      }
    })
  }

  const onUpdatePassword = (data: z.infer<typeof passwordSchema>) => {
    updatePass.mutate(data, {
      onSuccess: () => {
        toast.success('Password updated successfully')
        passwordForm.reset()
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to update password')
      }
    })
  }

  const onDeleteAccount = () => {
    if (window.confirm('Are you absolutely sure? This action cannot be undone.')) {
      deleteAccount.mutate(undefined, {
        onSuccess: () => {
          toast.success('Account deleted successfully')
          logout()
          navigate('/')
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || 'Failed to delete account')
        }
      })
    }
  }

  return (
    <div className="space-y-8 pb-20 mt-4">
      {/* Profile Settings */}
      <Card className="border-none shadow-xl bg-secondary/5 ring-1 ring-white/5">
        <CardHeader className="p-6 md:p-8 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <User className="size-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold">Profile Information</CardTitle>
              <CardDescription>Update your personal details and email address</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">First Name</label>
                <Input 
                  {...profileForm.register('firstname')} 
                  placeholder="First name"
                  className="bg-background/50 border-white/10"
                />
                {profileForm.formState.errors.firstname && (
                  <p className="text-xs text-destructive ml-1">{profileForm.formState.errors.firstname.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Last Name</label>
                <Input 
                  {...profileForm.register('lastname')} 
                  placeholder="Last name"
                  className="bg-background/50 border-white/10"
                />
                {profileForm.formState.errors.lastname && (
                  <p className="text-xs text-destructive ml-1">{profileForm.formState.errors.lastname.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Email Address</label>
              <Input 
                {...profileForm.register('email')} 
                type="email"
                placeholder="Email"
                className="bg-background/50 border-white/10"
              />
              {profileForm.formState.errors.email && (
                <p className="text-xs text-destructive ml-1">{profileForm.formState.errors.email.message}</p>
              )}
            </div>
            <div className="flex justify-end pt-2">
              <Button 
                type="submit" 
                disabled={updateProfile.isPending}
                className="min-w-[120px] font-bold"
              >
                {updateProfile.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password Settings */}
      <Card className="border-none shadow-xl bg-secondary/5 ring-1 ring-white/5">
        <CardHeader className="p-6 md:p-8 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <Lock className="size-6 text-amber-500" />
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold">Security</CardTitle>
              <CardDescription>Change your password to keep your account secure</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <form onSubmit={passwordForm.handleSubmit(onUpdatePassword)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Current Password</label>
              <Input 
                {...passwordForm.register('currentPassword')} 
                type="password"
                placeholder="••••••••"
                className="bg-background/50 border-white/10"
              />
              {passwordForm.formState.errors.currentPassword && (
                <p className="text-xs text-destructive ml-1">{passwordForm.formState.errors.currentPassword.message}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">New Password</label>
                <Input 
                  {...passwordForm.register('newPassword')} 
                  type="password"
                  placeholder="••••••••"
                  className="bg-background/50 border-white/10"
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-xs text-destructive ml-1">{passwordForm.formState.errors.newPassword.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Confirm New Password</label>
                <Input 
                  {...passwordForm.register('verifiedPassword')} 
                  type="password"
                  placeholder="••••••••"
                  className="bg-background/50 border-white/10"
                />
                {passwordForm.formState.errors.verifiedPassword && (
                  <p className="text-xs text-destructive ml-1">{passwordForm.formState.errors.verifiedPassword.message}</p>
                )}
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button 
                type="submit" 
                variant="secondary"
                disabled={updatePass.isPending}
                className="min-w-[120px] font-bold"
              >
                {updatePass.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-none shadow-xl bg-destructive/5 ring-1 ring-destructive/20 overflow-hidden">
        <CardHeader className="p-6 md:p-8 bg-destructive/10 border-b border-destructive/10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-destructive/20 rounded-xl">
              <Trash2 className="size-6 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold text-destructive">Danger Zone</CardTitle>
              <CardDescription className="text-destructive/70">Permanently delete your account and all data</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-destructive/5 border border-destructive/20">
            <AlertTriangle className="size-5 text-destructive shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold text-destructive mb-1">Once you delete your account, there is no going back.</p>
              <p className="text-muted-foreground leading-relaxed">
                All your progress, completed lessons, and certificates will be permanently removed. Please be certain.
              </p>
            </div>
          </div>
          
           {!isDeleting ? (
            <div className="flex justify-end">
               <Button 
                variant="destructive" 
                onClick={() => setIsDeleting(true)}
                className="font-bold shadow-lg shadow-destructive/20"
              >
                Delete My Account
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 transition-all animate-in slide-in-from-right-4 duration-300">
              <p className="text-sm font-medium text-destructive mr-2">Are you really sure?</p>
              <Button variant="ghost" size="sm" onClick={() => setIsDeleting(false)}>Cancel</Button>
              <Button 
                variant="destructive" 
                onClick={onDeleteAccount}
                disabled={deleteAccount.isPending}
                className="font-bold shadow-lg shadow-destructive/20"
              >
                 {deleteAccount.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                 Yes, Delete Everything
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
