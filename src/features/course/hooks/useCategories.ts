// src/features/course/hooks/useCategories.ts
import { useQuery } from '@tanstack/react-query'
import * as categoryApi from '../api/category'

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getCategories,
  })
}
