import React, { useEffect, useState } from 'react'
import { Col, Row, Table, Modal, Toast, Form, Dropdown, Button, Pagination, FormCheck, ModalTitle, ToastContainer } from 'react-bootstrap'
import { HiFilter } from 'react-icons/hi'
import { del, get, put } from '../../../httpHelper'
// import './Request.css'
import { BsFillCaretDownFill, BsSearch } from "react-icons/bs";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import '../CreateUser/createuser.css'
import { FaCalendarAlt } from "react-icons/fa"
import moment from "moment";
import { Link, useHistory } from 'react-router-dom';

const elementPerPage = 10;
let requestId;

export default function RequestAssignUser() {
    const [requestAssigns, setRequestAssigns] = useState([])
    const [showToast, setShowToast] = useState(false)
    const [message, setMessage] = useState('')
    const [keySearch, setKeySearch] = useState('')
    const [idASC, setIdASC] = useState(false)
    const [noteASC, setNoteASC] = useState(false)
    const [categoryASC, setCategoryASC] = useState(false)
    const [requestedDateASC, setRequestedDateASC] = useState(false)
    const [requestedByASC, setRequestedBy] = useState(false)
    const [stateASC, setStateASC] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [data, setData] = useState([])
    const [stateChecked, setStateChecked] = useState([STATE.ALL])
    const [requestedDate, setRequestedDate] = useState()
    const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);
    const [showModalDeleteRequest, setShowModalDeleteRequest] = useState(false);
    const [showToastError, setShowToastError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')

    const history = useHistory();

    useEffect(() => {
        fetchRequestAssigns();
    }, []);

    const fetchRequestAssigns = () => {
        get('/request-assign').then(response => {
            if (response.status === 200) {
                let newRequestAssigns = response.data
                if (history.location.state) {
                    newRequestAssigns.unshift(newRequestAssigns.splice(newRequestAssigns.findIndex(item => item.id === history.location.state.id), 1)[0])
                }
                setData(newRequestAssigns)
                setRequestAssigns(newRequestAssigns)
                history.replace(); // delete id in history to reload page...
            } else {
                toastMessage('Something wrong!')
            }
        }).catch(error => toastMessage("Fail to connect server!"))
    }

    const handleDeleteRequest = (requestId) => {
        del(`/request-assign/${requestId}`)
            .then((response) => {
                if (response.status === 204) {
                    setRequestAssigns(requestAssigns.filter((r) => r.id !== requestId))
                    setData(data.filter((r) => r.id !== requestId))
                }
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 404) {
                        setErrorMessage('404 - Request ID not found!')
                    }
                } else {
                    setErrorMessage(`Error code: ${error.response.status}`)
                }
                setShowToastError(true);
            })
            .finally(() => setShowModalDeleteRequest(false));
    }

    const toastMessage = (message) => {
        setMessage(message)
        setShowToast(true)
    }

    const handleSort = (key) => {
        let reverse = -1;
        let list = []
        if (key === SORT_BY.Id) {
            reverse = idASC ? -1 : 1;
            setIdASC(!idASC)
            list = requestAssigns.slice().sort((a, b) => (a.id > b.id) ? 1 * reverse : ((b.id > a.id) ? -1 * reverse : 0))
        } else if (key === SORT_BY.Note) {
            reverse = noteASC ? -1 : 1;
            setNoteASC(!noteASC)
            list = requestAssigns.slice().sort((a, b) => (a.note > b.note) ? 1 * reverse : ((b.note > a.note) ? -1 * reverse : 0))
        } else if (key === SORT_BY.Category) {
            reverse = categoryASC ? -1 : 1;
            setCategoryASC(!categoryASC)
            list = requestAssigns.slice().sort((a, b) => (a.category > b.category) ? 1 * reverse : ((b.category > a.category) ? -1 * reverse : 0))
        } else if (key === SORT_BY.RequestedDate) {
            reverse = requestedDateASC ? -1 : 1;
            setRequestedDateASC(!requestedDateASC)
            list = requestAssigns.slice().sort((a, b) => (a.requestedDate > b.requestedDate) ? 1 * reverse : ((b.requestedDate > a.requestedDate) ? -1 * reverse : 0))
        } else if (key === SORT_BY.RequestedBy) {
            reverse = requestedByASC ? -1 : 1;
            setRequestedBy(!requestedByASC)
            list = requestAssigns.slice().sort((a, b) => (a.requestedBy > b.requestedBy) ? 1 * reverse : ((b.requestedBy > a.requestedBy) ? -1 * reverse : 0))
        } else if (key === SORT_BY.State) {
            reverse = stateASC ? -1 : 1;
            setStateASC(!stateASC)
            list = requestAssigns.slice().sort((a, b) => (a.state > b.state) ? 1 * reverse : ((b.state > a.state) ? -1 * reverse : 0))
        }
        setRequestAssigns(list)
    }

    const handleStateClick = (e) => {
        if (e === STATE.ALL) setStateChecked([e]);
        else {
            if (stateChecked.includes(e))
                setStateChecked([...stateChecked.filter((item) => item !== e)]);
            else
                setStateChecked([...stateChecked.filter((item) => item !== STATE.ALL), e]);
        }
        setCurrentPage(1);
    }

    const onClickDeleteRequest = (id) => {
        requestId = id;
        setShowModalDeleteRequest(true);
    }

    const openDatePicker = () => {
        setIsOpenDatePicker(!isOpenDatePicker);
    }

    const filterSort = (data, keySearch) => {
        return data.filter((e) => (
            e.id.toString() === keySearch ||
            e.note.toLowerCase().includes(keySearch.toLowerCase()) ||
            e.requestedBy.toLowerCase().includes(keySearch.toLowerCase())
        ));
    };

    useEffect(() => {
        let result = [...data];
        let date = requestedDate ? moment(new Date(requestedDate)).format("DD/MM/YYYY") : null

        result = filterSort(data.filter(u => (stateChecked.includes(u.state) || stateChecked.includes(STATE.ALL)) &&
            (u.requestedDate === date || date === null)), keySearch)

        setRequestAssigns(result);
        setCurrentPage(1);
    }, [stateChecked, requestedDate, keySearch]);

    return (
        <>
            <h5 style={{ color: '#CF2338' }}>Request for Assigning List</h5>
            <Row>
                {/* <Col sm={2}>
                    <Dropdown autoClose="outside" className="drop-filter">
                        <Button className="dropdown-button col-md-6 col-sm-12" disabled text={STATE.ALL}>
                            State
                        </Button>
                        <Dropdown.Toggle
                            className="dropdown-button-filter btn btn-primary"
                            id="dropdown-basic">
                            <HiFilter />
                        </Dropdown.Toggle>
                        <Dropdown.Menu id="drop-show-assignment">
                            <div className="checkbox px-3" onClick={() => {
                                handleStateClick(STATE.ALL)
                            }}>
                                <FormCheck label={STATEtoLowcase[STATE.ALL]} checked={stateChecked.includes(STATE.ALL) ? 'checked' : ''} />
                            </div>
                            <div className="checkbox px-3" onClick={() => {
                                handleStateClick(STATE.WAITING_FOR_ASSIGNING)
                            }}>
                                <FormCheck label={STATEtoLowcase[STATE.WAITING_FOR_ASSIGNING]} checked={stateChecked.includes(STATE.WAITING_FOR_ASSIGNING) ? 'checked' : ''} />
                            </div>
                            <div className="checkbox px-3" onClick={() => {
                                handleStateClick(STATE.ACCEPTED)
                            }}>
                                <FormCheck label={STATEtoLowcase[STATE.ACCEPTED]} checked={stateChecked.includes(STATE.ACCEPTED) ? 'checked' : ''} />
                            </div>
                            <div className="checkbox px-3" onClick={() => {
                                handleStateClick(STATE.DECLINED)
                            }}>
                                <FormCheck label={STATEtoLowcase[STATE.DECLINED]} checked={stateChecked.includes(STATE.DECLINED) ? 'checked' : ''} />
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col md={3}>
                    <div className="datepicker">
                        <DatePicker className="form-control"
                            dateFormat="dd/MM/yyyy" showMonthDropdown showYearDropdown scrollableYearDropdown yearDropdownItemNumber={50}
                            onKeyDown={(e) => e.preventDefault()}
                            selected={requestedDate && new Date(requestedDate)}
                            onChange={(date) => setRequestedDate(moment(date).format('YYYY-MM-DD'))}
                            placeholderText="Requested Date"
                            onClickOutside={openDatePicker}
                            onSelect={openDatePicker}
                            onFocus={openDatePicker}
                            open={isOpenDatePicker}
                        />
                        <FaCalendarAlt className="icon-date" onClick={openDatePicker} />
                    </div>
                </Col>
                <Col>
                    <div className="float-end">
                        <div className="input-group">
                            <div className="form-outline">
                                <input
                                    value={keySearch}
                                    onChange={(e) => setKeySearch(e.target.value)}
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
                </Col> */}
                <Col>
                    <Link className="btn btn-danger float-end" to="/create-request-assign">
                        Create request for assigning
                    </Link>
                </Col>
            </Row>
            <br />
            <Row>
                <Table responsive>
                    <thead>
                        <tr>
                            <th className="table-thead w-7" onClick={() => handleSort(SORT_BY.Id)} >
                                No.
                                <BsFillCaretDownFill />
                            </th>
                            <th className="table-thead w-28" onClick={() => handleSort(SORT_BY.Note)} >
                                Note
                                <BsFillCaretDownFill />
                            </th>
                            <th className="table-thead w-14" onClick={() => handleSort(SORT_BY.Category)} >
                                Category
                                <BsFillCaretDownFill />
                            </th>

                            <th className="table-thead w-14" onClick={() => handleSort(SORT_BY.RequestedDate)} >
                                Requested Date
                                <BsFillCaretDownFill />
                            </th>
                            {/* <th className="table-thead w-14" onClick={() => handleSort(SORT_BY.RequestedBy)} >
                                Requested by
                                <BsFillCaretDownFill />
                            </th> */}
                            <th className="table-thead w-16" onClick={() => handleSort(SORT_BY.State)} >
                                State
                                <BsFillCaretDownFill />
                            </th>
                            <th className="table-thead w-7"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {requestAssigns && requestAssigns.slice((currentPage - 1) * elementPerPage, currentPage * elementPerPage)
                            .map(r => (
                                <tr key={r.id}>
                                    <td>{r.id}</td>
                                    <td>{r.note}</td>
                                    <td>{r.category}</td>
                                    <td>{r.requestedDate}</td>
                                    {/* <td>{r.requestedBy}</td> */}
                                    <td>{STATEtoLowcase[r.state]}</td>
                                    <td>
                                        <div className="d-flex justify-content-evenly">
                                            {r.state === STATE.WAITING_FOR_ASSIGNING ?
                                                <FontAwesomeIcon style={{ cursor: "pointer" }} size="lg" icon={faTimes} onClick={() => onClickDeleteRequest(r.id)} />
                                                :
                                                <FontAwesomeIcon color="#ccc" size="lg" icon={faTimes} />
                                            }
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
            </Row>
            <br />
            {/* <Col className="float-end">
                <Pagination size="sm">
                    <Pagination.Prev disabled={currentPage < 2} onClick={() => setCurrentPage(currentPage - 1)}>Previous</Pagination.Prev>
                    <Pagination.Item
                        onClick={() => setCurrentPage(currentPage - 1)}
                        style={{ display: currentPage < 2 && 'none' }}
                    >{currentPage - 1}</Pagination.Item>
                    <Pagination.Item active>{currentPage}</Pagination.Item>
                    <Pagination.Item
                        hidden={currentPage >= Math.ceil((requestAssigns.length / elementPerPage))}
                        disabled={currentPage === Math.ceil((requestAssigns.length / elementPerPage))}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >{currentPage + 1}</Pagination.Item>
                    <Pagination.Next
                        disabled={currentPage >= Math.ceil((requestAssigns.length / elementPerPage))}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >Next
                    </Pagination.Next>
                </Pagination>
            </Col> */}
            <Toast onClose={() => setShowToast(false)} show={showToast} delay={1000} autohide position="top-end">
                <Toast.Header>
                    <strong className="me-auto">Notification!</strong>
                    <small>Just now</small>
                </Toast.Header>
                <Toast.Body>{message}</Toast.Body>
            </Toast>
            <ToastContainer className="p-3" id='t' position='middle-end'>
                <Toast bg="warning" onClose={() => setShowToastError(false)} show={showToastError} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Notification!</strong>
                        <small>Just now</small>
                    </Toast.Header>
                    <Toast.Body>{errorMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
            <Modal centered show={showModalDeleteRequest}>
                <Modal.Header>
                    <Modal.Title style={{ color: '#dc3545' }}>Are you sure?</Modal.Title>
                </Modal.Header>
                <Modal.Body>Do you want to delete this assigning request?</Modal.Body>
                <Modal.Footer style={{ display: 'block', marginLeft: '32px' }}>
                    <Button variant='danger' onClick={() => handleDeleteRequest(requestId)}>
                        Delete
                    </Button>
                    <Button variant='secondary' onClick={() => setShowModalDeleteRequest(false)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

const SORT_BY = { Id: 'id', Note: 'note', Category: 'category', RequestedDate: 'requestedDate', RequestedBy: 'requestedBy', State: 'state' }
const STATE = { ALL: 'ALL', WAITING_FOR_ASSIGNING: 'WAITING_FOR_ASSIGNING', ACCEPTED: 'ACCEPTED', DECLINED: 'DECLINED' }
const STATEtoLowcase = { ALL: 'All', WAITING_FOR_ASSIGNING: 'Waiting for assigning', ACCEPTED: 'Accepted', DECLINED: 'Declined' }