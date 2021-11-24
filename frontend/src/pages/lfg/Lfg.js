import React from 'react';
import './lfg.css';
import Sidebar from '../../components/SideBarComponent';
import LfgSecondarySideBar from './LfgSecondarySideBar';

export default function Lfg() {
  return (
    <div className="lfg">
      <Sidebar />
      <LfgSecondarySideBar />
    </div>
  )
}