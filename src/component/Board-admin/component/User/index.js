import React, { useEffect, useState } from 'react'
import { Col, Row, Table, Modal, Toast, Form, Dropdown, Button, Pagination, FormCheck, ModalTitle } from 'react-bootstrap'
import { HiFilter } from 'react-icons/hi'
import { GrEdit } from 'react-icons/gr'
import { CgCloseO } from 'react-icons/cg'
import { get, post, put } from '../../../../httpHelper'
import './User.css'
import { BsFillCaretDownFill, BsSearch } from "react-icons/bs";
import { Link, useHistory } from 'react-router-dom'

const elementPerPage = 10

export default function User() {
    const [users, setUsers] = useState([])
    const [showUser, setShowUser] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [message, setMessage] = useState('')
    const [keySearch, setKeySearch] = useState('')
    const [userInformation, setUserInformation] = useState()
    const [staffCodeASC, setStaffCodeASC] = useState(false)
    const [fullNameASC, setFullNameASC] = useState(true)
    const [usernameASC, setUsernameASC] = useState(false)
    const [joinedDateASC, setJoinedDateASC] = useState(false)
    const [typeASC, setTypeASC] = useState(false)
    const [stateASC, setStateASC] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [data, setData] = useState([])
    const [typeChecked, setTypeChecked] = useState([TYPE.ALL])
    const [stateChecked, setStateChecked] = useState([STATE.ALL])
    const [showDelete, setShowDelete] = useState(false)
    const [validDisable, setValidDisable] = useState(false)
    const [isDeleteYourself, setIsDeleteYourself] = useState(false)
    const [validDelete, setValidDelete] = useState(false)
    const [staffCodeDelete, setStaffCodeDelete] = useState()
    const history = useHistory();

    useEffect(() => {
        // init()
        fetchUsers()
        // let NewData = data.filter(u => u.state === 'Enable')
    }, [])

    const init = () => {
        // const options = []
        // options.push({
        //     type: TYPE.ALL,
        //     checked: 'checked',
        // })
        // options.push({
        //     type: TYPE.STAFF,
        //     checked: '',
        // })
        // options.push({
        //     type: TYPE.ADMIN,
        //     checked: '',
        // })
        // setTypeOptions(options)
    }

    const fetchUsers = () => {
        get('/users').then(response => {
            if (response.status === 200) {
                let newUsers = response.data
                if (history.location.state) {
                    newUsers.unshift(newUsers.splice(newUsers.findIndex(item => item.id === history.location.state.id), 1)[0])
                }
                setData(newUsers)
                setUsers(newUsers)
                history.replace(); // delete id in history to reload page...
            } else {
                toastMessage('Something wrong!')
            }
        }).catch(error => toastMessage("Fail to connect server!"))
        // handleSort(SORT_BY.FullName)
    }

    const toastMessage = (message) => {
        setMessage(message)
        setShowToast(true)
    }

    const handleRowClick = (staffCode) => {
        //release
        // const url = `/users/?staffCode=${staffCode}`;
        const url = `/users/${staffCode}`;
        get(url).then(response => {
            if (response.status === 200) {
                //release
                // setUserInformation(response.data.length > 0 && response.data[0])
                setUserInformation(response.data)
                setShowUser(true)
            } else {
                toastMessage('Something wrong!')
            }
        }).catch(error => toastMessage(error.response.data.message))
    }

    const handleSort = (key) => {
        let reverse = -1;
        let list = []
        if (key === SORT_BY.StaffCode) {
            reverse = staffCodeASC ? -1 : 1;
            setStaffCodeASC(!staffCodeASC)
            list = users.slice().sort((a, b) => (a.staffCode > b.staffCode) ? 1 * reverse : ((b.staffCode > a.staffCode) ? -1 * reverse : 0))
        }
        else if (key === SORT_BY.FullName) {
            reverse = fullNameASC ? -1 : 1;
            setFullNameASC(!fullNameASC)
            list = users.slice().sort((a, b) => (a.fullName > b.fullName) ? 1 * reverse : ((b.fullName > a.fullName) ? -1 * reverse : 0))
        }
        else if (key === SORT_BY.JoinedDate) {
            reverse = joinedDateASC ? -1 : 1;
            setJoinedDateASC(!joinedDateASC)
            list = users.slice().sort((a, b) => (a.joinedDate > b.joinedDate) ? 1 * reverse : ((b.joinedDate > a.joinedDate) ? -1 * reverse : 0))
        }
        else if (key === SORT_BY.Username) {
            reverse = usernameASC ? -1 : 1;
            setUsernameASC(!usernameASC)
            list = users.slice().sort((a, b) => (a.username > b.username) ? 1 * reverse : ((b.username > a.username) ? -1 * reverse : 0))
        }
        else if (key === SORT_BY.Type) {
            reverse = typeASC ? -1 : 1;
            setTypeASC(!typeASC)
            list = users.slice().sort((a, b) => (a.type > b.type) ? 1 * reverse : ((b.type > a.type) ? -1 * reverse : 0))
        }
        else if (key === SORT_BY.State) {
            reverse = stateASC ? -1 : 1;
            setStateASC(!stateASC)
            list = users.slice().sort((a, b) => (a.state > b.state) ? 1 * reverse : ((b.state > a.state) ? -1 * reverse : 0))
        }
        setUsers(list)
    }

    const handleKeySearchOnChange = (e) => {
        setKeySearch(e.target.value)
        handleSearch(e.target.value)
    }

    const filterByStaffCodeOrFullName = (data, keySearch) => {
        return data.filter(e => (e.staffCode.toLowerCase().includes(keySearch.toLowerCase())
            || e.fullName.toLowerCase().includes(keySearch.toLowerCase())))
    }

    const handleSearch = async (keySearch) => {
        if (keySearch.length === 0) {
            // const type = typeOptions.filter(e => e.checked === 'checked')[0].type;
            const type = typeChecked;
            if (type === TYPE.ALL)
                setUsers(data)
            else
                setUsers(data.filter(u => u.type === type))
        } else {
            setCurrentPage(1)
            const type = typeChecked;
            if (type === TYPE.ALL)
                setUsers(filterByStaffCodeOrFullName(data, keySearch))
            else
                setUsers(filterByStaffCodeOrFullName(data.filter(u => u.type === type), keySearch))
            // await setUsers(filterByStaffCodeOrFullName(data, keySearch))
        }
    }

    const handleTypeClick = async (e) => {
        if (e === TYPE.ALL) setTypeChecked([e]);
        else {
            if (typeChecked.includes(e)) {
                setTypeChecked([...typeChecked.filter((item) => item !== e)]);
            }
            else {
                setTypeChecked([...typeChecked.filter((item) => item !== TYPE.ALL), e]);
            }
        }
        // setCurrentPage(1);
    };

    const handleStateClick = async (e) => {
        if (e == STATE.ALL) setStateChecked([e]);
        else {
            if (stateChecked.includes(e)) {
                setStateChecked([...stateChecked.filter((item) => item !== e)]);
            }
            else {
                setStateChecked([...stateChecked.filter((item) => item !== TYPE.ALL), e]);
            }
        }
    };

    useEffect(() => {
        let result = [...data];
        result = filterByStaffCodeOrFullName(
            data.filter(
                u =>
                    (typeChecked.includes(u.type) || typeChecked.includes(TYPE.ALL)) &&
                    (stateChecked.includes(u.state) || stateChecked.includes(STATE.ALL))
            ),
            keySearch
        );

        setUsers(result);
        setCurrentPage(1);
    }, [typeChecked, stateChecked, keySearch]);

    const handleDelete = (StaffCode) => {
        setValidDisable(false);
        setValidDelete(false);
        setIsDeleteYourself(false);
        
        // check valid delete user
        const endpoint = '/users/disable/' + StaffCode
        get(endpoint)
            .then(response => {
                if (response.status === 200) {
                    setValidDisable(true);
                    setStaffCodeDelete(StaffCode)
                } else if (response.status === 202) {
                    setValidDelete(true);
                    setStaffCodeDelete(StaffCode)
                } 
                // else {
                //     toastMessage('Something wrong!')
                // }
            })
            .catch(error => {
                // toastMessage(error.response.data.message)
                if(error.response.status === 400) { // delete yourself
                    setIsDeleteYourself(true);
                } else if(error.response.status === 409) { // cannot delete or disable because account has valid assignment!
                    setIsDeleteYourself(false);
                }
            })
            .finally(() => {
                setShowDelete(true);
            });
    }

    const DisableUser = () => {
        //Disable user
        const endpoint = '/users/disable/' + staffCodeDelete
        put(endpoint)
            .then(response => {
                if (response.status === 200) {
                    if (validDisable) { // Change state the record to 'Disabled' when disable user successful
                        setUsers(users.map(u => {
                            if (u.staffCode === staffCodeDelete) {
                                u.state = STATE.DISABLED;
                            }
                            return u;
                        }));
                        setUsers(data.map(u => {
                            if (u.staffCode === staffCodeDelete) {
                                u.state = STATE.DISABLED;
                            }
                            return u;
                        }))
                    } else if (validDelete) { // Remove the record when delete user successful
                        setUsers(users.filter(staff => staff.staffCode !== staffCodeDelete))
                        setData(data.filter(staff => staff.staffCode !== staffCodeDelete))
                    }

                    setValidDisable(false)
                    setValidDelete(false);
                    setShowDelete(false)
                } else {
                    toastMessage('Something wrong!')
                }
            })
            .catch(error => toastMessage(error.response.data.message))
    }

    const handleCancelDisableOrDelete = () => {
        setValidDisable(false)
        setValidDelete(false)
        setShowDelete(false)
    }

    useEffect(() => {
        setUsers(data)
    }, [data])

    return (
        <>
            <h5 style={{ color: '#CF2338' }}>User List</h5>
            <Row>
                <Col>
                    <Dropdown autoClose="outside" className="drop-filter">
                        <Button className="dropdown-button col-md-6 col-sm-12" disabled text={TYPE.ALL}>
                            Type
                        </Button>
                        <Dropdown.Toggle
                            className="dropdown-button-filter btn btn-primary"
                            id="dropdown-basic">
                            <HiFilter />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <div className="checkbox px-3" onClick={() => {
                                handleTypeClick(TYPE.ALL)
                            }}>
                                <FormCheck label={ROLEtoLowcase[TYPE.ALL]} checked={typeChecked.includes(TYPE.ALL) ? 'checked' : ''} />
                            </div>
                            <div className="checkbox px-3" onClick={() => {
                                handleTypeClick(TYPE.ADMIN)
                            }}>
                                <FormCheck label={ROLEtoLowcase[TYPE.ADMIN]} checked={typeChecked.includes(TYPE.ADMIN) ? 'checked' : ''} />
                            </div>
                            <div className="checkbox px-3" onClick={() => {
                                handleTypeClick(TYPE.STAFF)
                            }}>
                                <FormCheck label={ROLEtoLowcase[TYPE.STAFF]} checked={typeChecked.includes(TYPE.STAFF) ? 'checked' : ''} />
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col>
                    <Dropdown autoClose="outside" className="drop-filter">
                        <Button className="dropdown-button col-md-6 col-sm-12" disabled>
                            State
                        </Button>
                        <Dropdown.Toggle
                            className="dropdown-button-filter btn btn-primary"
                            id="dropdown-basic">
                            <HiFilter />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <div className="checkbox px-3" onClick={() => {
                                handleStateClick(STATE.ALL)
                            }}>
                                <FormCheck label={STATEtoLowCase[STATE.ALL]} checked={stateChecked.includes(STATE.ALL) ? 'checked' : ''} />
                            </div>
                            <div className="checkbox px-3" onClick={() => {
                                handleStateClick(STATE.ENABLED)
                            }}>
                                <FormCheck label={STATEtoLowCase[STATE.ENABLED]} checked={stateChecked.includes(STATE.ENABLED) ? 'checked' : ''} />
                            </div>
                            <div className="checkbox px-3" onClick={() => {
                                handleStateClick(STATE.DISABLED)
                            }}>
                                <FormCheck label={STATEtoLowCase[STATE.DISABLED]} checked={stateChecked.includes(STATE.DISABLED) ? 'checked' : ''} />
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col>
                    <div className="float-end">
                        <div className="input-group">
                            <div className="form-outline">
                                <input
                                    value={keySearch}
                                    onChange={handleKeySearchOnChange}
                                    type="search"
                                    id="keySearch"
                                    className="form-control"
                                    placeholder="Search" />
                            </div>
                            <button type="button" className="btn btn-primary" disabled={true}>
                                <BsSearch style={{}} />
                            </button>
                        </div>
                    </div>
                </Col>
                <Col>
                    <div className="float-end">
                        <Link className="btn" style={{ color: "#FFF", backgroundColor: '#CF2338', borderColor: '#CF2338' }} to="./create-user">Create new user</Link>
                    </div>
                </Col>
            </Row>  
            <Row>
                <Table responsive>
                    <thead>
                        <tr>
                            <th className="w-14 table-thead" onClick={() => handleSort(SORT_BY.StaffCode)} >
                                Staff Code
                                <BsFillCaretDownFill />
                            </th>
                            <th className="w-20 table-thead" onClick={() => handleSort(SORT_BY.FullName)} >
                                Full Name
                                <BsFillCaretDownFill />
                            </th>
                            <th className="w-14">Username </th>
                            <th className="w-14 table-thead" onClick={() => handleSort(SORT_BY.JoinedDate)} >
                                Joined Date
                                <BsFillCaretDownFill />
                            </th>
                            <th className="w-14 table-thead" onClick={() => handleSort(SORT_BY.Type)} >
                                Type
                                <BsFillCaretDownFill />
                            </th>
                            <th className="w-14 table-thead" onClick={() => handleSort(SORT_BY.State)} >
                                State
                                <BsFillCaretDownFill />
                            </th>
                            <th className="w-14"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users && users.slice((currentPage - 1) * elementPerPage, currentPage * elementPerPage)
                            .map(u => (
                                <tr key={u.staffCode}>
                                    <td onClick={() => handleRowClick(u.staffCode)}>{u.staffCode}</td>
                                    <td onClick={() => handleRowClick(u.staffCode)}>{u.fullName}</td>
                                    <td onClick={() => handleRowClick(u.staffCode)}>{u.username}</td>
                                    <td onClick={() => handleRowClick(u.staffCode)}>{u.joinedDate}</td>
                                    <td onClick={() => handleRowClick(u.staffCode)}>{ROLEtoLowcase[u.type]}</td>
                                    <td onClick={() => handleRowClick(u.staffCode)}>{STATEtoLowCase[u.state]}</td>
                                    <td>
                                        <div className="d-flex justify-content-evenly">
                                            <Link to={"/edit-user/" + u.staffCode} style={{ textDecoration: "none" }}>
                                                <GrEdit style={editIconStyle} />
                                            </Link>
                                            <CgCloseO style={deleteIconStyle} onClick={() => handleDelete(u.staffCode)} id='close-btn' />

                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
            </Row>
            <Col className="float-end">
                <Pagination size="sm">
                    <Pagination.Prev disabled={currentPage < 2} onClick={() => setCurrentPage(currentPage - 1)}>Previous</Pagination.Prev>
                    <Pagination.Item
                        onClick={() => setCurrentPage(currentPage - 1)}
                        style={{ display: currentPage < 2 && 'none' }}
                    >{currentPage - 1}</Pagination.Item>
                    <Pagination.Item active>{currentPage}</Pagination.Item>
                    <Pagination.Item
                        hidden={currentPage >= Math.ceil((users.length / elementPerPage))}
                        disabled={currentPage === Math.ceil((users.length / elementPerPage))}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >{currentPage + 1}</Pagination.Item>
                    <Pagination.Next
                        disabled={currentPage >= Math.ceil((users.length / elementPerPage))}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >Next
                    </Pagination.Next>
                </Pagination>
            </Col>
            <Modal
                show={showUser}
                onHide={() => setShowUser(false)}
                centered
                id="detail-dialog"
            >
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: '#CF2338' }}>Detailed User Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="modal-detail-user">
                        <Form.Group as={Row} controlId="formPlaintextEmail">
                            <Form.Label column sm="4" className="pr-0">
                                Staff Code
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control plaintext readOnly defaultValue={userInformation && userInformation.staffCode} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formPlaintextEmail">
                            <Form.Label column sm="4">
                                Full Name
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control plaintext readOnly defaultValue={userInformation && userInformation.fullName} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formPlaintextEmail">
                            <Form.Label column sm="4">
                                Username
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control plaintext readOnly defaultValue={userInformation && userInformation.username} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formPlaintextEmail">
                            <Form.Label column sm="4">
                                Date Of Birth
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control plaintext readOnly defaultValue={userInformation && userInformation.dateOfBirth} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formPlaintextEmail">
                            <Form.Label column sm="4">
                                Email
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control plaintext readOnly defaultValue={userInformation && userInformation.email} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formPlaintextEmail">
                            <Form.Label column sm="4">
                                Gender
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control plaintext readOnly defaultValue={userInformation && userInformation.gender} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formPlaintextEmail">
                            <Form.Label column sm="4">
                                Joined Date
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control plaintext readOnly defaultValue={userInformation && userInformation.joinedDate} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formPlaintextEmail">
                            <Form.Label column sm="4">
                                Type
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control plaintext readOnly defaultValue={userInformation && ROLEtoLowcase[userInformation.type]} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formPlaintextEmail">
                            <Form.Label column sm="4">
                                Location
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control plaintext readOnly defaultValue={userInformation && userInformation.location} />
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>
            {/* Delete user */}
            <Modal
                show={showDelete}
                onHide={() => setShowDelete(false)}
                centered
                id="detail-dialog"
            >
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: '#CF2338' }}>
                        {(validDisable || validDelete) ? <>Are you sure?</> : <>Can not disable or delete user</>}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isDeleteYourself ?
                        <>
                            You cannot or disable or delete yourself.
                        </>
                        :
                        validDisable ?
                            <>
                                Do you want to disable this user?
                                <p id="disable-user">
                                    <Button id="disable-user-btn" onClick={DisableUser}>Disable</Button>
                                    {/* <Button id="cancel-btn" autoFocus={true} onClick={() => setShowDelete(false)}>Cancel</Button> */}
                                    <Button id="cancel-btn" autoFocus={true} onClick={handleCancelDisableOrDelete}>Cancel</Button>

                                </p>
                            </>
                            :
                            validDelete ?
                                <>
                                    Do you want to delete this user?
                                    <p id="disable-user">
                                        <Button id="disable-user-btn" onClick={DisableUser}>Delete</Button>
                                        <Button id="cancel-btn" autoFocus={true} onClick={handleCancelDisableOrDelete}>Cancel</Button>
                                    </p>
                                </>
                                :
                                <>
                                    There are valid assignments belonging to this user. Please close all assignments before disabling user.
                                </>
                    }
                </Modal.Body>
            </Modal>
            <Toast onClose={() => setShowToast(false)} show={showToast} delay={1000} autohide position="top-end">
                <Toast.Header>
                    <img
                        src="holder.js/20x20?text=%20"
                        className="rounded me-2"
                        alt=""
                    />
                    <strong className="me-auto">Bootstrap</strong>
                    <small>11 mins ago</small>
                </Toast.Header>
                <Toast.Body>{message}</Toast.Body>
            </Toast>
        </>
    )
}

const SORT_BY = { StaffCode: 'staffCode', FullName: 'fullName', Username: 'username', JoinedDate: 'joinedDate', Type: 'type', State: 'state' }
const TYPE = { ALL: 'ALL', STAFF: 'ROLE_STAFF', ADMIN: 'ROLE_ADMIN' }
const ROLEtoLowcase = { ALL: 'All', ROLE_ADMIN: 'Admin', ROLE_STAFF: 'Staff' }
const STATE = { ALL: 'ALL', DISABLED: 'Disabled', ENABLED: 'Enable' }
const STATEtoLowCase = { ALL: 'All', Disabled: 'Break', Enable: 'Working' }

const deleteIconStyle = {
    color: 'red',
    fontSize: '130%',
}

const editIconStyle = {
    fontSize: '130%',
}