import React from "react";
import { 
  Box, Table, TableHead, TableRow, TableCell, TableBody, 
  TextField, Chip, useMediaQuery, useTheme, Typography 
} from "@mui/material";
import { tamilMonths, englishMonths } from "./constants";

function MonthSettings({ months, onChange }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Mobile-specific view
  if (isMobile) {
    return (
      <Box sx={{ borderRadius: 1, overflow: "hidden" }} className="mobile-month-settings">
        {months.map((m, i) => (
          <Box 
            key={i} 
            sx={{ 
              mb: 2, 
              p: 2, 
              borderRadius: 1,
              backgroundColor: i % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent',
              border: '1px solid rgba(103, 58, 183, 0.1)',
            }}
            className="mobile-month-card"
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Chip 
                label={englishMonths[i]} 
                size="small" 
                variant="outlined"
                sx={{ 
                  fontWeight: 400, 
                  bgcolor: 'rgba(103, 58, 183, 0.1)', 
                  color: 'primary.main',
                  border: 'none'
                }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Days in Month
                </Typography>
                <TextField
                  type="number"
                  value={m.daysInMonth}
                  onChange={(e) => onChange(i, "daysInMonth", Number(e.target.value))}
                  size="small" 
                  fullWidth
                  inputProps={{ min: 28, max: 31 }}
                  variant="outlined"
                />
              </Box>
              
              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Tamil Start Day
                </Typography>
                <TextField
                  type="number"
                  value={m.tamilStartDay}
                  onChange={(e) => onChange(i, "tamilStartDay", Number(e.target.value))}
                  size="small" 
                  fullWidth
                  inputProps={{ min: 1, max: 31 }}
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  // Tablet view - simplified table with fewer columns
  if (isTablet) {
    return (
      <Box sx={{ borderRadius: 1, overflow: "auto" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: "linear-gradient(45deg, #673ab7, #9575cd)" }}>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>English Month</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>Days</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>Start</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {months.map((m, i) => (
              <TableRow key={i} sx={{ 
                "&:nth-of-type(odd)": { backgroundColor: "rgba(0,0,0,0.03)" },
                "&:hover": { backgroundColor: "rgba(103, 58, 183, 0.05)" }
              }}>
                <TableCell>
                  <Typography variant="body2">
                    {englishMonths[i]}
                  </Typography>
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={m.daysInMonth}
                    onChange={(e) => onChange(i, "daysInMonth", Number(e.target.value))}
                    size="small" 
                    sx={{ width: "80px" }}
                    inputProps={{ min: 28, max: 31 }}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={m.tamilStartDay}
                    onChange={(e) => onChange(i, "tamilStartDay", Number(e.target.value))}
                    size="small" 
                    sx={{ width: "80px" }}
                    inputProps={{ min: 1, max: 31 }}
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    );
  }

  // Desktop view - full table
  return (
    <Box sx={{ borderRadius: 1, overflow: "auto" }}>
      <Table>
        <TableHead>
          <TableRow sx={{ background: "linear-gradient(45deg, #673ab7, #9575cd)" }}>
            <TableCell sx={{ color: "white", fontWeight: 600 }}>Month</TableCell>
            <TableCell sx={{ color: "white", fontWeight: 600 }}>English Month</TableCell>
            <TableCell sx={{ color: "white", fontWeight: 600 }}>Days in Month</TableCell>
            <TableCell sx={{ color: "white", fontWeight: 600 }}>Tamil Start Day</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {months.map((m, i) => (
            <TableRow key={i} sx={{ 
              "&:nth-of-type(odd)": { backgroundColor: "rgba(0,0,0,0.03)" },
              "&:hover": { backgroundColor: "rgba(103, 58, 183, 0.05)" }
            }}>
              <TableCell>
                <Chip 
                  label={tamilMonths[i]} 
                  size="large" 
                  variant="outlined"
                  sx={{ fontWeight: 500, bgcolor:'rgba(103, 58, 183, 0.8)', color:'white', width:'100px' }}
                />
              </TableCell>
              <TableCell>
                {englishMonths[i]}
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={m.daysInMonth}
                  onChange={(e) => onChange(i, "daysInMonth", Number(e.target.value))}
                  size="small" 
                  sx={{ width: "100px" }}
                  inputProps={{ min: 28, max: 31 }}
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={m.tamilStartDay}
                  onChange={(e) => onChange(i, "tamilStartDay", Number(e.target.value))}
                  size="small" 
                  sx={{ width: "100px" }}
                  inputProps={{ min: 1, max: 31 }}
                  variant="outlined"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

export default MonthSettings;


// import React from "react";
// import { Box, Table, TableHead, TableRow, TableCell, TableBody, TextField, Chip } from "@mui/material";
// import { tamilMonths, englishMonths } from "./constants";

// function MonthSettings({ months, onChange }) {
//   return (
//     <Box sx={{ borderRadius: 1, overflow: "hidden" }}>
//       <Table>
//         <TableHead>
//           <TableRow sx={{ background: "linear-gradient(45deg, #3f51b5, #5c6bc0)" }}>
//             <TableCell sx={{ color: "white", fontWeight: 600 }}>Month</TableCell>
//             <TableCell sx={{ color: "white", fontWeight: 600 }}>English Month</TableCell>
//             <TableCell sx={{ color: "white", fontWeight: 600 }}>Days in Month</TableCell>
//             <TableCell sx={{ color: "white", fontWeight: 600 }}>Tamil Start Day</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {months.map((m, i) => (
//             <TableRow key={i} sx={{ 
//               "&:nth-of-type(odd)": { backgroundColor: "rgba(0,0,0,0.03)" },
//               "&:hover": { backgroundColor: "rgba(63, 81, 181, 0.05)" }
//             }}>
//               <TableCell>
//                 <Chip 
//                   label={tamilMonths[i]} 
//                   size="large" 
//                   variant="outlined"
//                   sx={{ fontWeight: 500, bgcolor:'rgba(83, 123, 202, 1)', color:'white', width:'100px' }}
//                 />
//               </TableCell>
//               <TableCell>
//                 {englishMonths[i]}
//               </TableCell>
//               <TableCell>
//                 <TextField
//                   type="number"
//                   value={m.daysInMonth}
//                   onChange={(e) => onChange(i, "daysInMonth", Number(e.target.value))}
//                   size="small" 
//                   sx={{ width: "100px" }}
//                   inputProps={{ min: 28, max: 31 }}
//                   variant="outlined"
//                 />
//               </TableCell>
//               <TableCell>
//                 <TextField
//                   type="number"
//                   value={m.tamilStartDay}
//                   onChange={(e) => onChange(i, "tamilStartDay", Number(e.target.value))}
//                   size="small" 
//                   sx={{ width: "100px" }}
//                   inputProps={{ min: 1, max: 31 }}
//                   variant="outlined"
//                 />
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </Box>
//   );
// }

// export default MonthSettings;
