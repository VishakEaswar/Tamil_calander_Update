import React, { useState } from "react";
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  IconButton, 
  InputAdornment,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Slide,
  useMediaQuery,
  useTheme,
  Alert
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { authenticateUser } from "./utils/authUtils";

/**
 * Login Page Component for Tamil Calendar
 * - Authenticates against preloaded users from JSON file
 */
const LoginPage = ({ onLogin }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle form field changes
  const handleLoginChange = (e) => {
    const { name, value, checked } = e.target;
    setLoginForm({
      ...loginForm,
      [name]: name === 'rememberMe' ? checked : value
    });
  };
  
  // Handle login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    if (!loginForm.email || !loginForm.password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const user = await authenticateUser(loginForm.email, loginForm.password, loginForm.rememberMe);
      
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Slide direction="up" in={true} mountOnEnter unmountOnExit>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2,
          background: 'linear-gradient(135deg, rgba(103,58,183,0.1), rgba(0,188,212,0.1))',
        }}
      >
        <Paper
          elevation={4}
          sx={{
            width: '100%',
            maxWidth: 400,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 3
          }}
        >
          {/* Logo/App Header */}
          <Box sx={{ 
            pt: isMobile ? 4 : 5,
            pb: 3,
            px: 3,
            width: '100%',
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center' 
          }}>
            <Box
              sx={{
                bgcolor: theme.palette.primary.main,
                color: 'white',
                width: 64,
                height: 64,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2.5,
                boxShadow: '0 4px 12px rgba(103, 58, 183, 0.25)'
              }}
            >
              <CalendarMonthIcon sx={{ fontSize: 36 }} />
            </Box>
            
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
              Tamil Calendar
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center">
              Sign in with your credentials to access the calendar
            </Typography>
          </Box>
          
          <Box sx={{ p: 3, pt: 0, width: '100%' }}>
            {/* Error message */}
            {error && (
              <Alert 
                severity="error" 
                variant="outlined"
                sx={{ mb: 3, width: '100%' }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            )}
            
            {/* Login Form */}
            <Box component="form" onSubmit={handleLoginSubmit} sx={{ width: '100%' }}>
              <TextField
                fullWidth
                margin="normal"
                label="Email Address"
                type="email"
                name="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                autoFocus
              />
              
              <TextField
                fullWidth
                margin="normal"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <Box sx={{ 
                mt: 1.5,
                mb: 3
              }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={loginForm.rememberMe}
                      onChange={handleLoginChange}
                      name="rememberMe"
                      color="primary"
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">Remember me</Typography>}
                />
              </Box>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ 
                  py: 1.5, 
                  position: 'relative',
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: '1rem'
                }}
              >
                {loading ? (
                  <CircularProgress 
                    size={24} 
                    color="inherit" 
                    sx={{ position: 'absolute' }} 
                  />
                ) : 'Sign in'}
              </Button>
              
              {/* Sample login credentials hint */}
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="caption" color="textSecondary">
                 Only Authorized Personnel Can Login
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
        
        <Typography 
          variant="caption" 
          color="textSecondary" 
          sx={{ mt: 4, textAlign: 'center' }}
        >
          &copy; {new Date().getFullYear()} Tamil Calendar. All rights reserved.
        </Typography>
      </Box>
    </Slide>
  );
};

export default LoginPage;


// import React, { useState } from "react";
// import { 
//   Box, 
//   Paper, 
//   Typography, 
//   TextField, 
//   Button, 
//   Divider,
//   IconButton, 
//   InputAdornment,
//   Link,
//   Checkbox,
//   FormControlLabel,
//   CircularProgress,
//   Slide,
//   useMediaQuery,
//   useTheme,
//   Alert,
//   Tabs,
//   Tab
// } from "@mui/material";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
// import GoogleIcon from "@mui/icons-material/Google";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
// import { authenticateUser, registerUser } from "./utils/authUtils";

// /**
//  * Login/Registration Page Component
//  */
// const LoginPage = ({ onLogin }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const [activeTab, setActiveTab] = useState(0); // 0 = Login, 1 = Register
  
//   const [loginForm, setLoginForm] = useState({
//     email: '',
//     password: '',
//     rememberMe: false,
//   });
  
//   const [registerForm, setRegisterForm] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });
  
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   // Handle Login Form Changes
//   const handleLoginChange = (e) => {
//     const { name, value, checked } = e.target;
//     setLoginForm({
//       ...loginForm,
//       [name]: name === 'rememberMe' ? checked : value
//     });
//   };
  
//   // Handle Register Form Changes
//   const handleRegisterChange = (e) => {
//     const { name, value } = e.target;
//     setRegisterForm({
//       ...registerForm,
//       [name]: value
//     });
//   };
  
//   // Handle Login Submit
//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!loginForm.email || !loginForm.password) {
//       setError('Please enter both email and password');
//       return;
//     }
    
//     try {
//       setLoading(true);
//       setError('');
      
//       const user = await authenticateUser(loginForm.email, loginForm.password, loginForm.rememberMe);
      
//       if (user) {
//         onLogin(user);
//       } else {
//         setError('Invalid email or password');
//       }
//     } catch (err) {
//       setError(err.message || 'An error occurred during login. Please try again.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle Register Submit
//   const handleRegisterSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate form
//     if (!registerForm.name || !registerForm.email || !registerForm.password) {
//       setError('Please fill all required fields');
//       return;
//     }
    
//     if (registerForm.password !== registerForm.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }
    
//     if (registerForm.password.length < 6) {
//       setError('Password should be at least 6 characters long');
//       return;
//     }
    
//     try {
//       setLoading(true);
//       setError('');
      
//       await registerUser(registerForm.name, registerForm.email, registerForm.password);
      
//       setSuccess('Account created successfully! You can now log in.');
      
//       // Reset form and switch to login tab
//       setRegisterForm({
//         name: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//       });
      
//       setTimeout(() => {
//         setActiveTab(0);
//         setSuccess('');
//       }, 3000);
      
//     } catch (err) {
//       setError(err.message || 'An error occurred during registration. Please try again.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Slide direction="up" in={true} mountOnEnter unmountOnExit>
//       <Box
//         sx={{
//           minHeight: '100vh',
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'center',
//           alignItems: 'center',
//           padding: 2,
//           background: 'linear-gradient(135deg, rgba(103,58,183,0.1), rgba(0,188,212,0.1))',
//         }}
//       >
//         <Paper
//           elevation={4}
//           sx={{
//             width: '100%',
//             maxWidth: 450,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             position: 'relative',
//             overflow: 'hidden',
//           }}
//         >
//           {/* Logo/App Header */}
//           <Box sx={{ 
//             p: isMobile ? 2 : 3,
//             pb: 0,
//             width: '100%',
//             display: 'flex', 
//             flexDirection: 'column', 
//             alignItems: 'center' 
//           }}>
//             <Box
//               sx={{
//                 bgcolor: theme.palette.primary.main,
//                 color: 'white',
//                 width: 56,
//                 height: 56,
//                 borderRadius: 2,
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 mb: 2,
//                 boxShadow: '0 4px 12px rgba(103, 58, 183, 0.25)'
//               }}
//             >
//               <CalendarMonthIcon sx={{ fontSize: 32 }} />
//             </Box>
            
//             <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
//               Tamil Calendar
//             </Typography>
//             <Typography variant="body2" color="textSecondary">
//               {activeTab === 0 ? 'Sign in to your account' : 'Create a new account'}
//             </Typography>
            
//             {/* Tabs */}
//             <Tabs 
//               value={activeTab} 
//               onChange={(_, newValue) => {
//                 setActiveTab(newValue);
//                 setError('');
//                 setSuccess('');
//               }}
//               sx={{ 
//                 mt: 3, 
//                 width: '100%',
//                 '& .MuiTabs-indicator': {
//                   height: 3,
//                   borderRadius: '3px 3px 0 0'
//                 }
//               }}
//               variant="fullWidth"
//             >
//               <Tab label="Login" sx={{ fontWeight: 500 }} />
//               <Tab label="Register" sx={{ fontWeight: 500 }} />
//             </Tabs>
//           </Box>
          
//           <Box sx={{ p: isMobile ? 2 : 3, pt: 3, width: '100%' }}>
//             {/* Success message */}
//             {success && (
//               <Alert 
//                 severity="success" 
//                 sx={{ mb: 3, width: '100%' }}
//                 onClose={() => setSuccess('')}
//               >
//                 {success}
//               </Alert>
//             )}
            
//             {/* Error message */}
//             {error && (
//               <Alert 
//                 severity="error" 
//                 variant="outlined"
//                 sx={{ mb: 3, width: '100%' }}
//                 onClose={() => setError('')}
//               >
//                 {error}
//               </Alert>
//             )}
            
//             {/* Login Form */}
//             {activeTab === 0 && (
//               <Box component="form" onSubmit={handleLoginSubmit} sx={{ width: '100%' }}>
//                 <TextField
//                   fullWidth
//                   margin="normal"
//                   label="Email Address"
//                   type="email"
//                   name="email"
//                   value={loginForm.email}
//                   onChange={handleLoginChange}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <EmailOutlinedIcon color="action" />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
                
//                 <TextField
//                   fullWidth
//                   margin="normal"
//                   label="Password"
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   value={loginForm.password}
//                   onChange={handleLoginChange}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <LockOutlinedIcon color="action" />
//                       </InputAdornment>
//                     ),
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <IconButton
//                           onClick={() => setShowPassword(!showPassword)}
//                           edge="end"
//                           size="small"
//                         >
//                           {showPassword ? <VisibilityOff /> : <Visibility />}
//                         </IconButton>
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
                
//                 <Box sx={{ 
//                   display: 'flex', 
//                   justifyContent: 'space-between', 
//                   alignItems: 'center',
//                   mt: 1,
//                   mb: 2
//                 }}>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={loginForm.rememberMe}
//                         onChange={handleLoginChange}
//                         name="rememberMe"
//                         color="primary"
//                         size="small"
//                       />
//                     }
//                     label={<Typography variant="body2">Remember me</Typography>}
//                   />
                  
//                   <Link 
//                     href="#" 
//                     variant="body2" 
//                     color="primary"
//                     underline="hover"
//                     sx={{ fontWeight: 500 }}
//                   >
//                     Forgot password?
//                   </Link>
//                 </Box>
                
//                 <Button
//                   type="submit"
//                   fullWidth
//                   variant="contained"
//                   size="large"
//                   disabled={loading}
//                   sx={{ 
//                     py: 1.5, 
//                     mt: 1, 
//                     position: 'relative',
//                     backgroundColor: theme.palette.primary.main,
//                     '&:hover': {
//                       backgroundColor: theme.palette.primary.dark,
//                     },
//                   }}
//                 >
//                   {loading ? (
//                     <CircularProgress 
//                       size={24} 
//                       color="inherit" 
//                       sx={{ position: 'absolute' }} 
//                     />
//                   ) : 'Sign in'}
//                 </Button>
                
//                 <Divider sx={{ my: 3 }}>
//                   <Typography 
//                     variant="body2" 
//                     color="textSecondary"
//                     sx={{ px: 1 }}
//                   >
//                     OR
//                   </Typography>
//                 </Divider>
                
//                 <Button
//                   fullWidth
//                   variant="outlined"
//                   disabled={loading}
//                   sx={{ 
//                     py: 1.5,
//                     borderColor: '#e0e0e0',
//                     color: theme.palette.text.primary,
//                     '&:hover': {
//                       backgroundColor: 'rgba(0, 0, 0, 0.02)',
//                       borderColor: '#d5d5d5'
//                     }
//                   }}
//                   startIcon={<GoogleIcon sx={{ color: '#4285F4' }} />}
//                 >
//                   Continue with Google
//                 </Button>
//               </Box>
//             )}
            
//             {/* Register Form */}
//             {activeTab === 1 && (
//               <Box component="form" onSubmit={handleRegisterSubmit} sx={{ width: '100%' }}>
//                 <TextField
//                   fullWidth
//                   margin="normal"
//                   label="Full Name"
//                   type="text"
//                   name="name"
//                   value={registerForm.name}
//                   onChange={handleRegisterChange}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <PersonOutlineIcon color="action" />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
                
//                 <TextField
//                   fullWidth
//                   margin="normal"
//                   label="Email Address"
//                   type="email"
//                   name="email"
//                   value={registerForm.email}
//                   onChange={handleRegisterChange}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <EmailOutlinedIcon color="action" />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
                
//                 <TextField
//                   fullWidth
//                   margin="normal"
//                   label="Password"
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   value={registerForm.password}
//                   onChange={handleRegisterChange}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <LockOutlinedIcon color="action" />
//                       </InputAdornment>
//                     ),
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <IconButton
//                           onClick={() => setShowPassword(!showPassword)}
//                           edge="end"
//                           size="small"
//                         >
//                           {showPassword ? <VisibilityOff /> : <Visibility />}
//                         </IconButton>
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
                
//                 <TextField
//                   fullWidth
//                   margin="normal"
//                   label="Confirm Password"
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   name="confirmPassword"
//                   value={registerForm.confirmPassword}
//                   onChange={handleRegisterChange}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <LockOutlinedIcon color="action" />
//                       </InputAdornment>
//                     ),
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <IconButton
//                           onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                           edge="end"
//                           size="small"
//                         >
//                           {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
//                         </IconButton>
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
                
//                 <Box sx={{ mt: 2, mb: 2 }}>
//                   <Typography variant="caption" color="textSecondary">
//                     By registering, you agree to our Terms of Service and Privacy Policy.
//                   </Typography>
//                 </Box>
                
//                 <Button
//                   type="submit"
//                   fullWidth
//                   variant="contained"
//                   size="large"
//                   disabled={loading}
//                   sx={{ 
//                     py: 1.5, 
//                     mt: 1, 
//                     position: 'relative',
//                     backgroundColor: theme.palette.primary.main,
//                     '&:hover': {
//                       backgroundColor: theme.palette.primary.dark,
//                     },
//                   }}
//                 >
//                   {loading ? (
//                     <CircularProgress 
//                       size={24} 
//                       color="inherit" 
//                       sx={{ position: 'absolute' }} 
//                     />
//                   ) : 'Create Account'}
//                 </Button>
//               </Box>
//             )}
//           </Box>
//         </Paper>
        
//         <Typography 
//           variant="caption" 
//           color="textSecondary" 
//           sx={{ mt: 4, textAlign: 'center' }}
//         >
//           &copy; {new Date().getFullYear()} Tamil Calendar. All rights reserved.
//         </Typography>
//       </Box>
//     </Slide>
//   );
// };

// export default LoginPage;
