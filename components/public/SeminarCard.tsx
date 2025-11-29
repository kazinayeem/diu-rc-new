import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, MapPin, User, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface SeminarCardProps {
  seminar: {
    _id: string;
    title: string;
    slug: string;
    description: string;
    image?: string;
    seminarDate: string;
    seminarTime: string;
    location: string;
    speaker: string;
    speakerImage?: string;
    status: string;
  };
}

const SeminarCard: React.FC<SeminarCardProps> = ({ seminar }) => {
  const statusColors = {
    upcoming: 'bg-green-100 text-green-800',
    ongoing: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <Card variant="elevated" className="group hover:shadow-xl transition-all duration-300">
      {seminar.image && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={seminar.image}
            alt={seminar.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[seminar.status as keyof typeof statusColors]}`}>
              {seminar.status}
            </span>
          </div>
        </div>
      )}
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-dark-900 mb-2 group-hover:text-primary-600 transition-colors">
          {seminar.title}
        </h3>
        <p className="text-dark-600 text-sm mb-4 line-clamp-2">
          {seminar.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-dark-600">
            <User size={16} className="mr-2 text-primary-600" />
            <span className="font-medium">{seminar.speaker}</span>
          </div>
          <div className="flex items-center text-sm text-dark-600">
            <Calendar size={16} className="mr-2 text-primary-600" />
            <span>{formatDate(seminar.seminarDate)}</span>
            <span className="mx-2">•</span>
            <span>{seminar.seminarTime}</span>
          </div>
          <div className="flex items-center text-sm text-dark-600">
            <MapPin size={16} className="mr-2 text-primary-600" />
            <span>{seminar.location}</span>
          </div>
        </div>

        <Link href={`/seminars/${seminar.slug}`}>
          <Button variant="outline" className="w-full group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600">
            Learn More
            <ArrowRight size={16} className="ml-2 inline-block group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default SeminarCard;

