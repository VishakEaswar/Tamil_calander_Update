import React, { useState, useEffect, useMemo } from "react";
import {
  Paper, Typography, Box, Tabs, Tab, ButtonGroup, Button,
  useMediaQuery, useTheme, Grid, Stack, Tooltip, Chip,
  Alert, Snackbar, CircularProgress, Fab
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DateRangeIcon from "@mui/icons-material/DateRange";
import EventIcon from "@mui/icons-material/Event";
import SettingsIcon from "@mui/icons-material/Settings";
import DataObjectIcon from "@mui/icons-material/DataObject";
import RefreshIcon from "@mui/icons-material/Refresh";
import InfoIcon from "@mui/icons-material/Info";
import GetAppIcon from "@mui/icons-material/GetApp";
import MonthSettings from "./MonthSettings";
import FestivalSettings from "./FestivalSettings";

function AdminTable({ 
  months, 
  festivals, 
  onMonthChange, 
  onFestivalChange, 
  onSaveMonths,
  onSaveFestivals,
  onExportMonths,
  onExportFestivals,
  onImportMonths, 
  onImportFestivals
}) {
  const [adminTab, setAdminTab] = useState(() => {
    // Remember last active tab
    return parseInt(localStorage.getItem('adminActiveTab')) || 0;
  });
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportSnackbar, setExportSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery('(max-width:400px)');
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  
  // Save active tab to localStorage
  useEffect(() => {
    localStorage.setItem('adminActiveTab', adminTab.toString());
  }, [adminTab]);
  
  // Memoized festival serial map for better performance
  const festivalSerialMap = useMemo(() => {
    const serialMap = new Map();
    const uniqueFestivalNames = [...new Set(festivals.map(f => f.name))];
    
    uniqueFestivalNames.forEach((name, index) => {
      const paddedNumber = (index + 1).toString().padStart(2, '0');
      serialMap.set(name, paddedNumber);
    });
    
    return serialMap;
  }, [festivals]);
  
  // Enhanced festival bin export with better error handling
  const handleExportFestivalsBin = async () => {
    setIsExporting(true);
    try {
      const currentYear = new Date().getFullYear();
      const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0);
      const daysInYear = isLeapYear ? 366 : 365;
      
      // Create festival map by day of year
      const festivalMap = new Map();
      const serialNumberMap = new Map();
      let nextSerialNumber = 1;
      
      festivals.forEach(festival => {
        // Calculate day of year more accurately
        const date = new Date(currentYear, festival.month - 1, festival.day);
        const startOfYear = new Date(currentYear, 0, 1);
        const dayOfYear = Math.ceil((date - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
        
        // Validate day of year
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
      
      // Generate content for all days
      const lines = [];
      for (let i = 1; i <= daysInYear; i++) {
        lines.push(festivalMap.has(i) ? festivalMap.get(i) : '00');
      }
      
      const fileContent = lines.join('\n');
      
      // Create and download file with better timestamp
      const now = new Date();
      const timestamp = now.toISOString()
        .replace(/[-:.]/g, '')
        .substring(0, 14);
      
      const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tamil_festivals_bin_${timestamp}.txt`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExportSnackbar({
        open: true,
        message: `Festival bin exported successfully! (${festivals.length} festivals, ${daysInYear} days)`,
        severity: 'success'
      });
      
    } catch (error) {
      setExportSnackbar({
        open: true,
        message: `Export failed: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  // Enhanced month bin export
  const handleExportMonthsBin = async () => {
    setIsExporting(true);
    try {
      const lines = months.map((month, index) => 
        `${month.daysInMonth.toString().padStart(2, '0')},${month.tamilStartDay.toString().padStart(2, '0')}`
      );
      
      const fileContent = lines.join('\n');
      
      const now = new Date();
      const timestamp = now.toISOString()
        .replace(/[-:.]/g, '')
        .substring(0, 14);
      
      const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tamil_calendar_bin_${timestamp}.txt`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExportSnackbar({
        open: true,
        message: `Calendar bin exported successfully! (${months.length} months)`,
        severity: 'success'
      });
      
    } catch (error) {
      setExportSnackbar({
        open: true,
        message: `Export failed: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  // Quick actions for large screens
  const renderQuickActions = () => {
    if (!isLargeScreen) return null;
    
    return (
      <Box sx={{ 
        position: 'fixed', 
        right: 24, 
        bottom: 24, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 1,
        zIndex: 1000
      }}>
        <Tooltip title="Export All Data" placement="left">
          <Fab 
            color="secondary" 
            size="medium"
            onClick={() => {
              if (adminTab === 0) {
                onExportMonths();
              } else {
                onExportFestivals();
              }
            }}
          >
            <GetAppIcon />
          </Fab>
        </Tooltip>
        <Tooltip title="Save Current Tab" placement="left">
          <Fab 
            color="primary" 
            size="medium"
            onClick={adminTab === 0 ? onSaveMonths : onSaveFestivals}
          >
            <SaveIcon />
          </Fab>
        </Tooltip>
      </Box>
    );
  };
  
  // Enhanced responsive button group for Month Settings
  const renderMonthButtons = () => {
    if (isSmallMobile) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', mb: 2 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={isExporting ? <CircularProgress size={16} /> : <SaveIcon />}
            onClick={onSaveMonths}
            disabled={isExporting}
            sx={{ height: 44 }}
          >
            Save Calendar
          </Button>
          
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={onExportMonths}
                disabled={isExporting}
                size="small"
              >
                JSON
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={isExporting ? <CircularProgress size={16} /> : <DataObjectIcon />}
                onClick={handleExportMonthsBin}
                color="secondary"
                disabled={isExporting}
                size="small"
              >
                Bin
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                fullWidth
                component="label"
                variant="outlined"
                startIcon={<CloudDownloadIcon />}
                disabled={isExporting}
                size="small"
              >
                Import
                <input type="file" accept=".txt,.json" hidden onChange={onImportMonths} />
              </Button>
            </Grid>
          </Grid>
        </Box>
      );
    }
    
    if (isMobile) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={isExporting ? <CircularProgress size={16} /> : <SaveIcon />}
            onClick={onSaveMonths}
            disabled={isExporting}
          >
            Save Calendar Settings
          </Button>
          
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={onExportMonths}
                disabled={isExporting}
              >
                Export JSON
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                startIcon={isExporting ? <CircularProgress size={16} /> : <DataObjectIcon />}
                onClick={handleExportMonthsBin}
                disabled={isExporting}
              >
                Export Bin
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                fullWidth
                component="label"
                variant="outlined"
                startIcon={<CloudDownloadIcon />}
                disabled={isExporting}
              >
                Import
                <input type="file" accept=".txt,.json" hidden onChange={onImportMonths} />
              </Button>
            </Grid>
          </Grid>
        </Box>
      );
    }
    
    return (
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button 
          startIcon={isExporting ? <CircularProgress size={16} /> : <SaveIcon />}
          onClick={onSaveMonths}
          color="primary"
          variant="contained"
          disabled={isExporting}
          size={isTablet ? "small" : "medium"}
        >
          Save Calendar
        </Button>
        
        <ButtonGroup 
          variant="outlined" 
          size={isTablet ? "small" : "medium"}
          disabled={isExporting}
        >
          <Button 
            startIcon={<CloudUploadIcon />}
            onClick={onExportMonths}
          >
            Export JSON
          </Button>
          
          <Tooltip title="Export in specialized binary format (12 lines: days,startDay)">
            <Button
              startIcon={isExporting ? <CircularProgress size={16} /> : <DataObjectIcon />}
              onClick={handleExportMonthsBin}
              color="secondary"
            >
              Export Bin
            </Button>
          </Tooltip>
          
          <Button
            component="label"
            startIcon={<CloudDownloadIcon />}
          >
            Import
            <input type="file" accept=".txt,.json" hidden onChange={onImportMonths} />
          </Button>
        </ButtonGroup>
        
        <Chip 
          icon={<InfoIcon />}
          label={`${months.length} months`}
          size="small"
          variant="outlined"
        />
      </Box>
    );
  };

  // Enhanced responsive button group for Festival Settings
  const renderFestivalButtons = () => {
    if (isSmallMobile) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', mb: 2 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={isExporting ? <CircularProgress size={16} /> : <SaveIcon />}
            onClick={onSaveFestivals}
            disabled={isExporting}
            sx={{ height: 44 }}
          >
            Save Festivals
          </Button>
          
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={onExportFestivals}
                disabled={isExporting}
                size="small"
              >
                JSON
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={isExporting ? <CircularProgress size={16} /> : <DataObjectIcon />}
                onClick={handleExportFestivalsBin}
                color="secondary"
                disabled={isExporting}
                size="small"
              >
                Bin
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                fullWidth
                component="label"
                variant="outlined"
                startIcon={<CloudDownloadIcon />}
                disabled={isExporting}
                size="small"
              >
                Import
                <input type="file" accept=".txt,.json" hidden onChange={onImportFestivals} />
              </Button>
            </Grid>
          </Grid>
        </Box>
      );
    }
    
    if (isMobile) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={isExporting ? <CircularProgress size={16} /> : <SaveIcon />}
            onClick={onSaveFestivals}
            disabled={isExporting}
          >
            Save Festival Settings
          </Button>
          
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={onExportFestivals}
                disabled={isExporting}
              >
                Export JSON
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                startIcon={isExporting ? <CircularProgress size={16} /> : <DataObjectIcon />}
                onClick={handleExportFestivalsBin}
                disabled={isExporting}
              >
                Export Bin
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                fullWidth
                component="label"
                variant="outlined"
                startIcon={<CloudDownloadIcon />}
                disabled={isExporting}
              >
                Import
                <input type="file" accept=".txt,.json" hidden onChange={onImportFestivals} />
              </Button>
            </Grid>
          </Grid>
        </Box>
      );
    }
    
    return (
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button 
          startIcon={isExporting ? <CircularProgress size={16} /> : <SaveIcon />}
          onClick={onSaveFestivals}
          color="primary"
          variant="contained"
          disabled={isExporting}
          size={isTablet ? "small" : "medium"}
        >
          Save Festivals
        </Button>
        
        <ButtonGroup 
          variant="outlined" 
          size={isTablet ? "small" : "medium"}
          disabled={isExporting}
        >
          <Button 
            startIcon={<CloudUploadIcon />}
            onClick={onExportFestivals}
          >
            Export JSON
          </Button>
          
          <Tooltip title="Export in specialized binary format (366 lines: serial numbers by day)">
            <Button
              startIcon={isExporting ? <CircularProgress size={16} /> : <DataObjectIcon />}
              onClick={handleExportFestivalsBin}
              color="secondary"
            >
              Export Bin
            </Button>
          </Tooltip>
          
          <Button
            component="label"
            startIcon={<CloudDownloadIcon />}
          >
            Import
            <input type="file" accept=".txt,.json" hidden onChange={onImportFestivals} />
          </Button>
        </ButtonGroup>
        
        <Chip 
          icon={<EventIcon />}
          label={`${festivals.length} festivals`}
          size="small"
          variant="outlined"
          color="secondary"
        />
        
        <Chip 
          icon={<InfoIcon />}
          label={`${festivalSerialMap.size} unique`}
          size="small"
          variant="outlined"
        />
      </Box>
    );
  };
  
  return (
    <>
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, sm: 3, md: 4 }, 
          borderRadius: 3, 
          mt: 2, 
          overflow: "hidden",
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          position: 'relative'
        }}
      >
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 600, 
              display: "flex", 
              alignItems: "center",
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
              background: 'linear-gradient(45deg, #673ab7, #9c27b0)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <SettingsIcon sx={{ mr: 1, color: "#673ab7" }} />
            Tamil Calendar Settings
          </Typography>
          
          {isLargeScreen && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip 
                icon={<RefreshIcon />}
                label="Auto-sync enabled"
                size="small"
                color="success"
                variant="outlined"
              />
            </Box>
          )}
        </Box>
        
        {/* Enhanced Tabs */}
        <Box sx={{ mb: 3 }}>
          <Tabs 
            value={adminTab} 
            onChange={(e, newValue) => setAdminTab(newValue)}
            centered={!isMobile}
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider', 
              mb: 3,
              '& .MuiTab-root': {
                minWidth: { xs: 0, sm: 120 },
                px: { xs: 1, sm: 3 },
                fontWeight: 600,
                textTransform: 'none',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              },
              '& .Mui-selected': {
                background: 'linear-gradient(45deg, #673ab7, #9c27b0)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent !important'
              },
              '& .MuiTabs-indicator': {
                background: 'linear-gradient(45deg, #673ab7, #9c27b0)',
                height: 3,
                borderRadius: 1.5
              }
            }}
          >
            <Tab 
              label={isMobile ? "Calendar" : "Month Settings"} 
              icon={<DateRangeIcon />} 
              iconPosition={isMobile ? "top" : "start"}
            />
            <Tab 
              label={isMobile ? "Festivals" : "Festival Settings"} 
              icon={<EventIcon />} 
              iconPosition={isMobile ? "top" : "start"}
            />
          </Tabs>
          
          {/* Tab Content */}
          {adminTab === 0 && (
            <Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                flexDirection: { xs: 'column', lg: 'row' },
                alignItems: { xs: 'stretch', lg: 'center' },
                gap: 2,
                mb: 3,
                p: 2,
                bgcolor: 'rgba(255,255,255,0.7)',
                borderRadius: 2,
                backdropFilter: 'blur(10px)'
              }}>
                <Typography variant="h5" sx={{ 
                  fontWeight: 500,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  color: '#673ab7'
                }}>
                  Calendar Configuration
                </Typography>
                
                {renderMonthButtons()}
              </Box>
              
              <MonthSettings months={months} onChange={onMonthChange} />
            </Box>
          )}

          {adminTab === 1 && (
            <Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                flexDirection: { xs: 'column', lg: 'row' },
                alignItems: { xs: 'stretch', lg: 'center' },
                gap: 2,
                mb: 3,
                p: 2,
                bgcolor: 'rgba(255,255,255,0.7)',
                borderRadius: 2,
                backdropFilter: 'blur(10px)'
              }}>
                <Typography variant="h5" sx={{ 
                  fontWeight: 500,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  color: '#673ab7'
                }}>
                  Festival Configuration
                </Typography>
                
                {renderFestivalButtons()}
              </Box>
              
              <FestivalSettings 
                festivals={festivals} 
                onChange={onFestivalChange}
                onSave={onSaveFestivals}
                onExport={onExportFestivals}
                onImport={onImportFestivals}
                serialNumberMap={Object.fromEntries(festivalSerialMap)}
              />
            </Box>
          )}
        </Box>
      </Paper>
      
      {/* Quick Actions for Large Screens */}
      {renderQuickActions()}
      
      {/* Export Status Snackbar */}
      <Snackbar
        open={exportSnackbar.open}
        autoHideDuration={6000}
        onClose={() => setExportSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={exportSnackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
          onClose={() => setExportSnackbar(prev => ({ ...prev, open: false }))}
        >
          {exportSnackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default AdminTable;


// import React, { useState, useEffect } from "react";
// import {
//   Paper, Typography, Box, Tabs, Tab, ButtonGroup, Button,
//   useMediaQuery, useTheme, Grid, Stack, Tooltip
// } from "@mui/material";
// import SaveIcon from "@mui/icons-material/Save";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
// import DateRangeIcon from "@mui/icons-material/DateRange";
// import EventIcon from "@mui/icons-material/Event";
// import SettingsIcon from "@mui/icons-material/Settings";
// import DataObjectIcon from "@mui/icons-material/DataObject";
// import MonthSettings from "./MonthSettings";
// import FestivalSettings from "./FestivalSettings";

// function AdminTable({ 
//   months, 
//   festivals, 
//   onMonthChange, 
//   onFestivalChange, 
//   onSaveMonths,
//   onSaveFestivals,
//   onExportMonths,
//   onExportFestivals,
//   onImportMonths, 
//   onImportFestivals
// }) {
//   const [adminTab, setAdminTab] = useState(0);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isSmallMobile = useMediaQuery('(max-width:400px)');
  
//   // Track festival serial numbers
//   const [festivalSerialMap, setFestivalSerialMap] = useState(new Map());
  
//   // Update festival serial numbers whenever festivals change
//   useEffect(() => {
//     const serialMap = new Map();
//     let nextSerialNumber = 1;
    
//     // Assign serial numbers to festivals
//     festivals.forEach(festival => {
//       if (!serialMap.has(festival.name)) {
//         const paddedNumber = nextSerialNumber.toString().padStart(2, '0');
//         serialMap.set(festival.name, paddedNumber);
//         nextSerialNumber++;
//       }
//     });
    
//     setFestivalSerialMap(serialMap);
//   }, [festivals]);
  
//   // Function to generate formatted bin export for festivals - NO HEADERS
//   const handleExportFestivalsBin = () => {
//     // Create map to track festivals by date and assign serial numbers
//     const festivalMap = new Map();
//     const serialNumberMap = new Map(); // Map to track serial numbers for festival names
//     let nextSerialNumber = 1;
    
//     // Group festivals by day of year and assign serial numbers
//     festivals.forEach(festival => {
//       // Calculate day of year (1-366)
//       const date = new Date(new Date().getFullYear(), festival.month - 1, festival.day);
//       const startOfYear = new Date(date.getFullYear(), 0, 0);
//       const diff = date - startOfYear;
//       const dayOfYear = Math.floor(diff / (24 * 60 * 60 * 1000));
      
//       // Assign serial number to festival name if not already assigned
//       if (!serialNumberMap.has(festival.name)) {
//         const paddedNumber = nextSerialNumber.toString().padStart(2, '0');
//         serialNumberMap.set(festival.name, paddedNumber);
//         nextSerialNumber++;
//       }
      
//       // Get serial number for this festival
//       const serialNumber = serialNumberMap.get(festival.name);
      
//       // Add to festival map
//       if (festivalMap.has(dayOfYear)) {
//         festivalMap.set(dayOfYear, `${festivalMap.get(dayOfYear)},${serialNumber}`);
//       } else {
//         festivalMap.set(dayOfYear, serialNumber);
//       }
//     });
    
//     // Create a 366-line string (accounting for leap year)
//     let fileContent = '';
//     for (let i = 1; i <= 366; i++) {
//       fileContent += festivalMap.has(i) ? festivalMap.get(i) : '00';
//       // Only add newline if not the last line
//       if (i < 366) fileContent += '\n';
//     }
    
//     // Create and download the file
//     const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').substring(0, 14);
//     const blob = new Blob([fileContent], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `tamil_festivals_bin_${timestamp}.txt`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };
  
//   // Function to generate formatted bin export for Tamil calendar - NO HEADERS
//   const handleExportMonthsBin = () => {
//     // Format: Each line contains "daysInMonth,tamilStartDay" for each month
//     const formattedData = months.map((month, index) => {
//       // Skip adding newline to the last line
//       const lineEnd = index === months.length - 1 ? '' : '\n';
//       return `${month.daysInMonth.toString().padStart(2, '0')},${month.tamilStartDay.toString().padStart(2, '0')}${lineEnd}`;
//     }).join('');
    
//     // Create and download the file
//     const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').substring(0, 14);
//     const blob = new Blob([formattedData], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `tamil_calendar_bin_${timestamp}.txt`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };
  
//   // Responsive button group for Month Settings
//   const renderMonthButtons = () => {
//     if (isSmallMobile) {
//       return (
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', mb: 2 }}>
//           <Button
//             fullWidth
//             variant="contained"
//             color="primary"
//             startIcon={<SaveIcon />}
//             onClick={onSaveMonths}
//           >
//             Save
//           </Button>
//           <Grid container spacing={1}>
//             <Grid item xs={6}>
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 startIcon={<CloudUploadIcon />}
//                 onClick={onExportMonths}
//               >
//                 Export
//               </Button>
//             </Grid>
//             <Grid item xs={6}>
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 startIcon={<DataObjectIcon />}
//                 onClick={handleExportMonthsBin}
//                 color="secondary"
//               >
//                 Bin
//               </Button>
//             </Grid>
//           </Grid>
//           <Button
//             fullWidth
//             component="label"
//             variant="outlined"
//             startIcon={<CloudDownloadIcon />}
//           >
//             Import
//             <input type="file" accept=".txt,.json" hidden onChange={onImportMonths} />
//           </Button>
//         </Box>
//       );
//     }
    
//     if (isMobile) {
//       return (
//         <Grid container spacing={1} sx={{ mb: 2 }}>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               variant="contained"
//               color="primary"
//               startIcon={<SaveIcon />}
//               onClick={onSaveMonths}
//             >
//               Save
//             </Button>
//           </Grid>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               variant="outlined"
//               startIcon={<CloudUploadIcon />}
//               onClick={onExportMonths}
//             >
//               Export
//             </Button>
//           </Grid>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               variant="outlined"
//               color="secondary"
//               startIcon={<DataObjectIcon />}
//               onClick={handleExportMonthsBin}
//             >
//               Bin
//             </Button>
//           </Grid>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               component="label"
//               variant="outlined"
//               startIcon={<CloudDownloadIcon />}
//             >
//               Import
//               <input type="file" accept=".txt,.json" hidden onChange={onImportMonths} />
//             </Button>
//           </Grid>
//         </Grid>
//       );
//     }
    
//     return (
//       <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
//         <Button 
//           startIcon={<SaveIcon />}
//           onClick={onSaveMonths}
//           color="primary"
//           variant="contained"
//         >
//           Save Calendar
//         </Button>
//         <ButtonGroup variant="outlined">
//           <Button 
//             startIcon={<CloudUploadIcon />}
//             onClick={onExportMonths}
//           >
//             Export
//           </Button>
//           <Tooltip title="Export in specialized binary format">
//             <Button
//               startIcon={<DataObjectIcon />}
//               onClick={handleExportMonthsBin}
//               color="secondary"
//             >
//               Export Bin
//             </Button>
//           </Tooltip>
//           <Button
//             component="label"
//             startIcon={<CloudDownloadIcon />}
//           >
//             Import
//             <input type="file" accept=".txt,.json" hidden onChange={onImportMonths} />
//           </Button>
//         </ButtonGroup>
//       </Stack>
//     );
//   };

//   // Responsive button group for Festival Settings
//   const renderFestivalButtons = () => {
//     if (isSmallMobile) {
//       return (
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', mb: 2 }}>
//           <Button
//             fullWidth
//             variant="contained"
//             color="primary"
//             startIcon={<SaveIcon />}
//             onClick={onSaveFestivals}
//           >
//             Save
//           </Button>
//           <Grid container spacing={1}>
//             <Grid item xs={6}>
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 startIcon={<CloudUploadIcon />}
//                 onClick={onExportFestivals}
//               >
//                 Export
//               </Button>
//             </Grid>
//             <Grid item xs={6}>
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 startIcon={<DataObjectIcon />}
//                 onClick={handleExportFestivalsBin}
//                 color="secondary"
//               >
//                 Bin
//               </Button>
//             </Grid>
//           </Grid>
//           <Button
//             fullWidth
//             component="label"
//             variant="outlined"
//             startIcon={<CloudDownloadIcon />}
//           >
//             Import
//             <input type="file" accept=".txt,.json" hidden onChange={onImportFestivals} />
//           </Button>
//         </Box>
//       );
//     }
    
//     if (isMobile) {
//       return (
//         <Grid container spacing={1} sx={{ mb: 2 }}>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               variant="contained"
//               color="primary"
//               startIcon={<SaveIcon />}
//               onClick={onSaveFestivals}
//             >
//               Save
//             </Button>
//           </Grid>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               variant="outlined"
//               startIcon={<CloudUploadIcon />}
//               onClick={onExportFestivals}
//             >
//               Export
//             </Button>
//           </Grid>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               variant="outlined"
//               color="secondary"
//               startIcon={<DataObjectIcon />}
//               onClick={handleExportFestivalsBin}
//             >
//               Bin
//             </Button>
//           </Grid>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               component="label"
//               variant="outlined"
//               startIcon={<CloudDownloadIcon />}
//             >
//               Import
//               <input type="file" accept=".txt,.json" hidden onChange={onImportFestivals} />
//             </Button>
//           </Grid>
//         </Grid>
//       );
//     }
    
//     return (
//       <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
//         <Button 
//           startIcon={<SaveIcon />}
//           onClick={onSaveFestivals}
//           color="primary"
//           variant="contained"
//         >
//           Save Festivals
//         </Button>
//         <ButtonGroup variant="outlined">
//           <Button 
//             startIcon={<CloudUploadIcon />}
//             onClick={onExportFestivals}
//           >
//             Export
//           </Button>
//           <Tooltip title="Export in specialized binary format">
//             <Button
//               startIcon={<DataObjectIcon />}
//               onClick={handleExportFestivalsBin}
//               color="secondary"
//             >
//               Export Bin
//             </Button>
//           </Tooltip>
//           <Button
//             component="label"
//             startIcon={<CloudDownloadIcon />}
//           >
//             Import
//             <input type="file" accept=".txt,.json" hidden onChange={onImportFestivals} />
//           </Button>
//         </ButtonGroup>
//       </Stack>
//     );
//   };
  
//   return (
//     <Paper elevation={3} sx={{ 
//       p: { xs: 2, sm: 3 }, 
//       borderRadius: 2, 
//       mt: 2, 
//       overflow: "hidden" 
//     }}>
//       <Typography 
//         variant="h5" 
//         sx={{ 
//           mb: 3, 
//           fontWeight: 500, 
//           display: "flex", 
//           alignItems: "center",
//           fontSize: { xs: '1.25rem', sm: '1.5rem' }
//         }}
//       >
//         <SettingsIcon sx={{ mr: 1, color: "#673ab7" }} />
//         Tamil Calendar Settings
//       </Typography>
      
//       <Box sx={{ mb: 3 }}>
//         <Tabs 
//           value={adminTab} 
//           onChange={(e, newValue) => setAdminTab(newValue)}
//           centered
//           sx={{ 
//             borderBottom: 1, 
//             borderColor: 'divider', 
//             mb: 3,
//             '& .MuiTab-root': {
//               minWidth: { xs: 0, sm: 'auto' },
//               px: { xs: 1, sm: 2 }
//             }
//           }}
//         >
//           <Tab 
//             label={isMobile ? "Months" : "Month Settings"} 
//             icon={<DateRangeIcon />} 
//             iconPosition={isMobile ? "top" : "start"}
//           />
//           <Tab 
//             label={isMobile ? "Festivals" : "Festival Settings"} 
//             icon={<EventIcon />} 
//             iconPosition={isMobile ? "top" : "start"}
//           />
//         </Tabs>
        
//         {adminTab === 0 && (
//           <Box>
//             <Box sx={{ 
//               display: 'flex', 
//               justifyContent: 'space-between',
//               flexDirection: { xs: 'column', md: 'row' },
//               alignItems: { xs: 'stretch', md: 'center' },
//               gap: { xs: 2, md: 0 },
//               mb: 2
//             }}>
//               <Typography variant="h6" sx={{ 
//                 mb: { xs: 0, md: 0 },
//                 fontSize: { xs: '1.1rem', sm: '1.25rem' }
//               }}>
//                 Calendar Settings
//               </Typography>
              
//               {renderMonthButtons()}
//             </Box>
//             <MonthSettings months={months} onChange={onMonthChange} />
//           </Box>
//         )}

//         {adminTab === 1 && (
//           <Box>
//             <Box sx={{ 
//               display: 'flex', 
//               justifyContent: 'space-between',
//               flexDirection: { xs: 'column', md: 'row' },
//               alignItems: { xs: 'stretch', md: 'center' },
//               gap: { xs: 2, md: 0 },
//               mb: 2
//             }}>
//               <Typography variant="h6" sx={{ 
//                 mb: { xs: 0, md: 0 },
//                 fontSize: { xs: '1.1rem', sm: '1.25rem' }
//               }}>
//                 Festival Settings
//               </Typography>
              
//               {renderFestivalButtons()}
//             </Box>
            
//             <FestivalSettings 
//               festivals={festivals} 
//               onChange={onFestivalChange}
//               onSave={onSaveFestivals}
//               onExport={onExportFestivals}
//               onImport={onImportFestivals}
//               serialNumberMap={Object.fromEntries(festivalSerialMap)}
//             />
//           </Box>
//         )}
//       </Box>
//     </Paper>
//   );
// }

// export default AdminTable;

// import React, { useState } from "react";
// import {
//   Paper, Typography, Box, Tabs, Tab, ButtonGroup, Button,
//   useMediaQuery, useTheme, Grid, Stack, Tooltip
// } from "@mui/material";
// import SaveIcon from "@mui/icons-material/Save";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
// import DateRangeIcon from "@mui/icons-material/DateRange";
// import EventIcon from "@mui/icons-material/Event";
// import SettingsIcon from "@mui/icons-material/Settings";
// import DataObjectIcon from "@mui/icons-material/DataObject";
// import MonthSettings from "./MonthSettings";
// import FestivalSettings from "./FestivalSettings";

// function AdminTable({ 
//   months, 
//   festivals, 
//   onMonthChange, 
//   onFestivalChange, 
//   onSaveMonths,
//   onSaveFestivals,
//   onExportMonths,
//   onExportFestivals,
//   onImportMonths, 
//   onImportFestivals
// }) {
//   const [adminTab, setAdminTab] = useState(0);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isSmallMobile = useMediaQuery('(max-width:400px)');
  
//   // Function to generate formatted bin export for festivals - NO HEADERS
//   const handleExportFestivalsBin = () => {
//     // Create map to track festivals by date and assign serial numbers
//     const festivalMap = new Map();
//     const serialNumberMap = new Map(); // Map to track serial numbers for festival names
//     let nextSerialNumber = 1;
    
//     // Group festivals by day of year and assign serial numbers
//     festivals.forEach(festival => {
//       // Calculate day of year (1-366)
//       const date = new Date(new Date().getFullYear(), festival.month - 1, festival.day);
//       const startOfYear = new Date(date.getFullYear(), 0, 0);
//       const diff = date - startOfYear;
//       const dayOfYear = Math.floor(diff / (24 * 60 * 60 * 1000));
      
//       // Assign serial number to festival name if not already assigned
//       if (!serialNumberMap.has(festival.name)) {
//         const paddedNumber = nextSerialNumber.toString().padStart(2, '0');
//         serialNumberMap.set(festival.name, paddedNumber);
//         nextSerialNumber++;
//       }
      
//       // Get serial number for this festival
//       const serialNumber = serialNumberMap.get(festival.name);
      
//       // Add to festival map
//       if (festivalMap.has(dayOfYear)) {
//         festivalMap.set(dayOfYear, `${festivalMap.get(dayOfYear)},${serialNumber}`);
//       } else {
//         festivalMap.set(dayOfYear, serialNumber);
//       }
//     });
    
//     // Create a 366-line string (accounting for leap year)
//     let fileContent = '';
//     for (let i = 1; i <= 366; i++) {
//       fileContent += festivalMap.has(i) ? festivalMap.get(i) : '00';
//       // Only add newline if not the last line
//       if (i < 366) fileContent += '\n';
//     }
    
//     // Create and download the file
//     const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').substring(0, 14);
//     const blob = new Blob([fileContent], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `tamil_festivals_bin_${timestamp}.txt`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };
  
//   // Function to generate formatted bin export for Tamil calendar - NO HEADERS
//   const handleExportMonthsBin = () => {
//     // Format: Each line contains "daysInMonth,tamilStartDay" for each month
//     const formattedData = months.map((month, index) => {
//       // Skip adding newline to the last line
//       const lineEnd = index === months.length - 1 ? '' : '\n';
//       return `${month.daysInMonth.toString().padStart(2, '0')},${month.tamilStartDay.toString().padStart(2, '0')}${lineEnd}`;
//     }).join('');
    
//     // Create and download the file
//     const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').substring(0, 14);
//     const blob = new Blob([formattedData], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `tamil_calendar_bin_${timestamp}.txt`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };
  
//   // Responsive button group for Month Settings
//   const renderMonthButtons = () => {
//     if (isSmallMobile) {
//       return (
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', mb: 2 }}>
//           <Button
//             fullWidth
//             variant="contained"
//             color="primary"
//             startIcon={<SaveIcon />}
//             onClick={onSaveMonths}
//           >
//             Save
//           </Button>
//           <Grid container spacing={1}>
//             <Grid item xs={6}>
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 startIcon={<CloudUploadIcon />}
//                 onClick={onExportMonths}
//               >
//                 Export
//               </Button>
//             </Grid>
//             <Grid item xs={6}>
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 startIcon={<DataObjectIcon />}
//                 onClick={handleExportMonthsBin}
//                 color="secondary"
//               >
//                 Bin
//               </Button>
//             </Grid>
//           </Grid>
//           <Button
//             fullWidth
//             component="label"
//             variant="outlined"
//             startIcon={<CloudDownloadIcon />}
//           >
//             Import
//             <input type="file" accept=".txt,.json" hidden onChange={onImportMonths} />
//           </Button>
//         </Box>
//       );
//     }
    
//     if (isMobile) {
//       return (
//         <Grid container spacing={1} sx={{ mb: 2 }}>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               variant="contained"
//               color="primary"
//               startIcon={<SaveIcon />}
//               onClick={onSaveMonths}
//             >
//               Save
//             </Button>
//           </Grid>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               variant="outlined"
//               startIcon={<CloudUploadIcon />}
//               onClick={onExportMonths}
//             >
//               Export
//             </Button>
//           </Grid>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               variant="outlined"
//               color="secondary"
//               startIcon={<DataObjectIcon />}
//               onClick={handleExportMonthsBin}
//             >
//               Bin
//             </Button>
//           </Grid>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               component="label"
//               variant="outlined"
//               startIcon={<CloudDownloadIcon />}
//             >
//               Import
//               <input type="file" accept=".txt,.json" hidden onChange={onImportMonths} />
//             </Button>
//           </Grid>
//         </Grid>
//       );
//     }
    
//     return (
//       <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
//         <Button 
//           startIcon={<SaveIcon />}
//           onClick={onSaveMonths}
//           color="primary"
//           variant="contained"
//         >
//           Save Calendar
//         </Button>
//         <ButtonGroup variant="outlined">
//           <Button 
//             startIcon={<CloudUploadIcon />}
//             onClick={onExportMonths}
//           >
//             Export
//           </Button>
//           <Tooltip title="Export in specialized binary format">
//             <Button
//               startIcon={<DataObjectIcon />}
//               onClick={handleExportMonthsBin}
//               color="secondary"
//             >
//               Export Bin
//             </Button>
//           </Tooltip>
//           <Button
//             component="label"
//             startIcon={<CloudDownloadIcon />}
//           >
//             Import
//             <input type="file" accept=".txt,.json" hidden onChange={onImportMonths} />
//           </Button>
//         </ButtonGroup>
//       </Stack>
//     );
//   };

//   // Responsive button group for Festival Settings
//   const renderFestivalButtons = () => {
//     if (isSmallMobile) {
//       return (
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', mb: 2 }}>
//           <Button
//             fullWidth
//             variant="contained"
//             color="primary"
//             startIcon={<SaveIcon />}
//             onClick={onSaveFestivals}
//           >
//             Save
//           </Button>
//           <Grid container spacing={1}>
//             <Grid item xs={6}>
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 startIcon={<CloudUploadIcon />}
//                 onClick={onExportFestivals}
//               >
//                 Export
//               </Button>
//             </Grid>
//             <Grid item xs={6}>
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 startIcon={<DataObjectIcon />}
//                 onClick={handleExportFestivalsBin}
//                 color="secondary"
//               >
//                 Bin
//               </Button>
//             </Grid>
//           </Grid>
//           <Button
//             fullWidth
//             component="label"
//             variant="outlined"
//             startIcon={<CloudDownloadIcon />}
//           >
//             Import
//             <input type="file" accept=".txt,.json" hidden onChange={onImportFestivals} />
//           </Button>
//         </Box>
//       );
//     }
    
//     if (isMobile) {
//       return (
//         <Grid container spacing={1} sx={{ mb: 2 }}>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               variant="contained"
//               color="primary"
//               startIcon={<SaveIcon />}
//               onClick={onSaveFestivals}
//             >
//               Save
//             </Button>
//           </Grid>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               variant="outlined"
//               startIcon={<CloudUploadIcon />}
//               onClick={onExportFestivals}
//             >
//               Export
//             </Button>
//           </Grid>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               variant="outlined"
//               color="secondary"
//               startIcon={<DataObjectIcon />}
//               onClick={handleExportFestivalsBin}
//             >
//               Bin
//             </Button>
//           </Grid>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               component="label"
//               variant="outlined"
//               startIcon={<CloudDownloadIcon />}
//             >
//               Import
//               <input type="file" accept=".txt,.json" hidden onChange={onImportFestivals} />
//             </Button>
//           </Grid>
//         </Grid>
//       );
//     }
    
//     return (
//       <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
//         <Button 
//           startIcon={<SaveIcon />}
//           onClick={onSaveFestivals}
//           color="primary"
//           variant="contained"
//         >
//           Save Festivals
//         </Button>
//         <ButtonGroup variant="outlined">
//           <Button 
//             startIcon={<CloudUploadIcon />}
//             onClick={onExportFestivals}
//           >
//             Export
//           </Button>
//           <Tooltip title="Export in specialized binary format">
//             <Button
//               startIcon={<DataObjectIcon />}
//               onClick={handleExportFestivalsBin}
//               color="secondary"
//             >
//               Export Bin
//             </Button>
//           </Tooltip>
//           <Button
//             component="label"
//             startIcon={<CloudDownloadIcon />}
//           >
//             Import
//             <input type="file" accept=".txt,.json" hidden onChange={onImportFestivals} />
//           </Button>
//         </ButtonGroup>
//       </Stack>
//     );
//   };
  
//   return (
//     <Paper elevation={3} sx={{ 
//       p: { xs: 2, sm: 3 }, 
//       borderRadius: 2, 
//       mt: 2, 
//       overflow: "hidden" 
//     }}>
//       <Typography 
//         variant="h5" 
//         sx={{ 
//           mb: 3, 
//           fontWeight: 500, 
//           display: "flex", 
//           alignItems: "center",
//           fontSize: { xs: '1.25rem', sm: '1.5rem' }
//         }}
//       >
//         <SettingsIcon sx={{ mr: 1, color: "#673ab7" }} />
//         Tamil Calendar Settings
//       </Typography>
      
//       <Box sx={{ mb: 3 }}>
//         <Tabs 
//           value={adminTab} 
//           onChange={(e, newValue) => setAdminTab(newValue)}
//           centered
//           sx={{ 
//             borderBottom: 1, 
//             borderColor: 'divider', 
//             mb: 3,
//             '& .MuiTab-root': {
//               minWidth: { xs: 0, sm: 'auto' },
//               px: { xs: 1, sm: 2 }
//             }
//           }}
//         >
//           <Tab 
//             label={isMobile ? "Months" : "Month Settings"} 
//             icon={<DateRangeIcon />} 
//             iconPosition={isMobile ? "top" : "start"}
//           />
//           <Tab 
//             label={isMobile ? "Festivals" : "Festival Settings"} 
//             icon={<EventIcon />} 
//             iconPosition={isMobile ? "top" : "start"}
//           />
//         </Tabs>
        
//         {adminTab === 0 && (
//           <Box>
//             <Box sx={{ 
//               display: 'flex', 
//               justifyContent: 'space-between',
//               flexDirection: { xs: 'column', md: 'row' },
//               alignItems: { xs: 'stretch', md: 'center' },
//               gap: { xs: 2, md: 0 },
//               mb: 2
//             }}>
//               <Typography variant="h6" sx={{ 
//                 mb: { xs: 0, md: 0 },
//                 fontSize: { xs: '1.1rem', sm: '1.25rem' }
//               }}>
//                 Calendar Settings
//               </Typography>
              
//               {renderMonthButtons()}
//             </Box>
//             <MonthSettings months={months} onChange={onMonthChange} />
//           </Box>
//         )}

//         {adminTab === 1 && (
//           <Box>
//             <Box sx={{ 
//               display: 'flex', 
//               justifyContent: 'space-between',
//               flexDirection: { xs: 'column', md: 'row' },
//               alignItems: { xs: 'stretch', md: 'center' },
//               gap: { xs: 2, md: 0 },
//               mb: 2
//             }}>
//               <Typography variant="h6" sx={{ 
//                 mb: { xs: 0, md: 0 },
//                 fontSize: { xs: '1.1rem', sm: '1.25rem' }
//               }}>
//                 Festival Settings
//               </Typography>
              
//               {renderFestivalButtons()}
//             </Box>
            
//             <FestivalSettings 
//               festivals={festivals} 
//               onChange={onFestivalChange}
//               onSave={onSaveFestivals}
//               onExport={onExportFestivals}
//               onImport={onImportFestivals}
//             />
//           </Box>
//         )}
//       </Box>
//     </Paper>
//   );
// }

// export default AdminTable;


// import React, { useState } from "react";
// import {
//   Paper, Typography, Box, Tabs, Tab, ButtonGroup, Button,
//   useMediaQuery, useTheme, Grid, Stack, Tooltip
// } from "@mui/material";
// import SaveIcon from "@mui/icons-material/Save";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
// import DateRangeIcon from "@mui/icons-material/DateRange";
// import EventIcon from "@mui/icons-material/Event";
// import SettingsIcon from "@mui/icons-material/Settings";
// import DataObjectIcon from "@mui/icons-material/DataObject";
// import MonthSettings from "./MonthSettings";
// import FestivalSettings from "./FestivalSettings";

// function AdminTable({ 
//   months, 
//   festivals, 
//   onMonthChange, 
//   onFestivalChange, 
//   onSaveMonths,
//   onSaveFestivals,
//   onExportMonths,
//   onExportFestivals,
//   onImportMonths, 
//   onImportFestivals
// }) {
//   const [adminTab, setAdminTab] = useState(0);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isSmallMobile = useMediaQuery('(max-width:400px)');
  
//   // Function to generate formatted bin export for festivals
//   const handleExportFestivalsBin = () => {
//     // Create map to track festivals by date and assign serial numbers
//     const festivalMap = new Map();
//     const serialNumberMap = new Map(); // Map to track serial numbers for festival names
//     let nextSerialNumber = 1;
    
//     // Group festivals by day of year and assign serial numbers
//     festivals.forEach(festival => {
//       // Calculate day of year (1-366)
//       const date = new Date(new Date().getFullYear(), festival.month - 1, festival.day);
//       const startOfYear = new Date(date.getFullYear(), 0, 0);
//       const diff = date - startOfYear;
//       const dayOfYear = Math.floor(diff / (24 * 60 * 60 * 1000));
      
//       // Assign serial number to festival name if not already assigned
//       if (!serialNumberMap.has(festival.name)) {
//         const paddedNumber = nextSerialNumber.toString().padStart(2, '0');
//         serialNumberMap.set(festival.name, paddedNumber);
//         nextSerialNumber++;
//       }
      
//       // Get serial number for this festival
//       const serialNumber = serialNumberMap.get(festival.name);
      
//       // Add to festival map
//       if (festivalMap.has(dayOfYear)) {
//         festivalMap.set(dayOfYear, `${festivalMap.get(dayOfYear)},${serialNumber}`);
//       } else {
//         festivalMap.set(dayOfYear, serialNumber);
//       }
//     });
    
//     // Create a 366-line string (accounting for leap year)
//     let fileContent = '';
//     for (let i = 1; i <= 366; i++) {
//       fileContent += festivalMap.has(i) ? festivalMap.get(i) : '00';
//       fileContent += '\n';
//     }
    
//     // Prepare file header with export details
//     const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').substring(0, 14);
//     const header = `# Tamil Festival Export\n# Generated: ${new Date().toLocaleString()}\n# Festival Count: ${festivals.length}\n# Festival Map:\n`;
    
//     // Add serial number map to header
//     const serialMapText = Array.from(serialNumberMap.entries())
//       .map(([name, num]) => `# ${num}: ${name}`)
//       .join('\n');
    
//     // Combine header, map and content
//     const fullContent = `${header}${serialMapText}\n\n${fileContent}`;
    
//     // Create and download the file
//     const blob = new Blob([fullContent], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `tamil_festivals_bin_${timestamp}.txt`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };
  
//   // Function to generate formatted bin export for Tamil calendar
//   const handleExportMonthsBin = () => {
//     // Format: Each line contains "daysInMonth,tamilStartDay" for each month
//     const formattedData = months.map(month => 
//       `${month.daysInMonth.toString().padStart(2, '0')},${month.tamilStartDay.toString().padStart(2, '0')}`
//     ).join('\n');
    
//     // Prepare file header with export details
//     const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').substring(0, 14);
//     const header = `# Tamil Calendar Export\n# Generated: ${new Date().toLocaleString()}\n# Format: daysInMonth,tamilStartDay\n\n`;
    
//     // Create and download the file
//     const blob = new Blob([header + formattedData], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `tamil_calendar_bin_${timestamp}.txt`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };
  
//   // Responsive button group for Month Settings
//   const renderMonthButtons = () => {
//     if (isSmallMobile) {
//       return (
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', mb: 2 }}>
//           <Button
//             fullWidth
//             variant="contained"
//             color="primary"
//             startIcon={<SaveIcon />}
//             onClick={onSaveMonths}
//           >
//             Save
//           </Button>
//           <Grid container spacing={1}>
//             <Grid item xs={6}>
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 startIcon={<CloudUploadIcon />}
//                 onClick={onExportMonths}
//               >
//                 Export
//               </Button>
//             </Grid>
//             <Grid item xs={6}>
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 startIcon={<DataObjectIcon />}
//                 onClick={handleExportMonthsBin}
//                 color="secondary"
//               >
//                 Bin
//               </Button>
//             </Grid>
//           </Grid>
//           <Button
//             fullWidth
//             component="label"
//             variant="outlined"
//             startIcon={<CloudDownloadIcon />}
//           >
//             Import
//             <input type="file" accept=".txt,.json" hidden onChange={onImportMonths} />
//           </Button>
//         </Box>
//       );
//     }
    
//     if (isMobile) {
//       return (
//         <Grid container spacing={1} sx={{ mb: 2 }}>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               variant="contained"
//               color="primary"
//               startIcon={<SaveIcon />}
//               onClick={onSaveMonths}
//             >
//               Save
//             </Button>
//           </Grid>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               variant="outlined"
//               startIcon={<CloudUploadIcon />}
//               onClick={onExportMonths}
//             >
//               Export
//             </Button>
//           </Grid>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               variant="outlined"
//               color="secondary"
//               startIcon={<DataObjectIcon />}
//               onClick={handleExportMonthsBin}
//             >
//               Bin
//             </Button>
//           </Grid>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               component="label"
//               variant="outlined"
//               startIcon={<CloudDownloadIcon />}
//             >
//               Import
//               <input type="file" accept=".txt,.json" hidden onChange={onImportMonths} />
//             </Button>
//           </Grid>
//         </Grid>
//       );
//     }
    
//     return (
//       <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
//         <Button 
//           startIcon={<SaveIcon />}
//           onClick={onSaveMonths}
//           color="primary"
//           variant="contained"
//         >
//           Save Calendar
//         </Button>
//         <ButtonGroup variant="outlined">
//           <Button 
//             startIcon={<CloudUploadIcon />}
//             onClick={onExportMonths}
//           >
//             Export
//           </Button>
//           <Tooltip title="Export in specialized binary format with date/time stamp">
//             <Button
//               startIcon={<DataObjectIcon />}
//               onClick={handleExportMonthsBin}
//               color="secondary"
//             >
//               Export Bin
//             </Button>
//           </Tooltip>
//           <Button
//             component="label"
//             startIcon={<CloudDownloadIcon />}
//           >
//             Import
//             <input type="file" accept=".txt,.json" hidden onChange={onImportMonths} />
//           </Button>
//         </ButtonGroup>
//       </Stack>
//     );
//   };

//   // Responsive button group for Festival Settings
//   const renderFestivalButtons = () => {
//     if (isSmallMobile) {
//       return (
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', mb: 2 }}>
//           <Button
//             fullWidth
//             variant="contained"
//             color="primary"
//             startIcon={<SaveIcon />}
//             onClick={onSaveFestivals}
//           >
//             Save
//           </Button>
//           <Grid container spacing={1}>
//             <Grid item xs={6}>
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 startIcon={<CloudUploadIcon />}
//                 onClick={onExportFestivals}
//               >
//                 Export
//               </Button>
//             </Grid>
//             <Grid item xs={6}>
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 startIcon={<DataObjectIcon />}
//                 onClick={handleExportFestivalsBin}
//                 color="secondary"
//               >
//                 Bin
//               </Button>
//             </Grid>
//           </Grid>
//           <Button
//             fullWidth
//             component="label"
//             variant="outlined"
//             startIcon={<CloudDownloadIcon />}
//           >
//             Import
//             <input type="file" accept=".txt,.json" hidden onChange={onImportFestivals} />
//           </Button>
//         </Box>
//       );
//     }
    
//     if (isMobile) {
//       return (
//         <Grid container spacing={1} sx={{ mb: 2 }}>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               variant="contained"
//               color="primary"
//               startIcon={<SaveIcon />}
//               onClick={onSaveFestivals}
//             >
//               Save
//             </Button>
//           </Grid>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               variant="outlined"
//               startIcon={<CloudUploadIcon />}
//               onClick={onExportFestivals}
//             >
//               Export
//             </Button>
//           </Grid>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               variant="outlined"
//               color="secondary"
//               startIcon={<DataObjectIcon />}
//               onClick={handleExportFestivalsBin}
//             >
//               Bin
//             </Button>
//           </Grid>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               component="label"
//               variant="outlined"
//               startIcon={<CloudDownloadIcon />}
//             >
//               Import
//               <input type="file" accept=".txt,.json" hidden onChange={onImportFestivals} />
//             </Button>
//           </Grid>
//         </Grid>
//       );
//     }
    
//     return (
//       <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
//         <Button 
//           startIcon={<SaveIcon />}
//           onClick={onSaveFestivals}
//           color="primary"
//           variant="contained"
//         >
//           Save Festivals
//         </Button>
//         <ButtonGroup variant="outlined">
//           <Button 
//             startIcon={<CloudUploadIcon />}
//             onClick={onExportFestivals}
//           >
//             Export
//           </Button>
//           <Tooltip title="Export in specialized binary format with date/time stamp">
//             <Button
//               startIcon={<DataObjectIcon />}
//               onClick={handleExportFestivalsBin}
//               color="secondary"
//             >
//               Export Bin
//             </Button>
//           </Tooltip>
//           <Button
//             component="label"
//             startIcon={<CloudDownloadIcon />}
//           >
//             Import
//             <input type="file" accept=".txt,.json" hidden onChange={onImportFestivals} />
//           </Button>
//         </ButtonGroup>
//       </Stack>
//     );
//   };
  
//   return (
//     <Paper elevation={3} sx={{ 
//       p: { xs: 2, sm: 3 }, 
//       borderRadius: 2, 
//       mt: 2, 
//       overflow: "hidden" 
//     }}>
//       <Typography 
//         variant="h5" 
//         sx={{ 
//           mb: 3, 
//           fontWeight: 500, 
//           display: "flex", 
//           alignItems: "center",
//           fontSize: { xs: '1.25rem', sm: '1.5rem' }
//         }}
//       >
//         <SettingsIcon sx={{ mr: 1, color: "#673ab7" }} />
//         Tamil Calendar Settings
//       </Typography>
      
//       <Box sx={{ mb: 3 }}>
//         <Tabs 
//           value={adminTab} 
//           onChange={(e, newValue) => setAdminTab(newValue)}
//           centered
//           sx={{ 
//             borderBottom: 1, 
//             borderColor: 'divider', 
//             mb: 3,
//             '& .MuiTab-root': {
//               minWidth: { xs: 0, sm: 'auto' },
//               px: { xs: 1, sm: 2 }
//             }
//           }}
//         >
//           <Tab 
//             label={isMobile ? "Months" : "Month Settings"} 
//             icon={<DateRangeIcon />} 
//             iconPosition={isMobile ? "top" : "start"}
//           />
//           <Tab 
//             label={isMobile ? "Festivals" : "Festival Settings"} 
//             icon={<EventIcon />} 
//             iconPosition={isMobile ? "top" : "start"}
//           />
//         </Tabs>
        
//         {adminTab === 0 && (
//           <Box>
//             <Box sx={{ 
//               display: 'flex', 
//               justifyContent: 'space-between',
//               flexDirection: { xs: 'column', md: 'row' },
//               alignItems: { xs: 'stretch', md: 'center' },
//               gap: { xs: 2, md: 0 },
//               mb: 2
//             }}>
//               <Typography variant="h6" sx={{ 
//                 mb: { xs: 0, md: 0 },
//                 fontSize: { xs: '1.1rem', sm: '1.25rem' }
//               }}>
//                 Calendar Settings
//               </Typography>
              
//               {renderMonthButtons()}
//             </Box>
//             <MonthSettings months={months} onChange={onMonthChange} />
//           </Box>
//         )}

//         {adminTab === 1 && (
//           <Box>
//             <Box sx={{ 
//               display: 'flex', 
//               justifyContent: 'space-between',
//               flexDirection: { xs: 'column', md: 'row' },
//               alignItems: { xs: 'stretch', md: 'center' },
//               gap: { xs: 2, md: 0 },
//               mb: 2
//             }}>
//               <Typography variant="h6" sx={{ 
//                 mb: { xs: 0, md: 0 },
//                 fontSize: { xs: '1.1rem', sm: '1.25rem' }
//               }}>
//                 Festival Settings
//               </Typography>
              
//               {renderFestivalButtons()}
//             </Box>
            
//             <FestivalSettings 
//               festivals={festivals} 
//               onChange={onFestivalChange}
//               onSave={onSaveFestivals}
//               onExport={onExportFestivals}
//               onImport={onImportFestivals}
//             />
//           </Box>
//         )}
//       </Box>
//     </Paper>
//   );
// }

// export default AdminTable;


// import React, { useState } from "react";
// import {
//   Paper, Typography, Box, Tabs, Tab, ButtonGroup, Button,
//   useMediaQuery, useTheme, Grid, Stack, Tooltip
// } from "@mui/material";
// import SaveIcon from "@mui/icons-material/Save";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
// import DateRangeIcon from "@mui/icons-material/DateRange";
// import EventIcon from "@mui/icons-material/Event";
// import SettingsIcon from "@mui/icons-material/Settings";
// import DataObjectIcon from "@mui/icons-material/DataObject";
// import MonthSettings from "./MonthSettings";
// import FestivalSettings from "./FestivalSettings";

// function AdminTable({ 
//   months, 
//   festivals, 
//   onMonthChange, 
//   onFestivalChange, 
//   onSaveMonths,
//   onSaveFestivals,
//   onExportMonths,
//   onExportFestivals,
//   onExportMonthsBin,
//   onExportFestivalsBin,
//   onImportMonths, 
//   onImportFestivals
// }) {
//   const [adminTab, setAdminTab] = useState(0);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isSmallMobile = useMediaQuery('(max-width:400px)');
  
//   // Responsive button group for Month Settings
//   const renderMonthButtons = () => {
//     if (isSmallMobile) {
//       return (
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', mb: 2 }}>
//           <Button
//             fullWidth
//             variant="contained"
//             color="primary"
//             startIcon={<SaveIcon />}
//             onClick={onSaveMonths}
//           >
//             Save
//           </Button>
//           <Grid container spacing={1}>
//             <Grid item xs={6}>
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 startIcon={<CloudUploadIcon />}
//                 onClick={onExportMonths}
//               >
//                 Export
//               </Button>
//             </Grid>
//             <Grid item xs={6}>
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 startIcon={<DataObjectIcon />}
//                 onClick={onExportMonthsBin}
//                 color="secondary"
//               >
//                 Bin
//               </Button>
//             </Grid>
//           </Grid>
//           <Button
//             fullWidth
//             component="label"
//             variant="outlined"
//             startIcon={<CloudDownloadIcon />}
//           >
//             Import
//             <input type="file" accept=".txt,.json" hidden onChange={onImportMonths} />
//           </Button>
//         </Box>
//       );
//     }
    
//     if (isMobile) {
//       return (
//         <Grid container spacing={1} sx={{ mb: 2 }}>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               variant="contained"
//               color="primary"
//               startIcon={<SaveIcon />}
//               onClick={onSaveMonths}
//             >
//               Save
//             </Button>
//           </Grid>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               variant="outlined"
//               startIcon={<CloudUploadIcon />}
//               onClick={onExportMonths}
//             >
//               Export
//             </Button>
//           </Grid>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               variant="outlined"
//               color="secondary"
//               startIcon={<DataObjectIcon />}
//               onClick={onExportMonthsBin}
//             >
//               Bin
//             </Button>
//           </Grid>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               component="label"
//               variant="outlined"
//               startIcon={<CloudDownloadIcon />}
//             >
//               Import
//               <input type="file" accept=".txt,.json" hidden onChange={onImportMonths} />
//             </Button>
//           </Grid>
//         </Grid>
//       );
//     }
    
//     return (
//       <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
//         <Button 
//           startIcon={<SaveIcon />}
//           onClick={onSaveMonths}
//           color="primary"
//           variant="contained"
//         >
//           Save Calendar
//         </Button>
//         <ButtonGroup variant="outlined">
//           <Button 
//             startIcon={<CloudUploadIcon />}
//             onClick={onExportMonths}
//           >
//             Export
//           </Button>
//           <Button
//             startIcon={<DataObjectIcon />}
//             onClick={onExportMonthsBin}
//             color="secondary"
//           >
//             Export Bin
//           </Button>
//           <Button
//             component="label"
//             startIcon={<CloudDownloadIcon />}
//           >
//             Import
//             <input type="file" accept=".txt,.json" hidden onChange={onImportMonths} />
//           </Button>
//         </ButtonGroup>
//       </Stack>
//     );
//   };

//   // Responsive button group for Festival Settings
//   const renderFestivalButtons = () => {
//     if (isSmallMobile) {
//       return (
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', mb: 2 }}>
//           <Button
//             fullWidth
//             variant="contained"
//             color="primary"
//             startIcon={<SaveIcon />}
//             onClick={onSaveFestivals}
//           >
//             Save
//           </Button>
//           <Grid container spacing={1}>
//             <Grid item xs={6}>
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 startIcon={<CloudUploadIcon />}
//                 onClick={onExportFestivals}
//               >
//                 Export
//               </Button>
//             </Grid>
//             <Grid item xs={6}>
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 startIcon={<DataObjectIcon />}
//                 onClick={onExportFestivalsBin}
//                 color="secondary"
//               >
//                 Bin
//               </Button>
//             </Grid>
//           </Grid>
//           <Button
//             fullWidth
//             component="label"
//             variant="outlined"
//             startIcon={<CloudDownloadIcon />}
//           >
//             Import
//             <input type="file" accept=".txt,.json" hidden onChange={onImportFestivals} />
//           </Button>
//         </Box>
//       );
//     }
    
//     if (isMobile) {
//       return (
//         <Grid container spacing={1} sx={{ mb: 2 }}>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               variant="contained"
//               color="primary"
//               startIcon={<SaveIcon />}
//               onClick={onSaveFestivals}
//             >
//               Save
//             </Button>
//           </Grid>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               variant="outlined"
//               startIcon={<CloudUploadIcon />}
//               onClick={onExportFestivals}
//             >
//               Export
//             </Button>
//           </Grid>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               variant="outlined"
//               color="secondary"
//               startIcon={<DataObjectIcon />}
//               onClick={onExportFestivalsBin}
//             >
//               Bin
//             </Button>
//           </Grid>
//           <Grid item xs={3}>
//             <Button
//               fullWidth
//               component="label"
//               variant="outlined"
//               startIcon={<CloudDownloadIcon />}
//             >
//               Import
//               <input type="file" accept=".txt,.json" hidden onChange={onImportFestivals} />
//             </Button>
//           </Grid>
//         </Grid>
//       );
//     }
    
//     return (
//       <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
//         <Button 
//           startIcon={<SaveIcon />}
//           onClick={onSaveFestivals}
//           color="primary"
//           variant="contained"
//         >
//           Save Festivals
//         </Button>
//         <ButtonGroup variant="outlined">
//           <Button 
//             startIcon={<CloudUploadIcon />}
//             onClick={onExportFestivals}
//           >
//             Export
//           </Button>
//           <Button
//             startIcon={<DataObjectIcon />}
//             onClick={onExportFestivalsBin}
//             color="secondary"
//           >
//             Export Bin
//           </Button>
//           <Button
//             component="label"
//             startIcon={<CloudDownloadIcon />}
//           >
//             Import
//             <input type="file" accept=".txt,.json" hidden onChange={onImportFestivals} />
//           </Button>
//         </ButtonGroup>
//       </Stack>
//     );
//   };
  
//   return (
//     <Paper elevation={3} sx={{ 
//       p: { xs: 2, sm: 3 }, 
//       borderRadius: 2, 
//       mt: 2, 
//       overflow: "hidden" 
//     }}>
//       <Typography 
//         variant="h5" 
//         sx={{ 
//           mb: 3, 
//           fontWeight: 500, 
//           display: "flex", 
//           alignItems: "center",
//           fontSize: { xs: '1.25rem', sm: '1.5rem' }
//         }}
//       >
//         <SettingsIcon sx={{ mr: 1, color: "#673ab7" }} />
//         Tamil Calendar Settings
//       </Typography>
      
//       <Box sx={{ mb: 3 }}>
//         <Tabs 
//           value={adminTab} 
//           onChange={(e, newValue) => setAdminTab(newValue)}
//           centered
//           sx={{ 
//             borderBottom: 1, 
//             borderColor: 'divider', 
//             mb: 3,
//             '& .MuiTab-root': {
//               minWidth: { xs: 0, sm: 'auto' },
//               px: { xs: 1, sm: 2 }
//             }
//           }}
//         >
//           <Tab 
//             label={isMobile ? "Months" : "Month Settings"} 
//             icon={<DateRangeIcon />} 
//             iconPosition={isMobile ? "top" : "start"}
//           />
//           <Tab 
//             label={isMobile ? "Festivals" : "Festival Settings"} 
//             icon={<EventIcon />} 
//             iconPosition={isMobile ? "top" : "start"}
//           />
//         </Tabs>
        
//         {adminTab === 0 && (
//           <Box>
//             <Box sx={{ 
//               display: 'flex', 
//               justifyContent: 'space-between',
//               flexDirection: { xs: 'column', md: 'row' },
//               alignItems: { xs: 'stretch', md: 'center' },
//               gap: { xs: 2, md: 0 },
//               mb: 2
//             }}>
//               <Typography variant="h6" sx={{ 
//                 mb: { xs: 0, md: 0 },
//                 fontSize: { xs: '1.1rem', sm: '1.25rem' }
//               }}>
//                 Calendar Settings
//               </Typography>
              
//               {renderMonthButtons()}
//             </Box>
//             <MonthSettings months={months} onChange={onMonthChange} />
//           </Box>
//         )}

//         {adminTab === 1 && (
//           <Box>
//             <Box sx={{ 
//               display: 'flex', 
//               justifyContent: 'space-between',
//               flexDirection: { xs: 'column', md: 'row' },
//               alignItems: { xs: 'stretch', md: 'center' },
//               gap: { xs: 2, md: 0 },
//               mb: 2
//             }}>
//               <Typography variant="h6" sx={{ 
//                 mb: { xs: 0, md: 0 },
//                 fontSize: { xs: '1.1rem', sm: '1.25rem' }
//               }}>
//                 Festival Settings
//               </Typography>
              
//               {renderFestivalButtons()}
//             </Box>
            
//             <FestivalSettings 
//               festivals={festivals} 
//               onChange={onFestivalChange}
//               onSave={onSaveFestivals}
//               onExport={onExportFestivals}
//               onImport={onImportFestivals}
//             />
//           </Box>
//         )}
//       </Box>
//     </Paper>
//   );
// }

// export default AdminTable;


// import React, { useState } from "react";
// import {
//   Paper, Typography, Box, Tabs, Tab, ButtonGroup, Button,
//   useMediaQuery, useTheme, Grid
// } from "@mui/material";
// import SaveIcon from "@mui/icons-material/Save";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
// import DateRangeIcon from "@mui/icons-material/DateRange";
// import EventIcon from "@mui/icons-material/Event";
// import SettingsIcon from "@mui/icons-material/Settings";
// import MonthSettings from "./MonthSettings";
// import FestivalSettings from "./FestivalSettings";

// function AdminTable({ 
//   months, 
//   festivals, 
//   onMonthChange, 
//   onFestivalChange, 
//   onSaveMonths,
//   onSaveFestivals,
//   onExportMonths,
//   onExportFestivals,
//   onImportMonths, 
//   onImportFestivals
// }) {
//   const [adminTab, setAdminTab] = useState(0);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isSmallMobile = useMediaQuery('(max-width:400px)');
  
//   // Responsive button group for Month Settings
//   const renderMonthButtons = () => {
//     if (isSmallMobile) {
//       return (
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', mb: 2 }}>
//           <Button
//             fullWidth
//             variant="contained"
//             color="primary"
//             startIcon={<SaveIcon />}
//             onClick={onSaveMonths}
//           >
//             Save
//           </Button>
//           <Box sx={{ display: 'flex', gap: 1 }}>
//             <Button
//               fullWidth
//               variant="outlined"
//               startIcon={<CloudUploadIcon />}
//               onClick={onExportMonths}
//             >
//               Export
//             </Button>
//             <Button
//               fullWidth
//               component="label"
//               variant="outlined"
//               startIcon={<CloudDownloadIcon />}
//             >
//               Import
//               <input type="file" accept=".txt,.json" hidden onChange={onImportMonths} />
//             </Button>
//           </Box>
//         </Box>
//       );
//     }
    
//     if (isMobile) {
//       return (
//         <Grid container spacing={1} sx={{ mb: 2 }}>
//           <Grid item xs={4}>
//             <Button
//               fullWidth
//               variant="contained"
//               color="primary"
//               startIcon={<SaveIcon />}
//               onClick={onSaveMonths}
//             >
//               Save
//             </Button>
//           </Grid>
//           <Grid item xs={4}>
//             <Button
//               fullWidth
//               variant="outlined"
//               startIcon={<CloudUploadIcon />}
//               onClick={onExportMonths}
//             >
//               Export
//             </Button>
//           </Grid>
//           <Grid item xs={4}>
//             <Button
//               fullWidth
//               component="label"
//               variant="outlined"
//               startIcon={<CloudDownloadIcon />}
//             >
//               Import
//               <input type="file" accept=".txt,.json" hidden onChange={onImportMonths} />
//             </Button>
//           </Grid>
//         </Grid>
//       );
//     }
    
//     return (
//       <ButtonGroup 
//         variant="outlined" 
//         size="small"
//         sx={{ mb: 2 }}
//       >
//         <Button 
//           startIcon={<SaveIcon />}
//           onClick={onSaveMonths}
//           color="primary"
//           variant="contained"
//         >
//           Save Calendar
//         </Button>
//         <Button 
//           startIcon={<CloudUploadIcon />}
//           onClick={onExportMonths}
//         >
//           Export
//         </Button>
//         <Button
//           component="label"
//           startIcon={<CloudDownloadIcon />}
//         >
//           Import
//           <input type="file" accept=".txt,.json" hidden onChange={onImportMonths} />
//         </Button>
//       </ButtonGroup>
//     );
//   };

//   // Responsive button group for Festival Settings
//   const renderFestivalButtons = () => {
//     if (isSmallMobile) {
//       return (
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', mb: 2 }}>
//           <Button
//             fullWidth
//             variant="contained"
//             color="primary"
//             startIcon={<SaveIcon />}
//             onClick={onSaveFestivals}
//           >
//             Save
//           </Button>
//           <Box sx={{ display: 'flex', gap: 1 }}>
//             <Button
//               fullWidth
//               variant="outlined"
//               startIcon={<CloudUploadIcon />}
//               onClick={onExportFestivals}
//             >
//               Export
//             </Button>
//             <Button
//               fullWidth
//               component="label"
//               variant="outlined"
//               startIcon={<CloudDownloadIcon />}
//             >
//               Import
//               <input type="file" accept=".txt,.json" hidden onChange={onImportFestivals} />
//             </Button>
//           </Box>
//         </Box>
//       );
//     }
    
//     if (isMobile) {
//       return (
//         <Grid container spacing={1} sx={{ mb: 2 }}>
//           <Grid item xs={4}>
//             <Button
//               fullWidth
//               variant="contained"
//               color="primary"
//               startIcon={<SaveIcon />}
//               onClick={onSaveFestivals}
//             >
//               Save
//             </Button>
//           </Grid>
//           <Grid item xs={4}>
//             <Button
//               fullWidth
//               variant="outlined"
//               startIcon={<CloudUploadIcon />}
//               onClick={onExportFestivals}
//             >
//               Export
//             </Button>
//           </Grid>
//           <Grid item xs={4}>
//             <Button
//               fullWidth
//               component="label"
//               variant="outlined"
//               startIcon={<CloudDownloadIcon />}
//             >
//               Import
//               <input type="file" accept=".txt,.json" hidden onChange={onImportFestivals} />
//             </Button>
//           </Grid>
//         </Grid>
//       );
//     }
    
//     return (
//       <ButtonGroup 
//         variant="outlined" 
//         size="small"
//         sx={{ mb: 2 }}
//       >
//         <Button 
//           startIcon={<SaveIcon />}
//           onClick={onSaveFestivals}
//           color="primary"
//           variant="contained"
//         >
//           Save Festivals
//         </Button>
//         <Button 
//           startIcon={<CloudUploadIcon />}
//           onClick={onExportFestivals}
//         >
//           Export
//         </Button>
//         <Button
//           component="label"
//           startIcon={<CloudDownloadIcon />}
//         >
//           Import
//           <input type="file" accept=".txt,.json" hidden onChange={onImportFestivals} />
//         </Button>
//       </ButtonGroup>
//     );
//   };
  
//   return (
//     <Paper elevation={3} sx={{ 
//       p: { xs: 2, sm: 3 }, 
//       borderRadius: 2, 
//       mt: 2, 
//       overflow: "hidden" 
//     }}>
//       <Typography 
//         variant="h5" 
//         sx={{ 
//           mb: 3, 
//           fontWeight: 500, 
//           display: "flex", 
//           alignItems: "center",
//           fontSize: { xs: '1.25rem', sm: '1.5rem' }
//         }}
//       >
//         <SettingsIcon sx={{ mr: 1, color: "#673ab7" }} />
//         Tamil Calendar Settings
//       </Typography>
      
//       <Box sx={{ mb: 3 }}>
//         <Tabs 
//           value={adminTab} 
//           onChange={(e, newValue) => setAdminTab(newValue)}
//           centered
//           sx={{ 
//             borderBottom: 1, 
//             borderColor: 'divider', 
//             mb: 3,
//             '& .MuiTab-root': {
//               minWidth: { xs: 0, sm: 'auto' },
//               px: { xs: 1, sm: 2 }
//             }
//           }}
//         >
//           <Tab 
//             label={isMobile ? "Months" : "Month Settings"} 
//             icon={<DateRangeIcon />} 
//             iconPosition={isMobile ? "top" : "start"}
//           />
//           <Tab 
//             label={isMobile ? "Festivals" : "Festival Settings"} 
//             icon={<EventIcon />} 
//             iconPosition={isMobile ? "top" : "start"}
//           />
//         </Tabs>
        
//         {adminTab === 0 && (
//           <Box>
//             <Box sx={{ 
//               display: 'flex', 
//               justifyContent: 'space-between',
//               flexDirection: { xs: 'column', md: 'row' },
//               alignItems: { xs: 'stretch', md: 'center' },
//               gap: { xs: 2, md: 0 },
//               mb: 2
//             }}>
//               <Typography variant="h6" sx={{ 
//                 mb: { xs: 0, md: 0 },
//                 fontSize: { xs: '1.1rem', sm: '1.25rem' }
//               }}>
//                 Calendar Settings
//               </Typography>
              
//               {renderMonthButtons()}
//             </Box>
//             <MonthSettings months={months} onChange={onMonthChange} />
//           </Box>
//         )}

//         {adminTab === 1 && (
//           <Box>
//             <Box sx={{ 
//               display: 'flex', 
//               justifyContent: 'space-between',
//               flexDirection: { xs: 'column', md: 'row' },
//               alignItems: { xs: 'stretch', md: 'center' },
//               gap: { xs: 2, md: 0 },
//               mb: 2
//             }}>
//               <Typography variant="h6" sx={{ 
//                 mb: { xs: 0, md: 0 },
//                 fontSize: { xs: '1.1rem', sm: '1.25rem' }
//               }}>
//                 Festival Settings
//               </Typography>
              
//               {renderFestivalButtons()}
//             </Box>
            
//             <FestivalSettings 
//               festivals={festivals} 
//               onChange={onFestivalChange}
//               onSave={onSaveFestivals}
//               onExport={onExportFestivals}
//               onImport={onImportFestivals}
//             />
//           </Box>
//         )}
//       </Box>
//     </Paper>
//   );
// }

// export default AdminTable;

// import React, { useState } from "react";
// import {
//   Paper, Typography, Box, Tabs, Tab, ButtonGroup, Button
// } from "@mui/material";
// import SaveIcon from "@mui/icons-material/Save";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
// import DateRangeIcon from "@mui/icons-material/DateRange";
// import EventIcon from "@mui/icons-material/Event";
// import SettingsIcon from "@mui/icons-material/Settings";
// import MonthSettings from "./MonthSettings";
// import FestivalSettings from "./FestivalSettings";

// function AdminTable({ 
//   months, 
//   festivals, 
//   onMonthChange, 
//   onFestivalChange, 
//   onSaveMonths,
//   onSaveFestivals,
//   onExportMonths,
//   onExportFestivals,
//   onImportMonths, 
//   onImportFestivals
// }) {
//   const [adminTab, setAdminTab] = useState(0);
  
//   return (
//     <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mt: 2, overflow: "hidden" }}>
//       <Typography variant="h5" sx={{ mb: 3, fontWeight: 500, display: "flex", alignItems: "center" }}>
//         <SettingsIcon sx={{ mr: 1, color: "#3f51b5" }} />
//         Tamil Calendar Settings
//       </Typography>
      
//       <Box sx={{ mb: 3 }}>
//         <Tabs 
//           value={adminTab} 
//           onChange={(e, newValue) => setAdminTab(newValue)}
//           centered
//           sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
//         >
//           <Tab 
//             label="Month Settings" 
//             icon={<DateRangeIcon />} 
//             iconPosition="start"
//           />
//           <Tab 
//             label="Festivals" 
//             icon={<EventIcon />} 
//             iconPosition="start"
//           />
//         </Tabs>
//             {adminTab === 0 && (
//             <>
//                 <Box sx={{ 
//                 display: 'flex', 
//                 justifyContent: 'space-between', 
//                 mb: 2, 
//                 alignItems: 'center',
//                 flexDirection: {
//                     xs: 'column',
//                     md: 'row'
//                 },
//                 gap: {
//                     xs: 2,
//                     md: 0
//                 }
//                 }} className="settings-header">
//                 <Typography variant="h6" sx={{ mb: { xs: 0, md: 2 } }}>
//                     Calendar Settings
//                 </Typography>
//                 <ButtonGroup 
//                     variant="outlined" 
//                     size="small"
//                     sx={{
//                     flexDirection: {
//                         xs: 'column',
//                         sm: 'row'
//                     },
//                     width: {
//                         xs: '100%',
//                         md: 'auto'
//                     }
//                     }}
//                 >
//                     <Button 
//                     startIcon={<SaveIcon />}
//                     onClick={onSaveMonths}
//                     color="primary"
//                     variant="contained"
//                     fullWidth
//                     >
//                     Save Calendar
//                     </Button>
//                     <Button 
//                     startIcon={<CloudUploadIcon />}
//                     onClick={onExportMonths}
//                     fullWidth
//                     >
//                     Export Calendar
//                     </Button>
//                     <Button
//                     component="label"
//                     startIcon={<CloudDownloadIcon />}
//                     fullWidth
//                     >
//                     Import Calendar
//                     <input type="file" accept=".txt,.json" hidden onChange={onImportMonths} />
//                     </Button>
//                 </ButtonGroup>
//                 </Box>
//                 <MonthSettings months={months} onChange={onMonthChange} />
//             </>
//             )}

//         {/* {adminTab === 0 && (
//           <>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
//               <Typography variant="h6" sx={{ mb: 2 }}>
//                 Tamil Month Settings
//               </Typography>
//               <ButtonGroup variant="outlined" size="small">
//                 <Button 
//                   startIcon={<SaveIcon />}
//                   onClick={onSaveMonths}
//                   color="primary"
//                   variant="contained"
//                 >
//                   Save Calendar
//                 </Button>
//                 <Button 
//                   startIcon={<CloudUploadIcon />}
//                   onClick={onExportMonths}
//                 >
//                   Export Calendar
//                 </Button>
//                 <Button
//                   component="label"
//                   startIcon={<CloudDownloadIcon />}
//                 >
//                   Import Calendar
//                   <input type="file" accept=".txt,.json" hidden onChange={onImportMonths} />
//                 </Button>
//               </ButtonGroup>
//             </Box>
//             <MonthSettings months={months} onChange={onMonthChange} />
//           </>
//         )} */}

//         {adminTab === 1 && (
//           <Box>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
//               <Typography variant="h6">
//                 Festival Settings
//               </Typography>
//               <ButtonGroup variant="outlined" size="small">
//                 <Button 
//                   startIcon={<SaveIcon />}
//                   onClick={onSaveFestivals}
//                   color="primary"
//                   variant="contained"
//                 >
//                   Save Festivals
//                 </Button>
//                 <Button 
//                   startIcon={<CloudUploadIcon />}
//                   onClick={onExportFestivals}
//                 >
//                   Export Festivals
//                 </Button>
//                 <Button
//                   component="label"
//                   startIcon={<CloudDownloadIcon />}
//                 >
//                   Import Festiv
//                   <input type="file" accept=".txt,.json" hidden onChange={onImportFestivals} />
//                 </Button>
//               </ButtonGroup>
//             </Box>
//             <FestivalSettings 
//               festivals={festivals} 
//               onChange={onFestivalChange}
//             />
//           </Box>
//         )}
//       </Box>
//     </Paper>
//   );
// }

// export default AdminTable;
