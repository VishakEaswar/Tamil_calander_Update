import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import TamilCalendar from "./components/TamilCalendar";
import LoginPage from "./components/LoginPage";
import { getStoredAuth, clearStoredAuth } from "./components/utils/storage";

// Import CSS files
import './index.css';
import './App.css';

// Create a custom theme with updated colors
const theme = createTheme({
  palette: {
    primary: {
      main: "#673ab7", // Deep Purple
      light: "#9575cd",
      dark: "#512da8",
    },
    secondary: {
      main: "#00bcd4", // Cyan
      light: "#4dd0e1",
      dark: "#0097a7",
    },
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#ff9800",
    },
    success: {
      main: "#4caf50",
    },
    info: {
      main: "#2196f3",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#212121",
      secondary: "#666666",
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(45deg, #512da8, #673ab7)",
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minWidth: 0,
          padding: '12px 16px',
          '@media (max-width:600px)': {
            padding: '8px',
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored auth on app load
  useEffect(() => {
    const checkAuth = async () => {
      const auth = await getStoredAuth();
      if (auth) {
        setCurrentUser(auth.user);
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    clearStoredAuth();
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100vh',
          background: theme.palette.background.default
        }}>
          <img 
            src="/logo.png" 
            alt="Loading" 
            style={{ 
              width: 80, 
              height: 80,
              opacity: 0.7,
              animation: 'pulse 1.5s infinite' 
            }} 
          />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isLoggedIn ? (
        <div className="tamil-calendar-container">
          <TamilCalendar user={currentUser} onLogout={handleLogout} />
        </div>
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </ThemeProvider>
  );
}

export default App;



// import React from "react";
// import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
// import TamilCalendar from "./components/TamilCalendar";

// // Import CSS files
// import './index.css';
// import './App.css';

// // Create a custom theme with updated colors
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#673ab7", // Deep Purple
//       light: "#9575cd",
//       dark: "#512da8",
//     },
//     secondary: {
//       main: "#00bcd4", // Cyan
//       light: "#4dd0e1",
//       dark: "#0097a7",
//     },
//     error: {
//       main: "#f44336",
//     },
//     warning: {
//       main: "#ff9800",
//     },
//     success: {
//       main: "#4caf50",
//     },
//     info: {
//       main: "#2196f3",
//     },
//     background: {
//       default: "#f8f9fa",
//       paper: "#ffffff",
//     },
//     text: {
//       primary: "#212121",
//       secondary: "#666666",
//     },
//   },
//   typography: {
//     fontFamily: [
//       'Roboto',
//       'Arial',
//       'sans-serif',
//     ].join(','),
//     h6: {
//       fontWeight: 500,
//     },
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           textTransform: 'none',
//           borderRadius: 8,
//         },
//       },
//     },
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: 12,
//         },
//       },
//     },
//     MuiPaper: {
//       styleOverrides: {
//         root: {
//           borderRadius: 12,
//         },
//       },
//     },
//     MuiAppBar: {
//       styleOverrides: {
//         root: {
//           background: "linear-gradient(45deg, #512da8, #673ab7)",
//         }
//       }
//     },
//     MuiTab: {
//       styleOverrides: {
//         root: {
//           minWidth: 0,
//           padding: '12px 16px',
//           '@media (max-width:600px)': {
//             padding: '8px',
//           },
//         },
//       },
//     },
//   },
//   breakpoints: {
//     values: {
//       xs: 0,
//       sm: 600,
//       md: 900,
//       lg: 1200,
//       xl: 1536,
//     },
//   },
// });

// function App() {
//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <div className="tamil-calendar-container">
//         <TamilCalendar />
//       </div>
//     </ThemeProvider>
//   );
// }

// export default App;
