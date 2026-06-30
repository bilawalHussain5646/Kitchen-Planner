import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FaqAccordion from '@/components/FaqAccordion';
import { getContent, getNavData, loadLocaleJson } from '@/lib/locale';

const API_BASE_URL = 'https://api-kitchenplanner.lggf-promotor.com/api';

async function fetchFaqsFromDb(locale) {
  try {
    const res = await fetch(`${API_BASE_URL}/faqs?locale=${locale}`);
    if (!res.ok) return null;
    const items = await res.json();
    
    const uniqueItems = [];
    const seenQuestions = new Set();
    for (const item of items) {
      if (item.question) {
        const trimmedQ = item.question.trim();
        if (!seenQuestions.has(trimmedQ)) {
          seenQuestions.add(trimmedQ);
          uniqueItems.push(item);
        }
      }
    }

    return uniqueItems.map(item => ({
      id: item.id,
      q: item.question,
      a: item.answer
    }));
  } catch (error) {
    console.error(`Error fetching FAQs from DB table for locale ${locale}:`, error);
    return null;
  }
}

export default async function FaqPage({ params }) {
  const { locale } = await params;
  const contentData = await getContent(locale);
  const navData = getNavData(contentData);
  const faqData = await loadLocaleJson(locale, 'faq');

  if (faqData) {
    faqData.questions = [];
  }

  return (
    <>
      <Header data={navData} />
      <main className="main-layout">
        <FaqAccordion data={faqData} initialQuestions={[]} />
      </main>
      <Footer />
    </>
  );
}
