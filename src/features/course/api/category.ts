// src/features/course/api/category.ts
import api from '@/lib/axios'

export interface Category {
  categoryid: string
  categoryName: string
  description?: string
}

export const getCategories = async (): Promise<{ data: Category[] }> => {
  const res = await api.get('/categories')
  return res.data
}
