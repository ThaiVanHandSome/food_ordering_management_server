interface TableRequest {
  table_number: number
  capacity: number
  token: string
  status: string
}

interface TableQuery {
  page: string | number
  limit: string | number
  table_number: string | number
}
