import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import "./ReportHarian.css";
import { useReactToPrint } from "react-to-print";
import { baseURl } from "../../../constan";

const ReportHarian = () => {
  const componentPDF = useRef();
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURl}/api/deteksi`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: "Hasil Deteksi",
    onAfterPrint: () => alert("DATA saved in PDF"),
  });

  const filteredData = data.filter((row) => {
    const rowDate = new Date(row.tgl_deteksi);
    if (startDate && endDate) {
      const filterStartDate = new Date(startDate);
      const filterEndDate = new Date(endDate);
      return rowDate >= filterStartDate && rowDate <= filterEndDate;
    } else if (startDate) {
      const filterStartDate = new Date(startDate);
      return rowDate >= filterStartDate;
    } else if (endDate) {
      const filterEndDate = new Date(endDate);
      return rowDate <= filterEndDate;
    }
    return true;
  });

  return (
    <div className="Table mt-5">
      <TableContainer
        component={Paper}
        className="tableAll-wrapper-scroll-y tableAll-custom-scrollbar"
      >
        <div ref={componentPDF} style={{ width: "100%" }}>
          <Table sx={{ minWidth: 600 }} aria-label="simple table">
            <TableHead
              className="TableHeadReport"
              style={{ backgroundColor: "white" }}
            >
              <TableRow>
                <TableCell align="center" width={10} className="fw-bold">
                  No.
                </TableCell>
                <TableCell align="center" width={70} className="fw-bold">
                  Kode Deteksi
                </TableCell>
                <TableCell align="center" className="fw-bold">
                  Gejala
                </TableCell>
                <TableCell align="center" className="fw-bold">
                  Hama dan Penyakit
                </TableCell>
                <TableCell align="center" className="fw-bold">
                  Similarity
                </TableCell>
                <TableCell align="center" className="fw-bold">
                  Jenis
                </TableCell>
                <TableCell align="center" width={320} className="fw-bold">
                  Solusi
                </TableCell>
                <TableCell align="center" width={120} className="fw-bold">
                  Tanggal Deteksi
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow
                  key={row.id_deteksi}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align="center">
                    {index + 1}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {row.id_deteksi}
                  </TableCell>
                  <TableCell align="left">
                    {row.gejala.split(",").map((namaGejala, index) => (
                      <div key={index} style={{ margin: "0 10px" }}>
                        {namaGejala}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell align="center">{row.hasil}</TableCell>
                  <TableCell align="justify">
                    {parseFloat(row.similarity).toFixed(3)}
                  </TableCell>
                  <TableCell align="center">{row.jenis}</TableCell>
                  <TableCell align="justify">{row.solusi}</TableCell>
                  <TableCell align="justify">
                    {formatDate(row.tgl_deteksi)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TableContainer>
      <div className="d-flex align-items-center mt-3 gap-2">
        <label htmlFor="startDate" className="text1">
          Tanggal :
        </label>
        <input
          className="input-tanggal"
          type="date"
          id="startDate"
          name="startDate"
          value={startDate}
          onChange={handleStartDateChange}
        />
        <label htmlFor="endDate"></label>
        <input
          className="input-tanggal"
          type="date"
          id="endDate"
          name="endDate"
          value={endDate}
          onChange={handleEndDateChange}
        />
        <button className="btn1 rounded-2 ms-3" onClick={generatePDF}>
          PDF
        </button>
      </div>
    </div>
  );
};

export default ReportHarian;