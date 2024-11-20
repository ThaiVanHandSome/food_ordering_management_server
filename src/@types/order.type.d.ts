interface OrderRequest {
  table_number: number
  customer_name: string
  customer_id: string
  assignee: string
  products: {
    id: string
    buy_count: number
    status?: string
  }[]
}

interface OrderUpdateQuery {
  order_id?: string
  product_id?: string
  buy_count?: string
  status?: string
  assignee: string
}

interface StatisticOrderQuery {
  page: string | number
  limit: string | number
  table_number: string | number
  customer_name: string
  status: string
  startDate: string
  endDate: string
}
