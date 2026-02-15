'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type InvoiceTemplate = 'classic' | 'modern' | 'minimal' | 'professional' | 'elegant' | 'bold';

interface InvoiceTemplateProps {
  invoice: {
    invoiceNumber: string;
    amount: number;
    vatAmount: number;
    totalAmount: number;
    status: 'PAID' | 'UNPAID';
    dueDate: string;
    createdAt: string;
    client: {
      name: string;
      phone?: string;
      address?: string;
    };
    business: {
      name: string;
      phone?: string;
      address?: string;
      vatEnabled: boolean;
      vatNumber?: string;
    };
    job?: {
      type: string;
      scheduledDate: string;
      scheduledTime?: string;
    };
  };
  template: InvoiceTemplate;
}

// Template 1: Classic
export function ClassicTemplate({ invoice }: Omit<InvoiceTemplateProps, 'template'>) {
  const isOverdue = invoice.status === 'UNPAID' && new Date(invoice.dueDate) < new Date();
  
  return (
    <div className="bg-white p-8 sm:p-12 max-w-4xl mx-auto shadow-lg">
      {/* Header */}
      <div className="border-b-2 border-gray-300 pb-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{invoice.business.name}</h1>
            {invoice.business.address && <p className="text-gray-600">{invoice.business.address}</p>}
            {invoice.business.phone && <p className="text-gray-600">{invoice.business.phone}</p>}
            {invoice.business.vatEnabled && invoice.business.vatNumber && (
              <p className="text-gray-600 mt-1">VAT: {invoice.business.vatNumber}</p>
            )}
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">INVOICE</h2>
            <div className="space-y-1">
              <p className="text-gray-600"><span className="font-semibold">Invoice #:</span> {invoice.invoiceNumber}</p>
              <p className="text-gray-600"><span className="font-semibold">Date:</span> {new Date(invoice.createdAt).toLocaleDateString()}</p>
              <p className={cn("text-gray-600", isOverdue && "text-red-600")}>
                <span className="font-semibold">Due Date:</span> {new Date(invoice.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Bill To:</h3>
        <div className="bg-gray-50 p-4 rounded border border-gray-200">
          <p className="font-semibold text-gray-900">{invoice.client.name}</p>
          {invoice.client.address && <p className="text-gray-600">{invoice.client.address}</p>}
          {invoice.client.phone && <p className="text-gray-600">{invoice.client.phone}</p>}
        </div>
      </div>

      {/* Job Info */}
      {invoice.job && (
        <div className="mb-8 bg-blue-50 p-4 rounded border border-blue-200">
          <p className="text-sm text-gray-600 mb-1">Service Details</p>
          <p className="font-semibold text-gray-900">
            {invoice.job.type} - {new Date(invoice.job.scheduledDate).toLocaleDateString()}
            {invoice.job.scheduledTime && ` at ${invoice.job.scheduledTime}`}
          </p>
        </div>
      )}

      {/* Amount Table */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 px-4 font-bold text-gray-900">Description</th>
              <th className="text-right py-3 px-4 font-bold text-gray-900">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-4 text-gray-700">Cleaning Service</td>
              <td className="py-4 px-4 text-right font-semibold text-gray-900">£{Number(invoice.amount).toFixed(2)}</td>
            </tr>
            {invoice.business.vatEnabled && invoice.vatAmount > 0 && (
              <tr className="border-b border-gray-200">
                <td className="py-4 px-4 text-gray-700">VAT (20%)</td>
                <td className="py-4 px-4 text-right font-semibold text-gray-900">£{Number(invoice.vatAmount).toFixed(2)}</td>
              </tr>
            )}
            <tr className="bg-gray-100">
              <td className="py-4 px-4 font-bold text-lg text-gray-900">Total</td>
              <td className="py-4 px-4 text-right font-bold text-2xl text-gray-900">£{Number(invoice.totalAmount).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Status */}
      <div className="text-center pt-6 border-t border-gray-300">
        <span className={cn(
          "inline-block px-6 py-2 rounded-full font-semibold text-sm",
          invoice.status === 'PAID' ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
        )}>
          {invoice.status}
        </span>
      </div>
    </div>
  );
}

// Template 2: Modern
export function ModernTemplate({ invoice }: Omit<InvoiceTemplateProps, 'template'>) {
  const isOverdue = invoice.status === 'UNPAID' && new Date(invoice.dueDate) < new Date();
  
  return (
    <div className="bg-white p-8 sm:p-12 max-w-4xl mx-auto shadow-xl rounded-lg overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 -m-8 sm:-m-12 mb-8 sm:mb-12">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{invoice.business.name}</h1>
            <p className="text-blue-100 text-sm">{invoice.business.address}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold mb-4">INVOICE</h2>
            <p className="text-blue-100 text-sm">#{invoice.invoiceNumber}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Bill To */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Bill To</h3>
          <div className="space-y-1">
            <p className="font-bold text-gray-900">{invoice.client.name}</p>
            {invoice.client.address && <p className="text-gray-600 text-sm">{invoice.client.address}</p>}
            {invoice.client.phone && <p className="text-gray-600 text-sm">{invoice.client.phone}</p>}
          </div>
        </div>

        {/* Invoice Details */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Invoice Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-semibold text-gray-900">{new Date(invoice.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Due Date:</span>
              <span className={cn("font-semibold", isOverdue ? "text-red-600" : "text-gray-900")}>
                {new Date(invoice.dueDate).toLocaleDateString()}
              </span>
            </div>
            <div className="pt-2 border-t">
              <span className="text-gray-600">Status:</span>
              <span className={cn(
                "ml-2 px-3 py-1 rounded-full text-xs font-semibold",
                invoice.status === 'PAID' ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              )}>
                {invoice.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Job Info */}
      {invoice.job && (
        <div className="mb-8 p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
          <p className="text-sm text-indigo-600 font-semibold mb-1">Service</p>
          <p className="text-gray-900 font-semibold">
            {invoice.job.type} - {new Date(invoice.job.scheduledDate).toLocaleDateString()}
            {invoice.job.scheduledTime && ` at ${invoice.job.scheduledTime}`}
          </p>
        </div>
      )}

      {/* Amount Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold text-gray-900">£{Number(invoice.amount).toFixed(2)}</span>
          </div>
          {invoice.business.vatEnabled && invoice.vatAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">VAT (20%)</span>
              <span className="font-semibold text-gray-900">£{Number(invoice.vatAmount).toFixed(2)}</span>
            </div>
          )}
          <div className="pt-3 border-t-2 border-gray-300 flex justify-between">
            <span className="text-xl font-bold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-blue-600">£{Number(invoice.totalAmount).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 pt-6 border-t">
        <p>Thank you for your business!</p>
      </div>
    </div>
  );
}

// Template 3: Minimal
export function MinimalTemplate({ invoice }: Omit<InvoiceTemplateProps, 'template'>) {
  return (
    <div className="bg-white p-8 sm:p-12 max-w-4xl mx-auto">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light text-gray-900 mb-2">{invoice.business.name}</h1>
          <p className="text-gray-500 text-sm">INVOICE #{invoice.invoiceNumber}</p>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-8 mb-12 text-sm">
          <div>
            <p className="text-gray-500 mb-2">Date</p>
            <p className="font-medium text-gray-900">{new Date(invoice.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-2">Due Date</p>
            <p className="font-medium text-gray-900">{new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-12">
          <p className="text-gray-500 text-sm mb-3">Bill To</p>
          <p className="font-medium text-gray-900">{invoice.client.name}</p>
          {invoice.client.address && <p className="text-gray-600 text-sm mt-1">{invoice.client.address}</p>}
        </div>

        {/* Amount */}
        <div className="border-t border-b border-gray-200 py-8 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total</span>
            <span className="text-4xl font-light text-gray-900">£{Number(invoice.totalAmount).toFixed(2)}</span>
          </div>
        </div>

        {/* Status */}
        <div className="text-center">
          <span className={cn(
            "text-xs font-medium px-4 py-2 rounded-full",
            invoice.status === 'PAID' ? "bg-gray-100 text-gray-600" : "bg-gray-100 text-gray-600"
          )}>
            {invoice.status}
          </span>
        </div>
      </div>
    </div>
  );
}

// Template 4: Professional
export function ProfessionalTemplate({ invoice }: Omit<InvoiceTemplateProps, 'template'>) {
  const isOverdue = invoice.status === 'UNPAID' && new Date(invoice.dueDate) < new Date();
  
  return (
    <div className="bg-white p-8 sm:p-12 max-w-4xl mx-auto shadow-md border border-gray-200">
      {/* Header with logo area */}
      <div className="flex justify-between items-start mb-10 pb-8 border-b-2 border-gray-800">
        <div className="flex-1">
          <div className="w-16 h-16 bg-gray-800 rounded mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{invoice.business.name}</h1>
          <p className="text-gray-600 text-sm">{invoice.business.address}</p>
          {invoice.business.phone && <p className="text-gray-600 text-sm">{invoice.business.phone}</p>}
          {invoice.business.vatEnabled && invoice.business.vatNumber && (
            <p className="text-gray-600 text-sm mt-1">VAT Reg: {invoice.business.vatNumber}</p>
          )}
        </div>
        <div className="text-right">
          <div className="bg-gray-800 text-white px-6 py-3 inline-block mb-2">
            <p className="text-xs font-semibold uppercase tracking-wide">Invoice</p>
            <p className="text-2xl font-bold">{invoice.invoiceNumber}</p>
          </div>
          <div className="text-sm text-gray-600 space-y-1 mt-3">
            <p><span className="font-semibold">Date:</span> {new Date(invoice.createdAt).toLocaleDateString()}</p>
            <p className={cn(isOverdue && "text-red-600")}>
              <span className="font-semibold">Due:</span> {new Date(invoice.dueDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-10">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Bill To</h3>
        <div className="bg-gray-50 p-5 border-l-4 border-gray-800">
          <p className="font-bold text-gray-900 text-lg mb-1">{invoice.client.name}</p>
          {invoice.client.address && <p className="text-gray-600 text-sm">{invoice.client.address}</p>}
          {invoice.client.phone && <p className="text-gray-600 text-sm">{invoice.client.phone}</p>}
        </div>
      </div>

      {/* Service Details */}
      {invoice.job && (
        <div className="mb-10">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Service Details</h3>
          <div className="bg-gray-50 p-5">
            <p className="font-semibold text-gray-900">
              {invoice.job.type} - {new Date(invoice.job.scheduledDate).toLocaleDateString()}
              {invoice.job.scheduledTime && ` at ${invoice.job.scheduledTime}`}
            </p>
          </div>
        </div>
      )}

      {/* Amount Table */}
      <div className="mb-10">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="text-left py-3 px-4 font-semibold text-sm">Description</th>
              <th className="text-right py-3 px-4 font-semibold text-sm">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-4 text-gray-700">Cleaning Service</td>
              <td className="py-4 px-4 text-right font-semibold text-gray-900">£{Number(invoice.amount).toFixed(2)}</td>
            </tr>
            {invoice.business.vatEnabled && invoice.vatAmount > 0 && (
              <tr className="border-b border-gray-200">
                <td className="py-4 px-4 text-gray-700">VAT (20%)</td>
                <td className="py-4 px-4 text-right font-semibold text-gray-900">£{Number(invoice.vatAmount).toFixed(2)}</td>
              </tr>
            )}
            <tr className="bg-gray-800 text-white">
              <td className="py-4 px-4 font-bold">TOTAL</td>
              <td className="py-4 px-4 text-right font-bold text-xl">£{Number(invoice.totalAmount).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Status Footer */}
      <div className="text-center pt-6 border-t border-gray-200">
        <span className={cn(
          "inline-block px-4 py-2 rounded font-semibold text-sm",
          invoice.status === 'PAID' ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
        )}>
          Status: {invoice.status}
        </span>
      </div>
    </div>
  );
}

// Template 5: Elegant
export function ElegantTemplate({ invoice }: Omit<InvoiceTemplateProps, 'template'>) {
  return (
    <div className="bg-white p-8 sm:p-12 max-w-4xl mx-auto shadow-lg border-t-4 border-indigo-600">
      {/* Elegant Header */}
      <div className="text-center mb-12 pb-8 border-b border-gray-200">
        <div className="inline-block border-2 border-indigo-600 px-8 py-4 mb-4">
          <h1 className="text-3xl font-serif text-gray-900">{invoice.business.name}</h1>
        </div>
        <p className="text-gray-500 text-sm mt-2">INVOICE #{invoice.invoiceNumber}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        {/* Bill To */}
        <div>
          <h3 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-4">Bill To</h3>
          <div className="space-y-1">
            <p className="font-semibold text-gray-900 text-lg">{invoice.client.name}</p>
            {invoice.client.address && <p className="text-gray-600 text-sm">{invoice.client.address}</p>}
            {invoice.client.phone && <p className="text-gray-600 text-sm">{invoice.client.phone}</p>}
          </div>
        </div>

        {/* Invoice Info */}
        <div>
          <h3 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-4">Invoice Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-semibold text-gray-900">{new Date(invoice.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Due Date:</span>
              <span className="font-semibold text-gray-900">{new Date(invoice.dueDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Service */}
      {invoice.job && (
        <div className="mb-12 p-6 bg-indigo-50 border-l-4 border-indigo-600">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">Service</p>
          <p className="font-semibold text-gray-900">
            {invoice.job.type} - {new Date(invoice.job.scheduledDate).toLocaleDateString()}
            {invoice.job.scheduledTime && ` at ${invoice.job.scheduledTime}`}
          </p>
        </div>
      )}

      {/* Amount */}
      <div className="text-center py-12 border-y-2 border-indigo-600">
        <p className="text-sm text-gray-500 mb-2">Total Amount</p>
        <p className="text-5xl font-serif text-indigo-600">£{Number(invoice.totalAmount).toFixed(2)}</p>
        {invoice.business.vatEnabled && invoice.vatAmount > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            Includes VAT: £{Number(invoice.vatAmount).toFixed(2)}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-12 pt-8 border-t border-gray-200">
        <p className="text-xs text-gray-500">{invoice.business.address}</p>
        {invoice.business.phone && <p className="text-xs text-gray-500">{invoice.business.phone}</p>}
      </div>
    </div>
  );
}

// Template 6: Bold
export function BoldTemplate({ invoice }: Omit<InvoiceTemplateProps, 'template'>) {
  const isOverdue = invoice.status === 'UNPAID' && new Date(invoice.dueDate) < new Date();
  
  return (
    <div className="bg-white p-8 sm:p-12 max-w-4xl mx-auto">
      {/* Bold Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 -m-8 sm:-m-12 mb-8 sm:mb-12">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black mb-2">{invoice.business.name}</h1>
            <p className="text-purple-100">{invoice.business.address}</p>
          </div>
          <div className="text-right">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
              <p className="text-xs font-bold uppercase tracking-wider mb-1">Invoice</p>
              <p className="text-3xl font-black">#{invoice.invoiceNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-100 p-4 rounded-lg text-center">
          <p className="text-xs text-gray-500 mb-1">Date</p>
          <p className="font-bold text-gray-900">{new Date(invoice.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
        </div>
        <div className={cn("p-4 rounded-lg text-center", isOverdue ? "bg-red-100" : "bg-gray-100")}>
          <p className="text-xs text-gray-500 mb-1">Due Date</p>
          <p className={cn("font-bold", isOverdue ? "text-red-600" : "text-gray-900")}>
            {new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg text-center">
          <p className="text-xs text-gray-500 mb-1">Status</p>
          <span className={cn(
            "inline-block px-3 py-1 rounded-full text-xs font-bold",
            invoice.status === 'PAID' ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
          )}>
            {invoice.status}
          </span>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
        <h3 className="text-sm font-bold text-purple-600 uppercase mb-3">Bill To</h3>
        <p className="text-2xl font-black text-gray-900 mb-2">{invoice.client.name}</p>
        {invoice.client.address && <p className="text-gray-600">{invoice.client.address}</p>}
        {invoice.client.phone && <p className="text-gray-600">{invoice.client.phone}</p>}
      </div>

      {/* Service */}
      {invoice.job && (
        <div className="mb-8 p-4 bg-purple-100 rounded-lg">
          <p className="text-xs font-bold text-purple-600 uppercase mb-1">Service</p>
          <p className="font-bold text-gray-900">
            {invoice.job.type} - {new Date(invoice.job.scheduledDate).toLocaleDateString()}
            {invoice.job.scheduledTime && ` at ${invoice.job.scheduledTime}`}
          </p>
        </div>
      )}

      {/* Amount Box */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-xl text-center">
        <p className="text-sm uppercase tracking-wider mb-2 opacity-90">Total Amount</p>
        <p className="text-6xl font-black mb-4">£{Number(invoice.totalAmount).toFixed(2)}</p>
        <div className="flex justify-center gap-6 text-sm opacity-90">
          <span>Subtotal: £{Number(invoice.amount).toFixed(2)}</span>
          {invoice.business.vatEnabled && invoice.vatAmount > 0 && (
            <span>VAT: £{Number(invoice.vatAmount).toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Template Renderer
export function InvoiceTemplateRenderer({ invoice, template }: InvoiceTemplateProps) {
  switch (template) {
    case 'classic':
      return <ClassicTemplate invoice={invoice} />;
    case 'modern':
      return <ModernTemplate invoice={invoice} />;
    case 'minimal':
      return <MinimalTemplate invoice={invoice} />;
    case 'professional':
      return <ProfessionalTemplate invoice={invoice} />;
    case 'elegant':
      return <ElegantTemplate invoice={invoice} />;
    case 'bold':
      return <BoldTemplate invoice={invoice} />;
    default:
      return <ClassicTemplate invoice={invoice} />;
  }
}

