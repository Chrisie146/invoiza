# Invoice & Quote Manager

A modern React-based application for managing invoices and quotes with customer management, built with TypeScript, Tailwind CSS, and Vite.

## Features

- **Dashboard**: Overview of total invoices, quotes, revenue, and pending amounts
- **Customer Management**: Add, edit, and manage customers
- **Invoice Management**: Create, view, and manage invoices
- **Quote Management**: Create and manage quotes
- **Local Storage**: Data persists in browser localStorage
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS and Lucide icons

## Setup

### Prerequisites

- Node.js 16+ and npm

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5174/`

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Preview production build**
   ```bash
   npm run preview
   ```

## Project Structure

```
invoice_app/
├── src/
│   ├── App.tsx              # Main application component
│   ├── App.css              # App styles (Tailwind)
│   ├── index.css            # Global styles
│   ├── main.tsx             # Application entry point
│   ├── types.d.ts           # TypeScript type definitions
│   └── assets/              # Static assets
├── index.html               # HTML template
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies
```

## Key Technologies

- **React 19**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS 4**: Utility-first CSS framework
- **Vite 7**: Next generation build tool
- **Lucide React**: Beautiful icon library
- **localStorage**: Client-side data persistence

## Storage

The application uses the `window.storage` API which is initialized in `main.tsx` to use browser `localStorage`. This allows data to persist between sessions.

### Data Models

#### Customer
```typescript
{
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company: string;
}
```

#### Document (Invoice or Quote)
```typescript
{
  id: string;
  type: 'invoice' | 'quote';
  customerId: string;
  date: string;
  dueDate?: string;
  items: DocumentItem[];
  notes: string;
  taxRate: number;
  subtotal: number;
  tax: number;
  total: number;
  number: string;
  status: 'draft' | 'sent' | 'paid' | 'accepted' | 'rejected';
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding Features

The main `App.tsx` component contains the full application logic. To add features:

1. Add new type definitions at the top
2. Add state management with `useState`
3. Add handler functions for data operations
4. Add UI components with Tailwind classes

### Styling

All styling uses Tailwind CSS. The configuration is in `tailwind.config.js`. Customize colors, fonts, and other utilities there.

## Future Enhancements

- PDF export functionality (integrate jsPDF)
- Email sending for invoices
- Payment tracking
- Multi-currency support
- User authentication
- Cloud sync
- Invoice templates
- Recurring invoices

## License

MIT
