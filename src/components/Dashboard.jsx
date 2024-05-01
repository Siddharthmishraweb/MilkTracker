import React, { useEffect, useState } from "react";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TableSortLabel,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [milkingSessions, setMilkingSessions] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const storedSessions = localStorage.getItem("milkingSession");
    if (storedSessions) {
      setMilkingSessions(JSON.parse(storedSessions));
    }
  }, []);

  const handleSort = (property) => {
    const isAsc = sortBy === property && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortBy(property);
  };

  const chartData = milkingSessions.reduce((accumulator, session) => {
    const existingEntryIndex = accumulator.findIndex(
      (entry) => entry.song === session.currentSong
    );
    if (existingEntryIndex !== -1) {
      accumulator[existingEntryIndex].totalMilk += parseInt(session.totalMilk);
    } else {
      accumulator.push({
        song: session.currentSong,
        totalMilk: parseInt(session.totalMilk),
      });
    }
    return accumulator;
  }, []);

  const songCounts = {};
  milkingSessions.forEach((session) => {
    songCounts[session.currentSong] =
      (songCounts[session.currentSong] || 0) + 1;
  });
  const pieChartData = Object.keys(songCounts).map((song) => ({
    name: song,
    value: songCounts[song],
  }));

  const chartVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.5, duration: 1 } },
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
  ];

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Data Analysis
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <motion.div
            variants={chartVariants}
            initial="hidden"
            animate="visible"
          >
            <Typography variant="h5" gutterBottom>
              Milk Production by Song
            </Typography>
            <LineChart width={300} height={300} data={chartData}>
              <XAxis dataKey="song" />
              <YAxis />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="totalMilk" stroke="#8884d8" />
              <Tooltip />
              <Legend />
            </LineChart>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6}>
          <motion.div
            variants={chartVariants}
            initial="hidden"
            animate="visible"
          >
            <Typography variant="h5" gutterBottom>
              Song Play Frequency
            </Typography>
            <PieChart width={300} height={300}>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </motion.div>
        </Grid>
      </Grid>
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Production with Songs
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "black" }}>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "currentSong"}
                    direction={sortOrder}
                    onClick={() => handleSort("currentSong")}
                    style={{ color: "white" }}
                  >
                    Song
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "date"}
                    direction={sortOrder}
                    onClick={() => handleSort("date")}
                    style={{ color: "white" }}
                  >
                    Date
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "startTime"}
                    direction={sortOrder}
                    onClick={() => handleSort("startTime")}
                    style={{ color: "white" }}
                  >
                    Start Time
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "endTime"}
                    direction={sortOrder}
                    onClick={() => handleSort("endTime")}
                    style={{ color: "white" }}
                  >
                    End Time
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "totalTime"}
                    direction={sortOrder}
                    onClick={() => handleSort("totalTime")}
                    style={{ color: "white" }}
                  >
                    Total Time
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "totalMilk"}
                    direction={sortOrder}
                    onClick={() => handleSort("totalMilk")}
                    style={{ color: "white" }}
                  >
                    Total Milk
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {milkingSessions
                .sort((a, b) => {
                  const aValue = a[sortBy];
                  const bValue = b[sortBy];
                  return sortOrder === "asc"
                    ? aValue > bValue
                      ? 1
                      : -1
                    : aValue < bValue
                    ? 1
                    : -1;
                })
                .map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{session.currentSong}</TableCell>
                    <TableCell>{session.date}</TableCell>
                    <TableCell>{session.startTime}</TableCell>
                    <TableCell>{session.endTime}</TableCell>
                    <TableCell>{session.totalTime}</TableCell>
                    <TableCell>{session.totalMilk}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Dashboard;
