interface Product {
    productId: string
    category: string[],
    name: string,
    price: number,
    description:string,
    status: string,
    image: string,
    sold: number,
    view: number
}

interface ProductsQuery {
    category_id: string,
    sort_by: string,
    order: string,
    price_max: number,
    price_min: number,
}
