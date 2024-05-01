import { Box, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography } from "@mui/material";
import React, { useState } from "react";
import { Table } from "react-bootstrap";

const MilkingHistory = ({ milkingSessions }) => {
  const milkSessions = JSON.parse(localStorage.getItem("milkingSession"));

  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (property) => {
    const isAsc = sortBy === property && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortBy(property);
  };
  return (
    // <table className="table table-striped">
    //   <thead>
    //     <tr>
    //       <th scope="col">#</th>
    //       <th scope="col">Date</th>
    //       <th scope="col">Start Time</th>
    //       <th scope="col">End Time</th>
    //       <th scope="col">Total Time</th>
    //       <th scope="col">Total Milk (Liters)</th>
    //       <th scope="col">Song</th>
    //     </tr>
    //   </thead>

    //   <tbody>
    //     {milkSessions.map((session) => (
    //       <tr key={session.id}>
    //         <td>{session.id}</td>
    //         <td>{session.date}</td>
    //         <td>{session.startTime}</td>
    //         <td>{session.endTime}</td>
    //         <td>{session.totalTime}</td>
    //         <td>{session.totalMilk}</td>
    //         <td>{session.currentSong}</td>
    //       </tr>
    //     ))}
    //   </tbody>
    // </table>
  

    
    <Box mt={4}>
    <Typography variant="h5" gutterBottom>
      Milk History
    </Typography>
    <TableContainer component={Paper}>
      <Table>
      <TableHead style={{ backgroundColor: "black" }}>
          <TableRow >
            <TableCell sx={{ backgroundColor: "black" }}>
              <TableSortLabel
                active={sortBy === "currentSong"}
                direction={sortOrder}
                onClick={() => handleSort("currentSong")}
                style={{ color: "black"}}
              >
                Song
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === "date"}
                direction={sortOrder}
                onClick={() => handleSort("date")}
                style={{ color: "black" }}
              >
                Date
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === "startTime"}
                direction={sortOrder}
                onClick={() => handleSort("startTime")}
                style={{ color: "black" }}
              >
                Start Time
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === "endTime"}
                direction={sortOrder}
                onClick={() => handleSort("endTime")}
                style={{ color: "black" }}
              >
                End Time
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === "totalTime"}
                direction={sortOrder}
                onClick={() => handleSort("totalTime")}
                style={{ color: "black" }}
              >
                Total Time
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === "totalMilk"}
                direction={sortOrder}
                onClick={() => handleSort("totalMilk")}
                style={{ color: "black" }}
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
  );
};

export default MilkingHistory;
