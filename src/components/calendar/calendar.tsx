import { startTransition, useActionState, useState } from 'react';
import { Calendar } from '../ui/calendar';
import { createMeeting, getAvailableSlots } from './calendar-action';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';

export default function GoogleCalendar() {
  const [state, formMeetAction, isPending] = useActionState(createMeeting, {
    message: ''
  });
  const [selected, setSelectedDate] = useState<Date>();
  const [slots, setAvailableSlots] = useState<string[]>();
  const [timetableError, setTimetableError] = useState<string>('');
  const [isTimeTableLoading, setIsTimeTableLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleDayPickerSelect = async (date: Date | undefined) => {
    setTimetableError('');
    setShowMessage(false);
    if (!date) {
      setSelectedDate(undefined);
      setAvailableSlots([]);
    } else {
      if (date.getDay() == 0 || date.getDay() == 6 || date < new Date()) {
        setSelectedDate(undefined);
        setAvailableSlots([]);
      } else {
        setSelectedDate(date);
        setIsTimeTableLoading(true);
        try {
          const availableSlots = await getAvailableSlots(
            format(date, 'yyyyMMdd')
          );
          setAvailableSlots(availableSlots);
        } catch (error) {
          console.error(error);
          setTimetableError(
            'Failed to fetch available slots. Please try again.'
          );
        } finally {
          setIsTimeTableLoading(false);
        }
      }
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (!formData.get('timetable') || !formData.get('selectedCalendarDate')) {
      setTimetableError('Please select a date and time slot');
    } else {
      startTransition(() => {
        formMeetAction(formData);
      });
      setShowMessage(true);
      setTimetableError('');
      setSelectedDate(undefined);
      setAvailableSlots([]);
    }
  };

  const resetForm = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const form = event.currentTarget.form;
    if (form) {
      form.reset();
      setSelectedDate(undefined);
    }
  };

  return (
    <div className='flex items-center justify-center py-10'>
      <form
        name='meeting-invitation-form'
        className='flex flex-col gap-4'
        onSubmit={handleSubmit}
      >
        {showMessage && state.message && (
          <p className='text-md mt-2 text-green-500'>{state.message}</p>
        )}

        <div className='flex flex-col gap-4 sm:flex-row'>
          <DayPicker
            mode='single'
            required
            selected={selected}
            onSelect={handleDayPickerSelect}
            timeZone='Asia/Manila'
          />
          <input
            id='selectedCalendarDate'
            name='selectedCalendarDate'
            type='hidden'
            value={selected ? selected.toLocaleDateString() : ''}
          />

          <div className='mt-5 w-full border-gray-200 dark:border-gray-800 sm:ms-7 sm:mt-0 sm:max-w-[15rem] sm:border-s sm:ps-5'>
            <h3 className='mb-3 text-center text-base font-medium text-gray-900 dark:text-white'>
              {selected ? selected.toLocaleDateString() : 'Select a Date First'}
            </h3>
            <button
              type='button'
              data-collapse-toggle='timetable'
              className='me-2 inline-flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700'
            >
              <svg
                className='me-2 h-4 w-4 text-gray-800 dark:text-white'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  fillRule='evenodd'
                  d='M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z'
                  clipRule='evenodd'
                />
              </svg>
              Pick An Available Time
            </button>
            <label className='sr-only'>Pick a time</label>
            {isTimeTableLoading ? (
              <div className='flex h-32 flex-col items-center justify-center'>
                <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-blue-700'></div>
                <p className='ml-2 items-center justify-center'>Loading...</p>
              </div>
            ) : (
              <>
                {slots && slots.length > 0 ? (
                  <>
                    <ul
                      id='timetable'
                      className='mt-5 grid w-full grid-cols-2 gap-2'
                    >
                      {slots.map((slot) => (
                        <li key={slot}>
                          <input
                            type='radio'
                            id={slot}
                            value={slot}
                            className='peer hidden'
                            name='timetable'
                            onChange={() => setTimetableError('')}
                          />
                          <label
                            htmlFor={slot}
                            className='inline-flex w-full cursor-pointer items-center justify-center rounded-lg border border-blue-600 bg-white p-2 text-center text-sm font-medium text-blue-600 hover:bg-blue-500 hover:text-white peer-checked:border-blue-600 peer-checked:bg-blue-600 peer-checked:text-white dark:border-blue-500 dark:bg-gray-900 dark:text-blue-500 dark:hover:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white dark:peer-checked:border-blue-500 dark:peer-checked:bg-blue-500'
                          >
                            {slot} AM
                          </label>
                        </li>
                      ))}
                    </ul>
                    {timetableError && (
                      <p className='mt-2 items-center text-sm text-red-500'>
                        {timetableError}
                      </p>
                    )}
                  </>
                ) : (
                  <div className='flex h-32 w-full items-center justify-center'>
                    <p className='text-lg font-medium dark:text-white'>
                      No Time Available
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <input
            id='title'
            name='title'
            className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
            placeholder='Title of schedule'
            required
          />
          <textarea
            id='message'
            name='message'
            required
            rows={4}
            className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
            placeholder='Please Provide Topics For the Discussion...'
          ></textarea>
        </div>
        <div className='flex flex-col items-end gap-2'>
          <button
            type='submit'
            disabled={isPending}
            aria-label='Submit'
            className='w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 md:w-1/4'
          >
            {isPending ? 'Submitting' : 'Submit'}
          </button>
          <button
            type='button'
            disabled={isPending}
            aria-label='Reset'
            className='w-full rounded-lg border border-gray-200 bg-white px-5 py-2.5 font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 md:w-1/4'
            onClick={resetForm}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
