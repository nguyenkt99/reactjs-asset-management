import React, { useState } from "react";
import { ListGroup, ListGroupItem } from 'reactstrap';
import "./Menu.css";
import logo from '../../assets/Logo_lk@2x.png'
import authService from "../../services/auth.service";
import { Link } from "react-router-dom";

const Menu = ({ tableTab }) => {
  const [selected, setSelected] = useState(null);
  const user = authService.getCurrentUser() ? authService.getCurrentUser() : ''
  function setSelectedItem(index) {
    setSelected(index)
    tableTab(index)
    localStorage.setItem("selected", index)
  }

  if (selected === null) {
    const index = localStorage.getItem('selected') ? parseInt(localStorage.getItem('selected')) : 1
    setSelectedItem(index)
  }

  return (
    <div className="menu-controller">
      <img
        src={logo}
        className="MenuImage"
      />
      <h3 className="MenuTitles">Online Asset Management</h3>
      <ListGroup
      >
        <Link to='/home' className="non-text-decoration">
          <ListGroupItem action onClick={() => setSelectedItem(1)} active={selected === 1}>Home</ListGroupItem>
        </Link>
        {user.role === 'ROLE_STAFF' &&
          <Link to='/request_assign' className="non-text-decoration">
            <ListGroupItem action onClick={() => setSelectedItem(8)} active={selected === 8}>Request for Assigning</ListGroupItem>
          </Link>
        }
        {
          user.role === 'ROLE_ADMIN' ?
            <>
              <Link to='/manage_user' className="non-text-decoration">
                <ListGroupItem action onClick={() => setSelectedItem(2)} active={selected === 2}>Manage User</ListGroupItem>
              </Link>
              <Link to='/manage_asset' className="non-text-decoration">
                <ListGroupItem action onClick={() => setSelectedItem(3)} active={selected === 3}>Manage Asset</ListGroupItem>
              </Link>
              <Link to='/manage_assignment' className="non-text-decoration">
                <ListGroupItem action onClick={() => setSelectedItem(4)} active={selected === 4}>Manage Assignment</ListGroupItem>
              </Link>
              <Link to='/request_return' className="non-text-decoration">
                <ListGroupItem action onClick={() => setSelectedItem(5)} active={selected === 5}>Request for Returning</ListGroupItem>
              </Link>
              <Link to='/report' className="non-text-decoration">
                <ListGroupItem action onClick={() => setSelectedItem(6)} active={selected === 6}>Report</ListGroupItem>
              </Link>
              <Link to='/request_assign' className="non-text-decoration">
                <ListGroupItem action onClick={() => setSelectedItem(7)} active={selected === 7}>Request for Assigning</ListGroupItem>
              </Link>
            </>
            :
            <></>
        }
      </ListGroup>
    </div>
  );
}

export default Menu;