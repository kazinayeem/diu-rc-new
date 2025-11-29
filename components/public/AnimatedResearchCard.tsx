'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowRight, BookOpen, ExternalLink, Calendar, Users, FileText } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface AnimatedResearchCardProps {
  post: any;
  index: number;
}

export default function AnimatedResearchCard({ post, index }: AnimatedResearchCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card variant="elevated" className="group hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        {post.image && (
          <div className="relative h-48 w-full overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        )}
        <CardContent className="p-6 flex-grow flex flex-col">
          <div className="flex items-center mb-2">
            <BookOpen size={16} className="text-primary-600 mr-2" />
            <span className="text-xs text-primary-600 font-semibold uppercase">{post.category}</span>
          </div>
          <h3 className="text-xl font-bold text-dark-900 mb-2 group-hover:text-primary-600 transition-colors">
            {post.title}
          </h3>
          <p className="text-dark-600 text-sm mb-4 line-clamp-3 flex-grow">{post.excerpt}</p>
          
          {/* Research Paper Details */}
          {(post.authors || post.journal || post.publicationDate) && (
            <div className="mb-4 space-y-2 text-sm">
              {post.authors && post.authors.length > 0 && (
                <div className="flex items-start">
                  <Users size={14} className="text-primary-600 mr-2 mt-1" />
                  <span className="text-dark-600">
                    {post.authors.join(', ')}
                  </span>
                </div>
              )}
              {post.journal && (
                <div className="flex items-start">
                  <FileText size={14} className="text-primary-600 mr-2 mt-1" />
                  <span className="text-dark-600">{post.journal}</span>
                </div>
              )}
              {post.publicationDate && (
                <div className="flex items-start">
                  <Calendar size={14} className="text-primary-600 mr-2 mt-1" />
                  <span className="text-dark-600">{formatDate(post.publicationDate)}</span>
                </div>
              )}
            </div>
          )}
          
          <div className="space-y-2">
            {post.paperLink && (
              <a
                href={post.paperLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button variant="outline" className="w-full group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600">
                  <ExternalLink size={16} className="mr-2" />
                  View Paper
                </Button>
              </a>
            )}
            <Link href={`/research/${post.slug}`}>
              <Button variant="outline" className="w-full group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600">
                Read More
                <ArrowRight size={16} className="ml-2 inline-block group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

