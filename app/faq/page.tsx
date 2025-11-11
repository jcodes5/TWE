import { Metadata } from 'next'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: 'FAQ | The Weather & Everything',
  description: 'Frequently asked questions about our environmental initiatives and how you can get involved.',
}

const faqs = [
  {
    question: "What is The Weather & Everything?",
    answer: "The Weather & Everything is a global community dedicated to combating climate change through education, advocacy, and sustainable solutions. We work with communities, scientists, and organizations to create meaningful environmental impact."
  },
  {
    question: "How can I get involved?",
    answer: "You can get involved by joining our volunteer program, donating to our campaigns, or partnering with us. Visit our Join page to learn more about available opportunities."
  },
  {
    question: "What types of campaigns do you run?",
    answer: "We run various campaigns including reforestation projects, clean energy initiatives, environmental education programs, and community-based sustainability projects across multiple countries."
  },
  {
    question: "How do you measure impact?",
    answer: "We track our impact through various metrics including number of trees planted, carbon emissions reduced, communities reached, and educational programs completed. We publish regular impact reports."
  },
  {
    question: "Do you accept donations?",
    answer: "Yes, we accept donations through our website. All donations go directly to funding our environmental initiatives and campaigns."
  },
  {
    question: "Can organizations partner with you?",
    answer: "Absolutely! We welcome partnerships with corporations, NGOs, and educational institutions. Contact us to discuss partnership opportunities."
  }
]

export default function FAQPage() {
  return (
    <main className="min-h-screen">
      <section className="relative min-h-[80vh] flex items-center overflow-hidden pt-20 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-hartone font-bold text-foreground">Frequently Asked Questions</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">Find answers to common questions about our mission, campaigns, and how you can make a difference.</p>
          </div>
        </div>
      </section>
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </main>
  )
}