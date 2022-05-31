import {
  LineChart,
  ResponsiveContainer,
  Legend, Tooltip,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { COLORS } from './helper';

const SimpleLineChart = ({ data, dataKey, lineKeys, showGrid }) => (
  <ResponsiveContainer width="100%" aspect={3}>
    <LineChart data={data}>
      {showGrid && <CartesianGrid />}
      <XAxis dataKey={dataKey} 
        interval={'preserveStartEnd'} />
      <YAxis></YAxis>
      <Legend />
      <Tooltip />
      {lineKeys.map((key, index) => (
        <Line
          key={key}
          stroke={COLORS[index % COLORS.length]}
          dataKey={key}
          activeDot={{ r: 6 }} />))
      }
    </LineChart>
  </ResponsiveContainer>
);

export default SimpleLineChart;
