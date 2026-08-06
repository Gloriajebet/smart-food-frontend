import "../styles/reports.css";

import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";

import {
  FiMenu,
  FiDownload,
  FiHome,
  FiUser,
} from "react-icons/fi";

import {
  MdSavings,
  MdDeleteOutline,
  MdInventory2,
} from "react-icons/md";

import {
  BsGraphUpArrow,
  BsCheckCircle,
} from "react-icons/bs";

import { TfiBell } from "react-icons/tfi";
import { ImSpoonKnife } from "react-icons/im";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../components/api";
import CountUp from "react-countup";
import jsPDF from "jspdf";
import logo from "../assets/BL.png";

function Reports() {

  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

 const [report, setReport] = useState({
    waste_reduction: 0,
    money_saved: 0,
    items_used: 0,
    items_wasted: 0
});

  const [chartData, setChartData] = useState([]);
  const [period, setPeriod] = useState("month");

  useEffect(() => {

  const loadReports = async () => {
    try {
      const response = await fetchWithAuth(
        `https://smart-food-dyp3.onrender.com/api/reports/?period=${period}`
      );

      const data = await response.json();
      setReport(data);
      setChartData(data.weekly_trend);
    }
    catch (error) {
      console.error(error);
    }
    finally {
      setLoading(false);
    }
  };

  loadReports();
  }, [period]);

  if (loading) {
    return <h2>Loading reports...</h2>;
  }

 const downloadInventoryReport = async () => {
    try {
        const response = await fetchWithAuth(
            "https://smart-food-dyp3.onrender.com/api/reports/inventory/"
        );

        if (!response.ok) {
            throw new Error("Failed to download inventory report");
        }

        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "Inventory_Report.pdf";
        link.click();

        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error(error);
    }
};

const downloadWasteReport = async () => {
    try {
        const response = await fetchWithAuth(
            "https://smart-food-dyp3.onrender.com/api/reports/waste/"
        );

        if (!response.ok) {
            throw new Error("Failed to download waste report");
        }

        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "Waste_Report.pdf";
        link.click();

        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error(error);
    }
};

  const downloadReport = () => {
  const doc = new jsPDF();

  const green = [44, 150, 53];
  const red = [220, 53, 69];
  const orange = [255, 152, 0];

  const today = new Date();

  // ==========================
  // HEADER
  // ==========================

  doc.setFontSize(22);
  doc.setTextColor(...green);
  doc.setFont("helvetica", "bold");
  doc.text("Smart Food System", 20, 22);

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Combined Food Report", 20, 34);

  doc.addImage(logo, "PNG", 155, 10, 35, 35);

  doc.setDrawColor(...green);
  doc.setLineWidth(0.8);
  doc.line(20, 40, 190, 40);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Generated: ${today.toLocaleDateString()} ${today.toLocaleTimeString()}`,
    20,
    48
  );

  // ==========================
  // INVENTORY SUMMARY
  // ==========================

  let y = 62;

  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text("Inventory Summary", 20, y);

  y += 12;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  doc.text(`Total Items: ${report.total_items}`, 30, y);
  y += 8;

  doc.text(`Expiring Soon: ${report.expiring_soon}`, 30, y);
  y += 8;

  doc.text(`Expired Items: ${report.expired}`, 30, y);

  y += 10;

  doc.line(20, y, 190, y);

  // ==========================
  // WASTE ANALYSIS
  // ==========================

  y += 12;

  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text("Waste Analysis", 20, y);

  y += 12;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  doc.text(`Items Used On Time: ${report.items_used}`, 30, y);
  y += 8;

  doc.text(`Items Wasted: ${report.items_wasted}`, 30, y);
  y += 8;

  doc.text(`Money Saved: KSh ${report.money_saved}`, 30, y);
  y += 8;

  doc.text(`Waste Reduction Score: ${report.waste_reduction}%`, 30, y);

  y += 10;

  doc.line(20, y, 190, y);

  // ==========================
  // INVENTORY DETAILS
  // ==========================

  y += 14;

  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text("Food Inventory Details", 20, y);

  y += 10;

  report.foods.forEach((food) => {
    const expiry = new Date(food.expiry_date);

    let status = "Fresh";
    let color = green;

    const diff =
      (expiry - today) / (1000 * 60 * 60 * 24);

    if (diff < 0) {
      status = "Expired";
      color = red;
    } else if (diff <= 3) {
      status = "Expiring Soon";
      color = orange;
    }

    if (y > 255) {
      doc.addPage();

      y = 20;

      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      doc.text("Food Inventory Details (Continued)", 20, y);

      y += 12;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(food.name, 25, y);

    y += 7;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    doc.text(
      `Quantity: ${food.quantity} ${food.unit}`,
      35,
      y
    );

    y += 6;

    doc.text(
      `Expiry Date: ${food.expiry_date}`,
      35,
      y
    );

    y += 6;

    doc.setTextColor(...color);

    doc.text(
      `Status: ${status}`,
      35,
      y
    );

    doc.setTextColor(0, 0, 0);

    y += 6;

    doc.setDrawColor(220);

    doc.line(25, y, 185, y);

    y += 8;
  });

  // ==========================
  // FOOTER
  // ==========================

  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100);

  doc.text(
    "Generated automatically by Smart Food System",
    20,
    285
  );

  doc.save("SmartFoodCombinedReport.pdf");
};

  return (
    <div className="reports-container">

      <Sidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      <div className="reports-header">
        <FiMenu
          className="header-icon"
          onClick={() => setSidebarOpen(true)}
        />

        <h2>Reports & Analytics</h2>

        <div className="download-wrapper">

    <FiDownload
        className="header-icon"
        onClick={() =>
            setShowDownloadMenu(!showDownloadMenu)
        }
    />

    {showDownloadMenu && (
        <div className="download-menu">

            <button
              className="download-option inventory"
              onClick={() => {
                  downloadInventoryReport();
                  setShowDownloadMenu(false);
              }}
            >
                📄 Inventory Report
            </button>

            <button
                className="download-option waste"
                onClick={() => {
                    downloadWasteReport();
                    setShowDownloadMenu(false);
                }}
            >
                📊 Waste Analysis Report
            </button>

            <button
                className="download-option combined"
                onClick={() => {
                    downloadReport();
                    setShowDownloadMenu(false);
                }}
            >
                📑 Combined Report
            </button>

        </div>
    )}

        </div>
      </div>

      <div className="month-dropdown">

        <select
    value={period}
    onChange={(e) => setPeriod(e.target.value)}
>
    <option value="month">This Month</option>
    <option value="week">This Week</option>
    <option value="today">Today</option>
</select>

      </div>

      <div className="stats-grid">

        <div className="reports-stat-card">

          <div>
            <h2><CountUp
              start={0}
              end={report.waste_reduction}
              duration={2.5}
              separator=","
            />%
            </h2>
            <p>Waste Reduced</p>
          </div>

          <BsGraphUpArrow className="green-icon"/>

        </div>

        <div className="reports-stat-card">

          <div>
            <h2>
  KSh{" "}
  <CountUp
    start={0}
    end={report.money_saved}
    duration={2.5}
    separator=","
  />
</h2>
            <p>Money Saved</p>
          </div>

          <MdSavings className="green-icon"/>

        </div>

        <div className="reports-stat-card">
          <div>
            <h2>
              <CountUp
                start={0}
                end={report.items_used}
                duration={2.5}
                separator=","
              />
            </h2>
            <p>Items Used On Time</p>
          </div>

          <BsCheckCircle className="green-icon"/>

        </div>

        <div className="reports-stat-card">
          <div>
            <h3>
              <CountUp
                start={0}
                end={report.items_wasted}
                duration={2.5}
                separator=","
              />
            </h3>
            <p>Items Wasted</p>
          </div>

          <MdDeleteOutline className="red-icon"/>

        </div>

      </div>

      <h4>Waste Trend</h4>

      <div className="chart-card">
        <ResponsiveContainer
          width="95%"
          height={320}
        >

          <LineChart
            data={chartData}
          >

            <XAxis dataKey="week"/>

            <YAxis
             domain={[0,50]}
             ticks={[0,5,10,15,20,25,30,35,40,45,50]}
            />

            <Tooltip/>

            <Line
              type="monotone"
              dataKey="wasted"
              stroke="red"
              strokeWidth={4}
              dot={{
                r:5,
                fill:"#e53935",
              }}
              activeDot={{
                r:8,
                fill:"#e53935",
              }}
              isAnimationActive={true}
              animationDuration={1500}
            />

            <Line
              type="monotone"
              dataKey="used"
              stroke="#2e7d32"
              strokeWidth={4}
              dot={{
                r:5,
                fill:"#2e7d32",
              }}
              activeDot={{
                r:8,
                fill:"#2e7d32",
              }}
              isAnimationActive={true}
              animationDuration={1500}
            />

          </LineChart>

        </ResponsiveContainer>
      </div>

        <div className="reports-bottom-nav">
        
                <div className="reports-nav-item active">
                  <FiHome />
                  <span>Home</span>
                </div>
        
                <div
                  className="reports-nav-item"
                  onClick={() => navigate("/inventory")}
                >
                  <MdInventory2 />
                  <span>Inventory</span>
                </div>
        
                <div
                  className="reports-nav-item"
                  onClick={() => navigate("/meals")}
                >
                  <ImSpoonKnife />
                  <span>Meals</span>
                </div>
        
                <div
                  className="reports-nav-item"
                  onClick={() => navigate("/alerts")}
                >
                  <TfiBell />
                  <span>Alerts</span>
                </div>
        
                <div
                  className="reports-nav-item"
                  onClick={() => navigate("/profile")}
                >
                  <FiUser />
                  <span>Profile</span>
                </div>
              </div>
            </div>
  );

}

export default Reports;