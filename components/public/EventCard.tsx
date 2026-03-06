import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface EventCardProps {
  event: {
    _id: string;
    title: string;
    slug: string;
    description: string;
    image?: string;
    eventDate: string;
    eventTime: string;
    location: string;
    status: string;
    attendees?: number;
  };
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const statusColors: Record<string, string> = {
    upcoming:  'bg-[rgba(61,181,216,0.15)] text-[#3DB5D8] border border-[rgba(61,181,216,0.3)]',
    ongoing:   'bg-[rgba(67,97,238,0.2)] text-[#8ED6E6] border border-[rgba(67,97,238,0.4)]',
    completed: 'bg-[rgba(144,224,239,0.08)] text-[#8ED6E6]/50 border border-[rgba(144,224,239,0.15)]',
    cancelled: 'bg-[rgba(58,12,163,0.2)] text-[#8ED6E6]/60 border border-[rgba(58,12,163,0.3)]',
  };

  return (
    <Card
      variant="elevated"
      className="group hover:border-[rgba(0,229,255,0.2)] hover:shadow-[0_12px_40px_rgba(0,229,255,0.1)] transition-all duration-300"
    >
      {event.image && (
        <div className="relative h-44 w-full overflow-hidden">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/90 via-transparent to-transparent" />
          {/* status badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[event.status] ?? statusColors.completed}`}>
              {event.status}
            </span>
          </div>
        </div>
      )}

      <CardContent className="p-5">
        <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#3DB5D8] transition-colors leading-snug">
          {event.title}
        </h3>

        <p className="text-[#8ED6E6]/60 text-xs mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-[#8ED6E6]/60">
            <Calendar size={12} className="text-[#3DB5D8] flex-shrink-0" />
            <span>{formatDate(event.eventDate)} · {event.eventTime}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#8ED6E6]/60">
            <MapPin size={12} className="text-[#3DB5D8] flex-shrink-0" />
            <span>{event.location}</span>
          </div>
          {event.attendees !== undefined && (
            <div className="flex items-center gap-2 text-xs text-[#8ED6E6]/60">
              <Users size={12} className="text-[#3DB5D8] flex-shrink-0" />
              <span>{event.attendees} attendees</span>
            </div>
          )}
        </div>

        <Link href={`/events/${event.slug}`}>
          <Button variant="outline" size="sm" className="w-full">
            Learn More <ArrowRight size={13} />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default EventCard;
