import React from 'react';
import Image from 'next/image';

import Footer from '@/components/public/Footer';
import { Card } from '@/components/ui/Card';

async function getGallery() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/gallery?limit=24`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return data.data || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return [];
  }
}

export default async function GalleryPage() {
  const gallery = await getGallery();

  return (
    <div className="min-h-screen flex flex-col">
  
      
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Gallery</h1>
            <p className="text-xl text-primary-100">
              Explore our events, workshops, and achievements through photos
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {gallery.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((item: any) => (
                <Card key={item._id} variant="elevated" className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  {item.title && (
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-dark-900 line-clamp-1">{item.title}</h3>
                      {item.category && (
                        <p className="text-xs text-dark-500 mt-1 capitalize">{item.category}</p>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-dark-600 text-lg">No gallery images available at the moment.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

