import React from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import { getDay, isSameDay, isSameMonth } from "date-fns";
import { tamilMonths } from "./constants";

function DayCell({ date, currentMonth, selectedDate, months, festivals, onDateClick, className = "" }) {
  const isToday = isSameDay(date, new Date());
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
  
  // Calculate Tamil date
  const monthIndex = date.getMonth();
  const monthData = months[monthIndex] || { daysInMonth: 31, tamilStartDay: 1 };
  const tamilDay = ((date.getDate() + monthData.tamilStartDay - 2) % monthData.daysInMonth) + 1;
  const tamilMonthIndex = date.getDate() < (monthData.daysInMonth - monthData.tamilStartDay) + 2
    ? (monthIndex + 11) % 12
    : monthIndex;
  const tamilMonth = tamilMonths[tamilMonthIndex];
  
  const festival = festivals.find(
    f => f.month === (monthIndex + 1) && f.day === date.getDate()
  );
  
  const isFirstDayOfTamilMonth = tamilDay === 1;
  
  return (
    <td 
      style={{ 
        position: 'relative',
        padding: 0,
        textAlign: 'center',
        cursor: 'pointer',
        borderLeft: isFirstDayOfTamilMonth ? '3px solid #ff9800' : '1px solid #f0f0f0',
        borderRight: '1px solid #f0f0f0',
        borderTop: '1px solid #f0f0f0',
        borderBottom: '1px solid #f0f0f0'
      }}
      onClick={() => onDateClick(date, tamilDay, tamilMonth)}
    >
      <Box sx={{ 
        p: {
          xs: 0.5,
          sm: 0.75,
          md: 1
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: festival 
          ? `${festival.color}10` // Use festival color as background with opacity
          : (isSelected 
              ? 'rgba(103, 58, 183, 0.1)' 
              : (isToday ? 'rgba(0, 0, 0, 0.04)' : 'transparent')),
        opacity: isCurrentMonth ? 1 : 0.4
      }} 
      className="calendar-day-content">
        {/* English date */}
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: isToday ? 700 : 500,
            color: (getDay(date) === 0) ? '#f44336' : (festival ? festival.color : '#212121'),
            fontSize: {
              xs: '0.75rem',
              sm: '0.8rem',
              md: '0.875rem'
            }
          }}
        >
          {date.getDate()}
        </Typography>
        
        {/* Tamil date */}
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#4caf50',
            fontSize: {
              xs: '0.6rem',
              sm: '0.65rem',
              md: '0.7rem'
            },
            mt: {
              xs: 0.2,
              sm: 0.3,
              md: 0.5
            }
          }}
          className="tamil-day"
        >
          {tamilDay}
        </Typography>
        
        {/* Festival marker */}
        {festival && (
          <Tooltip title={festival.name} placement="top">
            <Box sx={{ 
              position: 'absolute',
              right: '5px',
              top: '5px',
              width: {
                xs: '4px',
                sm: '5px',
                md: '6px'
              },
              height: {
                xs: '4px',
                sm: '5px',
                md: '6px'
              },
              backgroundColor: festival.color || '#f44336',
              borderRadius: '50%'
            }}
            className="festival-highlight" />
          </Tooltip>
        )}
        
        {/* Tamil month start */}
        {isFirstDayOfTamilMonth && (
          <Tooltip title={`${tamilMonth} month starts`} placement="top">
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                top: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                bgcolor: '#ff9800',
                color: 'white',
                fontSize: {
                  xs: '0.5rem',
                  sm: '0.55rem',
                  md: '0.6rem'
                },
                px: 0.5,
                py: 0.1,
                borderRadius: '2px',
                whiteSpace: 'nowrap'
              }}
              className="month-start-indicator"
            >
              {tamilMonth}
            </Typography>
          </Tooltip>
        )}
      </Box>
    </td>
  );
}

export default DayCell;


// import React from "react";
// import { Box, Typography, Tooltip } from "@mui/material";
// import { getDay, isSameDay, isSameMonth } from "date-fns";
// import { tamilMonths } from "./constants";

// function DayCell({ date, currentMonth, selectedDate, months, festivals, onDateClick, className = "" }) {
//   const isToday = isSameDay(date, new Date());
//   const isCurrentMonth = isSameMonth(date, currentMonth);
//   const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
  
//   // Calculate Tamil date
//   const monthIndex = date.getMonth();
//   const monthData = months[monthIndex] || { daysInMonth: 31, tamilStartDay: 1 };
//   const tamilDay = ((date.getDate() + monthData.tamilStartDay - 2) % monthData.daysInMonth) + 1;
//   const tamilMonthIndex = date.getDate() < (monthData.daysInMonth - monthData.tamilStartDay) + 2
//     ? (monthIndex + 11) % 12
//     : monthIndex;
//   const tamilMonth = tamilMonths[tamilMonthIndex];
  
//   const festival = festivals.find(
//     f => f.month === (monthIndex + 1) && f.day === date.getDate()
//   );
  
//   const isFirstDayOfTamilMonth = tamilDay === 1;
  
//   return (
//     <td 
//       style={{ 
//         position: 'relative',
//         padding: 0,
//         textAlign: 'center',
//         cursor: 'pointer',
//         borderLeft: isFirstDayOfTamilMonth ? '3px solid #ff9800' : '1px solid #f0f0f0',
//         borderRight: '1px solid #f0f0f0',
//         borderTop: '1px solid #f0f0f0',
//         borderBottom: '1px solid #f0f0f0'
//       }}
//       onClick={() => onDateClick(date, tamilDay, tamilMonth)}
//     >
//       <Box sx={{ 
//         p: 1,
//         height: '60px',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: festival 
//           ? `${festival.color}10` // Use festival color as background with opacity
//           : (isSelected 
//               ? 'rgba(63, 81, 181, 0.1)' 
//               : (isToday ? 'rgba(0, 0, 0, 0.04)' : 'transparent')),
//         opacity: isCurrentMonth ? 1 : 0.4
//       }}>
//         {/* English date */}
//         <Typography 
//           variant="body2" 
//           sx={{ 
//             fontWeight: isToday ? 700 : 500,
//             color: (getDay(date) === 0) ? '#d32f2f' : (festival ? festival.color : '#424242')
//           }}
//         >
//           {date.getDate()}
//         </Typography>
        
//         {/* Tamil date */}
//         <Typography 
//           variant="caption" 
//           sx={{ 
//             color: '#4caf50',
//             fontSize: '0.7rem',
//             mt: 0.5
//           }}
//         >
//           {tamilDay}
//         </Typography>
        
//         {/* Festival marker */}
//         {festival && (
//           <Tooltip title={festival.name} placement="top">
//             <Box sx={{ 
//               position: 'absolute',
//               right: '5px',
//               top: '5px',
//               width: '6px',
//               height: '6px',
//               backgroundColor: festival.color || '#f44336',
//               borderRadius: '50%'
//             }}/>
//           </Tooltip>
//         )}
        
//         {/* Tamil month start */}
//         {isFirstDayOfTamilMonth && (
//           <Tooltip title={`${tamilMonth} month starts`} placement="top">
//             <Typography
//               variant="caption"
//               sx={{
//                 position: 'absolute',
//                 top: '-8px',
//                 left: '50%',
//                 transform: 'translateX(-50%)',
//                 bgcolor: '#ff9800',
//                 color: 'white',
//                 fontSize: '0.6rem',
//                 px: 0.5,
//                 py: 0.1,
//                 borderRadius: '2px',
//                 whiteSpace: 'nowrap'
//               }}
//             >
//               {tamilMonth}
//             </Typography>
//           </Tooltip>
//         )}
//       </Box>
//     </td>
//   );
// }

// export default DayCell;
