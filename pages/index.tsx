import { useState } from 'react';
import dynamic from 'next/dynamic';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Sidebar from '@/components/Sidebar';

const MapView = dynamic(() => import('../components/MapView'), { ssr: false });

type Rule = {
  operator: '<' | '>' | '<=' | '>=' | '=';
  value: string;
  color: string;
};

function ValueLabelComponent(props: any) {
  const { children, value } = props;
  return (
    <Tooltip enterTouchDelay={0} placement="top" title={`${value}h`}>
      {children}
    </Tooltip>
  );
}

const StyledSlider = styled(Slider)(({ theme }) => ({
  color: '#00BFFF',
  height: 6,
  padding: '20px 0',

  '& .MuiSlider-thumb': {
    height: 20,
    width: 20,
    backgroundColor: '#fff',
    border: '2px solid #00BFFF',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
    },
  },
  '& .MuiSlider-track': {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00BFFF',
  },
  '& .MuiSlider-rail': {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2c2f33',
  },
  '& .MuiSlider-valueLabel': {
    backgroundColor: '#00BFFF',
    color: '#000',
  },
}));

export default function Home() {
  const [range, setRange] = useState<number[]>([0, 720]);
  const [rules, setRules] = useState<Rule[]>([
    { operator: '<', value: '10', color: '#ff0000' },
    { operator: '<', value: '25', color: '#00ff00' },
    { operator: '>=', value: '25', color: '#0000ff' }
  ]);

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    setRange(newValue as number[]);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#1e1e2f', color: '#fff' }}>
      {/* Sidebar */}
      <Sidebar rules={rules} setRules={setRules}  />

      {/* Main Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{
          textAlign: 'center',
          padding: '16px',
          fontWeight: 'bold',
          fontSize: '1.6rem',
          backgroundColor: '#1e1e2f',
          color: '#fff',
          borderBottom: '1px solid #2c2f33'
        }}>
          30-Day Timeline Polygon Dashboard
        </header>

        {/* Slider */}
        <Box sx={{
          px: 4, py: 3, mx: 4, my: 2,
          bgcolor: '#2c2f33',
          borderRadius: 2,
          boxShadow: 3,
        }}>
          <Typography gutterBottom sx={{ fontWeight: 'bold', color: '#fff' }}>
            Time Range: Day {range[0] / 24} to Day {range[1] / 24}
          </Typography>
          <StyledSlider
            value={range}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            min={0}
            max={720}
            step={1}
            marks={[
              { value: 0, label: '0' },
              { value: 360, label: '15' },
              { value: 720, label: '30' }
            ]}
          />
        </Box>

        {/* Map */}
        <div style={{
          flex: 1,
          margin: '0 32px 32px 32px',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
        }}>
          <MapView timeRange={range} rules={rules} />
        </div>
      </div>
    </div>
  );
}