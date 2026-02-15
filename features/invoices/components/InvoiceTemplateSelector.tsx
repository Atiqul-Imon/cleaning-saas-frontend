'use client';

import React from 'react';
import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';
import { InvoiceTemplate } from './InvoiceTemplates';

interface TemplateOption {
  id: InvoiceTemplate;
  name: string;
  description: string;
  preview: React.ReactNode;
}

const templates: TemplateOption[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional invoice layout with clear sections',
    preview: (
      <div className="p-4 bg-white border-2 border-gray-300 rounded">
        <div className="flex justify-between mb-4 pb-2 border-b-2 border-gray-300">
          <div className="text-xs">
            <div className="font-bold mb-1">Business Name</div>
            <div className="text-gray-500">Address</div>
          </div>
          <div className="text-xs text-right">
            <div className="font-bold mb-1">INVOICE</div>
            <div className="text-gray-500">#INV-001</div>
          </div>
        </div>
        <div className="text-xs">
          <div className="mb-2 bg-gray-50 p-2 rounded">
            <div className="font-semibold">Client Name</div>
          </div>
          <div className="flex justify-between pt-2 border-t">
            <span>Total</span>
            <span className="font-bold">£100.00</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean design with gradient header',
    preview: (
      <div className="p-4 bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 -m-4 mb-4 rounded-t-lg">
          <div className="flex justify-between text-xs">
            <div className="font-bold">Business Name</div>
            <div className="font-bold">INVOICE</div>
          </div>
        </div>
        <div className="text-xs space-y-2">
          <div>
            <div className="text-gray-500 text-[10px] uppercase mb-1">Bill To</div>
            <div className="font-semibold">Client Name</div>
          </div>
          <div className="bg-gray-50 rounded p-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total</span>
              <span className="font-bold text-blue-600">£100.00</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and clean, minimal design',
    preview: (
      <div className="p-4 bg-white">
        <div className="text-center mb-4 pb-4 border-b border-gray-200">
          <div className="text-xs font-light mb-1">Business Name</div>
          <div className="text-[10px] text-gray-500">INVOICE #INV-001</div>
        </div>
        <div className="text-xs space-y-2">
          <div>
            <div className="text-gray-500 mb-1">Bill To</div>
            <div className="font-medium">Client Name</div>
          </div>
          <div className="border-t border-b border-gray-200 py-3 text-center">
            <div className="text-2xl font-light">£100.00</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate style with structured layout',
    preview: (
      <div className="p-4 bg-white border border-gray-200">
        <div className="flex justify-between mb-3 pb-3 border-b-2 border-gray-800">
          <div className="text-xs">
            <div className="w-8 h-8 bg-gray-800 rounded mb-2"></div>
            <div className="font-bold">Business Name</div>
          </div>
          <div className="bg-gray-800 text-white px-3 py-2 text-xs rounded">
            <div className="text-[10px] uppercase">Invoice</div>
            <div className="font-bold">#INV-001</div>
          </div>
        </div>
        <div className="text-xs">
          <div className="text-[10px] uppercase text-gray-500 mb-2">Bill To</div>
          <div className="bg-gray-50 p-2 border-l-4 border-gray-800">
            <div className="font-bold">Client Name</div>
          </div>
          <div className="mt-3 bg-gray-800 text-white p-2 rounded">
            <div className="flex justify-between">
              <span className="text-[10px] uppercase">Total</span>
              <span className="font-bold">£100.00</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated design with serif fonts',
    preview: (
      <div className="p-4 bg-white border-t-4 border-indigo-600">
        <div className="text-center mb-4 pb-4 border-b border-gray-200">
          <div className="inline-block border-2 border-indigo-600 px-3 py-2 mb-2">
            <div className="text-xs font-serif">Business Name</div>
          </div>
          <div className="text-[10px] text-gray-500">INVOICE #INV-001</div>
        </div>
        <div className="text-xs space-y-3">
          <div>
            <div className="text-[10px] uppercase text-indigo-600 mb-2">Bill To</div>
            <div className="font-semibold">Client Name</div>
          </div>
          <div className="border-y-2 border-indigo-600 py-3 text-center">
            <div className="text-3xl font-serif text-indigo-600">£100.00</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Vibrant colors with strong typography',
    preview: (
      <div className="p-4 bg-white rounded-lg">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 -m-4 mb-4 rounded-t-lg">
          <div className="flex justify-between text-xs">
            <div className="font-black">Business Name</div>
            <div className="bg-white/20 px-2 py-1 rounded text-[10px] font-black">#INV-001</div>
          </div>
        </div>
        <div className="text-xs space-y-2">
          <div className="bg-purple-50 p-2 rounded border-2 border-purple-200">
            <div className="text-[10px] font-bold text-purple-600 uppercase mb-1">Bill To</div>
            <div className="font-black">Client Name</div>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded text-center">
            <div className="text-2xl font-black">£100.00</div>
          </div>
        </div>
      </div>
    ),
  },
];

interface InvoiceTemplateSelectorProps {
  selectedTemplate: InvoiceTemplate;
  onSelect: (template: InvoiceTemplate) => void;
}

export default function InvoiceTemplateSelector({
  selectedTemplate,
  onSelect,
}: InvoiceTemplateSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-[var(--gray-900)] mb-2">Choose Invoice Template</h3>
        <p className="text-sm text-[var(--gray-600)]">
          Select a template that matches your brand style. You can change this anytime.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className="text-left transition-all duration-200"
          >
            <Card
              variant="elevated"
              padding="md"
              className={cn(
                'h-full transition-all duration-200',
                selectedTemplate === template.id
                  ? 'bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] shadow-lg'
                  : 'hover:bg-[var(--gray-50)] hover:shadow-md'
              )}
            >
              <div className="mb-3">
                {template.preview}
              </div>
              <div>
                <h4 className={cn(
                  "font-bold mb-1 transition-colors duration-200",
                  selectedTemplate === template.id
                    ? "text-[var(--primary-700)]"
                    : "text-[var(--gray-900)]"
                )}>
                  {template.name}
                </h4>
                <p className={cn(
                  "text-sm transition-colors duration-200",
                  selectedTemplate === template.id
                    ? "text-[var(--primary-600)]"
                    : "text-[var(--gray-600)]"
                )}>
                  {template.description}
                </p>
              </div>
              {selectedTemplate === template.id && (
                <div className="mt-3 flex items-center text-[var(--primary-600)]">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-semibold">Selected</span>
                </div>
              )}
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}

