import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Input } from "reactstrap";
import Footer from "../../../../GlobalComponents/Footer";
import Navbar from "../../Layout/Navbar";
import { userActions } from "../../../../../actions";

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: JSON.parse(localStorage.getItem("user")),
            changePassword: {
                id: "",
                password: "",
                confirm_password: ""
            },
            error: false,
            message: false
        };

        this.changePasswordSubmit = this.changePasswordSubmit.bind(this);
        // this.handleOnKitSelect = this.handleOnKitSelect.bind(this);
        // this.handleOnProductSearch = this.handleOnProductSearch.bind(this);
        // this.handleOnProductSelect = this.handleOnProductSelect.bind(this);
        // this.handleKitList = this.handleKitList.bind(this);
        // this.handleProductList = this.handleProductList.bind(this);
    }

    handlePassword = (name, value) => {
        const { changePassword } = this.state;
        changePassword[name] = value;
        this.setState({
            changePassword
        });
    };

    changePasswordSubmit() {
        this.setState({
            changePassword: {
                id: this.state.user.data._id,
                password: this.state.changePassword.password,
                confirm_password: this.state.changePassword.confirm_password
            }
        }, () => {
            this.props.dispatch(userActions.resetPassword(this.state.changePassword));
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {

        if (nextProps.resetModal == false) {
            this.setState({
                message: true,
                changePassword: {
                    id: "",
                    password: "",
                    confirm_password: ""
                }
            });
            setTimeout(() => {
                this.setState({message: false});
            }, 2000);
        }

        if (nextProps.error !== "") {
            this.setState({
                error: true
            });
        }
    }

    render() {
        const { loading } = this.props;
        if (!this.state.user) {
            return <Redirect to="/" />;
        }
        if (this.state.user.data.user_role !== "Employee") {
            return <Redirect to="/" />;
        }
        const { error } = this.props;

        return (
            <div>
                <Navbar />
                <main className="offset mr-0">
                    <div className="container-fluid hard-pad">
                        {/* <h1 className="date-scroll pt-4"> <Link to="/reps/open-booking"><i className="fa fa-long-arrow-left smbtn"></i> <strong>Back</strong></Link></h1> */}

                        <div className="row pt-5">
                            <div className="col-lg-6">
                                <div>
                                    <h2 className="page-heading">Change Password</h2>
                                    <div className="form-group pt-4">
                                        <label>Password <strong className="text-danger">*</strong></label>
                                        <Input
                                            type="password"
                                            className="form-control"
                                            autocomplete="password"
                                            value={this.state.changePassword.password}
                                            onChange={(e) => this.handlePassword("password", e.target.value)}
                                        />
                                        {(this.state.error && error) ? <span className="text-danger">{error.password ? error.password : ""}</span> : ""}
                                    </div>
                                    <div className="form-group">
                                        <label>Confirm Password <strong className="text-danger">*</strong></label>
                                        <Input
                                            type="password"
                                            className="form-control"
                                            autocomplete="password"
                                            value={this.state.changePassword.confirm_password}
                                            onChange={(e) => this.handlePassword("confirm_password", e.target.value)}
                                        />
                                        {(this.state.error && error) ? <span className="text-danger">{error.confirm_password ? error.confirm_password : ""}</span> : ""}

                                    </div>
                                    <div>
                                        {this.state.message==true && <span className="text-success">Password change successfully.</span>}
                                    </div>
                                </div>
                                <div className="mt-5 text-right">
                                    {
                                        loading ?
                                            <button className="btn btn-primary">Loading...</button>
                                            :
                                            <button className="btn btn-primary" onClick={() => this.changePasswordSubmit()}>Save Changes</button>
                                    }
                                </div>
                            </div>
                            <div className="col-lg-4"></div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { error, resetModal, loading } = state.rootReducer.users;
    return {
        error,
        loading,
        resetModal,
    };
}

export default connect(mapStateToProps)(Index);