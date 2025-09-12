const Activity = require("../models/activityModel");
const PDFDocument = require("pdfkit");

const moment = require("moment");
const ExcelJS = require("exceljs");
// Generate Excel report for activities
const User = require("../models/userModel");
const generateActivityReportExcel = async (req, res) => {
  try {
    const { from, to, activityType, department, studentId } = req.query;
    const filter = {};
    if (from && to) {
      filter.date = { $gte: new Date(from), $lte: new Date(to) };
    }
    if (activityType && activityType !== "all") {
      filter.activityType = activityType;
    }
    if (department && department !== "all") {
      const students = await User.find({ role: "student", department }).select("_id");
      const studentIds = students.map(s => s._id);
      filter.studentId = { $in: studentIds };
    }
    if (studentId) {
      filter.studentId = studentId;
    }
    const activities = await Activity.find(filter).populate("studentId", "fullName email rollNo");
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Activities");
    worksheet.columns = [
      { header: "Student Name", key: "fullName", width: 25 },
      { header: "Roll No", key: "rollNo", width: 15 },
      { header: "Email", key: "email", width: 30 },
      { header: "Type", key: "activityType", width: 15 },
      { header: "Title", key: "title", width: 30 },
      { header: "Date", key: "date", width: 15 },
      { header: "Status", key: "status", width: 15 },
    ];
    activities.forEach((a) => {
      worksheet.addRow({
        fullName: a.studentId.fullName,
        rollNo: a.studentId.rollNo || '',
        email: a.studentId.email,
        activityType: a.activityType,
        title: a.title,
        date: moment(a.date).format('YYYY-MM-DD'),
        status: a.status,
      });
    });
    let filename = `Activity_Report_${moment().format('YYYYMMDD_HHmmss')}.xlsx`;
    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Generate PDF report for activities
const generateActivityReportPDF = async (req, res) => {
  try {
    const { from, to, activityType, department, studentId } = req.query;
    const filter = {};
    if (from && to) {
      filter.date = { $gte: new Date(from), $lte: new Date(to) };
    }
    if (activityType && activityType !== "all") {
      filter.activityType = activityType;
    }
    if (department && department !== "all") {
      const students = await User.find({ role: "student", department }).select("_id");
      const studentIds = students.map(s => s._id);
      filter.studentId = { $in: studentIds };
    }
    if (studentId) {
      filter.studentId = studentId;
    }
    const activities = await Activity.find(filter).populate("studentId", "fullName email rollNo");
    // Create PDF
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    let filename = `Activity_Report_${moment().format('YYYYMMDD_HHmmss')}.pdf`;
    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);
    doc.fontSize(18).text('Student Activity Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Date Range: ${from || 'All'} to ${to || 'All'}`);
    doc.text(`Activity Type: ${activityType || 'All'}`);
    doc.text(`Department: ${department || 'All'}`);
    doc.moveDown();
    // Table header
    doc.font('Helvetica-Bold');
    doc.text('Student Name', 30, doc.y, { continued: true });
    doc.text('Roll No', 130, doc.y, { continued: true });
    doc.text('Email', 200, doc.y, { continued: true });
    doc.text('Type', 320, doc.y, { continued: true });
    doc.text('Title', 380, doc.y, { continued: true });
    doc.text('Date', 470, doc.y, { continued: true });
    doc.text('Status', 530, doc.y);
    doc.font('Helvetica');
    doc.moveDown(0.5);
    activities.forEach((a) => {
      doc.text(a.studentId.fullName, 30, doc.y, { continued: true });
      doc.text(a.studentId.rollNo || '', 130, doc.y, { continued: true });
      doc.text(a.studentId.email, 200, doc.y, { continued: true });
      doc.text(a.activityType, 320, doc.y, { continued: true });
      doc.text(a.title, 380, doc.y, { continued: true });
      doc.text(moment(a.date).format('YYYY-MM-DD'), 470, doc.y, { continued: true });
      doc.text(a.status, 530, doc.y);
    });
    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { generateActivityReportPDF, generateActivityReportExcel };
