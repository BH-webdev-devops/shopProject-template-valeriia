interface Product {
    id: number;
    title: string;
    price: number;
    description:string;
    category: string;
    image: string;
    rating: {
        rate: number;
        count:number;
    }
}

interface Item {
    product: Product
    count : number;
}


export type {Product, Item}
