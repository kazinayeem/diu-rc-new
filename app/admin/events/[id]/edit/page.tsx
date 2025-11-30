import EventFormPage from "@/components/admin/forms/EventFormPage";

export default function EditEventPage({ params }: any) {
  return <EventFormPage eventId={params.id} />;
}
