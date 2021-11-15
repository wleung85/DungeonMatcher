import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import './HeaderComponent.css';

function HeaderUserButton(props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="header-user">
      <p>{props.user.username} { menuOpen ? 
        <FontAwesomeIcon icon={faCaretUp} /> : 
        <FontAwesomeIcon icon={faCaretDown} />
      }</p>
    </div>
  );
}

export default function Header(props) {
  return (
    <Container className="header" fluid>
      <img 
        className='header-logo'
        src='header_logo.png'
        alt='DungeonMatcher logo'/>
      {props.user && <HeaderUserButton user={props.user}/>}
    </Container>
  );
}