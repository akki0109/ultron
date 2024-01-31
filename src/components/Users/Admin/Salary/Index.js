import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import Footer from "../../../GlobalComponents/Footer";
import { Input } from "reactstrap";
import Pdf from "./Pdf";
import { colourStyles } from "../../../../constants/ColorStyle";
import Select from "react-select";
import { adminUserActions, adminLeaveActions } from "../../../../actions";
import dateFormat from "dateformat";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

const monthLable = [{ "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun", "07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec" }];
const monthSelectBox = [
            { value:"01",label: "Jan"},
            { value:"02",label: "Feb"},
            { value:"03",label: "Mar"},
            { value:"04",label: "Apr"},
            { value:"05",label: "May"},
            { value:"06",label: "Jun"},
            { value:"07",label: "Jul"},
            { value:"08",label: "Aug"},
            { value:"09",label: "Sep"},
            { value:10,label: "Oct"},
            { value:11,label: "Nov"},
            { value:12,label: "Dec"}
        ];
const yearSelectBox = [{ value:2022,label: 2022},{ value:2023,label: 2023}];

let curentMonth=new Date().getMonth();
curentMonth=curentMonth+1;
if(curentMonth<10){
  curentMonth="0"+curentMonth;
}

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: JSON.parse(localStorage.getItem("user")),
            selectedMonth:[{value:curentMonth,label:monthLable[0][curentMonth]}],
            selectedYear:[{value:new Date().getFullYear(),label:new Date().getFullYear()}],
            userInfo: {
                year: new Date().getFullYear(),
                month: monthLable[0][curentMonth],
                employeeId: "",
                employeeName: "",
                designation: "",
                joiningDate: "",
                department: "",
                paymentMode: "Bank Transfer",
                bank: "",
                accountNumber: "",
                panNumber: "",
                dayInMonth: "",
                paidLeave: 0,
                unpaidDays: 0,
                earnings: "",
                deducation: "",
                basic: "",
                hra: "",
                special: "",
                leaveDeducation: "",
                tdsDeducation: "",
                pfDeduction: "",
                esIcDeduction: "",
                totalDeduction: "",
                total: "",
                netTotalIncome: "",
                filterUser: JSON.parse(localStorage.getItem("user")) ? [{ value: JSON.parse(localStorage.getItem("user")).data._id, lable: JSON.parse(localStorage.getItem("user")).data.first_name }] : [{ value: 0, label: "" }],
                ReportingList: [],
                EmployeeDetails: [],
                pf_check: false,
                esic_check: false,
                totalBHS:0
            },
            filterUserId: "",
            filterMonth: curentMonth,
            filterYear: new Date().getFullYear(),
            digitConvert: "",
            ReportingList: []
        };
        this.handleReportUser = this.handleReportUser.bind(this);
        this.userInfoHandler = this.userInfoHandler.bind(this);
        this.salarySlipSubmit = this.salarySlipSubmit.bind(this);
    }

    /*handleMonthYearChange = (value) => {
        const { userInfo } = this.state;
        userInfo["month"] = monthLable[0][value.split("-")[1]];
        userInfo["year"] = value.split("-")[0];

        var dayInMonth = this.daysInMonth(value.split("-")[1], userInfo["year"]);
        userInfo["dayInMonth"] = dayInMonth;

        this.setState({
            filterMonth: value.split("-")[1],
            filterYear: value.split("-")[0],
            userInfo: userInfo
        }, () => { this.getleaveCount(); });
    };*/

    handleYearChange = (e) => {
     
      this.setState({selectedYear:e});
      const { userInfo } = this.state;
      userInfo["year"] = e.value;

      var dayInMonth = this.daysInMonth(this.state.filterMonth, userInfo["year"]);
      userInfo["dayInMonth"] = dayInMonth;

      this.setState({
          filterYear: e.value,
          userInfo: userInfo
      }, () => { this.getleaveCount(); });
    };

    dayCalculate = () => {
      const { userInfo } = this.state;
      var dayInMonth = this.daysInMonth(this.state.filterMonth, userInfo["year"]);
      userInfo["dayInMonth"] = dayInMonth;

      this.setState({
          userInfo: userInfo
      }, () => { this.getleaveCount(); });
    };


    handleMonthChange = (e) => {
     
      this.setState({selectedMonth:e});
      const { userInfo } = this.state;
      userInfo["month"] = monthLable[0][e.value];

      var dayInMonth = this.daysInMonth(e.value, userInfo["year"]);
      userInfo["dayInMonth"] = dayInMonth;

      this.setState({
          filterMonth: e.value,
          userInfo: userInfo
      }, () => { this.getleaveCount(); });
    };



    daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    Capitalize(str) {

        const arr = str.split(" ");

        //loop through each element of the array and capitalize the first letter.


        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);

        }

        //Join all the elements of the array back into a string 
        //using a blankspace as a separator 
        return arr.join(" ");
    }

    userInfoHandler = (name, value,) => {
        const { userInfo } = this.state;

        userInfo[name] = value;

        this.setState({
            userInfo,
        }, () => { this.calculateSallery(); });

    };
    salarySlipSubmit() {
        console.log("78888888888", this.state.userInfo);
    }


    reportingGet(item) {
        if (this.state.ReportingList.length == 0) {
            let reportList = [{ value: "", label: "All User" }];
            for (var c = 0; c < item.length; c++) {
                reportList.push({ value: item[c]._id, label: item[c].first_name + " " + item[c].last_name });
            }
            this.setState({
                EmployeeDetails: item,
                ReportingList: reportList,
                filterUser: [{ value: "", label: "All User" }],

            }, () => {
                console.log("EmployeeDetails", this.state.EmployeeDetails);
            });
        }


    }
    getReportingList() {
        this.props.dispatch(adminUserActions.getUserListForReportingSalary({ search: "" }));
    }

    leaveCountGet(item) {
        const { userInfo } = this.state;
        console.log(item);
        userInfo["paidLeave"] = item.casualLeaveCount;
        userInfo["unpaidDays"] = item.unpaidLeaveCount;
        this.setState({
            userInfo: userInfo,
        }, () => { this.calculateSallery(); });
    }

    getleaveCount() {
        if (this.state.filterUserId != "" && this.state.filterMonth != "" && this.state.filterYear != "") {
            this.props.dispatch(adminLeaveActions.getLeavesCountUsingUserId({ userId: this.state.filterUserId, request_date: this.state.filterYear + "-" + this.state.filterMonth + "-" + "01" }));
        }
    }

    handleReportUser(event) {
        console.log(event);
        const { userInfo } = this.state;
        let EmployeeDetails = this.state.EmployeeDetails;
        let selectedReportingItem = [];
        selectedReportingItem = EmployeeDetails.filter(Result => Result._id == event.value);
        selectedReportingItem.map((item) => {
            userInfo["employeeId"] = item.employee_id ? item.employee_id : "";
            userInfo["employeeName"] = item.first_name + " " + item.last_name;
            userInfo["designation"] = item.designation;
            userInfo["joiningDate"] = (dateFormat(item.date_of_joining, "dd-mm-yyyy"));
            userInfo["bank"] = item.bank_name;
            userInfo["accountNumber"] = item.account_number;
            userInfo["panNumber"] = item.pan_number;
            userInfo["pf_check"] = item.pf_check;
            userInfo["esic_check"] = item.esic_check;

            if (item.department_type != null) {
                userInfo["department"] = item.department_type.name;
            }

            this.setState({
                filterUserId: event.value,
                userInfo: userInfo,
                filterUser: [{ value: event.value, label: item.first_name + " " + item.last_name }]
            }, () => { this.calculateSallery(); this.getleaveCount(); });
        });


    }

    calculateSallery() {
        const { userInfo } = this.state;

        if (userInfo["total"] > 0 && userInfo["unpaidDays"] > 0 && userInfo["dayInMonth"] > 0) {
            var leaveDeducation = (userInfo["total"] / userInfo["dayInMonth"]) * userInfo["unpaidDays"];
            leaveDeducation = leaveDeducation.toFixed(2);
            userInfo["leaveDeducation"] = leaveDeducation;
        }
        else {
            userInfo["leaveDeducation"] = "";

        }


        var deducation = 0;
        if (userInfo["leaveDeducation"] > 0) {
            deducation += Number(userInfo["leaveDeducation"]);
        }
        if (userInfo["tdsDeducation"] > 0) {
            deducation += Number(userInfo["tdsDeducation"]);
        }
        if (userInfo["pfDeduction"] > 0 && userInfo["pf_check"] == true) {
            deducation += Number(userInfo["pfDeduction"]);
        }
        if (userInfo["esIcDeduction"] > 0 && userInfo["esic_check"] == true) {
            deducation += Number(userInfo["esIcDeduction"]);
        }
        if (deducation > 0) {
            userInfo["totalDeduction"] = Number(deducation);
        }
        else {
            userInfo["totalDeduction"] = "";
        }
        if (userInfo["total"] > 0) {
            let totalBHS=userInfo["basic"]>0?userInfo["basic"]:0;

            totalBHS=parseInt(userInfo["hra"]>0?userInfo["hra"]:0)+parseInt(totalBHS);
            totalBHS=parseInt(userInfo["special"]>0?userInfo["special"]:0)+parseInt(totalBHS);
            userInfo["totalBHS"]=totalBHS;

            if (userInfo["total"] > deducation) {
                userInfo["netTotalIncome"] = Number(userInfo["total"]) - Number(deducation);
                const numWords = require("num-words");
                const amountInWords = numWords(userInfo["netTotalIncome"].toFixed());
                this.setState({
                    digitConvert: this.Capitalize(amountInWords + " only")
                });
            }
            else {
                userInfo["netTotalIncome"] = "";
                userInfo["digitConvert"] = "";
                this.setState({
                    digitConvert: ""
                });
            }



        }
        else {
            userInfo["basic"] = "";
            userInfo["hra"] = "";
            userInfo["special"] = "";
            userInfo["netTotalIncome"] = "";
            userInfo["digitConvert"] = "";
            userInfo["totalBHS"] = "";
            

        }



        this.setState({
            userInfo: userInfo,
        });



    }

    componentDidMount() {
        this.getReportingList(this.state.user.data._id);
        this.dayCalculate();

    }
    UNSAFE_componentWillReceiveProps(nextProps) {

        if (nextProps.UserListForReporting != undefined) {
            this.reportingGet(nextProps.UserListForReporting);
        }
        if (nextProps.adminLeaveCountForSallery != undefined) {
            this.leaveCountGet(nextProps.adminLeaveCountForSallery);
        }
    }
    render() {
        if (!this.state.user) {
            return <Redirect to="/" />;
        }

        if (this.state.user.data.user_role !== "Admin") {
            return <Redirect to="/" />;
        }


        return (
            <div>
                <main className="">
                    <div className="container-fluid hard-pad">
                        <div className="text-center my-4 col-12 border-mobile">
                            <Link to="/admin/dashboard" className="backbtn"> <i className="fa fa-arrow-left" aria-hidden="true"></i></Link>
                            <h2 className="page-heading"> PAYSLIP - {this.state.userInfo.month} {this.state.userInfo.year} </h2>
                        </div>
                        <div className="row no-gutters">
                            <div className="col-4 sidebar-from">
                                <form className="pb-3 pr-3">
                                    <div className="row">
                                        <div className="form-group col-12">
                                            <div className="menu_width" style={{ position: "relative", zIndex: 2 }}>
                                                <label>Select Employee Name</label>
                                                <Select styles={colourStyles} onChange={this.handleReportUser} value={this.state.filterUser} options={this.state.ReportingList} />
                                            </div>
                                        </div>
                                    </div>
                                    <h6 className="mt-2">EMPLOYEE DETAILS</h6>
                                    <hr />
                                    <div className="row">
                                      <div className="col-6 form-group">
                                        <Select styles={colourStyles} onChange={this.handleMonthChange} value={this.state.selectedMonth} options={monthSelectBox} />
                                      </div>
                                      <div className="col-6 form-group">
                                        <Select styles={colourStyles} onChange={this.handleYearChange} value={this.state.selectedYear} options={yearSelectBox} />
                                      </div>
                                    </div>
                                    {/*<div className="row">
                                        <div className="col-12 form-group">
                                            <label>Month ,Year <strong className="text-danger">*</strong></label>
                                            <Input type="month" onChange={(e) => this.handleMonthYearChange(e.target.value)} />
                                        </div>

                                    </div>*/}
                                    <div className="row">
                                        <div className="col-12 form-group">
                                            <label>Employee Id <strong className="text-danger">*</strong></label>
                                            <Input
                                                type="text"
                                                className="no-outline"
                                                value={this.state.userInfo.employeeId}
                                                onChange={this.userInfoHandler}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group col-6">
                                            <label>Employee Name <strong className="text-danger">*</strong></label>
                                            <Input
                                                type="text"
                                                className="no-outline"
                                                value={this.state.userInfo.employeeName}
                                                onChange={this.userInfoHandler}
                                            />
                                        </div>
                                        <div className="form-group col-6">
                                            <label>Designation <strong className="text-danger">*</strong></label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                value={this.state.userInfo.designation}
                                                onChange={this.userInfoHandler}
                                            />

                                        </div>
                                        <div className="form-group col-6">
                                            <label>Joining Date <strong className="text-danger">*</strong></label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                value={this.state.userInfo.joiningDate}
                                                onChange={this.userInfoHandler}
                                            />

                                        </div>
                                        <div className="form-group col-6">
                                            <label>Department <strong className="text-danger">*</strong></label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                value={this.state.userInfo.department}
                                                onChange={this.userInfoHandler}
                                            />

                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group col-6">
                                            <label>Payment Mode <strong className="text-danger">*</strong></label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                value={this.state.userInfo.paymentMode}
                                                onChange={this.userInfoHandler}
                                            />

                                        </div>
                                        <div className="form-group col-6">
                                            <label>Bank <strong className="text-danger">*</strong></label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                value={this.state.userInfo.bank}
                                                onChange={this.userInfoHandler}
                                            // onChange={(e) => this.userInfoHandler("bank", e.target.value)}
                                            />

                                        </div>
                                        <div className="form-group col-6">
                                            <label>Account Number <strong className="text-danger">*</strong></label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                value={this.state.userInfo.accountNumber}
                                                onChange={this.userInfoHandler}
                                            // onChange={(e) => this.userInfoHandler("accountNumber", e.target.value)}
                                            />

                                        </div>
                                        <div className="form-group col-6">
                                            <label>PAN Number <strong className="text-danger">*</strong></label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                value={this.state.userInfo.panNumber}
                                                onChange={this.userInfoHandler}
                                            // onChange={(e) => this.userInfoHandler("panNumber", e.target.value)}
                                            />

                                        </div>
                                    </div>
                                    <h6  className="mt-2">SALARY DETAILS</h6>
                                    <hr />
                                    <div className="row">
                                        <div className="form-group col-6">
                                            <label>Days in Month <strong className="text-danger">*</strong></label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                value={this.state.userInfo.dayInMonth}
                                                onChange={this.userInfoHandler}
                                            />
                                        </div>
                                        <div className="form-group col-6">
                                            <label>Paid Leaves <strong className="text-danger">*</strong></label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                value={this.state.userInfo.paidLeave}
                                                onChange={(e) => this.userInfoHandler("paidLeave", e.target.value)}
                                            />

                                        </div>
                                        <div className="form-group col-6">
                                            <label>Unpaid Days <strong className="text-danger">*</strong></label>
                                            <Input
                                                type="number"
                                                className="form-control"
                                                value={this.state.userInfo.unpaidDays}
                                                onChange={(e) => this.userInfoHandler("unpaidDays", e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group col-6">
                                            <label>Paid Days <strong className="text-danger">*</strong></label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                value={this.state.userInfo.dayInMonth - this.state.userInfo.unpaidDays}
                                                onChange={(e) => this.userInfoHandler("paidDays", e.target.value)}
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-xxl-12 col-md-12">
                                            <div className="pb-0 bg-transparent border-0">
                                                <h6 className="mt-2">EARNINGS</h6>
                                            </div>
                                            <hr />
                                            <div className="">
                                                <div className="row">
                                                    <div className="col-6 form-group">
                                                        <label>GROSS TOTAL INCOME (A) </label>
                                                        <Input
                                                            type="number"
                                                            className="form-control"
                                                            value={this.state.userInfo.total}
                                                            onChange={(e) => this.userInfoHandler("total", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-6 form-group">
                                                        <label>BASIC </label>
                                                        <Input
                                                            type="number"
                                                            className="form-control"
                                                            
                                                            value={this.state.userInfo.basic}
                                                            onChange={(e) => this.userInfoHandler("basic", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-6 form-group">
                                                        <label >  HRA </label>
                                                        <Input
                                                            type="number"
                                                            className="form-control"
                                                            
                                                            value={this.state.userInfo.hra}
                                                            onChange={(e) => this.userInfoHandler("hra", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-6 form-group">
                                                        <label>Special/Variable Allowance </label>
                                                        <Input
                                                            type="number"
                                                            className="form-control"
                                                            
                                                            value={this.state.userInfo.special}
                                                            onChange={(e) => this.userInfoHandler("special", e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xxl-12 col-md-12">
                                            <div className="pb-0 bg-transparent border-0">
                                                <h6 className="mt-2">DEDUCTIONS</h6>
                                            </div>
                                            <hr />
                                            <div className="">
                                                <div className="row">
                                                    <div className="col-6 form-group">
                                                        <label>Leaves  </label>
                                                        <Input
                                                            type="text"
                                                            className="form-control"
                                                            disabled
                                                            value={this.state.userInfo.leaveDeducation}
                                                            onChange={(e) => this.userInfoHandler("leaveDeducation", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-6 form-group">
                                                        <label>TDS </label>
                                                        <Input
                                                            type="text"
                                                            className="form-control"
                                                            value={this.state.userInfo.tdsDeducation}
                                                            onChange={(e) => this.userInfoHandler("tdsDeducation", e.target.value)}
                                                        />
                                                    </div>
                                                    {this.state.userInfo.pf_check == true &&
                                                        <div className="col-6 form-group">
                                                            <label>PF</label>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                value={this.state.userInfo.pfDeduction}
                                                                onChange={(e) => this.userInfoHandler("pfDeduction", e.target.value)}
                                                            />
                                                        </div>
                                                    }
                                                    {this.state.userInfo.esic_check == true &&
                                                        <div className="col-6 form-group">
                                                            <label>ESIC</label>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                value={this.state.userInfo.esIcDeduction}
                                                                onChange={(e) => this.userInfoHandler("esIcDeduction", e.target.value)}
                                                            />
                                                        </div>
                                                    }
                                                    <div className="col-6 form-group">

                                                        <label>TOTAL DEDUCTION (B) </label>
                                                        <Input
                                                            type="text"
                                                            className="form-control"
                                                            disabled
                                                            value={this.state.userInfo.totalDeduction}
                                                            onChange={(e) => this.userInfoHandler("totalDeduction", e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-12">
                                            <label>NET TOTAL INCOME ( A - B ) </label>
                                            <Input
                                                type="number"
                                                className="no-outline"
                                                disabled
                                                value={this.state.userInfo.netTotalIncome}
                                                onChange={(e) => this.userInfoHandler("netTotalIncome", e.target.value)}
                                            />
                                        </div>
                                        {this.state.userInfo.netTotalIncome ?
                                            <div className="col-12">
                                                <label>({this.state.digitConvert})</label>
                                            </div> : ""}
                                    </div>
                                </form>
                            </div>
                            <div className="col-8">
                                <PDFDownloadLink className="pdfdownlodbtn" document={<Pdf userInfo={this.state.userInfo} digitConvert={this.state.digitConvert} />} digitConvert={this.state.digitConvert} fileName={`slip${this.state.userInfo.month}${this.state.userInfo.year} `}>
                                    {({ loading }) => loading ? "Report loading..." : "Download Now"}
                                </PDFDownloadLink>
                                <PDFViewer style={{ width: "100%" }}  className="resumeview" showToolbar={0}>
                                    <Pdf userInfo={this.state.userInfo}
                                        digitConvert={this.state.digitConvert} />
                                </PDFViewer>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }
}



function mapStateToProps(state) {

    const { UserListForReporting } = state.rootReducer.adminUsers;
    const { adminLeaveCountForSallery } = state.rootReducer.adminLeaves;
    console.log(UserListForReporting);

    return {

        UserListForReporting,
        adminLeaveCountForSallery

    };
}

export default connect(mapStateToProps)(Index);