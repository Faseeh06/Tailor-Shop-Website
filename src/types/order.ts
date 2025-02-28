export interface Measurements {
  chest: string;
  waist: string;
  shoulders: string;
}

export interface Order {
  id: number;
  customerName: string;
  orderDate: string;
  status: string;
  measurements: Measurements;
  itemType: string;
  specifications: string;
  price: string;
  deadline: string;
}