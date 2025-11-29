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
  const statusColors = {
    upcoming: "bg-green-500/20 text-green-300 border border-green-400/30",
    ongoing: "bg-blue-500/20 text-blue-300 border border-blue-400/30",
    completed: "bg-gray-500/20 text-gray-300 border border-gray-400/30",
    cancelled: "bg-red-500/20 text-red-300 border border-red-400/30",
  };

  return (
    <Card
      variant="elevated"
      className="group hover:shadow-xl transition-all duration-300 
                 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl"
    >
      {event.image && (
        <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />

          {/* STATUS BADGE */}
          <div className="absolute top-4 right-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold 
              ${statusColors[event.status as keyof typeof statusColors]}`}
            >
              {event.status}
            </span>
          </div>
        </div>
      )}

      <CardContent className="p-6">
        {/* TITLE */}
        <h3
          className="text-xl font-bold text-white mb-2 
        group-hover:text-cyan-300 transition-colors"
        >
          {event.title}
        </h3>

        {/* DESCRIPTION */}
        <p className="text-cyan-100/80 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* DETAILS */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-cyan-200/80">
            <Calendar size={16} className="mr-2 text-cyan-300" />
            <span>{formatDate(event.eventDate)}</span>
            <span className="mx-2">•</span>
            <span>{event.eventTime}</span>
          </div>

          <div className="flex items-center text-sm text-cyan-200/80">
            <MapPin size={16} className="mr-2 text-cyan-300" />
            <span>{event.location}</span>
          </div>

          {event.attendees !== undefined && (
            <div className="flex items-center text-sm text-cyan-200/80">
              <Users size={16} className="mr-2 text-cyan-300" />
              <span>{event.attendees} attendees</span>
            </div>
          )}
        </div>

        {/* BUTTON */}
        <Link href={`/events/${event.slug}`}>
          <Button
            variant="outline"
            className="w-full border-cyan-400 text-cyan-300 
            hover:bg-cyan-400 hover:text-black hover:border-cyan-400 
            transition"
          >
            Learn More
            <ArrowRight
              size={16}
              className="ml-2 inline-block group-hover:translate-x-1 transition-transform"
            />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default EventCard;
