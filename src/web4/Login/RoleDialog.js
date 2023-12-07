import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';

const RoleDialog = ({ onDialogClose, onDialogSubmit }) => {
    const [role, setRole] = useState('');
    const [nric, setNric] = useState('');

    const handleSubmit = () => {
        onDialogSubmit(role, nric);
        onDialogClose();
    };

    return (
        <Dialog open={true} onClose={onDialogClose}>
            <DialogTitle>Enter Your Information</DialogTitle>
            <DialogContent>
                <TextField
                    select
                    label="Select Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    fullWidth
                >
                    {['Donor', 'Beneficiary', 'NGO'].map((option) => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    margin="dense"
                    id="nric"
                    label="NRIC"
                    type="text"
                    fullWidth
                    value={nric}
                    onChange={(e) => setNric(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onDialogClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
};

export default RoleDialog;
