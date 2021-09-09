import React, { useEffect, useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  FormGroup,
  Label,
  Col,
} from 'reactstrap';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';

import './home.css';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import Menu from '../Menu/index';
import authService from '../../services/auth.service';
import User from '../Board-admin/component/User'
import EditUser from '../Board-admin/component/Edit_User'
import ManagerAsset from '../Board-admin/component/Manager-Asset/ManagerAsset'
import ManagerAssignment from '../Board-admin/component/Manager-Assignment/ManagerAssignment'
import CreateAsset from "../Board-admin/component/CreateAsset";
import CreateUser from '../Board-admin/component/CreateUser'
import EditAsset from '../Board-admin/component/Edit_Asset'
import CreateAssignment from '../Board-admin/component/CreateAssignment'
import EditAssignment from '../Board-admin/component/EditAssignmnet'

import UserAssignment from '../user/home'

import { EndPointRedirect } from '../../EndPointRedirect';

import ChangePassword from '../user/changepassword'
import Request from '../Board-admin/component/Request';
import Report from '../Board-admin/component/Report';
import { get } from '../../httpHelper';
import RequestForAssigning from '../Board-admin/component/RequestForAssigning';
import RequestAssignUser from '../user/RequestAssignUser';
import CreateRequestAssign from '../user/CreateRequestAssign';

const Home = (props) => {
  const history = useHistory();
  const user = authService.getCurrentUser() ? authService.getCurrentUser() : ''
  const { location } = history;
  const [isOpen, setIsOpen] = useState(false);
  const [navbarName, setnavbarName] = useState('');
  const [modal, setModal] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const toggleModal = () => setModal(!modal);

  const [modalpw, setModalpw] = useState(false);
  const toggleModalpw = () => setModalpw(!modalpw);

  const [modalProfile, setModalProfile] = useState(false);
  const toggleModalProfile = () => setModalProfile(!modalProfile);
  const [profile, setProfile] = useState();

  const handleShowProfile = () => {
    get('/users/profile')
      .then((response) => {
        setProfile(response.data);
        toggleModalProfile();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleLogout() {
    authService.logout();
    history.push('/login');
  }

  const tableTab = (index) => {
    switch (index) {
      // HOME
      case 1:
        return setnavbarName('Home');
      // Manage User
      case 2:
        return setnavbarName('Manage User');
      //Manage Asset
      case 3:
        return setnavbarName('Manage Asset');
      //Manage Assignment
      case 4:
        return setnavbarName('Manage Assignment');
      //Request for Returning
      case 5:
        return setnavbarName('Request for Returning');
      //Report
      case 6:
        return setnavbarName('Report');
      case 7:
        return setnavbarName('Request for Assigning');
      default:
        console.error('Some thing wrong!!!');
    }
  };

  useEffect(() => {
    EndPointRedirect();
  }, []);

  let path
  if (location.pathname.split('/')[1] === "edit-user")
    path = navbarName + " > Edit User";
  else if (location.pathname.split('/')[1] === "edit-asset")
    path = navbarName + " > Edit Asset"
  else if (location.pathname.split('/')[1] === "create-asset")
    path = navbarName + " > Create Asset"
  else if (location.pathname.split('/')[1] === "create-user")
    path = navbarName + " > Create User"
  else if (location.pathname.split('/')[1] === "create-assignment")
    path = navbarName + " > Create New Assignment"
  else if (location.pathname.split('/')[1] === "edit-assignment")
    path = navbarName + " > Edit Assignment"
  else if (location.pathname.split('/')[1] === "/create-request-assign")
    path = navbarName + " > Create request for assigning"
  else path = navbarName;

  return (
    <div className="Home">
      <Navbar className="navbar-expand __home_nav">
        <NavbarBrand className="mr-auto" id="Online_Asset_Management_Home">{path}</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar className='justify-content-end'>
          <Nav className='mr-auto' navbar>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret id="nav-username">
                {user.username}
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem onClick={handleShowProfile}>Profile</DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={toggleModalpw}>Change password</DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={toggleModal}>Logout</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>

      <Modal centered isOpen={modalProfile} toggle={toggleModalProfile}>
        <ModalHeader className="modal-header-logout" toggle={toggleModalProfile}>Profile</ModalHeader>
        <ModalBody>
          <FormGroup row>
            <Label sm={4}>Staff Code</Label>
            <Col sm={8}>
              <Input type="text" plaintext readOnly value={profile && profile.staffCode} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={4}>Full Name</Label>
            <Col sm={8}>
              <Input type="text" plaintext readOnly value={profile && profile.fullName} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={4}>Username</Label>
            <Col sm={8}>
              <Input type="text" plaintext readOnly value={profile && profile.username} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={4}>Date of Birth</Label>
            <Col sm={8}>
              <Input type="text" plaintext readOnly value={profile && profile.dateOfBirth} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={4}>Email</Label>
            <Col sm={8}>
              <Input type="text" plaintext readOnly value={profile && profile.email} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={4}>Gender</Label>
            <Col sm={8}>
              <Input type="text" plaintext readOnly value={profile && profile.gender} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={4}>Joined Date</Label>
            <Col sm={8}>
              <Input type="text" plaintext readOnly value={profile && profile.joinedDate} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={4}>Type</Label>
            <Col sm={8}>
              <Input type="text" plaintext readOnly value={profile && ROLEtoLowcase[profile.type]} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={4}>Location</Label>
            <Col sm={8}>
              <Input type="text" plaintext readOnly value={profile && profile.location} />
            </Col>
          </FormGroup>
        </ModalBody>
      </Modal>

      {/* Change password here */}
      <Modal className='changepass-modal' centered isOpen={modalpw} toggle={toggleModalpw}>
        <ModalHeader style={{ backgroundColor: '#d8d8d8' }, { border: 'solid 2px' }}>
          <p style={{ color: '#CF2338' }}>Change Password</p>
        </ModalHeader>
        <ModalBody style={{ border: 'solid 2px' }}>
          <ChangePassword isOpenModel={setModalpw} />
        </ModalBody>
      </Modal>


      <Modal style={{ width: '300px' }} isOpen={modal} toggle={toggleModal}>
        <ModalHeader className="modal-header-logout" >Are you sure?</ModalHeader>
        <ModalBody className="modal-body-logout">
          <p>Do you want to log out?</p>
          <Button color='danger' onClick={handleLogout}>
            Logout
          </Button>{' '}
          <Button className="btn-cancel-logout" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalBody>
      </Modal>
      <div className='__home-body'>
        <div className='__menu-model'>
          <Menu tableTab={tableTab} />
        </div>
        <div className='__table-model'>
          <Switch>
            <Route path='/home'>
              <UserAssignment />
            </Route>
            <Route path='/manage_user'>
              <User />
            </Route>
            <Route path="/edit-user/:staffCode" render={() => {
              if (user.role === "ROLE_ADMIN") return <EditUser />
            }}>
            </Route>
            <Route path="/manage_asset">
              <ManagerAsset />
            </Route>
            <Route path="/manage_assignment">
              <ManagerAssignment />
            </Route>
            <Route path='/create-user'>
              <CreateUser />
            </Route>
            <Route path='/create-asset'>
              <CreateAsset />
            </Route>
            <Route path="/edit-asset/:assetCode" render={() => {
              if (user.role === "ROLE_ADMIN") return <EditAsset />
            }} />
            <Route path="/create-assignment" render={() => {
              if (user.role === "ROLE_ADMIN") return <CreateAssignment />
            }} />
            <Route path="/edit-assignment/:assignmentId" render={() => {
              if (user.role === "ROLE_ADMIN") return <EditAssignment />
            }} />
            <Route path="/request_return" render={() => {
              if (user.role === "ROLE_ADMIN") return <Request />
              else return <Redirect to="/home" />
            }} />
            <Route path="/report" render={() => {
              if (user.role === "ROLE_ADMIN") return <Report />
              else return <Redirect to="/home" />
            }} />
            <Route path="/request_assign" render={() => {
              if (user.role === "ROLE_ADMIN") return <RequestForAssigning />
              else if (user.role === "ROLE_STAFF") return <RequestAssignUser />
              else return <Redirect to="/home" />
            }} />
            <Route path="/create-request-assign" render={() => {
              if (user.role === "ROLE_STAFF") return <CreateRequestAssign />
              else return <Redirect to="/home" />
            }} />
          </Switch>
        </div>
      </div>
    </div>
  );
};
export default Home;

const ROLEtoLowcase = { ALL: 'All', ROLE_ADMIN: 'Admin', ROLE_STAFF: 'Staff' }