import React from 'react';
import './header.css'; 
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField
} from "@mui/material";

const Header = () => {
  const [open, setOpen] = React.useState(false);

    const handleClickToOpen = () => {
        setOpen(true);
    };

    const handleToClose = () => {
        setOpen(false);
    };
  return (
    <>
    <header className="header">
      <div className="header-container">
        <div className="center-section">
          <h1><span className="icon">⚡</span> Power Consumption</h1>
        </div>
        <div className="right-section">
          <input type="text" placeholder="Search power terms..." />
          <button className="search-btn">Search</button>
          <button className="login-btn" variant="outlined" color="primary"
                onClick={handleClickToOpen}>Login</button>
                <Dialog open={open} onClose={handleToClose}>
                <center><DialogTitle>{"Login"}</DialogTitle></center>
                <DialogContent>
                    <DialogContentText>
                      Username: <TextField></TextField>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleToClose}
                        color="primary" autoFocus>
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
        
      </div>
    </header>
    <div className='body'>

    </div>
    </>
    
  );
};

export default Header;