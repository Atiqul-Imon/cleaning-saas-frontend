export interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  vatAmount: number;
  totalAmount: number;
  status: 'PAID' | 'UNPAID';
  dueDate: string;
  paymentMethod?: 'BANK_TRANSFER' | 'CARD' | 'CASH';
  paidAt?: string;
  client: {
    id: string;
    name: string;
    phone?: string;
  };
  job?: {
    id: string;
    type: string;
    scheduledDate: string;
  };
  business: {
    id: string;
    name: string;
    phone?: string;
    address?: string;
    vatEnabled: boolean;
    vatNumber?: string;
    invoiceTemplate?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface CreateInvoiceDto {
  jobId: string;
  amount: number;
}

export interface UpdateInvoiceDto {
  status?: 'PAID' | 'UNPAID';
  paymentMethod?: 'BANK_TRANSFER' | 'CARD' | 'CASH';
}

export type InvoiceStatus = 'PAID' | 'UNPAID';
export type PaymentMethod = 'BANK_TRANSFER' | 'CARD' | 'CASH';



