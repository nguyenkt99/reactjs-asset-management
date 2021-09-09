import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
  Table,
  Modal,
  Toast,
  Form,
  Dropdown,
  Button,
  Pagination,
  FormCheck,
  ModalTitle,
  FormGroup,
  ToastContainer,
} from 'react-bootstrap';

import { HiFilter } from 'react-icons/hi';
import { GrEdit } from 'react-icons/gr';
import { GrEditCus } from '../../../icon/GrEditCus';
import { FaUndo } from 'react-icons/fa';
import { CgCloseO } from 'react-icons/cg';
import { get, del, post } from '../../../../httpHelper';
import { BsFillCaretDownFill, BsSearch } from "react-icons/bs";
import { Link, useHistory } from 'react-router-dom'
import moment from "moment";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa"

import './ManagerAssignment.css'

const elementPerPage = 10;
let assignmentCode = 0

export default function User() {
  let history = useHistory();

  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showToastError, setShowToastError] = useState(false);
  const [showModalRequest, setShowModalRequest] = useState(false);
  const [Assignmentelect, setAssignmentelect] = useState('');
  const [errMessage, setErrMessage] = useState('');

  const [assignments, setAssignments] = useState([]);
  const [showAssignment, setShowAssignment] = useState(false);
  const [assignmentInformation, setAssignmentInformation] = useState();
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const [keySearch, setKeySearch] = useState('');
  const [assignedDate, setAssignedDate] = useState();
  const [idASC, setIDASC] = useState(true);
  const [assetCodeASC, setAssetCodeASC] = useState(false);
  const [assetNameASC, setAssetNameASC] = useState(false);
  const [assignedToASC, setAssignedToASC] = useState(false);
  const [assignedByASC, setAssignedByASC] = useState(false);
  const [assignedDateASC, setAssignedDateASC] = useState(false);
  const [stateASC, setStateASC] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  // const [stateChecked, setStateChecked] = useState([STATE.All]);
  const [stateChecked, setStateChecked] = useState([STATE.WAITING_FOR_ACCEPTANCE, STATE.ACCEPTED]);
  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = () => {
    get('/assignment')
      .then((response) => {
        if (response.status === 200) {
          let data = response.data;
          if (history.location.state) {
            data.unshift(
              data.splice(
                data.findIndex(
                  (item) => item.id === history.location.state.id
                ),
                1
              )[0]
            );
          }
          setData(data);
          setAssignments(data.filter(u => stateChecked.includes(u.state)));
          history.replace();
        } else {
          toastMessage('Something wrong!');
        }
      })
      .catch((error) => toastMessage('Fail to connect server!'));
  };

  const toastMessage = (message) => {
    setMessage(message);
    setShowToast(true);
  };

  const handleRowClick = (assignmentID) => {
    var assignment = assignments.find((assignment) => assignment.id === assignmentID);
    setAssignmentInformation(assignment);
    setShowAssignment(true);
  };

  const handleSort = (key) => {
    let reverse = -1;
    let list = [];
    if (key === SORT_BY.id) {
      reverse = idASC ? -1 : 1;
      setIDASC(!idASC);
      list = assignments
        .slice()
        .sort((a, b) =>
          a.id > b.id
            ? 1 * reverse
            : b.id > a.id
              ? -1 * reverse
              : 0
        );
    } else if (key === SORT_BY.AssetCode) {
      reverse = assetCodeASC ? -1 : 1;
      setAssetCodeASC(!assetCodeASC);
      list = assignments
        .slice()
        .sort((a, b) =>
          a.assetCode > b.assetCode
            ? 1 * reverse
            : b.assetCode > a.assetCode
              ? -1 * reverse
              : 0
        );
    } else if (key === SORT_BY.AssetName) {
      reverse = assetNameASC ? -1 : 1;
      setAssetNameASC(!assetNameASC);
      list = assignments
        .slice()
        .sort((a, b) =>
          a.assetName > b.assetName
            ? 1 * reverse
            : b.assetName > a.assetName
              ? -1 * reverse
              : 0
        );
    } else if (key === SORT_BY.AssignedTo) {
      reverse = assignedToASC ? -1 : 1;
      setAssignedToASC(!assignedToASC);
      list = assignments
        .slice()
        .sort((a, b) =>
          a.assignedTo > b.assignedTo
            ? 1 * reverse
            : b.assignedTo > a.assignedTo
              ? -1 * reverse
              : 0
        );
    } else if (key === SORT_BY.AssignedBy) {
      reverse = assignedByASC ? -1 : 1;
      setAssignedByASC(!assignedByASC);
      list = assignments
        .slice()
        .sort((a, b) =>
          a.assignedBy > b.assignedBy
            ? 1 * reverse
            : b.assignedBy > a.assignedBy
              ? -1 * reverse
              : 0
        );
    } else if (key === SORT_BY.AssignedDate) {
      reverse = assignedDateASC ? -1 : 1;
      setAssignedDateASC(!assignedDateASC);
      list = assignments
        .slice()
        .sort((a, b) =>
          moment(a.assignedDate, "DD/MM/YYYY").toDate().getTime() >
            moment(b.assignedDate, "DD/MM/YYYY").toDate().getTime()
            ? 1 * reverse
            : moment(b.assignedDate, "DD/MM/YYYY").toDate().getTime() >
              moment(a.assignedDate, "DD/MM/YYYY").toDate().getTime()
              ? -1 * reverse
              : 0
        );
    } else if (key === SORT_BY.State) {
      reverse = stateASC ? -1 : 1;
      setStateASC(!stateASC);
      list = assignments
        .slice()
        .sort((a, b) =>
          a.state > b.state ? 1 * reverse : b.state > a.state ? -1 * reverse : 0
        );
    }
    setAssignments(list);
  };

  const handleKeySearchOnChange = (e) => {
    setKeySearch(e.target.value);
  };

  const filterSort = (data, keySearch) => {
    return data.filter(
      (e) =>
        e.id.toString() === keySearch ||
        e.assetCode.toLowerCase().includes(keySearch.toLowerCase()) ||
        e.assetName.toLowerCase().includes(keySearch.toLowerCase()) ||
        e.assignedTo.toLowerCase().includes(keySearch.toLowerCase()) ||
        e.assignedBy.toLowerCase().includes(keySearch.toLowerCase())
    );
  };

  const handleStateClick = async (e) => {
    if (e === STATE.All) setStateChecked([e]);
    else {
      if (stateChecked.includes(e))
        setStateChecked([...stateChecked.filter((item) => item !== e)]);
      else
        setStateChecked([
          ...stateChecked.filter((item) => item !== STATE.All),
          e,
        ]);
    }
    setCurrentPage(1);
  };



  const handleDeleteClick = (item) => {
    if (item.state === STATE.WAITING_FOR_ACCEPTANCE || item.state === STATE.CANCELED_ASSIGN) {
      assignmentCode = item.id
      setShowModalDelete(true)
    }
  };

  const onClickRequestForReturning = (assignmentId) => {
    assignmentCode = assignmentId;
    setShowModalRequest(true);
  };

  const handleCloseModalDelete = () => {
    setAssignmentelect('');
    setShowModalDelete(false);
  };

  const handleCloseModalErr = () => {
    setAssignmentelect('');
    setShowToastError(false);
  };

  const handleDelete = async () => {
    del(`/assignment/${assignmentCode}`)
      .then((res) => {
        setData(data.filter(e => e.id !== assignmentCode))
        setAssignments(assignments.filter(e => e.id !== assignmentCode))
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            setErrMessage('Logout and then login!')
          } else {
            setErrMessage(`Error: ${error.response.status}: ${error.response.data.message}`)
          }
        } else {
          setErrMessage('Connect connect to server!')
        }
        setShowToastError(true)
      }).finally(() => setShowModalDelete(false));
  };

  const handleRequestForReturning = (assignmentId) => {
    post(`/request`, { assignmentId: assignmentId })
      .then((response) => {
        // fetchAssignments();
        const index = assignments.findIndex(item => item.id === assignmentId);
        let newAssignments = assignments;
        let item = { ...newAssignments[index] };
        item.isCreatedRequest = true;
        item.state = STATE.WAITING_FOR_RETURNING;
        newAssignments[index] = item;
        setAssignments(newAssignments);
        setData(newAssignments);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 404) {
            setErrMessage('Error: ID not found')
          } else if (error.response.status === 409) {
            setErrMessage('Error: Conflict')
          }
        } else {
          setErrMessage('Connection Error!')
        }
        setShowToastError(true)
      })
      .finally(() => setShowModalRequest(false));
  }

  const openDatePicker = () => {
    setIsOpenDatePicker(!isOpenDatePicker);
  }

  useEffect(() => {
    let result = [...data];
    var datepick = assignedDate ? moment(assignedDate).format('DD/MM/YYYY') : null

    result = filterSort(data.filter(u => (stateChecked.includes(u.state) || stateChecked.includes('All')) &&
      (u.assignedDate === datepick || datepick === null)), keySearch)

    setAssignments(result);
    setCurrentPage(1);
  }, [stateChecked, assignedDate, keySearch]);

  return (
    <>
      <h5 style={{ color: '#CF2338' }}>Assignment List</h5>
      <div className="d-flex justify-content-between">
        <Dropdown autoClose="outside" className="drop-filter">
          <Button className="dropdown-button col-md-6 col-sm-12" disabled text='State'>
            State
          </Button>
          <Dropdown.Toggle
            className="dropdown-button-filter btn btn-primary"
            id="dropdown-basic">
            <HiFilter />
          </Dropdown.Toggle>
          <Dropdown.Menu id="drop-show-assignment">
            <div className="checkbox px-3" onClick={() => {
              handleStateClick(STATE.All)
            }}>
              <FormCheck label='ALL' checked={stateChecked.includes(STATE.All) ? 'checked' : ''} />
            </div>
            <div className="checkbox px-3" onClick={() => {
              handleStateClick(STATE.ACCEPTED)
            }}>
              <FormCheck label='Accepted' checked={stateChecked.includes(STATE.ACCEPTED) ? 'checked' : ''} />
            </div>
            <div className="checkbox px-3" onClick={() => {
              handleStateClick(STATE.WAITING_FOR_ACCEPTANCE)
            }}>
              <FormCheck label='Waiting for acceptance' checked={stateChecked.includes(STATE.WAITING_FOR_ACCEPTANCE) ? 'checked' : ''} />
            </div>
            <div className="checkbox px-3" onClick={() => {
              handleStateClick(STATE.CANCELED_ASSIGN)
            }}>
              <FormCheck label='Declined' checked={stateChecked.includes(STATE.CANCELED_ASSIGN) ? 'checked' : ''} />
            </div>
            <div className="checkbox px-3" onClick={() => {
              handleStateClick(STATE.WAITING_FOR_RETURNING)
            }}>
              <FormCheck label='Waiting for returning' checked={stateChecked.includes(STATE.WAITING_FOR_RETURNING) ? 'checked' : ''} />
            </div>
            <div className="checkbox px-3" onClick={() => {
              handleStateClick(STATE.COMPLETED)
            }}>
              <FormCheck label='Completed' checked={stateChecked.includes(STATE.COMPLETED) ? 'checked' : ''} />
            </div>
          </Dropdown.Menu>
        </Dropdown>
        <FormGroup>
          <div className="datepicker">
            <DatePicker className="form-control"
              dateFormat="dd/MM/yyyy" showMonthDropdown showYearDropdown scrollableYearDropdown yearDropdownItemNumber={50}
              onKeyDown={(e) => e.preventDefault()}
              selected={assignedDate && new Date(assignedDate)}
              onChange={(date) => setAssignedDate(moment(date).format('YYYY-MM-DD'))}
              placeholderText="Assigned Date"
              onClickOutside={openDatePicker}
              onSelect={openDatePicker}
              onFocus={openDatePicker}
              open={isOpenDatePicker}
            />
            <FaCalendarAlt className="icon-date" onClick={openDatePicker} />
          </div>
        </FormGroup>
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
        <div className="float-end">
          <Link className="btn" style={{ color: "#FFF", backgroundColor: '#CF2338', borderColor: '#CF2338' }} to="./create-assignment">Create new assignment</Link>
        </div>
      </div>
      <br />
      <Row>
        <Table responsive>
          <thead>
            <tr>
              <th className="table-thead" onClick={() => handleSort(SORT_BY.id)}>
                No.
                <BsFillCaretDownFill />
              </th>
              <th className="table-thead" onClick={() => handleSort(SORT_BY.AssetCode)}>
                Asset Code
                <BsFillCaretDownFill />
              </th>
              <th className="table-thead" onClick={() => handleSort(SORT_BY.AssetName)}>
                Asset Name
                <BsFillCaretDownFill />
              </th>
              <th className="table-thead" onClick={() => handleSort(SORT_BY.AssignedTo)}>
                Assigned to
                <BsFillCaretDownFill />
              </th>
              <th className="table-thead" onClick={() => handleSort(SORT_BY.AssignedBy)}>
                Assigned By
                <BsFillCaretDownFill />
              </th>
              <th className="table-thead" onClick={() => handleSort(SORT_BY.AssignedDate)}>
                Assigned Date
                <BsFillCaretDownFill />
              </th>
              <th className="table-thead" onClick={() => handleSort(SORT_BY.State)}>
                State
                <BsFillCaretDownFill />
              </th>
              <th className='w-14'></th>
            </tr>
          </thead>
          <tbody>
            {
              assignments && assignments.slice((currentPage - 1) * elementPerPage, currentPage * elementPerPage)
                .map(a => (
                  <tr key={a.id}>
                    <td onClick={() => handleRowClick(a.id)}>
                      {a.id}
                    </td>
                    <td onClick={() => handleRowClick(a.id)}>
                      {a.assetCode}
                    </td>
                    <td onClick={() => handleRowClick(a.id)}>
                      {a.assetName}
                    </td>
                    <td onClick={() => handleRowClick(a.id)}>
                      {a.assignedTo}
                    </td>
                    <td onClick={() => handleRowClick(a.id)}>
                      {a.assignedBy}
                    </td>
                    <td onClick={() => handleRowClick(a.id)}>
                      {a.assignedDate}
                    </td>
                    <td onClick={() => handleRowClick(a.id)}>
                      {StateToLowCase[a.state]}
                    </td>
                    <td>
                      <div className='d-flex justify-content-evenly'>
                        {a.state === 'WAITING_FOR_ACCEPTANCE' ? (
                          <Link style={{ textDecoration: 'none', color: '#000' }} to={'/edit-assignment/' + a.id}>
                            <GrEditCus />
                          </Link>
                        ) : (
                          <GrEditCus color='#ccc' />
                        )}
                        <CgCloseO
                          style={{
                            fontSize: '130%',
                            color: `${(a.state === STATE.WAITING_FOR_ACCEPTANCE || a.state === STATE.CANCELED_ASSIGN) ? 'red' : '#ccc'}`,
                            cursor: `${(a.state === STATE.WAITING_FOR_ACCEPTANCE || a.state === STATE.CANCELED_ASSIGN) && 'pointer'}`
                          }}
                          onClick={() => handleDeleteClick(a)}
                        />
                        {(a.state === 'ACCEPTED' && !a.isCreatedRequest) ? (
                          <FaUndo id="undo-assignment" style={{ cursor: 'pointer' }} onClick={() => onClickRequestForReturning(a.id)} />
                        ) : (
                          <FaUndo id="undo-assignment" style={{ color: '#ccc' }} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </Table>
      </Row>
      <br />
      <Col className='float-end'>
        <Pagination size='sm'>
          <Pagination.Prev
            disabled={currentPage < 2}
            onClick={() => setCurrentPage(currentPage - 1)}>
            Previous
          </Pagination.Prev>
          <Pagination.Item
            onClick={() => setCurrentPage(currentPage - 1)}
            style={{ display: currentPage < 2 && 'none' }}>
            {currentPage - 1}
          </Pagination.Item>
          <Pagination.Item active>{currentPage}</Pagination.Item>
          <Pagination.Item
            hidden={currentPage >= Math.ceil(assignments.length / elementPerPage)}
            disabled={currentPage === Math.ceil(assignments.length / elementPerPage)}
            onClick={() => setCurrentPage(currentPage + 1)}>
            {currentPage + 1}
          </Pagination.Item>
          <Pagination.Next
            disabled={currentPage >= Math.ceil(assignments.length / elementPerPage)}
            onClick={() => setCurrentPage(currentPage + 1)}>
            Next
          </Pagination.Next>
        </Pagination>
      </Col>
      <Modal show={showAssignment} onHide={() => setShowAssignment(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#CF2338', backgroundColor: '#FAFCFC' }}>
            Detailed Assignment Information
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#FAFCFC' }}>
          <Form className='modal-detail-asset'>
            <Form.Group as={Row} controlId='formPlaintextEmail'>
              <Form.Label column sm='4' className='pr-0'>
                Asset Code
              </Form.Label>
              <Col sm='8'>
                <Form.Control
                  plaintext
                  readOnly
                  defaultValue={assignmentInformation && assignmentInformation.assetCode}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId='formPlaintextEmail'>
              <Form.Label column sm='4' className='pr-0'>
                Asset Name
              </Form.Label>
              <Col sm='8'>
                <Form.Control
                  plaintext
                  readOnly
                  defaultValue={assignmentInformation && assignmentInformation.assetName}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId='formPlaintextEmail'>
              <Form.Label column sm='4' className='pr-0'>
                Specfication
              </Form.Label>
              <Col sm='8'>
                <Form.Control
                  plaintext
                  readOnly
                  defaultValue={assignmentInformation && assignmentInformation.specfication}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId='formPlaintextEmail'>
              <Form.Label column sm='4' className='pr-0'>
                Assigned To
              </Form.Label>
              <Col sm='8'>
                <Form.Control
                  plaintext
                  readOnly
                  defaultValue={assignmentInformation && assignmentInformation.assignedTo}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId='formPlaintextEmail'>
              <Form.Label column sm='4' className='pr-0'>
                Assigned By
              </Form.Label>
              <Col sm='8'>
                <Form.Control
                  plaintext
                  readOnly
                  defaultValue={assignmentInformation && assignmentInformation.assignedBy}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId='formPlaintextEmail'>
              <Form.Label column sm='4' className='pr-0'>
                Assigned Date
              </Form.Label>
              <Col sm='8'>
                <Form.Control
                  plaintext
                  readOnly
                  defaultValue={assignmentInformation && assignmentInformation.assignedDate}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId='formPlaintextEmail'>
              <Form.Label column sm='4' className='pr-0'>
                State
              </Form.Label>
              <Col sm='8'>
                <Form.Control
                  plaintext
                  readOnly
                  defaultValue={assignmentInformation && StateToLowCase[assignmentInformation.state]}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId='formPlaintextEmail'>
              <Form.Label column sm='4' className='pr-0'>
                Note
              </Form.Label>
              <Col sm='8'>
                <Form.Control
                  plaintext
                  readOnly
                  defaultValue={assignmentInformation && assignmentInformation.note}
                />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={1000}
        autohide
        position='top-end'>
        <Toast.Header>
          <strong className='me-auto'>Bootstrap</strong>
          <small>11 mins ago</small>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
      <Modal centered show={showModalDelete}>
        <Modal.Header>
          <Modal.Title style={{ color: '#dc3545' }}>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to delete this assignment?</Modal.Body>
        <Modal.Footer style={{ display: 'block', marginLeft: '32px' }}>
          <Button variant='danger' onClick={handleDelete}>
            Delete
          </Button>
          <Button variant='secondary' onClick={() => setShowModalDelete(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal centered show={showModalRequest}>
        <Modal.Header>
          <Modal.Title style={{ color: '#dc3545' }}>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to create a returning for this asset?</Modal.Body>
        <Modal.Footer style={{ display: 'block', marginLeft: '32px' }}>
          <Button variant='danger' onClick={() => handleRequestForReturning(assignmentCode)}>
            Yes
          </Button>
          <Button variant='secondary' onClick={() => setShowModalRequest(false)}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer className="p-3" id='t' position='middle-end'>
        <Toast bg="warning" onClose={() => setShowToastError(false)} show={showToastError} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Notification!</strong>
            <small>Just now</small>
          </Toast.Header>
          <Toast.Body>{errMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

const SORT_BY = {
  id: 'id',
  AssetCode: 'AssetCode',
  AssetName: 'AssetName',
  AssignedTo: 'AssignedTo',
  AssignedBy: 'AssignedBy',
  AssignedDate: 'AssignedDate',
  State: 'State',
};
const STATE = {
  All: 'All',
  ACCEPTED: 'ACCEPTED',
  WAITING_FOR_ACCEPTANCE: 'WAITING_FOR_ACCEPTANCE',
  CANCELED_ASSIGN: 'CANCELED_ASSIGN',
  WAITING_FOR_RETURNING: 'WAITING_FOR_RETURNING',
  COMPLETED: 'COMPLETED'
};
const StateToLowCase = {
  ACCEPTED: 'Accepted',
  WAITING_FOR_ACCEPTANCE: 'Waiting for acceptance',
  CANCELED_ASSIGN: 'Declined',
  WAITING_FOR_RETURNING: 'Waiting for returning',
  COMPLETED: 'Completed'
};
