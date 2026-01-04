import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Stack,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
  List,
  ListItem,
  ListItemText,
  alpha,
  Paper,
  Avatar,
  Card
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TodayIcon from "@mui/icons-material/Today";
import CloseIcon from "@mui/icons-material/Close";
import EventIcon from "@mui/icons-material/Event";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { motion } from "framer-motion";

// Modern professional color palette - Updated with more contemporary colors
const colors = {
  primary: {
    main: '#0f766e', // Teal-based primary
    dark: '#0e6b62',
    light: '#14b8a6',
    lighter: '#e0f2f1'
  },
  secondary: {
    main: '#475569',
    light: '#94a3b8'
  },
  success: {
    main: '#059669',
    light: '#d1fae5'
  },
  warning: {
    main: '#d97706',
    light: '#fef3c7'
  },
  background: {
    paper: '#ffffff',
    default: '#fafafa'
  },
  divider: '#e2e8f0',
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
    muted: '#94a3b8'
  }
};

// Animation variants - Refined for subtlety
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } }
};

const slideUp = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
};

/**
 * DateDetailsModal - A professional modal component for displaying calendar date information
 */
function DateDetailsModal({ open, data, onClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Safely extract data
  const dateFestivals = data?.festivals || [];
  const festivalCount = dateFestivals.length;
  
  // Check if date is today
  const isToday = () => {
    if (!data) return false;
    const today = new Date();
    return data.englishDate === today.getDate() && 
           data.englishMonth === today.toLocaleString('default', { month: 'long' });
  };

  // If no data, don't render anything
  if (!data) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="date-details-title"
      PaperComponent={motion.div}
      PaperProps={{ 
        component: Paper,
        elevation: 6,
        initial: "hidden",
        animate: "visible",
        variants: fadeIn,
        sx: { 
          borderRadius: 3,
          maxWidth: isMobile ? '95vw' : 450,
          overflow: 'hidden'
        }
      }}
    >
      {/* Simplified header */}
      <DialogTitle 
        id="date-details-title"
        component={motion.div}
        variants={slideUp}
        sx={{ 
          p: 2.5,
          background: colors.primary.main,
          color: "white"
        }}
      >
        <Stack 
          direction="row" 
          alignItems="center" 
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <CalendarMonthIcon sx={{ fontSize: '1.25rem' }} />
            <Typography variant="h6" sx={{ 
              fontWeight: 500,
              fontSize: '1.125rem'
            }}>
              Date Details
            </Typography>
          </Stack>
          
          <IconButton
            onClick={onClose}
            aria-label="Close dialog"
            size="small"
            sx={{ 
              color: 'white', 
              '&:hover': { bgcolor: alpha('#fff', 0.15) }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>
      
      <DialogContent 
        component={motion.div}
        variants={slideUp}
        sx={{ 
          px: 3, 
          pt: 3,
          pb: 2, 
          bgcolor: colors.background.default
        }}
      >
        <Stack spacing={2.5}>
          {/* English Date Card - Simplified */}
          <Card 
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: `1px solid ${colors.divider}`,
              bgcolor: colors.background.paper
            }}
          >
            <Stack spacing={1} alignItems="center">
              {/* Date Display */}
              <Box sx={{ position: 'relative', mb: 0.5 }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 700,
                    color: colors.primary.main,
                    lineHeight: 1.2,
                    fontSize: isMobile ? '2.5rem' : '3rem'
                  }}
                >
                  {data.englishDate}
                </Typography>
                
                {isToday() && (
                  <Chip 
                    size="small"
                    label="Today"
                    sx={{ 
                      position: 'absolute',
                      top: -8,
                      right: -42,
                      fontWeight: 500,
                      bgcolor: colors.primary.lighter,
                      color: colors.primary.main,
                      fontSize: '0.75rem',
                      height: 24
                    }}
                  />
                )}
              </Box>
              
              <Typography variant="subtitle1" sx={{
                color: colors.text.secondary,
                fontWeight: 500
              }}>
                {data.englishMonth} {data.englishYear}
              </Typography>
              
              <Chip 
                icon={<TodayIcon sx={{ fontSize: '0.875rem' }} />}
                label={data.dayOfWeek}
                size="small"
                sx={{ 
                  bgcolor: colors.primary.lighter,
                  color: colors.primary.main,
                  fontWeight: 500,
                  mt: 0.5
                }}
              />
            </Stack>
          </Card>

          {/* Tamil Date - Clean Presentation */}
          <Box>
            <Divider sx={{ 
              mb: 2, 
              '&::before, &::after': { borderColor: alpha(colors.divider, 0.5) } 
            }}>
              <Chip 
                label="Tamil Date" 
                size="small"
                variant="outlined"
                sx={{ 
                  color: colors.text.secondary,
                  fontWeight: 500,
                  borderColor: colors.divider,
                  px: 0.5
                }} 
              />
            </Divider>
            
            <Card
              elevation={0}
              sx={{
                p: 2,
                textAlign: 'center',
                bgcolor: alpha(colors.success.main, 0.04),
                borderRadius: 2,
                border: `1px solid ${alpha(colors.success.main, 0.15)}`
              }}
            >
              <Typography variant="h5" sx={{ 
                fontWeight: 600,
                color: colors.success.main,
              }}>
                {data.tamilDay} {data.tamilMonth}
              </Typography>
            </Card>
          </Box>

          {/* Festivals Section - Streamlined */}
          <Box>
            <Divider sx={{ 
              mb: 2, 
              '&::before, &::after': { borderColor: alpha(colors.divider, 0.5) } 
            }}>
              <Chip 
                icon={<EventIcon sx={{ fontSize: '0.875rem' }} />}
                label={`${festivalCount} Festival${festivalCount !== 1 ? 's' : ''}`}
                size="small"
                variant="outlined"
                sx={{ 
                  color: festivalCount > 0 ? colors.warning.main : colors.text.secondary,
                  fontWeight: 500,
                  borderColor: festivalCount > 0 ? alpha(colors.warning.main, 0.3) : colors.divider,
                  px: 0.5
                }}
              />
            </Divider>
            
            {festivalCount > 0 ? (
              <Card
                elevation={0}
                sx={{
                  borderRadius: 2,
                  border: `1px solid ${colors.divider}`,
                  overflow: 'hidden'
                }}
              >
                <List disablePadding>
                  {dateFestivals.map((festival, index) => (
                    <ListItem 
                      key={festival.id || index}
                      divider={index < dateFestivals.length - 1}
                      sx={{ px: 2, py: 1.25 }}
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: festival.color || colors.primary.main,
                          color: 'white',
                          fontWeight: 600,
                          mr: 2,
                          fontSize: '0.75rem'
                        }}
                      >
                        {index + 1}
                      </Avatar>
                      
                      <ListItemText 
                        primary={
                          <Typography sx={{ 
                            fontWeight: 600,
                            fontSize: '0.9375rem',
                            color: colors.text.primary,
                            mb: 0.25
                          }}>
                            {festival.name}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ color: colors.text.muted }}>
                            {festival.type || 'Festival'} • ID: {festival.id}
                          </Typography>
                        }
                        sx={{ my: 0 }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Card>
            ) : (
              <Card
                elevation={0}
                sx={{
                  textAlign: 'center',
                  py: 3,
                  borderRadius: 2,
                  border: `1px dashed ${colors.divider}`,
                  bgcolor: alpha(colors.secondary.light, 0.05)
                }}
              >
                <EventBusyIcon sx={{ 
                  fontSize: 36, 
                  color: colors.text.muted,
                  mb: 1
                }} />
                <Typography variant="body2" sx={{ 
                  color: colors.text.secondary,
                  fontWeight: 500
                }}>
                  No festivals scheduled for this date
                </Typography>
              </Card>
            )}
          </Box>
        </Stack>
      </DialogContent>
      
      {/* Simplified footer */}
      <DialogActions 
        component={motion.div}
        variants={slideUp}
        sx={{ 
          px: 3,
          py: 2,
          bgcolor: colors.background.default,
          borderTop: `1px solid ${alpha(colors.divider, 0.6)}`
        }}
      >
        <Button 
          onClick={onClose} 
          variant="contained"
          disableElevation
          sx={{ 
            bgcolor: colors.primary.main,
            color: '#ffffff',
            px: 3,
            py: 0.75,
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              bgcolor: colors.primary.dark
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DateDetailsModal;

// import React from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Typography,
//   Button,
//   Box,
//   Stack,
//   Chip,
//   IconButton,
//   useTheme,
//   useMediaQuery,
//   Divider,
//   List,
//   ListItem,
//   ListItemText,
//   alpha,
//   Paper,
//   Avatar
// } from "@mui/material";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import TodayIcon from "@mui/icons-material/Today";
// import CloseIcon from "@mui/icons-material/Close";
// import EventIcon from "@mui/icons-material/Event";
// import EventBusyIcon from "@mui/icons-material/EventBusy";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import { motion } from "framer-motion";

// // Modern professional color palette with semantic naming
// const colors = {
//   primary: {
//     main: '#2563eb',
//     dark: '#1d4ed8',
//     light: '#3b82f6',
//     lighter: '#dbeafe'
//   },
//   secondary: {
//     main: '#64748b',
//     light: '#94a3b8'
//   },
//   success: {
//     main: '#10b981',
//     light: '#d1fae5'
//   },
//   warning: {
//     main: '#f59e0b',
//     light: '#fef3c7'
//   },
//   background: {
//     paper: '#ffffff',
//     default: '#f8fafc'
//   },
//   divider: '#e2e8f0',
//   text: {
//     primary: '#1e293b',
//     secondary: '#64748b',
//     muted: '#94a3b8'
//   }
// };

// // Animation variants
// const fadeIn = {
//   hidden: { opacity: 0 },
//   visible: { opacity: 1, transition: { duration: 0.3 } }
// };

// const slideUp = {
//   hidden: { y: 20, opacity: 0 },
//   visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
// };

// /**
//  * DateDetailsModal - A professional modal component for displaying calendar date information
//  * 
//  * @param {Object} props - Component props
//  * @param {boolean} props.open - Controls whether the modal is open
//  * @param {Object} props.data - The date data to display
//  * @param {Function} props.onClose - Function to call when closing the modal
//  */
// function DateDetailsModal({ open, data, onClose }) {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
//   // Safely extract data
//   const dateFestivals = data?.festivals || [];
//   const festivalCount = dateFestivals.length;
//   const currentDate = data?.englishDate ? new Date() : null;
//   const isToday = currentDate && data?.englishDate === currentDate.getDate() && 
//                   data?.englishMonth === currentDate.toLocaleString('default', { month: 'long' });

//   // If no data, don't render anything
//   if (!data) return null;

//   return (
//     <Dialog 
//       open={open} 
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//       aria-labelledby="date-details-title"
//       PaperComponent={motion.div}
//       PaperProps={{ 
//         component: Paper,
//         elevation: 24,
//         initial: "hidden",
//         animate: "visible",
//         variants: fadeIn,
//         sx: { 
//           borderRadius: 4,
//           maxWidth: isMobile ? '95vw' : 480,
//           overflow: 'hidden',
//           backgroundImage: 'none'
//         }
//       }}
//     >
//       {/* Modern gradient header */}
//       <DialogTitle 
//         id="date-details-title"
//         component={motion.div}
//         variants={slideUp}
//         sx={{ 
//           p: 0,
//           background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.light} 100%)`,
//           color: "white"
//         }}
//       >
//         <Box sx={{ 
//           p: 3,
//           display: "flex", 
//           alignItems: "center", 
//           justifyContent: "space-between"
//         }}>
//           <Stack direction="row" spacing={2} alignItems="center">
//             <Box
//               sx={{
//                 bgcolor: alpha('#fff', 0.15),
//                 borderRadius: 2,
//                 p: 1,
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center'
//               }}
//             >
//               <CalendarMonthIcon sx={{ fontSize: '1.5rem' }} />
//             </Box>
//             <Box>
//               <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                 Date Details
//               </Typography>
//               <Stack direction="row" spacing={1} alignItems="center">
//                 <AccessTimeIcon sx={{ fontSize: '0.875rem', opacity: 0.7 }} />
//                 <Typography variant="body2" sx={{ opacity: 0.9 }}>
//                   Tamil Calendar
//                 </Typography>
//               </Stack>
//             </Box>
//           </Stack>
          
//           <IconButton
//             onClick={onClose}
//             aria-label="Close dialog"
//             sx={{ 
//               color: 'white', 
//               bgcolor: alpha('#fff', 0.1),
//               '&:hover': {
//                 bgcolor: alpha('#fff', 0.2)
//               }
//             }}
//             size="small"
//           >
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         </Box>
//       </DialogTitle>
      
//       <DialogContent 
//         component={motion.div}
//         variants={slideUp}
//         sx={{ 
//           p: 3, 
//           bgcolor: colors.background.default,
//           minHeight: 350 
//         }}
//       >
//         <Stack spacing={3}>
//           {/* English Date Card */}
//           <Paper
//             elevation={0}
//             sx={{ 
//               textAlign: 'center',
//               p: 3,
//               borderRadius: 3,
//               border: `1px solid ${colors.divider}`,
//               position: 'relative',
//               overflow: 'hidden'
//             }}
//           >
//             {isToday && (
//               <Chip 
//                 size="small"
//                 label="Today"
//                 color="primary"
//                 sx={{ 
//                   position: 'absolute',
//                   top: 12,
//                   right: 12,
//                   fontWeight: 500
//                 }}
//               />
//             )}
            
//             <Typography variant="h3" sx={{ 
//               fontWeight: 800,
//               color: colors.primary.main,
//               mb: 1
//             }}>
//               {data.englishDate}
//             </Typography>
            
//             <Typography variant="h6" sx={{
//               color: colors.text.secondary,
//               mb: 2,
//               fontWeight: 500
//             }}>
//               {data.englishMonth} {data.englishYear}
//             </Typography>
            
//             <Chip 
//               icon={<TodayIcon sx={{ fontSize: '1rem' }} />}
//               label={data.dayOfWeek}
//               sx={{ 
//                 bgcolor: colors.primary.lighter,
//                 color: colors.primary.main,
//                 fontWeight: 600,
//                 px: 1
//               }}
//             />
//           </Paper>

//           {/* Tamil Date Section */}
//           <Box>
//             <Divider textAlign="left" sx={{ mb: 2 }}>
//               <Chip 
//                 label="Tamil Date" 
//                 size="small"
//                 sx={{ 
//                   bgcolor: alpha(colors.secondary.main, 0.1),
//                   color: colors.text.primary,
//                   fontWeight: 500
//                 }} 
//               />
//             </Divider>
            
//             <Paper
//               elevation={0}
//               sx={{
//                 p: 3,
//                 textAlign: 'center',
//                 bgcolor: alpha(colors.success.main, 0.05),
//                 borderRadius: 3,
//                 border: `1px solid ${alpha(colors.success.main, 0.2)}`
//               }}
//             >
//               <Typography variant="h4" sx={{ 
//                 fontWeight: 700,
//                 color: colors.success.main,
//                 letterSpacing: '-0.5px'
//               }}>
//                 {data.tamilDay} {data.tamilMonth}
//               </Typography>
//             </Paper>
//           </Box>

//           {/* Festivals Section */}
//           <Box>
//             <Divider textAlign="left" sx={{ mb: 2 }}>
//               <Chip 
//                 icon={<EventIcon sx={{ fontSize: '1rem' }} />}
//                 label={`${festivalCount} Festival${festivalCount !== 1 ? 's' : ''}`}
//                 size="small"
//                 sx={{ 
//                   bgcolor: festivalCount > 0 ? alpha(colors.warning.main, 0.1) : alpha(colors.secondary.light, 0.1),
//                   color: festivalCount > 0 ? colors.warning.main : colors.text.secondary,
//                   fontWeight: 500
//                 }}
//               />
//             </Divider>
            
//             {festivalCount > 0 ? (
//               <Paper
//                 elevation={0}
//                 sx={{
//                   borderRadius: 3,
//                   border: `1px solid ${colors.divider}`,
//                   overflow: 'hidden'
//                 }}
//               >
//                 <List disablePadding>
//                   {dateFestivals.map((festival, index) => (
//                     <ListItem 
//                       key={festival.id || index}
//                       divider={index < dateFestivals.length - 1}
//                       sx={{ px: 2, py: 1.5 }}
//                     >
//                       <Avatar
//                         sx={{
//                           width: 36,
//                           height: 36,
//                           bgcolor: festival.color || colors.primary.main,
//                           color: 'white',
//                           fontWeight: 600,
//                           mr: 2,
//                           fontSize: '0.875rem'
//                         }}
//                       >
//                         {index + 1}
//                       </Avatar>
                      
//                       <ListItemText 
//                         primary={
//                           <Typography sx={{ 
//                             fontWeight: 600,
//                             color: colors.text.primary,
//                             mb: 0.5
//                           }}>
//                             {festival.name}
//                           </Typography>
//                         }
//                         secondary={
//                           <Stack direction="row" spacing={1} alignItems="center">
//                             <Box
//                               sx={{
//                                 width: 10,
//                                 height: 10,
//                                 borderRadius: '50%',
//                                 bgcolor: festival.color || colors.primary.main
//                               }}
//                             />
//                             <Typography variant="caption" sx={{ 
//                               color: colors.text.muted
//                             }}>
//                               {festival.type || 'Festival'} • ID: {festival.id}
//                             </Typography>
//                           </Stack>
//                         }
//                       />
//                     </ListItem>
//                   ))}
//                 </List>
//               </Paper>
//             ) : (
//               <Paper
//                 elevation={0}
//                 sx={{
//                   textAlign: 'center',
//                   py: 4,
//                   borderRadius: 3,
//                   border: `1px dashed ${colors.divider}`,
//                   bgcolor: alpha(colors.secondary.light, 0.05)
//                 }}
//               >
//                 <EventBusyIcon sx={{ 
//                   fontSize: 48, 
//                   color: colors.text.muted,
//                   mb: 1
//                 }} />
//                 <Typography variant="body1" sx={{ 
//                   color: colors.text.secondary,
//                   fontWeight: 600,
//                   mb: 0.5
//                 }}>
//                   No Events
//                 </Typography>
//                 <Typography variant="body2" sx={{ 
//                   color: colors.text.muted
//                 }}>
//                   No festivals or events scheduled for this date
//                 </Typography>
//               </Paper>
//             )}
//           </Box>
//         </Stack>
//       </DialogContent>
      
//       {/* Footer with action button */}
//       <DialogActions 
//         component={motion.div}
//         variants={slideUp}
//         sx={{ 
//           p: 3,
//           bgcolor: colors.background.default,
//           justifyContent: 'flex-end',
//           borderTop: `1px solid ${colors.divider}`
//         }}
//       >
//         <Button 
//           onClick={onClose} 
//           variant="contained"
//           size="large"
//           disableElevation
//           sx={{ 
//             bgcolor: colors.primary.main,
//             color: '#ffffff',
//             px: 3,
//             py: 1.5,
//             borderRadius: 2,
//             textTransform: 'none',
//             fontWeight: 600,
//             minWidth: isMobile ? '100%' : 120,
//             '&:hover': {
//               bgcolor: colors.primary.dark
//             }
//           }}
//         >
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// export default DateDetailsModal;


// import React from "react";
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions, 
//   Typography, Button, Box, Stack, Chip, IconButton,
//   useTheme, useMediaQuery, Divider, List, ListItem, ListItemText
// } from "@mui/material";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import TodayIcon from "@mui/icons-material/Today";
// import CloseIcon from "@mui/icons-material/Close";
// import EventIcon from "@mui/icons-material/Event";
// import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

// // Clean professional color palette
// const colors = {
//   primary: '#2563eb',
//   secondary: '#64748b',
//   accent: '#10b981',
//   warning: '#f59e0b',
//   surface: '#f8fafc',
//   border: '#e2e8f0',
//   text: {
//     primary: '#1e293b',
//     secondary: '#64748b',
//     light: '#94a3b8'
//   }
// };

// function DateDetailsModal({ open, data, onClose }) {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
//   const dateFestivals = data?.festivals || [];
//   const festivalCount = dateFestivals.length;

//   if (!data) return null;

//   return (
//     <Dialog 
//       open={open} 
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{ 
//         sx: { 
//           borderRadius: 3,
//           maxWidth: isMobile ? '95vw' : 480,
//           boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
//         }
//       }}
//     >
//       {/* Clean Header */}
//       <DialogTitle sx={{ 
//         p: 0,
//         background: `linear-gradient(135deg, ${colors.primary} 0%, #3b82f6 100%)`,
//         color: "white"
//       }}>
//         <Box sx={{ 
//           p: 3,
//           display: "flex", 
//           alignItems: "center", 
//           justifyContent: "space-between"
//         }}>
//           <Stack direction="row" spacing={2} alignItems="center">
//             <CalendarMonthIcon sx={{ fontSize: '1.5rem' }} />
//             <Box>
//               <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                 Date Details
//               </Typography>
//               <Typography variant="body2" sx={{ opacity: 0.9 }}>
//                 Tamil Calendar
//               </Typography>
//             </Box>
//           </Stack>
          
//           {/* {festivalCount > 0 && (
//             <Chip 
//               label={festivalCount}
//               size="small"
//               sx={{ 
//                 bgcolor: colors.warning,
//                 color: 'white',
//                 fontWeight: 600
//               }}
//             />
//           )} */}
          
//           <IconButton
//             onClick={onClose}
//             sx={{ color: 'white', ml: 1 }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </Box>
//       </DialogTitle>
      
//       <DialogContent sx={{ p: 3, bgcolor: colors.surface }}>
//         <Stack spacing={3}>
//           {/* English Date */}
//           <Box sx={{ 
//             textAlign: 'center',
//             py: 2,
//             bgcolor: 'white',
//             borderRadius: 2,
//             border: `1px solid ${colors.border}`
//           }}>
//             <Typography variant="h3" sx={{ 
//               fontWeight: 700,
//               color: colors.primary,
//               mb: 1
//             }}>
//               {data.englishDate}
//             </Typography>
            
//             <Typography variant="h6" sx={{
//               color: colors.text.secondary,
//               mb: 2
//             }}>
//               {data.englishMonth} {data.englishYear}
//             </Typography>
            
//             <Chip 
//               icon={<TodayIcon />}
//               label={data.dayOfWeek}
//               sx={{ 
//                 bgcolor: colors.primary,
//                 color: 'white',
//                 fontWeight: 500
//               }}
//             />
//           </Box>

//           {/* Tamil Date */}
//           <Box>
//             <Divider sx={{ mb: 2 }}>
//               <Chip label="Tamil Date" size="small" />
//             </Divider>
            
//             <Box sx={{
//               textAlign: 'center',
//               py: 3,
//               bgcolor: `${colors.accent}10`,
//               borderRadius: 2,
//               border: `1px solid ${colors.accent}30`
//             }}>
//               <Typography variant="h4" sx={{ 
//                 fontWeight: 600,
//                 color: colors.accent
//               }}>
//                 {data.tamilDay} {data.tamilMonth}
//               </Typography>
//             </Box>
//           </Box>

//           {/* Festivals */}
//           {festivalCount > 0 ? (
//             <Box>
//               <Divider sx={{ mb: 2 }}>
//                 <Chip 
//                   icon={<EventIcon />}
//                   label={`${festivalCount} Festival${festivalCount > 1 ? 's' : ''}`}
//                   size="small"
//                   sx={{ 
//                     bgcolor: colors.warning,
//                     color: 'white'
//                   }}
//                 />
//               </Divider>
              
//               <Box sx={{
//                 bgcolor: 'white',
//                 borderRadius: 2,
//                 border: `1px solid ${colors.border}`,
//                 overflow: 'hidden'
//               }}>
//                 <List sx={{ py: 0 }}>
//                   {dateFestivals.map((festival, index) => (
//                     <ListItem 
//                       key={festival.id}
//                       sx={{ 
//                         borderBottom: index < dateFestivals.length - 1 
//                           ? `1px solid ${colors.border}` 
//                           : 'none'
//                       }}
//                     >
//                       <Box sx={{
//                         width: 32,
//                         height: 32,
//                         borderRadius: '50%',
//                         bgcolor: festival.color || colors.primary,
//                         color: 'white',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         fontWeight: 600,
//                         mr: 2,
//                         fontSize: '0.875rem'
//                       }}>
//                         {index + 1}
//                       </Box>
                      
//                       <ListItemText 
//                         primary={
//                           <Typography sx={{ 
//                             fontWeight: 500,
//                             color: colors.text.primary
//                           }}>
//                             {festival.name}
//                           </Typography>
//                         }
//                         secondary={
//                           <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
//                             <FiberManualRecordIcon sx={{ 
//                               fontSize: '0.7rem',
//                               color: festival.color || colors.primary
//                             }} />
//                             <Typography variant="caption" sx={{ 
//                               color: colors.text.light
//                             }}>
//                               {festival.color} • ID: {festival.id}
//                             </Typography>
//                           </Stack>
//                         }
//                       />
//                     </ListItem>
//                   ))}
//                 </List>
//               </Box>
//             </Box>
//           ) : (
//             <Box sx={{
//               textAlign: 'center',
//               py: 4,
//               bgcolor: 'white',
//               borderRadius: 2,
//               border: `1px dashed ${colors.border}`
//             }}>
//               <EventIcon sx={{ 
//                 fontSize: 48, 
//                 color: colors.text.light,
//                 mb: 1
//               }} />
//               <Typography variant="body1" sx={{ 
//                 color: colors.text.secondary,
//                 fontWeight: 500
//               }}>
//                 No Festivals
//               </Typography>
//               <Typography variant="body2" sx={{ 
//                 color: colors.text.light
//               }}>
//                 No festivals scheduled for this date
//               </Typography>
//             </Box>
//           )}
//         </Stack>
//       </DialogContent>
      
//       {/* Simple Footer */}
//       <DialogActions sx={{ 
//         p: 3,
//         bgcolor: colors.surface,
//         justifyContent: 'center'
//       }}>
//         <Button 
//           onClick={onClose} 
//           variant="contained"
//           size="large"
//           sx={{ 
//             bgcolor: colors.primary,
//             px: 4,
//             py: 1,
//             borderRadius: 2,
//             textTransform: 'none',
//             fontWeight: 600,
//             minWidth: isMobile ? '100%' : 120,
//             '&:hover': {
//               bgcolor: '#1d4ed8'
//             }
//           }}
//         >
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }
// export default DateDetailsModal;

// import React from "react";
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions, 
//   Grid, Typography, Divider, Chip, Button, Box, List,
//   ListItem, ListItemText, ListItemIcon, Avatar, Stack,
//   useTheme, useMediaQuery, Badge, Paper, IconButton, Fade
// } from "@mui/material";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import EventIcon from "@mui/icons-material/Event";
// import TodayIcon from "@mui/icons-material/Today";
// import DateRangeIcon from "@mui/icons-material/DateRange";
// import StarIcon from "@mui/icons-material/Star";
// import CloseIcon from "@mui/icons-material/Close";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
// import CelebrationIcon from "@mui/icons-material/Celebration";

// // Professional color palette matching the main app
// const professionalColors = {
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
//     success: '#38a169',
//     warning: '#ed8936',
//     error: '#e53e3e'
//   },
//   surface: {
//     white: '#ffffff',
//     light: '#f7fafc',
//     medium: '#edf2f7',
//     dark: '#e2e8f0',
//     darker: '#cbd5e0'
//   },
//   text: {
//     primary: '#1a202c',
//     secondary: '#4a5568',
//     tertiary: '#718096',
//     light: '#a0aec0'
//   }
// };

// function DateDetailsModal({ open, data, onClose, festivals = [] }) {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isTablet = useMediaQuery(theme.breakpoints.down('md'));
//   const isSmallMobile = useMediaQuery('(max-width:400px)');
  
//   // Get all festivals for the selected date from the enhanced data
//   const dateFestivals = data?.festivals || [];
//   const festivalCount = data?.festivalCount || 0;

//   return (
//     <Dialog 
//       open={open} 
//       onClose={onClose}
//       maxWidth="md"
//       fullWidth
//       fullScreen={isSmallMobile}
//       TransitionComponent={Fade}
//       transitionDuration={300}
//       PaperProps={{ 
//         sx: { 
//           borderRadius: isSmallMobile ? 0 : 4,
//           maxWidth: isMobile ? '100vw' : isTablet ? '90vw' : 700,
//           background: professionalColors.surface.white,
//           boxShadow: isSmallMobile ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
//           overflow: 'hidden',
//           border: isSmallMobile ? 'none' : `1px solid ${professionalColors.surface.darker}`,
//           m: isSmallMobile ? 0 : 2
//         }
//       }}
//     >
//       {/* Professional Header */}
//       <DialogTitle sx={{ 
//         p: 0,
//         position: 'relative',
//         background: professionalColors.primary.gradient,
//         color: "white"
//       }}>
//         <Box sx={{ 
//           p: { xs: 2, sm: 3 },
//           display: "flex", 
//           alignItems: "center", 
//           justifyContent: "space-between",
//           minHeight: { xs: 64, sm: 80 }
//         }}>
//           <Stack direction="row" spacing={2} alignItems="center">
//             <Box sx={{
//               p: { xs: 1, sm: 1.5 },
//               borderRadius: 2,
//               background: 'rgba(255,255,255,0.15)',
//               backdropFilter: 'blur(10px)'
//             }}>
//               <CalendarMonthIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
//             </Box>
            
//             <Box>
//               <Typography variant="h6" sx={{ 
//                 fontWeight: 700,
//                 fontSize: { xs: '1.1rem', sm: '1.3rem' },
//                 letterSpacing: '-0.025em',
//                 lineHeight: 1.2
//               }}>
//                 Date Information
//               </Typography>
//               <Typography variant="body2" sx={{ 
//                 opacity: 0.9,
//                 fontSize: { xs: '0.75rem', sm: '0.875rem' },
//                 fontWeight: 500
//               }}>
//                 Tamil Calendar Details
//               </Typography>
//             </Box>
//           </Stack>
          
//           <Stack direction="row" spacing={1} alignItems="center">
//             {festivalCount > 0 && (
//               <Badge 
//                 badgeContent={festivalCount} 
//                 sx={{
//                   '& .MuiBadge-badge': {
//                     bgcolor: professionalColors.accent.error,
//                     color: 'white',
//                     fontWeight: 700,
//                     fontSize: { xs: '0.7rem', sm: '0.75rem' },
//                     minWidth: { xs: 18, sm: 20 },
//                     height: { xs: 18, sm: 20 }
//                   }
//                 }}
//               >
//                 <Box sx={{
//                   p: { xs: 0.8, sm: 1 },
//                   borderRadius: 2,
//                   background: 'rgba(255,255,255,0.15)',
//                   backdropFilter: 'blur(10px)'
//                 }}>
//                   <CelebrationIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.3rem' } }} />
//                 </Box>
//               </Badge>
//             )}
            
//             <IconButton
//               onClick={onClose}
//               size={isMobile ? "small" : "medium"}
//               sx={{
//                 color: 'white',
//                 bgcolor: 'rgba(255,255,255,0.15)',
//                 backdropFilter: 'blur(10px)',
//                 '&:hover': {
//                   bgcolor: 'rgba(255,255,255,0.25)',
//                   transform: 'scale(1.05)'
//                 },
//                 transition: 'all 0.2s ease'
//               }}
//             >
//               <CloseIcon fontSize={isMobile ? "small" : "medium"} />
//             </IconButton>
//           </Stack>
//         </Box>

//         {/* Professional decorative border */}
//         <Box sx={{
//           position: 'absolute',
//           bottom: 0,
//           left: 0,
//           right: 0,
//           height: 4,
//           background: `linear-gradient(90deg, ${professionalColors.accent.gold} 0%, ${professionalColors.accent.success} 100%)`
//         }} />
//       </DialogTitle>
      
//       <DialogContent sx={{ 
//         p: { xs: 2, sm: 3, md: 4 },
//         background: `linear-gradient(180deg, ${professionalColors.surface.light} 0%, ${professionalColors.surface.white} 100%)`
//       }}>
//         {data && (
//           <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
//             {/* English Date Section */}
//             <Grid item xs={12}>
//               <Paper 
//                 elevation={0} 
//                 sx={{
//                   p: { xs: 2, sm: 3 },
//                   borderRadius: 3,
//                   background: professionalColors.surface.white,
//                   border: `2px solid ${professionalColors.surface.medium}`,
//                   textAlign: 'center',
//                   position: 'relative',
//                   overflow: 'hidden',
//                   '&::before': {
//                     content: '""',
//                     position: 'absolute',
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     height: 4,
//                     background: professionalColors.primary.gradient
//                   }
//                 }}
//               >
//                 <Typography 
//                   variant={isSmallMobile ? "h4" : isTablet ? "h3" : "h2"} 
//                   gutterBottom 
//                   sx={{ 
//                     fontWeight: 800,
//                     color: professionalColors.primary.main,
//                     letterSpacing: '-0.05em',
//                     mb: { xs: 1, sm: 1.5 },
//                     fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' }
//                   }}
//                 >
//                   {data.englishDate}
//                 </Typography>
                
//                 <Typography variant={isSmallMobile ? "h6" : "h5"} sx={{
//                   color: professionalColors.text.secondary,
//                   fontWeight: 600,
//                   mb: { xs: 1, sm: 2 },
//                   fontSize: { xs: '1.1rem', sm: '1.3rem' }
//                 }}>
//                   {data.englishMonth} {data.englishYear}
//                 </Typography>
                
//                 <Chip 
//                   icon={<TodayIcon />}
//                   label={data.dayOfWeek}
//                   sx={{ 
//                     bgcolor: professionalColors.primary.main,
//                     color: 'white',
//                     fontWeight: 600,
//                     fontSize: { xs: '0.8rem', sm: '0.9rem' },
//                     px: { xs: 1, sm: 2 },
//                     height: { xs: 32, sm: 36 },
//                     '& .MuiChip-icon': {
//                       color: 'white',
//                       fontSize: { xs: '1rem', sm: '1.2rem' }
//                     }
//                   }}
//                 />
//               </Paper>
//             </Grid>
            
//             {/* Tamil Date Section */}
//             <Grid item xs={12}>
//               <Box sx={{ position: 'relative', mb: 2 }}>
//                 <Divider sx={{ borderColor: professionalColors.surface.darker, borderWidth: 1 }}>
//                   <Chip 
//                     icon={<DateRangeIcon />}
//                     label="Tamil Date" 
//                     sx={{ 
//                       bgcolor: professionalColors.accent.success,
//                       color: 'white',
//                       fontWeight: 600,
//                       fontSize: { xs: '0.8rem', sm: '0.9rem' },
//                       '& .MuiChip-icon': {
//                         color: 'white'
//                       }
//                     }} 
//                   />
//                 </Divider>
//               </Box>
              
//               <Paper 
//                 elevation={0} 
//                 sx={{
//                   p: { xs: 2, sm: 3 },
//                   borderRadius: 3,
//                   background: `linear-gradient(135deg, ${professionalColors.accent.success}15 0%, ${professionalColors.accent.success}05 100%)`,
//                   border: `2px solid ${professionalColors.accent.success}30`,
//                   textAlign: 'center'
//                 }}
//               >
//                 <Typography 
//                   variant={isSmallMobile ? "h5" : "h4"} 
//                   sx={{ 
//                     fontWeight: 700,
//                     color: professionalColors.accent.success,
//                     fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
//                     letterSpacing: '-0.025em',
//                     mb: 1
//                   }}
//                 >
//                   {data.tamilDay} {data.tamilMonth}
//                 </Typography>
//                 <Typography variant="body1" sx={{
//                   color: professionalColors.text.secondary,
//                   fontWeight: 500,
//                   fontSize: { xs: '0.9rem', sm: '1rem' }
//                 }}>
//                   தமிழ் நாட்காட்டி
//                 </Typography>
//               </Paper>
//             </Grid>
            
//             {/* Enhanced Festivals Section */}
//             {dateFestivals.length > 0 && (
//               <Grid item xs={12}>
//                 <Box sx={{ position: 'relative', mb: 2 }}>
//                   <Divider sx={{ borderColor: professionalColors.surface.darker, borderWidth: 1 }}>
//                     <Chip 
//                       icon={<CelebrationIcon />}
//                       label={`Festival${dateFestivals.length > 1 ? 's' : ''} (${dateFestivals.length})`}
//                       sx={{ 
//                         bgcolor: dateFestivals.length > 1 
//                           ? professionalColors.accent.warning 
//                           : professionalColors.accent.gold,
//                         color: 'white',
//                         fontWeight: 600,
//                         fontSize: { xs: '0.8rem', sm: '0.9rem' },
//                         '& .MuiChip-icon': {
//                           color: 'white'
//                         }
//                       }} 
//                     />
//                   </Divider>
//                 </Box>
                
//                 <Paper 
//                   elevation={0} 
//                   sx={{ 
//                     borderRadius: 3,
//                     overflow: 'hidden',
//                     border: `2px solid ${professionalColors.surface.medium}`,
//                     background: professionalColors.surface.white
//                   }}
//                 >
//                   <List sx={{ py: 0 }}>
//                     {dateFestivals.map((festival, index) => (
//                       <ListItem 
//                         key={festival.id}
//                         sx={{ 
//                           py: { xs: 2, sm: 2.5 },
//                           px: { xs: 2, sm: 3 },
//                           borderBottom: index < dateFestivals.length - 1 
//                             ? `1px solid ${professionalColors.surface.medium}` 
//                             : 'none',
//                           '&:hover': {
//                             bgcolor: professionalColors.surface.light,
//                             transition: 'background-color 0.2s ease'
//                           }
//                         }}
//                       >
//                         <ListItemIcon sx={{ minWidth: { xs: 45, sm: 55 } }}>
//                           <Avatar sx={{ 
//                             width: { xs: 36, sm: 44 }, 
//                             height: { xs: 36, sm: 44 }, 
//                             bgcolor: festival.color || professionalColors.accent.error,
//                             color: 'white',
//                             fontSize: { xs: '0.9rem', sm: '1.1rem' },
//                             fontWeight: 700,
//                             boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//                             border: '3px solid white'
//                           }}>
//                             {index + 1}
//                           </Avatar>
//                         </ListItemIcon>
                        
//                         <ListItemText 
//                           primary={
//                             <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
//                               <Typography sx={{ 
//                                 color: professionalColors.text.primary,
//                                 fontWeight: 600,
//                                 fontSize: { xs: '1rem', sm: '1.2rem' }
//                               }}>
//                                 {festival.name}
//                               </Typography>
//                               {index === 0 && dateFestivals.length > 1 && (
//                                 <StarIcon sx={{ 
//                                   fontSize: { xs: '1.1rem', sm: '1.3rem' }, 
//                                   color: professionalColors.accent.gold 
//                                 }} />
//                               )}
//                             </Stack>
//                           }
//                           secondary={
//                             <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
//                               <Stack direction="row" alignItems="center" spacing={0.5}>
//                                 <FiberManualRecordIcon sx={{ 
//                                   fontSize: { xs: '0.7rem', sm: '0.8rem' },
//                                   color: festival.color || professionalColors.accent.error
//                                 }} />
//                                 <Typography variant="caption" sx={{ 
//                                   color: professionalColors.text.tertiary,
//                                   fontSize: { xs: '0.75rem', sm: '0.8rem' },
//                                   fontWeight: 500
//                                 }}>
//                                   {festival.color}
//                                 </Typography>
//                               </Stack>
                              
//                               <Stack direction="row" alignItems="center" spacing={0.5}>
//                                 <AccessTimeIcon sx={{ 
//                                   fontSize: { xs: '0.8rem', sm: '0.9rem' },
//                                   color: professionalColors.text.light
//                                 }} />
//                                 <Typography variant="caption" sx={{ 
//                                   color: professionalColors.text.tertiary,
//                                   fontSize: { xs: '0.75rem', sm: '0.8rem' },
//                                   fontWeight: 500
//                                 }}>
//                                   ID: {festival.id}
//                                 </Typography>
//                               </Stack>
//                             </Stack>
//                           }
//                         />
//                       </ListItem>
//                     ))}
//                   </List>
//                 </Paper>
                
//                 {/* Special day indicator for multiple festivals */}
//                 {dateFestivals.length > 1 && (
//                   <Paper 
//                     elevation={0} 
//                     sx={{ 
//                       mt: { xs: 2, sm: 3 },
//                       p: { xs: 2, sm: 2.5 },
//                       borderRadius: 3,
//                       background: `linear-gradient(135deg, ${professionalColors.accent.gold}15 0%, ${professionalColors.accent.warning}15 100%)`,
//                       border: `2px solid ${professionalColors.accent.gold}30`,
//                       textAlign: 'center'
//                     }}
//                   >
//                     <Typography variant="h6" sx={{ 
//                       color: professionalColors.accent.warning,
//                       fontWeight: 600,
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       gap: 1,
//                       fontSize: { xs: '1rem', sm: '1.2rem' }
//                     }}>
//                       <StarIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.4rem' } }} />
//                       Special Day - {dateFestivals.length} Festivals
//                     </Typography>
//                   </Paper>
//                 )}
//               </Grid>
//             )}

//             {/* No Festivals Message */}
//             {dateFestivals.length === 0 && (
//               <Grid item xs={12}>
//                 <Paper 
//                   elevation={0} 
//                   sx={{ 
//                     p: { xs: 3, sm: 4 },
//                     textAlign: 'center',
//                     borderRadius: 3,
//                     background: professionalColors.surface.light,
//                     border: `2px dashed ${professionalColors.surface.darker}`
//                   }}
//                 >
//                   <CelebrationIcon sx={{ 
//                     fontSize: { xs: 40, sm: 48 }, 
//                     color: professionalColors.text.light,
//                     mb: 2,
//                     opacity: 0.7
//                   }} />
//                   <Typography variant="h6" sx={{ 
//                     color: professionalColors.text.secondary,
//                     fontWeight: 500,
//                     mb: 1,
//                     fontSize: { xs: '1.1rem', sm: '1.25rem' }
//                   }}>
//                     No Festivals
//                   </Typography>
//                   <Typography variant="body2" sx={{ 
//                     color: professionalColors.text.tertiary,
//                     fontStyle: 'italic',
//                     fontSize: { xs: '0.85rem', sm: '0.95rem' }
//                   }}>
//                     There are no festivals scheduled for this date
//                   </Typography>
//                 </Paper>
//               </Grid>
//             )}
//           </Grid>
//         )}
//       </DialogContent>
      
//       {/* Professional Footer */}
//       <DialogActions sx={{ 
//         p: { xs: 2, sm: 3 },
//         background: professionalColors.surface.light,
//         borderTop: `1px solid ${professionalColors.surface.darker}`,
//         justifyContent: 'center'
//       }}>
//         <Button 
//           onClick={onClose} 
//           variant="contained"
//           size="large"
//           sx={{ 
//             background: professionalColors.primary.gradient,
//             color: 'white',
//             fontWeight: 600,
//             px: { xs: 4, sm: 6 },
//             py: { xs: 1, sm: 1.2 },
//             borderRadius: 2,
//             textTransform: 'none',
//             fontSize: { xs: '0.9rem', sm: '1rem' },
//             minWidth: { xs: '100%', sm: 200 },
//             boxShadow: '0 4px 12px rgba(26, 54, 93, 0.3)',
//             '&:hover': {
//               background: professionalColors.primary.dark,
//               boxShadow: '0 6px 16px rgba(26, 54, 93, 0.4)',
//               transform: 'translateY(-1px)'
//             },
//             transition: 'all 0.2s ease'
//           }}
//         >
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// export default DateDetailsModal;


// import React from "react";
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions, 
//   Grid, Typography, Divider, Chip, Button, Box, List,
//   ListItem, ListItemText, ListItemIcon, Avatar, Stack,
//   useTheme, useMediaQuery, Badge, Paper, IconButton
// } from "@mui/material";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import EventIcon from "@mui/icons-material/Event";
// import TodayIcon from "@mui/icons-material/Today";
// import DateRangeIcon from "@mui/icons-material/DateRange";
// import StarIcon from "@mui/icons-material/Star";
// import CloseIcon from "@mui/icons-material/Close";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";

// // Professional color palette
// const professionalColors = {
//   primary: {
//     main: '#1a365d', // Deep navy
//     light: '#2d5d7b',
//     dark: '#0f2744',
//     gradient: 'linear-gradient(135deg, #1a365d 0%, #2c5282 50%, #3182ce 100%)'
//   },
//   secondary: {
//     main: '#2d3748', // Charcoal
//     light: '#4a5568',
//     dark: '#1a202c'
//   },
//   accent: {
//     gold: '#d69e2e',
//     success: '#38a169',
//     warning: '#ed8936',
//     error: '#e53e3e'
//   },
//   surface: {
//     white: '#ffffff',
//     light: '#f7fafc',
//     medium: '#edf2f7',
//     dark: '#e2e8f0'
//   },
//   text: {
//     primary: '#1a202c',
//     secondary: '#4a5568',
//     tertiary: '#718096'
//   }
// };

// function DateDetailsModal({ open, data, onClose, festivals = [] }) {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
//   // Get all festivals for the selected date from the enhanced data
//   const dateFestivals = data?.festivals || [];
//   const festivalCount = data?.festivalCount || 0;

//   return (
//     <Dialog 
//       open={open} 
//       onClose={onClose}
//       maxWidth="md"
//       fullWidth
//       PaperProps={{ 
//         sx: { 
//           borderRadius: 4,
//           maxWidth: isMobile ? '95vw' : 600,
//           background: professionalColors.surface.white,
//           boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
//           overflow: 'hidden',
//           border: `1px solid ${professionalColors.surface.dark}`
//         }
//       }}
//     >
//       {/* Professional Header */}
//       <DialogTitle sx={{ 
//         p: 0,
//         position: 'relative',
//         background: professionalColors.primary.gradient,
//         color: "white",
//         overflow: 'hidden'
//       }}>
//         <Box sx={{ 
//           p: { xs: 2, sm: 3 },
//           display: "flex", 
//           alignItems: "center", 
//           justifyContent: "space-between"
//         }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//             <Box sx={{
//               p: 1.5,
//               borderRadius: 2,
//               background: 'rgba(255,255,255,0.15)',
//               backdropFilter: 'blur(10px)'
//             }}>
//               <CalendarMonthIcon sx={{ fontSize: '1.5rem' }} />
//             </Box>
//             <Box>
//               <Typography variant="h6" sx={{ 
//                 fontWeight: 700,
//                 fontSize: { xs: '1.1rem', sm: '1.3rem' },
//                 letterSpacing: '-0.025em'
//               }}>
//                 Date Details
//               </Typography>
//               <Typography variant="body2" sx={{ 
//                 opacity: 0.9,
//                 fontSize: '0.875rem'
//               }}>
//                 Tamil Calendar Information
//               </Typography>
//             </Box>
//           </Box>
          
//           <Stack direction="row" spacing={1} alignItems="center">
//             {festivalCount > 0 && (
//               <Badge 
//                 badgeContent={festivalCount} 
//                 sx={{
//                   '& .MuiBadge-badge': {
//                     bgcolor: professionalColors.accent.error,
//                     color: 'white',
//                     fontWeight: 700,
//                     fontSize: '0.75rem',
//                     minWidth: 20,
//                     height: 20
//                   }
//                 }}
//               >
//                 <Box sx={{
//                   p: 1,
//                   borderRadius: 2,
//                   background: 'rgba(255,255,255,0.15)',
//                   backdropFilter: 'blur(10px)'
//                 }}>
//                   <EventIcon />
//                 </Box>
//               </Badge>
//             )}
            
//             <IconButton
//               onClick={onClose}
//               size="small"
//               sx={{
//                 color: 'white',
//                 bgcolor: 'rgba(255,255,255,0.15)',
//                 backdropFilter: 'blur(10px)',
//                 '&:hover': {
//                   bgcolor: 'rgba(255,255,255,0.25)'
//                 }
//               }}
//             >
//               <CloseIcon fontSize="small" />
//             </IconButton>
//           </Stack>
//         </Box>

//         {/* Decorative bottom border */}
//         <Box sx={{
//           position: 'absolute',
//           bottom: 0,
//           left: 0,
//           right: 0,
//           height: 4,
//           background: `linear-gradient(90deg, ${professionalColors.accent.gold} 0%, ${professionalColors.accent.success} 100%)`
//         }} />
//       </DialogTitle>
      
//       <DialogContent sx={{ 
//         p: { xs: 2, sm: 4 },
//         background: `linear-gradient(180deg, ${professionalColors.surface.light} 0%, ${professionalColors.surface.white} 100%)`
//       }}>
//         {data && (
//           <Grid container spacing={4}>
//             {/* English Date Section */}
//             <Grid item xs={12}>
//               <Paper elevation={0} sx={{
//                 p: 3,
//                 borderRadius: 3,
//                 background: professionalColors.surface.white,
//                 border: `1px solid ${professionalColors.surface.dark}`,
//                 textAlign: 'center'
//               }}>
//                 <Typography variant={isMobile ? "h4" : "h3"} gutterBottom sx={{ 
//                   fontWeight: 800,
//                   color: professionalColors.primary.main,
//                   letterSpacing: '-0.05em',
//                   mb: 1
//                 }}>
//                   {data.englishDate} {data.englishMonth}
//                 </Typography>
                
//                 <Typography variant="h6" sx={{
//                   color: professionalColors.text.secondary,
//                   fontWeight: 600,
//                   mb: 2
//                 }}>
//                   {data.englishYear}
//                 </Typography>
                
//                 <Chip 
//                   icon={<TodayIcon />}
//                   label={data.dayOfWeek}
//                   sx={{ 
//                     bgcolor: professionalColors.primary.main,
//                     color: 'white',
//                     fontWeight: 600,
//                     fontSize: '0.875rem',
//                     px: 1,
//                     '& .MuiChip-icon': {
//                       color: 'white'
//                     }
//                   }}
//                 />
//               </Paper>
//             </Grid>
            
//             {/* Tamil Date Section */}
//             <Grid item xs={12}>
//               <Box sx={{ position: 'relative', mb: 2 }}>
//                 <Divider sx={{ borderColor: professionalColors.surface.dark }}>
//                   <Chip 
//                     icon={<DateRangeIcon />}
//                     label="Tamil Date" 
//                     sx={{ 
//                       bgcolor: professionalColors.accent.success,
//                       color: 'white',
//                       fontWeight: 600,
//                       '& .MuiChip-icon': {
//                         color: 'white'
//                       }
//                     }} 
//                   />
//                 </Divider>
//               </Box>
              
//               <Paper elevation={0} sx={{
//                 p: 3,
//                 borderRadius: 3,
//                 background: `linear-gradient(135deg, ${professionalColors.accent.success}15 0%, ${professionalColors.accent.success}05 100%)`,
//                 border: `2px solid ${professionalColors.accent.success}30`,
//                 textAlign: 'center'
//               }}>
//                 <Typography variant="h4" sx={{ 
//                   fontWeight: 700,
//                   color: professionalColors.accent.success,
//                   fontSize: { xs: '1.75rem', sm: '2.5rem' },
//                   letterSpacing: '-0.025em'
//                 }}>
//                   {data.tamilDay} {data.tamilMonth}
//                 </Typography>
//                 <Typography variant="body2" sx={{
//                   color: professionalColors.text.secondary,
//                   fontWeight: 500,
//                   mt: 0.5
//                 }}>
//                   Tamil Calendar
//                 </Typography>
//               </Paper>
//             </Grid>
            
//             {/* Enhanced Festivals Section */}
//             {dateFestivals.length > 0 && (
//               <Grid item xs={12}>
//                 <Box sx={{ position: 'relative', mb: 2 }}>
//                   <Divider sx={{ borderColor: professionalColors.surface.dark }}>
//                     <Chip 
//                       icon={<EventIcon />}
//                       label={`Festival${dateFestivals.length > 1 ? 's' : ''} (${dateFestivals.length})`}
//                       sx={{ 
//                         bgcolor: dateFestivals.length > 1 
//                           ? professionalColors.accent.warning 
//                           : professionalColors.accent.gold,
//                         color: 'white',
//                         fontWeight: 600,
//                         '& .MuiChip-icon': {
//                           color: 'white'
//                         }
//                       }} 
//                     />
//                   </Divider>
//                 </Box>
                
//                 <Paper elevation={0} sx={{ 
//                   borderRadius: 3,
//                   overflow: 'hidden',
//                   border: `1px solid ${professionalColors.surface.dark}`,
//                   background: professionalColors.surface.white
//                 }}>
//                   <List sx={{ py: 0 }}>
//                     {dateFestivals.map((festival, index) => (
//                       <ListItem 
//                         key={festival.id}
//                         sx={{ 
//                           py: 2,
//                           px: 3,
//                           borderBottom: index < dateFestivals.length - 1 
//                             ? `1px solid ${professionalColors.surface.medium}` 
//                             : 'none',
//                           '&:hover': {
//                             bgcolor: professionalColors.surface.light,
//                             transition: 'background-color 0.2s ease'
//                           }
//                         }}
//                       >
//                         <ListItemIcon sx={{ minWidth: 50 }}>
//                           <Avatar sx={{ 
//                             width: 40, 
//                             height: 40, 
//                             bgcolor: festival.color || professionalColors.accent.error,
//                             color: 'white',
//                             fontSize: '1rem',
//                             fontWeight: 700,
//                             boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//                             border: '2px solid white'
//                           }}>
//                             {index + 1}
//                           </Avatar>
//                         </ListItemIcon>
                        
//                         <ListItemText 
//                           primary={
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
//                               <Typography sx={{ 
//                                 color: professionalColors.text.primary,
//                                 fontWeight: 600,
//                                 fontSize: { xs: '1rem', sm: '1.1rem' }
//                               }}>
//                                 {festival.name}
//                               </Typography>
//                               {index === 0 && dateFestivals.length > 1 && (
//                                 <StarIcon sx={{ 
//                                   fontSize: '1.2rem', 
//                                   color: professionalColors.accent.gold 
//                                 }} />
//                               )}
//                             </Box>
//                           }
//                           secondary={
//                             <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
//                               <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                                 <Box sx={{ 
//                                   width: 14, 
//                                   height: 14, 
//                                   borderRadius: '50%', 
//                                   bgcolor: festival.color || professionalColors.accent.error,
//                                   border: `2px solid ${professionalColors.surface.dark}`,
//                                   boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//                                 }} />
//                                 <Typography variant="caption" sx={{ 
//                                   color: professionalColors.text.tertiary,
//                                   fontSize: '0.8rem',
//                                   fontWeight: 500
//                                 }}>
//                                   {festival.color}
//                                 </Typography>
//                               </Box>
                              
//                               <Typography variant="caption" sx={{ 
//                                 color: professionalColors.text.tertiary,
//                                 fontSize: '0.8rem',
//                                 fontWeight: 500,
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 gap: 0.5
//                               }}>
//                                 <AccessTimeIcon sx={{ fontSize: '0.9rem' }} />
//                                 ID: {festival.id}
//                               </Typography>
//                             </Stack>
//                           }
//                         />
//                       </ListItem>
//                     ))}
//                   </List>
//                 </Paper>
                
//                 {/* Special day indicator for multiple festivals */}
//                 {dateFestivals.length > 1 && (
//                   <Paper elevation={0} sx={{ 
//                     mt: 2,
//                     p: 2,
//                     borderRadius: 3,
//                     background: `linear-gradient(135deg, ${professionalColors.accent.gold}15 0%, ${professionalColors.accent.warning}15 100%)`,
//                     border: `1px solid ${professionalColors.accent.gold}30`,
//                     textAlign: 'center'
//                   }}>
//                     <Typography variant="body1" sx={{ 
//                       color: professionalColors.accent.warning,
//                       fontWeight: 600,
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       gap: 1
//                     }}>
//                       <StarIcon sx={{ fontSize: '1.3rem' }} />
//                       Special Day - {dateFestivals.length} Festivals
//                     </Typography>
//                   </Paper>
//                 )}
//               </Grid>
//             )}

//             {/* No Festivals Message */}
//             {dateFestivals.length === 0 && (
//               <Grid item xs={12}>
//                 <Paper elevation={0} sx={{ 
//                   p: 4,
//                   textAlign: 'center',
//                   borderRadius: 3,
//                   background: professionalColors.surface.light,
//                   border: `2px dashed ${professionalColors.surface.dark}`
//                 }}>
//                   <EventIcon sx={{ 
//                     fontSize: 48, 
//                     color: professionalColors.text.tertiary,
//                     mb: 2,
//                     opacity: 0.7
//                   }} />
//                   <Typography variant="h6" sx={{ 
//                     color: professionalColors.text.secondary,
//                     fontWeight: 500,
//                     mb: 1
//                   }}>
//                     No Festivals
//                   </Typography>
//                   <Typography variant="body2" sx={{ 
//                     color: professionalColors.text.tertiary,
//                     fontStyle: 'italic'
//                   }}>
//                     There are no festivals scheduled for this date
//                   </Typography>
//                 </Paper>
//               </Grid>
//             )}
//           </Grid>
//         )}
//       </DialogContent>
      
//       {/* Professional Footer */}
//       <DialogActions sx={{ 
//         p: { xs: 2, sm: 3 },
//         background: professionalColors.surface.light,
//         borderTop: `1px solid ${professionalColors.surface.dark}`,
//         justifyContent: 'center'
//       }}>
//         <Button 
//           onClick={onClose} 
//           variant="contained"
//           size="large"
//           sx={{ 
//             background: professionalColors.primary.gradient,
//             color: 'white',
//             fontWeight: 600,
//             px: { xs: 4, sm: 6 },
//             py: 1.2,
//             borderRadius: 2,
//             textTransform: 'none',
//             fontSize: '1rem',
//             minWidth: { xs: '100%', sm: 'auto' },
//             boxShadow: '0 4px 12px rgba(26, 54, 93, 0.3)',
//             '&:hover': {
//               background: professionalColors.primary.dark,
//               boxShadow: '0 6px 16px rgba(26, 54, 93, 0.4)',
//               transform: 'translateY(-1px)'
//             },
//             transition: 'all 0.2s ease'
//           }}
//         >
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// export default DateDetailsModal;


// import React from "react";
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions, 
//   Grid, Typography, Divider, Chip, Button, Box, List,
//   ListItem, ListItemText, ListItemIcon, Avatar, Stack,
//   useTheme, useMediaQuery, Badge
// } from "@mui/material";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import EventIcon from "@mui/icons-material/Event";
// import TodayIcon from "@mui/icons-material/Today";
// import DateRangeIcon from "@mui/icons-material/DateRange";
// import StarIcon from "@mui/icons-material/Star";

// function DateDetailsModal({ open, data, onClose, festivals = [] }) {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
//   // Get all festivals for the selected date from the enhanced data
//   const dateFestivals = data?.festivals || [];
//   const festivalCount = data?.festivalCount || 0;

//   return (
//     <Dialog 
//       open={open} 
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{ 
//         sx: { 
//           borderRadius: 3,
//           maxWidth: isMobile ? '95vw' : 500,
//           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//           color: "white",
//           overflow: 'hidden'
//         }
//       }}
//     >
//       <DialogTitle sx={{ 
//         pb: 2, 
//         display: "flex", 
//         alignItems: "center", 
//         justifyContent: "space-between",
//         backgroundColor: "rgba(255,255,255,0.1)", 
//         color: "white",
//         backdropFilter: 'blur(10px)',
//         borderBottom: '1px solid rgba(255,255,255,0.2)'
//       }}>
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           <CalendarMonthIcon sx={{ mr: 1 }} />
//           <Typography variant="h6" sx={{ fontWeight: 600 }}>
//             Date Details
//           </Typography>
//         </Box>
        
//         {festivalCount > 0 && (
//           <Badge 
//             badgeContent={festivalCount} 
//             color="secondary"
//             sx={{
//               '& .MuiBadge-badge': {
//                 bgcolor: '#f44336',
//                 color: 'white',
//                 fontWeight: 'bold'
//               }
//             }}
//           >
//             <EventIcon />
//           </Badge>
//         )}
//       </DialogTitle>
      
//       <DialogContent sx={{ pt: 3, px: { xs: 2, sm: 3 } }}>
//         {data && (
//           <Grid container spacing={3}>
//             {/* English Date Section */}
//             <Grid item xs={12}>
//               <Box sx={{ textAlign: 'center', mb: 2 }}>
//                 <Typography variant={isMobile ? "h5" : "h4"} gutterBottom sx={{ 
//                   fontWeight: 600,
//                   color: "white",
//                   textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
//                 }}>
//                   {data.englishDate} {data.englishMonth} {data.englishYear}
//                 </Typography>
//                 <Chip 
//                   icon={<TodayIcon />}
//                   label={data.dayOfWeek}
//                   sx={{ 
//                     bgcolor: 'rgba(255,255,255,0.2)', 
//                     color: 'white',
//                     backdropFilter: 'blur(5px)',
//                     fontWeight: 500
//                   }}
//                 />
//               </Box>
//             </Grid>
            
//             {/* Tamil Date Section */}
//             <Grid item xs={12}>
//               <Divider sx={{ bgcolor: "rgba(255,255,255,0.3)", mb: 2 }}>
//                 <Chip 
//                   icon={<DateRangeIcon />}
//                   label="Tamil Date" 
//                   size="small" 
//                   sx={{ 
//                     color: "white", 
//                     borderColor: "rgba(255,255,255,0.5)",
//                     bgcolor: 'rgba(255,255,255,0.1)',
//                     backdropFilter: 'blur(5px)'
//                   }} 
//                 />
//               </Divider>
              
//               <Box sx={{ textAlign: 'center', mb: 2 }}>
//                 <Typography variant="h5" sx={{ 
//                   fontWeight: 500,
//                   color: "#4caf50",
//                   textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
//                   fontSize: { xs: '1.5rem', sm: '2rem' }
//                 }}>
//                   {data.tamilDay} {data.tamilMonth}
//                 </Typography>
//               </Box>
//             </Grid>
            
//             {/* Enhanced Festivals Section */}
//             {dateFestivals.length > 0 && (
//               <Grid item xs={12}>
//                 <Divider sx={{ bgcolor: "rgba(255,255,255,0.3)", mb: 2 }}>
//                   <Chip 
//                     icon={<EventIcon />}
//                     label={`Festival${dateFestivals.length > 1 ? 's' : ''} (${dateFestivals.length})`}
//                     size="small" 
//                     sx={{ 
//                       color: "white", 
//                       borderColor: "rgba(255,255,255,0.5)",
//                       bgcolor: dateFestivals.length > 1 ? 'rgba(244, 67, 54, 0.2)' : 'rgba(255,255,255,0.1)',
//                       backdropFilter: 'blur(5px)'
//                     }} 
//                   />
//                 </Divider>
                
//                 <Box sx={{ 
//                   bgcolor: 'rgba(255,255,255,0.1)',
//                   borderRadius: 2,
//                   backdropFilter: 'blur(5px)',
//                   border: '1px solid rgba(255,255,255,0.2)'
//                 }}>
//                   <List sx={{ py: 0 }}>
//                     {dateFestivals.map((festival, index) => (
//                       <ListItem 
//                         key={festival.id}
//                         sx={{ 
//                           py: 1.5,
//                           borderBottom: index < dateFestivals.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
//                           position: 'relative'
//                         }}
//                       >
//                         <ListItemIcon sx={{ minWidth: 40 }}>
//                           <Avatar sx={{ 
//                             width: 32, 
//                             height: 32, 
//                             bgcolor: festival.color || '#f44336',
//                             color: 'white',
//                             fontSize: '0.875rem',
//                             fontWeight: 600,
//                             border: '2px solid rgba(255,255,255,0.3)',
//                             boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
//                           }}>
//                             {index + 1}
//                           </Avatar>
//                         </ListItemIcon>
                        
//                         <ListItemText 
//                           primary={
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                               <Typography sx={{ 
//                                 color: 'white', 
//                                 fontWeight: 500,
//                                 fontSize: { xs: '0.95rem', sm: '1rem' }
//                               }}>
//                                 {festival.name}
//                               </Typography>
//                               {index === 0 && dateFestivals.length > 1 && (
//                                 <StarIcon sx={{ fontSize: '1rem', color: '#ffd700' }} />
//                               )}
//                             </Box>
//                           }
//                           secondary={
//                             <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
//                               <Box sx={{ 
//                                 width: 12, 
//                                 height: 12, 
//                                 borderRadius: '50%', 
//                                 bgcolor: festival.color || '#f44336',
//                                 border: '1px solid rgba(255,255,255,0.3)',
//                                 boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
//                               }} />
//                               <Typography variant="caption" sx={{ 
//                                 color: 'rgba(255,255,255,0.7)',
//                                 fontSize: '0.75rem'
//                               }}>
//                                 ID: {festival.id} • Color: {festival.color}
//                               </Typography>
//                             </Stack>
//                           }
//                         />
//                       </ListItem>
//                     ))}
//                   </List>
//                 </Box>
                
//                 {/* Multiple festivals indicator */}
//                 {/* {dateFestivals.length > 1 && (
//                   <Box sx={{ 
//                     mt: 2,
//                     p: 1.5,
//                     bgcolor: 'rgba(255, 193, 7, 0.2)',
//                     borderRadius: 2,
//                     border: '1px solid rgba(255, 193, 7, 0.3)',
//                     textAlign: 'center'
//                   }}>
//                     <Typography variant="body2" sx={{ 
//                       color: '#ffd700',
//                       fontWeight: 500,
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       gap: 1
//                     }}>
//                       <StarIcon sx={{ fontSize: '1.2rem' }} />
//                       This is a special day with {dateFestivals.length} festivals!
//                     </Typography>
//                   </Box>
//                 )} */}
//               </Grid>
//             )}

//             {/* No Festivals Message */}
//             {dateFestivals.length === 0 && (
//               <Grid item xs={12}>
//                 <Box sx={{ 
//                   textAlign: 'center',
//                   bgcolor: 'rgba(255,255,255,0.05)',
//                   borderRadius: 2,
//                   p: 2,
//                   border: '1px dashed rgba(255,255,255,0.3)'
//                 }}>
//                   <EventIcon sx={{ 
//                     fontSize: 40, 
//                     color: 'rgba(255,255,255,0.5)', 
//                     mb: 1 
//                   }} />
//                   <Typography variant="body2" sx={{ 
//                     color: 'rgba(255,255,255,0.7)',
//                     fontStyle: 'italic'
//                   }}>
//                     No festivals on this date
//                   </Typography>
//                 </Box>
//               </Grid>
//             )}
//           </Grid>
//         )}
//       </DialogContent>
      
//       <DialogActions sx={{ 
//         p: 3, 
//         pt: 2,
//         backgroundColor: "rgba(255,255,255,0.05)",
//         backdropFilter: 'blur(10px)',
//         borderTop: '1px solid rgba(255,255,255,0.1)'
//       }}>
//         <Button 
//           onClick={onClose} 
//           variant="outlined"
//           fullWidth={isMobile}
//           sx={{ 
//             color: "white", 
//             borderColor: "rgba(255,255,255,0.5)",
//             bgcolor: 'rgba(255,255,255,0.1)',
//             backdropFilter: 'blur(5px)',
//             '&:hover': {
//               borderColor: "white",
//               bgcolor: "rgba(255,255,255,0.2)"
//             },
//             fontWeight: 500,
//             px: 4
//           }}
//         >
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// export default DateDetailsModal;


// import React from "react";
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions, 
//   Grid, Typography, Divider, Chip, Button, Box, List,
//   ListItem, ListItemText, ListItemIcon, Avatar, Stack,
//   useTheme, useMediaQuery
// } from "@mui/material";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import EventIcon from "@mui/icons-material/Event";
// import TodayIcon from "@mui/icons-material/Today";
// import DateRangeIcon from "@mui/icons-material/DateRange";

// function DateDetailsModal({ open, data, onClose, festivals = [] }) {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
//   // Get all festivals for the selected date
//   const getFestivalsForDate = () => {
//     if (!data) return [];
    
//     return festivals.filter(festival => 
//       festival.month === (new Date(data.englishYear, new Date(Date.parse(data.englishMonth + " 1, " + data.englishYear)).getMonth(), data.englishDate).getMonth() + 1) &&
//       festival.day === parseInt(data.englishDate)
//     );
//   };

//   const dateFestivals = getFestivalsForDate();

//   return (
//     <Dialog 
//       open={open} 
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{ 
//         sx: { 
//           borderRadius: 3,
//           maxWidth: isMobile ? '95vw' : 500,
//           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//           color: "white",
//           overflow: 'hidden'
//         }
//       }}
//     >
//       <DialogTitle sx={{ 
//         pb: 2, 
//         display: "flex", 
//         alignItems: "center", 
//         backgroundColor: "rgba(255,255,255,0.1)", 
//         color: "white",
//         backdropFilter: 'blur(10px)',
//         borderBottom: '1px solid rgba(255,255,255,0.2)'
//       }}>
//         <CalendarMonthIcon sx={{ mr: 1 }} /> 
//         <Typography variant="h6" sx={{ fontWeight: 600 }}>
//           Date Details
//         </Typography>
//       </DialogTitle>
      
//       <DialogContent sx={{ pt: 3, px: { xs: 2, sm: 3 } }}>
//         {data && (
//           <Grid container spacing={3}>
//             {/* English Date Section */}
//             <Grid item xs={12}>
//               <Box sx={{ textAlign: 'center', mb: 2 }}>
//                 <Typography variant={isMobile ? "h5" : "h4"} gutterBottom sx={{ 
//                   fontWeight: 600,
//                   color: "white",
//                   textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
//                 }}>
//                   {data.englishDate} {data.englishMonth} {data.englishYear}
//                 </Typography>
//                 <Chip 
//                   icon={<TodayIcon />}
//                   label={data.dayOfWeek}
//                   sx={{ 
//                     bgcolor: 'rgba(255,255,255,0.2)', 
//                     color: 'white',
//                     backdropFilter: 'blur(5px)',
//                     fontWeight: 500
//                   }}
//                 />
//               </Box>
//             </Grid>
            
//             {/* Tamil Date Section */}
//             <Grid item xs={12}>
//               <Divider sx={{ bgcolor: "rgba(255,255,255,0.3)", mb: 2 }}>
//                 <Chip 
//                   icon={<DateRangeIcon />}
//                   label="Tamil Date" 
//                   size="small" 
//                   sx={{ 
//                     color: "white", 
//                     borderColor: "rgba(255,255,255,0.5)",
//                     bgcolor: 'rgba(255,255,255,0.1)',
//                     backdropFilter: 'blur(5px)'
//                   }} 
//                 />
//               </Divider>
              
//               <Box sx={{ textAlign: 'center', mb: 2 }}>
//                 <Typography variant="h5" sx={{ 
//                   fontWeight: 500,
//                   color: "#4caf50",
//                   textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
//                   fontSize: { xs: '1.5rem', sm: '2rem' }
//                 }}>
//                   {data.tamilDay} {data.tamilMonth}
//                 </Typography>
//               </Box>
//             </Grid>
            
//             {/* Festivals Section */}
//             {dateFestivals.length > 0 && (
//               <Grid item xs={12}>
//                 <Divider sx={{ bgcolor: "rgba(255,255,255,0.3)", mb: 2 }}>
//                   <Chip 
//                     icon={<EventIcon />}
//                     label={`Festival${dateFestivals.length > 1 ? 's' : ''} (${dateFestivals.length})`}
//                     size="small" 
//                     sx={{ 
//                       color: "white", 
//                       borderColor: "rgba(255,255,255,0.5)",
//                       bgcolor: 'rgba(255,255,255,0.1)',
//                       backdropFilter: 'blur(5px)'
//                     }} 
//                   />
//                 </Divider>
                
//                 <Box sx={{ 
//                   bgcolor: 'rgba(255,255,255,0.1)',
//                   borderRadius: 2,
//                   backdropFilter: 'blur(5px)',
//                   border: '1px solid rgba(255,255,255,0.2)'
//                 }}>
//                   <List sx={{ py: 0 }}>
//                     {dateFestivals.map((festival, index) => (
//                       <ListItem 
//                         key={festival.id}
//                         sx={{ 
//                           py: 1.5,
//                           borderBottom: index < dateFestivals.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
//                         }}
//                       >
//                         <ListItemIcon sx={{ minWidth: 40 }}>
//                           <Avatar sx={{ 
//                             width: 28, 
//                             height: 28, 
//                             bgcolor: festival.color || '#f44336',
//                             color: 'white',
//                             fontSize: '0.875rem',
//                             fontWeight: 600,
//                             border: '2px solid rgba(255,255,255,0.3)'
//                           }}>
//                             {index + 1}
//                           </Avatar>
//                         </ListItemIcon>
//                         <ListItemText 
//                           primary={
//                             <Typography sx={{ 
//                               color: 'white', 
//                               fontWeight: 500,
//                               fontSize: { xs: '0.95rem', sm: '1rem' }
//                             }}>
//                               {festival.name}
//                             </Typography>
//                           }
//                           secondary={
//                             <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
//                               <Box sx={{ 
//                                 width: 12, 
//                                 height: 12, 
//                                 borderRadius: '50%', 
//                                 bgcolor: festival.color || '#f44336',
//                                 border: '1px solid rgba(255,255,255,0.3)'
//                               }} />
//                               <Typography variant="caption" sx={{ 
//                                 color: 'rgba(255,255,255,0.7)',
//                                 fontSize: '0.75rem'
//                               }}>
//                                 ID: {festival.id}
//                               </Typography>
//                             </Stack>
//                           }
//                         />
//                       </ListItem>
//                     ))}
//                   </List>
//                 </Box>
//               </Grid>
//             )}

//             {/* No Festivals Message */}
//             {dateFestivals.length === 0 && (
//               <Grid item xs={12}>
//                 <Box sx={{ 
//                   textAlign: 'center',
//                   bgcolor: 'rgba(255,255,255,0.05)',
//                   borderRadius: 2,
//                   p: 2,
//                   border: '1px dashed rgba(255,255,255,0.3)'
//                 }}>
//                   <EventIcon sx={{ 
//                     fontSize: 40, 
//                     color: 'rgba(255,255,255,0.5)', 
//                     mb: 1 
//                   }} />
//                   <Typography variant="body2" sx={{ 
//                     color: 'rgba(255,255,255,0.7)',
//                     fontStyle: 'italic'
//                   }}>
//                     No festivals on this date
//                   </Typography>
//                 </Box>
//               </Grid>
//             )}
//           </Grid>
//         )}
//       </DialogContent>
      
//       <DialogActions sx={{ 
//         p: 3, 
//         pt: 2,
//         backgroundColor: "rgba(255,255,255,0.05)",
//         backdropFilter: 'blur(10px)',
//         borderTop: '1px solid rgba(255,255,255,0.1)'
//       }}>
//         <Button 
//           onClick={onClose} 
//           variant="outlined"
//           fullWidth={isMobile}
//           sx={{ 
//             color: "white", 
//             borderColor: "rgba(255,255,255,0.5)",
//             bgcolor: 'rgba(255,255,255,0.1)',
//             backdropFilter: 'blur(5px)',
//             '&:hover': {
//               borderColor: "white",
//               bgcolor: "rgba(255,255,255,0.2)"
//             },
//             fontWeight: 500,
//             px: 4
//           }}
//         >
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// export default DateDetailsModal;


// import React from "react";
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions, 
//   Grid, Typography, Divider, Chip, Button, Box
// } from "@mui/material";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

// function DateDetailsModal({ open, data, onClose }) {
//   return (
//     <Dialog 
//       open={open} 
//       onClose={onClose}
//       PaperProps={{ 
//         sx: { borderRadius: 2, maxWidth: 400 }
//       }}
//     >
//       <DialogTitle sx={{ 
//         pb: 1, 
//         display: "flex", 
//         alignItems: "center", 
//         backgroundColor: "#3f51b5", 
//         color: "white" 
//       }}>
//         <CalendarMonthIcon sx={{ mr: 1 }} /> Date Details
//       </DialogTitle>
      
//       <DialogContent sx={{ pt: 3 }}>
//         {data && (
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <Typography variant="h4" gutterBottom sx={{ 
//                 textAlign: "center", 
//                 fontWeight: 500,
//                 color: "#3f51b5"
//               }}>
//                 {data.englishDate} {data.englishMonth} {data.englishYear}
//               </Typography>
//               <Typography variant="body2" color="textSecondary" align="center">
//                 {data.dayOfWeek}
//               </Typography>
//             </Grid>
            
//             <Grid item xs={12}>
//               <Divider>
//                 <Chip label="Tamil Date" size="small" color="primary" />
//               </Divider>
//             </Grid>
            
//             <Grid item xs={12}>
//               <Typography variant="h5" gutterBottom align="center" sx={{ 
//                 fontWeight: 500,
//                 color: "#009688"
//               }}>
//                 {data.tamilDay} {data.tamilMonth}
//               </Typography>
//             </Grid>
            
//             {data.festival && (
//               <>
//                 <Grid item xs={12}>
//                   <Divider>
//                     <Chip label="Festival" size="small" color="secondary" />
//                   </Divider>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Typography align="center" sx={{ 
//                     color: data.festivalColor || "#e91e63", 
//                     fontWeight: 500 
//                   }}>
//                     {data.festival}
//                   </Typography>
//                 </Grid>
//               </>
//             )}
//           </Grid>
//         )}
//       </DialogContent>
      
//       <DialogActions sx={{ p: 2, pt: 1 }}>
//         <Button 
//           onClick={onClose} 
//           variant="outlined"
//           color="primary"
//         >
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// export default DateDetailsModal;
