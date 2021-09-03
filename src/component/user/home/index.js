import React, { useEffect, useState } from "react";
import { Col, Row, Table, Modal, Form, Button, ModalTitle } from "react-bootstrap";
import "./UserAssignment.css";
import { CgUndo } from 'react-icons/cg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { get, put, post } from '../../../httpHelper';
import { BsFillCaretDownFill } from "react-icons/bs";
import './UserAssignment.css'

let assignmentCode = 0

export default function UserAssignment() {
  const [assignments, setAssignments] = useState([]);
  const [showAssignment, setShowAssignment] = useState(false);
  const [assignmentInformation, setAssignmentInformation] = useState();
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const [idASC, setIDASC] = useState(false);
  const [assetCodeASC, setAssetCodeASC] = useState(true);
  const [assetNameASC, setAssetNameASC] = useState(false);
  const [categoryASC, setCategoryASC] = useState(false);
  const [assignedDateASC, setAssignedDateASC] = useState(false);
  const [stateASC, setStateASC] = useState(false);
  const [data, setData] = useState([]);
  const [showModalAccept, setShowModalAccept] = useState(false);
  const [showModalDeclined, setShowModalDeclined] = useState(false);
  const [showModalRequest, setShowModalRequest] = useState(false);

  useEffect(() => {
    fetchUserAssignment();
  }, []);

  const fetchUserAssignment = () => {
    get('/assignment/home')
      .then((response) => {
        if (response.status === 200) {
          let data = response.data;
          setData(data);
          setAssignments(data);
        } else {
          toastMessage("Something wrong!");
        }
      })
      .catch((error) => toastMessage("Fail to connect server!"));
  };

  const toastMessage = (message) => {
    setMessage(message);
    setShowToast(true);
  };

  const handleRowClick = (assignmentID) => {
    var assignment = assignments.find(
      (assignment) => assignment.id === assignmentID
    );
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
    } else if (key === SORT_BY.Category) {
      reverse = categoryASC ? -1 : 1;
      setCategoryASC(!categoryASC);
      list = assignments
        .slice()
        .sort((a, b) =>
          a.category > b.category
            ? 1 * reverse
            : b.category > a.category
              ? -1 * reverse
              : 0
        );
    } else if (key === SORT_BY.AssignedDate) {
      reverse = assignedDateASC ? -1 : 1;
      setAssignedDateASC(!assignedDateASC);
      list = assignments
        .slice()
        .sort((a, b) =>
          a.assignedDate > b.assignedDate
            ? 1 * reverse
            : b.assignedDate > a.assignedDate
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

  const handleAccept = () => {
    put(`/assignment/staff/${assignmentCode}?state=accept`)
      .then((res) => {
        setData(data.filter(e => {
          if (e.id === assignmentCode)
            e.state = res.data.state
          return e
        }))
        setAssignments(assignments.filter(e => {
          if (e.id === assignmentCode)
            e.state = res.data.state
          return e
        }))
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            setMessage('Logout and then login!')
          }
        } else {
          setMessage(error.response.data.errorCode)
        }
        setShowToast(true)
      }).finally(() => setShowModalAccept(false));
  }

  const handleDeclined = () => {
    put(`/assignment/staff/${assignmentCode}?state=declined`)
      .then((res) => {
        // setData(data.filter(e => e.id !== assignmentCode))
        // setAssignments(assignments.filter(e => e.id !== assignmentCode))

        const index = assignments.findIndex(item => item.id === assignmentCode);
        let newAssignments = assignments;
        let item = { ...newAssignments[index] };
        item.state = STATE.CANCELED_ASSIGN;
        newAssignments[index] = item;
        setAssignments(newAssignments);
        setData(newAssignments);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            setMessage('Logout and then login!')
          }
        } else {
          setMessage(error.response.data.errorCode)
        }
        setShowToast(true)
      }).finally(() => setShowModalDeclined(false));
  }

  const handleRequestForReturning = (assignmentId) => {
    post(`/request`, { assignmentId: assignmentId })
      .then((response) => {
        console.log(response);
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
        console.log(error);
      })
      .finally(() => setShowModalRequest(false));
  }

  const handleAcceptClick = (id) => {
    assignmentCode = id
    setShowModalAccept(true)
  }

  const handleDeclineClick = (id) => {
    assignmentCode = id
    setShowModalDeclined(true)
  }

  const onClickRequestForReturning = (id) => {
    assignmentCode = id;
    setShowModalRequest(true);
  };

  return (
    <div>
      <ModalTitle style={{ color: "#CF2338" }}>My Assignment</ModalTitle>
      <br />
      <Row>
        <Table responsive>
          <thead>
            <tr>
              <th>
                Asset Code
                <BsFillCaretDownFill
                  onClick={() => handleSort(SORT_BY.AssetCode)}
                />
              </th>
              <th>
                Asset Name
                <BsFillCaretDownFill
                  onClick={() => handleSort(SORT_BY.AssetName)}
                />
              </th>
              <th>
                Category
                <BsFillCaretDownFill
                  onClick={() => handleSort(SORT_BY.Category)}
                />
              </th>
              <th>
                Assigned Date
                <BsFillCaretDownFill
                  onClick={() => handleSort(SORT_BY.AssignedDate)}
                />
              </th>
              <th>
                State
                <BsFillCaretDownFill
                  onClick={() => handleSort(SORT_BY.State)}
                />
              </th>
              <th className="w-14"></th>
            </tr>
          </thead>
          <tbody>
            {assignments &&
              assignments
                .map((a) => (
                  <tr key={a.id}>
                    <td onClick={() => handleRowClick(a.id)}>{a.assetCode}</td>
                    <td onClick={() => handleRowClick(a.id)}>{a.assetName}</td>
                    <td onClick={() => handleRowClick(a.id)}>{a.category}</td>
                    <td onClick={() => handleRowClick(a.id)}>
                      {a.assignedDate}
                    </td>
                    <td onClick={() => handleRowClick(a.id)}>
                      {StateToLowCase[a.state]}
                    </td>
                    <td>
                      <div className="d-flex justify-content-evenly">
                        {a.state === STATE.WAITING_FOR_ACCEPTANCE ?
                          <>
                            <FontAwesomeIcon style={{ cursor: "pointer" }} color="red" size="lg" icon={faCheck} onClick={() => handleAcceptClick(a.id)} />
                            <FontAwesomeIcon style={{ cursor: "pointer" }} size="lg" icon={faTimes} onClick={() => handleDeclineClick(a.id)} />
                            <CgUndo id="undo-assignment" style={{ color: '#ccc' }} />
                          </>
                          :
                          <>
                            <FontAwesomeIcon color="#ccc" size="lg" icon={faCheck} />
                            <FontAwesomeIcon color="#ccc" size="lg" icon={faTimes} />
                            {a.state === STATE.ACCEPTED && !a.isCreatedRequest ?
                              <CgUndo id="undo-assignment" style={{ cursor: 'pointer' }} onClick={() => onClickRequestForReturning(a.id)} />
                              :
                              <CgUndo id="undo-assignment" style={{ color:'#ccc' }} />
                            }
                          </>
                        }
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </Table>
      </Row>
      <br />
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
      <Modal centered show={showModalAccept}>
        <Modal.Header>
          <Modal.Title style={{ color: '#dc3545' }}>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to accept this assignment?</Modal.Body>
        <Modal.Footer style={{ display: 'block', marginLeft: '32px' }}>
          <Button variant='danger' onClick={handleAccept}>
            Accept
          </Button>
          <Button variant='secondary' onClick={() => setShowModalAccept(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal centered show={showModalDeclined}>
        <Modal.Header>
          <Modal.Title style={{ color: '#dc3545' }}>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to decline this assignment?</Modal.Body>
        <Modal.Footer style={{ display: 'block', marginLeft: '32px' }}>
          <Button variant='danger' onClick={handleDeclined}>
            Decline
          </Button>
          <Button variant='secondary' onClick={() => setShowModalDeclined(false)}>
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
    </div>
  );
}
const SORT_BY = {
  id: "id",
  AssetCode: "AssetCode",
  AssetName: "AssetName",
  Category: "Category",
  AssignedDate: "AssignedDate",
  State: "State",
};
const STATE = {
  All: "All",
  ACCEPTED: "ACCEPTED",
  WAITING_FOR_ACCEPTANCE: "WAITING_FOR_ACCEPTANCE",
  CANCELED_ASSIGN: "CANCELED_ASSIGN",
  WAITING_FOR_RETURNING: "WAITING_FOR_RETURNING",
  COMPLETED: "COMPLETED"
};
const StateToLowCase = {
  ACCEPTED: "Accepted",
  WAITING_FOR_ACCEPTANCE: "Waiting for acceptance",
  CANCELED_ASSIGN: "Declined",
  WAITING_FOR_RETURNING: "Waiting for returning",
  COMPLETED: 'Completed'
};
