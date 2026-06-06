import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import { Plus, Trash2, Edit2, Loader2, Layers, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner'

export function CategoryManagementPage() {
  const [newCategoryName, setNewCategoryName] = useState('')
  const queryClient = useQueryClient()

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: async () => {
      const res = await api.get('/categories')
      return res.data.data
    }
  })

  const createMutation = useMutation({
    mutationFn: (name: string) => api.post('/categories', { categoryName: name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] })
      setNewCategoryName('')
      toast.success('Category created')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] })
      toast.success('Category deleted')
    }
  })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return
    createMutation.mutate(newCategoryName)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Category Management</h1>
        <p className="text-muted-foreground">Define and organize course categories for the platform.</p>
      </div>

      <Card className="border-none bg-card/50 shadow-md ring-1 ring-white/5">
        <CardHeader>
          <CardTitle className="text-lg">Create New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="flex gap-4">
            <Input 
              placeholder="e.g. Graphic Design, Data Science..." 
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="max-w-md"
            />
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4 mr-2" />}
              Add Category
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="rounded-md border bg-card/50 shadow-md overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead>Courses Associated</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <Loader2 className="size-6 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : categories?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No categories found. Create one above!
                </TableCell>
              </TableRow>
            ) : categories?.map((cat: any) => (
              <TableRow key={cat.categoryid} className="group/row">
                <TableCell className="font-medium flex items-center gap-2">
                  <Layers className="size-4 text-primary/60" />
                  {cat.categoryName}
                </TableCell>
                <TableCell>
                   <span className="px-2 py-0.5 rounded-full bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider">
                      {cat.courses?.length || 0} courses
                   </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">{new Date(cat.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                   <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="size-8">
                         <Edit2 className="size-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="size-8 text-destructive hover:bg-destructive/10"
                            disabled={deleteMutation.isPending}
                          >
                             <Trash2 className="size-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                               <AlertTriangle className="size-6 text-destructive" />
                            </div>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription className="text-base">
                              This action will permanently delete the <strong>{cat.categoryName}</strong> category.
                              <br />
                              <span className="mt-2 block p-3 bg-destructive/5 border border-destructive/10 rounded-lg text-destructive font-medium">
                                 Warning: All {cat.courses?.length || 0} courses currently in this category will also be deleted.
                              </span>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="mt-6">
                            <AlertDialogCancel>
                               <Button variant="outline">Cancel</Button>
                            </AlertDialogCancel>
                            <AlertDialogAction>
                               <Button 
                                  variant="destructive" 
                                  onClick={() => deleteMutation.mutate(cat.categoryid)}
                               >
                                  Delete Category
                               </Button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                   </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
