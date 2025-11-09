interface StorageAPI {
  get(key: string): Promise<{ value: string } | null>;
  set(key: string, value: string): Promise<void>;
}

declare global {
  interface Window {
    storage: StorageAPI;
  }
}

export type Customer = {
  id: string;
  customerNumber: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company: string;
  vatNumber?: string;
  companyRegistration?: string;
  createdAt: string;
  updatedAt: string;
};

export type DocumentItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
};

export type Document = {
  id: string;
  type: 'invoice' | 'quote';
  number: string;
  customerId: string;
  customer?: Customer;
  items: DocumentItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'accepted' | 'rejected';
  issueDate: string;
  dueDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type BusinessSettings = {
  businessName: string;
  address: string;
  email: string;
  phone: string;
  vatNumber: string;
  companyRegistration: string;
  logoDataUrl?: string;
  bankName?: string;
  accountHolder?: string;
  accountNumber?: string;
  branchCode?: string;
  primaryColor?: string;
  secondaryColor?: string;
};

export {};
