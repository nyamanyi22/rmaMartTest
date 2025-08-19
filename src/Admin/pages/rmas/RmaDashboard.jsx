import { useEffect, useState } from 'react';
import axiosAdmin from '../../api/axiosAdmin';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, Grid, Typography, CircularProgress, Alert, Box, Tooltip as MuiTooltip } from '@mui/material';

// Status colors
const COLORS = {
  PENDING: '#FFA500',
  APPROVED: '#00C49F',
  COMPLETED: '#0088FE',
  REJECTED: '#FF0000',
  PROCESSING: '#800080',
  SHIPPED: '#FF8042',
};

const AdminDashboard = () => {
  const [data, setData] = useState({
    rmaCounts: {},
    totalProducts: 0,
    totalCustomers: 0,
    recentActivities: [],
    monthlyStats: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosAdmin.get('/dashboard-data');
        setData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Safe rmaCounts as numbers
  const safeRmaCounts = {};
  Object.entries(data.rmaCounts || {}).forEach(([key, value]) => {
    safeRmaCounts[key] = typeof value === 'number' ? value : (value?.count || 0);
  });

  // Prepare pie chart data
  const pieData = Object.entries(safeRmaCounts).map(([key, value]) => ({
    name: key.charAt(0) + key.slice(1).toLowerCase(),
    value,
    color: COLORS[key] || '#8884d8',
  }));

  const totalRmas = pieData.reduce((sum, item) => sum + item.value, 0);

  const formatNumber = (num) => num.toLocaleString();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box my={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Total Customers" value={formatNumber(data.totalCustomers)} color="#4e73df" icon="👥" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Total Products" value={formatNumber(data.totalProducts)} color="#1cc88a" icon="📦" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Total RMAs" value={formatNumber(totalRmas)} color="#36b9cc" icon="🔄" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Active RMAs" value={formatNumber(totalRmas - (safeRmaCounts.COMPLETED || 0))} color="#f6c23e" icon="⚠️" />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <ChartCard title="RMA Status Distribution">
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    isAnimationActive
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} RMAs`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartCard title="Monthly RMA Trends">
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.monthlyStats}
                  margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="created" fill="#8884d8" name="Created" />
                  <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </ChartCard>
        </Grid>
      </Grid>

      {/* Recent Activities */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ChartCard title="Recent Activities">
            <Box sx={{ maxHeight: 400, overflowY: 'auto', px: 2, py: 1, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
              {data.recentActivities?.length > 0 ? (
                <ul style={{ paddingLeft: 20 }}>
                  {data.recentActivities.map((activity, index) => (
                    <li key={index} style={{ marginBottom: 8 }}>
                      <Typography variant="body2">
                        <strong>{activity.action}</strong> - {activity.description}
                        <span style={{ color: '#666', fontSize: '0.8rem', marginLeft: 8 }}>
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                      </Typography>
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography variant="body1" color="textSecondary">
                  No recent activities found
                </Typography>
              )}
            </Box>
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, color, icon }) => (
  <MuiTooltip title={title}>
    <Card sx={{
      height: '100%',
      transition: 'transform 0.2s',
      '&:hover': { transform: 'scale(1.03)', boxShadow: 6 }
    }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>{title}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{value}</Typography>
          </Box>
          <Box sx={{
            backgroundColor: color + '20',
            color: color,
            borderRadius: '50%',
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  </MuiTooltip>
);

// Chart Card Component
const ChartCard = ({ title, children }) => (
  <Card sx={{ height: '100%', boxShadow: 3 }}>
    <CardHeader title={title} />
    <CardContent>{children}</CardContent>
  </Card>
);

export default AdminDashboard;
