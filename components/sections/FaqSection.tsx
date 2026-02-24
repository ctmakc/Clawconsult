import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

interface FaqSectionProps {
  title?: string
  faqs: { question: string; answer: string }[]
}

export function FaqSection({ title = 'Frequently Asked Questions', faqs }: FaqSectionProps) {
  if (!faqs.length) return null

  return (
    <section className="py-14 bg-slate-50">
      <div className="container-site max-w-3xl">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">{title}</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
