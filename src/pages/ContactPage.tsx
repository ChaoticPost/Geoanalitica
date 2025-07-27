import { type ReactElement } from 'react';
import { ContactSection } from '@/components/sections/ContactSection';

export const ContactPage = (): ReactElement => {
  return (
    <div className="min-h-screen">
      <ContactSection />
    </div>
  );
}; 