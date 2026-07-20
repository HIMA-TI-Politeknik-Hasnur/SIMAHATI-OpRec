import { useState } from 'react';
import './Accordion.css';

interface FaqItem {
  id: number;
  pertanyaan: string;
  jawaban: string;
  is_active: boolean;
}

interface AccordionProps {
  items: FaqItem[];
}

export const Accordion = ({ items }: AccordionProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="accordion-wrapper">
      {items.map((item, index) => (
        <div 
          key={item.id} 
          className={`accordion-item ${activeIndex === index ? 'active' : ''}`}
        >
          <button 
            className="accordion-header" 
            onClick={() => toggleAccordion(index)}
          >
            <span className="accordion-title">{item.pertanyaan}</span>
            <span className="accordion-icon">
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </button>
          <div 
            className="accordion-content"
            style={{ maxHeight: activeIndex === index ? '500px' : '0' }}
          >
            <div className="accordion-inner-content">
              {item.jawaban}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
