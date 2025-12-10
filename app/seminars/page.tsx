import React from 'react';
import Footer from '@/components/public/Footer';
import SeminarCard from '@/components/public/SeminarCard';
import connectDB from '@/lib/db';
import Seminar from '@/lib/models/Seminar';

async function getSeminars() {
  try {
    
    await connectDB();
    const seminars = await Seminar.find({})
      .sort({ seminarDate: -1 })
      .limit(12)
      .lean();
    return seminars || [];
  } catch (error) {
    console.error('Error fetching seminars from DB:', error);
    return [];
  }
}

export default async function SeminarsPage() {
  const seminars = await getSeminars();

  return (
    <div className="min-h-screen flex flex-col">
      
      
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Seminars</h1>
            <p className="text-xl text-primary-100">
              Learn from industry experts and researchers in robotics and automation
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {seminars.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {seminars.map((seminar: any) => (
                <SeminarCard key={seminar._id} seminar={seminar} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-dark-600 text-lg">No seminars available at the moment.</p>
            </div>
          )}
        </div>
      </main>

    </div>
  );
}

