import React, { Component } from "react";
import "./Chart.css";

import { TreeNode } from "react-organizational-chart";




class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // type: "My Type",
            // version: "My Version",
            // properties: {}
            name: "name",
            data: { designation: "designation", version: "version", properties: {}, children: [] },
            showChilds: false,
            childNodes: [],
            childIndicator: "[+]",
            didMOunt:0
        };
    }



    onClick = () => {

        let tempState = this.state;
        tempState.showChilds = !tempState.showChilds;

        let data = tempState.data;

        while (tempState.childNodes.length > 0) {
            tempState.childNodes.pop();
        }

        if (tempState.showChilds && data.children && data.children.length>0) {
            tempState.childIndicator="-";
            for (let i = 0; i < data.children.length; i++) {
                tempState.childNodes.push(<Chart data={data.children[i]} />);
            }
        }
        else if(data.children && data.children.length>0)
        {

            tempState.childIndicator="+";
        }

        this.setState(tempState);
    };



    test() {


        let tempState = this.state;
        let data = this.props.data;
        tempState.data = data;

        if (!data.children || data.children.length==0) {
            tempState.childIndicator = "";
        }
        else if(data.children.length>0)
        {
            tempState.childIndicator = "+";
        }
       

        tempState.name = data.properties.name;

        if (data.properties.reference)
            tempState.name = data.properties.reference.name;

        this.setState(tempState);

    }



    componentDidMount() {
        this.setState({
            didMOunt:1
        },()=>{  this.test();});
        console.log("ddd", this.props.data);
      
    }

    UNSAFE_componentWillReceiveProps(){

        this.setState({
            didMOunt:1,
            childNodes:[],
            showChilds: false,
        },()=>{  this.test();});
        console.log("ddd", this.props.data);
    }



    render() {
        return (
           
            <TreeNode
                label={
                    <div onClick={this.onClick} className="my-node-container">
                        <div>
                            <b>Designation:</b> {this.state.data.designation}
                        </div>
                        <div>
                            <b>Name:</b> {this.state.name}
                        </div>
                        <div>{this.state.childIndicator}</div>
                    </div>
                }
            >
                {this.state.childNodes}
            </TreeNode>
           
        );
    }
}




export default Chart;



