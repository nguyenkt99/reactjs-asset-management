import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Button, Spinner, Modal, Table } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom';
import { get, post } from '../../../../httpHelper'
import { FaSearch, FaAngleDown, FaCalendarAlt } from 'react-icons/fa';
import './createAssignment.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../CreateUser/createuser.css'
import moment from "moment";

export default function CreateAssignment() {
    const [users, setusers] = useState([])
    const [userDisplay, setuserDisplay] = useState(false)
    const [user, setuser] = useState({ fullName: '', staffCode: '' })
    const [assetDisplay, setassetDisplay] = useState(false)
    const [asset, setasset] = useState({ assetName: '' })
    const [assets, setassets] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [assetCodeASC, setAssetCodeASC] = useState(true);
    const [assetNameASC, setAssetNameASC] = useState(false);
    const [categoryASC, setCategoryASC] = useState(false);
    const [staffCodeASC, setStaffCodeASC] = useState(false)
    const [fullNameASC, setFullNameASC] = useState(true)
    const [typeASC, setTypeASC] = useState(false)
    const [usersData, setusersData] = useState([])
    const [assetsData, setassetsData] = useState([])
    // check ok or cancel 
    const [userCurrent, setuserCurrent] = useState(null)
    const [assetCurrent, setassetCurrent] = useState(null)
    // state
    const [assignedDate, setassignedDate] = useState(moment(new Date()).format('YYYY-MM-DD'))
    const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);

    let history = useHistory();
    useEffect(() => {
        fetchUsers();
        fetchAssets();
    }, [])
    useEffect(() => {
        setusersData(users);
        setassetsData(assets);
    }, [users, assets])
    const fetchUsers = () => {
        get('/users').then(response => {
            if (response.status === 200) {
                setusers(response.data.filter(u => u.state !== 'Disabled'))
            } else {
                alert('Something wrong!')
            }
        }).catch(error => console.log(error.response))
        // handleSortAsset(ASSET_SORT_BY.FullName)
    }
    const fetchAssets = () => {
        get('/asset').then(response => {
            if (response.status === 200) {
                let available = response.data.filter((data) => {
                    return data.state === "AVAILABLE";
                })
                setassets(available)
            } else {
                alert('Something wrong!')
            }
        }).catch(error => console.log(error.response))
        // handleSortAsset(ASSET_SORT_BY.FullName)
    }
    const handleUserDisplay = () => {
        if (assetDisplay === true) setassetDisplay(false)
        if (userDisplay === false) setuserDisplay(true);
    }
    const handleAssetDisplay = () => {
        if (userDisplay === true) setuserDisplay(false);
        if (assetDisplay === false) setassetDisplay(true);
    }
    const handleCancel = () => {
        setuserDisplay(false);
        setassetDisplay(false);
        setassetCurrent(null);
        setuserCurrent(null);
        //user
        if (document.getElementById(user.staffCode) !== null)
            document.getElementById(user.staffCode).checked = true;
        else
            users.map((u) => {
                if (document.getElementById(user.staffCode))
                    document.getElementById(u.staffCode).checked = false;
            })
        //asset
        if (document.getElementById(asset.assetCode) !== null)
            document.getElementById(asset.assetCode).checked = true;
        else
            assets.map((u) => {
                if (document.getElementById(user.staffCode))
                    document.getElementById(u.assetCode).checked = false;
            })
    }
    const handleOk = () => {
        // console.log(userCurrent)
        console.log(userCurrent !== null);
        if (userCurrent !== null) setuser(userCurrent);
        if (assetCurrent !== null) setasset(assetCurrent);
        setuserDisplay(false);
        setassetDisplay(false);
    }
    //on change radio 
    const userChange = (e) => {
        let staffCode = e.target.value;
        let u = users.filter((u) => {
            return u.staffCode === staffCode
        })
        // console.log(staffCode);
        document.getElementById(staffCode).checked = true;
        setuserCurrent(u[0]);
    }
    //on change radio
    const assetChange = (e) => {
        let assetCode = e.target.value;
        let a = assets.filter((a) => {
            return a.assetCode === assetCode;
        })
        document.getElementById(assetCode).checked = true;
        setassetCurrent(a[0]);
    }

    const handleSearchChangeUser = (e) => {
        let keySearch = e.target.value;
        let newData = users.filter(e => (
            e.staffCode.toLowerCase().includes(keySearch.toLowerCase())
            || e.fullName.toLowerCase().includes(keySearch.toLowerCase())))
        setusersData(newData);
    }
    const handleSearchChangeAsset = (e) => {
        let keySearch = e.target.value;
        let newData = assets.filter(e => (
            e.assetCode.toLowerCase().includes(keySearch.toLowerCase())
            || e.assetName.toLowerCase().includes(keySearch.toLowerCase())
        ))
        setassetsData(newData);
    }

    const openDatePicker = () => {
        setIsOpenDatePicker(!isOpenDatePicker);
    }

    let userJsx =
        <Row>
            <Col sm={3}>
                <div className='user_asset_area'>
                    <div className='label_user'>
                        <span>User</span>
                    </div>
                </div>
            </Col>
            <Col className="user_area" onClick={handleUserDisplay}>
                <div className="input_field">
                    <div className="border_search_info">
                        {user.fullName}
                        <FaSearch className="fa-search" />
                    </div>
                </div>
                <Modal.Dialog className="dialog" style={{ display: userDisplay ? 'block' : 'none' }}>
                    <Modal.Body style={{ padding: "0px" }}>
                        <div className="list_select">
                            <Row className="header_select">
                                <Col className="label_select reset"><span className="c-red title">Select User</span></Col>
                                <Col className="search_select reset">
                                    <input onChange={handleSearchChangeUser}>

                                    </input>
                                    <div className="fa-header">
                                        <FaSearch className=""></FaSearch>
                                    </div>

                                </Col>
                            </Row>
                            <Row className="table_ua" >
                                <Table >
                                    <thead className="fix_width">
                                        <tr className="fix_width">
                                            <th>
                                            </th>
                                            <th style={{ width: "115px" }} onClick={() => handleSortUser(USER_SORT_BY.StaffCode)}>
                                                Staff Code
                                                <FaAngleDown />
                                            </th>
                                            <th onClick={() => handleSortUser(USER_SORT_BY.FullName)}>
                                                Full Name
                                                <FaAngleDown />
                                            </th>
                                            <th onClick={() => handleSortUser(USER_SORT_BY.Type)}>
                                                Type
                                                <FaAngleDown />
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-content fix_width">
                                        {usersData.map((u) => {
                                            return <tr key={u.staffCode} className="fix_width">
                                                <td style={{ width: "20px" }} >
                                                    <input
                                                        id={u.staffCode}
                                                        type="radio"
                                                        // id = {u.staffCode} 
                                                        name="staff_radio"
                                                        value={u.staffCode}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={userChange}
                                                        className="radio_custom"
                                                    // defaultChecked = {u.staffCode === user.staffCode}
                                                    ></input>
                                                </td>
                                                <td style={{ width: "115px" }} >{u.staffCode}</td>
                                                <td style={{ width: "170px" }} >{u.fullName}</td>
                                                <td>{u.type === "ROLE_ADMIN" ? "Admin" : "Staff"}</td>

                                            </tr>
                                        })}
                                    </tbody>
                                    <Col className="button-group">
                                        <Button variant='danger' style={{ padding: "0px 19px" }} onClick={handleOk} >
                                            Save
                                        </Button>
                                        <Button variant="outline-secondary"
                                            style={{ marginLeft: '20px' }}
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </Button>
                                    </Col>
                                </Table>
                            </Row>
                        </div>
                    </Modal.Body>
                </Modal.Dialog>
            </Col>
        </Row>

    let assetJsx =
        <Row>
            <Col sm={3}>
                <div className='user_asset_area'>
                    <div className='label_asset'>
                        <span>Asset</span>
                    </div>
                </div>
            </Col>
            <Col className="asset_area" onClick={handleAssetDisplay}>
                <div className="input_field">
                    <div className="border_search_info">
                        {asset.assetName}
                        <FaSearch className="fa-search" />
                    </div>
                </div>
                <Modal.Dialog className="dialog" style={{ display: assetDisplay ? 'block' : 'none' }}>
                    <Modal.Body style={{ padding: "0px" }}>
                        <div className="list_select">
                            <Row className="header_select">
                                <Col className="label_select reset"><span className="c-red title">Select Asset</span></Col>
                                <Col className="search_select reset">
                                    <input onChange={handleSearchChangeAsset}>

                                    </input>
                                    <div className="fa-header">
                                        <FaSearch className=""></FaSearch>
                                    </div>

                                </Col>
                            </Row>
                            <Row className="table_ua" >
                                <Table >
                                    <thead className="fix_width">
                                        <tr className="fix_width">
                                            <th>
                                            </th>
                                            <th style={{ width: "115px" }} onClick={() => handleSortAsset(ASSET_SORT_BY.AssetCode)}>
                                                Asset Code
                                                <FaAngleDown />

                                            </th>
                                            <th onClick={() => handleSortAsset(ASSET_SORT_BY.AssetName)}>
                                                Asset Name
                                                <FaAngleDown />
                                            </th>
                                            <th onClick={() => handleSortAsset(ASSET_SORT_BY.Category)}>
                                                Category
                                                <FaAngleDown />
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-content fix_width">
                                        {assetsData.map((a) => {
                                            return <tr key={a.assetCode} className="fix_width">
                                                <td style={{ width: "20px" }} >
                                                    <input
                                                        id={a.assetCode}
                                                        type="radio"
                                                        // id = {u.staffCode} 
                                                        name="asset_radio"
                                                        value={a.assetCode}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={assetChange}
                                                        className="radio_custom"
                                                    ></input>
                                                </td>
                                                <td style={{ width: "115px" }} >{a.assetCode}</td>
                                                <td style={{ width: "170px" }} >{a.assetName}</td>
                                                <td>{a.categoryName}</td>

                                            </tr>
                                        })}
                                    </tbody>
                                    <Col className="button-group">
                                        <Button variant='danger' style={{ padding: "0px 19px" }} onClick={handleOk} >
                                            Save
                                        </Button>
                                        <Button variant="outline-secondary"
                                            style={{ marginLeft: '20px' }}
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </Button>
                                    </Col>
                                </Table>
                            </Row>
                        </div>
                    </Modal.Body>
                </Modal.Dialog>
            </Col>
        </Row>

    const saveButton = () => {
        if (isSaving)
            return <Button variant="danger" type="submit" disabled><Spinner animation="border" size="sm" variant="light" />Save</Button>
        else if (asset.assetName !== '' && user.fullName !== '')
            return <Button variant="danger" type="submit">Save</Button>
        return <Button variant="danger" type="submit" disabled>Save</Button>;
    }

    const ASSET_SORT_BY = {
        AssetCode: 'AssetCode',
        AssetName: 'AssetName',
        Category: 'Category',
        State: 'State',
    };

    const USER_SORT_BY = {
        StaffCode: 'staffCode',
        FullName: 'fullName',
        Username: 'username',
        JoinedDate: 'joinedDate',
        Type: 'type',
    }
    const handleSortAsset = (key) => {
        let reverse = -1;
        let list = [];
        if (key === ASSET_SORT_BY.AssetCode) {
            reverse = assetCodeASC ? -1 : 1;
            setAssetCodeASC(!assetCodeASC);
            list = assetsData
                .slice()
                .sort((a, b) =>
                    a.assetCode > b.assetCode
                        ? 1 * reverse
                        : b.assetCode > a.assetCode
                            ? -1 * reverse
                            : 0
                );
        } else if (key === ASSET_SORT_BY.AssetName) {
            reverse = assetNameASC ? -1 : 1;
            setAssetNameASC(!assetNameASC);
            list = assetsData
                .slice()
                .sort((a, b) =>
                    a.assetName > b.assetName
                        ? 1 * reverse
                        : b.assetName > a.assetName
                            ? -1 * reverse
                            : 0
                );
        } else if (key === ASSET_SORT_BY.Category) {
            reverse = categoryASC ? -1 : 1;
            setCategoryASC(!categoryASC);
            list = assetsData
                .slice()
                .sort((a, b) =>
                    a.categoryName > b.categoryName
                        ? 1 * reverse
                        : b.categoryName > a.categoryName
                            ? -1 * reverse
                            : 0
                );
        }
        setassetsData(list);
    };

    const handleSortUser = (key) => {
        let reverse = -1;
        let list = []
        if (key === USER_SORT_BY.StaffCode) {
            reverse = staffCodeASC ? -1 : 1;
            setStaffCodeASC(!staffCodeASC)
            list = usersData.slice().sort((a, b) => (a.staffCode > b.staffCode) ? 1 * reverse : ((b.staffCode > a.staffCode) ? -1 * reverse : 0))
        }
        else if (key === USER_SORT_BY.FullName) {
            reverse = fullNameASC ? -1 : 1;
            setFullNameASC(!fullNameASC)
            list = usersData.slice().sort((a, b) => (a.fullName > b.fullName) ? 1 * reverse : ((b.fullName > a.fullName) ? -1 * reverse : 0))
        }
        else if (key === USER_SORT_BY.Type) {
            reverse = typeASC ? -1 : 1;
            setTypeASC(!typeASC)
            list = usersData.slice().sort((a, b) => (a.type > b.type) ? 1 * reverse : ((b.type > a.type) ? -1 * reverse : 0))
        }
        setusersData(list);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        let date = assignedDate.split("-").reverse().join("/");

        const formData = {
            assetCode: asset.assetCode,
            note: e.target.note.value,
            assignedTo: user.username,
            assignedDate: date
        }

        setIsSaving(true);
        post('/assignment', formData)
            .then((res) => {
                history.push({
                    pathname: './manage_assignment',
                    state: {
                        id: res.data.id
                    }
                });
            })
            .catch((error) => {
                setIsSaving(false);
                console.log(error.response);
            })
    }

    return (
        <div className="p-5">
            <h5 className="mb-4" style={{ color: "#CF2338" }}>Create Assignment</h5>
            <Col xs={12} sm={12} md={7}>
                <Form onSubmit={handleSubmit}>
                    {userJsx}
                    {assetJsx}
                    <Form.Group
                        as={Row}
                        className='mb-3'
                        required
                        controlId='installedDate'>
                        <Form.Label column sm={3}>
                            Assigned Date
                        </Form.Label>
                        <Col>
                            <div className="datepicker">
                                <DatePicker className="form-control"
                                    dateFormat="dd/MM/yyyy" showMonthDropdown showYearDropdown scrollableYearDropdown yearDropdownItemNumber={50}
                                    onKeyDown={(e) => e.preventDefault()}
                                    selected={assignedDate && new Date(assignedDate)}
                                    onChange={(date) => setassignedDate(moment(date).format('YYYY-MM-DD'))}
                                    minDate={new Date()}
                                    onClickOutside={openDatePicker}
                                    onSelect={openDatePicker}
                                    onFocus={openDatePicker}
                                    open={isOpenDatePicker}
                                />
                                <FaCalendarAlt className="icon-date" onClick={openDatePicker} />
                            </div>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className='mb-3' controlId='firstName'>
                        <Form.Label column sm={3}>
                            Note
                        </Form.Label>
                        <Col>
                            <Form.Control
                                name='note'
                                as='textarea'
                                maxLength={100}
                            // minLength={20}
                            // onChange={handleOnChange}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="float-end mb-3">
                        <Col>
                            {saveButton()}
                            <Link className="btn btn-outline-secondary" style={{ marginLeft: "40px" }} to="./manage_assignment">Cancel</Link>
                        </Col>
                    </Form.Group>
                </Form>
            </Col>
        </div>
    )
}

