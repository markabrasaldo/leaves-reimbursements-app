'use client';

import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface Event {
  id: string;
  summary: string;
  start: string;
  end: string;
}

export function EventCalendar({
  dateRange,
  title
}: {
  dateRange: any;
  title: string;
}) {
  const [events, setEvents] = useState<any[]>([]);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const fetchEvents = async () => {
      const calendarUrl = '';
      try {
        const response = await fetch(calendarUrl);
        const data: Event[] = await response.json();
        setEvents(
          data.map((event) => ({
            id: event.id,
            title: event.summary,
            start: event.start,
            end: event.end
          }))
        );
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='p-4'>
      <h2 className='mb-4 text-center text-xl font-bold'>{title}</h2>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={windowWidth < 768 ? 'timeGridDay' : 'dayGridMonth'} // Mobile: Show daily view
        events={events}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right:
            windowWidth < 768
              ? 'timeGridDay'
              : 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        validRange={{
          start: dateRange?.startDate,
          end: dateRange?.endDate
        }}
        aspectRatio={windowWidth < 768 ? 0.8 : 1.5}
        contentHeight='auto'
        dayMaxEventRows={2}
        height='auto'
      />
    </div>
  );
}
