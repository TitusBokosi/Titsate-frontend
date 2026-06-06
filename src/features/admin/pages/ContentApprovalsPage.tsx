import { useAdminContent } from "../hooks/useAdmin"
import { ApprovalQueue } from "../components/ApprovalQueue"
import { Loader2 } from "lucide-react"

export function ContentApprovalsPage() {
  const { data: contentData, isLoading } = useAdminContent()

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Approvals</h1>
        <p className="text-muted-foreground">Review courses submitted by Creators for publication.</p>
      </div>

      {isLoading ? (
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="size-10 animate-spin text-primary" />
        </div>
      ) : (
        <ApprovalQueue courses={contentData?.courses || []} />
      )}
    </div>
  )
}
