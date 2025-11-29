import React from 'react';
import Footer from '@/components/public/Footer';
import AnimatedWorkshopHero from '@/components/public/AnimatedWorkshopHero';
import AnimatedWorkshopContent from '@/components/public/AnimatedWorkshopContent';
import AnimatedWorkshopRegistration from '@/components/public/AnimatedWorkshopRegistration';

async function getWorkshop(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    // First try to get by slug
    const res = await fetch(`${baseUrl}/api/events?slug=${slug}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.data?.[0]) {
        const event = data.data[0];
        // Get full details with registration count
        const detailRes = await fetch(`${baseUrl}/api/events/${event._id}`, { cache: 'no-store' });
        if (detailRes.ok) {
          const detailData = await detailRes.json();
          return detailData.data || null;
        }
        return event;
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching workshop:', error);
    return null;
  }
}

export default async function WorkshopDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const workshop = await getWorkshop(params.slug);

  if (!workshop) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-dark-900 mb-4">Workshop not found</h1>
            <a href="/events" className="text-primary-600 hover:text-primary-700">
              ← Back to Events
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const registrationCount = workshop.registrationCount || 0;
  const isRegistrationOpen = workshop.registrationOpen && 
    (!workshop.registrationLimit || registrationCount < workshop.registrationLimit);

  return (
    <div className="min-h-screen flex flex-col">
   
      
      <main className="flex-grow">
        {/* Hero Section */}
        <AnimatedWorkshopHero workshop={workshop} />

        {/* Content Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="md:col-span-2">
                <AnimatedWorkshopContent workshop={workshop} />
              </div>

              {/* Registration Form */}
              <div className="md:col-span-1">
                <AnimatedWorkshopRegistration 
                  workshopId={workshop._id} 
                  isRegistrationOpen={isRegistrationOpen}
                  workshop={workshop}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

