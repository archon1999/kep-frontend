import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ReactFullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';

interface FullCalendarOptions extends CalendarOptions {
  ref?: React.Ref<ReactFullCalendar>;
}

const FullCalendar = ({ ref, ...rest }: FullCalendarOptions) => {
  return (
    <ReactFullCalendar
      ref={ref}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      direction="ltr"
      headerToolbar={false}
      selectable
      eventDisplay="block"
      fixedWeekCount={false}
      dayMaxEventRows={1}
      editable={false}
      eventTimeFormat={{
        hour: 'numeric',
        minute: '2-digit',
        hour12: false,
      }}
      slotDuration="00:60:00"
      slotLabelInterval="01:00:00"
      {...rest}
    />
  );
};

export default FullCalendar;
