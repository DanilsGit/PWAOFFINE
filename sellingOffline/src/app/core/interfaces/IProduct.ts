export interface IProduct {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    state: 'active' | 'inactive';
    offline?: boolean;
}