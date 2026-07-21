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

  const downloadReport = () => {
    const totalItems = report.total_items ?? 0;
    const expiringSoon = report.expiring_soon ?? 0;
    const expiredItems = report.expired ?? 0;
    const wasteScore = totalItems > 0
      ? Math.round(((totalItems - expiredItems) / totalItems) * 100)
      : 0;

    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.setTextColor(44,150,53);
    doc.text("Smart Food System", 20,20);

    doc.setFontSize(16);
    doc.setTextColor(0,0,0);
    doc.text("Food Waste Report",20,32);

    doc.setDrawColor(44,150,53);
    doc.line(20,36,190,36);
    doc.addImage(logo,"PNG",150,10,35,35);

    doc.setFontSize(12);

    doc.text(
        `Generated: ${new Date().toLocaleString()}`,
        20,
        46
    );

    doc.text(
        `Total Food Items: ${totalItems}`,
        20,
        60
    );

    doc.text(
        `Expiring Soon: ${expiringSoon}`,
        20,
        70
    );

    doc.text(
        `Expired Items: ${expiredItems}`,
        20,
        80
    );

    doc.text(
        `Waste Reduction Score: ${wasteScore}%`,
        20,
        90
    );

    doc.line(20,100,190,100);

    doc.setFontSize(14);
    doc.text("Inventory Summary",20,115);

    let y = 128;

    if (Array.isArray(report.foods) && report.foods.length > 0) {
      report.foods.forEach((food) => {
        doc.setFontSize(11);
        doc.text(
          `${food.name} (${food.quantity} ${food.unit}) - Expires ${food.expiry_date}`,
          20,
          y
        );
        y += 8;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
    } else {
      doc.setFontSize(11);
      doc.text("No inventory details available.", 20, y);
    }

    doc.line(20,y+8,190,y+8);

    doc.setFontSize(10);

    doc.text(

        "Generated automatically by Smart Food System",

        20,

        y+20

    );

    doc.save("SmartFoodReport.pdf");

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

        <FiDownload
    className="header-icon"
    onClick={downloadReport}
/>
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

            <YAxis domain={[0, 20]}/>

            <Tooltip/>

            <Line
              type="monotone"
              dataKey="wasted"
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