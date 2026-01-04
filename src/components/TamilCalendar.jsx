import React, { useState, useEffect } from "react";
import {
  Container, Typography, Snackbar, Alert, AppBar, Toolbar, Tabs, Tab,
  Box, IconButton, Card, useTheme, useMediaQuery, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, Grid, TextField, MenuItem,
  Fab, Zoom, Paper, Stack, Avatar, Menu
} from "@mui/material";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MenuIcon from "@mui/icons-material/Menu";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SettingsIcon from "@mui/icons-material/Settings";
import TodayIcon from "@mui/icons-material/Today";
import DateRangeIcon from "@mui/icons-material/DateRange";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { format, addMonths, subMonths } from "date-fns";

// Import components
import SimpleCalendar from "./SimpleCalendar";
import AdminTable from "./AdminTable";
import DateDetailsModal from "./DateDetailsModal";

// Import constants
import { defaultFestivals } from "./constants";

// Professional color palette
const colors = {
  primary: {
    main: '#1a365d',
    light: '#2d5d7b',
    dark: '#0f2744',
    gradient: 'linear-gradient(135deg, #1a365d 0%, #2c5282 50%, #3182ce 100%)'
  },
  secondary: {
    main: '#6a1b9a',
    light: '#9c4dcc',
    dark: '#38006b',
    gradient: 'linear-gradient(135deg, #6a1b9a 0%, #8e24aa 50%, #ba68c8 100%)'
  },
  accent: {
    main: '#00695c',
    light: '#439889',
    dark: '#003d33',
    gold: '#d69e2e',
    success: '#38a169'
  },
  background: {
    main: 'linear-gradient(135deg, #f8faff 0%, #e8eaf6 50%, #f3e5f5 100%)',
    card: 'rgba(255, 255, 255, 0.95)',
    glass: 'rgba(255, 255, 255, 0.1)'
  },
  surface: {
    white: '#ffffff',
    light: '#f7fafc',
    medium: '#edf2f7',
    dark: '#e2e8f0'
  }
};

// Enhanced Day Cell Component with subtle current day styling
function DayCell({ date, currentMonth, selectedDate, months, festivals, onDateClick, isOtherMonth = false }) {
  const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
  const isSelected = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
  
  // Calculate Tamil date
  const monthIndex = date.getMonth();
  const monthData = months[monthIndex] || { daysInMonth: 31, tamilStartDay: 1 };
  const tamilDay = ((date.getDate() + monthData.tamilStartDay - 2) % monthData.daysInMonth) + 1;
  const tamilMonthIndex = date.getDate() < (monthData.daysInMonth - monthData.tamilStartDay) + 2
    ? (monthIndex + 11) % 12
    : monthIndex;
  
  const tamilMonths = [
    "Thai","Maasi","Panguni","Chithirai","Vaikasi","Aani",
    "Aadi","Avani","Purattasi","Aippasi","Karthigai","Margazhi"
  ];
  const tamilMonth = tamilMonths[tamilMonthIndex];
  
  // Get all festivals for this date
  const dateFestivals = festivals.filter(
    f => f.month === (date.getMonth() + 1) && f.day === date.getDate()
  );
  
  const isFirstDayOfTamilMonth = tamilDay === 1;
  
  // Festival color marks - show above the date
  const renderFestivalMarks = () => {
    if (dateFestivals.length === 0) return null;
    
    return (
      <Box sx={{ 
        position: 'absolute',
        top: 2,
        left: 2,
        right: 2,
        display: 'flex',
        justifyContent: 'center',
        gap: 0.5,
        flexWrap: 'wrap',
        zIndex: 2
      }}>
        {dateFestivals.slice(0, 4).map((festival, index) => (
          <Box
            key={festival.id}
            sx={{
              width: dateFestivals.length === 1 ? 16 : dateFestivals.length === 2 ? 12 : 8,
              height: dateFestivals.length === 1 ? 16 : dateFestivals.length === 2 ? 12 : 8,
              borderRadius: '50%',
              bgcolor: festival.color || '#ef4444',
              border: '1px solid white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              flexShrink: 0
            }}
            title={festival.name}
          />
        ))}
        {dateFestivals.length > 4 && (
          <Box sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: '#6b7280',
            border: '1px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '6px',
            color: 'white',
            fontWeight: 'bold'
          }}>
            +
          </Box>
        )}
      </Box>
    );
  };
  
  return (
    <td 
      style={{ 
        position: 'relative',
        padding: 0,
        textAlign: 'center',
        cursor: 'pointer',
        border: '1px solid #e5e7eb',
        height: '70px',
        verticalAlign: 'top',
        backgroundColor: isOtherMonth 
          ? '#f9fafb' 
          : (isSelected 
              ? 'rgba(59, 130, 246, 0.15)' 
              : (isToday 
                  ? 'rgba(107, 114, 128, 0.08)' // Light gray shade for today
                  : 'white'
                )
            ),
        borderLeft: isFirstDayOfTamilMonth ? '3px solid #f59e0b' : '1px solid #e5e7eb'
      }}
      onClick={() => onDateClick(date, tamilDay, tamilMonth)}
    >
      <Box sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        p: 0.5
      }}>
        {/* Festival color marks above date */}
        {renderFestivalMarks()}
        
        {/* English date */}
        <Typography 
          variant="body1" 
          sx={{ 
            fontWeight: isSelected ? 700 : (isToday ? 600 : 500), // Today gets medium weight
            color: isOtherMonth 
              ? '#9ca3af' 
              : (format(date, 'E') === 'Sun' 
                  ? '#dc2626' 
                  : (isSelected
                      ? '#1d4ed8' // Selected date gets blue color
                      : (isToday 
                          ? '#374151' // Today gets normal dark color
                          : (dateFestivals.length > 0 ? '#1f2937' : '#374151')
                        )
                    )
                ),
            fontSize: { xs: '0.875rem', sm: '1rem' },
            lineHeight: 1.2,
            mt: dateFestivals.length > 0 ? 1.5 : 0
          }}
        >
          {date.getDate()}
        </Typography>
        
        {/* Tamil date */}
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#10b981',
            fontSize: { xs: '0.65rem', sm: '0.75rem' },
            fontWeight: 500,
            mt: 0.2,
            opacity: isOtherMonth ? 0.6 : 1
          }}
        >
          {tamilDay}
        </Typography>
        
        {/* Tamil month start indicator */}
        {isFirstDayOfTamilMonth && (
          <Box sx={{
            position: 'absolute',
            bottom: 2,
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: '#f59e0b',
            color: 'white',
            fontSize: { xs: '0.55rem', sm: '0.65rem' },
            px: 0.5,
            py: 0.1,
            borderRadius: '2px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
          }}>
            {tamilMonth}
          </Box>
        )}
        
        {/* Selected indicator - blue border */}
        {isSelected && (
          <Box sx={{
            position: 'absolute',
            inset: 2,
            border: '2px solid #ffffffff',
            borderRadius: 1,
            pointerEvents: 'none',
            zIndex: 1
          }} />
        )}
      </Box>
    </td>
  );
}

// Enhanced SimpleCalendar Component with Festival Color Marks
function EnhancedSimpleCalendar({ currentMonth, selectedDate, months, festivals, onDateClick }) {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const renderCalendar = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    const startDay = startDate.getDay();
    
    // Previous month days
    let blanks = [];
    for (let i = 0; i < startDay; i++) {
      const prevDay = new Date(monthStart);
      prevDay.setDate(prevDay.getDate() - (startDay - i));
      blanks.push(
        <DayCell 
          key={`empty-${i}`} 
          date={prevDay} 
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          months={months}
          festivals={festivals}
          onDateClick={onDateClick}
          isOtherMonth={true}
        />
      );
    }
    
    // Current month days
    let daysInMonth = [];
    for (let d = 1; d <= monthEnd.getDate(); d++) {
      const day = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
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
    }
    
    const totalSlots = [...blanks, ...daysInMonth];
    
    // Add next month days to complete weeks
    const remainingSlots = 42 - totalSlots.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingSlots; i++) {
      const nextDay = new Date(monthEnd);
      nextDay.setDate(monthEnd.getDate() + i);
      totalSlots.push(
        <DayCell 
          key={`next-${i}`} 
          date={nextDay} 
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          months={months}
          festivals={festivals}
          onDateClick={onDateClick}
          isOtherMonth={true}
        />
      );
    }
    
    // Organize into rows
    const rows = [];
    for (let i = 0; i < totalSlots.length; i += 7) {
      rows.push(totalSlots.slice(i, i + 7));
    }
    
    return rows.map((row, i) => (
      <tr key={i}>{row}</tr>
    ));
  };

  return (
    <Box sx={{ width: '100%', overflow: 'auto', p: 2 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <thead>
          <tr>
            {weekdays.map(day => (
              <th key={day} style={{ 
                padding: '12px 4px', 
                textAlign: 'center',
                fontSize: '1rem',
                fontWeight: 600,
                color: day === 'Sun' ? '#dc2626' : '#1f2937',
                borderBottom: '2px solid #e5e7eb',
                background: 'rgba(249, 250, 251, 0.8)'
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
    </Box>
  );
}

function DateNavigationDialog({ open, currentDate, onClose, onDateChange }) {
  const [pickerDate, setPickerDate] = useState(currentDate);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const handleApply = () => {
    if (pickerDate) {
      onDateChange(pickerDate);
    }
    onClose();
  };
  
  const handleDatePickerChange = (newDate) => {
    if (newDate) {
      setPickerDate(newDate);
    }
  };

  const handleTodayClick = () => {
    const today = new Date();
    setPickerDate(today);
    onDateChange(today);
    onClose();
  };

  // Update picker date when dialog opens with new current date
  useEffect(() => {
    if (open) {
      setPickerDate(currentDate);
    }
  }, [open, currentDate]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: colors.surface.white,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: '1px solid rgba(26, 54, 93, 0.1)'
        }
      }}
    >
      <DialogTitle sx={{
        background: colors.primary.gradient,
        color: 'white',
        p: 0,
        position: 'relative'
      }}>
        <Box sx={{ 
          p: 3,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              p: 1.5,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <DateRangeIcon sx={{ fontSize: '1.5rem' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 700,
                letterSpacing: '-0.025em'
              }}>
                Navigate to Date
              </Typography>
              <Typography variant="body2" sx={{ 
                opacity: 0.9,
                fontSize: '0.875rem'
              }}>
                Jump to any month and year
              </Typography>
            </Box>
          </Box>
          
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.25)'
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Professional decorative bottom border */}
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${colors.accent.gold} 0%, ${colors.accent.success} 100%)`
        }} />
      </DialogTitle>
      
      <DialogContent sx={{ 
        p: 4,
        background: `linear-gradient(180deg, ${colors.surface.light} 0%, ${colors.surface.white} 100%)`
      }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Clean, centered date picker */}
            <Paper 
              elevation={0}
              sx={{
                p: 4,
                width: '100%',
                maxWidth: 400,
                background: colors.surface.white,
                borderRadius: 3,
                border: '2px solid rgba(26, 54, 93, 0.08)',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'rgba(26, 54, 93, 0.15)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)'
                }
              }}
            >
              <DatePicker
                label="Select Date"
                value={pickerDate}
                onChange={handleDatePickerChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        fontSize: '1.2rem',
                        fontWeight: 500,
                        '& fieldset': {
                          borderColor: 'rgba(26, 54, 93, 0.2)',
                          borderWidth: 2
                        },
                        '&:hover fieldset': {
                          borderColor: colors.primary.main,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: colors.primary.main,
                          borderWidth: 2
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: colors.primary.main,
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        '&.Mui-focused': {
                          color: colors.primary.main
                        }
                      },
                      '& .MuiOutlinedInput-input': {
                        textAlign: 'center',
                        py: 2
                      }
                    }
                  }
                }}
              />
              
              {/* Quick action for today */}
              <Button
                variant="text"
                startIcon={<TodayIcon />}
                onClick={handleApply}
                sx={{
                  mt: 2,
                  color: colors.accent.main,
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: `${colors.accent.main}10`
                  }
                }}
              >
                Jump 
              </Button>
            </Paper>
          </Box>
        </LocalizationProvider>
      </DialogContent>
    </Dialog>
  );
}

// Main Component
function TamilCalendar({ user, onLogout }) {
  const [months, setMonths] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [modal, setModal] = useState({ open: false, data: {} });
  const [dateNavDialog, setDateNavDialog] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // User menu handlers
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    // Load months data
    const savedMonths = localStorage.getItem("tamilMonthsData");
    if (savedMonths) setMonths(JSON.parse(savedMonths));
    else setMonths(Array.from({ length: 12 }, (_, i) => ({ month: i + 1, daysInMonth: 31, tamilStartDay: 1 })));
    
    // Load festivals data
    const savedFestivals = localStorage.getItem("tamilFestivalsData");
    if (savedFestivals) {
      const loadedFestivals = JSON.parse(savedFestivals);
      const currentYear = new Date().getFullYear();
      const updatedFestivals = loadedFestivals.map(fest => ({
        ...fest,
        year: fest.year || currentYear
      }));
      setFestivals(updatedFestivals);
    } else {
      setFestivals(defaultFestivals);
    }
  }, []);
  
  // Auto-save festivals when they change
  useEffect(() => {
    if (festivals.length > 0) {
      localStorage.setItem("tamilFestivalsData", JSON.stringify(festivals));
    }
  }, [festivals]);

  // Enhanced date click handler
  const handleDateClick = (date, tamilDay, tamilMonth) => {
    setSelectedDate(date);
    
    const dateFestivals = festivals.filter(
      f => f.month === (date.getMonth() + 1) && f.day === date.getDate()
    );
    
    const modalData = {
      englishDate: format(date, "dd"),
      englishMonth: format(date, "MMMM"),
      englishYear: format(date, "yyyy"),
      dayOfWeek: format(date, "EEEE"),
      tamilDay, 
      tamilMonth,
      festival: dateFestivals.length > 0 ? dateFestivals[0].name : null,
      festivalColor: dateFestivals.length > 0 ? dateFestivals[0].color : null,
      festivals: dateFestivals,
      festivalCount: dateFestivals.length,
      hasMultipleFestivals: dateFestivals.length > 1
    };
    
    setModal({
      open: true,
      data: modalData
    });
  };

  // Navigation handlers
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const resetToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  const handleDateNavigation = (newDate) => {
    setCurrentMonth(newDate);
  };

  const handleCloseModal = () => {
    setModal({ ...modal, open: false });
  };

  // Save/Export handlers
  const handleSaveMonths = () => {
    localStorage.setItem("tamilMonthsData", JSON.stringify(months));
    setSnackbar({ open: true, message: "Calendar settings saved successfully", severity: "success" });
  };
  
  const handleSaveFestivals = () => {
    localStorage.setItem("tamilFestivalsData", JSON.stringify(festivals));
    setSnackbar({ open: true, message: "Festival settings saved successfully", severity: "success" });
  };
  
  const handleExportMonths = () => {
    const blob = new Blob([JSON.stringify(months, null, 2)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); 
    a.href = url; 
    a.download = "tamil_months_data.json"; 
    a.click();
    URL.revokeObjectURL(url);
    setSnackbar({ open: true, message: "Month settings exported to file", severity: "info" });
  };
  
  const handleExportFestivals = () => {
    const blob = new Blob([JSON.stringify(festivals, null, 2)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); 
    a.href = url; 
    a.download = "tamil_festivals_data.json"; 
    a.click();
    URL.revokeObjectURL(url);
    setSnackbar({ open: true, message: "Festival data exported to file", severity: "info" });
  };
  
  const handleImportMonths = (e) => {
    const file = e.target.files[0]; 
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        setMonths(data);
        localStorage.setItem("tamilMonthsData", JSON.stringify(data));
        setSnackbar({ open: true, message: "Month settings imported successfully", severity: "success" });
      } catch (error) {
        setSnackbar({ open: true, message: "Invalid file format", severity: "error" });
      }
    };
    reader.readAsText(file);
  };
  
  const handleImportFestivals = (e) => {
    const file = e.target.files[0]; 
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        const currentYear = new Date().getFullYear();
        const updatedData = data.map(fest => ({
          ...fest,
          year: fest.year || currentYear
        }));
        setFestivals(updatedData);
        localStorage.setItem("tamilFestivalsData", JSON.stringify(updatedData));
        setSnackbar({ open: true, message: "Festival data imported successfully", severity: "success" });
      } catch (error) {
        setSnackbar({ open: true, message: "Invalid file format", severity: "error" });
      }
    };
    reader.readAsText(file);
  };

  const handleExportMonthsBin = () => {
    const lines = months.map((month, index) => 
      `${month.daysInMonth.toString().padStart(2, '0')},${month.tamilStartDay.toString().padStart(2, '0')}`
    );
    const fileContent = lines.join('\n');
    
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tamil_months_bin_${timestamp}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setSnackbar({ open: true, message: "Month settings exported as binary", severity: "info" });
  };

  const handleExportFestivalsBin = () => {
    const currentYear = new Date().getFullYear();
    const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0);
    const daysInYear = isLeapYear ? 366 : 365;
    
    const festivalMap = new Map();
    const serialNumberMap = new Map();
    let nextSerialNumber = 1;
    
    festivals.forEach(festival => {
      const date = new Date(currentYear, festival.month - 1, festival.day);
      const startOfYear = new Date(currentYear, 0, 1);
      const dayOfYear = Math.ceil((date - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
      
      if (dayOfYear >= 1 && dayOfYear <= daysInYear) {
        if (!serialNumberMap.has(festival.name)) {
          const paddedNumber = nextSerialNumber.toString().padStart(2, '0');
          serialNumberMap.set(festival.name, paddedNumber);
          nextSerialNumber++;
        }
        
        const serialNumber = serialNumberMap.get(festival.name);
        
        if (festivalMap.has(dayOfYear)) {
          festivalMap.set(dayOfYear, `${festivalMap.get(dayOfYear)},${serialNumber}`);
        } else {
          festivalMap.set(dayOfYear, serialNumber);
        }
      }
    });
    
    const lines = [];
    for (let i = 1; i <= daysInYear; i++) {
      lines.push(festivalMap.has(i) ? festivalMap.get(i) : '00');
    }
    
    const fileContent = lines.join('\n');
    
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tamil_festivals_bin_${timestamp}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setSnackbar({ open: true, message: "Festival data exported as binary", severity: "info" });
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: colors.background.main,
      position: 'relative'
    }}>
      {/* Professional AppBar with User Menu */}
      <AppBar 
        position="fixed" 
        elevation={0} 
        sx={{ 
          background: colors.primary.gradient,
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <MenuIcon sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ 
            flexGrow: 1, 
            fontWeight: 700,
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}>
            Tamil Calendar
          </Typography>
          
          <Tabs 
            value={tabIndex} 
            onChange={(e, newIndex) => setTabIndex(newIndex)} 
            textColor="inherit" 
            indicatorColor="secondary"
            sx={{
              mx: 2,
              '& .MuiTab-root': {
                fontWeight: 600,
                textTransform: 'none',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                '&.Mui-selected': {
                  color: '#ffffff'
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#ffffff',
                height: 3,
                borderRadius: '1.5px'
              }
            }}
          >
            <Tab 
              icon={<CalendarMonthIcon />} 
              label={isMobile ? null : "Calendar"} 
              iconPosition="start"
            />
            <Tab 
              icon={<SettingsIcon />} 
              label={isMobile ? null : "Admin"} 
              iconPosition="start"
            />
          </Tabs>
          
          {/* User Avatar and Menu */}
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32, 
                bgcolor: 'primary.dark',
                fontSize: '0.875rem'
              }}
            >
              {user?.name?.charAt(0) || <AccountCircleIcon />}
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 180,
                borderRadius: 2,
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1.2
                }
              }
            }}
          >
            <MenuItem disabled>
              <Typography variant="body2" fontWeight={500}>{user?.name || 'User'}</Typography>
            </MenuItem>
            <MenuItem onClick={() => {
              handleMenuClose();
              onLogout && onLogout();
            }}>
              <LogoutIcon fontSize="small" sx={{ mr: 1.5, color: colors.primary.main }} />
              <Typography>Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ pt: { xs: 8, sm: 10 }, pb: 4 }}>
        {tabIndex === 0 && (
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 4,
              overflow: "hidden",
              background: colors.background.card,
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}
            className="calendar-wrapper"
          >
            {/* Enhanced Calendar Header */}
            <Paper elevation={0} sx={{ 
              p: { xs: 2, sm: 3 }, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between",
              background: colors.primary.gradient,
              color: 'white',
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <CalendarMonthIcon sx={{ fontSize: '2rem' }} />
                <Box>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '1.5rem', sm: '1.75rem' }
                  }}>
                    {format(currentMonth, "MMMM yyyy")}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    opacity: 0.9,
                    fontSize: '0.875rem'
                  }}>
                    Today: {format(new Date(), "EEEE, MMM dd")}
                  </Typography>
                </Box>
              </Stack>
              
              <Stack direction="row" spacing={1} alignItems="center">
                {/* Month Navigation */}
                <IconButton 
                  onClick={prevMonth} 
                  sx={{ 
                    color: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      transform: 'scale(1.05)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <NavigateBeforeIcon />
                </IconButton>
                
                {/* Date Navigation Button */}
                <Button 
                  variant="outlined"
                  onClick={() => setDateNavDialog(true)}
                  startIcon={<DateRangeIcon />}
                  sx={{ 
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.2)'
                    },
                    fontWeight: 600,
                    textTransform: 'none',
                    px: { xs: 2, sm: 3 }
                  }}
                >
                  {isMobile ? 'Navigate' : 'Navigate to Date'}
                </Button>
                
                {/* Today Button */}
                <Button 
                  variant="outlined"
                  onClick={resetToToday}
                  startIcon={<TodayIcon />}
                  sx={{ 
                                        color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.2)'
                    },
                    fontWeight: 600,
                    textTransform: 'none',
                    px: { xs: 2, sm: 3 }
                  }}
                >
                  Today
                </Button>
                
                <IconButton 
                  onClick={nextMonth} 
                  sx={{ 
                    color: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      transform: 'scale(1.05)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <NavigateNextIcon />
                </IconButton>
              </Stack>
            </Paper>
            
            {/* Enhanced Calendar with Festival Color Marks */}
            <EnhancedSimpleCalendar 
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              months={months}
              festivals={festivals}
              onDateClick={handleDateClick}
            />
            
            {/* Festival Legend */}
            <Box sx={{ 
              p: 2, 
              bgcolor: colors.surface.light,
              borderTop: '1px solid #e5e7eb'
            }}>
              <Typography variant="body2" sx={{ 
                fontWeight: 600, 
                mb: 1,
                color: colors.primary.main
              }}>
                Legend:
              </Typography>
              <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    bgcolor: '#10b981', 
                    borderRadius: '50%', 
                    mr: 1 
                  }} />
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    Tamil Day
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ 
                    width: 12, 
                    height: 8, 
                    bgcolor: '#f59e0b', 
                    mr: 1 
                  }} />
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    Tamil Month Start
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    bgcolor: '#ef4444', 
                    borderRadius: '50%', 
                    mr: 1,
                    border: '1px solid white'
                  }} />
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    Festival Colors
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Card>
        )}

        {tabIndex === 1 && (
          <AdminTable
            className="admin-panel"
            months={months}
            festivals={festivals}
            onMonthChange={(i, f, v) => {
              setMonths(prev => {
                const copy = [...prev];
                copy[i][f] = v;
                return copy;
              });
            }}
            onFestivalChange={setFestivals}
            onSaveMonths={handleSaveMonths}
            onSaveFestivals={handleSaveFestivals}
            onExportMonths={handleExportMonths}
            onExportFestivals={handleExportFestivals}
            onImportMonths={handleImportMonths}
            onImportFestivals={handleImportFestivals}
            onExportMonthsBin={handleExportMonthsBin}
            onExportFestivalsBin={handleExportFestivalsBin}
          />
        )}

        {/* Professional Simplified Date Navigation Dialog */}
        <DateNavigationDialog
          open={dateNavDialog}
          currentDate={currentMonth}
          onClose={() => setDateNavDialog(false)}
          onDateChange={handleDateNavigation}
        />

        <DateDetailsModal 
          className="date-details-modal"
          open={modal.open}
          data={modal.data}
          onClose={handleCloseModal}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert 
            severity={snackbar.severity}
            variant="filled"
            sx={{ 
              width: '100%',
              borderRadius: 3,
              fontWeight: 600,
              fontSize: '0.95rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>

      {/* Floating Date Picker for Quick Access */}
      <Zoom in={tabIndex === 0}>
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: { xs: 16, md: 32 },
            right: { xs: 16, md: 32 },
            background: colors.secondary.gradient,
            '&:hover': {
              background: colors.secondary.main,
              transform: 'scale(1.1)'
            },
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            zIndex: 1000
          }}
          onClick={() => setDateNavDialog(true)}
        >
          <DateRangeIcon />
        </Fab>
      </Zoom>
    </Box>
  );
}

export default TamilCalendar;


// import React, { useState, useEffect } from "react";
// import {
//   Container, Typography, Snackbar, Alert, AppBar, Toolbar, Tabs, Tab,
//   Box, IconButton, Card, useTheme, useMediaQuery, Button, Dialog,
//   DialogTitle, DialogContent, DialogActions, Grid, TextField, MenuItem,
//   Fab, Zoom, Paper, Stack
// } from "@mui/material";
// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import MenuIcon from "@mui/icons-material/Menu";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import SettingsIcon from "@mui/icons-material/Settings";
// import TodayIcon from "@mui/icons-material/Today";
// import DateRangeIcon from "@mui/icons-material/DateRange";
// import NavigateNextIcon from "@mui/icons-material/NavigateNext";
// import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
// import CloseIcon from "@mui/icons-material/Close";
// import { format, addMonths, subMonths } from "date-fns";
// // import { AppBar, Toolbar, Typography, Button, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import LogoutIcon from '@mui/icons-material/Logout';

// // Import components
// import SimpleCalendar from "./SimpleCalendar";
// import AdminTable from "./AdminTable";
// import DateDetailsModal from "./DateDetailsModal";

// // Import constants
// import { defaultFestivals } from "./constants";

// // Professional color palette
// const colors = {
//   primary: {
//     main: '#1a365d',
//     light: '#2d5d7b',
//     dark: '#0f2744',
//     gradient: 'linear-gradient(135deg, #1a365d 0%, #2c5282 50%, #3182ce 100%)'
//   },
//   secondary: {
//     main: '#6a1b9a',
//     light: '#9c4dcc',
//     dark: '#38006b',
//     gradient: 'linear-gradient(135deg, #6a1b9a 0%, #8e24aa 50%, #ba68c8 100%)'
//   },
//   accent: {
//     main: '#00695c',
//     light: '#439889',
//     dark: '#003d33',
//     gold: '#d69e2e',
//     success: '#38a169'
//   },
//   background: {
//     main: 'linear-gradient(135deg, #f8faff 0%, #e8eaf6 50%, #f3e5f5 100%)',
//     card: 'rgba(255, 255, 255, 0.95)',
//     glass: 'rgba(255, 255, 255, 0.1)'
//   },
//   surface: {
//     white: '#ffffff',
//     light: '#f7fafc',
//     medium: '#edf2f7',
//     dark: '#e2e8f0'
//   }
// };


// // Enhanced SimpleCalendar Component with Festival Color Marks
// function EnhancedSimpleCalendar({ currentMonth, selectedDate, months, festivals, onDateClick }) {
//   const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
//   // Tamil month names
//   const tamilMonths = [
//     "Thai","Maasi","Panguni","Chithirai","Vaikasi","Aani",
//     "Aadi","Avani","Purattasi","Aippasi","Karthigai","Margazhi"
//   ];
  
//   const renderCalendar = () => {
//     const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
//     const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
//     const startDate = new Date(monthStart);
//     const startDay = startDate.getDay();
    
//     // Previous month days
//     let blanks = [];
//     for (let i = 0; i < startDay; i++) {
//       const prevDay = new Date(monthStart);
//       prevDay.setDate(prevDay.getDate() - (startDay - i));
//       blanks.push(
//         <DayCell 
//           key={`empty-${i}`} 
//           date={prevDay} 
//           currentMonth={currentMonth}
//           selectedDate={selectedDate}
//           months={months}
//           festivals={festivals}
//           onDateClick={onDateClick}
//           isOtherMonth={true}
//         />
//       );
//     }
    
//     // Current month days
//     let daysInMonth = [];
//     for (let d = 1; d <= monthEnd.getDate(); d++) {
//       const day = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
//       daysInMonth.push(
//         <DayCell 
//           key={day.toString()} 
//           date={day}
//           currentMonth={currentMonth}
//           selectedDate={selectedDate}
//           months={months}
//           festivals={festivals}
//           onDateClick={onDateClick}
//         />
//       );
//     }
    
//     const totalSlots = [...blanks, ...daysInMonth];
    
//     // Add next month days to complete weeks
//     const remainingSlots = 42 - totalSlots.length; // 6 weeks * 7 days
//     for (let i = 1; i <= remainingSlots; i++) {
//       const nextDay = new Date(monthEnd);
//       nextDay.setDate(monthEnd.getDate() + i);
//       totalSlots.push(
//         <DayCell 
//           key={`next-${i}`} 
//           date={nextDay} 
//           currentMonth={currentMonth}
//           selectedDate={selectedDate}
//           months={months}
//           festivals={festivals}
//           onDateClick={onDateClick}
//           isOtherMonth={true}
//         />
//       );
//     }
    
//     // Organize into rows
//     const rows = [];
//     for (let i = 0; i < totalSlots.length; i += 7) {
//       rows.push(totalSlots.slice(i, i + 7));
//     }
    
//     return rows.map((row, i) => (
//       <tr key={i}>{row}</tr>
//     ));
//   };

//   return (
//     <Box sx={{ width: '100%', overflow: 'auto', p: 2 }}>
//       <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
//         <thead>
//           <tr>
//             {weekdays.map(day => (
//               <th key={day} style={{ 
//                 padding: '12px 4px', 
//                 textAlign: 'center',
//                 fontSize: '1rem',
//                 fontWeight: 600,
//                 color: day === 'Sun' ? '#dc2626' : '#1f2937',
//                 borderBottom: '2px solid #e5e7eb',
//                 background: 'rgba(249, 250, 251, 0.8)'
//               }}>
//                 {day}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {renderCalendar()}
//         </tbody>
//       </table>
//     </Box>
//   );
// }
// // Enhanced Day Cell Component with subtle current day styling
// function DayCell({ date, currentMonth, selectedDate, months, festivals, onDateClick, isOtherMonth = false }) {
//   const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
//   const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
//   const isSelected = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
  
//   // Calculate Tamil date
//   const monthIndex = date.getMonth();
//   const monthData = months[monthIndex] || { daysInMonth: 31, tamilStartDay: 1 };
//   const tamilDay = ((date.getDate() + monthData.tamilStartDay - 2) % monthData.daysInMonth) + 1;
//   const tamilMonthIndex = date.getDate() < (monthData.daysInMonth - monthData.tamilStartDay) + 2
//     ? (monthIndex + 11) % 12
//     : monthIndex;
  
//   const tamilMonths = [
//     "Thai","Maasi","Panguni","Chithirai","Vaikasi","Aani",
//     "Aadi","Avani","Purattasi","Aippasi","Karthigai","Margazhi"
//   ];
//   const tamilMonth = tamilMonths[tamilMonthIndex];
  
//   // Get all festivals for this date
//   const dateFestivals = festivals.filter(
//     f => f.month === (date.getMonth() + 1) && f.day === date.getDate()
//   );
  
//   const isFirstDayOfTamilMonth = tamilDay === 1;
  
//   // Festival color marks - show above the date
//   const renderFestivalMarks = () => {
//     if (dateFestivals.length === 0) return null;
    
//     return (
//       <Box sx={{ 
//         position: 'absolute',
//         top: 2,
//         left: 2,
//         right: 2,
//         display: 'flex',
//         justifyContent: 'center',
//         gap: 0.5,
//         flexWrap: 'wrap',
//         zIndex: 2
//       }}>
//         {dateFestivals.slice(0, 4).map((festival, index) => (
//           <Box
//             key={festival.id}
//             sx={{
//               width: dateFestivals.length === 1 ? 16 : dateFestivals.length === 2 ? 12 : 8,
//               height: dateFestivals.length === 1 ? 16 : dateFestivals.length === 2 ? 12 : 8,
//               borderRadius: '50%',
//               bgcolor: festival.color || '#ef4444',
//               border: '1px solid white',
//               boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
//               flexShrink: 0
//             }}
//             title={festival.name}
//           />
//         ))}
//         {dateFestivals.length > 4 && (
//           <Box sx={{
//             width: 8,
//             height: 8,
//             borderRadius: '50%',
//             bgcolor: '#6b7280',
//             border: '1px solid white',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             fontSize: '6px',
//             color: 'white',
//             fontWeight: 'bold'
//           }}>
//             +
//           </Box>
//         )}
//       </Box>
//     );
//   };
  
//   return (
//     <td 
//       style={{ 
//         position: 'relative',
//         padding: 0,
//         textAlign: 'center',
//         cursor: 'pointer',
//         border: '1px solid #e5e7eb',
//         height: '70px',
//         verticalAlign: 'top',
//         backgroundColor: isOtherMonth 
//           ? '#f9fafb' 
//           : (isSelected 
//               ? 'rgba(59, 130, 246, 0.15)' 
//               : (isToday 
//                   ? 'rgba(107, 114, 128, 0.08)' // Light gray shade for today
//                   : 'white'
//                 )
//             ),
//         borderLeft: isFirstDayOfTamilMonth ? '3px solid #f59e0b' : '1px solid #e5e7eb'
//       }}
//       onClick={() => onDateClick(date, tamilDay, tamilMonth)}
//     >
//       <Box sx={{ 
//         height: '100%',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         position: 'relative',
//         p: 0.5
//       }}>
//         {/* Festival color marks above date */}
//         {renderFestivalMarks()}
        
//         {/* English date */}
//         <Typography 
//           variant="body1" 
//           sx={{ 
//             fontWeight: isSelected ? 700 : (isToday ? 600 : 500), // Today gets medium weight
//             color: isOtherMonth 
//               ? '#9ca3af' 
//               : (format(date, 'E') === 'Sun' 
//                   ? '#dc2626' 
//                   : (isSelected
//                       ? '#1d4ed8' // Selected date gets blue color
//                       : (isToday 
//                           ? '#374151' // Today gets normal dark color
//                           : (dateFestivals.length > 0 ? '#1f2937' : '#374151')
//                         )
//                     )
//                 ),
//             fontSize: { xs: '0.875rem', sm: '1rem' },
//             lineHeight: 1.2,
//             mt: dateFestivals.length > 0 ? 1.5 : 0
//           }}
//         >
//           {date.getDate()}
//         </Typography>
        
//         {/* Tamil date */}
//         <Typography 
//           variant="caption" 
//           sx={{ 
//             color: '#10b981',
//             fontSize: { xs: '0.65rem', sm: '0.75rem' },
//             fontWeight: 500,
//             mt: 0.2,
//             opacity: isOtherMonth ? 0.6 : 1
//           }}
//         >
//           {tamilDay}
//         </Typography>
        
//         {/* Tamil month start indicator */}
//         {isFirstDayOfTamilMonth && (
//           <Box sx={{
//             position: 'absolute',
//             bottom: 2,
//             left: '50%',
//             transform: 'translateX(-50%)',
//             bgcolor: '#f59e0b',
//             color: 'white',
//             fontSize: { xs: '0.55rem', sm: '0.65rem' },
//             px: 0.5,
//             py: 0.1,
//             borderRadius: '2px',
//             fontWeight: 600,
//             whiteSpace: 'nowrap',
//             boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
//           }}>
//             {tamilMonth}
//           </Box>
//         )}
        
//         {/* Selected indicator - blue border */}
//         {isSelected && (
//           <Box sx={{
//             position: 'absolute',
//             inset: 2,
//             border: '2px solid #ffffffff',
//             borderRadius: 1,
//             pointerEvents: 'none',
//             zIndex: 1
//           }} />
//         )}
//       </Box>
//     </td>
//   );
// }

// function DateNavigationDialog({ open, currentDate, onClose, onDateChange }) {
//   const [pickerDate, setPickerDate] = useState(currentDate);
  
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
//   const handleApply = () => {
//     if (pickerDate) {
//       onDateChange(pickerDate);
//     }
//     onClose();
//   };
  
//   const handleDatePickerChange = (newDate) => {
//     if (newDate) {
//       setPickerDate(newDate);
//     }
//   };

//   const handleTodayClick = () => {
//     const today = new Date();
//     setPickerDate(today);
//     onDateChange(today);
//     onClose();
//   };

//   // Update picker date when dialog opens with new current date
//   useEffect(() => {
//     if (open) {
//       setPickerDate(currentDate);
//     }
//   }, [open, currentDate]);

//   return (
//     <Dialog 
//       open={open} 
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 4,
//           background: colors.surface.white,
//           boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
//           overflow: 'hidden',
//           border: '1px solid rgba(26, 54, 93, 0.1)'
//         }
//       }}
//     >
//       <DialogTitle sx={{
//         background: colors.primary.gradient,
//         color: 'white',
//         p: 0,
//         position: 'relative'
//       }}>
//         <Box sx={{ 
//           p: 3,
//           display: 'flex', 
//           alignItems: 'center', 
//           justifyContent: 'space-between' 
//         }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//             <Box sx={{
//               p: 1.5,
//               borderRadius: 2,
//               background: 'rgba(255,255,255,0.15)',
//               backdropFilter: 'blur(10px)'
//             }}>
//               <DateRangeIcon sx={{ fontSize: '1.5rem' }} />
//             </Box>
//             <Box>
//               <Typography variant="h6" sx={{ 
//                 fontWeight: 700,
//                 letterSpacing: '-0.025em'
//               }}>
//                 Navigate to Date
//               </Typography>
//               <Typography variant="body2" sx={{ 
//                 opacity: 0.9,
//                 fontSize: '0.875rem'
//               }}>
//                 Jump to any month and year
//               </Typography>
//             </Box>
//           </Box>
          
//           <IconButton
//             onClick={onClose}
//             size="small"
//             sx={{
//               color: 'white',
//               bgcolor: 'rgba(255,255,255,0.15)',
//               backdropFilter: 'blur(10px)',
//               '&:hover': {
//                 bgcolor: 'rgba(255,255,255,0.25)'
//               }
//             }}
//           >
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         </Box>

//         {/* Professional decorative bottom border */}
//         <Box sx={{
//           position: 'absolute',
//           bottom: 0,
//           left: 0,
//           right: 0,
//           height: 4,
//           background: `linear-gradient(90deg, ${colors.accent.gold} 0%, ${colors.accent.success} 100%)`
//         }} />
//       </DialogTitle>
      
//       <DialogContent sx={{ 
//         p: 4,
//         background: `linear-gradient(180deg, ${colors.surface.light} 0%, ${colors.surface.white} 100%)`
//       }}>
//         <LocalizationProvider dateAdapter={AdapterDateFns}>
//           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//             {/* Clean, centered date picker */}
//             <Paper 
//               elevation={0}
//               sx={{
//                 p: 4,
//                 width: '100%',
//                 maxWidth: 400,
//                 background: colors.surface.white,
//                 borderRadius: 3,
//                 border: '2px solid rgba(26, 54, 93, 0.08)',
//                 textAlign: 'center',
//                 transition: 'all 0.2s ease',
//                 '&:hover': {
//                   borderColor: 'rgba(26, 54, 93, 0.15)',
//                   boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)'
//                 }
//               }}
//             >
//               <DatePicker
//                 label="Select Date"
//                 value={pickerDate}
//                 onChange={handleDatePickerChange}
//                 slotProps={{
//                   textField: {
//                     fullWidth: true,
//                     variant: "outlined",
//                     sx: {
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: 3,
//                         fontSize: '1.2rem',
//                         fontWeight: 500,
//                         '& fieldset': {
//                           borderColor: 'rgba(26, 54, 93, 0.2)',
//                           borderWidth: 2
//                         },
//                         '&:hover fieldset': {
//                           borderColor: colors.primary.main,
//                         },
//                         '&.Mui-focused fieldset': {
//                           borderColor: colors.primary.main,
//                           borderWidth: 2
//                         }
//                       },
//                       '& .MuiInputLabel-root': {
//                         color: colors.primary.main,
//                         fontWeight: 600,
//                         fontSize: '1.1rem',
//                         '&.Mui-focused': {
//                           color: colors.primary.main
//                         }
//                       },
//                       '& .MuiOutlinedInput-input': {
//                         textAlign: 'center',
//                         py: 2
//                       }
//                     }
//                   }
//                 }}
//               />
              
//               {/* Quick action for today */}
//               <Button
//                 variant="text"
//                 startIcon={<TodayIcon />}
//                 onClick={handleApply}
//                 sx={{
//                   mt: 2,
//                   color: colors.accent.main,
//                   fontWeight: 600,
//                   textTransform: 'none',
//                   '&:hover': {
//                     bgcolor: `${colors.accent.main}10`
//                   }
//                 }}
//               >
//                 Jump 
//               </Button>
//             </Paper>
//           </Box>
//         </LocalizationProvider>
//       </DialogContent>
      

//     </Dialog>
//   );
// }

// // Main Component
// export default function TamilCalendar() {
//   const [months, setMonths] = useState([]);
//   const [festivals, setFestivals] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
//   const [modal, setModal] = useState({ open: false, data: {} });
//   const [dateNavDialog, setDateNavDialog] = useState(false);
//   const [tabIndex, setTabIndex] = useState(0);
  
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isTablet = useMediaQuery(theme.breakpoints.down('md'));

//   useEffect(() => {
//     // Load months data
//     const savedMonths = localStorage.getItem("tamilMonthsData");
//     if (savedMonths) setMonths(JSON.parse(savedMonths));
//     else setMonths(Array.from({ length: 12 }, (_, i) => ({ month: i + 1, daysInMonth: 31, tamilStartDay: 1 })));
    
//     // Load festivals data
//     const savedFestivals = localStorage.getItem("tamilFestivalsData");
//     if (savedFestivals) {
//       const loadedFestivals = JSON.parse(savedFestivals);
//       const currentYear = new Date().getFullYear();
//       const updatedFestivals = loadedFestivals.map(fest => ({
//         ...fest,
//         year: fest.year || currentYear
//       }));
//       setFestivals(updatedFestivals);
//     } else {
//       setFestivals(defaultFestivals);
//     }
//   }, []);
  
//   // Auto-save festivals when they change
//   useEffect(() => {
//     if (festivals.length > 0) {
//       localStorage.setItem("tamilFestivalsData", JSON.stringify(festivals));
//     }
//   }, [festivals]);

//   // Enhanced date click handler
//   const handleDateClick = (date, tamilDay, tamilMonth) => {
//     setSelectedDate(date);
    
//     const dateFestivals = festivals.filter(
//       f => f.month === (date.getMonth() + 1) && f.day === date.getDate()
//     );
    
//     const modalData = {
//       englishDate: format(date, "dd"),
//       englishMonth: format(date, "MMMM"),
//       englishYear: format(date, "yyyy"),
//       dayOfWeek: format(date, "EEEE"),
//       tamilDay, 
//       tamilMonth,
//       festival: dateFestivals.length > 0 ? dateFestivals[0].name : null,
//       festivalColor: dateFestivals.length > 0 ? dateFestivals[0].color : null,
//       festivals: dateFestivals,
//       festivalCount: dateFestivals.length,
//       hasMultipleFestivals: dateFestivals.length > 1
//     };
    
//     setModal({
//       open: true,
//       data: modalData
//     });
//   };

//   // Navigation handlers
//   const nextMonth = () => {
//     setCurrentMonth(addMonths(currentMonth, 1));
//   };

//   const prevMonth = () => {
//     setCurrentMonth(subMonths(currentMonth, 1));
//   };
  
//   const resetToToday = () => {
//     const today = new Date();
//     setCurrentMonth(today);
//     setSelectedDate(today);
//   };

//   const handleDateNavigation = (newDate) => {
//     setCurrentMonth(newDate);
//   };

//   const handleCloseModal = () => {
//     setModal({ ...modal, open: false });
//   };

//   // Save/Export handlers (keeping existing functionality)
//   const handleSaveMonths = () => {
//     localStorage.setItem("tamilMonthsData", JSON.stringify(months));
//     setSnackbar({ open: true, message: "Calendar settings saved successfully", severity: "success" });
//   };
  
//   const handleSaveFestivals = () => {
//     localStorage.setItem("tamilFestivalsData", JSON.stringify(festivals));
//     setSnackbar({ open: true, message: "Festival settings saved successfully", severity: "success" });
//   };
  
//   const handleExportMonths = () => {
//     const blob = new Blob([JSON.stringify(months, null, 2)], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a"); 
//     a.href = url; 
//     a.download = "tamil_months_data.json"; 
//     a.click();
//     URL.revokeObjectURL(url);
//     setSnackbar({ open: true, message: "Month settings exported to file", severity: "info" });
//   };
  
//   const handleExportFestivals = () => {
//     const blob = new Blob([JSON.stringify(festivals, null, 2)], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a"); 
//     a.href = url; 
//     a.download = "tamil_festivals_data.json"; 
//     a.click();
//     URL.revokeObjectURL(url);
//     setSnackbar({ open: true, message: "Festival data exported to file", severity: "info" });
//   };
  
//   const handleImportMonths = (e) => {
//     const file = e.target.files[0]; 
//     if (!file) return;
    
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       try {
//         const data = JSON.parse(event.target.result);
//         setMonths(data);
//         localStorage.setItem("tamilMonthsData", JSON.stringify(data));
//         setSnackbar({ open: true, message: "Month settings imported successfully", severity: "success" });
//       } catch (error) {
//         setSnackbar({ open: true, message: "Invalid file format", severity: "error" });
//       }
//     };
//     reader.readAsText(file);
//   };
  
//   const handleImportFestivals = (e) => {
//     const file = e.target.files[0]; 
//     if (!file) return;
    
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       try {
//         const data = JSON.parse(event.target.result);
//         const currentYear = new Date().getFullYear();
//         const updatedData = data.map(fest => ({
//           ...fest,
//           year: fest.year || currentYear
//         }));
//         setFestivals(updatedData);
//         localStorage.setItem("tamilFestivalsData", JSON.stringify(updatedData));
//         setSnackbar({ open: true, message: "Festival data imported successfully", severity: "success" });
//       } catch (error) {
//         setSnackbar({ open: true, message: "Invalid file format", severity: "error" });
//       }
//     };
//     reader.readAsText(file);
//   };

//   const handleExportMonthsBin = () => {
//     const lines = months.map((month, index) => 
//       `${month.daysInMonth.toString().padStart(2, '0')},${month.tamilStartDay.toString().padStart(2, '0')}`
//     );
//     const fileContent = lines.join('\n');
    
//     const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
//     const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `tamil_months_bin_${timestamp}.txt`;
//     a.click();
//     URL.revokeObjectURL(url);
//     setSnackbar({ open: true, message: "Month settings exported as binary", severity: "info" });
//   };

//   const handleExportFestivalsBin = () => {
//     const currentYear = new Date().getFullYear();
//     const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0);
//     const daysInYear = isLeapYear ? 366 : 365;
    
//     const festivalMap = new Map();
//     const serialNumberMap = new Map();
//     let nextSerialNumber = 1;
    
//     festivals.forEach(festival => {
//       const date = new Date(currentYear, festival.month - 1, festival.day);
//       const startOfYear = new Date(currentYear, 0, 1);
//       const dayOfYear = Math.ceil((date - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
      
//       if (dayOfYear >= 1 && dayOfYear <= daysInYear) {
//         if (!serialNumberMap.has(festival.name)) {
//           const paddedNumber = nextSerialNumber.toString().padStart(2, '0');
//           serialNumberMap.set(festival.name, paddedNumber);
//           nextSerialNumber++;
//         }
        
//         const serialNumber = serialNumberMap.get(festival.name);
        
//         if (festivalMap.has(dayOfYear)) {
//           festivalMap.set(dayOfYear, `${festivalMap.get(dayOfYear)},${serialNumber}`);
//         } else {
//           festivalMap.set(dayOfYear, serialNumber);
//         }
//       }
//     });
    
//     const lines = [];
//     for (let i = 1; i <= daysInYear; i++) {
//       lines.push(festivalMap.has(i) ? festivalMap.get(i) : '00');
//     }
    
//     const fileContent = lines.join('\n');
    
//     const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
//     const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `tamil_festivals_bin_${timestamp}.txt`;
//     a.click();
//     URL.revokeObjectURL(url);
//     setSnackbar({ open: true, message: "Festival data exported as binary", severity: "info" });
//   };

//   return (
//     <Box sx={{ 
//       minHeight: '100vh',
//       background: colors.background.main,
//       position: 'relative'
//     }}>
//       {/* Professional AppBar */}
//       <AppBar 
//         position="fixed" 
//         elevation={0} 
//         sx={{ 
//           background: colors.primary.gradient,
//           backdropFilter: 'blur(20px)',
//           borderBottom: '1px solid rgba(255,255,255,0.1)',
//           boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
//         }}
//       >
//         <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
//           <MenuIcon sx={{ mr: 2 }} />
//           <Typography variant="h6" sx={{ 
//             flexGrow: 1, 
//             fontWeight: 700,
//             fontSize: { xs: '1.1rem', sm: '1.25rem' }
//           }}>
//             Tamil Calendar
//           </Typography>
          
//           <Tabs 
//             value={tabIndex} 
//             onChange={(e, newIndex) => setTabIndex(newIndex)} 
//             textColor="inherit" 
//             indicatorColor="secondary"
//             sx={{
//               '& .MuiTab-root': {
//                 fontWeight: 600,
//                 textTransform: 'none',
//                 fontSize: { xs: '0.875rem', sm: '1rem' },
//                 '&.Mui-selected': {
//                   color: '#ffffff'
//                 }
//               },
//               '& .MuiTabs-indicator': {
//                 backgroundColor: '#ffffff',
//                 height: 3,
//                 borderRadius: '1.5px'
//               }
//             }}
//           >
//             <Tab 
//               icon={<CalendarMonthIcon />} 
//               label={isMobile ? null : "Calendar"} 
//               iconPosition="start"
//             />
//             <Tab 
//               icon={<SettingsIcon />} 
//               label={isMobile ? null : "Admin"} 
//               iconPosition="start"
//             />
//           </Tabs>
//         </Toolbar>
//       </AppBar>

//       <Container maxWidth="xl" sx={{ pt: { xs: 8, sm: 10 }, pb: 4 }}>
//         {tabIndex === 0 && (
//           <Card 
//             elevation={0}
//             sx={{ 
//               borderRadius: 4,
//               overflow: "hidden",
//               background: colors.background.card,
//               backdropFilter: 'blur(20px)',
//               border: '1px solid rgba(255,255,255,0.2)',
//               boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
//             }}
//             className="calendar-wrapper"
//           >
//             {/* Enhanced Calendar Header */}
//             <Paper elevation={0} sx={{ 
//               p: { xs: 2, sm: 3 }, 
//               display: "flex", 
//               alignItems: "center", 
//               justifyContent: "space-between",
//               background: colors.primary.gradient,
//               color: 'white',
//               flexWrap: 'wrap',
//               gap: 2
//             }}>
//               <Stack direction="row" alignItems="center" spacing={2}>
//                 <CalendarMonthIcon sx={{ fontSize: '2rem' }} />
//                 <Box>
//                   <Typography variant="h5" sx={{ 
//                     fontWeight: 700,
//                     fontSize: { xs: '1.5rem', sm: '1.75rem' }
//                   }}>
//                     {format(currentMonth, "MMMM yyyy")}
//                   </Typography>
//                   <Typography variant="body2" sx={{ 
//                     opacity: 0.9,
//                     fontSize: '0.875rem'
//                   }}>
//                     Today: {format(new Date(), "EEEE, MMM dd")}
//                   </Typography>
//                 </Box>
//               </Stack>
              
//               <Stack direction="row" spacing={1} alignItems="center">
//                 {/* Month Navigation */}
//                 <IconButton 
//                   onClick={prevMonth} 
//                   sx={{ 
//                     color: 'white',
//                     bgcolor: 'rgba(255,255,255,0.1)',
//                     '&:hover': { 
//                       bgcolor: 'rgba(255,255,255,0.2)',
//                       transform: 'scale(1.05)'
//                     },
//                     transition: 'all 0.2s ease'
//                   }}
//                 >
//                   <NavigateBeforeIcon />
//                 </IconButton>
                
//                 {/* Date Navigation Button */}
//                 <Button 
//                   variant="outlined"
//                   onClick={() => setDateNavDialog(true)}
//                   startIcon={<DateRangeIcon />}
//                   sx={{ 
//                     color: 'white',
//                     borderColor: 'rgba(255,255,255,0.3)',
//                     bgcolor: 'rgba(255,255,255,0.1)',
//                     '&:hover': {
//                       borderColor: 'white',
//                       bgcolor: 'rgba(255,255,255,0.2)'
//                     },
//                     fontWeight: 600,
//                     textTransform: 'none',
//                     px: { xs: 2, sm: 3 }
//                   }}
//                 >
//                   {isMobile ? 'Navigate' : 'Navigate to Date'}
//                 </Button>
                
//                 {/* Today Button */}
//                 <Button 
//                   variant="outlined"
//                   onClick={resetToToday}
//                   startIcon={<TodayIcon />}
//                   sx={{ 
//                     color: 'white',
//                     borderColor: 'rgba(255,255,255,0.3)',
//                     bgcolor: 'rgba(255,255,255,0.1)',
//                     '&:hover': {
//                       borderColor: 'white',
//                       bgcolor: 'rgba(255,255,255,0.2)'
//                     },
//                     fontWeight: 600,
//                     textTransform: 'none',
//                     px: { xs: 2, sm: 3 }
//                   }}
//                 >
//                   Today
//                 </Button>
                
//                 <IconButton 
//                   onClick={nextMonth} 
//                   sx={{ 
//                     color: 'white',
//                     bgcolor: 'rgba(255,255,255,0.1)',
//                     '&:hover': { 
//                       bgcolor: 'rgba(255,255,255,0.2)',
//                       transform: 'scale(1.05)'
//                     },
//                     transition: 'all 0.2s ease'
//                   }}
//                 >
//                   <NavigateNextIcon />
//                 </IconButton>
//               </Stack>
//             </Paper>
            
//             {/* Enhanced Calendar with Festival Color Marks */}
//             <EnhancedSimpleCalendar 
//               currentMonth={currentMonth}
//               selectedDate={selectedDate}
//               months={months}
//               festivals={festivals}
//               onDateClick={handleDateClick}
//             />
            
//            {/* Festival Legend */}
// {/* // Updated Festival Legend with removed Today and Selected indicators */}
// <Box sx={{ 
//   p: 2, 
//   bgcolor: colors.surface.light,
//   borderTop: '1px solid #e5e7eb'
// }}>
//   <Typography variant="body2" sx={{ 
//     fontWeight: 600, 
//     mb: 1,
//     color: colors.primary.main
//   }}>
//     Legend:
//   </Typography>
//   <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
//     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//       <Box sx={{ 
//         width: 12, 
//         height: 12, 
//         bgcolor: '#10b981', 
//         borderRadius: '50%', 
//         mr: 1 
//       }} />
//       <Typography variant="caption" sx={{ fontWeight: 500 }}>
//         Tamil Day
//       </Typography>
//     </Box>
    
//     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//       <Box sx={{ 
//         width: 12, 
//         height: 8, 
//         bgcolor: '#f59e0b', 
//         mr: 1 
//       }} />
//       <Typography variant="caption" sx={{ fontWeight: 500 }}>
//         Tamil Month Start
//       </Typography>
//     </Box>
    
//     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//       <Box sx={{ 
//         width: 12, 
//         height: 12, 
//         bgcolor: '#ef4444', 
//         borderRadius: '50%', 
//         mr: 1,
//         border: '1px solid white'
//       }} />
//       <Typography variant="caption" sx={{ fontWeight: 500 }}>
//         Festival Colors
//       </Typography>
//     </Box>
//   </Stack>
// </Box>
// {/* <Box sx={{ 
//   p: 2, 
//   bgcolor: colors.surface.light,
//   borderTop: '1px solid #e5e7eb'
// }}>
//   <Typography variant="body2" sx={{ 
//     fontWeight: 600, 
//     mb: 1,
//     color: colors.primary.main
//   }}>
//     Legend:
//   </Typography>
//   <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
//     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//       <Box sx={{ 
//         width: 12, 
//         height: 12, 
//         bgcolor: '#10b981', 
//         borderRadius: '50%', 
//         mr: 1 
//       }} />
//       <Typography variant="caption" sx={{ fontWeight: 500 }}>
//         Tamil Day
//       </Typography>
//     </Box>
    
//     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//       <Box sx={{ 
//         width: 12, 
//         height: 8, 
//         bgcolor: '#f59e0b', 
//         mr: 1 
//       }} />
//       <Typography variant="caption" sx={{ fontWeight: 500 }}>
//         Tamil Month Start
//       </Typography>
//     </Box>
    
//     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//       <Box sx={{ 
//         width: 12, 
//         height: 12, 
//         bgcolor: '#ef4444', 
//         borderRadius: '50%', 
//         mr: 1,
//         border: '1px solid white'
//       }} />
//       <Typography variant="caption" sx={{ fontWeight: 500 }}>
//         Festival Colors
//       </Typography>
//     </Box>
    
//     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//       <Box sx={{ 
//         width: 12, 
//         height: 12, 
//         bgcolor: 'rgba(107, 114, 128, 0.08)', 
//         border: '1px solid #d1d5db',
//         mr: 1 
//       }} />
//       <Typography variant="caption" sx={{ fontWeight: 500 }}>
//         Today
//       </Typography>
//     </Box>
    
//     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//       <Box sx={{ 
//         width: 12, 
//         height: 12, 
//         bgcolor: 'rgba(59, 130, 246, 0.15)', 
//         border: '1px solid #264372ff',
//         mr: 1 
//       }} />
//       <Typography variant="caption" sx={{ fontWeight: 500 }}>
//         Selected
//       </Typography>
//     </Box>
//   </Stack>
// </Box> */}

//             {/* <Box sx={{ 
//               p: 2, 
//               bgcolor: colors.surface.light,
//               borderTop: '1px solid #e5e7eb'
//             }}>
//               <Typography variant="body2" sx={{ 
//                 fontWeight: 600, 
//                 mb: 1,
//                 color: colors.primary.main
//               }}>
//                 Legend:
//               </Typography>
//               <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                   <Box sx={{ 
//                     width: 12, 
//                     height: 12, 
//                     bgcolor: '#10b981', 
//                     borderRadius: '50%', 
//                     mr: 1 
//                   }} />
//                   <Typography variant="caption" sx={{ fontWeight: 500 }}>
//                     Tamil Day
//                   </Typography>
//                 </Box>
                
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                   <Box sx={{ 
//                     width: 12, 
//                     height: 8, 
//                     bgcolor: '#f59e0b', 
//                     mr: 1 
//                   }} />
//                   <Typography variant="caption" sx={{ fontWeight: 500 }}>
//                     Tamil Month Start
//                   </Typography>
//                 </Box>
                
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                   <Box sx={{ 
//                     width: 12, 
//                     height: 12, 
//                     bgcolor: '#ef4444', 
//                     borderRadius: '50%', 
//                     mr: 1,
//                     border: '1px solid white'
//                   }} />
//                   <Typography variant="caption" sx={{ fontWeight: 500 }}>
//                     Festival Colors
//                   </Typography>
//                 </Box>
                
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                   <Box sx={{ 
//                     width: 12, 
//                     height: 12, 
//                     bgcolor: '#10b981', 
//                     borderRadius: '50%', 
//                     mr: 1 
//                   }} />
//                   <Typography variant="caption" sx={{ fontWeight: 500 }}>
//                     Today
//                   </Typography>
//                 </Box>
//               </Stack>
//             </Box> */}
//           </Card>
//         )}

//         {tabIndex === 1 && (
//           <AdminTable
//             className="admin-panel"
//             months={months}
//             festivals={festivals}
//             onMonthChange={(i, f, v) => {
//               setMonths(prev => {
//                 const copy = [...prev];
//                 copy[i][f] = v;
//                 return copy;
//               });
//             }}
//             onFestivalChange={setFestivals}
//             onSaveMonths={handleSaveMonths}
//             onSaveFestivals={handleSaveFestivals}
//             onExportMonths={handleExportMonths}
//             onExportFestivals={handleExportFestivals}
//             onImportMonths={handleImportMonths}
//             onImportFestivals={handleImportFestivals}
//             onExportMonthsBin={handleExportMonthsBin}
//             onExportFestivalsBin={handleExportFestivalsBin}
//           />
//         )}

//         {/* Professional Simplified Date Navigation Dialog */}
//         <DateNavigationDialog
//           open={dateNavDialog}
//           currentDate={currentMonth}
//           onClose={() => setDateNavDialog(false)}
//           onDateChange={handleDateNavigation}
//         />

//         <DateDetailsModal 
//           className="date-details-modal"
//           open={modal.open}
//           data={modal.data}
//           onClose={handleCloseModal}
//         />

//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={6000}
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//         >
//           <Alert 
//             severity={snackbar.severity}
//             variant="filled"
//             sx={{ 
//               width: '100%',
//               borderRadius: 3,
//               fontWeight: 600,
//               fontSize: '0.95rem',
//               boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
//             }}
//             onClose={() => setSnackbar({ ...snackbar, open: false })}
//           >
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </Container>

//       {/* Floating Date Picker for Quick Access */}
//       <Zoom in={tabIndex === 0}>
//         <Fab
//           color="primary"
//           sx={{
//             position: 'fixed',
//             bottom: { xs: 16, md: 32 },
//             right: { xs: 16, md: 32 },
//             background: colors.secondary.gradient,
//             '&:hover': {
//               background: colors.secondary.main,
//               transform: 'scale(1.1)'
//             },
//             transition: 'all 0.3s ease',
//             boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
//             zIndex: 1000
//           }}
//           onClick={() => setDateNavDialog(true)}
//         >
//           <DateRangeIcon />
//         </Fab>
//       </Zoom>
//     </Box>
//   );
// }


// import React, { useState, useEffect } from "react";
// import {
//   Container, Typography, Snackbar, Alert, AppBar, Toolbar, Tabs, Tab,
//   Box, IconButton, Card, useTheme, useMediaQuery, Button, Dialog,
//   DialogTitle, DialogContent, DialogActions, Grid, TextField, MenuItem,
//   Fab, Zoom, Paper, Stack
// } from "@mui/material";
// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import MenuIcon from "@mui/icons-material/Menu";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import SettingsIcon from "@mui/icons-material/Settings";
// import TodayIcon from "@mui/icons-material/Today";
// import DateRangeIcon from "@mui/icons-material/DateRange";
// import NavigateNextIcon from "@mui/icons-material/NavigateNext";
// import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
// import CloseIcon from "@mui/icons-material/Close";
// import { format, addMonths, subMonths } from "date-fns";

// // Import components
// import SimpleCalendar from "./SimpleCalendar";
// import AdminTable from "./AdminTable";
// import DateDetailsModal from "./DateDetailsModal";

// // Import constants
// import { defaultFestivals } from "./constants";

// // Professional color palette
// const colors = {
//   primary: {
//     main: '#1a365d',
//     light: '#2d5d7b',
//     dark: '#0f2744',
//     gradient: 'linear-gradient(135deg, #1a365d 0%, #2c5282 50%, #3182ce 100%)'
//   },
//   secondary: {
//     main: '#6a1b9a',
//     light: '#9c4dcc',
//     dark: '#38006b',
//     gradient: 'linear-gradient(135deg, #6a1b9a 0%, #8e24aa 50%, #ba68c8 100%)'
//   },
//   accent: {
//     main: '#00695c',
//     light: '#439889',
//     dark: '#003d33',
//     gold: '#d69e2e',
//     success: '#38a169'
//   },
//   background: {
//     main: 'linear-gradient(135deg, #f8faff 0%, #e8eaf6 50%, #f3e5f5 100%)',
//     card: 'rgba(255, 255, 255, 0.95)',
//     glass: 'rgba(255, 255, 255, 0.1)'
//   },
//   surface: {
//     white: '#ffffff',
//     light: '#f7fafc',
//     medium: '#edf2f7',
//     dark: '#e2e8f0'
//   }
// };

// // Professional Simplified Date Navigation Dialog
// function DateNavigationDialog({ open, currentDate, onClose, onDateChange }) {
//   const [pickerDate, setPickerDate] = useState(currentDate);
  
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
//   const handleApply = () => {
//     if (pickerDate) {
//       onDateChange(pickerDate);
//     }
//     onClose();
//   };
  
//   const handleDatePickerChange = (newDate) => {
//     if (newDate) {
//       setPickerDate(newDate);
//     }
//   };

//   const handleTodayClick = () => {
//     const today = new Date();
//     setPickerDate(today);
//     onDateChange(today);
//     onClose();
//   };

//   // Update picker date when dialog opens with new current date
//   useEffect(() => {
//     if (open) {
//       setPickerDate(currentDate);
//     }
//   }, [open, currentDate]);

//   return (
//     <Dialog 
//       open={open} 
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 4,
//           background: colors.surface.white,
//           boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
//           overflow: 'hidden',
//           border: '1px solid rgba(26, 54, 93, 0.1)'
//         }
//       }}
//     >
//       <DialogTitle sx={{
//         background: colors.primary.gradient,
//         color: 'white',
//         p: 0,
//         position: 'relative'
//       }}>
//         <Box sx={{ 
//           p: 3,
//           display: 'flex', 
//           alignItems: 'center', 
//           justifyContent: 'space-between' 
//         }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//             <Box sx={{
//               p: 1.5,
//               borderRadius: 2,
//               background: 'rgba(255,255,255,0.15)',
//               backdropFilter: 'blur(10px)'
//             }}>
//               <DateRangeIcon sx={{ fontSize: '1.5rem' }} />
//             </Box>
//             <Box>
//               <Typography variant="h6" sx={{ 
//                 fontWeight: 700,
//                 letterSpacing: '-0.025em'
//               }}>
//                 Navigate to Date
//               </Typography>
//               <Typography variant="body2" sx={{ 
//                 opacity: 0.9,
//                 fontSize: '0.875rem'
//               }}>
//                 Jump to any month and year
//               </Typography>
//             </Box>
//           </Box>
          
//           <IconButton
//             onClick={onClose}
//             size="small"
//             sx={{
//               color: 'white',
//               bgcolor: 'rgba(255,255,255,0.15)',
//               backdropFilter: 'blur(10px)',
//               '&:hover': {
//                 bgcolor: 'rgba(255,255,255,0.25)'
//               }
//             }}
//           >
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         </Box>

//         {/* Professional decorative bottom border */}
//         <Box sx={{
//           position: 'absolute',
//           bottom: 0,
//           left: 0,
//           right: 0,
//           height: 4,
//           background: `linear-gradient(90deg, ${colors.accent.gold} 0%, ${colors.accent.success} 100%)`
//         }} />
//       </DialogTitle>
      
//       <DialogContent sx={{ 
//         p: 4,
//         background: `linear-gradient(180deg, ${colors.surface.light} 0%, ${colors.surface.white} 100%)`
//       }}>
//         <LocalizationProvider dateAdapter={AdapterDateFns}>
//           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//             {/* Clean, centered date picker */}
//             <Paper 
//               elevation={0}
//               sx={{
//                 p: 4,
//                 width: '100%',
//                 maxWidth: 400,
//                 background: colors.surface.white,
//                 borderRadius: 3,
//                 border: '2px solid rgba(26, 54, 93, 0.08)',
//                 textAlign: 'center',
//                 transition: 'all 0.2s ease',
//                 '&:hover': {
//                   borderColor: 'rgba(26, 54, 93, 0.15)',
//                   boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)'
//                 }
//               }}
//             >
//               <DatePicker
//                 label="Select Date"
//                 value={pickerDate}
//                 onChange={handleDatePickerChange}
//                 slotProps={{
//                   textField: {
//                     fullWidth: true,
//                     variant: "outlined",
//                     sx: {
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: 3,
//                         fontSize: '1.2rem',
//                         fontWeight: 500,
//                         '& fieldset': {
//                           borderColor: 'rgba(26, 54, 93, 0.2)',
//                           borderWidth: 2
//                         },
//                         '&:hover fieldset': {
//                           borderColor: colors.primary.main,
//                         },
//                         '&.Mui-focused fieldset': {
//                           borderColor: colors.primary.main,
//                           borderWidth: 2
//                         }
//                       },
//                       '& .MuiInputLabel-root': {
//                         color: colors.primary.main,
//                         fontWeight: 600,
//                         fontSize: '1.1rem',
//                         '&.Mui-focused': {
//                           color: colors.primary.main
//                         }
//                       },
//                       '& .MuiOutlinedInput-input': {
//                         textAlign: 'center',
//                         py: 2
//                       }
//                     }
//                   }
//                 }}
//               />
              
//               {/* Quick action for today */}
//               <Button
//                 variant="text"
//                 startIcon={<TodayIcon />}
//                 onClick={handleTodayClick}
//                 sx={{
//                   mt: 2,
//                   color: colors.accent.main,
//                   fontWeight: 600,
//                   textTransform: 'none',
//                   '&:hover': {
//                     bgcolor: `${colors.accent.main}10`
//                   }
//                 }}
//               >
//                 Jump to Today
//               </Button>
//             </Paper>
//           </Box>
//         </LocalizationProvider>
//       </DialogContent>
      
//       <DialogActions sx={{ 
//         p: 3, 
//         background: colors.surface.light,
//         borderTop: '1px solid rgba(26, 54, 93, 0.08)',
//         justifyContent: 'space-between'
//       }}>
//         <Button 
//           onClick={onClose}
//           variant="text"
//           sx={{ 
//             color: colors.primary.main,
//             fontWeight: 600,
//             px: 3,
//             textTransform: 'none'
//           }}
//         >
//           Cancel
//         </Button>
//         <Button 
//           onClick={handleApply}
//           variant="contained"
//           disabled={!pickerDate}
//           sx={{
//             background: colors.primary.gradient,
//             borderRadius: 2,
//             px: 4,
//             py: 1.2,
//             fontWeight: 700,
//             fontSize: '1rem',
//             textTransform: 'none',
//             boxShadow: '0 4px 12px rgba(26, 54, 93, 0.3)',
//             '&:hover': {
//               background: colors.primary.dark,
//               boxShadow: '0 6px 16px rgba(26, 54, 93, 0.4)',
//               transform: 'translateY(-1px)'
//             },
//             '&:disabled': {
//               background: 'rgba(0,0,0,0.12)',
//               color: 'rgba(0,0,0,0.26)'
//             },
//             transition: 'all 0.2s ease'
//           }}
//         >
//           Navigate
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// // Main Component
// export default function TamilCalendar() {
//   const [months, setMonths] = useState([]);
//   const [festivals, setFestivals] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
//   const [modal, setModal] = useState({ open: false, data: {} });
//   const [dateNavDialog, setDateNavDialog] = useState(false);
//   const [tabIndex, setTabIndex] = useState(0);
  
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isTablet = useMediaQuery(theme.breakpoints.down('md'));

//   useEffect(() => {
//     // Load months data
//     const savedMonths = localStorage.getItem("tamilMonthsData");
//     if (savedMonths) setMonths(JSON.parse(savedMonths));
//     else setMonths(Array.from({ length: 12 }, (_, i) => ({ month: i + 1, daysInMonth: 31, tamilStartDay: 1 })));
    
//     // Load festivals data
//     const savedFestivals = localStorage.getItem("tamilFestivalsData");
//     if (savedFestivals) {
//       const loadedFestivals = JSON.parse(savedFestivals);
//       const currentYear = new Date().getFullYear();
//       const updatedFestivals = loadedFestivals.map(fest => ({
//         ...fest,
//         year: fest.year || currentYear
//       }));
//       setFestivals(updatedFestivals);
//     } else {
//       setFestivals(defaultFestivals);
//     }
//   }, []);
  
//   // Auto-save festivals when they change
//   useEffect(() => {
//     if (festivals.length > 0) {
//       localStorage.setItem("tamilFestivalsData", JSON.stringify(festivals));
//     }
//   }, [festivals]);

//   // Enhanced date click handler
//   const handleDateClick = (date, tamilDay, tamilMonth) => {
//     setSelectedDate(date);
    
//     const dateFestivals = festivals.filter(
//       f => f.month === (date.getMonth() + 1) && f.day === date.getDate()
//     );
    
//     const modalData = {
//       englishDate: format(date, "dd"),
//       englishMonth: format(date, "MMMM"),
//       englishYear: format(date, "yyyy"),
//       dayOfWeek: format(date, "EEEE"),
//       tamilDay, 
//       tamilMonth,
//       festival: dateFestivals.length > 0 ? dateFestivals[0].name : null,
//       festivalColor: dateFestivals.length > 0 ? dateFestivals[0].color : null,
//       festivals: dateFestivals,
//       festivalCount: dateFestivals.length,
//       hasMultipleFestivals: dateFestivals.length > 1
//     };
    
//     setModal({
//       open: true,
//       data: modalData
//     });
//   };

//   // Navigation handlers
//   const nextMonth = () => {
//     setCurrentMonth(addMonths(currentMonth, 1));
//   };

//   const prevMonth = () => {
//     setCurrentMonth(subMonths(currentMonth, 1));
//   };
  
//   const resetToToday = () => {
//     const today = new Date();
//     setCurrentMonth(today);
//     setSelectedDate(today);
//   };

//   const handleDateNavigation = (newDate) => {
//     setCurrentMonth(newDate);
//   };

//   const handleCloseModal = () => {
//     setModal({ ...modal, open: false });
//   };

//   // Save/Export handlers (keeping existing functionality)
//   const handleSaveMonths = () => {
//     localStorage.setItem("tamilMonthsData", JSON.stringify(months));
//     setSnackbar({ open: true, message: "Calendar settings saved successfully", severity: "success" });
//   };
  
//   const handleSaveFestivals = () => {
//     localStorage.setItem("tamilFestivalsData", JSON.stringify(festivals));
//     setSnackbar({ open: true, message: "Festival settings saved successfully", severity: "success" });
//   };
  
//   const handleExportMonths = () => {
//     const blob = new Blob([JSON.stringify(months, null, 2)], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a"); 
//     a.href = url; 
//     a.download = "tamil_months_data.json"; 
//     a.click();
//     URL.revokeObjectURL(url);
//     setSnackbar({ open: true, message: "Month settings exported to file", severity: "info" });
//   };
  
//   const handleExportFestivals = () => {
//     const blob = new Blob([JSON.stringify(festivals, null, 2)], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a"); 
//     a.href = url; 
//     a.download = "tamil_festivals_data.json"; 
//     a.click();
//     URL.revokeObjectURL(url);
//     setSnackbar({ open: true, message: "Festival data exported to file", severity: "info" });
//   };
  
//   const handleImportMonths = (e) => {
//     const file = e.target.files[0]; 
//     if (!file) return;
    
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       try {
//         const data = JSON.parse(event.target.result);
//         setMonths(data);
//         localStorage.setItem("tamilMonthsData", JSON.stringify(data));
//         setSnackbar({ open: true, message: "Month settings imported successfully", severity: "success" });
//       } catch (error) {
//         setSnackbar({ open: true, message: "Invalid file format", severity: "error" });
//       }
//     };
//     reader.readAsText(file);
//   };
  
//   const handleImportFestivals = (e) => {
//     const file = e.target.files[0]; 
//     if (!file) return;
    
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       try {
//         const data = JSON.parse(event.target.result);
//         const currentYear = new Date().getFullYear();
//         const updatedData = data.map(fest => ({
//           ...fest,
//           year: fest.year || currentYear
//         }));
//         setFestivals(updatedData);
//         localStorage.setItem("tamilFestivalsData", JSON.stringify(updatedData));
//         setSnackbar({ open: true, message: "Festival data imported successfully", severity: "success" });
//       } catch (error) {
//         setSnackbar({ open: true, message: "Invalid file format", severity: "error" });
//       }
//     };
//     reader.readAsText(file);
//   };

//   const handleExportMonthsBin = () => {
//     const lines = months.map((month, index) => 
//       `${month.daysInMonth.toString().padStart(2, '0')},${month.tamilStartDay.toString().padStart(2, '0')}`
//     );
//     const fileContent = lines.join('\n');
    
//     const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
//     const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `tamil_months_bin_${timestamp}.txt`;
//     a.click();
//     URL.revokeObjectURL(url);
//     setSnackbar({ open: true, message: "Month settings exported as binary", severity: "info" });
//   };

//   const handleExportFestivalsBin = () => {
//     const currentYear = new Date().getFullYear();
//     const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0);
//     const daysInYear = isLeapYear ? 366 : 365;
    
//     const festivalMap = new Map();
//     const serialNumberMap = new Map();
//     let nextSerialNumber = 1;
    
//     festivals.forEach(festival => {
//       const date = new Date(currentYear, festival.month - 1, festival.day);
//       const startOfYear = new Date(currentYear, 0, 1);
//       const dayOfYear = Math.ceil((date - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
      
//       if (dayOfYear >= 1 && dayOfYear <= daysInYear) {
//         if (!serialNumberMap.has(festival.name)) {
//           const paddedNumber = nextSerialNumber.toString().padStart(2, '0');
//           serialNumberMap.set(festival.name, paddedNumber);
//           nextSerialNumber++;
//         }
        
//         const serialNumber = serialNumberMap.get(festival.name);
        
//         if (festivalMap.has(dayOfYear)) {
//           festivalMap.set(dayOfYear, `${festivalMap.get(dayOfYear)},${serialNumber}`);
//         } else {
//           festivalMap.set(dayOfYear, serialNumber);
//         }
//       }
//     });
    
//     const lines = [];
//     for (let i = 1; i <= daysInYear; i++) {
//       lines.push(festivalMap.has(i) ? festivalMap.get(i) : '00');
//     }
    
//     const fileContent = lines.join('\n');
    
//     const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
//     const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `tamil_festivals_bin_${timestamp}.txt`;
//     a.click();
//     URL.revokeObjectURL(url);
//     setSnackbar({ open: true, message: "Festival data exported as binary", severity: "info" });
//   };

//   return (
//     <Box sx={{ 
//       minHeight: '100vh',
//       background: colors.background.main,
//       position: 'relative'
//     }}>
//       {/* Professional AppBar */}
//       <AppBar 
//         position="fixed" 
//         elevation={0} 
//         sx={{ 
//           background: colors.primary.gradient,
//           backdropFilter: 'blur(20px)',
//           borderBottom: '1px solid rgba(255,255,255,0.1)',
//           boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
//         }}
//       >
//         <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
//           <MenuIcon sx={{ mr: 2 }} />
//           <Typography variant="h6" sx={{ 
//             flexGrow: 1, 
//             fontWeight: 700,
//             fontSize: { xs: '1.1rem', sm: '1.25rem' }
//           }}>
//             Tamil Calendar
//           </Typography>
          
//           <Tabs 
//             value={tabIndex} 
//             onChange={(e, newIndex) => setTabIndex(newIndex)} 
//             textColor="inherit" 
//             indicatorColor="secondary"
//             sx={{
//               '& .MuiTab-root': {
//                 fontWeight: 600,
//                 textTransform: 'none',
//                 fontSize: { xs: '0.875rem', sm: '1rem' },
//                 '&.Mui-selected': {
//                   color: '#ffffff'
//                 }
//               },
//               '& .MuiTabs-indicator': {
//                 backgroundColor: '#ffffff',
//                 height: 3,
//                 borderRadius: '1.5px'
//               }
//             }}
//           >
//             <Tab 
//               icon={<CalendarMonthIcon />} 
//               label={isMobile ? null : "Calendar"} 
//               iconPosition="start"
//             />
//             <Tab 
//               icon={<SettingsIcon />} 
//               label={isMobile ? null : "Admin"} 
//               iconPosition="start"
//             />
//           </Tabs>
//         </Toolbar>
//       </AppBar>

//       <Container maxWidth="xl" sx={{ pt: { xs: 8, sm: 10 }, pb: 4 }}>
//         {tabIndex === 0 && (
//           <Card 
//             elevation={0}
//             sx={{ 
//               borderRadius: 4,
//               overflow: "hidden",
//               background: colors.background.card,
//               backdropFilter: 'blur(20px)',
//               border: '1px solid rgba(255,255,255,0.2)',
//               boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
//             }}
//             className="calendar-wrapper"
//           >
//             {/* Enhanced Calendar Header */}
//             <Paper elevation={0} sx={{ 
//               p: { xs: 2, sm: 3 }, 
//               display: "flex", 
//               alignItems: "center", 
//               justifyContent: "space-between",
//               background: colors.primary.gradient,
//               color: 'white',
//               flexWrap: 'wrap',
//               gap: 2
//             }}>
//               <Stack direction="row" alignItems="center" spacing={2}>
//                 <CalendarMonthIcon sx={{ fontSize: '2rem' }} />
//                 <Box>
//                   <Typography variant="h5" sx={{ 
//                     fontWeight: 700,
//                     fontSize: { xs: '1.5rem', sm: '1.75rem' }
//                   }}>
//                     {format(currentMonth, "MMMM yyyy")}
//                   </Typography>
//                   <Typography variant="body2" sx={{ 
//                     opacity: 0.9,
//                     fontSize: '0.875rem'
//                   }}>
//                     Today: {format(new Date(), "EEEE, MMM dd")}
//                   </Typography>
//                 </Box>
//               </Stack>
              
//               <Stack direction="row" spacing={1} alignItems="center">
//                 {/* Month Navigation */}
//                 <IconButton 
//                   onClick={prevMonth} 
//                   sx={{ 
//                     color: 'white',
//                     bgcolor: 'rgba(255,255,255,0.1)',
//                     '&:hover': { 
//                       bgcolor: 'rgba(255,255,255,0.2)',
//                       transform: 'scale(1.05)'
//                     },
//                     transition: 'all 0.2s ease'
//                   }}
//                 >
//                   <NavigateBeforeIcon />
//                 </IconButton>
                
//                 {/* Date Navigation Button */}
//                 <Button 
//                   variant="outlined"
//                   onClick={() => setDateNavDialog(true)}
//                   startIcon={<DateRangeIcon />}
//                   sx={{ 
//                     color: 'white',
//                     borderColor: 'rgba(255,255,255,0.3)',
//                     bgcolor: 'rgba(255,255,255,0.1)',
//                     '&:hover': {
//                       borderColor: 'white',
//                       bgcolor: 'rgba(255,255,255,0.2)'
//                     },
//                     fontWeight: 600,
//                     textTransform: 'none',
//                     px: { xs: 2, sm: 3 }
//                   }}
//                 >
//                   {isMobile ? 'Navigate' : 'Navigate to Date'}
//                 </Button>
                
//                 {/* Today Button */}
//                 <Button 
//                   variant="outlined"
//                   onClick={resetToToday}
//                   startIcon={<TodayIcon />}
//                   sx={{ 
//                     color: 'white',
//                     borderColor: 'rgba(255,255,255,0.3)',
//                     bgcolor: 'rgba(255,255,255,0.1)',
//                     '&:hover': {
//                       borderColor: 'white',
//                       bgcolor: 'rgba(255,255,255,0.2)'
//                     },
//                     fontWeight: 600,
//                     textTransform: 'none',
//                     px: { xs: 2, sm: 3 }
//                   }}
//                 >
//                   Today
//                 </Button>
                
//                 <IconButton 
//                   onClick={nextMonth} 
//                   sx={{ 
//                     color: 'white',
//                     bgcolor: 'rgba(255,255,255,0.1)',
//                     '&:hover': { 
//                       bgcolor: 'rgba(255,255,255,0.2)',
//                       transform: 'scale(1.05)'
//                     },
//                     transition: 'all 0.2s ease'
//                   }}
//                 >
//                   <NavigateNextIcon />
//                 </IconButton>
//               </Stack>
//             </Paper>
            
//             <SimpleCalendar 
//               currentMonth={currentMonth}
//               selectedDate={selectedDate}
//               months={months}
//               festivals={festivals}
//               onDateClick={handleDateClick}
//             />
//           </Card>
//         )}

//         {tabIndex === 1 && (
//           <AdminTable
//             className="admin-panel"
//             months={months}
//             festivals={festivals}
//             onMonthChange={(i, f, v) => {
//               setMonths(prev => {
//                 const copy = [...prev];
//                 copy[i][f] = v;
//                 return copy;
//               });
//             }}
//             onFestivalChange={setFestivals}
//             onSaveMonths={handleSaveMonths}
//             onSaveFestivals={handleSaveFestivals}
//             onExportMonths={handleExportMonths}
//             onExportFestivals={handleExportFestivals}
//             onImportMonths={handleImportMonths}
//             onImportFestivals={handleImportFestivals}
//             onExportMonthsBin={handleExportMonthsBin}
//             onExportFestivalsBin={handleExportFestivalsBin}
//           />
//         )}

//         {/* Professional Simplified Date Navigation Dialog */}
//         <DateNavigationDialog
//           open={dateNavDialog}
//           currentDate={currentMonth}
//           onClose={() => setDateNavDialog(false)}
//           onDateChange={handleDateNavigation}
//         />

//         <DateDetailsModal 
//           className="date-details-modal"
//           open={modal.open}
//           data={modal.data}
//           festivals={festivals}
//           onClose={handleCloseModal}
//         />

//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={6000}
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//         >
//           <Alert 
//             severity={snackbar.severity}
//             variant="filled"
//             sx={{ 
//               width: '100%',
//               borderRadius: 3,
//               fontWeight: 600,
//               fontSize: '0.95rem',
//               boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
//             }}
//             onClose={() => setSnackbar({ ...snackbar, open: false })}
//           >
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </Container>

//       {/* Floating Date Picker for Quick Access */}
//       <Zoom in={tabIndex === 0}>
//         <Fab
//           color="primary"
//           sx={{
//             position: 'fixed',
//             bottom: { xs: 16, md: 32 },
//             right: { xs: 16, md: 32 },
//             background: colors.secondary.gradient,
//             '&:hover': {
//               background: colors.secondary.main,
//               transform: 'scale(1.1)'
//             },
//             transition: 'all 0.3s ease',
//             boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
//             zIndex: 1000
//           }}
//           onClick={() => setDateNavDialog(true)}
//         >
//           <DateRangeIcon />
//         </Fab>
//       </Zoom>
//     </Box>
//   );
// }


// import React, { useState, useEffect } from "react";
// import {
//   Container, Typography, Snackbar, Alert, AppBar, Toolbar, Tabs, Tab,
//   Box, IconButton, Card, useTheme, useMediaQuery, Button, Dialog,
//   DialogTitle, DialogContent, DialogActions, Grid, TextField, MenuItem,
//   Fab, Zoom, Paper, Stack
// } from "@mui/material";
// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import MenuIcon from "@mui/icons-material/Menu";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import SettingsIcon from "@mui/icons-material/Settings";
// // import ArrowBackIosNewIcon from "@mui/icons-icon/ArrowBackIosNew";
// // import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// // import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// // import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import TodayIcon from "@mui/icons-material/Today";
// import DateRangeIcon from "@mui/icons-material/DateRange";
// import NavigateNextIcon from "@mui/icons-material/NavigateNext";
// import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
// import CloseIcon from "@mui/icons-material/Close";
// import { format, addMonths, subMonths } from "date-fns";

// // Import components
// import SimpleCalendar from "./SimpleCalendar";
// import AdminTable from "./AdminTable";
// import DateDetailsModal from "./DateDetailsModal";

// // Import constants
// import { defaultFestivals } from "./constants";

// // Professional color palette
// const colors = {
//   primary: {
//     main: '#1a365d',
//     light: '#2d5d7b',
//     dark: '#0f2744',
//     gradient: 'linear-gradient(135deg, #1a365d 0%, #2c5282 50%, #3182ce 100%)'
//   },
//   secondary: {
//     main: '#6a1b9a',
//     light: '#9c4dcc',
//     dark: '#38006b',
//     gradient: 'linear-gradient(135deg, #6a1b9a 0%, #8e24aa 50%, #ba68c8 100%)'
//   },
//   accent: {
//     main: '#00695c',
//     light: '#439889',
//     dark: '#003d33',
//     gold: '#d69e2e'
//   },
//   background: {
//     main: 'linear-gradient(135deg, #f8faff 0%, #e8eaf6 50%, #f3e5f5 100%)',
//     card: 'rgba(255, 255, 255, 0.95)',
//     glass: 'rgba(255, 255, 255, 0.1)'
//   }
// };

// // Simplified Date Navigation Dialog Component (DatePicker Only)
// function DateNavigationDialog({ open, currentDate, onClose, onDateChange }) {
//   const [pickerDate, setPickerDate] = useState(currentDate);
  
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
//   const handleApply = () => {
//     if (pickerDate) {
//       onDateChange(pickerDate);
//     }
//     onClose();
//   };
  
//   const handleDatePickerChange = (newDate) => {
//     if (newDate) {
//       setPickerDate(newDate);
//     }
//   };

//   const handleTodayClick = () => {
//     const today = new Date();
//     setPickerDate(today);
//     onDateChange(today);
//     onClose();
//   };

//   // Update picker date when dialog opens with new current date
//   useEffect(() => {
//     if (open) {
//       setPickerDate(currentDate);
//     }
//   }, [open, currentDate]);

//   return (
//     <Dialog 
//       open={open} 
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 4,
//           background: colors.background.card,
//           backdropFilter: 'blur(20px)',
//           border: '1px solid rgba(26, 54, 93, 0.1)',
//           boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
//           overflow: 'hidden'
//         }
//       }}
//     >
//       <DialogTitle sx={{
//         background: colors.primary.gradient,
//         color: 'white',
//         p: 3,
//         position: 'relative'
//       }}>
//         <Box sx={{ 
//           display: 'flex', 
//           alignItems: 'center', 
//           justifyContent: 'space-between' 
//         }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//             <Box sx={{
//               p: 1.5,
//               borderRadius: 2,
//               background: 'rgba(255,255,255,0.15)',
//               backdropFilter: 'blur(10px)'
//             }}>
//               <DateRangeIcon sx={{ fontSize: '1.5rem' }} />
//             </Box>
//             <Box>
//               <Typography variant="h6" sx={{ 
//                 fontWeight: 700,
//                 letterSpacing: '-0.025em'
//               }}>
//                 Navigate to Date
//               </Typography>
//               <Typography variant="body2" sx={{ 
//                 opacity: 0.9,
//                 fontSize: '0.875rem'
//               }}>
//                 Choose any date to navigate to
//               </Typography>
//             </Box>
//           </Box>
          
//           <IconButton
//             onClick={onClose}
//             size="small"
//             sx={{
//               color: 'white',
//               bgcolor: 'rgba(255,255,255,0.15)',
//               backdropFilter: 'blur(10px)',
//               '&:hover': {
//                 bgcolor: 'rgba(255,255,255,0.25)'
//               }
//             }}
//           >
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         </Box>

//         {/* Decorative bottom border */}
//         <Box sx={{
//           position: 'absolute',
//           bottom: 0,
//           left: 0,
//           right: 0,
//           height: 4,
//           background: `linear-gradient(90deg, ${colors.accent.gold} 0%, ${colors.accent.main} 100%)`
//         }} />
//       </DialogTitle>
      
//       <DialogContent sx={{ p: 4 }}>
//         <LocalizationProvider dateAdapter={AdapterDateFns}>
//           <Grid container spacing={4}>
//             {/* Date Picker Section */}
//             <Grid item xs={12}>
//               <Paper sx={{
//                 p: 3,
//                 background: colors.background.card,
//                 borderRadius: 3,
//                 border: '1px solid rgba(26, 54, 93, 0.1)',
//                 textAlign: 'center'
//               }}>
//                 <Typography variant="h6" sx={{ 
//                   mb: 3, 
//                   color: colors.primary.main,
//                   fontWeight: 700
//                 }}>
//                   Select Date
//                 </Typography>
                
//                 <DatePicker
//                   label="Choose Date"
//                   value={pickerDate}
//                   onChange={handleDatePickerChange}
//                   slotProps={{
//                     textField: {
//                       fullWidth: true,
//                       variant: "outlined",
//                       sx: {
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 3,
//                           fontSize: '1.1rem',
//                           '& fieldset': {
//                             borderColor: 'rgba(26, 54, 93, 0.2)',
//                             borderWidth: 2
//                           },
//                           '&:hover fieldset': {
//                             borderColor: colors.primary.main,
//                           },
//                           '&.Mui-focused fieldset': {
//                             borderColor: colors.primary.main,
//                             borderWidth: 2
//                           }
//                         },
//                         '& .MuiInputLabel-root': {
//                           color: colors.primary.main,
//                           fontWeight: 600,
//                           '&.Mui-focused': {
//                             color: colors.primary.main
//                           }
//                         }
//                       }
//                     }
//                   }}
//                 />
//               </Paper>
//             </Grid>
            
//             {/* Current Selection Display */}
//             <Grid item xs={12}>
//               <Paper sx={{
//                 p: 3,
//                 background: colors.secondary.gradient,
//                 borderRadius: 3,
//                 color: 'white',
//                 textAlign: 'center',
//                 boxShadow: '0 8px 32px rgba(106, 27, 154, 0.3)'
//               }}>
//                 <Typography variant="body2" sx={{ 
//                   opacity: 0.9,
//                   fontWeight: 500,
//                   mb: 1
//                 }}>
//                   Selected Date
//                 </Typography>
//                 <Typography variant="h5" sx={{ 
//                   fontWeight: 700,
//                   letterSpacing: '-0.025em'
//                 }}>
//                   {pickerDate ? format(pickerDate, "MMMM dd, yyyy") : "No date selected"}
//                 </Typography>
//                 {pickerDate && (
//                   <Typography variant="body2" sx={{ 
//                     opacity: 0.9,
//                     fontWeight: 500,
//                     mt: 1
//                   }}>
//                     {format(pickerDate, "EEEE")}
//                   </Typography>
//                 )}
//               </Paper>
//             </Grid>

//             {/* Quick Action Buttons */}
//             {/* <Grid item xs={12}>
//               <Stack direction="row" spacing={2} justifyContent="center">
//                 <Button
//                   variant="outlined"
//                   startIcon={<TodayIcon />}
//                   onClick={handleTodayClick}
//                   sx={{
//                     color: colors.accent.main,
//                     borderColor: colors.accent.main,
//                     fontWeight: 600,
//                     px: 3,
//                     borderRadius: 2,
//                     '&:hover': {
//                       borderColor: colors.accent.main,
//                       bgcolor: `${colors.accent.main}10`
//                     }
//                   }}
//                 >
//                   Jump to Today
//                 </Button>
//               </Stack>
//             </Grid> */}
//           </Grid>
//         </LocalizationProvider>
//       </DialogContent>
      
//       <DialogActions sx={{ 
//         p: 3, 
//         background: 'rgba(26, 54, 93, 0.02)',
//         borderTop: '1px solid rgba(26, 54, 93, 0.1)',
//         justifyContent: 'space-between'
//       }}>
//         <Button 
//           onClick={onClose}
//           sx={{ 
//             color: colors.primary.main,
//             fontWeight: 600,
//             px: 3
//           }}
//         >
//           Cancel
//         </Button>
//         <Button 
//           onClick={handleApply}
//           variant="contained"
//           disabled={!pickerDate}
//           sx={{
//             background: colors.primary.gradient,
//             borderRadius: 2,
//             px: 4,
//             py: 1,
//             fontWeight: 700,
//             fontSize: '1rem',
//             textTransform: 'none',
//             boxShadow: '0 4px 12px rgba(26, 54, 93, 0.3)',
//             '&:hover': {
//               background: colors.primary.dark,
//               boxShadow: '0 6px 16px rgba(26, 54, 93, 0.4)',
//               transform: 'translateY(-1px)'
//             },
//             '&:disabled': {
//               background: 'rgba(0,0,0,0.12)',
//               color: 'rgba(0,0,0,0.26)'
//             },
//             transition: 'all 0.2s ease'
//           }}
//         >
//           Go to Date
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// // Main Component
// export default function TamilCalendar() {
//   const [months, setMonths] = useState([]);
//   const [festivals, setFestivals] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
//   const [modal, setModal] = useState({ open: false, data: {} });
//   const [dateNavDialog, setDateNavDialog] = useState(false);
//   const [tabIndex, setTabIndex] = useState(0);
  
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isTablet = useMediaQuery(theme.breakpoints.down('md'));

//   useEffect(() => {
//     // Load months data
//     const savedMonths = localStorage.getItem("tamilMonthsData");
//     if (savedMonths) setMonths(JSON.parse(savedMonths));
//     else setMonths(Array.from({ length: 12 }, (_, i) => ({ month: i + 1, daysInMonth: 31, tamilStartDay: 1 })));
    
//     // Load festivals data
//     const savedFestivals = localStorage.getItem("tamilFestivalsData");
//     if (savedFestivals) {
//       const loadedFestivals = JSON.parse(savedFestivals);
//       const currentYear = new Date().getFullYear();
//       const updatedFestivals = loadedFestivals.map(fest => ({
//         ...fest,
//         year: fest.year || currentYear
//       }));
//       setFestivals(updatedFestivals);
//     } else {
//       setFestivals(defaultFestivals);
//     }
//   }, []);
  
//   // Auto-save festivals when they change
//   useEffect(() => {
//     if (festivals.length > 0) {
//       localStorage.setItem("tamilFestivalsData", JSON.stringify(festivals));
//     }
//   }, [festivals]);

//   // Enhanced date click handler
//   const handleDateClick = (date, tamilDay, tamilMonth) => {
//     setSelectedDate(date);
    
//     const dateFestivals = festivals.filter(
//       f => f.month === (date.getMonth() + 1) && f.day === date.getDate()
//     );
    
//     const modalData = {
//       englishDate: format(date, "dd"),
//       englishMonth: format(date, "MMMM"),
//       englishYear: format(date, "yyyy"),
//       dayOfWeek: format(date, "EEEE"),
//       tamilDay, 
//       tamilMonth,
//       festival: dateFestivals.length > 0 ? dateFestivals[0].name : null,
//       festivalColor: dateFestivals.length > 0 ? dateFestivals[0].color : null,
//       festivals: dateFestivals,
//       festivalCount: dateFestivals.length,
//       hasMultipleFestivals: dateFestivals.length > 1
//     };
    
//     setModal({
//       open: true,
//       data: modalData
//     });
//   };

//   // Navigation handlers
//   const nextMonth = () => {
//     setCurrentMonth(addMonths(currentMonth, 1));
//   };

//   const prevMonth = () => {
//     setCurrentMonth(subMonths(currentMonth, 1));
//   };
  
//   const resetToToday = () => {
//     const today = new Date();
//     setCurrentMonth(today);
//     setSelectedDate(today);
//   };

//   const handleDateNavigation = (newDate) => {
//     setCurrentMonth(newDate);
//   };

//   const handleCloseModal = () => {
//     setModal({ ...modal, open: false });
//   };

//   // Save/Export handlers (keeping existing functionality)
//   const handleSaveMonths = () => {
//     localStorage.setItem("tamilMonthsData", JSON.stringify(months));
//     setSnackbar({ open: true, message: "Calendar settings saved successfully", severity: "success" });
//   };
  
//   const handleSaveFestivals = () => {
//     localStorage.setItem("tamilFestivalsData", JSON.stringify(festivals));
//     setSnackbar({ open: true, message: "Festival settings saved successfully", severity: "success" });
//   };
  
//   const handleExportMonths = () => {
//     const blob = new Blob([JSON.stringify(months, null, 2)], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a"); 
//     a.href = url; 
//     a.download = "tamil_months_data.json"; 
//     a.click();
//     URL.revokeObjectURL(url);
//     setSnackbar({ open: true, message: "Month settings exported to file", severity: "info" });
//   };
  
//   const handleExportFestivals = () => {
//     const blob = new Blob([JSON.stringify(festivals, null, 2)], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a"); 
//     a.href = url; 
//     a.download = "tamil_festivals_data.json"; 
//     a.click();
//     URL.revokeObjectURL(url);
//     setSnackbar({ open: true, message: "Festival data exported to file", severity: "info" });
//   };
  
//   const handleImportMonths = (e) => {
//     const file = e.target.files[0]; 
//     if (!file) return;
    
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       try {
//         const data = JSON.parse(event.target.result);
//         setMonths(data);
//         localStorage.setItem("tamilMonthsData", JSON.stringify(data));
//         setSnackbar({ open: true, message: "Month settings imported successfully", severity: "success" });
//       } catch (error) {
//         setSnackbar({ open: true, message: "Invalid file format", severity: "error" });
//       }
//     };
//     reader.readAsText(file);
//   };
  
//   const handleImportFestivals = (e) => {
//     const file = e.target.files[0]; 
//     if (!file) return;
    
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       try {
//         const data = JSON.parse(event.target.result);
//         const currentYear = new Date().getFullYear();
//         const updatedData = data.map(fest => ({
//           ...fest,
//           year: fest.year || currentYear
//         }));
//         setFestivals(updatedData);
//         localStorage.setItem("tamilFestivalsData", JSON.stringify(updatedData));
//         setSnackbar({ open: true, message: "Festival data imported successfully", severity: "success" });
//       } catch (error) {
//         setSnackbar({ open: true, message: "Invalid file format", severity: "error" });
//       }
//     };
//     reader.readAsText(file);
//   };

//   const handleExportMonthsBin = () => {
//     const lines = months.map((month, index) => 
//       `${month.daysInMonth.toString().padStart(2, '0')},${month.tamilStartDay.toString().padStart(2, '0')}`
//     );
//     const fileContent = lines.join('\n');
    
//     const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
//     const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `tamil_months_bin_${timestamp}.txt`;
//     a.click();
//     URL.revokeObjectURL(url);
//     setSnackbar({ open: true, message: "Month settings exported as binary", severity: "info" });
//   };

//   const handleExportFestivalsBin = () => {
//     const currentYear = new Date().getFullYear();
//     const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0);
//     const daysInYear = isLeapYear ? 366 : 365;
    
//     const festivalMap = new Map();
//     const serialNumberMap = new Map();
//     let nextSerialNumber = 1;
    
//     festivals.forEach(festival => {
//       const date = new Date(currentYear, festival.month - 1, festival.day);
//       const startOfYear = new Date(currentYear, 0, 1);
//       const dayOfYear = Math.ceil((date - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
      
//       if (dayOfYear >= 1 && dayOfYear <= daysInYear) {
//         if (!serialNumberMap.has(festival.name)) {
//           const paddedNumber = nextSerialNumber.toString().padStart(2, '0');
//           serialNumberMap.set(festival.name, paddedNumber);
//           nextSerialNumber++;
//         }
        
//         const serialNumber = serialNumberMap.get(festival.name);
        
//         if (festivalMap.has(dayOfYear)) {
//           festivalMap.set(dayOfYear, `${festivalMap.get(dayOfYear)},${serialNumber}`);
//         } else {
//           festivalMap.set(dayOfYear, serialNumber);
//         }
//       }
//     });
    
//     const lines = [];
//     for (let i = 1; i <= daysInYear; i++) {
//       lines.push(festivalMap.has(i) ? festivalMap.get(i) : '00');
//     }
    
//     const fileContent = lines.join('\n');
    
//     const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
//     const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `tamil_festivals_bin_${timestamp}.txt`;
//     a.click();
//     URL.revokeObjectURL(url);
//     setSnackbar({ open: true, message: "Festival data exported as binary", severity: "info" });
//   };

//   return (
//     <Box sx={{ 
//       minHeight: '100vh',
//       background: colors.background.main,
//       position: 'relative'
//     }}>
//       {/* Professional AppBar */}
//       <AppBar 
//         position="fixed" 
//         elevation={0} 
//         sx={{ 
//           background: colors.primary.gradient,
//           backdropFilter: 'blur(20px)',
//           borderBottom: '1px solid rgba(255,255,255,0.1)',
//           boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
//         }}
//       >
//         <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
//           <MenuIcon sx={{ mr: 2 }} />
//           <Typography variant="h6" sx={{ 
//             flexGrow: 1, 
//             fontWeight: 700,
//             fontSize: { xs: '1.1rem', sm: '1.25rem' }
//           }}>
//             Tamil Calendar
//           </Typography>
          
//           <Tabs 
//             value={tabIndex} 
//             onChange={(e, newIndex) => setTabIndex(newIndex)} 
//             textColor="inherit" 
//             indicatorColor="secondary"
//             sx={{
//               '& .MuiTab-root': {
//                 fontWeight: 600,
//                 textTransform: 'none',
//                 fontSize: { xs: '0.875rem', sm: '1rem' },
//                 '&.Mui-selected': {
//                   color: '#ffffff'
//                 }
//               },
//               '& .MuiTabs-indicator': {
//                 backgroundColor: '#ffffff',
//                 height: 3,
//                 borderRadius: '1.5px'
//               }
//             }}
//           >
//             <Tab 
//               icon={<CalendarMonthIcon />} 
//               label={isMobile ? null : "Calendar"} 
//               iconPosition="start"
//             />
//             <Tab 
//               icon={<SettingsIcon />} 
//               label={isMobile ? null : "Admin"} 
//               iconPosition="start"
//             />
//           </Tabs>
//         </Toolbar>
//       </AppBar>

//       <Container maxWidth="xl" sx={{ pt: { xs: 8, sm: 10 }, pb: 4 }}>
//         {tabIndex === 0 && (
//           <Card 
//             elevation={0}
//             sx={{ 
//               borderRadius: 4,
//               overflow: "hidden",
//               background: colors.background.card,
//               backdropFilter: 'blur(20px)',
//               border: '1px solid rgba(255,255,255,0.2)',
//               boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
//             }}
//             className="calendar-wrapper"
//           >
//             {/* Enhanced Calendar Header */}
//             <Paper elevation={0} sx={{ 
//               p: { xs: 2, sm: 3 }, 
//               display: "flex", 
//               alignItems: "center", 
//               justifyContent: "space-between",
//               background: colors.primary.gradient,
//               color: 'white',
//               flexWrap: 'wrap',
//               gap: 2
//             }}>
//               <Stack direction="row" alignItems="center" spacing={2}>
//                 <CalendarMonthIcon sx={{ fontSize: '2rem' }} />
//                 <Box>
//                   <Typography variant="h5" sx={{ 
//                     fontWeight: 700,
//                     fontSize: { xs: '1.5rem', sm: '1.75rem' }
//                   }}>
//                     {format(currentMonth, "MMMM yyyy")}
//                   </Typography>
//                   <Typography variant="body2" sx={{ 
//                     opacity: 0.9,
//                     fontSize: '0.875rem'
//                   }}>
//                     Today: {format(new Date(), "EEEE, MMM dd")}
//                   </Typography>
//                 </Box>
//               </Stack>
              
//               <Stack direction="row" spacing={1} alignItems="center">
//                 {/* Month Navigation */}
//                 <IconButton 
//                   onClick={prevMonth} 
//                   sx={{ 
//                     color: 'white',
//                     bgcolor: 'rgba(255,255,255,0.1)',
//                     '&:hover': { 
//                       bgcolor: 'rgba(255,255,255,0.2)',
//                       transform: 'scale(1.05)'
//                     },
//                     transition: 'all 0.2s ease'
//                   }}
//                 >
//                   <NavigateBeforeIcon />
//                 </IconButton>
                
//                 {/* Date Navigation Button */}
//                 <Button 
//                   variant="outlined"
//                   onClick={() => setDateNavDialog(true)}
//                   startIcon={<DateRangeIcon />}
//                   sx={{ 
//                     color: 'white',
//                     borderColor: 'rgba(255,255,255,0.3)',
//                     bgcolor: 'rgba(255,255,255,0.1)',
//                     '&:hover': {
//                       borderColor: 'white',
//                       bgcolor: 'rgba(255,255,255,0.2)'
//                     },
//                     fontWeight: 600,
//                     textTransform: 'none',
//                     px: { xs: 2, sm: 3 }
//                   }}
//                 >
//                   {isMobile ? 'Pick Date' : 'Select Date'}
//                 </Button>
                
//                 {/* Today Button */}
//                 <Button 
//                   variant="outlined"
//                   onClick={resetToToday}
//                   startIcon={<TodayIcon />}
//                   sx={{ 
//                     color: 'white',
//                     borderColor: 'rgba(255,255,255,0.3)',
//                     bgcolor: 'rgba(255,255,255,0.1)',
//                     '&:hover': {
//                       borderColor: 'white',
//                       bgcolor: 'rgba(255,255,255,0.2)'
//                     },
//                     fontWeight: 600,
//                     textTransform: 'none',
//                     px: { xs: 2, sm: 3 }
//                   }}
//                 >
//                   Today
//                 </Button>
                
//                 <IconButton 
//                   onClick={nextMonth} 
//                   sx={{ 
//                     color: 'white',
//                     bgcolor: 'rgba(255,255,255,0.1)',
//                     '&:hover': { 
//                       bgcolor: 'rgba(255,255,255,0.2)',
//                       transform: 'scale(1.05)'
//                     },
//                     transition: 'all 0.2s ease'
//                   }}
//                 >
//                   <NavigateNextIcon />
//                 </IconButton>
//               </Stack>
//             </Paper>
            
//             <SimpleCalendar 
//               currentMonth={currentMonth}
//               selectedDate={selectedDate}
//               months={months}
//               festivals={festivals}
//               onDateClick={handleDateClick}
//             />
//           </Card>
//         )}

//         {tabIndex === 1 && (
//           <AdminTable
//             className="admin-panel"
//             months={months}
//             festivals={festivals}
//             onMonthChange={(i, f, v) => {
//               setMonths(prev => {
//                 const copy = [...prev];
//                 copy[i][f] = v;
//                 return copy;
//               });
//             }}
//             onFestivalChange={setFestivals}
//             onSaveMonths={handleSaveMonths}
//             onSaveFestivals={handleSaveFestivals}
//             onExportMonths={handleExportMonths}
//             onExportFestivals={handleExportFestivals}
//             onImportMonths={handleImportMonths}
//             onImportFestivals={handleImportFestivals}
//             onExportMonthsBin={handleExportMonthsBin}
//             onExportFestivalsBin={handleExportFestivalsBin}
//           />
//         )}

//         {/* Simplified Date Navigation Dialog */}
//         <DateNavigationDialog
//           open={dateNavDialog}
//           currentDate={currentMonth}
//           onClose={() => setDateNavDialog(false)}
//           onDateChange={handleDateNavigation}
//         />

//         <DateDetailsModal 
//           className="date-details-modal"
//           open={modal.open}
//           data={modal.data}
//           festivals={festivals}
//           onClose={handleCloseModal}
//         />

//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={6000}
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//         >
//           <Alert 
//             severity={snackbar.severity}
//             variant="filled"
//             sx={{ 
//               width: '100%',
//               borderRadius: 3,
//               fontWeight: 600,
//               fontSize: '0.95rem',
//               boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
//             }}
//             onClose={() => setSnackbar({ ...snackbar, open: false })}
//           >
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </Container>

//       {/* Floating Date Picker for Quick Access */}
//       <Zoom in={tabIndex === 0}>
//         <Fab
//           color="primary"
//           sx={{
//             position: 'fixed',
//             bottom: { xs: 16, md: 32 },
//             right: { xs: 16, md: 32 },
//             background: colors.secondary.gradient,
//             '&:hover': {
//               background: colors.secondary.main,
//               transform: 'scale(1.1)'
//             },
//             transition: 'all 0.3s ease',
//             boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
//             zIndex: 1000
//           }}
//           onClick={() => setDateNavDialog(true)}
//         >
//           <DateRangeIcon />
//         </Fab>
//       </Zoom>
//     </Box>
//   );
// }


// import React, { useState, useEffect } from "react";
// import {
//   Container, Typography, Snackbar, Alert, AppBar, Toolbar, Tabs, Tab,
//   Box, IconButton, Card, useTheme, useMediaQuery, Button, Dialog,
//   DialogTitle, DialogContent, DialogActions, Grid, TextField, MenuItem,
//   Fab, Zoom, Paper, Stack
// } from "@mui/material";
// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import MenuIcon from "@mui/icons-material/Menu";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import SettingsIcon from "@mui/icons-material/Settings";
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import TodayIcon from "@mui/icons-material/Today";
// import DateRangeIcon from "@mui/icons-material/DateRange";
// import NavigateNextIcon from "@mui/icons-material/NavigateNext";
// import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
// import { format, addMonths, subMonths, setMonth, setYear } from "date-fns";

// // Import components
// import SimpleCalendar from "./SimpleCalendar";
// import AdminTable from "./AdminTable";
// import DateDetailsModal from "./DateDetailsModal";

// // Import constants
// import { defaultFestivals } from "./constants";

// // Professional color palette
// const colors = {
//   primary: {
//     main: '#1a237e',
//     light: '#534bae',
//     dark: '#000051',
//     gradient: 'linear-gradient(135deg, #1a237e 0%, #3f51b5 50%, #5c6bc0 100%)'
//   },
//   secondary: {
//     main: '#6a1b9a',
//     light: '#9c4dcc',
//     dark: '#38006b',
//     gradient: 'linear-gradient(135deg, #6a1b9a 0%, #8e24aa 50%, #ba68c8 100%)'
//   },
//   accent: {
//     main: '#00695c',
//     light: '#439889',
//     dark: '#003d33'
//   },
//   background: {
//     main: 'linear-gradient(135deg, #f8faff 0%, #e8eaf6 50%, #f3e5f5 100%)',
//     card: 'rgba(255, 255, 255, 0.95)',
//     glass: 'rgba(255, 255, 255, 0.1)'
//   }
// };

// // Date Navigation Dialog Component
// function DateNavigationDialog({ open, currentDate, onClose, onDateChange }) {
//   const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
//   const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
//   const [pickerDate, setPickerDate] = useState(currentDate);
  
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
//   // Generate year options (current year ± 50 years)
//   const currentYear = new Date().getFullYear();
//   const yearOptions = Array.from({ length: 101 }, (_, i) => currentYear - 50 + i);
  
//   const monthNames = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];
  
//   const handleApply = () => {
//     const newDate = new Date(selectedYear, selectedMonth, 1);
//     onDateChange(newDate);
//     onClose();
//   };
  
//   const handleDatePickerChange = (newDate) => {
//     if (newDate) {
//       setPickerDate(newDate);
//       setSelectedYear(newDate.getFullYear());
//       setSelectedMonth(newDate.getMonth());
//     }
//   };

//   return (
//     <Dialog 
//       open={open} 
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 3,
//           background: colors.background.main,
//           backdropFilter: 'blur(20px)',
//           border: '1px solid rgba(255,255,255,0.2)',
//           boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
//         }
//       }}
//     >
//       <DialogTitle sx={{
//         background: colors.primary.gradient,
//         color: 'white',
//         textAlign: 'center',
//         py: 3
//       }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//           <DateRangeIcon sx={{ mr: 1, fontSize: '1.5rem' }} />
//           <Typography variant="h6" sx={{ fontWeight: 600 }}>
//             Navigate to Date
//           </Typography>
//         </Box>
//       </DialogTitle>
      
//       <DialogContent sx={{ p: 4 }}>
//         <LocalizationProvider dateAdapter={AdapterDateFns}>
//           <Grid container spacing={3}>
//             {/* Date Picker */}
//             <Grid item xs={12}>
//               <Paper sx={{
//                 p: 2,
//                 background: colors.background.card,
//                 borderRadius: 2,
//                 border: '1px solid rgba(26, 35, 126, 0.1)'
//               }}>
//                 <Typography variant="subtitle2" sx={{ 
//                   mb: 2, 
//                   color: colors.primary.main,
//                   fontWeight: 600 
//                 }}>
//                   Choose Date
//                 </Typography>
//                 <DatePicker
//                   label="Select Date"
//                   value={pickerDate}
//                   onChange={handleDatePickerChange}
//                   slotProps={{
//                     textField: {
//                       fullWidth: true,
//                       variant: "outlined",
//                       sx: {
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 2,
//                           '&:hover fieldset': {
//                             borderColor: colors.primary.main,
//                           },
//                           '&.Mui-focused fieldset': {
//                             borderColor: colors.primary.main,
//                           }
//                         }
//                       }
//                     }
//                   }}
//                 />
//               </Paper>
//             </Grid>
            
//             {/* Manual Selection */}
//             <Grid item xs={12}>
//               <Paper sx={{
//                 p: 2,
//                 background: colors.background.card,
//                 borderRadius: 2,
//                 border: '1px solid rgba(26, 35, 126, 0.1)'
//               }}>
//                 <Typography variant="subtitle2" sx={{ 
//                   mb: 2, 
//                   color: colors.primary.main,
//                   fontWeight: 600 
//                 }}>
//                   Or Select Manually
//                 </Typography>
                
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       select
//                       label="Month"
//                       fullWidth
//                       value={selectedMonth}
//                       onChange={(e) => setSelectedMonth(Number(e.target.value))}
//                       variant="outlined"
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 2,
//                           '&:hover fieldset': {
//                             borderColor: colors.primary.main,
//                           },
//                           '&.Mui-focused fieldset': {
//                             borderColor: colors.primary.main,
//                           }
//                         }
//                       }}
//                     >
//                       {monthNames.map((month, index) => (
//                         <MenuItem key={index} value={index}>
//                           {month}
//                         </MenuItem>
//                       ))}
//                     </TextField>
//                   </Grid>
                  
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       select
//                       label="Year"
//                       fullWidth
//                       value={selectedYear}
//                       onChange={(e) => setSelectedYear(Number(e.target.value))}
//                       variant="outlined"
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 2,
//                           '&:hover fieldset': {
//                             borderColor: colors.primary.main,
//                           },
//                           '&.Mui-focused fieldset': {
//                             borderColor: colors.primary.main,
//                           }
//                         }
//                       }}
//                     >
//                       {yearOptions.map((year) => (
//                         <MenuItem key={year} value={year}>
//                           {year}
//                         </MenuItem>
//                       ))}
//                     </TextField>
//                   </Grid>
//                 </Grid>
//               </Paper>
//             </Grid>
            
//             {/* Current Selection Display */}
//             <Grid item xs={12}>
//               <Paper sx={{
//                 p: 2,
//                 background: colors.secondary.gradient,
//                 borderRadius: 2,
//                 color: 'white',
//                 textAlign: 'center'
//               }}>
//                 <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                   Selected: {monthNames[selectedMonth]} {selectedYear}
//                 </Typography>
//               </Paper>
//             </Grid>
//           </Grid>
//         </LocalizationProvider>
//       </DialogContent>
      
//       <DialogActions sx={{ 
//         p: 3, 
//         background: 'rgba(26, 35, 126, 0.02)',
//         borderTop: '1px solid rgba(26, 35, 126, 0.1)' 
//       }}>
//         <Button 
//           onClick={onClose}
//           sx={{ 
//             color: colors.primary.main,
//             fontWeight: 600 
//           }}
//         >
//           Cancel
//         </Button>
//         <Button 
//           onClick={handleApply}
//           variant="contained"
//           sx={{
//             background: colors.primary.gradient,
//             borderRadius: 2,
//             px: 3,
//             fontWeight: 600,
//             '&:hover': {
//               background: colors.primary.main,
//             }
//           }}
//         >
//           Go to Date
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// // Main Component
// export default function TamilCalendar() {
//   const [months, setMonths] = useState([]);
//   const [festivals, setFestivals] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
//   const [modal, setModal] = useState({ open: false, data: {} });
//   const [dateNavDialog, setDateNavDialog] = useState(false);
//   const [tabIndex, setTabIndex] = useState(0);
  
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isTablet = useMediaQuery(theme.breakpoints.down('md'));

//   useEffect(() => {
//     // Load months data
//     const savedMonths = localStorage.getItem("tamilMonthsData");
//     if (savedMonths) setMonths(JSON.parse(savedMonths));
//     else setMonths(Array.from({ length: 12 }, (_, i) => ({ month: i + 1, daysInMonth: 31, tamilStartDay: 1 })));
    
//     // Load festivals data
//     const savedFestivals = localStorage.getItem("tamilFestivalsData");
//     if (savedFestivals) {
//       const loadedFestivals = JSON.parse(savedFestivals);
//       const currentYear = new Date().getFullYear();
//       const updatedFestivals = loadedFestivals.map(fest => ({
//         ...fest,
//         year: fest.year || currentYear
//       }));
//       setFestivals(updatedFestivals);
//     } else {
//       setFestivals(defaultFestivals);
//     }
//   }, []);
  
//   // Auto-save festivals when they change
//   useEffect(() => {
//     if (festivals.length > 0) {
//       localStorage.setItem("tamilFestivalsData", JSON.stringify(festivals));
//     }
//   }, [festivals]);

//   // Enhanced date click handler
//   const handleDateClick = (date, tamilDay, tamilMonth) => {
//     setSelectedDate(date);
    
//     const dateFestivals = festivals.filter(
//       f => f.month === (date.getMonth() + 1) && f.day === date.getDate()
//     );
    
//     const modalData = {
//       englishDate: format(date, "dd"),
//       englishMonth: format(date, "MMMM"),
//       englishYear: format(date, "yyyy"),
//       dayOfWeek: format(date, "EEEE"),
//       tamilDay, 
//       tamilMonth,
//       festival: dateFestivals.length > 0 ? dateFestivals[0].name : null,
//       festivalColor: dateFestivals.length > 0 ? dateFestivals[0].color : null,
//       festivals: dateFestivals,
//       festivalCount: dateFestivals.length,
//       hasMultipleFestivals: dateFestivals.length > 1
//     };
    
//     setModal({
//       open: true,
//       data: modalData
//     });
//   };

//   // Navigation handlers
//   const nextMonth = () => {
//     setCurrentMonth(addMonths(currentMonth, 1));
//   };

//   const prevMonth = () => {
//     setCurrentMonth(subMonths(currentMonth, 1));
//   };
  
//   const resetToToday = () => {
//     const today = new Date();
//     setCurrentMonth(today);
//     setSelectedDate(today);
//   };

//   const handleDateNavigation = (newDate) => {
//     setCurrentMonth(newDate);
//   };

//   const handleCloseModal = () => {
//     setModal({ ...modal, open: false });
//   };

//   // Save/Export handlers (keeping existing functionality)
//   const handleSaveMonths = () => {
//     localStorage.setItem("tamilMonthsData", JSON.stringify(months));
//     setSnackbar({ open: true, message: "Calendar settings saved successfully", severity: "success" });
//   };
  
//   const handleSaveFestivals = () => {
//     localStorage.setItem("tamilFestivalsData", JSON.stringify(festivals));
//     setSnackbar({ open: true, message: "Festival settings saved successfully", severity: "success" });
//   };
  
//   const handleExportMonths = () => {
//     const blob = new Blob([JSON.stringify(months, null, 2)], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a"); 
//     a.href = url; 
//     a.download = "tamil_months_data.json"; 
//     a.click();
//     URL.revokeObjectURL(url);
//     setSnackbar({ open: true, message: "Month settings exported to file", severity: "info" });
//   };
  
//   const handleExportFestivals = () => {
//     const blob = new Blob([JSON.stringify(festivals, null, 2)], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a"); 
//     a.href = url; 
//     a.download = "tamil_festivals_data.json"; 
//     a.click();
//     URL.revokeObjectURL(url);
//     setSnackbar({ open: true, message: "Festival data exported to file", severity: "info" });
//   };
  
//   const handleImportMonths = (e) => {
//     const file = e.target.files[0]; 
//     if (!file) return;
    
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       try {
//         const data = JSON.parse(event.target.result);
//         setMonths(data);
//         localStorage.setItem("tamilMonthsData", JSON.stringify(data));
//         setSnackbar({ open: true, message: "Month settings imported successfully", severity: "success" });
//       } catch (error) {
//         setSnackbar({ open: true, message: "Invalid file format", severity: "error" });
//       }
//     };
//     reader.readAsText(file);
//   };
  
//   const handleImportFestivals = (e) => {
//     const file = e.target.files[0]; 
//     if (!file) return;
    
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       try {
//         const data = JSON.parse(event.target.result);
//         const currentYear = new Date().getFullYear();
//         const updatedData = data.map(fest => ({
//           ...fest,
//           year: fest.year || currentYear
//         }));
//         setFestivals(updatedData);
//         localStorage.setItem("tamilFestivalsData", JSON.stringify(updatedData));
//         setSnackbar({ open: true, message: "Festival data imported successfully", severity: "success" });
//       } catch (error) {
//         setSnackbar({ open: true, message: "Invalid file format", severity: "error" });
//       }
//     };
//     reader.readAsText(file);
//   };

//   const handleExportMonthsBin = () => {
//     const lines = months.map((month, index) => 
//       `${month.daysInMonth.toString().padStart(2, '0')},${month.tamilStartDay.toString().padStart(2, '0')}`
//     );
//     const fileContent = lines.join('\n');
    
//     const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
//     const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `tamil_months_bin_${timestamp}.txt`;
//     a.click();
//     URL.revokeObjectURL(url);
//     setSnackbar({ open: true, message: "Month settings exported as binary", severity: "info" });
//   };

//   const handleExportFestivalsBin = () => {
//     const currentYear = new Date().getFullYear();
//     const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0);
//     const daysInYear = isLeapYear ? 366 : 365;
    
//     const festivalMap = new Map();
//     const serialNumberMap = new Map();
//     let nextSerialNumber = 1;
    
//     festivals.forEach(festival => {
//       const date = new Date(currentYear, festival.month - 1, festival.day);
//       const startOfYear = new Date(currentYear, 0, 1);
//       const dayOfYear = Math.ceil((date - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
      
//       if (dayOfYear >= 1 && dayOfYear <= daysInYear) {
//         if (!serialNumberMap.has(festival.name)) {
//           const paddedNumber = nextSerialNumber.toString().padStart(2, '0');
//           serialNumberMap.set(festival.name, paddedNumber);
//           nextSerialNumber++;
//         }
        
//         const serialNumber = serialNumberMap.get(festival.name);
        
//         if (festivalMap.has(dayOfYear)) {
//           festivalMap.set(dayOfYear, `${festivalMap.get(dayOfYear)},${serialNumber}`);
//         } else {
//           festivalMap.set(dayOfYear, serialNumber);
//         }
//       }
//     });
    
//     const lines = [];
//     for (let i = 1; i <= daysInYear; i++) {
//       lines.push(festivalMap.has(i) ? festivalMap.get(i) : '00');
//     }
    
//     const fileContent = lines.join('\n');
    
//     const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
//     const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `tamil_festivals_bin_${timestamp}.txt`;
//     a.click();
//     URL.revokeObjectURL(url);
//     setSnackbar({ open: true, message: "Festival data exported as binary", severity: "info" });
//   };

//   return (
//     <Box sx={{ 
//       minHeight: '100vh',
//       background: colors.background.main,
//       position: 'relative'
//     }}>
//       {/* Professional AppBar */}
//       <AppBar 
//         position="fixed" 
//         elevation={0} 
//         sx={{ 
//           background: colors.primary.gradient,
//           backdropFilter: 'blur(20px)',
//           borderBottom: '1px solid rgba(255,255,255,0.1)',
//           boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
//         }}
//       >
//         <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
//           <MenuIcon sx={{ mr: 2 }} />
//           <Typography variant="h6" sx={{ 
//             flexGrow: 1, 
//             fontWeight: 700,
//             fontSize: { xs: '1.1rem', sm: '1.25rem' }
//           }}>
//             Tamil Calendar
//           </Typography>
          
//           <Tabs 
//             value={tabIndex} 
//             onChange={(e, newIndex) => setTabIndex(newIndex)} 
//             textColor="inherit" 
//             indicatorColor="secondary"
//             sx={{
//               '& .MuiTab-root': {
//                 fontWeight: 600,
//                 textTransform: 'none',
//                 fontSize: { xs: '0.875rem', sm: '1rem' },
//                 '&.Mui-selected': {
//                   color: '#ffffff'
//                 }
//               },
//               '& .MuiTabs-indicator': {
//                 backgroundColor: '#ffffff',
//                 height: 3,
//                 borderRadius: '1.5px'
//               }
//             }}
//           >
//             <Tab 
//               icon={<CalendarMonthIcon />} 
//               label={isMobile ? null : "Calendar"} 
//               iconPosition="start"
//             />
//             <Tab 
//               icon={<SettingsIcon />} 
//               label={isMobile ? null : "Admin"} 
//               iconPosition="start"
//             />
//           </Tabs>
//         </Toolbar>
//       </AppBar>

//       <Container maxWidth="xl" sx={{ pt: { xs: 8, sm: 10 }, pb: 4 }}>
//         {tabIndex === 0 && (
//           <Card 
//             elevation={0}
//             sx={{ 
//               borderRadius: 4,
//               overflow: "hidden",
//               background: colors.background.card,
//               backdropFilter: 'blur(20px)',
//               border: '1px solid rgba(255,255,255,0.2)',
//               boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
//             }}
//             className="calendar-wrapper"
//           >
//             {/* Enhanced Calendar Header */}
//             <Paper elevation={0} sx={{ 
//               p: { xs: 2, sm: 3 }, 
//               display: "flex", 
//               alignItems: "center", 
//               justifyContent: "space-between",
//               background: colors.primary.gradient,
//               color: 'white',
//               flexWrap: 'wrap',
//               gap: 2
//             }}>
//               <Stack direction="row" alignItems="center" spacing={2}>
//                 <CalendarMonthIcon sx={{ fontSize: '2rem' }} />
//                 <Box>
//                   <Typography variant="h5" sx={{ 
//                     fontWeight: 700,
//                     fontSize: { xs: '1.5rem', sm: '1.75rem' }
//                   }}>
//                     {format(currentMonth, "MMMM yyyy")}
//                   </Typography>
//                   <Typography variant="body2" sx={{ 
//                     opacity: 0.9,
//                     fontSize: '0.875rem'
//                   }}>
//                     {format(currentMonth, "EEEE")} • Today: {format(new Date(), "MMM dd")}
//                   </Typography>
//                 </Box>
//               </Stack>
              
//               <Stack direction="row" spacing={1} alignItems="center">
//                 {/* Month Navigation */}
//                 <IconButton 
//                   onClick={prevMonth} 
//                   sx={{ 
//                     color: 'white',
//                     bgcolor: 'rgba(255,255,255,0.1)',
//                     '&:hover': { 
//                       bgcolor: 'rgba(255,255,255,0.2)',
//                       transform: 'scale(1.05)'
//                     },
//                     transition: 'all 0.2s ease'
//                   }}
//                 >
//                   <NavigateBeforeIcon />
//                 </IconButton>
                
//                 {/* Date Navigation Button */}
//                 <Button 
//                   variant="outlined"
//                   onClick={() => setDateNavDialog(true)}
//                   startIcon={<DateRangeIcon />}
//                   sx={{ 
//                     color: 'white',
//                     borderColor: 'rgba(255,255,255,0.3)',
//                     bgcolor: 'rgba(255,255,255,0.1)',
//                     '&:hover': {
//                       borderColor: 'white',
//                       bgcolor: 'rgba(255,255,255,0.2)'
//                     },
//                     fontWeight: 600,
//                     textTransform: 'none',
//                     px: { xs: 2, sm: 3 }
//                   }}
//                 >
//                   {isMobile ? 'Go to' : 'Go to Date'}
//                 </Button>
                
//                 {/* Today Button */}
//                 <Button 
//                   variant="outlined"
//                   onClick={resetToToday}
//                   startIcon={<TodayIcon />}
//                   sx={{ 
//                     color: 'white',
//                     borderColor: 'rgba(255,255,255,0.3)',
//                     bgcolor: 'rgba(255,255,255,0.1)',
//                     '&:hover': {
//                       borderColor: 'white',
//                       bgcolor: 'rgba(255,255,255,0.2)'
//                     },
//                     fontWeight: 600,
//                     textTransform: 'none',
//                     px: { xs: 2, sm: 3 }
//                   }}
//                 >
//                   {isMobile ? 'Today' : 'Today'}
//                 </Button>
                
//                 <IconButton 
//                   onClick={nextMonth} 
//                   sx={{ 
//                     color: 'white',
//                     bgcolor: 'rgba(255,255,255,0.1)',
//                     '&:hover': { 
//                       bgcolor: 'rgba(255,255,255,0.2)',
//                       transform: 'scale(1.05)'
//                     },
//                     transition: 'all 0.2s ease'
//                   }}
//                 >
//                   <NavigateNextIcon />
//                 </IconButton>
//               </Stack>
//             </Paper>
            
//             <SimpleCalendar 
//               currentMonth={currentMonth}
//               selectedDate={selectedDate}
//               months={months}
//               festivals={festivals}
//               onDateClick={handleDateClick}
//             />
//           </Card>
//         )}

//         {tabIndex === 1 && (
//           <AdminTable
//             className="admin-panel"
//             months={months}
//             festivals={festivals}
//             onMonthChange={(i, f, v) => {
//               setMonths(prev => {
//                 const copy = [...prev];
//                 copy[i][f] = v;
//                 return copy;
//               });
//             }}
//             onFestivalChange={setFestivals}
//             onSaveMonths={handleSaveMonths}
//             onSaveFestivals={handleSaveFestivals}
//             onExportMonths={handleExportMonths}
//             onExportFestivals={handleExportFestivals}
//             onImportMonths={handleImportMonths}
//             onImportFestivals={handleImportFestivals}
//             onExportMonthsBin={handleExportMonthsBin}
//             onExportFestivalsBin={handleExportFestivalsBin}
//           />
//         )}

//         {/* Date Navigation Dialog */}
//         <DateNavigationDialog
//           open={dateNavDialog}
//           currentDate={currentMonth}
//           onClose={() => setDateNavDialog(false)}
//           onDateChange={handleDateNavigation}
//         />

//         <DateDetailsModal 
//           className="date-details-modal"
//           open={modal.open}
//           data={modal.data}
//           festivals={festivals}
//           onClose={handleCloseModal}
//         />

//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={6000}
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//         >
//           <Alert 
//             severity={snackbar.severity}
//             variant="filled"
//             sx={{ 
//               width: '100%',
//               borderRadius: 3,
//               fontWeight: 600,
//               fontSize: '0.95rem',
//               boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
//             }}
//             onClose={() => setSnackbar({ ...snackbar, open: false })}
//           >
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </Container>

//       {/* Floating Date Picker for Quick Access */}
//       <Zoom in={tabIndex === 0}>
//         <Fab
//           color="primary"
//           sx={{
//             position: 'fixed',
//             bottom: { xs: 16, md: 32 },
//             right: { xs: 16, md: 32 },
//             background: colors.secondary.gradient,
//             '&:hover': {
//               background: colors.secondary.main,
//               transform: 'scale(1.1)'
//             },
//             transition: 'all 0.3s ease',
//             boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
//             zIndex: 1000
//           }}
//           onClick={() => setDateNavDialog(true)}
//         >
//           <DateRangeIcon />
//         </Fab>
//       </Zoom>
//     </Box>
//   );
// }


// import React, { useState, useEffect } from "react";
// import {
//   Container, Typography, Snackbar, Alert, AppBar, Toolbar, Tabs, Tab,
//   Box, IconButton, Card, useTheme, useMediaQuery, Button
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import SettingsIcon from "@mui/icons-material/Settings";
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import { format, addMonths, subMonths } from "date-fns";

// // Import components
// import SimpleCalendar from "./SimpleCalendar";
// import AdminTable from "./AdminTable";
// import DateDetailsModal from "./DateDetailsModal";

// // Import constants
// import { defaultFestivals } from "./constants";

// // Main Component
// export default function TamilCalendar() {
//   const [months, setMonths] = useState([]);
//   const [festivals, setFestivals] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
//   const [modal, setModal] = useState({ open: false, data: {} });
//   const [tabIndex, setTabIndex] = useState(0);
  
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   useEffect(() => {
//     // Load months data
//     const savedMonths = localStorage.getItem("tamilMonthsData");
//     if (savedMonths) setMonths(JSON.parse(savedMonths));
//     else setMonths(Array.from({ length: 12 }, (_, i) => ({ month: i + 1, daysInMonth: 31, tamilStartDay: 1 })));
    
//     // Load festivals data
//     const savedFestivals = localStorage.getItem("tamilFestivalsData");
//     if (savedFestivals) {
//       const loadedFestivals = JSON.parse(savedFestivals);
//       // Ensure all festivals have a year property (defaulting to current year)
//       const currentYear = new Date().getFullYear();
//       const updatedFestivals = loadedFestivals.map(fest => ({
//         ...fest,
//         year: fest.year || currentYear
//       }));
//       setFestivals(updatedFestivals);
//     } else {
//       setFestivals(defaultFestivals);
//     }
//   }, []);
  
//   // Auto-save festivals when they change
//   useEffect(() => {
//     if (festivals.length > 0) {
//       localStorage.setItem("tamilFestivalsData", JSON.stringify(festivals));
      
//       // Auto-export festivals when they change
//       const autoExportFestivals = () => {
//         const blob = new Blob([JSON.stringify(festivals, null, 2)], { type: "text/plain" });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement("a"); 
//         a.href = url; 
//         a.download = "tamil_festivals_auto_" + new Date().toISOString().slice(0,10) + ".json"; 
//         a.click();
//         URL.revokeObjectURL(url);
//       };
      
//       // Uncomment the following line if you want auto-export on each change
//       // autoExportFestivals();
//     }
//   }, [festivals]);

//   // Enhanced date click handler to find ALL festivals for the selected date
//   const handleDateClick = (date, tamilDay, tamilMonth) => {
//     setSelectedDate(date);
    
//     // Find ALL festivals for this date (not just the first one)
//     const dateFestivals = festivals.filter(
//       f => f.month === (date.getMonth() + 1) && f.day === date.getDate()
//     );
    
//     // Create enhanced data object with all festival information
//     const modalData = {
//       englishDate: format(date, "dd"),
//       englishMonth: format(date, "MMMM"),
//       englishYear: format(date, "yyyy"),
//       dayOfWeek: format(date, "EEEE"),
//       tamilDay, 
//       tamilMonth,
//       // Legacy single festival properties for backward compatibility
//       festival: dateFestivals.length > 0 ? dateFestivals[0].name : null,
//       festivalColor: dateFestivals.length > 0 ? dateFestivals[0].color : null,
//       // New properties for multiple festivals
//       festivals: dateFestivals,
//       festivalCount: dateFestivals.length,
//       hasMultipleFestivals: dateFestivals.length > 1
//     };
    
//     setModal({
//       open: true,
//       data: modalData
//     });
//   };

//   const handleSaveMonths = () => {
//     localStorage.setItem("tamilMonthsData", JSON.stringify(months));
//     setSnackbar({ open: true, message: "Calendar settings saved successfully", severity: "success" });
//   };
  
//   const handleSaveFestivals = () => {
//     localStorage.setItem("tamilFestivalsData", JSON.stringify(festivals));
//     setSnackbar({ open: true, message: "Festival settings saved successfully", severity: "success" });
//   };
  
//   const handleExportMonths = () => {
//     const blob = new Blob([JSON.stringify(months, null, 2)], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a"); 
//     a.href = url; 
//     a.download = "tamil_months_data.json"; 
//     a.click();
//     URL.revokeObjectURL(url);
//     setSnackbar({ open: true, message: "Month settings exported to file", severity: "info" });
//   };
  
//   const handleExportFestivals = () => {
//     const blob = new Blob([JSON.stringify(festivals, null, 2)], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a"); 
//     a.href = url; 
//     a.download = "tamil_festivals_data.json"; 
//     a.click();
//     URL.revokeObjectURL(url);
//     setSnackbar({ open: true, message: "Festival data exported to file", severity: "info" });
//   };
  
//   const handleImportMonths = (e) => {
//     const file = e.target.files[0]; 
//     if (!file) return;
    
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       try {
//         const data = JSON.parse(event.target.result);
//         setMonths(data);
//         localStorage.setItem("tamilMonthsData", JSON.stringify(data));
//         setSnackbar({ open: true, message: "Month settings imported successfully", severity: "success" });
//       } catch (error) {
//         setSnackbar({ open: true, message: "Invalid file format", severity: "error" });
//       }
//     };
//     reader.readAsText(file);
//   };
  
//   const handleImportFestivals = (e) => {
//     const file = e.target.files[0]; 
//     if (!file) return;
    
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       try {
//         const data = JSON.parse(event.target.result);
//         const currentYear = new Date().getFullYear();
//         const updatedData = data.map(fest => ({
//           ...fest,
//           year: fest.year || currentYear
//         }));
//         setFestivals(updatedData);
//         localStorage.setItem("tamilFestivalsData", JSON.stringify(updatedData));
//         setSnackbar({ open: true, message: "Festival data imported successfully", severity: "success" });
//       } catch (error) {
//         setSnackbar({ open: true, message: "Invalid file format", severity: "error" });
//       }
//     };
//     reader.readAsText(file);
//   };

//   const handleExportMonthsBin = () => {
//     // Enhanced binary format for months
//     const lines = months.map((month, index) => 
//       `${month.daysInMonth.toString().padStart(2, '0')},${month.tamilStartDay.toString().padStart(2, '0')}`
//     );
//     const fileContent = lines.join('\n');
    
//     const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
//     const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `tamil_months_bin_${timestamp}.txt`;
//     a.click();
//     URL.revokeObjectURL(url);
//     setSnackbar({ open: true, message: "Month settings exported as binary", severity: "info" });
//   };

//   const handleExportFestivalsBin = () => {
//     // Enhanced binary format for festivals with day-of-year mapping
//     const currentYear = new Date().getFullYear();
//     const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0);
//     const daysInYear = isLeapYear ? 366 : 365;
    
//     // Create festival map by day of year
//     const festivalMap = new Map();
//     const serialNumberMap = new Map();
//     let nextSerialNumber = 1;
    
//     festivals.forEach(festival => {
//       const date = new Date(currentYear, festival.month - 1, festival.day);
//       const startOfYear = new Date(currentYear, 0, 1);
//       const dayOfYear = Math.ceil((date - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
      
//       if (dayOfYear >= 1 && dayOfYear <= daysInYear) {
//         if (!serialNumberMap.has(festival.name)) {
//           const paddedNumber = nextSerialNumber.toString().padStart(2, '0');
//           serialNumberMap.set(festival.name, paddedNumber);
//           nextSerialNumber++;
//         }
        
//         const serialNumber = serialNumberMap.get(festival.name);
        
//         if (festivalMap.has(dayOfYear)) {
//           festivalMap.set(dayOfYear, `${festivalMap.get(dayOfYear)},${serialNumber}`);
//         } else {
//           festivalMap.set(dayOfYear, serialNumber);
//         }
//       }
//     });
    
//     // Generate content for all days
//     const lines = [];
//     for (let i = 1; i <= daysInYear; i++) {
//       lines.push(festivalMap.has(i) ? festivalMap.get(i) : '00');
//     }
    
//     const fileContent = lines.join('\n');
    
//     const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
//     const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `tamil_festivals_bin_${timestamp}.txt`;
//     a.click();
//     URL.revokeObjectURL(url);
//     setSnackbar({ open: true, message: "Festival data exported as binary", severity: "info" });
//   };

//   const nextMonth = () => {
//     setCurrentMonth(addMonths(currentMonth, 1));
//   };

//   const prevMonth = () => {
//     setCurrentMonth(subMonths(currentMonth, 1));
//   };
  
//   const resetToToday = () => {
//     setCurrentMonth(new Date());
//     setSelectedDate(new Date());
//   };

//   const handleCloseModal = () => {
//     setModal({ ...modal, open: false });
//   };

//   return (
//     <>
//       <AppBar 
//         position="fixed" 
//         elevation={0} 
//         sx={{ 
//           background: "linear-gradient(45deg, #673ab7, #9c27b0)",
//           backdropFilter: 'blur(10px)'
//         }}
//       >
//         <Toolbar>
//           <MenuIcon sx={{ mr: 2 }} />
//           <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
//             Tamil Calendar
//           </Typography>
//           <Tabs 
//             value={tabIndex} 
//             onChange={(e, newIndex) => setTabIndex(newIndex)} 
//             textColor="inherit" 
//             indicatorColor="secondary"
//             sx={{
//               '& .MuiTab-root': {
//                 fontWeight: 500
//               }
//             }}
//           >
//             <Tab icon={<CalendarMonthIcon />} label={isMobile ? null : "Calendar"} />
//             <Tab icon={<SettingsIcon />} label={isMobile ? null : "Admin"} />
//           </Tabs>
//         </Toolbar>
//       </AppBar>

//       <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
//         {tabIndex === 0 && (
//           <Card 
//             elevation={3} 
//             sx={{ 
//               borderRadius: 3,
//               overflow: "hidden",
//               background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
//             }}
//             className="calendar-wrapper"
//           >
//             <Box sx={{ 
//               p: 2, 
//               display: "flex", 
//               alignItems: "center", 
//               justifyContent: "space-between",
//               borderBottom: "1px solid rgba(0,0,0,0.08)",
//               bgcolor: "rgba(103, 58, 183, 0.04)",
//               backdropFilter: 'blur(10px)'
//             }}
//             className="calendar-header"
//             >
//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <CalendarMonthIcon sx={{ mr: 1, color: "#673ab7" }} />
//                 <Typography variant="h6" sx={{ fontWeight: 600, color: "#673ab7" }}>
//                   {format(currentMonth, "MMMM yyyy")}
//                 </Typography>
//               </Box>
              
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <IconButton 
//                   onClick={prevMonth} 
//                   size="small" 
//                   sx={{ 
//                     color: "#673ab7",
//                     '&:hover': { bgcolor: 'rgba(103, 58, 183, 0.1)' }
//                   }}
//                 >
//                   <ArrowBackIosNewIcon fontSize="small" />
//                 </IconButton>
                
//                 <Button 
//                   variant="outlined" 
//                   size="small"
//                   onClick={resetToToday}
//                   sx={{ 
//                     minWidth: 60, 
//                     lineHeight: 1,
//                     borderColor: "#673ab7",
//                     color: "#673ab7",
//                     '&:hover': {
//                       borderColor: "#673ab7",
//                       bgcolor: "rgba(103, 58, 183, 0.1)"
//                     }
//                   }}
//                 >
//                   Today
//                 </Button>
                
//                 <IconButton 
//                   onClick={nextMonth} 
//                   size="small" 
//                   sx={{ 
//                     color: "#673ab7",
//                     '&:hover': { bgcolor: 'rgba(103, 58, 183, 0.1)' }
//                   }}
//                 >
//                   <ArrowForwardIosIcon fontSize="small" />
//                 </IconButton>
//               </Box>
//             </Box>
            
//             <SimpleCalendar 
//               currentMonth={currentMonth}
//               selectedDate={selectedDate}
//               months={months}
//               festivals={festivals}
//               onDateClick={handleDateClick}
//             />
//           </Card>
//         )}

//         {tabIndex === 1 && (
//           <AdminTable
//             className="admin-panel"
//             months={months}
//             festivals={festivals}
//             onMonthChange={(i, f, v) => {
//               setMonths(prev => {
//                 const copy = [...prev];
//                 copy[i][f] = v;
//                 return copy;
//               });
//             }}
//             onFestivalChange={setFestivals}
//             onSaveMonths={handleSaveMonths}
//             onSaveFestivals={handleSaveFestivals}
//             onExportMonths={handleExportMonths}
//             onExportFestivals={handleExportFestivals}
//             onImportMonths={handleImportMonths}
//             onImportFestivals={handleImportFestivals}
//             onExportMonthsBin={handleExportMonthsBin}
//             onExportFestivalsBin={handleExportFestivalsBin}
//           />
//         )}

//         <DateDetailsModal 
//           className="date-details-modal"
//           open={modal.open}
//           data={modal.data}
//           festivals={festivals}
//           onClose={handleCloseModal}
//         />

//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={6000}
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//         >
//           <Alert 
//             severity={snackbar.severity}
//             variant="filled"
//             sx={{ 
//               width: '100%',
//               borderRadius: 2,
//               fontWeight: 500
//             }}
//             onClose={() => setSnackbar({ ...snackbar, open: false })}
//           >
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </Container>
//     </>
//   );
// }


// import React, { useState, useEffect } from "react";
// import {
//   Container, Typography, Snackbar, Alert, AppBar, Toolbar, Tabs, Tab,
//   Box, IconButton, Card, useTheme, useMediaQuery, Button
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import SettingsIcon from "@mui/icons-material/Settings";
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import { format, addMonths, subMonths } from "date-fns";

// // Import components
// import SimpleCalendar from "./SimpleCalendar";
// import AdminTable from "./AdminTable";
// import DateDetailsModal from "./DateDetailsModal";

// // Import constants
// import { defaultFestivals } from "./constants";

// // Main Component
// export default function TamilCalendar() {
//   const [months, setMonths] = useState([]);
//   const [festivals, setFestivals] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
//   const [modal, setModal] = useState({ open: false, data: {} });
//   const [tabIndex, setTabIndex] = useState(0);
  
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
// // In the main component, modify where festivals are saved
// useEffect(() => {
//   // Load festivals data
//   const savedFestivals = localStorage.getItem("tamilFestivalsData");
//   if (savedFestivals) {
//     const loadedFestivals = JSON.parse(savedFestivals);
//     // Ensure all festivals have a year property (defaulting to current year)
//     const currentYear = new Date().getFullYear();
//     const updatedFestivals = loadedFestivals.map(fest => ({
//       ...fest,
//       year: fest.year || currentYear
//     }));
//     setFestivals(updatedFestivals);
//   }
//   else setFestivals(defaultFestivals);
// }, []);

//   useEffect(() => {
//     // Load months data
//     const savedMonths = localStorage.getItem("tamilMonthsData");
//     if (savedMonths) setMonths(JSON.parse(savedMonths));
//     else setMonths(Array.from({ length: 12 }, (_, i) => ({ month: i + 1, daysInMonth: 31, tamilStartDay: 1 })));
    
//     // Load festivals data
//     const savedFestivals = localStorage.getItem("tamilFestivalsData");
//     if (savedFestivals) setFestivals(JSON.parse(savedFestivals));
//     else setFestivals(defaultFestivals);
//   }, []);
  
//   // Auto-save festivals when they change
//   useEffect(() => {
//     if (festivals.length > 0) {
//       localStorage.setItem("tamilFestivalsData", JSON.stringify(festivals));
      
//       // Auto-export festivals when they change
//       const autoExportFestivals = () => {
//         const blob = new Blob([JSON.stringify(festivals, null, 2)], { type: "text/plain" });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement("a"); 
//         a.href = url; 
//         a.download = "tamil_festivals_auto_" + new Date().toISOString().slice(0,10) + ".json"; 
//         a.click();
//         URL.revokeObjectURL(url);
//       };
      
//       // Uncomment the following line if you want auto-export on each change
//       // autoExportFestivals();
//     }
//   }, [festivals]);

//   const handleDateClick = (date, tamilDay, tamilMonth) => {
//     setSelectedDate(date);
    
//     // Find festival for this date
//     const festival = festivals.find(
//       f => f.month === (date.getMonth() + 1) && f.day === date.getDate()
//     );
    
//     setModal({
//       open: true,
//       data: {
//         englishDate: format(date, "dd"),
//         englishMonth: format(date, "MMMM"),
//         englishYear: format(date, "yyyy"),
//         dayOfWeek: format(date, "EEEE"),
//         tamilDay, 
//         tamilMonth,
//         festival: festival?.name,
//         festivalColor: festival?.color
//       }
//     });
//   };

//   const handleSaveMonths = () => {
//     localStorage.setItem("tamilMonthsData", JSON.stringify(months));
//     setSnackbar({ open: true, message: "Calendar settings saved successfully", severity: "success" });
//   };
  
//   const handleSaveFestivals = () => {
//     localStorage.setItem("tamilFestivalsData", JSON.stringify(festivals));
//     setSnackbar({ open: true, message: "Festival settings saved successfully", severity: "success" });
//   };
  
//   const handleExportMonths = () => {
//     const blob = new Blob([JSON.stringify(months, null, 2)], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a"); 
//     a.href = url; 
//     a.download = "tamil_months_data.json"; 
//     a.click();
//     URL.revokeObjectURL(url);
//     setSnackbar({ open: true, message: "Month settings exported to file", severity: "info" });
//   };
  
//   const handleExportFestivals = () => {
//     const blob = new Blob([JSON.stringify(festivals, null, 2)], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a"); 
//     a.href = url; 
//     a.download = "tamil_festivals_data.json"; 
//     a.click();
//     URL.revokeObjectURL(url);
//     setSnackbar({ open: true, message: "Festival data exported to file", severity: "info" });
//   };
  
//   const handleImportMonths = (e) => {
//     const file = e.target.files[0]; 
//     if (!file) return;
    
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       try {
//         const data = JSON.parse(event.target.result);
//         setMonths(data);
//         localStorage.setItem("tamilMonthsData", JSON.stringify(data));
//         setSnackbar({ open: true, message: "Month settings imported successfully", severity: "success" });
//       } catch (error) {
//         setSnackbar({ open: true, message: "Invalid file format", severity: "error" });
//       }
//     };
//     reader.readAsText(file);
//   };
  
//   const handleImportFestivals = (e) => {
//     const file = e.target.files[0]; 
//     if (!file) return;
    
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       try {
//         const data = JSON.parse(event.target.result);
//         setFestivals(data);
//         localStorage.setItem("tamilFestivalsData", JSON.stringify(data));
//         setSnackbar({ open: true, message: "Festival data imported successfully", severity: "success" });
//       } catch (error) {
//         setSnackbar({ open: true, message: "Invalid file format", severity: "error" });
//       }
//     };
//     reader.readAsText(file);
//   };

// const handleExportMonthsBin = () => {
//   // Export Months as binary format
//   const data = JSON.stringify(months);
//   const buffer = new TextEncoder().encode(data);
//   const blob = new Blob([buffer], { type: "application/octet-stream" });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = "tamil_months_data.bin";
//   a.click();
//   URL.revokeObjectURL(url);
//   setSnackbar({ open: true, message: "Month settings exported as binary", severity: "info" });
// };

// const handleExportFestivalsBin = () => {
//   // Export Festivals as binary format
//   const data = JSON.stringify(festivals);
//   const buffer = new TextEncoder().encode(data);
//   const blob = new Blob([buffer], { type: "application/octet-stream" });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = "tamil_festivals_data.bin";
//   a.click();
//   URL.revokeObjectURL(url);
//   setSnackbar({ open: true, message: "Festival data exported as binary", severity: "info" });
// };
//   const nextMonth = () => {
//     setCurrentMonth(addMonths(currentMonth, 1));
//   };

//   const prevMonth = () => {
//     setCurrentMonth(subMonths(currentMonth, 1));
//   };
  
//   const resetToToday = () => {
//     setCurrentMonth(new Date());
//     setSelectedDate(new Date());
//   };

//     const handleCloseModal = () => {
//     setModal({ ...modal, open: false });
//   };

//   return (
//     <>
//       <AppBar position="fixed" elevation={0} sx={{ background: "linear-gradient(45deg, #3f51b5, #7986cb)" }}>
//         <Toolbar>
//           <MenuIcon sx={{ mr: 2 }} />
//           <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 500 }}>
//             Tamil Calendar
//           </Typography>
//           <Tabs 
//             value={tabIndex} 
//             onChange={(e, newIndex) => setTabIndex(newIndex)} 
//             textColor="inherit" 
//             indicatorColor="secondary"
//           >
//             <Tab icon={<CalendarMonthIcon />} label={isMobile ? null : "Calendar"} />
//             <Tab icon={<SettingsIcon />} label={isMobile ? null : "Admin"} />
//           </Tabs>
//         </Toolbar>
//       </AppBar>

//       <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
//         {tabIndex === 0 && (
//           <Card elevation={2} sx={{ 
//             borderRadius: 2,
//             overflow: "hidden"
//           }}className="calendar-wrapper">
//             <Box sx={{ 
//               p: 2, 
//               display: "flex", 
//               alignItems: "center", 
//               justifyContent: "space-between",
//               borderBottom: "1px solid rgba(0,0,0,0.08)",
//               bgcolor: "rgba(63, 81, 181, 0.04)"
//             }}className="calendar-header">
//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <CalendarMonthIcon sx={{ mr: 1, color: "#3f51b5" }} />
//                 <Typography variant="h6" sx={{ fontWeight: 500 }}>
//                   {format(currentMonth, "MMMM yyyy")}
//                 </Typography>
//               </Box>
              
//               <Box>
//                 <IconButton onClick={prevMonth} size="small" sx={{ mr: 1 }}>
//                   <ArrowBackIosNewIcon fontSize="small" />
//                 </IconButton>
//                 <Button 
//                   variant="outlined" 
//                   size="small"
//                   onClick={resetToToday}
//                   sx={{ minWidth: 40, lineHeight: 1 }}
//                 >
//                   Today
//                 </Button>
//                 <IconButton onClick={nextMonth} size="small" sx={{ ml: 1 }}>
//                   <ArrowForwardIosIcon fontSize="small" />
//                 </IconButton>
//               </Box>
//             </Box>
            
//             <SimpleCalendar 
//               currentMonth={currentMonth}
//               selectedDate={selectedDate}
//               months={months}
//               festivals={festivals}
//               onDateClick={handleDateClick}
//             />
//           </Card>
//         )}

//         {tabIndex === 1 && (
//           <AdminTable
//            className="admin-panel"
//             months={months}
//             festivals={festivals}
//             onMonthChange={(i, f, v) => {
//               setMonths(prev => {
//                 const copy = [...prev];
//                 copy[i][f] = v;
//                 return copy;
//               });
//             }}
//             onFestivalChange={setFestivals}
//             onSaveMonths={handleSaveMonths}
//             onSaveFestivals={handleSaveFestivals}
//             onExportMonths={handleExportMonths}
//             onExportFestivals={handleExportFestivals}
//             onImportMonths={handleImportMonths}
//             onImportFestivals={handleImportFestivals}
//              onExportMonthsBin={handleExportMonthsBin}
//   onExportFestivalsBin={handleExportFestivalsBin}
//           />
//         )}

//         <DateDetailsModal 
//          className="date-details-modal"
//           open={modal.open}
//           data={modal.data}
//           onClose={handleCloseModal}
//         />

//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={4000}
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//         >
//           <Alert 
//             severity={snackbar.severity}
//             variant="filled"
//             sx={{ width: '100%' }}
//           >
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </Container>
//     </>
//   );
// }
