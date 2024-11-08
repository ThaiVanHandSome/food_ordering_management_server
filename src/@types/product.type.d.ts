interface ProductRequest {
  name: string
  price: number
  description: string
  status: string
  image: string
  category: string
  cloudinaryUrl: string
}

interface ProductQuery {
  page: string
  limit: string
  name: string
  categoryId: string
  status: string
  priceMax: string
  priceMin: string
  order: 'asc' | 'desc'
  sortBy: 'createdAt' | 'view' | 'sold' | 'price'
}