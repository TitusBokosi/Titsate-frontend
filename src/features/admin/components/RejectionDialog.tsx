import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle, Send } from "lucide-react"

interface RejectionDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (feedback: string) => void
  title: string
  isProcessing: boolean
}

export function RejectionDialog({ isOpen, onClose, onConfirm, title, isProcessing }: RejectionDialogProps) {
  const [feedback, setFeedback] = useState('')

  const handleConfirm = () => {
    if (!feedback.trim()) return
    onConfirm(feedback)
    setFeedback('')
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-md bg-card border-none shadow-2xl ring-1 ring-white/10">
        <AlertDialogHeader>
          <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
             <AlertCircle className="size-6 text-destructive" />
          </div>
          <AlertDialogTitle className="text-xl">Reject Content</AlertDialogTitle>
          <AlertDialogDescription>
            Provide feedback for <strong>{title}</strong>. This will let the creator know why the content was rejected and what needs to be fixed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4 space-y-3">
          <Label htmlFor="feedback" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Rejection Reason / Feedback
          </Label>
          <Textarea
            id="feedback"
            placeholder="e.g. Video quality is too low, specific topics are missing details..."
            className="min-h-[120px] bg-background/50 border-white/5 focus:ring-primary/20"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button 
                variant="destructive" 
                onClick={handleConfirm}
                disabled={!feedback.trim() || isProcessing}
                className="gap-2"
            >
              {isProcessing ? "Processing..." : (
                <>
                  <Send className="size-4" /> Send Feedback
                </>
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
