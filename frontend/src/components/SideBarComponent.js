import React, { useState } from 'react';
import './SideBarComponent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faAddressBook, faUserEdit, faPenNib } from '@fortawesome/free-solid-svg-icons';

export default function SideBar(props) {
  const [currentPage, setCurrentPage] = useState('messaging');

  return (
    <div className='sidebar'>
      <div className='sidebar-contents'>
        <button className={`sidebar-btn ${currentPage === "messaging" ? "active" : ""}`}>
          <FontAwesomeIcon icon={faComments} />
        </button>
        <button className={`sidebar-btn ${currentPage === "friends" ? "active" : ""}`}>
          <FontAwesomeIcon icon={faAddressBook} />
        </button>
        <button className={`sidebar-btn ${currentPage === "edit_user" ? "active" : ""}`}>
          <FontAwesomeIcon icon={faUserEdit} />
        </button>
        <button className={`sidebar-btn ${currentPage === "edit_adventures" ? "active" : ""}`}>
          <FontAwesomeIcon icon={faPenNib} />
        </button>
        <button className={`sidebar-btn ${currentPage === "looking_for_group" ? "active" : ""}`}>
          <span className="icon-d20_search"></span>
        </button>
      </div>
    </div>
  );
}