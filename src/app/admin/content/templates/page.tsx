'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  category: string;
}

const defaultTemplates: Template[] = [
  {
    id: 'about-us',
    name: 'About Us',
    description: 'Standard about us page template with company information',
    content: `<h1>About Our Company</h1>
<p>Welcome to [Company Name], where we are passionate about [your mission/vision].</p>

<h2>Our Story</h2>
<p>Founded in [Year], we started with a simple goal: to [your founding purpose].</p>

<h2>Our Mission</h2>
<p>To provide [your value proposition] to our customers while maintaining the highest standards of quality and service.</p>

<h2>Our Team</h2>
<p>We are a dedicated team of professionals who are committed to excellence in everything we do.</p>`,
    category: 'Company'
  },
  {
    id: 'contact',
    name: 'Contact Us',
    description: 'Contact page template with form and contact information',
    content: `<h1>Contact Us</h1>
<p>We'd love to hear from you! Get in touch with us using the information below.</p>

<h2>Contact Information</h2>
<p><strong>Address:</strong> [Your Company Address]</p>
<p><strong>Phone:</strong> [Your Phone Number]</p>
<p><strong>Email:</strong> [Your Email Address]</p>
<p><strong>Hours:</strong> Monday-Friday, 9AM-5PM</p>

<h2>Send Us a Message</h2>
<p>Use the form below to send us a message and we'll get back to you as soon as possible.</p>`,
    category: 'Company'
  },
  {
    id: 'privacy-policy',
    name: 'Privacy Policy',
    description: 'Standard privacy policy template',
    content: `<h1>Privacy Policy</h1>
<p>Last updated: [Date]</p>

<h2>Introduction</h2>
<p>Welcome to [Company Name]'s Privacy Policy. This policy describes how we collect, use, and share your personal information.</p>

<h2>Information We Collect</h2>
<p>We collect information you provide directly to us, including:</p>
<ul>
  <li>Personal identification information (Name, email address, phone number, etc.)</li>
  <li>Payment information</li>
  <li>Communication preferences</li>
</ul>

<h2>How We Use Your Information</h2>
<p>We use the information we collect to:</p>
<ul>
  <li>Provide, maintain, and improve our services</li>
  <li>Process transactions and send related information</li>
  <li>Respond to your comments and questions</li>
</ul>`,
    category: 'Legal'
  },
  {
    id: 'terms-conditions',
    name: 'Terms & Conditions',
    description: 'Standard terms and conditions template',
    content: `<h1>Terms and Conditions</h1>
<p>Last updated: [Date]</p>

<h2>Agreement to Terms</h2>
<p>By accessing or using our services, you agree to be bound by these Terms and Conditions.</p>

<h2>Intellectual Property Rights</h2>
<p>All content on this website, including text, graphics, logos, and images, is the property of [Company Name] and is protected by copyright laws.</p>

<h2>User Responsibilities</h2>
<p>You agree not to:</p>
<ul>
  <li>Use the service for any illegal purpose</li>
  <li>Attempt to gain unauthorized access to any part of the service</li>
  <li>Interfere with or disrupt the service</li>
</ul>`,
    category: 'Legal'
  },
  {
    id: 'faq',
    name: 'FAQ Page',
    description: 'Frequently asked questions template',
    content: `<h1>Frequently Asked Questions</h1>
<p>Find answers to common questions about our products and services.</p>

<h2>General Questions</h2>
<div>
  <h3>What is your return policy?</h3>
  <p>We offer a 30-day return policy for all unused products in their original packaging.</p>
</div>

<div>
  <h3>How long does shipping take?</h3>
  <p>Standard shipping typically takes 3-5 business days within the continental US.</p>
</div>

<h2>Product Questions</h2>
<div>
  <h3>Are your products organic?</h3>
  <p>Yes, all our products are certified organic and sustainably sourced.</p>
</div>

<div>
  <h3>Do you offer international shipping?</h3>
  <p>Currently, we only ship within the United States.</p>
</div>`,
    category: 'Support'
  }
];

export default function ContentTemplates() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [applying, setApplying] = useState(false);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const applyTemplate = async (template: Template) => {
    setApplying(true);
    
    // Navigate to create page with template content
    const queryParams = new URLSearchParams({
      template: template.id,
      title: template.name,
      content: encodeURIComponent(template.content)
    });
    
    router.push(`/admin/content/pages/create?${queryParams.toString()}`);
  };

  const previewTemplate = (template: Template) => {
    setSelectedTemplate(template);
  };

  const categories = Array.from(new Set(defaultTemplates.map(t => t.category)));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Content Templates</h1>
          <Link
            href="/admin/content/pages"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back to Pages
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Templates List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Available Templates</h2>
              
              {categories.map(category => (
                <div key={category} className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">{category}</h3>
                  <div className="space-y-3">
                    {defaultTemplates
                      .filter(template => template.category === category)
                      .map(template => (
                        <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{template.name}</h4>
                              <p className="text-sm text-gray-600">{template.description}</p>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <button
                                onClick={() => previewTemplate(template)}
                                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                              >
                                Preview
                              </button>
                              <button
                                onClick={() => applyTemplate(template)}
                                disabled={applying}
                                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
                              >
                                Use Template
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Template Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Template Preview</h2>
              
              {selectedTemplate ? (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{selectedTemplate.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{selectedTemplate.description}</p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedTemplate.content }}
                    />
                  </div>
                  
                  <button
                    onClick={() => applyTemplate(selectedTemplate)}
                    disabled={applying}
                    className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                  >
                    {applying ? 'Applying...' : 'Use This Template'}
                  </button>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>Select a template to preview its content</p>
                  <p className="text-sm mt-2">Click "Preview" on any template to see its structure</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Template Usage Tips</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Templates provide a starting point for common page types</li>
            <li>• You can customize the template content after applying it</li>
            <li>• Replace placeholder text (like [Company Name]) with your actual content</li>
            <li>• Use the preview feature to see how the template will look</li>
            <li>• Templates help maintain consistency across your website pages</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
