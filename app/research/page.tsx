import React from 'react';
import Footer from '@/components/public/Footer';
import AnimatedResearchCard from '@/components/public/AnimatedResearchCard';

async function getResearchPosts() {
  try {
    const res = await fetch(`/api/posts?category=research&status=published&limit=12`);
    if (res.ok) {
      const data = await res.json();
      return data.data || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching research posts:', error);
    return [];
  }
}

export default async function ResearchPage() {
  const posts = await getResearchPosts();

  return (
    <div className="min-h-screen flex flex-col">
    
      
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Research Projects</h1>
            <p className="text-xl text-primary-100">
              Explore our innovative research projects and contributions to robotics
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post: any, index: number) => (
                <AnimatedResearchCard key={post._id} post={post} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-dark-600 text-lg">No research projects available at the moment.</p>
            </div>
          )}
        </div>
      </main>

    
    </div>
  );
}

