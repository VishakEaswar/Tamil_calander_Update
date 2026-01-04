import React from "react";
import { Box, Typography } from "@mui/material";
import { startOfMonth, endOfMonth, getDay, addDays, subDays, isSameMonth } from "date-fns";
import DayCell from "./DayCell";

function SimpleCalendar({ currentMonth, selectedDate, months, festivals, onDateClick }) {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Get days in current month view
  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = monthStart;
    const startDay = getDay(startDate); // 0-6
    
    let blanks = [];
    for (let i = 0; i < startDay; i++) {
      const prevDay = subDays(startDate, startDay - i);
      blanks.push(
        <DayCell 
          key={`empty-${i}`} 
          date={prevDay} 
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          months={months}
          festivals={festivals}
          onDateClick={onDateClick}
          className="prev-month"
        />
      );
    }
    
    let daysInMonth = [];
    let day = startDate;
    
    while (day <= monthEnd) {
      daysInMonth.push(
        <DayCell 
          key={day.toString()} 
          date={day}
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          months={months}
          festivals={festivals}
          onDateClick={onDateClick}
        />
      );
      day = addDays(day, 1);
    }
    
    const totalSlots = [...blanks, ...daysInMonth];
    const rows = [];
    let cells = [];
    
    totalSlots.forEach((day, i) => {
      if (i % 7 !== 0) {
        cells.push(day);
      } else {
        if (cells.length > 0) {
          rows.push(cells);
        }
        cells = [day];
      }
      if (i === totalSlots.length - 1) {
        rows.push(cells);
      }
    });
    
    // Add any remaining slots to complete the final row
    const lastRow = rows[rows.length - 1];
    if (lastRow.length < 7) {
      const remainingSlots = 7 - lastRow.length;
      for (let i = 0; i < remainingSlots; i++) {
        const nextDay = addDays(monthEnd, i + 1);
        lastRow.push(
          <DayCell 
            key={`next-${i}`} 
            date={nextDay} 
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            months={months}
            festivals={festivals}
            onDateClick={onDateClick}
            className="next-month"
          />
        );
      }
    }
    
    return rows.map((row, i) => (
      <tr key={i}>{row}</tr>
    ));
  };

  return (
    <Box sx={{ width: '100%', overflow: 'auto', px: 2 }} className="calendar-grid">
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {weekdays.map(day => (
              <th key={day} 
               className={day === 'Sun' ? 'sunday' : ''}
              style={{ 
                padding: '10px 0', 
                textAlign: 'center',
                fontSize: '1rem',
                fontWeight: 600,
                color: day === 'Sun' ? '#d32f2f' : '#446644ff',
                borderBottom: '2px solid #c17e7eff'
              }}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {renderCalendar()}
        </tbody>
      </table>
      
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mt: 2,
        mb: 2, 
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            width: 10, 
            height: 10, 
            bgcolor: '#4caf50', 
            borderRadius: '50%', 
            mr: 0.5 
          }} />
          <Typography variant="caption">Tamil Day</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            width: 10, 
            height: 10, 
            bgcolor: '#ff9800', 
            borderRadius: '2px', 
            mr: 0.5 
          }} />
          <Typography variant="caption">Tamil Month Start</Typography>
        </Box>
        
        {/* Color legend for festivals - optional */}
        {/* {festivals.map(fest => (
          <Box key={fest.id} sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ 
              width: 10, 
              height: 10, 
              bgcolor: fest.color || '#f44336', 
              borderRadius: '50%', 
              mr: 0.5 
            }} />
            <Typography variant="caption" noWrap sx={{ maxWidth: '120px' }}>
              {fest.name}
            </Typography>
          </Box>
        ))} */}
      </Box>
    </Box>
  );
}

export default SimpleCalendar;
