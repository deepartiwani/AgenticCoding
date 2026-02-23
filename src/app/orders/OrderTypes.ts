export interface OrderLineItemType {
  id: string;
  name: Record<string, string>;
  quantity: number;
  price: {
    value: {
      centAmount: number;
      fractionDigits: number;
      currencyCode: string;
    };
  };
  totalPrice: {
    centAmount: number;
    fractionDigits: number;
    currencyCode: string;
  };
  variant?: {
    images?: { url: string }[];
  };
}

export interface OrderType {
  id: string;
  orderNumber?: string;
  createdAt: string;
  orderState: string;
  paymentState?: string;
  totalPrice: {
    centAmount: number;
    fractionDigits: number;
    currencyCode: string;
  };
  lineItems: OrderLineItemType[];
}