'use client';

import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';

interface AnimatedWorkshopContentProps {
  workshop: any;
}

export default function AnimatedWorkshopContent({ workshop }: AnimatedWorkshopContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-2xl font-bold text-dark-900 mb-4">About This Workshop</h2>
      {workshop.content ? (
        <div 
          className="prose max-w-none text-dark-600"
          dangerouslySetInnerHTML={{ __html: workshop.content }}
        />
      ) : (
        <p className="text-dark-600">{workshop.description}</p>
      )}

      {workshop.tags && workshop.tags.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-dark-900 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {workshop.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
              >
                <Tag size={14} className="inline mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

