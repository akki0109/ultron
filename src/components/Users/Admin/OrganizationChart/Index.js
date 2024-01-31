import React, { Component } from "react";
import { Tree } from "react-organizational-chart";
import Chart from "./Chart";
import { connect } from "react-redux";
import myData from "./myData.json";
import Navbar from "../Layout/Navbar";
import { adminUserActions } from "../../../../actions";
import {colourStyles} from "../../../../constants/ColorStyle";
import Select from "react-select";

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: JSON.parse(localStorage.getItem("user")),
            name: "name",
            data: { title: "title", author: "author", reporting_to: [] },
            showChilds: false,
            childNodes: [],
            childIndicator: "[+]",
            reportto_id: "633acb8ec0e0e0101fb846a3",
            newData:[],
            myData:myData,
            yes:0,
            ReportingList:[],
            userData:[],
            filterReportUser: [{ value: "", label: "All Users" }],
        };
        this.userChangeHandle = this.userChangeHandle.bind(this);
    }

    userChangeHandle(e) {
        this.setState({
            filterReportUser: [{ value: e.value, label: e.label }],
            reportto_id:e.value,
        },()=>{this.calculation();});
    }


    calculation() {
     
        let datas=this.state.userData;
        let newData=[];
        let newParent=[];
        let child = [];
        
        datas.filter(item=>item.reportTo==this.state.reportto_id).map((items)=>{
            
            child = this.recring(items._id);

            if(child.length){
                newData.push({"designation":  items.designation,"version": "1.1",id:items._id,reporting_to:items.reportTo,"properties": {name:items.first_name+" "+items.last_name},children:child});

            }
            else{
                newData.push({"designation":  items.designation,"version": "1.1",id:items._id,reporting_to:items.reportTo,"properties": {name:items.first_name+" "+items.last_name}});

            }
        });

        var selectedUser=this.state.userData.filter(item=>item._id==this.state.reportto_id);
      
        
        newParent.push({"designation":  selectedUser[0].designation,"version": "1.1",id:1,reporting_to:0,"properties": {name:selectedUser[0].first_name+" "+selectedUser[0].last_name},children:newData});
       
        this.setState({
            myData:newParent[0],
            yes:1
        });
        // console.log("dsdsdd", JSON.stringify(newParent));
       

    }

    recring(reproting_id) {
        let datas=this.state.userData; 
        let child = [];
        let newArr = [];
        datas.filter(item=>item.reportTo==reproting_id).map((items)=>{
            child=this.recring(items._id);
           
            if(child.length){
                newArr.push({"designation": items.designation,"version": "1.1",id:items._id,reporting_to:items.reportTo,"properties": {name:items.first_name+" "+items.last_name},children:child});

            }
            else{
                newArr.push({"designation":  items.designation,"version": "1.1",id:items._id,reporting_to:items.reportTo,"properties": {name:items.first_name+" "+items.last_name}});

            }
                
        });
        return newArr;

    }

    setReportingList(item) {
        let reportList = [];

        console.log("sdad",item);

        for (var c = 0; c < item.length; c++) {
            reportList.push({ value: item[c]._id, label: item[c].first_name + " " + item[c].last_name });
        }
        this.setState({
            ReportingList: reportList,
            userData:item,
            filterReportUser: [{ value: this.state.user.data._id, label: this.state.user.data.first_name+" "+this.state.user.data.last_name }],
            reportto_id: this.state.user.data._id,
        },()=>{this.calculation();});
    }

    AssignUserList() {
        this.props.dispatch(adminUserActions.getUserListForReporting({ search: "" }));
    }


    componentDidMount() {
        this.AssignUserList();
    }


    UNSAFE_componentWillReceiveProps(nextProps) {
      
        if (nextProps.UserListForReporting != undefined) {
            this.setReportingList(nextProps.UserListForReporting);
        }
    }






    render() {

        return (
            <div>
                <Navbar activePage="dashboard" />
                <main className="offset mr-0">
                    <div className="container-fluid hard-pad mb-5">
                        <div className="row align-items-center pt-4 border-mobile">
                            <div className="col-lg-8 col-6">
                                <h2 className="page-heading"> ORG</h2>
                            </div>
                            <div className="col-lg-8 search-box">
                            </div>
                        </div>
                        <div className="row align-items-center pt-4 border-mobile">
                            <div className="col-lg-4">
                                <Select styles={colourStyles} onChange={this.userChangeHandle} value={this.state.filterReportUser} options={this.state.ReportingList} />

                            </div>
                        </div>
                              
                        <div className=" mt-4">
                            <Tree lineWidth={"2px"} lineColor={"#2774F1"} lineBorderRadius={"10px"}>
                                { this.state.yes ==1 &&
                                    <Chart data={this.state.myData}/>
                                }
                                
                            </Tree>
                        </div>
                    </div>
                </main>
            </div>
            
        );


    }
}


function mapStateToProps(state) {

    
    const { UserListForReporting } = state.rootReducer.adminUsers;
    return {
        UserListForReporting
    };
}
export default connect(mapStateToProps)(Index);
