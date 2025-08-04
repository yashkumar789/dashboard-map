import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface Rule {
  operator: '<' | '>' | '<=' | '>=' | '=';
  value: string;
  color: string;
}

interface SidebarProps {
  rules: Rule[];
  setRules: (rules: Rule[]) => void;
}

const Sidebar = ({ rules, setRules }: SidebarProps) => {
  const addRule = () => {
    setRules([...rules, { operator: '<', value: '', color: '#ff0000' }]);
  };

  const updateRule = (index: number, field: keyof Rule, newVal: string) => {
    const updated = [...rules];
  
    if (field === 'operator') {
      updated[index].operator = newVal as Rule['operator'];
    } else if (field === 'value') {
      updated[index].value = newVal;
    } else if (field === 'color') {
      updated[index].color = newVal;
    }
  
    setRules(updated);
  };

  const deleteRule = (index: number) => {
    const updated = [...rules];
    updated.splice(index, 1);
    setRules(updated);
  };

  return (
    <Box
      sx={{
        width: 280,
        p: 3,
        borderRight: '1px solid #ddd',
        bgcolor: '#f9f9f9',
        height: '100vh',
        boxSizing: 'border-box',
      }}
    >
      <Typography variant="h6" gutterBottom>
        🎯 Data Source & Rules
      </Typography>

      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Data Source</InputLabel>
        <Select defaultValue="temperature_2m" label="Data Source">
          <MenuItem value="temperature_2m">temperature_2m</MenuItem>
          {/* Add more options later */}
        </Select>
      </FormControl>

      <Typography variant="subtitle1" gutterBottom>
        Color Threshold Rules
      </Typography>

      {rules.map((rule, i) => (
        <Box
          key={i}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 1.5,
          }}
        >
          <FormControl size="small" sx={{ width: 60 }}>
            <Select
              value={rule.operator}
              onChange={(e) => updateRule(i, 'operator', e.target.value)}
            >
              <MenuItem value="<">{'<'}</MenuItem>
              <MenuItem value=">">{'>'}</MenuItem>
              <MenuItem value="<=">{'<='}</MenuItem>
              <MenuItem value=">=">{'>='}</MenuItem>
              <MenuItem value="=">{'='}</MenuItem>
            </Select>
          </FormControl>

          <TextField
            size="small"
            type="number"
            value={rule.value}
            onChange={(e) => updateRule(i, 'value', e.target.value)}
            sx={{ width: 80 }}
          />

          <input
            type="color"
            value={rule.color}
            onChange={(e) => updateRule(i, 'color', e.target.value)}
            style={{ width: 40, height: 32, border: 'none' }}
          />

          <IconButton onClick={() => deleteRule(i)} size="small">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={addRule}
        fullWidth
        sx={{ mt: 1 }}
      >
        Add Rule
      </Button>
    </Box>
  );
};

export default Sidebar;
