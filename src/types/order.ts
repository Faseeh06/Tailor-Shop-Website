export interface Measurements {
  chest: string;
  waist: string;
  hips: string;
  shoulders: string;
  sleeves: string;
  length: string;
  neck: string;
}

export interface Order {
  id?: string;
  orderNumber: string;  // Add this line
  customerName: string;
  customerEmail: string;
  customerId: string;
  orderDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  imageUrl?: string;
  garmentType: string;
  fabricType: string;
  color: string;
  measurements: Measurements;
  specialInstructions?: string;
  estimatedBudget: string;
  preferredDeliveryDate: string;
}