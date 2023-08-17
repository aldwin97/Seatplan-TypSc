import React, { Component } from 'react';
import  FullCalendar  from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions, CalendarApi } from '@fullcalendar/core';
import { CustomRendering } from '@fullcalendar/core/internal';

interface CalendarState {
  customRenderingMap: Map<string, CustomRendering<any>>;
}

class ResizableFullCalendar extends Component<CalendarOptions, CalendarState> {
  state: CalendarState = {
    customRenderingMap: new Map(),
  };

  render() {
    return (
      <div style={{ width: '380px' }} > {/* Adjust the width as needed */}
        <FullCalendar
          plugins={[dayGridPlugin]}
          {...this.props}
        />
      </div>
    );
  }
}

export default ResizableFullCalendar;
