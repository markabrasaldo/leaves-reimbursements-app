'use server';

import { revalidatePath } from 'next/cache';
import { google } from 'googleapis';
import { calendar_v3 as googleCalendar } from '@googleapis/calendar';
import { add, format, parse, formatISO, isBefore, isAfter } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events'
];

const calendarId = process.env.CALENDAR_ID;

const availableSlots = ['08:00', '08:20', '08:40', '09:00', '09:20', '09:40'];

const initGoogleCalendar = async () => {
  try {
    const credentials = {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY
    };
    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: SCOPES
    });

    const calendar = google.calendar({ version: 'v3', auth });

    return calendar;
  } catch (error) {
    console.error('Error initializing Google Calendar API:', error);
  }
};

export const buildDateSlots = async (date: Date) => {
  /*
  return availableSlots.map(slot => {
    const [hours, minutes] = slot.split(':').map(Number);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
  });
  */

  const dateSlots = availableSlots.map((slot) => {
    const cetDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      +slot.slice(0, 2),
      +slot.slice(3, 5)
    );

    return fromZonedTime(cetDateTime, 'Asia/Manila');
  });
  return dateSlots;
};

export const getAvailableSlots = async (date: string) => {
  const calendar = await initGoogleCalendar();

  const dayDate = parse(date, 'yyyyMMdd', new Date());

  const response = await calendar?.events.list({
    calendarId: calendarId,
    eventTypes: ['default'],
    timeMin: dayDate.toISOString(),
    timeMax: add(dayDate, { days: 1 }).toISOString(),
    singleEvents: true,
    orderBy: 'startTime'
  });

  const events = response?.data?.items || [];
  const dateSlots = await buildDateSlots(dayDate);

  const availableSlots = dateSlots.filter((slot) => {
    const slotEnd = add(slot, { minutes: 20 });

    // Check if this slot conflicts with any existing event
    const hasConflict = events.some((event: googleCalendar.Schema$Event) => {
      const eventStart = new Date(event.start?.dateTime || '');
      const eventEnd = new Date(event.end?.dateTime || '');

      /*
      return isWithinInterval(slot, { start: eventStart, end: eventEnd }) ||
             isWithinInterval(slotEnd, { start: eventStart, end: eventEnd }) ||
             (slot < eventStart && slotEnd > eventEnd);
      */
      //return slot < eventEnd && slotEnd > eventStart;
      return isBefore(slot, eventEnd) && isAfter(slotEnd, eventStart);
    });

    return !hasConflict;
  });

  // Convert available Date objects to string time slots
  return availableSlots.map((slot) => {
    return format(toZonedTime(slot, 'Asia/Manila'), 'HH:mm');
  });
};

export const createMeeting = async (
  prevState: { message: string } | null,
  formData: FormData
) => {
  const calendar = await initGoogleCalendar();
  let message = '';

  const dateString = formData.get('selectedCalendarDate') as string;
  const timeString = formData.get('timetable') as string;
  if (!timeString && availableSlots.includes(timeString)) {
    return { message: 'No correct time slot selected' };
  }
  const description = formData.get('message') as string;
  const title = formData.get('title') as string;

  // Parse the date and time in timezone
  const cetDateTime = parse(
    `${dateString} ${timeString}`,
    'MM/dd/yyyy HH:mm',
    new Date()
  );

  const utcDate = fromZonedTime(cetDateTime, 'Asia/Manila');

  // Convert date to UTC
  const startDateTime = new Date(utcDate.toUTCString());

  const endDateTime = add(startDateTime, { minutes: 20 });

  const event = {
    summary: `${title}`, // can be linked to leave or reimbursement
    description: description || undefined,
    start: {
      dateTime: formatISO(startDateTime),
      timeZone: 'Asia/Manila'
    },
    end: {
      dateTime: formatISO(endDateTime),
      timeZone: 'Asia/Manila'
    },
    /*
    attendees: [
        { email: "frederic.henri+test@gmail.com" },
    ],
    */
    //sendUpdates: 'all', // Sends email invite to attendees
    // conferenceData: {
    //   createRequest: {
    //     requestId: Math.random().toString(36).substring(7),
    //     conferenceSolutionKey: {
    //       type: 'hangoutsMeet'
    //     }
    //   }
    // },
    reminders: {
      // you can add this if you want to override the calendar reminder.
      useDefault: false,
      overrides: [
        {
          method: 'email',
          minutes: 30
        }
      ]
    }
  };

  const meeting = await calendar?.events.insert({
    calendarId: calendarId,
    //conferenceDataVersion: 1,
    requestBody: event
  });

  if (meeting?.data) {
    if (meeting.status === 200) {
      message = 'Meeting has been added to my calendar';
    } else {
      message = 'Failed to insert event';
    }
  } else {
    message = 'Failed to insert event: Calendar not initialized';
  }

  revalidatePath('/');
  return { message: message };
};
