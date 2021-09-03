import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap'
import { Link, useHistory, withRouter } from 'react-router-dom';
import { get, put } from '../../../../httpHelper';
import './edituser.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import '../CreateUser/createuser.css'
import { FaCalendarAlt } from 'react-icons/fa'

function EditUser(props) {
    let history = useHistory();

    const [roles, setRoles] = useState([]);

    const [inputs, setInputs] = useState({
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        type: ''
    });
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [joinedDate, setJoinedDate] = useState('')
    const [isOpenDatePickerDob, setIsOpenDatePickerDob] = useState(false);
    const [isOpenDatePickerJd, setIsOpenDatePickerJd] = useState(false);
    const [validStateList, setValidStateList] = useState({
        isAgeValid: true,
        isJoinedDateValid: true,
        isJoinedAfterDOB: true
    });

    const [messageErrors, setMessageErrors] = useState({
        userUnder18: '',
        joinedAtTheWeekend: '',
        joindDateBeforeDOB: '',
        emailInvalid: ''
    });

    const [isSaving, setIsSaving] = useState(false);
    useEffect(() => {
        fetchRoles();
        fetchUser();
    }, [])

    const fetchRoles = () => {
        get('/role')
            .then((res) => {
                setRoles(res.data);
                // console.log(res.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }
    const staffCode = props.match.params.staffCode;
    const fetchUser = () => {
        get(`/users/${staffCode}`)
            .then((res) => {
                let dOB = res.data.dateOfBirth.split("/").reverse().join("-")
                let joinedDate = res.data.joinedDate.split("/").reverse().join("-")
                // console.log(dOB + "  " + joinedDate);
                let object = {
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                    email: res.data.email,
                    // dateOfBirth: dOB,
                    gender: res.data.gender,
                    // joinedDate: joinedDate,
                    type: res.data.type
                }
                setInputs(object)
                setDateOfBirth(dOB)
                setJoinedDate(joinedDate)
                // console.log(res.data);
            })
            .catch((error) => {
                console.log(error)
                history.push({
                    pathname: '/manage_user',
                });
            })
    }
    const handleOnChange = (e) => {
        setInputs(prevState => ({
            ...prevState, [e.target.name]: e.target.value
        }));
    }

    const handleValidation = () => {
        let isValid = true;
        const regexEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        if (!regexEmail.test(inputs.email)) {
            setValidStateList(prevState => ({
                ...prevState, isEmail: false
            }));

            setMessageErrors(prevState => ({
                ...prevState, emailInvalid: 'This field must be email. Please input email'
            }));

            isValid = false;
        } else {
            setValidStateList(prevState => ({
                ...prevState, isEmail: true
            }));

            setMessageErrors(prevState => ({
                ...prevState, emailInvalid: ''
            }));
        }

        if (calcAge(joinedDate, dateOfBirth) < 18) {
            setValidStateList(prevState => ({
                ...prevState, isAgeValid: false
            }));

            setMessageErrors(prevState => ({
                ...prevState, userUnder18: 'User is under 18. Please select a different date'
            }));

            isValid = false;
        } else {
            setValidStateList(prevState => ({
                ...prevState, isAgeValid: true
            }));

            setMessageErrors(prevState => ({
                ...prevState, userUnder18: ''
            }));
        }

        if (isTheWeekend(joinedDate)) {
            setValidStateList(prevState => ({
                ...prevState, isJoinedDateValid: false
            }));

            setMessageErrors(prevState => ({
                ...prevState, joinedAtTheWeekend: 'Joined date is Saturday or Sunday. Please select a different date'
            }));

            isValid = false;
        } else {
            setValidStateList(prevState => ({
                ...prevState, isJoinedDateValid: true
            }));

            setMessageErrors(prevState => ({
                ...prevState, joinedAtTheWeekend: ''
            }));
        }

        if (new Date(joinedDate) < new Date(dateOfBirth)) {
            setValidStateList(prevState => ({
                ...prevState, isJoinedAfterDOB: false
            }));

            setMessageErrors(prevState => ({
                ...prevState, joindDateBeforeDOB: 'Joined date is not later than Date of Birth. Please select a different date'
            }));

            isValid = false;
        } else {
            setValidStateList(prevState => ({
                ...prevState, isJoinedAfterDOB: true
            }));

            setMessageErrors(prevState => ({
                ...prevState, joindDateBeforeDOB: ''
            }));
        }
        return isValid;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!handleValidation()) {
            return;
        }

        // yyyy-mm-dd -> dd/mm/yyyy
        const inputDates = {
            dateOfBirth: dateOfBirth.split("-").reverse().join("/"),
            joinedDate: joinedDate.split("-").reverse().join("/")
        }

        const formData = {
            ...inputs, ...inputDates
        }
        // console.log(formData);
        setIsSaving(true);
        put(`/users/${staffCode}`, formData)
            .then((res) => {
                console.log(res.data);
                history.push({
                    pathname: '/manage_user',
                    state: {
                        staffCode: res.data.staffCode
                    }
                });
            })
            .catch((error) => {
                setIsSaving(false);
                if (error.response.status === 400) {
                    setValidStateList(prevState => ({
                        ...prevState, isEmail: false
                    }));

                    setMessageErrors(prevState => ({
                        ...prevState, emailInvalid: 'Email already exists!'
                    }));
                }
            });
    }

    const calcAge = (joinedDate, dateOfBirth) => {
        return Math.floor((new Date(joinedDate) - new Date(dateOfBirth)) / 3.15576e+10);
    }

    const isTheWeekend = (joinedDate) => {
        return (new Date(joinedDate).getDay() === 6 || new Date(joinedDate).getDay() === 0);
    }
    const saveButton = () => {
        if (isSaving)
            return <Button variant="danger" type="submit" disabled><Spinner animation="border" size="sm" variant="light" />Save</Button>
        else if (Object.values(inputs).every(input => input != ''))
            return <Button variant="danger" type="submit">Save</Button>
        return <Button variant="danger" type="submit" disabled>Save</Button>;
    }

    const openDatePickerDob = () => {
        setIsOpenDatePickerDob(!isOpenDatePickerDob);
    }

    const openDatePickerJd = () => {
        setIsOpenDatePickerJd(!isOpenDatePickerJd);
    }

    return (
        <>
            <h5 className="mb-4" style={{ color: "#CF2338" }}>Edit user</h5>
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-3" controlId="firstName">
                    <Form.Label column sm={2}>
                        First Name
                    </Form.Label>
                    <Col xs={12} sm={5}>
                        <Form.Control name="firstName" type="text" required maxLength={50} value={inputs.firstName} disabled />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="lastName">
                    <Form.Label column sm={2}>
                        Last Name
                    </Form.Label>
                    <Col xs={12} sm={5}>
                        <Form.Control name="lastName" type="text" required maxLength={50} value={inputs.lastName} disabled />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" required controlId="dateOfBirth">
                    <Form.Label column sm={2}>
                        Date of Birth
                    </Form.Label>
                    <Col xs={12} sm={5}>
                        <div className="datepicker">
                            <DatePicker className="form-control"
                                dateFormat="dd/MM/yyyy" showMonthDropdown showYearDropdown scrollableYearDropdown yearDropdownItemNumber={50}
                                onKeyDown={(e) => e.preventDefault()}
                                selected={dateOfBirth && new Date(dateOfBirth)}
                                onChange={(date) => setDateOfBirth(moment(date).format('YYYY-MM-DD'))}
                                onClickOutside={openDatePickerDob}
                                onSelect={openDatePickerDob}
                                onFocus={openDatePickerDob}
                                open={isOpenDatePickerDob}
                            />
                            <FaCalendarAlt className="icon-date" onClick={openDatePickerDob} />
                        </div>
                        {!validStateList.isAgeValid &&
                            < Form.Control.Feedback className="d-block" type="invalid">
                                {messageErrors.userUnder18}
                            </Form.Control.Feedback>
                        }
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="email">
                    <Form.Label column sm={2}>
                        Email
                    </Form.Label>
                    <Col xs={12} sm={5}>
                        <Form.Control name="email" type="text" required maxLength={50} value={inputs.email} onChange={handleOnChange} />
                        {!validStateList.isEmail &&
                            < Form.Control.Feedback className="d-block" type="invalid">
                                {messageErrors.emailInvalid}
                            </Form.Control.Feedback>
                        }
                    </Col>
                </Form.Group>
                <fieldset>
                    <Form.Group as={Row} className="mb-3 align-items-center">
                        <Form.Label as="legend" column sm={2}>
                            Gender
                        </Form.Label>
                        <Col xs={2}>
                            <Form.Check
                                type="radio" label="Female" name="gender" id="female" required value="Female" onChange={handleOnChange} checked={inputs.gender === "Female"}
                            />
                        </Col>
                        <Col xs={2}>
                            <Form.Check type="radio" label="Male" name="gender" id="male" required value="Male" onChange={handleOnChange} checked={inputs.gender === "Male"}
                            />
                        </Col>
                    </Form.Group>
                </fieldset>
                <Form.Group as={Row} className="mb-3" controlId="joinedDate">
                    <Form.Label column sm={2}>
                        Joined Date
                    </Form.Label>
                    <Col xs={12} sm={5}>
                    <div className="datepicker">
                            <DatePicker className="form-control"
                                dateFormat="dd/MM/yyyy" showMonthDropdown showYearDropdown scrollableYearDropdown yearDropdownItemNumber={50}
                                onKeyDown={(e) => e.preventDefault()}
                                selected={joinedDate && new Date(joinedDate)}
                                onChange={(date) => setJoinedDate(moment(date).format('YYYY-MM-DD'))}
                                onClickOutside={openDatePickerJd}
                                onSelect={openDatePickerJd}
                                onFocus={openDatePickerJd}
                                open={isOpenDatePickerJd}
                            />
                            <FaCalendarAlt className="icon-date" onClick={openDatePickerJd} />
                        </div>
                        {(!validStateList.isJoinedDateValid &&
                            < Form.Control.Feedback className="d-block" type="invalid">
                                {messageErrors.joinedAtTheWeekend}
                            </Form.Control.Feedback>)
                            ||
                            (!validStateList.isJoinedAfterDOB &&
                                < Form.Control.Feedback className="d-block" type="invalid">
                                    {messageErrors.joindDateBeforeDOB}
                                </Form.Control.Feedback>)
                        }
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="id">
                    <Form.Label column sm={2}>Type</Form.Label>
                    <Col xs={12} sm={5}>
                        <Form.Select className="select" name="type" type="text" required as="select" aria-label="Default select example" onChange={handleOnChange} >
                            {roles.map((role) =>
                                <option key={role.id}
                                    value={role.name}
                                    selected={role.name === inputs.type}
                                >
                                    {ROLEtoLowcase[role.name]}
                                </option>
                            )}
                        </Form.Select>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Col sm={{ span: 10, offset: 4 }}>
                        {saveButton()}
                        <Link className="btn btn-outline-secondary" style={{ marginLeft: "40px" }} to="/manage_user">Cancel</Link>
                    </Col>
                </Form.Group>
            </Form>
        </>
    )
}
export default withRouter(EditUser);
const ROLEtoLowcase = { ALL: 'All', ROLE_ADMIN: 'Admin', ROLE_STAFF: 'Staff' }
