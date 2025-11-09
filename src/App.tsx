import { useState, useEffect } from 'react';
import { Plus, FileText, X, Edit, Trash2, Download, Settings, Mail, Copy, Share2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Customer, Document, DocumentItem, BusinessSettings } from './types';

interface CustomerFormProps {
  customer: Customer | null;
  onSubmit: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'customerNumber'>) => void;
  onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customer, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    vatNumber: '',
    companyRegistration: '',
  });
  const [errors, setErrors] = useState<{[k:string]: string}>({});

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
        address: customer.address || '',
        company: customer.company,
        vatNumber: customer.vatNumber || '',
        companyRegistration: customer.companyRegistration || '',
      });
    }
  }, [customer]);

  const validate = () => {
    const newErrors: {[k:string]: string} = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length === 0) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {customer ? 'Edit Customer' : 'Add Customer'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {customer && customer.customerNumber && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Number</label>
              <input
                type="text"
                value={customer.customerNumber}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.company ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.company && <p className="text-xs text-red-600 mt-1">{errors.company}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              VAT Number
            </label>
            <input
              type="text"
              name="vatNumber"
              value={formData.vatNumber}
              onChange={handleChange}
              placeholder="e.g. 4123456789"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Registration
            </label>
            <input
              type="text"
              name="companyRegistration"
              value={formData.companyRegistration}
              onChange={handleChange}
              placeholder="e.g. 2018/123456/07"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={Object.keys(validate()).length > 0}
            >
              {customer ? 'Update Customer' : 'Add Customer'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface SettingsFormProps {
  settings: BusinessSettings | null;
  onSubmit: (settings: BusinessSettings) => void;
  onCancel: () => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ settings, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<BusinessSettings>({
    businessName: '',
    address: '',
    email: '',
    phone: '',
    vatNumber: '',
    companyRegistration: '',
    logoDataUrl: '',
    bankName: '',
    accountHolder: '',
    accountNumber: '',
    branchCode: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
  });
  const [errors, setErrors] = useState<{[k:string]: string}>({});

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const validate = () => {
    const v: {[k:string]: string} = {};
    if (!formData.businessName.trim()) v.businessName = 'Business name is required';
    if (!formData.email.trim()) v.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) v.email = 'Invalid email';
    if (!formData.phone.trim()) v.phone = 'Phone is required';
    if (!formData.vatNumber.trim()) v.vatNumber = 'VAT number is required';
    if (!formData.companyRegistration.trim()) v.companyRegistration = 'Company registration is required';
    if (!formData.address.trim()) v.address = 'Address is required';
    return v;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length === 0) onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setFormData(prev => ({ ...prev, logoDataUrl: dataUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Business Settings</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name *
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.businessName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.businessName && <p className="text-xs text-red-600 mt-1">{errors.businessName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                VAT Number *
              </label>
              <input
                type="text"
                name="vatNumber"
                value={formData.vatNumber}
                onChange={handleChange}
                placeholder="e.g. 4123456789"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.vatNumber ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.vatNumber && <p className="text-xs text-red-600 mt-1">{errors.vatNumber}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Registration *
              </label>
              <input
                type="text"
                name="companyRegistration"
                value={formData.companyRegistration}
                onChange={handleChange}
                placeholder="e.g. 2018/123456/07"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.companyRegistration ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.companyRegistration && <p className="text-xs text-red-600 mt-1">{errors.companyRegistration}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Logo (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.logoDataUrl && (
                <div className="mt-2">
                  <img 
                    src={formData.logoDataUrl} 
                    alt="Business logo preview" 
                    className="h-20 object-contain border border-gray-200 rounded p-2"
                  />
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <h3 className="text-md font-semibold text-gray-800 mt-2 mb-2">Banking Details (optional)</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName || ''}
                onChange={handleChange}
                placeholder="e.g. Standard Bank"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Holder
              </label>
              <input
                type="text"
                name="accountHolder"
                value={formData.accountHolder || ''}
                onChange={handleChange}
                placeholder="Account holder name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber || ''}
                onChange={handleChange}
                placeholder="e.g. 1234567890"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch Code
              </label>
              <input
                type="text"
                name="branchCode"
                value={formData.branchCode || ''}
                onChange={handleChange}
                placeholder="e.g. 051001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <h3 className="text-md font-semibold text-gray-800 mt-2 mb-2">Brand Colors (optional)</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Color
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  name="primaryColor"
                  value={formData.primaryColor || '#3B82F6'}
                  onChange={handleChange}
                  className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  name="primaryColor"
                  value={formData.primaryColor || '#3B82F6'}
                  onChange={handleChange}
                  placeholder="#3B82F6"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Used for buttons, headers, and primary accents</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secondary Color
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  name="secondaryColor"
                  value={formData.secondaryColor || '#10B981'}
                  onChange={handleChange}
                  className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  name="secondaryColor"
                  value={formData.secondaryColor || '#10B981'}
                  onChange={handleChange}
                  placeholder="#10B981"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Used for secondary elements and highlights</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              className="flex-1 bg-blue-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={Object.keys(validate()).length > 0}
            >
              Save Settings
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface DocumentFormProps {
  document: Document | null;
  documentType: 'invoice' | 'quote';
  customers: Customer[];
  documents: Document[];
  onSubmit: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const DocumentForm: React.FC<DocumentFormProps> = ({ document, documentType, customers, documents, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    items: [] as DocumentItem[],
    taxRate: 15,
    notes: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (document) {
      setFormData({
        customerId: document.customerId,
        items: document.items,
        taxRate: document.taxRate,
        notes: document.notes || '',
        issueDate: document.issueDate.split('T')[0],
        dueDate: document.dueDate ? document.dueDate.split('T')[0] : '',
      });
    }
  }, [document]);

  const addItem = () => {
    const newItem: DocumentItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const updateItem = (id: string, updates: Partial<DocumentItem>) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, ...updates };
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
          return updatedItem;
        }
        return item;
      }),
    }));
  };

  const removeItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }));
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (formData.taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const validate = () => {
    const errs: { [k: string]: string } = {};
    if (!formData.customerId) errs.customerId = 'Customer is required';
    if (!formData.issueDate) errs.issueDate = 'Issue date is required';
    if (formData.dueDate && formData.issueDate && new Date(formData.dueDate) < new Date(formData.issueDate)) {
      errs.dueDate = 'Due date cannot be before issue date';
    }
    if (formData.taxRate < 0) errs.taxRate = 'Tax rate cannot be negative';
    if (formData.items.length === 0) errs.items = 'At least one item is required';
    return errs;
  };

  const itemErrors = (item: DocumentItem) => {
    const e: { description?: string; quantity?: string; rate?: string } = {};
    if (!item.description.trim()) e.description = 'Description required';
    if (item.quantity <= 0) e.quantity = 'Qty must be > 0';
    if (item.rate < 0) e.rate = 'Rate cannot be negative';
    return e;
  };

  const formHasErrors = () => {
    const top = validate();
    if (Object.keys(top).length > 0) return true;
    for (const it of formData.items) {
      if (Object.keys(itemErrors(it)).length > 0) return true;
    }
    return false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!formHasErrors()) {
      const selectedCustomer = customers.find(c => c.id === formData.customerId);
      
      // Generate next sequential number if creating new document
      let docNumber = document?.number;
      if (!docNumber) {
        const existingDocs = documents.filter(d => d.type === documentType);
        const lastNumber = existingDocs.length > 0
          ? Math.max(...existingDocs.map(d => {
              const num = d.number.split('-')[1];
              return parseInt(num) || 0;
            }))
          : 0;
        const nextNumber = (lastNumber + 1).toString().padStart(3, '0');
        docNumber = `${documentType === 'invoice' ? 'INV' : 'QUO'}-${nextNumber}`;
      }
      
      const documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt'> = {
        type: documentType,
        number: docNumber,
        customerId: formData.customerId,
        customer: selectedCustomer,
        items: formData.items,
        subtotal: calculateSubtotal(),
        taxRate: formData.taxRate,
        taxAmount: calculateTax(),
        total: calculateTotal(),
        status: 'draft',
        issueDate: formData.issueDate,
        dueDate: formData.dueDate || undefined,
        notes: formData.notes,
      };
      onSubmit(documentData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {document ? `Edit ${documentType}` : `Create ${documentType}`}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer *
              </label>
              <select
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${submitted && validate().customerId ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select a customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.company}
                  </option>
                ))}
              </select>
              {submitted && validate().customerId && (
                <p className="text-xs text-red-600 mt-1">{validate().customerId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Date *
              </label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${submitted && validate().issueDate ? 'border-red-500' : 'border-gray-300'}`}
              />
              {submitted && validate().issueDate && (
                <p className="text-xs text-red-600 mt-1">{validate().issueDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${submitted && validate().dueDate ? 'border-red-500' : 'border-gray-300'}`}
              />
              {submitted && validate().dueDate && (
                <p className="text-xs text-red-600 mt-1">{validate().dueDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax Rate (%)
              </label>
              <input
                type="number"
                name="taxRate"
                value={formData.taxRate}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${submitted && validate().taxRate ? 'border-red-500' : 'border-gray-300'}`}
              />
              {submitted && validate().taxRate && (
                <p className="text-xs text-red-600 mt-1">{validate().taxRate}</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
              >
                Add Item
              </button>
            </div>

            <div className="space-y-2">
              {formData.items.map((item) => {
                const ie = submitted ? itemErrors(item) : {};
                return (
                <div key={item.id} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${ie.description ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {ie.description && <p className="text-xs text-red-600 mt-1">{ie.description}</p>}
                  </div>
                  <div className="w-20">
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                      min="0"
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${ie.quantity ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {ie.quantity && <p className="text-xs text-red-600 mt-1">{ie.quantity}</p>}
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      placeholder="Rate"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, { rate: parseFloat(e.target.value) || 0 })}
                      min="0"
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${ie.rate ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {ie.rate && <p className="text-xs text-red-600 mt-1">{ie.rate}</p>}
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      placeholder="Amount"
                      value={item.amount.toFixed(2)}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );})}
            </div>
            {submitted && validate().items && (
              <p className="text-sm text-red-600">{validate().items}</p>
            )}
          </div>

          <div className="border-t pt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT ({formData.taxRate}%):</span>
                  <span>R{calculateTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>R{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={formHasErrors()}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {document ? `Update ${documentType}` : `Create ${documentType}`}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InvoiceQuoteApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null);
  const [showSettingsForm, setShowSettingsForm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [statementCustomer, setStatementCustomer] = useState<Customer | null>(null);
  const [statementFilters, setStatementFilters] = useState<{ fromDate: string; toDate: string; unpaidOnly: boolean }>({ fromDate: '', toDate: '', unpaidOnly: false });
  const [reportFilters, setReportFilters] = useState<{ fromDate: string; toDate: string; reportType: 'sales' | 'vat' }>({ fromDate: '', toDate: '', reportType: 'sales' });
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Get brand colors with defaults
  const getPrimaryColor = () => businessSettings?.primaryColor || '#3B82F6';
  const getSecondaryColor = () => businessSettings?.secondaryColor || '#10B981';

  // PWA Install prompt handler
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show install prompt after a short delay
      setTimeout(() => setShowInstallPrompt(true), 2000);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      showToast('App installed successfully!');
    }
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };


  // Load customers from storage on mount
  useEffect(() => {
    loadCustomers();
    loadDocuments();
    loadBusinessSettings();
  }, []);

  const loadCustomers = async () => {
    try {
      const result = await window.storage.get('customers');
      if (result) {
        const customerData = JSON.parse(result.value);
        // Normalize: add customerNumber to any customers that don't have one
        const normalized = (() => {
          const custCopy: Customer[] = [...customerData];
          const validPattern = /^CUS-\d{3}$/;
          const usedNumbers = new Set<number>();
          
          // Collect existing valid customer numbers
          custCopy.forEach(c => {
            if (c.customerNumber && validPattern.test(c.customerNumber)) {
              const num = parseInt(c.customerNumber.split('-')[1], 10);
              if (!isNaN(num)) usedNumbers.add(num);
            }
          });
          
          // Helper to get next unused number
          const nextSequential = () => {
            let candidate = 1;
            while (usedNumbers.has(candidate)) candidate++;
            usedNumbers.add(candidate);
            return candidate;
          };
          
          // Add customer numbers to those missing them
          custCopy.forEach(c => {
            if (!c.customerNumber || !validPattern.test(c.customerNumber)) {
              const newNum = nextSequential();
              c.customerNumber = `CUS-${newNum.toString().padStart(3, '0')}`;
            }
          });
          
          return custCopy;
        })();
        
        setCustomers(normalized);
        // Persist normalization if any changes were made
        if (normalized.some((c: Customer, i: number) => c.customerNumber !== customerData[i]?.customerNumber)) {
          await window.storage.set('customers', JSON.stringify(normalized));
        }
      }
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCustomers = async (customerList: Customer[]) => {
    try {
      await window.storage.set('customers', JSON.stringify(customerList));
      setCustomers(customerList);
    } catch (error) {
      console.error('Failed to save customers:', error);
    }
  };

  const loadDocuments = async () => {
    try {
      const result = await window.storage.get('documents');
      if (result) {
        const documentData = JSON.parse(result.value);
        // Normalize any old timestamp-based numbers to new sequential format (INV-001 / QUO-001)
        const normalized = (() => {
          const docsCopy: Document[] = [...documentData];
          const prefixMap: { [key: string]: string } = { invoice: 'INV', quote: 'QUO' };
          const validPattern = /^(INV|QUO)-\d{3}$/;

          (['invoice', 'quote'] as const).forEach(type => {
            const typeDocs = docsCopy.filter(d => d.type === type);
            // Collect already used sequential numbers
            const usedNumbers = new Set<number>();
            typeDocs.forEach(d => {
              if (validPattern.test(d.number)) {
                const num = parseInt(d.number.split('-')[1], 10);
                if (!isNaN(num)) usedNumbers.add(num);
              }
            });
            // Helper to get next unused sequential number
            const nextSequential = () => {
              let candidate = 1;
              while (usedNumbers.has(candidate)) candidate++;
              usedNumbers.add(candidate);
              return candidate;
            };
            // Renumber only invalid patterns (timestamp or anything else)
            typeDocs.forEach(d => {
              if (!validPattern.test(d.number)) {
                const newNum = nextSequential();
                d.number = `${prefixMap[type]}-${newNum.toString().padStart(3, '0')}`;
              }
            });
          });
          return docsCopy;
        })();
        setDocuments(normalized);
        // Persist normalization if any changes were made
        if (normalized.some((d: Document, i: number) => d.number !== documentData[i].number)) {
          await window.storage.set('documents', JSON.stringify(normalized));
        }
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  const saveDocuments = async (documentList: Document[]) => {
    try {
      await window.storage.set('documents', JSON.stringify(documentList));
      setDocuments(documentList);
    } catch (error) {
      console.error('Failed to save documents:', error);
    }
  };

  const loadBusinessSettings = async () => {
    try {
      const result = await window.storage.get('businessSettings');
      if (result) {
        const settingsData = JSON.parse(result.value);
        setBusinessSettings(settingsData);
      }
    } catch (error) {
      console.error('Failed to load business settings:', error);
    }
  };

  const saveBusinessSettings = async (settings: BusinessSettings) => {
    try {
      await window.storage.set('businessSettings', JSON.stringify(settings));
      setBusinessSettings(settings);
    } catch (error) {
      console.error('Failed to save business settings:', error);
    }
  };

  const handleSettingsSubmit = async (settings: BusinessSettings) => {
    await saveBusinessSettings(settings);
    setShowSettingsForm(false);
    showToast('Business settings saved successfully!');
  };

  const addCustomer = async (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'customerNumber'>) => {
    // Generate next sequential customer number
    const existingNumbers = customers
      .map(c => {
        const match = c.customerNumber?.match(/^CUS-(\d{3})$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(n => n > 0);
    
    const nextNumber = existingNumbers.length > 0 
      ? Math.max(...existingNumbers) + 1 
      : 1;
    
    const customerNumber = `CUS-${nextNumber.toString().padStart(3, '0')}`;
    
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      customerNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedCustomers = [...customers, newCustomer];
    await saveCustomers(updatedCustomers);
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    const updatedCustomers = customers.map(customer =>
      customer.id === id
        ? { ...customer, ...updates, updatedAt: new Date().toISOString() }
        : customer
    );
    await saveCustomers(updatedCustomers);
  };

  const deleteCustomer = async (id: string) => {
    const updatedCustomers = customers.filter(customer => customer.id !== id);
    await saveCustomers(updatedCustomers);
  };

  const addDocument = async (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDocument: Document = {
      ...document,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedDocuments = [...documents, newDocument];
    await saveDocuments(updatedDocuments);
  };

  const updateDocument = async (id: string, updates: Partial<Document>) => {
    const updatedDocuments = documents.map(document =>
      document.id === id
        ? { ...document, ...updates, updatedAt: new Date().toISOString() }
        : document
    );
    await saveDocuments(updatedDocuments);
  };

  const deleteDocument = async (id: string) => {
    const updatedDocuments = documents.filter(document => document.id !== id);
    await saveDocuments(updatedDocuments);
  };

  const handleCustomerSubmit = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'customerNumber'>) => {
    if (editingCustomer) {
      await updateCustomer(editingCustomer.id, customerData);
      showToast('Customer updated successfully!');
    } else {
      await addCustomer(customerData);
      showToast('Customer added successfully!');
    }
    setShowCustomerForm(false);
    setEditingCustomer(null);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowCustomerForm(true);
  };

  const handleDeleteCustomer = async (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      await deleteCustomer(id);
      showToast('Customer deleted successfully!');
    }
  };

  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [documentType, setDocumentType] = useState<'invoice' | 'quote'>('invoice');

  const handleDocumentSubmit = async (documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingDocument) {
      await updateDocument(editingDocument.id, documentData);
      showToast(`${documentData.type === 'invoice' ? 'Invoice' : 'Quote'} updated successfully!`);
    } else {
      await addDocument(documentData);
      showToast(`${documentData.type === 'invoice' ? 'Invoice' : 'Quote'} created successfully!`);
    }
    setShowDocumentForm(false);
    setEditingDocument(null);
  };

  const handleEditDocument = (document: Document) => {
    setEditingDocument(document);
    setDocumentType(document.type);
    setShowDocumentForm(true);
  };

  const handleDeleteDocument = async (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      await deleteDocument(id);
      showToast('Document deleted successfully!');
    }
  };

  const handleCreateDocument = (type: 'invoice' | 'quote') => {
    setDocumentType(type);
    setEditingDocument(null);
    setShowDocumentForm(true);
  };

  // Currency formatter for ZAR
  const formatZAR = (value: number) =>
    new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(value);

  // PDF Export
  const exportDocumentToPDF = (doc: Document) => {
    const pdf = new jsPDF();

    let currentY = 14;

    // Business logo and info (if settings exist)
    if (businessSettings) {
      if (businessSettings.logoDataUrl) {
        try {
          pdf.addImage(businessSettings.logoDataUrl, 'PNG', 14, currentY, 40, 20);
          currentY += 24;
        } catch (err) {
          console.error('Error adding logo to PDF:', err);
        }
      }
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text(businessSettings.businessName, 14, currentY);
      currentY += 5;
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      if (businessSettings.address) {
        const addressLines = pdf.splitTextToSize(businessSettings.address, 80);
        pdf.text(addressLines, 14, currentY);
        currentY += addressLines.length * 4.5;
      }
      if (businessSettings.email) {
        pdf.text(businessSettings.email, 14, currentY);
        currentY += 4.5;
      }
      if (businessSettings.phone) {
        pdf.text(businessSettings.phone, 14, currentY);
        currentY += 4.5;
      }
      if (businessSettings.vatNumber) {
        pdf.text(`VAT: ${businessSettings.vatNumber}`, 14, currentY);
        currentY += 4.5;
      }
      if (businessSettings.companyRegistration) {
        pdf.text(`Reg: ${businessSettings.companyRegistration}`, 14, currentY);
        currentY += 4.5;
      }
      currentY += 6;
    }

    // Document header (invoice/quote)
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(doc.type === 'invoice' ? 'TAX INVOICE' : 'QUOTATION', 140, 20, { align: 'left' });
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    let docHeaderY = 28;
    pdf.text(`Number: ${doc.number}`, 140, docHeaderY); docHeaderY += 6;
    pdf.text(`Date: ${new Date(doc.issueDate).toLocaleDateString('en-ZA')}`, 140, docHeaderY); docHeaderY += 6;
    if (doc.dueDate) {
      pdf.text(
        `${doc.type === 'invoice' ? 'Due' : 'Valid until'}: ${new Date(doc.dueDate).toLocaleDateString('en-ZA')}`,
        140,
        docHeaderY
      );
      docHeaderY += 6;
    }
    pdf.text(`Status: ${doc.status}`, 140, docHeaderY);

    // Ensure we have enough space before customer block
    if (currentY < 60) currentY = 60;

    // Customer block
    const c = doc.customer;
    if (c) {
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Bill To:', 14, currentY);
      currentY += 5;
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(c.name, 14, currentY); currentY += 4.5;
      pdf.text(c.company, 14, currentY); currentY += 4.5;
      if (c.address) { 
        const custAddrLines = pdf.splitTextToSize(c.address, 80);
        pdf.text(custAddrLines, 14, currentY); 
        currentY += custAddrLines.length * 4.5;
      }
      if (c.email) { pdf.text(c.email, 14, currentY); currentY += 4.5; }
      if (c.phone) { pdf.text(c.phone, 14, currentY); currentY += 4.5; }
      if (c.vatNumber) { pdf.text(`VAT: ${c.vatNumber}`, 14, currentY); currentY += 4.5; }
      if (c.companyRegistration) { pdf.text(`Reg: ${c.companyRegistration}`, 14, currentY); currentY += 4.5; }
    }

    currentY += 6;

    // Items table
    const tableBody = doc.items.map(i => [
      i.description,
      i.quantity.toString(),
      formatZAR(i.rate),
      formatZAR(i.amount),
    ]);

    autoTable(pdf, {
      startY: currentY,
      head: [['Description', 'Qty', 'Rate', 'Amount']],
      body: tableBody,
      styles: { fontSize: 10 },
      columnStyles: {
        1: { halign: 'right' },
        2: { halign: 'right' },
        3: { halign: 'right' },
      },
    });

    // Totals
    const finalY = (pdf as any).lastAutoTable?.finalY || 120;
    const lineYStart = finalY + 6;
    pdf.setDrawColor(200);
    pdf.line(14, lineYStart, 196, lineYStart);

    let y = lineYStart + 8;

    // Totals on the right
    pdf.setFontSize(10);
    pdf.text(`Subtotal: ${formatZAR(doc.subtotal)}`, 196, y, { align: 'right' }); y += 6;
    pdf.text(`VAT (${doc.taxRate}%): ${formatZAR(doc.taxAmount)}`, 196, y, { align: 'right' }); y += 6;
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Total: ${formatZAR(doc.total)}`, 196, y, { align: 'right' });
    pdf.setFont('helvetica', 'normal');

    // Notes
    if (doc.notes) {
      y += 12;
      pdf.setFontSize(12);
      pdf.text('Notes', 14, y);
      pdf.setFontSize(10);
      const split = pdf.splitTextToSize(doc.notes, 180);
      pdf.text(split, 14, y + 6);
    }

    // Banking details at bottom center (only for invoices and if available)
    if (doc.type === 'invoice' && businessSettings && (businessSettings.bankName || businessSettings.accountNumber)) {
      let bankingY = 250; // Fixed position near bottom
      pdf.setTextColor(100, 100, 100); // Gray color (lighter)
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Banking Details', 105, bankingY, { align: 'center' });
      bankingY += 5;
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      
      const bankingLines = [];
      if (businessSettings.bankName) bankingLines.push(`Bank: ${businessSettings.bankName}`);
      if (businessSettings.accountHolder) bankingLines.push(`Account Holder: ${businessSettings.accountHolder}`);
      if (businessSettings.accountNumber) bankingLines.push(`Account Number: ${businessSettings.accountNumber}`);
      if (businessSettings.branchCode) bankingLines.push(`Branch Code: ${businessSettings.branchCode}`);
      
      bankingLines.forEach(line => {
        pdf.text(line, 105, bankingY, { align: 'center' });
        bankingY += 4;
      });
    }

    // Footer
    pdf.setFontSize(9);
    pdf.setTextColor(120);
    pdf.text('Generated by Invoiza', 14, 285);

    pdf.save(`${doc.number}.pdf`);
  };

  // Share PDF using Web Share API (native share on mobile/desktop)
  const sharePDF = async (doc: Document) => {
    try {
      // Generate PDF blob instead of downloading
      const pdf = new jsPDF();
      let currentY = 14;

      // Business logo and info (reuse same logic as exportDocumentToPDF)
      if (businessSettings) {
        if (businessSettings.logoDataUrl) {
          try {
            pdf.addImage(businessSettings.logoDataUrl, 'PNG', 14, currentY, 40, 20);
            currentY += 24;
          } catch (err) {
            console.error('Error adding logo to PDF:', err);
          }
        }
        
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(businessSettings.businessName, 14, currentY);
        currentY += 5;
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        if (businessSettings.address) {
          const addressLines = pdf.splitTextToSize(businessSettings.address, 80);
          pdf.text(addressLines, 14, currentY);
          currentY += addressLines.length * 4.5;
        }
        if (businessSettings.email) {
          pdf.text(businessSettings.email, 14, currentY);
          currentY += 4.5;
        }
        if (businessSettings.phone) {
          pdf.text(businessSettings.phone, 14, currentY);
          currentY += 4.5;
        }
        if (businessSettings.vatNumber) {
          pdf.text(`VAT: ${businessSettings.vatNumber}`, 14, currentY);
          currentY += 4.5;
        }
        if (businessSettings.companyRegistration) {
          pdf.text(`Reg: ${businessSettings.companyRegistration}`, 14, currentY);
          currentY += 4.5;
        }
        currentY += 6;
      }

      // Document header
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text(doc.type === 'invoice' ? 'TAX INVOICE' : 'QUOTATION', 140, 20, { align: 'left' });
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      let docHeaderY = 28;
      pdf.text(`Number: ${doc.number}`, 140, docHeaderY); docHeaderY += 6;
      pdf.text(`Date: ${new Date(doc.issueDate).toLocaleDateString('en-ZA')}`, 140, docHeaderY); docHeaderY += 6;
      if (doc.dueDate) {
        pdf.text(
          `${doc.type === 'invoice' ? 'Due' : 'Valid until'}: ${new Date(doc.dueDate).toLocaleDateString('en-ZA')}`,
          140,
          docHeaderY
        );
        docHeaderY += 6;
      }
      pdf.text(`Status: ${doc.status}`, 140, docHeaderY);

      if (currentY < 60) currentY = 60;

      // Customer block
      const c = doc.customer;
      if (c) {
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Bill To:', 14, currentY);
        currentY += 5;
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.text(c.name, 14, currentY); currentY += 4.5;
        pdf.text(c.company, 14, currentY); currentY += 4.5;
        if (c.address) { 
          const custAddrLines = pdf.splitTextToSize(c.address, 80);
          pdf.text(custAddrLines, 14, currentY); 
          currentY += custAddrLines.length * 4.5;
        }
        if (c.email) { pdf.text(c.email, 14, currentY); currentY += 4.5; }
        if (c.phone) { pdf.text(c.phone, 14, currentY); currentY += 4.5; }
        if (c.vatNumber) { pdf.text(`VAT: ${c.vatNumber}`, 14, currentY); currentY += 4.5; }
        if (c.companyRegistration) { pdf.text(`Reg: ${c.companyRegistration}`, 14, currentY); currentY += 4.5; }
      }

      currentY += 6;

      // Items table
      const tableBody = doc.items.map(i => [
        i.description,
        i.quantity.toString(),
        formatZAR(i.rate),
        formatZAR(i.amount),
      ]);

      autoTable(pdf, {
        startY: currentY,
        head: [['Description', 'Qty', 'Rate', 'Amount']],
        body: tableBody,
        styles: { fontSize: 10 },
        columnStyles: {
          1: { halign: 'right' },
          2: { halign: 'right' },
          3: { halign: 'right' },
        },
      });

      // Totals
      const finalY = (pdf as any).lastAutoTable?.finalY || 120;
      const lineYStart = finalY + 6;
      pdf.setDrawColor(200);
      pdf.line(14, lineYStart, 196, lineYStart);

      let y = lineYStart + 8;

      // Totals on the right
      pdf.setFontSize(10);
      pdf.text(`Subtotal: ${formatZAR(doc.subtotal)}`, 196, y, { align: 'right' }); y += 6;
      pdf.text(`VAT (${doc.taxRate}%): ${formatZAR(doc.taxAmount)}`, 196, y, { align: 'right' }); y += 6;
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Total: ${formatZAR(doc.total)}`, 196, y, { align: 'right' });
      pdf.setFont('helvetica', 'normal');

      // Notes
      if (doc.notes) {
        y += 12;
        pdf.setFontSize(12);
        pdf.text('Notes', 14, y);
        pdf.setFontSize(10);
        const split = pdf.splitTextToSize(doc.notes, 180);
        pdf.text(split, 14, y + 6);
      }

      // Banking details at bottom center (only for invoices and if available)
      if (doc.type === 'invoice' && businessSettings && (businessSettings.bankName || businessSettings.accountNumber)) {
        let bankingY = 250; // Fixed position near bottom
        pdf.setTextColor(100, 100, 100); // Gray color (lighter)
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Banking Details', 105, bankingY, { align: 'center' });
        bankingY += 5;
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        
        const bankingLines = [];
        if (businessSettings.bankName) bankingLines.push(`Bank: ${businessSettings.bankName}`);
        if (businessSettings.accountHolder) bankingLines.push(`Account Holder: ${businessSettings.accountHolder}`);
        if (businessSettings.accountNumber) bankingLines.push(`Account Number: ${businessSettings.accountNumber}`);
        if (businessSettings.branchCode) bankingLines.push(`Branch Code: ${businessSettings.branchCode}`);
        
        bankingLines.forEach(line => {
          pdf.text(line, 105, bankingY, { align: 'center' });
          bankingY += 4;
        });
      }

      pdf.setFontSize(9);
      pdf.setTextColor(120);
      pdf.text('Generated by Invoiza', 14, 285);

      // Convert PDF to blob
      const pdfBlob = pdf.output('blob');
      const file = new File([pdfBlob], `${doc.number}.pdf`, { type: 'application/pdf' });

      // Check if Web Share API is supported
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${doc.type === 'invoice' ? 'Invoice' : 'Quote'} ${doc.number}`,
          text: `${doc.type === 'invoice' ? 'Invoice' : 'Quote'} for ${doc.customer?.name || 'customer'} - Total: ${formatZAR(doc.total)}`,
          files: [file]
        });
        showToast('PDF shared successfully');
      } else {
        // Fallback: download the PDF
        pdf.save(`${doc.number}.pdf`);
        showToast('Share not supported - PDF downloaded instead');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        showToast('Share cancelled');
      } else {
        console.error('Share failed:', err);
        showToast('Share failed - try download instead', 'error');
      }
    }
  };

  // Share invoice via email (mailto)
  const shareViaEmail = (doc: Document) => {
    const customer = doc.customer;
    const subject = `${doc.type === 'invoice' ? 'Invoice' : 'Quote'} ${doc.number}`;
    const body = `Dear ${customer?.name || 'Customer'},

Please find attached ${doc.type === 'invoice' ? 'invoice' : 'quote'} ${doc.number}.

Details:
- Number: ${doc.number}
- Date: ${new Date(doc.issueDate).toLocaleDateString('en-ZA')}
${doc.dueDate ? `- Due: ${new Date(doc.dueDate).toLocaleDateString('en-ZA')}` : ''}
- Total: ${formatZAR(doc.total)}

${businessSettings?.businessName ? `\n${businessSettings.businessName}` : ''}
${businessSettings?.phone ? `Phone: ${businessSettings.phone}` : ''}
${businessSettings?.email ? `Email: ${businessSettings.email}` : ''}

Please download the PDF separately and attach it to your email.`;

    const mailtoLink = `mailto:${customer?.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    showToast('Email client opened');
  };

  // Copy invoice details to clipboard
  const copyInvoiceDetails = async (doc: Document) => {
    const customer = doc.customer;
    const text = `${doc.type === 'invoice' ? 'INVOICE' : 'QUOTE'} ${doc.number}

Customer: ${customer?.name || 'N/A'}
Company: ${customer?.company || 'N/A'}
Date: ${new Date(doc.issueDate).toLocaleDateString('en-ZA')}
${doc.dueDate ? `Due: ${new Date(doc.dueDate).toLocaleDateString('en-ZA')}\n` : ''}
Items:
${doc.items.map(item => `- ${item.description}: ${item.quantity} x ${formatZAR(item.rate)} = ${formatZAR(item.amount)}`).join('\n')}

Subtotal: ${formatZAR(doc.subtotal)}
VAT (${doc.taxRate}%): ${formatZAR(doc.taxAmount)}
TOTAL: ${formatZAR(doc.total)}

${businessSettings?.bankName ? `\nBanking Details:\nBank: ${businessSettings.bankName}\nAccount: ${businessSettings.accountNumber || 'N/A'}\nBranch: ${businessSettings.branchCode || 'N/A'}` : ''}

${businessSettings?.businessName || ''}
${businessSettings?.email || ''}
${businessSettings?.phone || ''}`;

    try {
      await navigator.clipboard.writeText(text);
      showToast('Invoice details copied to clipboard');
    } catch (err) {
      showToast('Failed to copy', 'error');
    }
  };

  // Export a consolidated customer statement (summary of invoices)
  type StatementOptions = { fromDate?: string; toDate?: string; unpaidOnly?: boolean };

  const exportCustomerStatement = (customer: Customer, opts: StatementOptions = {}) => {
    const pdf = new jsPDF();
    let y = 14;

    // Business header (if available)
    if (businessSettings) {
      if (businessSettings.logoDataUrl) {
        try {
          pdf.addImage(businessSettings.logoDataUrl, 'PNG', 14, y, 40, 20);
          y += 24;
        } catch (err) {
          console.error('Error adding logo to PDF:', err);
        }
      }
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text(businessSettings.businessName, 14, y); y += 5;
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      if (businessSettings.address) { const lines = pdf.splitTextToSize(businessSettings.address, 80); pdf.text(lines, 14, y); y += lines.length * 4.5; }
      if (businessSettings.email) { pdf.text(businessSettings.email, 14, y); y += 4.5; }
      if (businessSettings.phone) { pdf.text(businessSettings.phone, 14, y); y += 4.5; }
      if (businessSettings.vatNumber) { pdf.text(`VAT: ${businessSettings.vatNumber}`, 14, y); y += 4.5; }
      if (businessSettings.companyRegistration) { pdf.text(`Reg: ${businessSettings.companyRegistration}`, 14, y); y += 4.5; }
      y += 6;
    }

    // Title
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Customer Statement', 140, 20, { align: 'left' });

    // Customer info
    y = Math.max(y, 60);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Customer:', 14, y); y += 5;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text(customer.name, 14, y); y += 4.5;
    pdf.text(customer.company, 14, y); y += 4.5;
    if (customer.address) { const cl = pdf.splitTextToSize(customer.address, 80); pdf.text(cl, 14, y); y += cl.length * 4.5; }
    if (customer.email) { pdf.text(customer.email, 14, y); y += 4.5; }
    if (customer.phone) { pdf.text(customer.phone, 14, y); y += 4.5; }
    if (customer.vatNumber) { pdf.text(`VAT: ${customer.vatNumber}`, 14, y); y += 4.5; }
    if (customer.companyRegistration) { pdf.text(`Reg: ${customer.companyRegistration}`, 14, y); y += 4.5; }

    y += 4;

    let customerInvoices = documents.filter(d => d.type === 'invoice' && d.customerId === customer.id);
    // Apply date range filters on issueDate
    if (opts.fromDate) {
      const from = new Date(opts.fromDate);
      customerInvoices = customerInvoices.filter(d => new Date(d.issueDate) >= from);
    }
    if (opts.toDate) {
      const to = new Date(opts.toDate);
      // inclusive of the end date
      to.setHours(23,59,59,999);
      customerInvoices = customerInvoices.filter(d => new Date(d.issueDate) <= to);
    }
    if (opts.unpaidOnly) {
      customerInvoices = customerInvoices.filter(d => d.status !== 'paid');
    }
    const totalInvoiced = customerInvoices.reduce((sum, d) => sum + d.total, 0);
    const totalPaid = customerInvoices.filter(d => d.status === 'paid').reduce((sum, d) => sum + d.total, 0);
    const totalOutstanding = customerInvoices.filter(d => d.status !== 'paid').reduce((sum, d) => sum + d.total, 0);

    pdf.setFont('helvetica', 'bold');
  pdf.text('Summary', 14, y); y += 6;
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Total Invoiced: ${formatZAR(totalInvoiced)}`, 14, y); y += 5;
    pdf.text(`Total Paid: ${formatZAR(totalPaid)}`, 14, y); y += 5;
    pdf.text(`Outstanding: ${formatZAR(totalOutstanding)}`, 14, y); y += 8;

    if (customerInvoices.length === 0) {
      pdf.text('No invoices for this customer.', 14, y);
    } else {
      autoTable(pdf, {
        startY: y,
        head: [['Number', 'Issue Date', 'Due Date', 'Status', 'Subtotal', 'VAT', 'Total', 'Outstanding']],
        body: customerInvoices.map(inv => [
          inv.number,
          new Date(inv.issueDate).toLocaleDateString('en-ZA'),
          inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('en-ZA') : '-',
          inv.status,
          formatZAR(inv.subtotal),
          formatZAR(inv.taxAmount),
          formatZAR(inv.total),
          inv.status === 'paid' ? formatZAR(0) : formatZAR(inv.total)
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [30, 64, 175] },
      });

      // Aging Report
      const today = new Date();
      const unpaidInvoices = customerInvoices.filter(inv => inv.status !== 'paid');
      
      let current = 0;      // Not yet due or due within 30 days
      let days30 = 0;       // 31-60 days overdue
      let days60 = 0;       // 61-90 days overdue
      let days90 = 0;       // 91-120 days overdue
      let days90Plus = 0;   // 120+ days overdue

      unpaidInvoices.forEach(inv => {
        if (!inv.dueDate) {
          current += inv.total;
          return;
        }
        const dueDate = new Date(inv.dueDate);
        const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysOverdue <= 0) {
          current += inv.total;
        } else if (daysOverdue <= 30) {
          days30 += inv.total;
        } else if (daysOverdue <= 60) {
          days60 += inv.total;
        } else if (daysOverdue <= 90) {
          days90 += inv.total;
        } else {
          days90Plus += inv.total;
        }
      });

      // Position aging report at bottom of page
      const agingYStart = 240;
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Aging Report', 105, agingYStart, { align: 'center' });
      pdf.setFont('helvetica', 'normal');

      autoTable(pdf, {
        startY: agingYStart + 5,
        head: [['Current', '1-30 Days', '31-60 Days', '61-90 Days', '90+ Days', 'Total']],
        body: [[
          formatZAR(current),
          formatZAR(days30),
          formatZAR(days60),
          formatZAR(days90),
          formatZAR(days90Plus),
          formatZAR(current + days30 + days60 + days90 + days90Plus)
        ]],
        styles: { fontSize: 9, halign: 'right' },
        headStyles: { fillColor: [220, 38, 38], halign: 'center', fontSize: 9 },
        theme: 'grid',
        margin: { left: 14, right: 14 },
      });
    }

    pdf.setFontSize(9);
    pdf.setTextColor(120);
    pdf.text('Generated by Invoiza', 14, 285);

    const safeName = (customer.company || customer.name).replace(/[^a-z0-9-_]+/gi, '_');
    const from = opts.fromDate ? opts.fromDate : 'start';
    const to = opts.toDate ? opts.toDate : 'today';
    pdf.save(`Statement-${safeName}-${from}_to_${to}${opts.unpaidOnly ? '-unpaid' : ''}.pdf`);
  };

  // Share customer statement via email
  const shareStatementViaEmail = (customer: Customer, opts: StatementOptions = {}) => {
    const subject = `Customer Statement - ${customer.company || customer.name}`;
    const period = opts.fromDate && opts.toDate ? `${opts.fromDate} to ${opts.toDate}` : 'All Time';
    const unpaidText = opts.unpaidOnly ? ' (Unpaid Invoices Only)' : '';
    
    const customerInvoices = documents.filter(d => {
      if (d.type !== 'invoice' || d.customerId !== customer.id) return false;
      if (opts.fromDate && new Date(d.issueDate) < new Date(opts.fromDate)) return false;
      if (opts.toDate && new Date(d.issueDate) > new Date(opts.toDate)) return false;
      if (opts.unpaidOnly && d.status === 'paid') return false;
      return true;
    });
    
    const totalOutstanding = customerInvoices.filter(d => d.status !== 'paid').reduce((sum, d) => sum + d.total, 0);
    
    const body = `Dear ${customer.name},

Please find your customer statement for the period: ${period}${unpaidText}

Total Outstanding: ${formatZAR(totalOutstanding)}

For detailed statement, please see the attached PDF.

Best regards,
${businessSettings?.businessName || 'Your Company'}`;

    const mailto = `mailto:${customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    showToast('Email client opened');
  };

  // Copy statement summary to clipboard
  const copyStatementDetails = async (customer: Customer, opts: StatementOptions = {}) => {
    const period = opts.fromDate && opts.toDate ? `${opts.fromDate} to ${opts.toDate}` : 'All Time';
    const unpaidText = opts.unpaidOnly ? ' (Unpaid Only)' : '';
    
    const customerInvoices = documents.filter(d => {
      if (d.type !== 'invoice' || d.customerId !== customer.id) return false;
      if (opts.fromDate && new Date(d.issueDate) < new Date(opts.fromDate)) return false;
      if (opts.toDate && new Date(d.issueDate) > new Date(opts.toDate)) return false;
      if (opts.unpaidOnly && d.status === 'paid') return false;
      return true;
    });
    
    const totalInvoiced = customerInvoices.reduce((sum, d) => sum + d.total, 0);
    const totalPaid = customerInvoices.filter(d => d.status === 'paid').reduce((sum, d) => sum + d.total, 0);
    const totalOutstanding = customerInvoices.filter(d => d.status !== 'paid').reduce((sum, d) => sum + d.total, 0);
    
    const text = `CUSTOMER STATEMENT
${customer.name} - ${customer.company}
Period: ${period}${unpaidText}

Summary:
Total Invoiced: ${formatZAR(totalInvoiced)}
Total Paid: ${formatZAR(totalPaid)}
Outstanding: ${formatZAR(totalOutstanding)}

Invoices (${customerInvoices.length}):
${customerInvoices.map(inv => `${inv.number} - ${new Date(inv.issueDate).toLocaleDateString('en-ZA')} - ${inv.status} - ${formatZAR(inv.total)}`).join('\n')}

${businessSettings?.businessName || ''}
${businessSettings?.email || ''}
${businessSettings?.phone || ''}`;

    try {
      await navigator.clipboard.writeText(text);
      showToast('Statement details copied to clipboard');
    } catch (err) {
      showToast('Failed to copy', 'error');
    }
  };

  // Share statement PDF using Web Share API
  const shareStatementPDF = async (customer: Customer, opts: StatementOptions = {}) => {
    try {
      // Generate PDF blob - reuse the same logic as exportCustomerStatement
      const pdf = new jsPDF();
      let y = 14;

      // Business header
      if (businessSettings) {
        if (businessSettings.logoDataUrl) {
          try {
            pdf.addImage(businessSettings.logoDataUrl, 'PNG', 14, y, 40, 20);
            y += 24;
          } catch (err) {
            console.error('Error adding logo:', err);
          }
        }
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(businessSettings.businessName, 14, y); y += 5;
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        if (businessSettings.address) { const lines = pdf.splitTextToSize(businessSettings.address, 80); pdf.text(lines, 14, y); y += lines.length * 4.5; }
        if (businessSettings.email) { pdf.text(businessSettings.email, 14, y); y += 4.5; }
        if (businessSettings.phone) { pdf.text(businessSettings.phone, 14, y); y += 4.5; }
        if (businessSettings.vatNumber) { pdf.text(`VAT: ${businessSettings.vatNumber}`, 14, y); y += 4.5; }
        if (businessSettings.companyRegistration) { pdf.text(`Reg: ${businessSettings.companyRegistration}`, 14, y); y += 4.5; }
        y += 6;
      }

      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Customer Statement', 140, 20, { align: 'left' });

      y = Math.max(y, 60);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Customer:', 14, y); y += 5;
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(customer.name, 14, y); y += 4.5;
      pdf.text(customer.company, 14, y); y += 4.5;
      if (customer.address) { const cl = pdf.splitTextToSize(customer.address, 80); pdf.text(cl, 14, y); y += cl.length * 4.5; }
      if (customer.email) { pdf.text(customer.email, 14, y); y += 4.5; }
      if (customer.phone) { pdf.text(customer.phone, 14, y); y += 4.5; }
      if (customer.vatNumber) { pdf.text(`VAT: ${customer.vatNumber}`, 14, y); y += 4.5; }
      if (customer.companyRegistration) { pdf.text(`Reg: ${customer.companyRegistration}`, 14, y); y += 4.5; }
      y += 4;

      let customerInvoices = documents.filter(d => d.type === 'invoice' && d.customerId === customer.id);
      if (opts.fromDate) {
        const from = new Date(opts.fromDate);
        customerInvoices = customerInvoices.filter(d => new Date(d.issueDate) >= from);
      }
      if (opts.toDate) {
        const to = new Date(opts.toDate);
        to.setHours(23,59,59,999);
        customerInvoices = customerInvoices.filter(d => new Date(d.issueDate) <= to);
      }
      if (opts.unpaidOnly) {
        customerInvoices = customerInvoices.filter(d => d.status !== 'paid');
      }

      const totalInvoiced = customerInvoices.reduce((sum, d) => sum + d.total, 0);
      const totalPaid = customerInvoices.filter(d => d.status === 'paid').reduce((sum, d) => sum + d.total, 0);
      const totalOutstanding = customerInvoices.filter(d => d.status !== 'paid').reduce((sum, d) => sum + d.total, 0);

      pdf.setFont('helvetica', 'bold');
      pdf.text('Summary', 14, y); y += 6;
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Total Invoiced: ${formatZAR(totalInvoiced)}`, 14, y); y += 5;
      pdf.text(`Total Paid: ${formatZAR(totalPaid)}`, 14, y); y += 5;
      pdf.text(`Outstanding: ${formatZAR(totalOutstanding)}`, 14, y); y += 8;

      if (customerInvoices.length > 0) {
        autoTable(pdf, {
          startY: y,
          head: [['Number', 'Issue Date', 'Due Date', 'Status', 'Subtotal', 'VAT', 'Total', 'Outstanding']],
          body: customerInvoices.map(inv => [
            inv.number,
            new Date(inv.issueDate).toLocaleDateString('en-ZA'),
            inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('en-ZA') : '-',
            inv.status,
            formatZAR(inv.subtotal),
            formatZAR(inv.taxAmount),
            formatZAR(inv.total),
            inv.status === 'paid' ? formatZAR(0) : formatZAR(inv.total)
          ]),
          styles: { fontSize: 9 },
          headStyles: { fillColor: [30, 64, 175] },
        });

        // Aging report
        const today = new Date();
        const unpaidInvoices = customerInvoices.filter(inv => inv.status !== 'paid');
        let current = 0, days30 = 0, days60 = 0, days90 = 0, days90Plus = 0;
        unpaidInvoices.forEach(inv => {
          if (!inv.dueDate) { current += inv.total; return; }
          const dueDate = new Date(inv.dueDate);
          const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
          if (daysOverdue <= 0) current += inv.total;
          else if (daysOverdue <= 30) days30 += inv.total;
          else if (daysOverdue <= 60) days60 += inv.total;
          else if (daysOverdue <= 90) days90 += inv.total;
          else days90Plus += inv.total;
        });

        const agingYStart = 240;
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Aging Report', 105, agingYStart, { align: 'center' });
        pdf.setFont('helvetica', 'normal');
        autoTable(pdf, {
          startY: agingYStart + 5,
          head: [['Current', '1-30 Days', '31-60 Days', '61-90 Days', '90+ Days', 'Total']],
          body: [[
            formatZAR(current),
            formatZAR(days30),
            formatZAR(days60),
            formatZAR(days90),
            formatZAR(days90Plus),
            formatZAR(current + days30 + days60 + days90 + days90Plus)
          ]],
          styles: { fontSize: 9, halign: 'right' },
          headStyles: { fillColor: [220, 38, 38], halign: 'center', fontSize: 9 },
          theme: 'grid',
          margin: { left: 14, right: 14 },
        });
      }

      pdf.setFontSize(9);
      pdf.setTextColor(120);
      pdf.text('Generated by Invoiza', 14, 285);

      const pdfBlob = pdf.output('blob');
      const safeName = (customer.company || customer.name).replace(/[^a-z0-9-_]+/gi, '_');
      const from = opts.fromDate || 'start';
      const to = opts.toDate || 'today';
      const filename = `Statement-${safeName}-${from}_to_${to}${opts.unpaidOnly ? '-unpaid' : ''}.pdf`;
      const file = new File([pdfBlob], filename, { type: 'application/pdf' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Statement - ${customer.company || customer.name}`,
          text: `Customer statement for ${customer.name}`,
          files: [file]
        });
        showToast('Statement shared successfully');
      } else {
        pdf.save(filename);
        showToast('Share not supported - Statement downloaded instead');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        showToast('Share cancelled');
      } else {
        console.error('Share failed:', err);
        showToast('Share failed - try download instead', 'error');
      }
    }
  };

  // Dashboard derived data
  const invoiceDocs = documents.filter(d => d.type === 'invoice');
  const quoteDocs = documents.filter(d => d.type === 'quote');
  const totalRevenue = invoiceDocs
    .filter(d => d.status === 'paid')
    .reduce((sum, d) => sum + d.total, 0);
  const pendingAmount = invoiceDocs
    .filter(d => d.status !== 'paid')
    .reduce((sum, d) => sum + d.total, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* PWA Install Prompt */}
      {showInstallPrompt && deferredPrompt && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 animate-slide-in">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Download size={24} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Install App</h3>
              <p className="text-sm text-gray-600 mb-3">Add to your home screen for quick access and offline use!</p>
              <div className="flex gap-2">
                <button
                  onClick={handleInstallClick}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  Install
                </button>
                <button
                  onClick={() => setShowInstallPrompt(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
                >
                  Not now
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowInstallPrompt(false)}
              className="shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Customer Form Modal */}
      {showCustomerForm && (
        <CustomerForm
          customer={editingCustomer}
          onSubmit={handleCustomerSubmit}
          onCancel={() => {
            setShowCustomerForm(false);
            setEditingCustomer(null);
          }}
        />
      )}

      {/* Document Form Modal */}
      {showDocumentForm && (
        <DocumentForm
          document={editingDocument}
          documentType={documentType}
          customers={customers}
          documents={documents}
          onSubmit={handleDocumentSubmit}
          onCancel={() => {
            setShowDocumentForm(false);
            setEditingDocument(null);
          }}
        />
      )}

      {/* Settings Form Modal */}
      {showSettingsForm && (
        <SettingsForm
          settings={businessSettings}
          onSubmit={handleSettingsSubmit}
          onCancel={() => setShowSettingsForm(false)}
        />
      )}

      {/* Customer Statement Modal */}
      {showStatementModal && statementCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Customer Statement</h2>
              <button onClick={() => setShowStatementModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                exportCustomerStatement(statementCustomer, {
                  fromDate: statementFilters.fromDate || undefined,
                  toDate: statementFilters.toDate || undefined,
                  unpaidOnly: statementFilters.unpaidOnly,
                });
                setShowStatementModal(false);
                showToast('Statement downloaded');
              }}
              className="p-6 space-y-4"
            >
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From date</label>
                  <input
                    type="date"
                    value={statementFilters.fromDate}
                    onChange={(e) => setStatementFilters(prev => ({ ...prev, fromDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To date</label>
                  <input
                    type="date"
                    value={statementFilters.toDate}
                    onChange={(e) => setStatementFilters(prev => ({ ...prev, toDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="unpaidOnly"
                    type="checkbox"
                    checked={statementFilters.unpaidOnly}
                    onChange={(e) => setStatementFilters(prev => ({ ...prev, unpaidOnly: e.target.checked }))}
                    className="h-4 w-4"
                  />
                  <label htmlFor="unpaidOnly" className="text-sm text-gray-700">Unpaid only</label>
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2">
                  <Download size={18} />
                  Download PDF
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      shareStatementViaEmail(statementCustomer, {
                        fromDate: statementFilters.fromDate || undefined,
                        toDate: statementFilters.toDate || undefined,
                        unpaidOnly: statementFilters.unpaidOnly,
                      });
                    }}
                    className="flex-1 bg-green-600 text-white py-2 px-3 rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
                    title="Email statement"
                  >
                    <Mail size={18} />
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      copyStatementDetails(statementCustomer, {
                        fromDate: statementFilters.fromDate || undefined,
                        toDate: statementFilters.toDate || undefined,
                        unpaidOnly: statementFilters.unpaidOnly,
                      });
                    }}
                    className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-md hover:bg-purple-700 flex items-center justify-center gap-2"
                    title="Copy statement details"
                  >
                    <Copy size={18} />
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      shareStatementPDF(statementCustomer, {
                        fromDate: statementFilters.fromDate || undefined,
                        toDate: statementFilters.toDate || undefined,
                        unpaidOnly: statementFilters.unpaidOnly,
                      });
                    }}
                    className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded-md hover:bg-indigo-700 flex items-center justify-center gap-2"
                    title="Share PDF"
                  >
                    <Share2 size={18} />
                    Share
                  </button>
                </div>
                <button type="button" onClick={() => setShowStatementModal(false)} className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Invoiza</h1>
            <div className="flex items-center gap-2">
              {deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium"
                  title="Install Invoiza App"
                >
                  <Download size={20} />
                  <span className="hidden sm:inline">Install App</span>
                </button>
              )}
              <button
                onClick={() => setShowSettingsForm(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Business Settings"
              >
                <Settings size={20} />
                <span className="hidden sm:inline">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'dashboard' ? 'text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            style={activeTab === 'dashboard' ? { backgroundColor: getPrimaryColor() } : {}}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'invoices' ? 'text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            style={activeTab === 'invoices' ? { backgroundColor: getPrimaryColor() } : {}}
          >
            Invoices
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'quotes' ? 'text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            style={activeTab === 'quotes' ? { backgroundColor: getPrimaryColor() } : {}}
          >
            Quotes
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'customers' ? 'text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            style={activeTab === 'customers' ? { backgroundColor: getPrimaryColor() } : {}}
          >
            Customers
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'reports' ? 'text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            style={activeTab === 'reports' ? { backgroundColor: getPrimaryColor() } : {}}
          >
            Reports
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-linear-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-sm border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="bg-white/70 backdrop-blur p-3 rounded-lg border border-blue-200">
                    <FileText className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-blue-700 font-semibold">Total Invoices</p>
                    <p className="text-2xl font-bold text-blue-900">{invoiceDocs.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-linear-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow-sm border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="bg-white/70 backdrop-blur p-3 rounded-lg border border-purple-200">
                    <FileText className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-purple-700 font-semibold">Total Quotes</p>
                    <p className="text-2xl font-bold text-purple-900">{quoteDocs.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-linear-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-sm border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="bg-white/70 backdrop-blur p-3 rounded-lg border border-green-200">
                    <FileText className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-green-700 font-semibold">Total Revenue (Paid)</p>
                    <p className="text-2xl font-bold text-green-900">{formatZAR(totalRevenue)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-linear-to-br from-orange-50 to-orange-100 p-6 rounded-lg shadow-sm border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="bg-white/70 backdrop-blur p-3 rounded-lg border border-orange-200">
                    <FileText className="text-orange-600" size={24} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-orange-700 font-semibold">Pending (Unpaid)</p>
                    <p className="text-2xl font-bold text-orange-900">{formatZAR(pendingAmount)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => handleCreateDocument('invoice')}
                    className="w-full text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90"
                    style={{ backgroundColor: getPrimaryColor() }}
                  >
                    <Plus size={20} /> Create Invoice
                  </button>
                  <button 
                    onClick={() => handleCreateDocument('quote')}
                    className="w-full text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90"
                    style={{ backgroundColor: getSecondaryColor() }}
                  >
                    <Plus size={20} /> Create Quote
                  </button>
                  <button 
                    onClick={() => setShowCustomerForm(true)}
                    className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2"
                  >
                    <Plus size={20} /> Add Customer
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Recent Documents</h3>
                {documents.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">No documents yet</div>
                ) : (
                  <div className="space-y-3">
                    {documents
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .slice(0, 5)
                      .map(doc => (
                        <div 
                          key={doc.id}
                          onClick={() => handleEditDocument(doc)}
                          className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <FileText size={16} className={doc.type === 'invoice' ? 'text-blue-600' : 'text-purple-600'} />
                                <span className="font-medium text-sm">{doc.number}</span>
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  doc.status === 'paid' ? 'bg-green-100 text-green-800' :
                                  doc.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                                  doc.status === 'overdue' ? 'bg-red-100 text-red-800' :
                                  doc.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                  doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {doc.status}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                {doc.customer?.name || 'Unknown customer'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-sm">{formatZAR(doc.total)}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(doc.issueDate).toLocaleDateString('en-ZA')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Invoices ({documents.filter(d => d.type === 'invoice').length})</h2>
              <button
                onClick={() => handleCreateDocument('invoice')}
                className="text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90"
                style={{ backgroundColor: getPrimaryColor() }}
              >
                <Plus size={20} /> Create Invoice
              </button>
            </div>

            {documents.filter(d => d.type === 'invoice').length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No invoices yet. Create your first one!
              </div>
            ) : (
              <div className="space-y-4">
                {documents.filter(d => d.type === 'invoice').map(invoice => (
                  <div key={invoice.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{invoice.number}</h3>
                        <p className="text-sm text-gray-600">{invoice.customer?.name} - {invoice.customer?.company}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditDocument(invoice)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Edit invoice"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => shareViaEmail(invoice)}
                          className="text-green-600 hover:text-green-800 p-1"
                          title="Email invoice"
                        >
                          <Mail size={16} />
                        </button>
                        <button
                          onClick={() => sharePDF(invoice)}
                          className="text-blue-500 hover:text-blue-700 p-1"
                          title="Share PDF"
                        >
                          <Share2 size={16} />
                        </button>
                        <button
                          onClick={() => copyInvoiceDetails(invoice)}
                          className="text-purple-600 hover:text-purple-800 p-1"
                          title="Copy details"
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          onClick={() => exportDocumentToPDF(invoice)}
                          className="text-gray-700 hover:text-gray-900 p-1"
                          title="Download PDF"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(invoice.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete invoice"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">Status:</span>
                        <select
                          value={invoice.status}
                          onChange={(e) => updateDocument(invoice.id, { status: e.target.value as Document['status'] })}
                          className={`text-xs px-2 py-1 rounded border-0 cursor-pointer ${
                            invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                            invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                            invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <option value="draft">draft</option>
                          <option value="sent">sent</option>
                          <option value="paid">paid</option>
                          <option value="overdue">overdue</option>
                        </select>
                      </div>
                      <span className="font-semibold">R{invoice.total.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Issued: {new Date(invoice.issueDate).toLocaleDateString()}
                      {invoice.dueDate && ` • Due: ${new Date(invoice.dueDate).toLocaleDateString()}`}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'quotes' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Quotes ({documents.filter(d => d.type === 'quote').length})</h2>
              <button
                onClick={() => handleCreateDocument('quote')}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <Plus size={20} /> Create Quote
              </button>
            </div>

            {documents.filter(d => d.type === 'quote').length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No quotes yet. Create your first one!
              </div>
            ) : (
              <div className="space-y-4">
                {documents.filter(d => d.type === 'quote').map(quote => (
                  <div key={quote.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{quote.number}</h3>
                        <p className="text-sm text-gray-600">{quote.customer?.name} - {quote.customer?.company}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditDocument(quote)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Edit quote"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => shareViaEmail(quote)}
                          className="text-green-600 hover:text-green-800 p-1"
                          title="Email quote"
                        >
                          <Mail size={16} />
                        </button>
                        <button
                          onClick={() => sharePDF(quote)}
                          className="text-blue-500 hover:text-blue-700 p-1"
                          title="Share PDF"
                        >
                          <Share2 size={16} />
                        </button>
                        <button
                          onClick={() => copyInvoiceDetails(quote)}
                          className="text-purple-600 hover:text-purple-800 p-1"
                          title="Copy details"
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          onClick={() => exportDocumentToPDF(quote)}
                          className="text-gray-700 hover:text-gray-900 p-1"
                          title="Download PDF"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(quote.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete quote"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">Status:</span>
                        <select
                          value={quote.status}
                          onChange={(e) => updateDocument(quote.id, { status: e.target.value as Document['status'] })}
                          className={`text-xs px-2 py-1 rounded border-0 cursor-pointer ${
                            quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            quote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            quote.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <option value="draft">draft</option>
                          <option value="sent">sent</option>
                          <option value="accepted">accepted</option>
                          <option value="rejected">rejected</option>
                        </select>
                      </div>
                      <span className="font-semibold">R{quote.total.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Issued: {new Date(quote.issueDate).toLocaleDateString()}
                      {quote.dueDate && ` • Valid until: ${new Date(quote.dueDate).toLocaleDateString()}`}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Customers ({customers.length})</h2>
              <button
                onClick={() => setShowCustomerForm(true)}
                className="text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90"
                style={{ backgroundColor: getPrimaryColor() }}
              >
                <Plus size={20} /> Add Customer
              </button>
            </div>

            {loading ? (
              <div className="text-center text-gray-500 py-8">Loading customers...</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customers.length === 0 ? (
                  <div className="col-span-full text-center text-gray-500 py-8">
                    No customers yet. Add your first one!
                  </div>
                ) : (
                  customers.map(customer => (
                    <div key={customer.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                          {customer.customerNumber && (
                            <p className="text-xs text-gray-500">{customer.customerNumber}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditCustomer(customer)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Edit customer"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setStatementCustomer(customer);
                              setStatementFilters({ fromDate: '', toDate: '', unpaidOnly: false });
                              setShowStatementModal(true);
                            }}
                            className="text-gray-700 hover:text-gray-900 p-1"
                            title="Customer statement"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Delete customer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{customer.company}</p>
                      <p className="text-sm text-gray-600 mb-1">{customer.email}</p>
                      {customer.phone && (
                        <p className="text-sm text-gray-600 mb-1">{customer.phone}</p>
                      )}
                      {customer.vatNumber && (
                        <p className="text-sm text-gray-600 mb-1">VAT: {customer.vatNumber}</p>
                      )}
                      {customer.companyRegistration && (
                        <p className="text-sm text-gray-600">Reg: {customer.companyRegistration}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">Reports</h2>
              
              {/* Report Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                  <select
                    value={reportFilters.reportType}
                    onChange={(e) => setReportFilters({ ...reportFilters, reportType: e.target.value as 'sales' | 'vat' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="sales">Sales Report</option>
                    <option value="vat">VAT Report</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                  <input
                    type="date"
                    value={reportFilters.fromDate}
                    onChange={(e) => setReportFilters({ ...reportFilters, fromDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                  <input
                    type="date"
                    value={reportFilters.toDate}
                    onChange={(e) => setReportFilters({ ...reportFilters, toDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Sales Report */}
              {reportFilters.reportType === 'sales' && (() => {
                const filteredInvoices = documents.filter(doc => {
                  if (doc.type !== 'invoice') return false;
                  const docDate = new Date(doc.issueDate);
                  const fromDate = reportFilters.fromDate ? new Date(reportFilters.fromDate) : null;
                  const toDate = reportFilters.toDate ? new Date(reportFilters.toDate) : null;
                  if (fromDate && docDate < fromDate) return false;
                  if (toDate && docDate > toDate) return false;
                  return true;
                });

                const totalRevenue = filteredInvoices.reduce((sum, doc) => sum + doc.total, 0);
                const paidRevenue = filteredInvoices.filter(d => d.status === 'paid').reduce((sum, doc) => sum + doc.total, 0);
                const pendingRevenue = filteredInvoices.filter(d => d.status !== 'paid').reduce((sum, doc) => sum + doc.total, 0);

                // Group by customer
                const customerSales = filteredInvoices.reduce((acc, doc) => {
                  const customer = customers.find(c => c.id === doc.customerId);
                  if (customer) {
                    if (!acc[customer.id]) {
                      acc[customer.id] = { customer, total: 0, count: 0 };
                    }
                    acc[customer.id].total += doc.total;
                    acc[customer.id].count += 1;
                  }
                  return acc;
                }, {} as Record<string, { customer: Customer; total: number; count: number }>);

                const topCustomers = Object.values(customerSales)
                  .sort((a, b) => b.total - a.total)
                  .slice(0, 5);

                // Group by month
                const monthlySales = filteredInvoices.reduce((acc, doc) => {
                  const month = new Date(doc.issueDate).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long' });
                  if (!acc[month]) {
                    acc[month] = { total: 0, count: 0 };
                  }
                  acc[month].total += doc.total;
                  acc[month].count += 1;
                  return acc;
                }, {} as Record<string, { total: number; count: number }>);

                const exportSalesReportPDF = () => {
                  const doc = new jsPDF();
                  
                  let yPos = 20;

                  // Business header with logo
                  if (businessSettings?.logoDataUrl) {
                    try {
                      doc.addImage(businessSettings.logoDataUrl, 'PNG', 14, yPos, 30, 30);
                      yPos += 10;
                    } catch (e) {
                      console.error('Error adding logo to PDF:', e);
                    }
                  }

                  // Business details
                  if (businessSettings) {
                    doc.setFontSize(12);
                    doc.setFont('helvetica', 'bold');
                    doc.text(businessSettings.businessName, businessSettings?.logoDataUrl ? 50 : 14, yPos);
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(9);
                    yPos += 5;
                    if (businessSettings.address) {
                      doc.text(businessSettings.address, businessSettings?.logoDataUrl ? 50 : 14, yPos);
                      yPos += 4;
                    }
                    if (businessSettings.email) {
                      doc.text(businessSettings.email, businessSettings?.logoDataUrl ? 50 : 14, yPos);
                      yPos += 4;
                    }
                    if (businessSettings.phone) {
                      doc.text(businessSettings.phone, businessSettings?.logoDataUrl ? 50 : 14, yPos);
                      yPos += 4;
                    }
                    if (businessSettings.vatNumber) {
                      doc.text(`VAT: ${businessSettings.vatNumber}`, businessSettings?.logoDataUrl ? 50 : 14, yPos);
                      yPos += 4;
                    }
                    if (businessSettings.companyRegistration) {
                      doc.text(`Reg: ${businessSettings.companyRegistration}`, businessSettings?.logoDataUrl ? 50 : 14, yPos);
                      yPos += 4;
                    }
                  }

                  yPos += 10;

                  // Report header
                  doc.setFontSize(20);
                  doc.setFont('helvetica', 'bold');
                  doc.text('Sales Report', 14, yPos);
                  doc.setFont('helvetica', 'normal');
                  doc.setFontSize(10);
                  yPos += 8;
                  doc.text(`Period: ${reportFilters.fromDate || 'All'} to ${reportFilters.toDate || 'All'}`, 14, yPos);
                  yPos += 6;
                  doc.text(`Generated: ${new Date().toLocaleDateString('en-ZA')}`, 14, yPos);

                  yPos += 10;

                  // Summary
                  doc.setFontSize(14);
                  doc.setFont('helvetica', 'bold');
                  doc.text('Summary', 14, yPos);
                  doc.setFont('helvetica', 'normal');
                  yPos += 7;
                  doc.setFontSize(10);
                  doc.text(`Total Invoices: ${filteredInvoices.length}`, 14, yPos);
                  yPos += 6;
                  doc.text(`Total Revenue: ${formatZAR(totalRevenue)}`, 14, yPos);
                  yPos += 6;
                  doc.text(`Paid: ${formatZAR(paidRevenue)}`, 14, yPos);
                  yPos += 6;
                  doc.text(`Pending: ${formatZAR(pendingRevenue)}`, 14, yPos);

                  yPos += 10;

                  // Top Customers
                  if (topCustomers.length > 0) {
                    doc.setFontSize(14);
                    doc.setFont('helvetica', 'bold');
                    doc.text('Top 5 Customers', 14, yPos);
                    doc.setFont('helvetica', 'normal');
                    yPos += 5;
                    
                    autoTable(doc, {
                      startY: yPos,
                      head: [['Customer', 'Company', 'Invoices', 'Total']],
                      body: topCustomers.map(({ customer, total, count }) => [
                        customer.name,
                        customer.company,
                        count.toString(),
                        formatZAR(total),
                      ]),
                      theme: 'grid',
                    });
                    yPos = (doc as any).lastAutoTable.finalY + 10;
                  }

                  // Monthly breakdown
                  if (Object.keys(monthlySales).length > 0) {
                    doc.setFontSize(14);
                    doc.setFont('helvetica', 'bold');
                    doc.text('Monthly Breakdown', 14, yPos);
                    doc.setFont('helvetica', 'normal');
                    yPos += 5;
                    
                    autoTable(doc, {
                      startY: yPos,
                      head: [['Month', 'Invoices', 'Total']],
                      body: Object.entries(monthlySales).map(([month, data]) => [
                        month,
                        data.count.toString(),
                        formatZAR(data.total),
                      ]),
                      theme: 'grid',
                    });
                  }

                  doc.save(`sales-report-${new Date().getTime()}.pdf`);
                  showToast('Sales report exported successfully', 'success');
                };

                return (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">Sales Report</h3>
                      <button
                        onClick={exportSalesReportPDF}
                        className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90"
                        style={{ backgroundColor: getPrimaryColor() }}
                      >
                        <Download size={16} />
                        Export PDF
                      </button>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-600 mb-1">Total Invoices</p>
                        <p className="text-2xl font-bold text-blue-600">{filteredInvoices.length}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                        <p className="text-2xl font-bold text-green-600">{formatZAR(totalRevenue)}</p>
                      </div>
                      <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                        <p className="text-sm text-gray-600 mb-1">Paid</p>
                        <p className="text-2xl font-bold text-emerald-600">{formatZAR(paidRevenue)}</p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <p className="text-sm text-gray-600 mb-1">Pending</p>
                        <p className="text-2xl font-bold text-orange-600">{formatZAR(pendingRevenue)}</p>
                      </div>
                    </div>

                    {/* Top Customers */}
                    {topCustomers.length > 0 && (
                      <div className="bg-white border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-6 py-3 border-b">
                          <h4 className="font-semibold">Top 5 Customers</h4>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Invoices</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {topCustomers.map(({ customer, total, count }) => (
                                <tr key={customer.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 text-sm">{customer.name}</td>
                                  <td className="px-6 py-4 text-sm">{customer.company}</td>
                                  <td className="px-6 py-4 text-sm text-right">{count}</td>
                                  <td className="px-6 py-4 text-sm text-right font-semibold">{formatZAR(total)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Monthly Breakdown */}
                    {Object.keys(monthlySales).length > 0 && (
                      <div className="bg-white border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-6 py-3 border-b">
                          <h4 className="font-semibold">Monthly Breakdown</h4>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Invoices</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {Object.entries(monthlySales).map(([month, data]) => (
                                <tr key={month} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 text-sm">{month}</td>
                                  <td className="px-6 py-4 text-sm text-right">{data.count}</td>
                                  <td className="px-6 py-4 text-sm text-right font-semibold">{formatZAR(data.total)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {filteredInvoices.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        No invoices found for the selected period
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* VAT Report */}
              {reportFilters.reportType === 'vat' && (() => {
                const filteredInvoices = documents.filter(doc => {
                  if (doc.type !== 'invoice') return false;
                  const docDate = new Date(doc.issueDate);
                  const fromDate = reportFilters.fromDate ? new Date(reportFilters.fromDate) : null;
                  const toDate = reportFilters.toDate ? new Date(reportFilters.toDate) : null;
                  if (fromDate && docDate < fromDate) return false;
                  if (toDate && docDate > toDate) return false;
                  return true;
                });

                const totalVAT = filteredInvoices.reduce((sum, doc) => sum + (doc.taxAmount || 0), 0);
                const paidVAT = filteredInvoices.filter(d => d.status === 'paid').reduce((sum, doc) => sum + (doc.taxAmount || 0), 0);
                const pendingVAT = filteredInvoices.filter(d => d.status !== 'paid').reduce((sum, doc) => sum + (doc.taxAmount || 0), 0);
                const totalExcl = filteredInvoices.reduce((sum, doc) => sum + doc.subtotal, 0);

                // Monthly VAT breakdown
                const monthlyVAT = filteredInvoices.reduce((acc, doc) => {
                  const month = new Date(doc.issueDate).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long' });
                  if (!acc[month]) {
                    acc[month] = { vat: 0, subtotal: 0, total: 0, count: 0 };
                  }
                  acc[month].vat += doc.taxAmount || 0;
                  acc[month].subtotal += doc.subtotal;
                  acc[month].total += doc.total;
                  acc[month].count += 1;
                  return acc;
                }, {} as Record<string, { vat: number; subtotal: number; total: number; count: number }>);

                const exportVATReportPDF = () => {
                  const doc = new jsPDF();
                  
                  let yPos = 20;

                  // Business header with logo
                  if (businessSettings?.logoDataUrl) {
                    try {
                      doc.addImage(businessSettings.logoDataUrl, 'PNG', 14, yPos, 30, 30);
                      yPos += 10;
                    } catch (e) {
                      console.error('Error adding logo to PDF:', e);
                    }
                  }

                  // Business details
                  if (businessSettings) {
                    doc.setFontSize(12);
                    doc.setFont('helvetica', 'bold');
                    doc.text(businessSettings.businessName, businessSettings?.logoDataUrl ? 50 : 14, yPos);
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(9);
                    yPos += 5;
                    if (businessSettings.address) {
                      doc.text(businessSettings.address, businessSettings?.logoDataUrl ? 50 : 14, yPos);
                      yPos += 4;
                    }
                    if (businessSettings.email) {
                      doc.text(businessSettings.email, businessSettings?.logoDataUrl ? 50 : 14, yPos);
                      yPos += 4;
                    }
                    if (businessSettings.phone) {
                      doc.text(businessSettings.phone, businessSettings?.logoDataUrl ? 50 : 14, yPos);
                      yPos += 4;
                    }
                    if (businessSettings.vatNumber) {
                      doc.text(`VAT: ${businessSettings.vatNumber}`, businessSettings?.logoDataUrl ? 50 : 14, yPos);
                      yPos += 4;
                    }
                    if (businessSettings.companyRegistration) {
                      doc.text(`Reg: ${businessSettings.companyRegistration}`, businessSettings?.logoDataUrl ? 50 : 14, yPos);
                      yPos += 4;
                    }
                  }

                  yPos += 10;

                  // Report header
                  doc.setFontSize(20);
                  doc.setFont('helvetica', 'bold');
                  doc.text('VAT Report', 14, yPos);
                  doc.setFont('helvetica', 'normal');
                  doc.setFontSize(10);
                  yPos += 8;
                  doc.text(`Period: ${reportFilters.fromDate || 'All'} to ${reportFilters.toDate || 'All'}`, 14, yPos);
                  yPos += 6;
                  doc.text(`Generated: ${new Date().toLocaleDateString('en-ZA')}`, 14, yPos);

                  yPos += 10;

                  // Summary
                  doc.setFontSize(14);
                  doc.setFont('helvetica', 'bold');
                  doc.text('VAT Summary', 14, yPos);
                  doc.setFont('helvetica', 'normal');
                  yPos += 7;
                  doc.setFontSize(10);
                  doc.text(`Total Invoices: ${filteredInvoices.length}`, 14, yPos);
                  yPos += 6;
                  doc.text(`Total Excl. VAT: ${formatZAR(totalExcl)}`, 14, yPos);
                  yPos += 6;
                  doc.text(`Total VAT (15%): ${formatZAR(totalVAT)}`, 14, yPos);
                  yPos += 6;
                  doc.text(`VAT Paid: ${formatZAR(paidVAT)}`, 14, yPos);
                  yPos += 6;
                  doc.text(`VAT Pending: ${formatZAR(pendingVAT)}`, 14, yPos);

                  yPos += 10;

                  // Monthly breakdown
                  if (Object.keys(monthlyVAT).length > 0) {
                    doc.setFontSize(14);
                    doc.setFont('helvetica', 'bold');
                    doc.text('Monthly VAT Breakdown', 14, yPos);
                    doc.setFont('helvetica', 'normal');
                    yPos += 5;
                    
                    autoTable(doc, {
                      startY: yPos,
                      head: [['Month', 'Invoices', 'Excl. VAT', 'VAT (15%)', 'Incl. VAT']],
                      body: Object.entries(monthlyVAT).map(([month, data]) => [
                        month,
                        data.count.toString(),
                        formatZAR(data.subtotal),
                        formatZAR(data.vat),
                        formatZAR(data.total),
                      ]),
                      theme: 'grid',
                    });
                  }

                  doc.save(`vat-report-${new Date().getTime()}.pdf`);
                  showToast('VAT report exported successfully', 'success');
                };

                return (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">VAT Report</h3>
                      <button
                        onClick={exportVATReportPDF}
                        className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90"
                        style={{ backgroundColor: getPrimaryColor() }}
                      >
                        <Download size={16} />
                        Export PDF
                      </button>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-600 mb-1">Total Invoices</p>
                        <p className="text-2xl font-bold text-blue-600">{filteredInvoices.length}</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <p className="text-sm text-gray-600 mb-1">Total VAT (15%)</p>
                        <p className="text-2xl font-bold text-purple-600">{formatZAR(totalVAT)}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-sm text-gray-600 mb-1">VAT Paid</p>
                        <p className="text-2xl font-bold text-green-600">{formatZAR(paidVAT)}</p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <p className="text-sm text-gray-600 mb-1">VAT Pending</p>
                        <p className="text-2xl font-bold text-orange-600">{formatZAR(pendingVAT)}</p>
                      </div>
                    </div>

                    {/* VAT Breakdown */}
                    <div className="bg-white border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-6 py-3 border-b">
                        <h4 className="font-semibold">VAT Summary</h4>
                      </div>
                      <div className="p-6 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Total Excl. VAT:</span>
                          <span className="font-semibold text-lg">{formatZAR(totalExcl)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">VAT (15%):</span>
                          <span className="font-semibold text-lg text-purple-600">{formatZAR(totalVAT)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t">
                          <span className="text-gray-700 font-semibold">Total Incl. VAT:</span>
                          <span className="font-bold text-xl">{formatZAR(totalExcl + totalVAT)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Monthly Breakdown */}
                    {Object.keys(monthlyVAT).length > 0 && (
                      <div className="bg-white border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-6 py-3 border-b">
                          <h4 className="font-semibold">Monthly VAT Breakdown</h4>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Invoices</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Excl. VAT</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">VAT (15%)</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Incl. VAT</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {Object.entries(monthlyVAT).map(([month, data]) => (
                                <tr key={month} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 text-sm">{month}</td>
                                  <td className="px-6 py-4 text-sm text-right">{data.count}</td>
                                  <td className="px-6 py-4 text-sm text-right">{formatZAR(data.subtotal)}</td>
                                  <td className="px-6 py-4 text-sm text-right font-semibold text-purple-600">{formatZAR(data.vat)}</td>
                                  <td className="px-6 py-4 text-sm text-right font-semibold">{formatZAR(data.total)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {filteredInvoices.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        No invoices found for the selected period
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceQuoteApp;
