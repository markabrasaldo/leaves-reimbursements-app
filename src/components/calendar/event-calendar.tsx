'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { toCamelCase } from 'js-convert-case';
import { CHART_COLORS } from '@/features/overview/components/config';

import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  const { data: session } = useSession();

  interface Event {
    id: string;
    summary: string;
    start: string;
    end: string;
    backgroundColor: keyof typeof eventColors;
    borderColor: keyof typeof eventColors;
  }

  const eventColors: { [key: string]: string } = {
    birthdayLeave: CHART_COLORS.COLOR_BIRTHDAY_LEAVE,
    bereavementLeave: CHART_COLORS.COLOR_BEREAVEMENT_LEAVE,
    emergencyLeave: CHART_COLORS.COLOR_EMERGENCY_LEAVE,
    sickLeave: CHART_COLORS.COLOR_SICK_LEAVE,
    vacationLeave: CHART_COLORS.COLOR_VACATION_LEAVE
  };

  const getLeaveTypeFromSummary = (summary: string): string => {
    const leaveType = summary.split(' - ')[0];
    return toCamelCase(leaveType);
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_LEAVE;
      const startDate = dateRange?.startDate.toISOString().split('T')[0];
      const endDate = dateRange?.endDate.toISOString().split('T')[0];
      const calendarUrl = `${baseUrl}/${session?.user?.organization?.code}/calendar-events?start_date=${startDate}&end_date=${endDate}`;
      try {
        const response = await fetch(calendarUrl, {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        const calendarEvents = await response.json();
        if (calendarEvents?.data && calendarEvents?.data.length > 0) {
          setEvents(
            calendarEvents?.data.map((event: Event) => ({
              id: event.id,
              title: event.summary,
              start: event.start,
              end: event.end,
              backgroundColor:
                eventColors[getLeaveTypeFromSummary(event?.summary)],
              borderColor: eventColors[getLeaveTypeFromSummary(event?.summary)]
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, [dateRange]);

  return (
    <Card className='flex flex-col dark:bg-[#1E1E1E]/100'>
      <div className='p-4'>
        <CardTitle className='text-center'>{title}</CardTitle>
        <CardContent>
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
            dateClick={(args) =>
              router.push(`/dashboard/leave/new?start_date=${args.dateStr}`)
            }
            height='auto'
          />
        </CardContent>
      </div>
    </Card>
  );
}
