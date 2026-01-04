// Modified FestivalSettings.jsx to show serial numbers
import React, { useState } from "react";
import { 
  Box, Typography, Paper, Grid, TextField, MenuItem, Button, 
  Table, TableHead, TableRow, TableCell, TableBody, IconButton,
  Card, CardContent, CardActions, Divider, useMediaQuery, useTheme,
  Accordion, AccordionSummary, AccordionDetails, Chip, InputLabel,
  FormControl, Select, FormHelperText, Stack, Badge, Tooltip
} from "@mui/material";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import CheckIcon from '@mui/icons-material/Check';
import NumbersIcon from "@mui/icons-material/Numbers";
import { englishMonths, festivalColors } from "./constants";
import { format, parse } from "date-fns";

function FestivalSettings({ 
  festivals, 
  onChange, 
  serialNumberMap = {} 
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery('(max-width:400px)');
  
  const currentYear = new Date().getFullYear();
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [newFestival, setNewFestival] = useState({ 
    month: selectedDate.getMonth() + 1, 
    day: selectedDate.getDate(), 
    name: "", 
    color: "#f44336"
  });
  
  const [editingId, setEditingId] = useState(null);
  const [expandedAccordion, setExpandedAccordion] = useState(isMobile);
  
  const addFestival = () => {
    if (newFestival.name.trim()) {
      // Get next ID in sequence
      const maxId = festivals.length > 0 ? Math.max(...festivals.map(f => f.id)) : 0;
      const updatedFestivals = [...festivals, { ...newFestival, id: maxId + 1 }];
      onChange(updatedFestivals);
      
      // Reset form but keep the date the same
      setNewFestival({ 
        month: selectedDate.getMonth() + 1, 
        day: selectedDate.getDate(), 
        name: "", 
        color: "#f44336"
      });
      
      // On mobile, collapse the accordion after adding
      if (isMobile) {
        setExpandedAccordion(false);
      }
    }
  };
  
  const updateFestival = (id, field, value) => {
    const updatedFestivals = festivals.map(fest => 
      fest.id === id ? { ...fest, [field]: value } : fest
    );
    onChange(updatedFestivals);
  };
  
  const removeFestival = (id) => {
    const updatedFestivals = festivals.filter(fest => fest.id !== id);
    onChange(updatedFestivals);
  };
  
  const getEnglishMonthName = (monthNumber) => {
    return englishMonths[monthNumber - 1] || "";
  };
  
  const handleDateChange = (date, festivalId = null) => {
    if (!date) return;
    
    if (festivalId) {
      // For editing existing festival
      updateFestival(festivalId, "month", date.getMonth() + 1);
      updateFestival(festivalId, "day", date.getDate());
    } else {
      // For new festival
      setNewFestival({
        ...newFestival,
        month: date.getMonth() + 1,
        day: date.getDate()
      });
      setSelectedDate(date);
    }
  };
  
  const getDateFromFestival = (festival) => {
    try {
      // Create a date from the festival's month and day
      return parse(
        `${festival.day.toString().padStart(2, '0')}-${festival.month.toString().padStart(2, '0')}-${currentYear}`,
        'dd-MM-yyyy',
        new Date()
      );
    } catch (error) {
      return new Date();
    }
  };
  
  // Toggle accordion expansion
  const handleAccordionChange = () => {
    setExpandedAccordion(!expandedAccordion);
  };
  
  // Get serial number for a festival
  const getSerialNumber = (festivalName) => {
    return serialNumberMap[festivalName] || '';
  };
  
  // Render serial number badge/chip
  const renderSerialNumber = (festivalName) => {
    const serialNumber = getSerialNumber(festivalName);
    
    if (!serialNumber) return null;
    
    return (
      <Tooltip title="Festival Serial Number">
        <Chip
          size="small"
          label={`#${serialNumber}`}
          sx={{
            height: 22,
            fontSize: '0.7rem',
            ml: 1,
            bgcolor: '#673ab7',
            color: 'white',
          }}
        />
      </Tooltip>
    );
  };
  
  // Mobile card view for festivals
  const renderMobileView = () => {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box className="mobile-festival-list">
          <Accordion
            expanded={expandedAccordion}
            onChange={handleAccordionChange}
            className="add-festival-accordion"
            sx={{
              mb: 3,
              backgroundColor: "rgba(103, 58, 183, 0.05)",
              border: "1px solid rgba(103, 58, 183, 0.1)",
              borderRadius: "8px !important",
              '&::before': {
                display: 'none',
              },
              overflow: 'hidden'
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="add-festival-content"
              id="add-festival-header"
              sx={{ 
                minHeight: '48px', 
                '& .MuiAccordionSummary-content': { margin: '8px 0' }
              }}
            >
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
                <AddIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                Add New Festival
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              <Grid container spacing={isSmallMobile ? 1 : 2}>
                <Grid item xs={12}>
                  <DatePicker
                    label="Festival Date"
                    value={selectedDate}
                    onChange={(newDate) => handleDateChange(newDate)}
                    slotProps={{ 
                      textField: { 
                        fullWidth: true,
                        size: "small",
                        sx: { mb: isSmallMobile ? 0.5 : 1 }
                      },
                      mobileDialog: {
                        sx: { '& .MuiDialogActions-root': { p: 2 } }
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Festival Name"
                    size="small"
                    value={newFestival.name}
                    onChange={(e) => setNewFestival({ ...newFestival, name: e.target.value })}
                    sx={{ mb: isSmallMobile ? 0.5 : 1 }}
                    inputProps={{ maxLength: 40 }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Color"
                    size="small"
                    value={newFestival.color}
                    onChange={(e) => setNewFestival({ ...newFestival, color: e.target.value })}
                    sx={{ mb: isSmallMobile ? 0.5 : 1 }}
                  >
                    {festivalColors.map((color) => (
                      <MenuItem key={color.value} value={color.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ 
                            width: 16, 
                            height: 16, 
                            borderRadius: '50%', 
                            bgcolor: color.value, 
                            mr: 1 
                          }} />
                          {color.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid item xs={12}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    color="primary"
                    onClick={addFestival}
                    disabled={!newFestival.name.trim()}
                    sx={{ 
                      height: isSmallMobile ? '38px' : '44px',
                      mt: isSmallMobile ? 0 : 0.5
                    }}
                    startIcon={<AddIcon />}
                  >
                    Add Festival
                  </Button>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Festivals ({festivals.length})
            </Typography>
            {festivals.length > 0 && !expandedAccordion && (
              <Button 
                size="small" 
                color="primary"
                onClick={() => setExpandedAccordion(true)}
                startIcon={<AddIcon />}
                variant="outlined"
              >
                Add New
              </Button>
            )}
          </Box>
          
          {festivals.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              No festivals added yet. Add your first festival above.
            </Typography>
          ) : (
            <Box>
              {festivals.map((festival) => (
                <Card 
                  key={festival.id} 
                  sx={{ 
                    mb: 2, 
                    borderLeft: `4px solid ${festival.color}`,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }
                  }}
                  className="festival-card"
                >
                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 500, 
                          mb: 1, 
                          color: festival.color,
                          fontSize: isSmallMobile ? '1rem' : '1.1rem',
                          display: 'flex',
                          alignItems: 'center',
                          flexWrap: 'wrap'
                        }}
                      >
                        {festival.name}
                        {renderSerialNumber(festival.name)}
                      </Typography>
                      <Chip 
                        label={`ID: ${festival.id}`} 
                        size="small" 
                        sx={{ 
                          fontSize: '0.7rem', 
                          height: '20px',
                          bgcolor: 'rgba(0,0,0,0.05)'
                        }} 
                      />
                    </Box>
                    
                    {editingId === festival.id ? (
                      <Grid container spacing={isSmallMobile ? 1 : 2} sx={{ mt: 0 }}>
                        <Grid item xs={12}>
                          <DatePicker
                            label="Festival Date"
                            value={getDateFromFestival(festival)}
                            onChange={(newDate) => handleDateChange(newDate, festival.id)}
                            slotProps={{ 
                              textField: { 
                                fullWidth: true,
                                size: "small",
                                sx: { mb: isSmallMobile ? 0.5 : 1 }
                              } 
                            }}
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Festival Name"
                            size="small"
                            value={festival.name}
                            onChange={(e) => updateFestival(festival.id, "name", e.target.value)}
                            sx={{ mb: isSmallMobile ? 0.5 : 1 }}
                            inputProps={{ maxLength: 40 }}
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <TextField
                            select
                            fullWidth
                            label="Color"
                            size="small"
                            value={festival.color || "#f44336"}
                            onChange={(e) => updateFestival(festival.id, "color", e.target.value)}
                            sx={{ mb: isSmallMobile ? 0.5 : 1 }}
                          >
                            {festivalColors.map((color) => (
                              <MenuItem key={color.value} value={color.value}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Box sx={{ 
                                    width: 16, 
                                    height: 16, 
                                    borderRadius: '50%', 
                                    bgcolor: color.value, 
                                    mr: 1 
                                  }} />
                                  {color.label}
                                </Box>
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                      </Grid>
                    ) : (
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, flexWrap: 'wrap' }}>
                          <Typography variant="body2" sx={{ 
                            mr: 1, 
                            color: 'text.secondary',
                            fontSize: isSmallMobile ? '0.75rem' : '0.875rem'
                          }}>
                            <EventIcon sx={{ 
                              fontSize: isSmallMobile ? '0.9rem' : '1rem', 
                              mr: 0.5, 
                              verticalAlign: 'text-bottom' 
                            }}/>
                            Date:
                          </Typography>
                          <Typography variant="body1" sx={{ 
                            fontWeight: 500,
                            fontSize: isSmallMobile ? '0.85rem' : '0.95rem'
                          }}>
                            {festival.day} {getEnglishMonthName(festival.month)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Typography variant="body2" sx={{ 
                            mr: 2, 
                            color: 'text.secondary',
                            fontSize: isSmallMobile ? '0.75rem' : '0.875rem'
                          }}>
                            Color:
                          </Typography>
                          <Box sx={{ 
                            width: isSmallMobile ? 20 : 24, 
                            height: isSmallMobile ? 20 : 24, 
                            borderRadius: '50%', 
                            bgcolor: festival.color || '#f44336', 
                            mr: 1 
                          }} />
                        </Box>
                      </>
                    )}
                  </CardContent>
                  
                  <Divider />
                  
                  <CardActions sx={{ 
                    justifyContent: 'space-between', 
                    px: isSmallMobile ? 1 : 2,
                    py: isSmallMobile ? 0.5 : 1
                  }}>
                    {editingId === festival.id ? (
                      <Button 
                        size="small" 
                        onClick={() => setEditingId(null)}
                        color="primary"
                        startIcon={<CheckIcon />}
                        variant="outlined"
                      >
                        {isSmallMobile ? '' : 'Done'}
                      </Button>
                    ) : (
                      <Button 
                        size="small" 
                        onClick={() => setEditingId(festival.id)}
                        startIcon={<EditIcon />}
                        color="primary"
                        variant="outlined"
                      >
                        {isSmallMobile ? '' : 'Edit'}
                      </Button>
                    )}
                    <Button 
                      size="small" 
                      onClick={() => removeFestival(festival.id)}
                      startIcon={<DeleteIcon />}
                      color="error"
                      variant="outlined"
                    >
                      {isSmallMobile ? '' : 'Remove'}
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      </LocalizationProvider>
    );
  };

  // Tablet view - simplified table with date picker
  const renderTabletView = () => {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box>
          <Paper elevation={1} sx={{ 
            p: { sm: 2, md: 3 }, 
            mb: 3, 
            backgroundColor: "rgba(103, 58, 183, 0.05)",
            borderRadius: '8px'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" gutterBottom>Add New Festival</Typography>
            </Box>
            
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <DatePicker
                  label="Festival Date"
                  value={selectedDate}
                  onChange={(newDate) => handleDateChange(newDate)}
                  slotProps={{ 
                    textField: { 
                      fullWidth: true,
                      size: "small"
                    } 
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Festival Name"
                  size="small"
                  value={newFestival.name}
                  onChange={(e) => setNewFestival({ ...newFestival, name: e.target.value })}
                  inputProps={{ maxLength: 40 }}
                />
              </Grid>
              
              <Grid item xs={6} sm={2}>
                <TextField
                  select
                  fullWidth
                  label="Color"
                  size="small"
                  value={newFestival.color}
                  onChange={(e) => setNewFestival({ ...newFestival, color: e.target.value })}
                >
                  {festivalColors.map((color) => (
                    <MenuItem key={color.value} value={color.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ 
                          width: 16, 
                          height: 16, 
                          borderRadius: '50%', 
                          bgcolor: color.value, 
                          mr: 1 
                        }} />
                        {isTablet ? '' : color.label}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={6} sm={2}>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={addFestival}
                  disabled={!newFestival.name.trim()}
                  sx={{ height: '40px' }}
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Paper>
          
          {festivals.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              No festivals added yet. Add your first festival above.
            </Typography>
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Festival List ({festivals.length})
                </Typography>
              </Box>
              
              <Box sx={{ overflowX: 'auto' }}>
                <Table sx={{ 
                  border: '1px solid rgba(224, 224, 224, 1)',
                  minWidth: 650
                }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "rgba(103, 58, 183, 0.1)" }}>
                      <TableCell sx={{ py: 1.5 }}>ID</TableCell>
                      <TableCell sx={{ py: 1.5 }}>Serial</TableCell>
                      <TableCell sx={{ py: 1.5 }}>Date</TableCell>
                      <TableCell sx={{ py: 1.5 }}>Festival Name</TableCell>
                      <TableCell align="center" sx={{ py: 1.5 }}>Color</TableCell>
                      <TableCell align="right" sx={{ py: 1.5 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {festivals.map((festival) => (
                      <TableRow key={festival.id} hover>
                        <TableCell sx={{ py: 1.5 }}>{festival.id}</TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          {getSerialNumber(festival.name) && (
                            <Chip
                              size="small"
                              label={`#${getSerialNumber(festival.name)}`}
                              sx={{
                                bgcolor: '#673ab7',
                                color: 'white',
                                fontSize: '0.7rem'
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <DatePicker
                            value={getDateFromFestival(festival)}
                            onChange={(newDate) => handleDateChange(newDate, festival.id)}
                            slotProps={{ 
                              textField: { 
                                size: "small",
                                sx: { width: 140 }
                              } 
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <TextField
                            fullWidth
                            size="small"
                            value={festival.name}
                            onChange={(e) => updateFestival(festival.id, "name", e.target.value)}
                            inputProps={{ maxLength: 40 }}
                          />
                        </TableCell>
                        <TableCell align="center" sx={{ py: 1.5 }}>
                          <TextField
                            select
                            size="small"
                            value={festival.color || "#f44336"}
                            onChange={(e) => updateFestival(festival.id, "color", e.target.value)}
                            sx={{ width: 90 }}
                          >
                            {festivalColors.map((color) => (
                              <MenuItem key={color.value} value={color.value}>
                                <Box sx={{ 
                                  width: 20, 
                                  height: 20, 
                                  borderRadius: '50%', 
                                  bgcolor: color.value
                                }} />
                              </MenuItem>
                            ))}
                          </TextField>
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.5 }}>
                          <IconButton 
                            color="error" 
                            onClick={() => removeFestival(festival.id)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </>
          )}
        </Box>
      </LocalizationProvider>
    );
  };

  // Desktop view - full table with date picker
  const renderDesktopView = () => {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box>
          <Paper elevation={1} sx={{ 
            p: 3, 
            mb: 3, 
            backgroundColor: "rgba(103, 58, 183, 0.05)",
            borderRadius: '8px'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Add New Festival</Typography>
            </Box>
            
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <DatePicker
                  label="Festival Date"
                  value={selectedDate}
                  onChange={(newDate) => handleDateChange(newDate)}
                  slotProps={{ 
                    textField: { 
                      fullWidth: true,
                      size: "small"
                    } 
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Festival Name"
                  size="small"
                  value={newFestival.name}
                  onChange={(e) => setNewFestival({ ...newFestival, name: e.target.value })}
                  inputProps={{ maxLength: 40 }}
                />
              </Grid>
              
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Color"
                  size="small"
                  value={newFestival.color}
                  onChange={(e) => setNewFestival({ ...newFestival, color: e.target.value })}
                >
                  {festivalColors.map((color) => (
                    <MenuItem key={color.value} value={color.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ 
                          width: 16, 
                          height: 16, 
                          borderRadius: '50%', 
                          bgcolor: color.value, 
                          mr: 1 
                        }} />
                        {color.label}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={addFestival}
                  disabled={!newFestival.name.trim()}
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Paper>
          
          {festivals.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              No festivals added yet. Add your first festival above.
            </Typography>
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Festival List ({festivals.length})
                </Typography>
              </Box>
              
              <Box sx={{ overflowX: 'auto' }}>
                <Table sx={{ 
                  border: '1px solid rgba(224, 224, 224, 1)',
                  minWidth: 800
                }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "rgba(103, 58, 183, 0.1)" }}>
                      <TableCell sx={{ py: 2 }}>ID</TableCell>
                      <TableCell sx={{ py: 2 }}>Serial</TableCell>
                      <TableCell sx={{ py: 2 }}>Date</TableCell>
                      <TableCell sx={{ py: 2 }}>Festival Name</TableCell>
                      <TableCell sx={{ py: 2 }}>Color</TableCell>
                      <TableCell align="right" sx={{ py: 2 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {festivals.map((festival) => (
                      <TableRow key={festival.id} hover>
                        <TableCell sx={{ py: 1.5 }}>{festival.id}</TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          {getSerialNumber(festival.name) && (
                            <Chip
                              size="small"
                              label={`Serial : ${getSerialNumber(festival.name)}`}
                              sx={{
                                bgcolor: '#4dc8e0ff',
                                color: 'white',
                                fontSize: '0.7rem'
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell sx={{ py: 1.5, minWidth: 180 }}>
                          <DatePicker
                            value={getDateFromFestival(festival)}
                            onChange={(newDate) => handleDateChange(newDate, festival.id)}
                            slotProps={{ 
                              textField: { 
                                size: "small",
                                fullWidth: true
                              } 
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <TextField
                            fullWidth
                            size="small"
                            value={festival.name}
                            onChange={(e) => updateFestival(festival.id, "name", e.target.value)}
                            inputProps={{ maxLength: 40 }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <TextField
                            select
                            size="small"
                            value={festival.color || "#f44336"}
                            onChange={(e) => updateFestival(festival.id, "color", e.target.value)}
                            sx={{ width: 120 }}
                          >
                            {festivalColors.map((color) => (
                              <MenuItem key={color.value} value={color.value}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Box sx={{ 
                                    width: 16, 
                                    height: 16, 
                                    borderRadius: '50%', 
                                    bgcolor: color.value, 
                                    mr: 1 
                                  }} />
                                  {color.label}
                                </Box>
                              </MenuItem>
                            ))}
                          </TextField>
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.5 }}>
                          <Tooltip title="Delete Festival">
                            <IconButton 
                              color="error" 
                              onClick={() => removeFestival(festival.id)}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </>
          )}
        </Box>
      </LocalizationProvider>
    );
  };

  // Render the appropriate view based on screen size
  if (isMobile) {
    return renderMobileView();
  } else if (isTablet) {
    return renderTabletView();
  } else {
    return renderDesktopView();
  }
}

export default FestivalSettings;


// import React, { useState } from "react";
// import { 
//   Box, Typography, Paper, Grid, TextField, MenuItem, Button, 
//   Table, TableHead, TableRow, TableCell, TableBody, IconButton,
//   Card, CardContent, CardActions, Divider, useMediaQuery, useTheme,
//   Accordion, AccordionSummary, AccordionDetails, Chip, InputLabel,
//   FormControl, Select, FormHelperText, Stack, Tooltip
// } from "@mui/material";
// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import DeleteIcon from "@mui/icons-material/Delete";
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import EditIcon from "@mui/icons-material/Edit";
// import AddIcon from '@mui/icons-material/Add';
// import EventIcon from '@mui/icons-material/Event';
// import CheckIcon from '@mui/icons-material/Check';
// import { englishMonths, festivalColors } from "./constants";
// import { format, parse, setYear } from "date-fns";

// function FestivalSettings({ festivals, onChange }) {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isTablet = useMediaQuery(theme.breakpoints.down('md'));
//   const isSmallMobile = useMediaQuery('(max-width:400px)');
  
//   const currentYear = new Date().getFullYear();
//   const [selectedDate, setSelectedDate] = useState(new Date());
  
//   const [newFestival, setNewFestival] = useState({ 
//     month: selectedDate.getMonth() + 1, 
//     day: selectedDate.getDate(), 
//     name: "", 
//     color: "#f44336",
//     year: currentYear
//   });
  
//   const [editingId, setEditingId] = useState(null);
//   const [expandedAccordion, setExpandedAccordion] = useState(isMobile);
  
//   // Generate year options for dropdown (current year +/- 5 years)
//   const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
  
//   const addFestival = () => {
//     if (newFestival.name.trim()) {
//       // Get next ID in sequence
//       const maxId = festivals.length > 0 ? Math.max(...festivals.map(f => f.id)) : 0;
//       const updatedFestivals = [...festivals, { ...newFestival, id: maxId + 1 }];
//       onChange(updatedFestivals);
      
//       // Reset form but keep the date the same
//       setNewFestival({ 
//         month: selectedDate.getMonth() + 1, 
//         day: selectedDate.getDate(), 
//         name: "", 
//         color: "#f44336",
//         year: currentYear
//       });
      
//       // On mobile, collapse the accordion after adding
//       if (isMobile) {
//         setExpandedAccordion(false);
//       }
//     }
//   };
  
//   const updateFestival = (id, field, value) => {
//     const updatedFestivals = festivals.map(fest => 
//       fest.id === id ? { ...fest, [field]: value } : fest
//     );
//     onChange(updatedFestivals);
//   };
  
//   const removeFestival = (id) => {
//     const updatedFestivals = festivals.filter(fest => fest.id !== id);
//     onChange(updatedFestivals);
//   };
  
//   const getEnglishMonthName = (monthNumber) => {
//     return englishMonths[monthNumber - 1] || "";
//   };
  
//   const handleDateChange = (date, festivalId = null) => {
//     if (!date) return;
    
//     if (festivalId) {
//       // For editing existing festival
//       updateFestival(festivalId, "month", date.getMonth() + 1);
//       updateFestival(festivalId, "day", date.getDate());
//     } else {
//       // For new festival
//       setNewFestival({
//         ...newFestival,
//         month: date.getMonth() + 1,
//         day: date.getDate()
//       });
//       setSelectedDate(date);
//     }
//   };
  
//   const getDateFromFestival = (festival) => {
//     try {
//       // Create a date from the festival's month and day
//       return parse(
//         `${festival.day.toString().padStart(2, '0')}-${festival.month.toString().padStart(2, '0')}-${festival.year || currentYear}`,
//         'dd-MM-yyyy',
//         new Date()
//       );
//     } catch (error) {
//       return new Date();
//     }
//   };
  
//   // Handle year change
//   const handleYearChange = (year, festivalId = null) => {
//     if (festivalId) {
//       updateFestival(festivalId, "year", year);
//     } else {
//       setNewFestival({
//         ...newFestival,
//         year
//       });
//     }
//   };
  
//   // Toggle accordion expansion
//   const handleAccordionChange = () => {
//     setExpandedAccordion(!expandedAccordion);
//   };
  
//   // Mobile card view for festivals
//   const renderMobileView = () => {
//     return (
//       <LocalizationProvider dateAdapter={AdapterDateFns}>
//         <Box className="mobile-festival-list">
//           <Accordion
//             expanded={expandedAccordion}
//             onChange={handleAccordionChange}
//             className="add-festival-accordion"
//             sx={{
//               mb: 3,
//               backgroundColor: "rgba(103, 58, 183, 0.05)",
//               border: "1px solid rgba(103, 58, 183, 0.1)",
//               borderRadius: "8px !important",
//               '&::before': {
//                 display: 'none',
//               },
//               overflow: 'hidden'
//             }}
//           >
//             <AccordionSummary
//               expandIcon={<ExpandMoreIcon />}
//               aria-controls="add-festival-content"
//               id="add-festival-header"
//               sx={{ 
//                 minHeight: '48px', 
//                 '& .MuiAccordionSummary-content': { margin: '8px 0' }
//               }}
//             >
//               <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
//                 <AddIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
//                 Add New Festival
//               </Typography>
//             </AccordionSummary>
//             <AccordionDetails sx={{ pt: 0 }}>
//               <Grid container spacing={isSmallMobile ? 1 : 2}>
//                 <Grid item xs={12}>
//                   <DatePicker
//                     label="Festival Date"
//                     value={selectedDate}
//                     onChange={(newDate) => handleDateChange(newDate)}
//                     slotProps={{ 
//                       textField: { 
//                         fullWidth: true,
//                         size: "small",
//                         sx: { mb: isSmallMobile ? 0.5 : 1 }
//                       },
//                       mobileDialog: {
//                         sx: { '& .MuiDialogActions-root': { p: 2 } }
//                       }
//                     }}
//                   />
//                 </Grid>
                
//                 <Grid item xs={12} >
//                   <TextField
//                     fullWidth
//                     label="Festival Name"
//                     size="small"
//                     value={newFestival.name}
//                     onChange={(e) => setNewFestival({ ...newFestival, name: e.target.value })}
//                     sx={{ mb: isSmallMobile ? 0.5 : 1  }}
//                     inputProps={{ maxLength: 40 }}
//                   />
//                 </Grid>
                
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     select
//                     fullWidth
//                     label="Color"
//                     size="small"
//                     value={newFestival.color}
//                     onChange={(e) => setNewFestival({ ...newFestival, color: e.target.value })}
//                     sx={{ mb: isSmallMobile ? 0.5 : 1 }}
//                   >
//                     {festivalColors.map((color) => (
//                       <MenuItem key={color.value} value={color.value}>
//                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                           <Box sx={{ 
//                             width: 16, 
//                             height: 16, 
//                             borderRadius: '50%', 
//                             bgcolor: color.value, 
//                             mr: 1 
//                           }} />
//                           {color.label}
//                         </Box>
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </Grid>
                
//                 {/* <Grid item xs={12} sm={6}>
//                   <FormControl fullWidth size="small" sx={{ mb: isSmallMobile ? 0.5 : 1 }}>
//                     <InputLabel id="new-festival-year-label">Year</InputLabel>
//                     <Select
//                       labelId="new-festival-year-label"
//                       value={newFestival.year || currentYear}
//                       label="Year"
//                       onChange={(e) => handleYearChange(e.target.value)}
//                     >
//                       {yearOptions.map(year => (
//                         <MenuItem key={year} value={year}>{year}</MenuItem>
//                       ))}
//                     </Select>
//                     <FormHelperText>Optional</FormHelperText>
//                   </FormControl>
//                 </Grid> */}
                
//                 <Grid item xs={12}>
//                   <Button 
//                     variant="contained" 
//                     fullWidth
//                     color="primary"
//                     onClick={addFestival}
//                     disabled={!newFestival.name.trim()}
//                     sx={{ 
//                       height: isSmallMobile ? '38px' : '44px',
//                       mt: isSmallMobile ? 0 : 0.5
//                     }}
//                     startIcon={<AddIcon />}
//                   >
//                     Add Festival
//                   </Button>
//                 </Grid>
//               </Grid>
//             </AccordionDetails>
//           </Accordion>
          
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//             <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
//               Festivals ({festivals.length})
//             </Typography>
//             {/* {festivals.length > 0 && !expandedAccordion && (
//               <Button 
//                 size="small" 
//                 color="primary"
//                 onClick={() => setExpandedAccordion(true)}
//                 startIcon={<AddIcon />}
//                 variant="outlined"
//               >
//                 Add New
//               </Button>
//             )} */}
//           </Box>
          
//           {festivals.length === 0 ? (
//             <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
//               No festivals added yet. Add your first festival above.
//             </Typography>
//           ) : (
//             <Box>
//               {festivals.map((festival) => (
//                 <Card 
//                   key={festival.id} 
//                   sx={{ 
//                     mb: 2, 
//                     borderLeft: `4px solid ${festival.color}`,
//                     transition: 'all 0.2s ease',
//                     '&:hover': {
//                       boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
//                     }
//                   }}
//                   className="festival-card"
//                 >
//                   <CardContent sx={{ pb: 1 }}>
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                       <Typography 
//                         variant="h6" 
//                         sx={{ 
//                           fontWeight: 500, 
//                           mb: 1, 
//                           color: festival.color,
//                           fontSize: isSmallMobile ? '1rem' : '1.1rem'
//                         }}
//                       >
//                         {festival.name}
//                       </Typography>
//                       <Chip 
//                         label={`#${festival.id}`} 
//                         size="small" 
//                         sx={{ 
//                           fontSize: '0.7rem', 
//                           height: '20px',
//                           bgcolor: 'rgba(0,0,0,0.05)'
//                         }} 
//                       />
//                     </Box>
                    
//                     {editingId === festival.id ? (
//                       <Grid container spacing={isSmallMobile ? 1 : 2} sx={{ mt: 0 }}>
//                         <Grid item xs={12}>
//                           <DatePicker
//                             label="Festival Date"
//                             value={getDateFromFestival(festival)}
//                             onChange={(newDate) => handleDateChange(newDate, festival.id)}
//                             slotProps={{ 
//                               textField: { 
//                                 fullWidth: true,
//                                 size: "small",
//                                 sx: { mb: isSmallMobile ? 0.5 : 1 }
//                               } 
//                             }}
//                           />
//                         </Grid>
                        
//                         <Grid item xs={12}>
//                           <TextField
//                             fullWidth
//                             label="Festival Name"
//                             size="small"
//                             value={festival.name}
//                             onChange={(e) => updateFestival(festival.id, "name", e.target.value)}
//                             sx={{ mb: isSmallMobile ? 0.5 : 1 }}
//                             inputProps={{ maxLength: 40 }}
//                           />
//                         </Grid>
                        
//                         <Grid item xs={12} sm={6}>
//                           <TextField
//                             select
//                             fullWidth
//                             label="Color"
//                             size="small"
//                             value={festival.color || "#f44336"}
//                             onChange={(e) => updateFestival(festival.id, "color", e.target.value)}
//                             sx={{ mb: isSmallMobile ? 0.5 : 1 }}
//                           >
//                             {festivalColors.map((color) => (
//                               <MenuItem key={color.value} value={color.value}>
//                                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                   <Box sx={{ 
//                                     width: 16, 
//                                     height: 16, 
//                                     borderRadius: '50%', 
//                                     bgcolor: color.value, 
//                                     mr: 1 
//                                   }} />
//                                   {color.label}
//                                 </Box>
//                               </MenuItem>
//                             ))}
//                           </TextField>
//                         </Grid>
                        
//                         <Grid item xs={12} sm={6}>
//                           <FormControl fullWidth size="small" sx={{ mb: isSmallMobile ? 0.5 : 1 }}>
//                             <InputLabel id={`festival-${festival.id}-year-label`}>Year</InputLabel>
//                             <Select
//                               labelId={`festival-${festival.id}-year-label`}
//                               value={festival.year || currentYear}
//                               label="Year"
//                               onChange={(e) => handleYearChange(e.target.value, festival.id)}
//                             >
//                               {yearOptions.map(year => (
//                                 <MenuItem key={year} value={year}>{year}</MenuItem>
//                               ))}
//                             </Select>
//                           </FormControl>
//                         </Grid>
//                       </Grid>
//                     ) : (
//                       <>
//                         <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, flexWrap: 'wrap' }}>
//                           <Typography variant="body2" sx={{ 
//                             mr: 1, 
//                             color: 'text.secondary',
//                             fontSize: isSmallMobile ? '0.75rem' : '0.875rem'
//                           }}>
//                             <EventIcon sx={{ 
//                               fontSize: isSmallMobile ? '0.9rem' : '1rem', 
//                               mr: 0.5, 
//                               verticalAlign: 'text-bottom' 
//                             }}/>
//                             Date:
//                           </Typography>
//                           <Typography variant="body1" sx={{ 
//                             fontWeight: 500,
//                             fontSize: isSmallMobile ? '0.85rem' : '0.95rem'
//                           }}>
//                             {festival.day} {getEnglishMonthName(festival.month)}{festival.year ? ` ${festival.year}` : ''}
//                           </Typography>
//                         </Box>
                        
//                         <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
//                           <Typography variant="body2" sx={{ 
//                             mr: 2, 
//                             color: 'text.secondary',
//                             fontSize: isSmallMobile ? '0.75rem' : '0.875rem'
//                           }}>
//                             Color:
//                           </Typography>
//                           <Box sx={{ 
//                             width: isSmallMobile ? 20 : 24, 
//                             height: isSmallMobile ? 20 : 24, 
//                             borderRadius: '50%', 
//                             bgcolor: festival.color || '#f44336', 
//                             mr: 1 
//                           }} />
//                         </Box>
//                       </>
//                     )}
//                   </CardContent>
                  
//                   <Divider />
                  
//                   <CardActions sx={{ 
//                     justifyContent: 'space-between', 
//                     px: isSmallMobile ? 1 : 2,
//                     py: isSmallMobile ? 0.5 : 1
//                   }}>
//                     {editingId === festival.id ? (
//                       <Button 
//                         size="small" 
//                         onClick={() => setEditingId(null)}
//                         color="primary"
//                         startIcon={<CheckIcon />}
//                         variant="outlined"
//                       >
//                         {isSmallMobile ? '' : 'Done'}
//                       </Button>
//                     ) : (
//                       <Button 
//                         size="small" 
//                         onClick={() => setEditingId(festival.id)}
//                         startIcon={<EditIcon />}
//                         color="primary"
//                         variant="outlined"
//                       >
//                         {isSmallMobile ? '' : 'Edit'}
//                       </Button>
//                     )}
//                     <Button 
//                       size="small" 
//                       onClick={() => removeFestival(festival.id)}
//                       startIcon={<DeleteIcon />}
//                       color="error"
//                       variant="outlined"
//                     >
//                       {isSmallMobile ? '' : 'Remove'}
//                     </Button>
//                   </CardActions>
//                 </Card>
//               ))}
//             </Box>
//           )}
//         </Box>
//       </LocalizationProvider>
//     );
//   };

//   // Tablet view - simplified table with date picker
//   const renderTabletView = () => {
//     return (
//       <LocalizationProvider dateAdapter={AdapterDateFns}>
//         <Box>
//           <Paper elevation={1} sx={{ 
//             p: { sm: 2, md: 3 }, 
//             mb: 3, 
//             backgroundColor: "rgba(103, 58, 183, 0.05)",
//             borderRadius: '8px'
//           }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//               <Typography variant="h6" gutterBottom>Add New Festival</Typography>
//             </Box>
            
//             <Grid container spacing={2} alignItems="center">
//               <Grid item xs={12} sm={4}>
//                 <DatePicker
//                   label="Festival Date"
//                   value={selectedDate}
//                   onChange={(newDate) => handleDateChange(newDate)}
//                   slotProps={{ 
//                     textField: { 
//                       fullWidth: true,
//                       size: "small"
//                     } 
//                   }}
//                 />
//               </Grid>
              
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   fullWidth
//                   label="Festival Name"
//                   size="small"
//                   value={newFestival.name}
//                   onChange={(e) => setNewFestival({ ...newFestival, name: e.target.value })}
//                   inputProps={{ maxLength: 40 }}
                  
//                 />
//               </Grid>
              
//               <Grid item xs={6} sm={2}>
//                 <TextField
//                   select
//                   fullWidth
//                   label="Color"
//                   size="small"
//                   value={newFestival.color}
//                   onChange={(e) => setNewFestival({ ...newFestival, color: e.target.value })}
//                 >
//                   {festivalColors.map((color) => (
//                     <MenuItem key={color.value} value={color.value}>
//                       <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                         <Box sx={{ 
//                           width: 16, 
//                           height: 16, 
//                           borderRadius: '50%', 
//                           bgcolor: color.value, 
//                           mr: 1 
//                         }} />
//                         {isTablet ? '' : color.label}
//                       </Box>
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>
              
//               <Grid item xs={6} sm={2}>
//                 <Button 
//                   variant="contained" 
//                   fullWidth
//                   onClick={addFestival}
//                   disabled={!newFestival.name.trim()}
//                   sx={{ height: '40px' }}
//                   startIcon={<AddIcon />}
//                 >
//                   Add
//                 </Button>
//               </Grid>
//             </Grid>
//           </Paper>
          
//           {festivals.length === 0 ? (
//             <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
//               No festivals added yet. Add your first festival above.
//             </Typography>
//           ) : (
//             <>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//                 <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
//                   Festival List ({festivals.length})
//                 </Typography>
//               </Box>
              
//               <Box sx={{ overflowX: 'auto' }}>
//                 <Table sx={{ 
//                   border: '1px solid rgba(224, 224, 224, 1)',
//                   minWidth: 650
//                 }}>
//                   <TableHead>
//                     <TableRow sx={{ backgroundColor: "rgba(103, 58, 183, 0.1)" }}>
//                       <TableCell sx={{ py: 1.5 }}>ID</TableCell>
//                       <TableCell sx={{ py: 1.5 }}>Date</TableCell>
//                       <TableCell sx={{ py: 1.5 }}>Festival Name</TableCell>
//                       <TableCell align="center" sx={{ py: 1.5 }}>Color</TableCell>
//                       <TableCell align="right" sx={{ py: 1.5 }}>Actions</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {festivals.map((festival) => (
//                       <TableRow key={festival.id} hover>
//                         <TableCell sx={{ py: 1.5 }}>{festival.id}</TableCell>
//                         <TableCell sx={{ py: 1.5 }}>
//                           <Stack direction="row" spacing={1} alignItems="center">
//                             <DatePicker
//                               value={getDateFromFestival(festival)}
//                               onChange={(newDate) => handleDateChange(newDate, festival.id)}
//                               slotProps={{ 
//                                 textField: { 
//                                   size: "small",
//                                   sx: { width: 140 }
//                                 } 
//                               }}
//                             />
//                             {/* <FormControl size="small" sx={{ width: 80 }}>
//                               <InputLabel id={`festival-${festival.id}-year-label-tablet`}>Year</InputLabel>
//                               <Select
//                                 labelId={`festival-${festival.id}-year-label-tablet`}
//                                 value={festival.year || currentYear}
//                                 label="Year"
//                                 onChange={(e) => handleYearChange(e.target.value, festival.id)}
//                               >
//                                 {yearOptions.map(year => (
//                                   <MenuItem key={year} value={year}>{year}</MenuItem>
//                                 ))}
//                               </Select>
//                             </FormControl> */}
//                           </Stack>
//                         </TableCell>
//                         <TableCell sx={{ py: 1.5 }}>
//                           <TextField
//                             fullWidth
//                             size="small"
//                             value={festival.name}
//                             onChange={(e) => updateFestival(festival.id, "name", e.target.value)}
//                             inputProps={{ maxLength: 40 }}
//                           />
//                         </TableCell>
//                         <TableCell align="center" sx={{ py: 1.5 }}>
//                           <TextField
//                             select
//                             size="small"
//                             value={festival.color || "#f44336"}
//                             onChange={(e) => updateFestival(festival.id, "color", e.target.value)}
//                             sx={{ width: 90 }}
//                           >
//                             {festivalColors.map((color) => (
//                               <MenuItem key={color.value} value={color.value}>
//                                 <Box sx={{ 
//                                   width: 20, 
//                                   height: 20, 
//                                   borderRadius: '50%', 
//                                   bgcolor: color.value
//                                 }} />
//                               </MenuItem>
//                             ))}
//                           </TextField>
//                         </TableCell>
//                         <TableCell align="right" sx={{ py: 1.5 }}>
//                           <IconButton 
//                             color="error" 
//                             onClick={() => removeFestival(festival.id)}
//                             size="small"
//                           >
//                             <DeleteIcon />
//                           </IconButton>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </Box>
//             </>
//           )}
//         </Box>
//       </LocalizationProvider>
//     );
//   };

//   // Desktop view - full table with date picker
//   const renderDesktopView = () => {
//     return (
//       <LocalizationProvider dateAdapter={AdapterDateFns}>
//         <Box>
//           <Paper elevation={1} sx={{ 
//             p: 3, 
//             mb: 3, 
//             backgroundColor: "rgba(103, 58, 183, 0.05)",
//             borderRadius: '8px'
//           }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//               <Typography variant="h6">Add New Festival</Typography>
//             </Box>
            
//             <Grid container spacing={2} alignItems="center">
//               <Grid item xs={12} md={3}>
//                 <DatePicker
//                   label="Festival Date"
//                   value={selectedDate}
//                   onChange={(newDate) => handleDateChange(newDate)}
//                   slotProps={{ 
//                     textField: { 
//                       fullWidth: true,
//                       size: "small"
//                     } 
//                   }}
//                 />
//               </Grid>
              
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Festival Name"
//                   size="small"
//                   value={newFestival.name}
//                   onChange={(e) => setNewFestival({ ...newFestival, name: e.target.value })}
//                   inputProps={{ maxLength: 40 }}
//                 />
//               </Grid>
              
//               <Grid item xs={12} md={3}>
//                 <TextField
//                   select
//                   fullWidth
//                   label="Color"
//                   size="small"
//                   value={newFestival.color}
//                   onChange={(e) => setNewFestival({ ...newFestival, color: e.target.value })}
//                 >
//                   {festivalColors.map((color) => (
//                     <MenuItem key={color.value} value={color.value}>
//                       <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                         <Box sx={{ 
//                           width: 16, 
//                           height: 16, 
//                           borderRadius: '50%', 
//                           bgcolor: color.value, 
//                           mr: 1 
//                         }} />
//                         {color.label}
//                       </Box>
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>
              
//               <Grid item xs={12} md={2}>
//                 <Button 
//                   variant="contained" 
//                   fullWidth
//                   onClick={addFestival}
//                   disabled={!newFestival.name.trim()}
//                   startIcon={<AddIcon />}
//                 >
//                   Add
//                 </Button>
//               </Grid>
//             </Grid>
//           </Paper>
          
//           {festivals.length === 0 ? (
//             <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
//               No festivals added yet. Add your first festival above.
//             </Typography>
//           ) : (
//             <>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//                 <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
//                   Festival List ({festivals.length})
//                 </Typography>
//               </Box>
              
//               <Box sx={{ overflowX: 'auto' }}>
//                 <Table sx={{ 
//                   border: '1px solid rgba(224, 224, 224, 1)',
//                   minWidth: 800
//                 }}>
//                   <TableHead>
//                     <TableRow sx={{ backgroundColor: "rgba(103, 58, 183, 0.1)" }}>
//                       <TableCell sx={{ py: 2 }}>ID</TableCell>
//                       <TableCell sx={{ py: 2 }}>Date</TableCell>
//                       {/* <TableCell sx={{ py: 2 }}>Year</TableCell> */}
//                       <TableCell sx={{ py: 2 }}>Festival Name</TableCell>
//                       <TableCell sx={{ py: 2 }}>Color</TableCell>
//                       <TableCell align="right" sx={{ py: 2 }}>Actions</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {festivals.map((festival) => (
//                       <TableRow key={festival.id} hover>
//                         <TableCell sx={{ py: 1.5 }}>{festival.id}</TableCell>
//                         <TableCell sx={{ py: 1.5, minWidth: 180 }}>
//                           <DatePicker
//                             value={getDateFromFestival(festival)}
//                             onChange={(newDate) => handleDateChange(newDate, festival.id)}
//                             slotProps={{ 
//                               textField: { 
//                                 size: "small",
//                                 fullWidth: true
//                               } 
//                             }}
//                           />
//                         </TableCell>
//                         {/* <TableCell sx={{ py: 1.5, minWidth: 100 }}>
//                           <FormControl fullWidth size="small">
//                             <InputLabel id={`festival-${festival.id}-year-label-desktop`}>Year</InputLabel>
//                             <Select
//                               labelId={`festival-${festival.id}-year-label-desktop`}
//                               value={festival.year || currentYear}
//                               label="Year"
//                               onChange={(e) => handleYearChange(e.target.value, festival.id)}
//                             >
//                               {yearOptions.map(year => (
//                                 <MenuItem key={year} value={year}>{year}</MenuItem>
//                               ))}
//                             </Select>
//                           </FormControl>
//                         </TableCell> */}
//                         <TableCell sx={{ py: 1.5 }}>
//                           <TextField
//                             fullWidth
//                             size="small"
//                             value={festival.name}
//                             onChange={(e) => updateFestival(festival.id, "name", e.target.value)}
//                             inputProps={{ maxLength: 40 }}
//                           />
//                         </TableCell>
//                         <TableCell sx={{ py: 1.5 }}>
//                           <TextField
//                             select
//                             size="small"
//                             value={festival.color || "#f44336"}
//                             onChange={(e) => updateFestival(festival.id, "color", e.target.value)}
//                             sx={{ width: 120 }}
//                           >
//                             {festivalColors.map((color) => (
//                               <MenuItem key={color.value} value={color.value}>
//                                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                   <Box sx={{ 
//                                     width: 16, 
//                                     height: 16, 
//                                     borderRadius: '50%', 
//                                     bgcolor: color.value, 
//                                     mr: 1 
//                                   }} />
//                                   {color.label}
//                                 </Box>
//                               </MenuItem>
//                             ))}
//                           </TextField>
//                         </TableCell>
//                         <TableCell align="right" sx={{ py: 1.5 }}>
//                           <Tooltip title="Delete Festival">
//                             <IconButton 
//                               color="error" 
//                               onClick={() => removeFestival(festival.id)}
//                               size="small"
//                             >
//                               <DeleteIcon />
//                             </IconButton>
//                           </Tooltip>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </Box>
//             </>
//           )}
//         </Box>
//       </LocalizationProvider>
//     );
//   };

//   // Render the appropriate view based on screen size
//   if (isMobile) {
//     return renderMobileView();
//   } else if (isTablet) {
//     return renderTabletView();
//   } else {
//     return renderDesktopView();
//   }
// }

// export default FestivalSettings;


// import React, { useState } from "react";
// import { 
//   Box, Typography, Paper, Grid, TextField, MenuItem, Button, 
//   Table, TableHead, TableRow, TableCell, TableBody, IconButton,
//   Card, CardContent, CardActions, Divider, useMediaQuery, useTheme,
//   Accordion, AccordionSummary, AccordionDetails, Chip, InputLabel,
//   FormControl, Select, FormHelperText
// } from "@mui/material";
// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import DeleteIcon from "@mui/icons-material/Delete";
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import EditIcon from '@mui/icons-material/Edit';
// import AddIcon from '@mui/icons-material/Add';
// import EventIcon from '@mui/icons-material/Event';
// import { englishMonths, festivalColors } from "./constants";
// import { format, parse, setYear } from "date-fns";

// function FestivalSettings({ festivals, onChange }) {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
//   const currentYear = new Date().getFullYear();
//   const [selectedDate, setSelectedDate] = useState(new Date());
  
//   const [newFestival, setNewFestival] = useState({ 
//     month: 1, 
//     day: 1, 
//     name: "", 
//     color: "#f44336",
//     year: currentYear
//   });
  
//   const [editingId, setEditingId] = useState(null);
  
//   // Generate year options for dropdown (current year +/- 5 years)
//   const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
  
//   const addFestival = () => {
//     if (newFestival.name.trim()) {
//       // Get next ID in sequence
//       const maxId = festivals.length > 0 ? Math.max(...festivals.map(f => f.id)) : 0;
//       const updatedFestivals = [...festivals, { ...newFestival, id: maxId + 1 }];
//       onChange(updatedFestivals);
//       setNewFestival({ 
//         month: 1, 
//         day: 1, 
//         name: "", 
//         color: "#f44336",
//         year: currentYear
//       });
//     }
//   };
  
//   const updateFestival = (id, field, value) => {
//     const updatedFestivals = festivals.map(fest => 
//       fest.id === id ? { ...fest, [field]: value } : fest
//     );
//     onChange(updatedFestivals);
//   };
  
//   const removeFestival = (id) => {
//     const updatedFestivals = festivals.filter(fest => fest.id !== id);
//     onChange(updatedFestivals);
//   };
  
//   const getEnglishMonthName = (monthNumber) => {
//     return englishMonths[monthNumber - 1] || "";
//   };
  
//   const handleDateChange = (date, festivalId = null) => {
//     if (!date) return;
    
//     if (festivalId) {
//       // For editing existing festival
//       updateFestival(festivalId, "month", date.getMonth() + 1);
//       updateFestival(festivalId, "day", date.getDate());
//     } else {
//       // For new festival
//       setNewFestival({
//         ...newFestival,
//         month: date.getMonth() + 1,
//         day: date.getDate()
//       });
//       setSelectedDate(date);
//     }
//   };
  
//   const getDateFromFestival = (festival) => {
//     try {
//       // Create a date from the festival's month and day
//       return parse(
//         `${festival.day.toString().padStart(2, '0')}-${festival.month.toString().padStart(2, '0')}-${festival.year || currentYear}`,
//         'dd-MM-yyyy',
//         new Date()
//       );
//     } catch (error) {
//       return new Date();
//     }
//   };
  
//   // Handle year change
//   const handleYearChange = (year, festivalId = null) => {
//     if (festivalId) {
//       updateFestival(festivalId, "year", year);
//     } else {
//       setNewFestival({
//         ...newFestival,
//         year
//       });
//     }
//   };
  
//   // Mobile card view for festivals
//   const renderMobileView = () => {
//     return (
//       <LocalizationProvider dateAdapter={AdapterDateFns}>
//         <Box className="mobile-festival-list">
//           <Accordion
//             expanded={true}
//             className="add-festival-accordion"
//             sx={{
//               mb: 3,
//               backgroundColor: "rgba(103, 58, 183, 0.05)",
//               border: "1px solid rgba(103, 58, 183, 0.1)",
//               borderRadius: "8px",
//               '&::before': {
//                 display: 'none',
//               },
//             }}
//           >
//             <AccordionSummary
//               expandIcon={<ExpandMoreIcon />}
//               aria-controls="add-festival-content"
//               id="add-festival-header"
//             >
//               <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
//                 <AddIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
//                 Add New Festival
//               </Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <Grid container spacing={2}>
//                 <Grid item xs={12}>
//                   <DatePicker
//                     label="Festival Date"
//                     value={selectedDate}
//                     onChange={(newDate) => handleDateChange(newDate)}
//                     slotProps={{ 
//                       textField: { 
//                         fullWidth: true,
//                         size: "small",
//                         sx: { mb: 1 }
//                       } 
//                     }}
//                   />
//                 </Grid>
                
//                 <Grid item xs={12}>
//                   <FormControl fullWidth size="small">
//                     <InputLabel id="new-festival-year-label">Year</InputLabel>
//                     <Select
//                       labelId="new-festival-year-label"
//                       value={newFestival.year || currentYear}
//                       label="Year"
//                       onChange={(e) => handleYearChange(e.target.value)}
//                     >
//                       {yearOptions.map(year => (
//                         <MenuItem key={year} value={year}>{year}</MenuItem>
//                       ))}
//                     </Select>
//                     <FormHelperText>Optional: defaults to current year</FormHelperText>
//                   </FormControl>
//                 </Grid>
                
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Festival Name"
//                     size="small"
//                     value={newFestival.name}
//                     onChange={(e) => setNewFestival({ ...newFestival, name: e.target.value })}
//                     sx={{ mb: 1 }}
//                   />
//                 </Grid>
                
//                 <Grid item xs={12}>
//                   <TextField
//                     select
//                     fullWidth
//                     label="Color"
//                     size="small"
//                     value={newFestival.color}
//                     onChange={(e) => setNewFestival({ ...newFestival, color: e.target.value })}
//                   >
//                     {festivalColors.map((color) => (
//                       <MenuItem key={color.value} value={color.value}>
//                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                           <Box sx={{ 
//                             width: 16, 
//                             height: 16, 
//                             borderRadius: '50%', 
//                             bgcolor: color.value, 
//                             mr: 1 
//                           }} />
//                           {color.label}
//                         </Box>
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </Grid>
                
//                 <Grid item xs={12}>
//                   <Button 
//                     variant="contained" 
//                     fullWidth
//                     color="primary"
//                     onClick={addFestival}
//                     disabled={!newFestival.name.trim()}
//                     sx={{ mt: 1, height: '44px' }}
//                   >
//                     Add Festival
//                   </Button>
//                 </Grid>
//               </Grid>
//             </AccordionDetails>
//           </Accordion>
          
//           {festivals.length === 0 ? (
//             <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
//               No festivals added yet. Add your first festival above.
//             </Typography>
//           ) : (
//             <Box>
//               {festivals.map((festival) => (
//                 <Card 
//                   key={festival.id} 
//                   sx={{ 
//                     mb: 2, 
//                     borderLeft: `4px solid ${festival.color}`,
//                     transition: 'all 0.2s ease',
//                     '&:hover': {
//                       boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
//                     }
//                   }}
//                   className="festival-card"
//                 >
//                   <CardContent sx={{ pb: 1 }}>
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                       <Typography variant="h6" sx={{ fontWeight: 500, mb: 1, color: festival.color }}>
//                         {festival.name}
//                       </Typography>
//                       <Chip 
//                         label={`ID: ${festival.id}`} 
//                         size="small" 
//                         sx={{ 
//                           fontSize: '0.7rem', 
//                           height: '20px',
//                           bgcolor: 'rgba(0,0,0,0.05)'
//                         }} 
//                       />
//                     </Box>
                    
//                     {editingId === festival.id ? (
//                       <Grid container spacing={2} sx={{ mt: 1 }}>
//                         <Grid item xs={12}>
//                           <DatePicker
//                             label="Festival Date"
//                             value={getDateFromFestival(festival)}
//                             onChange={(newDate) => handleDateChange(newDate, festival.id)}
//                             slotProps={{ 
//                               textField: { 
//                                 fullWidth: true,
//                                 size: "small",
//                                 sx: { mb: 1 }
//                               } 
//                             }}
//                           />
//                         </Grid>
                        
//                         <Grid item xs={12}>
//                           <FormControl fullWidth size="small" sx={{ mb: 1 }}>
//                             <InputLabel id={`festival-${festival.id}-year-label`}>Year</InputLabel>
//                             <Select
//                               labelId={`festival-${festival.id}-year-label`}
//                               value={festival.year || currentYear}
//                               label="Year"
//                               onChange={(e) => handleYearChange(e.target.value, festival.id)}
//                             >
//                               {yearOptions.map(year => (
//                                 <MenuItem key={year} value={year}>{year}</MenuItem>
//                               ))}
//                             </Select>
//                           </FormControl>
//                         </Grid>
                        
//                         <Grid item xs={12}>
//                           <TextField
//                             fullWidth
//                             label="Festival Name"
//                             size="small"
//                             value={festival.name}
//                             onChange={(e) => updateFestival(festival.id, "name", e.target.value)}
//                             sx={{ mb: 1 }}
//                           />
//                         </Grid>
                        
//                         <Grid item xs={12}>
//                           <TextField
//                             select
//                             fullWidth
//                             label="Color"
//                             size="small"
//                             value={festival.color || "#f44336"}
//                             onChange={(e) => updateFestival(festival.id, "color", e.target.value)}
//                           >
//                             {festivalColors.map((color) => (
//                               <MenuItem key={color.value} value={color.value}>
//                                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                   <Box sx={{ 
//                                     width: 16, 
//                                     height: 16, 
//                                     borderRadius: '50%', 
//                                     bgcolor: color.value, 
//                                     mr: 1 
//                                   }} />
//                                   {color.label}
//                                 </Box>
//                               </MenuItem>
//                             ))}
//                           </TextField>
//                         </Grid>
//                       </Grid>
//                     ) : (
//                       <>
//                         <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, flexWrap: 'wrap' }}>
//                           <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>
//                             <EventIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'text-bottom' }}/>
//                             Date:
//                           </Typography>
//                           <Typography variant="body1" sx={{ fontWeight: 500 }}>
//                             {festival.day} {getEnglishMonthName(festival.month)}{festival.year ? ` ${festival.year}` : ''}
//                           </Typography>
//                         </Box>
                        
//                         <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
//                           <Typography variant="body2" sx={{ mr: 2, color: 'text.secondary' }}>
//                             Color:
//                           </Typography>
//                           <Box sx={{ 
//                             width: 24, 
//                             height: 24, 
//                             borderRadius: '50%', 
//                             bgcolor: festival.color || '#f44336', 
//                             mr: 1 
//                           }} />
//                         </Box>
//                       </>
//                     )}
//                   </CardContent>
                  
//                   <Divider />
                  
//                   <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
//                     {editingId === festival.id ? (
//                       <Button 
//                         size="small" 
//                         onClick={() => setEditingId(null)}
//                         color="primary"
//                       >
//                         Done
//                       </Button>
//                     ) : (
//                       <Button 
//                         size="small" 
//                         onClick={() => setEditingId(festival.id)}
//                         startIcon={<EditIcon />}
//                         color="primary"
//                       >
//                         Edit
//                       </Button>
//                     )}
//                     <Button 
//                       size="small" 
//                       onClick={() => removeFestival(festival.id)}
//                       startIcon={<DeleteIcon />}
//                       color="error"
//                     >
//                       Remove
//                     </Button>
//                   </CardActions>
//                 </Card>
//               ))}
//             </Box>
//           )}
//         </Box>
//       </LocalizationProvider>
//     );
//   };

//   // Tablet view - simplified table with date picker
//   const renderTabletView = () => {
//     return (
//       <LocalizationProvider dateAdapter={AdapterDateFns}>
//         <Box>
//           <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: "rgba(103, 58, 183, 0.05)" }}>
//             <Typography variant="subtitle1" gutterBottom>Add New Festival</Typography>
//             <Grid container spacing={2} alignItems="center">
//               <Grid item xs={12} sm={6}>
//                 <DatePicker
//                   label="Festival Date"
//                   value={selectedDate}
//                   onChange={(newDate) => handleDateChange(newDate)}
//                   slotProps={{ 
//                     textField: { 
//                       fullWidth: true,
//                       size: "small"
//                     } 
//                   }}
//                 />
//               </Grid>
              
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth size="small">
//                   <InputLabel id="new-festival-year-label">Year</InputLabel>
//                   <Select
//                     labelId="new-festival-year-label"
//                     value={newFestival.year || currentYear}
//                     label="Year"
//                     onChange={(e) => handleYearChange(e.target.value)}
//                   >
//                     {yearOptions.map(year => (
//                       <MenuItem key={year} value={year}>{year}</MenuItem>
//                     ))}
//                   </Select>
//                   <FormHelperText>Optional: defaults to current year</FormHelperText>
//                 </FormControl>
//               </Grid>
              
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Festival Name"
//                   size="small"
//                   value={newFestival.name}
//                   onChange={(e) => setNewFestival({ ...newFestival, name: e.target.value })}
//                 />
//               </Grid>
              
//               <Grid item xs={8} sm={3}>
//                 <TextField
//                   select
//                   fullWidth
//                   label="Color"
//                   size="small"
//                   value={newFestival.color}
//                   onChange={(e) => setNewFestival({ ...newFestival, color: e.target.value })}
//                 >
//                   {festivalColors.map((color) => (
//                     <MenuItem key={color.value} value={color.value}>
//                       <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                         <Box sx={{ 
//                           width: 16, 
//                           height: 16, 
//                           borderRadius: '50%', 
//                           bgcolor: color.value, 
//                           mr: 1 
//                         }} />
//                         {color.label}
//                       </Box>
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>
              
//               <Grid item xs={4} sm={3}>
//                 <Button 
//                   variant="contained" 
//                   fullWidth
//                   onClick={addFestival}
//                   disabled={!newFestival.name.trim()}
//                   sx={{ height: { xs: '40px', sm: 'auto' } }}
//                 >
//                   Add
//                 </Button>
//               </Grid>
//             </Grid>
//           </Paper>
          
//           {festivals.length === 0 ? (
//             <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
//               No festivals added yet. Add your first festival above.
//             </Typography>
//           ) : (
//             <Table sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: "rgba(103, 58, 183, 0.1)" }}>
//                   <TableCell>ID</TableCell>
//                   <TableCell>Date</TableCell>
//                   <TableCell>Festival Name</TableCell>
//                   <TableCell align="center">Color</TableCell>
//                   <TableCell align="right">Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {festivals.map((festival) => (
//                   <TableRow key={festival.id} hover>
//                     <TableCell>{festival.id}</TableCell>
//                     <TableCell>
//                       <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
//                         <DatePicker
//                           value={getDateFromFestival(festival)}
//                           onChange={(newDate) => handleDateChange(newDate, festival.id)}
//                           slotProps={{ 
//                             textField: { 
//                               size: "small",
//                               sx: { width: 140 }
//                             } 
//                           }}
//                         />
//                         <FormControl size="small" sx={{ width: 90 }}>
//                           <InputLabel id={`festival-${festival.id}-year-label-tablet`}>Year</InputLabel>
//                           <Select
//                             labelId={`festival-${festival.id}-year-label-tablet`}
//                             value={festival.year || currentYear}
//                             label="Year"
//                             onChange={(e) => handleYearChange(e.target.value, festival.id)}
//                           >
//                             {yearOptions.map(year => (
//                               <MenuItem key={year} value={year}>{year}</MenuItem>
//                             ))}
//                           </Select>
//                         </FormControl>
//                       </Box>
//                     </TableCell>
//                     <TableCell>
//                       <TextField
//                         fullWidth
//                         size="small"
//                         value={festival.name}
//                         onChange={(e) => updateFestival(festival.id, "name", e.target.value)}
//                       />
//                     </TableCell>
//                     <TableCell align="center">
//                       <TextField
//                         select
//                         size="small"
//                         value={festival.color || "#f44336"}
//                         onChange={(e) => updateFestival(festival.id, "color", e.target.value)}
//                         sx={{ width: 100 }}
//                       >
//                         {festivalColors.map((color) => (
//                           <MenuItem key={color.value} value={color.value}>
//                             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                               <Box sx={{ 
//                                 width: 16, 
//                                 height: 16, 
//                                 borderRadius: '50%', 
//                                 bgcolor: color.value, 
//                                 mr: 1 
//                               }} />
//                             </Box>
//                           </MenuItem>
//                         ))}
//                       </TextField>
//                     </TableCell>
//                     <TableCell align="right">
//                       <IconButton 
//                         color="error" 
//                         onClick={() => removeFestival(festival.id)}
//                         size="small"
//                       >
//                         <DeleteIcon />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </Box>
//       </LocalizationProvider>
//     );
//   };

//   // Desktop view - full table with date picker
//   const renderDesktopView = () => {
//     return (
//       <LocalizationProvider dateAdapter={AdapterDateFns}>
//         <Box>
//           <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: "rgba(103, 58, 183, 0.05)" }}>
//             <Typography variant="h6" gutterBottom>Add New Festival</Typography>
//             <Grid container spacing={2} alignItems="center">
//               <Grid item xs={12} md={3}>
//                 <DatePicker
//                   label="Festival Date"
//                   value={selectedDate}
//                   onChange={(newDate) => handleDateChange(newDate)}
//                   slotProps={{ 
//                     textField: { 
//                       fullWidth: true,
//                       size: "small"
//                     } 
//                   }}
//                 />
//               </Grid>
              
//               {/* <Grid item xs={12} md={2}>
//                 <FormControl fullWidth size="small">
//                   <InputLabel id="new-festival-year-label-desktop">Year</InputLabel>
//                   <Select
//                     labelId="new-festival-year-label-desktop"
//                     value={newFestival.year || currentYear}
//                     label="Year"
//                     onChange={(e) => handleYearChange(e.target.value)}
//                   >
//                     {yearOptions.map(year => (
//                       <MenuItem key={year} value={year}>{year}</MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid> */}
              
//               <Grid item xs={12} md={3}>
//                 <TextField
//                   fullWidth
//                   label="Festival Name"
//                   size="small"
//                   value={newFestival.name}
//                   onChange={(e) => setNewFestival({ ...newFestival, name: e.target.value })}
//                 />
//               </Grid>
              
//               <Grid item xs={12} md={2}>
//                 <TextField
//                   select
//                   fullWidth
//                   label="Color"
//                   size="small"
//                   value={newFestival.color}
//                   onChange={(e) => setNewFestival({ ...newFestival, color: e.target.value })}
//                 >
//                   {festivalColors.map((color) => (
//                     <MenuItem key={color.value} value={color.value}>
//                       <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                         <Box sx={{ 
//                           width: 16, 
//                           height: 16, 
//                           borderRadius: '50%', 
//                           bgcolor: color.value, 
//                           mr: 1 
//                         }} />
//                         {color.label}
//                       </Box>
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>
              
//               <Grid item xs={12} md={2}>
//                 <Button 
//                   variant="contained" 
//                   fullWidth
//                   onClick={addFestival}
//                   disabled={!newFestival.name.trim()}
//                 >
//                   Add
//                 </Button>
//               </Grid>
//             </Grid>
//           </Paper>
          
//           {festivals.length === 0 ? (
//             <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
//               No festivals added yet. Add your first festival above.
//             </Typography>
//           ) : (
//             <Table sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: "rgba(103, 58, 183, 0.1)" }}>
//                   <TableCell>ID</TableCell>
//                   <TableCell>Date</TableCell>
//                   {/* <TableCell>Year</TableCell> */}
//                   <TableCell>Festival Name</TableCell>
//                   <TableCell>Color</TableCell>
//                   <TableCell align="right">Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {festivals.map((festival) => (
//                   <TableRow key={festival.id} hover>
//                     <TableCell>{festival.id}</TableCell>
//                     <TableCell sx={{ minWidth: 180 }}>
//                       <DatePicker
//                         value={getDateFromFestival(festival)}
//                         onChange={(newDate) => handleDateChange(newDate, festival.id)}
//                         slotProps={{ 
//                           textField: { 
//                             size: "small",
//                             fullWidth: true
//                           } 
//                         }}
//                       />
//                     </TableCell>
//                     {/* <TableCell sx={{ minWidth: 100 }}>
//                       <FormControl fullWidth size="small">
//                         <InputLabel id={`festival-${festival.id}-year-label-desktop`}>Year</InputLabel>
//                         <Select
//                           labelId={`festival-${festival.id}-year-label-desktop`}
//                           value={festival.year || currentYear}
//                           label="Year"
//                           onChange={(e) => handleYearChange(e.target.value, festival.id)}
//                         >
//                           {yearOptions.map(year => (
//                             <MenuItem key={year} value={year}>{year}</MenuItem>
//                           ))}
//                         </Select>
//                       </FormControl>
//                     </TableCell> */}
//                     <TableCell>
//                       <TextField
//                         fullWidth
//                         size="small"
//                         value={festival.name}
//                         onChange={(e) => updateFestival(festival.id, "name", e.target.value)}
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <TextField
//                         select
//                         size="small"
//                         value={festival.color || "#f44336"}
//                         onChange={(e) => updateFestival(festival.id, "color", e.target.value)}
//                         sx={{ width: 120 }}
//                       >
//                         {festivalColors.map((color) => (
//                           <MenuItem key={color.value} value={color.value}>
//                             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                               <Box sx={{ 
//                                 width: 16, 
//                                 height: 16, 
//                                 borderRadius: '50%', 
//                                 bgcolor: color.value, 
//                                 mr: 1 
//                               }} />
//                               {color.label}
//                             </Box>
//                           </MenuItem>
//                         ))}
//                       </TextField>
//                     </TableCell>
//                     <TableCell align="right">
//                       <IconButton 
//                         color="error" 
//                         onClick={() => removeFestival(festival.id)}
//                         size="small"
//                       >
//                         <DeleteIcon />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </Box>
//       </LocalizationProvider>
//     );
//   };

//   // Render the appropriate view based on screen size
//   if (isMobile) {
//     return renderMobileView();
//   } else if (isTablet) {
//     return renderTabletView();
//   } else {
//     return renderDesktopView();
//   }
// }

// export default FestivalSettings;


// import React, { useState } from "react";
// import { 
//   Box, Typography, Paper, Grid, TextField, MenuItem, Button, 
//   Table, TableHead, TableRow, TableCell, TableBody, IconButton,
//   Card, CardContent, CardActions, Divider, useMediaQuery, useTheme,
//   Accordion, AccordionSummary, AccordionDetails, Chip
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import EditIcon from '@mui/icons-material/Edit';
// import AddIcon from '@mui/icons-material/Add';
// import { tamilMonths, festivalColors } from "./constants";

// function FestivalSettings({ festivals, onChange }) {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
//   const [newFestival, setNewFestival] = useState({ 
//     month: 1, day: 1, name: "", color: "#f44336" 
//   });
  
//   const [editingId, setEditingId] = useState(null);
  
//   const addFestival = () => {
//     if (newFestival.name.trim()) {
//       // Get next ID in sequence
//       const maxId = festivals.length > 0 ? Math.max(...festivals.map(f => f.id)) : 0;
//       const updatedFestivals = [...festivals, { ...newFestival, id: maxId + 1 }];
//       onChange(updatedFestivals);
//       setNewFestival({ month: 1, day: 1, name: "", color: "#f44336" });
//     }
//   };
  
//   const updateFestival = (id, field, value) => {
//     const updatedFestivals = festivals.map(fest => 
//       fest.id === id ? { ...fest, [field]: value } : fest
//     );
//     onChange(updatedFestivals);
//   };
  
//   const removeFestival = (id) => {
//     const updatedFestivals = festivals.filter(fest => fest.id !== id);
//     onChange(updatedFestivals);
//   };
  
//   const getMonthName = (monthNumber) => {
//     return tamilMonths[monthNumber - 1] || "";
//   };
  
//   // Mobile card view for festivals
//   const renderMobileView = () => {
//     return (
//       <Box className="mobile-festival-list">
//         <Accordion
//           expanded={true}
//           className="add-festival-accordion"
//           sx={{
//             mb: 3,
//             backgroundColor: "rgba(103, 58, 183, 0.05)",
//             border: "1px solid rgba(103, 58, 183, 0.1)",
//             borderRadius: "8px",
//             '&::before': {
//               display: 'none',
//             },
//           }}
//         >
//           <AccordionSummary
//             expandIcon={<ExpandMoreIcon />}
//             aria-controls="add-festival-content"
//             id="add-festival-header"
//           >
//             <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
//               <AddIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
//               Add New Festival
//             </Typography>
//           </AccordionSummary>
//           <AccordionDetails>
//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <TextField
//                   select
//                   fullWidth
//                   label="Month"
//                   size="small"
//                   value={newFestival.month}
//                   onChange={(e) => setNewFestival({ ...newFestival, month: Number(e.target.value) })}
//                 >
//                   {tamilMonths.map((month, index) => (
//                     <MenuItem key={index} value={index + 1}>{month}</MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   type="number"
//                   fullWidth
//                   label="Day"
//                   size="small"
//                   value={newFestival.day}
//                   onChange={(e) => setNewFestival({ ...newFestival, day: Number(e.target.value) })}
//                   inputProps={{ min: 1, max: 31 }}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Festival Name"
//                   size="small"
//                   value={newFestival.name}
//                   onChange={(e) => setNewFestival({ ...newFestival, name: e.target.value })}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   select
//                   fullWidth
//                   label="Color"
//                   size="small"
//                   value={newFestival.color}
//                   onChange={(e) => setNewFestival({ ...newFestival, color: e.target.value })}
//                 >
//                   {festivalColors.map((color) => (
//                     <MenuItem key={color.value} value={color.value}>
//                       <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                         <Box sx={{ 
//                           width: 16, 
//                           height: 16, 
//                           borderRadius: '50%', 
//                           bgcolor: color.value, 
//                           mr: 1 
//                         }} />
//                         {color.label}
//                       </Box>
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>
//               <Grid item xs={12}>
//                 <Button 
//                   variant="contained" 
//                   fullWidth
//                   color="primary"
//                   onClick={addFestival}
//                   disabled={!newFestival.name.trim()}
//                   sx={{ mt: 1, height: '42px' }}
//                 >
//                   Add Festival
//                 </Button>
//               </Grid>
//             </Grid>
//           </AccordionDetails>
//         </Accordion>
        
//         {festivals.length === 0 ? (
//           <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
//             No festivals added yet. Add your first festival above.
//           </Typography>
//         ) : (
//           <Box>
//             {festivals.map((festival) => (
//               <Card 
//                 key={festival.id} 
//                 sx={{ 
//                   mb: 2, 
//                   borderLeft: `4px solid ${festival.color}`,
//                   transition: 'all 0.2s ease',
//                   '&:hover': {
//                     boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
//                   }
//                 }}
//                 className="festival-card"
//               >
//                 <CardContent sx={{ pb: 1 }}>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                     <Typography variant="h6" sx={{ fontWeight: 500, mb: 1, color: festival.color }}>
//                       {festival.name}
//                     </Typography>
//                     <Chip 
//                       label={`ID: ${festival.id}`} 
//                       size="small" 
//                       sx={{ 
//                         fontSize: '0.7rem', 
//                         height: '20px',
//                         bgcolor: 'rgba(0,0,0,0.05)'
//                       }} 
//                     />
//                   </Box>
                  
//                   {editingId === festival.id ? (
//                     <Grid container spacing={2} sx={{ mt: 1 }}>
//                       <Grid item xs={6}>
//                         <TextField
//                           select
//                           fullWidth
//                           label="Month"
//                           size="small"
//                           value={festival.month}
//                           onChange={(e) => updateFestival(festival.id, "month", Number(e.target.value))}
//                         >
//                           {tamilMonths.map((month, index) => (
//                             <MenuItem key={index} value={index + 1}>{month}</MenuItem>
//                           ))}
//                         </TextField>
//                       </Grid>
//                       <Grid item xs={6}>
//                         <TextField
//                           type="number"
//                           fullWidth
//                           label="Day"
//                           size="small"
//                           value={festival.day}
//                           onChange={(e) => updateFestival(festival.id, "day", Number(e.target.value))}
//                           inputProps={{ min: 1, max: 31 }}
//                         />
//                       </Grid>
//                       <Grid item xs={12}>
//                         <TextField
//                           fullWidth
//                           label="Festival Name"
//                           size="small"
//                           value={festival.name}
//                           onChange={(e) => updateFestival(festival.id, "name", e.target.value)}
//                         />
//                       </Grid>
//                       <Grid item xs={12}>
//                         <TextField
//                           select
//                           fullWidth
//                           label="Color"
//                           size="small"
//                           value={festival.color || "#f44336"}
//                           onChange={(e) => updateFestival(festival.id, "color", e.target.value)}
//                         >
//                           {festivalColors.map((color) => (
//                             <MenuItem key={color.value} value={color.value}>
//                               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                 <Box sx={{ 
//                                   width: 16, 
//                                   height: 16, 
//                                   borderRadius: '50%', 
//                                   bgcolor: color.value, 
//                                   mr: 1 
//                                 }} />
//                                 {color.label}
//                               </Box>
//                             </MenuItem>
//                           ))}
//                         </TextField>
//                       </Grid>
//                     </Grid>
//                   ) : (
//                     <>
//                       <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
//                         <Typography variant="body2" sx={{ mr: 2, color: 'text.secondary' }}>
//                           Date:
//                         </Typography>
//                         <Typography variant="body1" sx={{ fontWeight: 500 }}>
//                           {festival.day} {getMonthName(festival.month)}
//                         </Typography>
//                       </Box>
//                       <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
//                         <Typography variant="body2" sx={{ mr: 2, color: 'text.secondary' }}>
//                           Color:
//                         </Typography>
//                         <Box sx={{ 
//                           width: 24, 
//                           height: 24, 
//                           borderRadius: '50%', 
//                           bgcolor: festival.color || '#f44336', 
//                           mr: 1 
//                         }} />
//                       </Box>
//                     </>
//                   )}
//                 </CardContent>
                
//                 <Divider />
                
//                 <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
//                   {editingId === festival.id ? (
//                     <Button 
//                       size="small" 
//                       onClick={() => setEditingId(null)}
//                       color="primary"
//                     >
//                       Done
//                     </Button>
//                   ) : (
//                     <Button 
//                       size="small" 
//                       onClick={() => setEditingId(festival.id)}
//                       startIcon={<EditIcon />}
//                       color="primary"
//                     >
//                       Edit
//                     </Button>
//                   )}
//                   <Button 
//                     size="small" 
//                     onClick={() => removeFestival(festival.id)}
//                     startIcon={<DeleteIcon />}
//                     color="error"
//                   >
//                     Remove
//                   </Button>
//                 </CardActions>
//               </Card>
//             ))}
//           </Box>
//         )}
//       </Box>
//     );
//   };

//   // Tablet view - simplified table
//   const renderTabletView = () => {
//     return (
//       <Box>
//         <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: "rgba(103, 58, 183, 0.05)" }}>
//           <Typography variant="subtitle1" gutterBottom>Add New Festival</Typography>
//           <Grid container spacing={2} alignItems="center">
//             <Grid item xs={6} sm={3}>
//               <TextField
//                 select
//                 fullWidth
//                 label="Month"
//                 size="small"
//                 value={newFestival.month}
//                 onChange={(e) => setNewFestival({ ...newFestival, month: Number(e.target.value) })}
//               >
//                 {tamilMonths.map((month, index) => (
//                   <MenuItem key={index} value={index + 1}>{month}</MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//             <Grid item xs={6} sm={2}>
//               <TextField
//                 type="number"
//                 fullWidth
//                 label="Day"
//                 size="small"
//                 value={newFestival.day}
//                 onChange={(e) => setNewFestival({ ...newFestival, day: Number(e.target.value) })}
//                 inputProps={{ min: 1, max: 31 }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 fullWidth
//                 label="Festival Name"
//                 size="small"
//                 value={newFestival.name}
//                 onChange={(e) => setNewFestival({ ...newFestival, name: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={8} sm={3}>
//               <Box sx={{ display: 'flex' }}>
//                 <TextField
//                   select
//                   fullWidth
//                   label="Color"
//                   size="small"
//                   value={newFestival.color}
//                   onChange={(e) => setNewFestival({ ...newFestival, color: e.target.value })}
//                 >
//                   {festivalColors.map((color) => (
//                     <MenuItem key={color.value} value={color.value}>
//                       <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                         <Box sx={{ 
//                           width: 16, 
//                           height: 16, 
//                           borderRadius: '50%', 
//                           bgcolor: color.value, 
//                           mr: 1 
//                         }} />
//                         {color.label}
//                       </Box>
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Box>
//             </Grid>
//             <Grid item xs={4} sm={12}>
//               <Button 
//                 variant="contained" 
//                 fullWidth
//                 onClick={addFestival}
//                 disabled={!newFestival.name.trim()}
//                 sx={{ height: { xs: '40px', sm: 'auto' } }}
//               >
//                 Add
//               </Button>
//             </Grid>
//           </Grid>
//         </Paper>
        
//         {festivals.length === 0 ? (
//           <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
//             No festivals added yet. Add your first festival above.
//           </Typography>
//         ) : (
//           <Table sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
//             <TableHead>
//               <TableRow sx={{ backgroundColor: "rgba(103, 58, 183, 0.1)" }}>
//                 <TableCell>Date</TableCell>
//                 <TableCell>Festival Name</TableCell>
//                 <TableCell align="center">Color</TableCell>
//                 <TableCell align="right">Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {festivals.map((festival) => (
//                 <TableRow key={festival.id} hover>
//                   <TableCell>
//                     <Box sx={{ display: 'flex', gap: 1 }}>
//                       <TextField
//                         select
//                         size="small"
//                         value={festival.month}
//                         onChange={(e) => updateFestival(festival.id, "month", Number(e.target.value))}
//                         sx={{ width: 100 }}
//                       >
//                         {tamilMonths.map((month, index) => (
//                           <MenuItem key={index} value={index + 1}>{month}</MenuItem>
//                         ))}
//                       </TextField>
//                       <TextField
//                         type="number"
//                         size="small"
//                         value={festival.day}
//                         onChange={(e) => updateFestival(festival.id, "day", Number(e.target.value))}
//                         inputProps={{ min: 1, max: 31 }}
//                         sx={{ width: 60 }}
//                       />
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       value={festival.name}
//                       onChange={(e) => updateFestival(festival.id, "name", e.target.value)}
//                     />
//                   </TableCell>
//                   <TableCell align="center">
//                     <TextField
//                       select
//                       size="small"
//                       value={festival.color || "#f44336"}
//                       onChange={(e) => updateFestival(festival.id, "color", e.target.value)}
//                       sx={{ width: 100 }}
//                     >
//                       {festivalColors.map((color) => (
//                         <MenuItem key={color.value} value={color.value}>
//                           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                             <Box sx={{ 
//                               width: 16, 
//                               height: 16, 
//                               borderRadius: '50%', 
//                               bgcolor: color.value, 
//                               mr: 1 
//                             }} />
//                           </Box>
//                         </MenuItem>
//                       ))}
//                     </TextField>
//                   </TableCell>
//                   <TableCell align="right">
//                     <IconButton 
//                       color="error" 
//                       onClick={() => removeFestival(festival.id)}
//                       size="small"
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         )}
//       </Box>
//     );
//   };

//   // Desktop view - full table
//   const renderDesktopView = () => {
//     return (
//       <Box>
//         <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: "rgba(103, 58, 183, 0.05)" }}>
//           <Typography variant="h6" gutterBottom>Add New Festival</Typography>
//           <Grid container spacing={2} alignItems="center">
//             <Grid item xs={12} md={2}>
//               <TextField
//                 select
//                 fullWidth
//                 label="Month"
//                 size="small"
//                 value={newFestival.month}
//                 onChange={(e) => setNewFestival({ ...newFestival, month: Number(e.target.value) })}
//               >
//                 {tamilMonths.map((month, index) => (
//                   <MenuItem key={index} value={index + 1}>{month}</MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//             <Grid item xs={12} md={2}>
//               <TextField
//                 type="number"
//                 fullWidth
//                 label="Day"
//                 size="small"
//                 value={newFestival.day}
//                 onChange={(e) => setNewFestival({ ...newFestival, day: Number(e.target.value) })}
//                 inputProps={{ min: 1, max: 31 }}
//               />
//             </Grid>
//             <Grid item xs={12} md={3}>
//               <TextField
//                 fullWidth
//                 label="Festival Name"
//                 size="small"
//                 value={newFestival.name}
//                 onChange={(e) => setNewFestival({ ...newFestival, name: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} md={3}>
//               <TextField
//                 select
//                 fullWidth
//                 label="Color"
//                 size="small"
//                 value={newFestival.color}
//                 onChange={(e) => setNewFestival({ ...newFestival, color: e.target.value })}
//               >
//                 {festivalColors.map((color) => (
//                   <MenuItem key={color.value} value={color.value}>
//                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                       <Box sx={{ 
//                         width: 16, 
//                         height: 16, 
//                         borderRadius: '50%', 
//                         bgcolor: color.value, 
//                         mr: 1 
//                       }} />
//                       {color.label}
//                     </Box>
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//             <Grid item xs={12} md={2}>
//               <Button 
//                 variant="contained" 
//                 fullWidth
//                 onClick={addFestival}
//                 disabled={!newFestival.name.trim()}
//               >
//                 Add
//               </Button>
//             </Grid>
//           </Grid>
//         </Paper>
        
//         {festivals.length === 0 ? (
//           <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
//             No festivals added yet. Add your first festival above.
//           </Typography>
//         ) : (
//           <Table sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
//             <TableHead>
//               <TableRow sx={{ backgroundColor: "rgba(103, 58, 183, 0.1)" }}>
//                 <TableCell>ID</TableCell>
//                 <TableCell>Month</TableCell>
//                 <TableCell>Day</TableCell>
//                 <TableCell>Festival Name</TableCell>
//                 <TableCell>Color</TableCell>
//                 <TableCell align="right">Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {festivals.map((festival) => (
//                 <TableRow key={festival.id} hover>
//                   <TableCell>{festival.id}</TableCell>
//                   <TableCell>
//                     <TextField
//                       select
//                       size="small"
//                       value={festival.month}
//                       onChange={(e) => updateFestival(festival.id, "month", Number(e.target.value))}
//                       sx={{ width: 120 }}
//                     >
//                       {tamilMonths.map((month, index) => (
//                         <MenuItem key={index} value={index + 1}>{month}</MenuItem>
//                       ))}
//                     </TextField>
//                   </TableCell>
//                   <TableCell>
//                     <TextField
//                       type="number"
//                       size="small"
//                       value={festival.day}
//                       onChange={(e) => updateFestival(festival.id, "day", Number(e.target.value))}
//                       inputProps={{ min: 1, max: 31 }}
//                       sx={{ width: 70 }}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       value={festival.name}
//                       onChange={(e) => updateFestival(festival.id, "name", e.target.value)}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <TextField
//                       select
//                       size="small"
//                       value={festival.color || "#f44336"}
//                       onChange={(e) => updateFestival(festival.id, "color", e.target.value)}
//                       sx={{ width: 120 }}
//                     >
//                       {festivalColors.map((color) => (
//                         <MenuItem key={color.value} value={color.value}>
//                           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                             <Box sx={{ 
//                               width: 16, 
//                               height: 16, 
//                               borderRadius: '50%', 
//                               bgcolor: color.value, 
//                               mr: 1 
//                             }} />
//                             {color.label}
//                           </Box>
//                         </MenuItem>
//                       ))}
//                     </TextField>
//                   </TableCell>
//                   <TableCell align="right">
//                     <IconButton 
//                       color="error" 
//                       onClick={() => removeFestival(festival.id)}
//                       size="small"
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         )}
//       </Box>
//     );
//   };

//   // Render the appropriate view based on screen size
//   if (isMobile) {
//     return renderMobileView();
//   } else if (isTablet) {
//     return renderTabletView();
//   } else {
//     return renderDesktopView();
//   }
// }

// export default FestivalSettings;


// import React, { useState } from "react";
// import { 
//   Box, Typography, Paper, Grid, TextField, MenuItem, Button, 
//   Table, TableHead, TableRow, TableCell, TableBody, IconButton 
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { tamilMonths, festivalColors } from "./constants";

// function FestivalSettings({ festivals, onChange }) {
//   const [newFestival, setNewFestival] = useState({ 
//     month: 1, day: 1, name: "", color: "#f44336" 
//   });
  
//   const addFestival = () => {
//     if (newFestival.name.trim()) {
//       // Get next ID in sequence
//       const maxId = festivals.length > 0 ? Math.max(...festivals.map(f => f.id)) : 0;
//       const updatedFestivals = [...festivals, { ...newFestival, id: maxId + 1 }];
//       onChange(updatedFestivals);
//       setNewFestival({ month: 1, day: 1, name: "", color: "#f44336" });
//     }
//   };
  
//   const updateFestival = (id, field, value) => {
//     const updatedFestivals = festivals.map(fest => 
//       fest.id === id ? { ...fest, [field]: value } : fest
//     );
//     onChange(updatedFestivals);
//   };
  
//   const removeFestival = (id) => {
//     const updatedFestivals = festivals.filter(fest => fest.id !== id);
//     onChange(updatedFestivals);
//   };

//   return (
//     <Box>
//       <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: "rgba(63, 81, 181, 0.05)" }}>
//         <Typography variant="h6" gutterBottom>Add New Festival</Typography>
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12} md={2}>
//             <TextField
//               select
//               fullWidth
//               label="Month"
//               size="small"
//               value={newFestival.month}
//               onChange={(e) => setNewFestival({ ...newFestival, month: Number(e.target.value) })}
//             >
//               {tamilMonths.map((month, index) => (
//                 <MenuItem key={index} value={index + 1}>{month}</MenuItem>
//               ))}
//             </TextField>
//           </Grid>
//           <Grid item xs={12} md={2}>
//             <TextField
//               type="number"
//               fullWidth
//               label="Day"
//               size="small"
//               value={newFestival.day}
//               onChange={(e) => setNewFestival({ ...newFestival, day: Number(e.target.value) })}
//               inputProps={{ min: 1, max: 31 }}
//             />
//           </Grid>
//           <Grid item xs={12} md={3}>
//             <TextField
//               fullWidth
//               label="Festival Name"
//               size="small"
//               value={newFestival.name}
//               onChange={(e) => setNewFestival({ ...newFestival, name: e.target.value })}
//             />
//           </Grid>
//           <Grid item xs={12} md={3}>
//             <TextField
//               select
//               fullWidth
//               label="Color"
//               size="small"
//               value={newFestival.color}
//               onChange={(e) => setNewFestival({ ...newFestival, color: e.target.value })}
//             >
//               {festivalColors.map((color) => (
//                 <MenuItem key={color.value} value={color.value}>
//                   <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                     <Box sx={{ 
//                       width: 16, 
//                       height: 16, 
//                       borderRadius: '50%', 
//                       bgcolor: color.value, 
//                       mr: 1 
//                     }} />
//                     {color.label}
//                   </Box>
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Grid>
//           <Grid item xs={12} md={2}>
//             <Button 
//               variant="contained" 
//               fullWidth
//               onClick={addFestival}
//               disabled={!newFestival.name.trim()}
//             >
//               Add
//             </Button>
//           </Grid>
//         </Grid>
//       </Paper>
      
//       <Typography variant="h6" sx={{ mb: 2 }}>
//         Festival List ({festivals.length})
//       </Typography>
      
//       {festivals.length === 0 ? (
//         <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
//           No festivals added yet. Add your first festival above.
//         </Typography>
//       ) : (
//         <Table sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
//           <TableHead>
//             <TableRow sx={{ backgroundColor: "rgba(63, 81, 181, 0.1)" }}>
//               <TableCell>ID</TableCell>
//               <TableCell>Month</TableCell>
//               <TableCell>Day</TableCell>
//               <TableCell>Festival Name</TableCell>
//               <TableCell>Color</TableCell>
//               <TableCell align="right">Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {festivals.map((festival) => (
//               <TableRow key={festival.id} hover>
//                 <TableCell>{festival.id}</TableCell>
//                 <TableCell>
//                   <TextField
//                     select
//                     size="small"
//                     value={festival.month}
//                     onChange={(e) => updateFestival(festival.id, "month", Number(e.target.value))}
//                     sx={{ width: 120 }}
//                   >
//                     {tamilMonths.map((month, index) => (
//                       <MenuItem key={index} value={index + 1}>{month}</MenuItem>
//                     ))}
//                   </TextField>
//                 </TableCell>
//                 <TableCell>
//                   <TextField
//                     type="number"
//                     size="small"
//                     value={festival.day}
//                     onChange={(e) => updateFestival(festival.id, "day", Number(e.target.value))}
//                     inputProps={{ min: 1, max: 31 }}
//                     sx={{ width: 70 }}
//                   />
//                 </TableCell>
//                 <TableCell>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     value={festival.name}
//                     onChange={(e) => updateFestival(festival.id, "name", e.target.value)}
//                   />
//                 </TableCell>
//                 <TableCell>
//                   <TextField
//                     select
//                     size="small"
//                     value={festival.color || "#f44336"}
//                     onChange={(e) => updateFestival(festival.id, "color", e.target.value)}
//                     sx={{ width: 120 }}
//                   >
//                     {festivalColors.map((color) => (
//                       <MenuItem key={color.value} value={color.value}>
//                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                           <Box sx={{ 
//                             width: 16, 
//                             height: 16, 
//                             borderRadius: '50%', 
//                             bgcolor: color.value, 
//                             mr: 1 
//                           }} />
//                           {color.label}
//                         </Box>
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </TableCell>
//                 <TableCell align="right">
//                   <IconButton 
//                     color="error" 
//                     onClick={() => removeFestival(festival.id)}
//                     size="small"
//                   >
//                     <DeleteIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       )}
//     </Box>
//   );
// }

// export default FestivalSettings;
