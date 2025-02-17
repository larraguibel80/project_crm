import React, { useState } from 'react';
import { FaUser, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { ListGroup } from 'react-bootstrap';

const Sidebar = () => {
  const [openSection, setOpenSection] = useState(null);
  const toggleSection = (section) =>
    setOpenSection(openSection === section ? null : section);

  return (
    <div style={{
      width: '250px',
      backgroundColor: '#f8f9fa',
      borderRight: '1px solid #dee2e6',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed', // Fix the sidebar position
      top: '60px', // Adjust to be below the navbar (example height)
      left: 0, // Align to the left
      height: 'calc(100vh - 60px - 60px)', // Full viewport height minus navbar and footer height (example footer height: 60px)
      zIndex: 900, // Ensure it's above main content but below navbar
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Optional shadow for better visibility
      justifyContent: 'space-between' // Ensure footer stays at the bottom
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#6f42c1',
        color: '#fff',
        padding: '1rem',
        textAlign: 'center'
      }}>
        Dashboard
      </div>
      
      {/* Navigation */}
      <div style={{ padding: '0.5rem', flexGrow: 1, overflowY: 'auto' }}>
        <div style={{ marginBottom: '1rem' }}>
          <div onClick={() => toggleSection('admin')} style={{
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            Admin {openSection === 'admin' ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {openSection === 'admin' && (
            <ListGroup variant="flush" className="mt-2">
              <ListGroup.Item action style={{ padding: '0.5rem 1rem' }}>
                Lists
              </ListGroup.Item>
              <ListGroup.Item action style={{ padding: '0.5rem 1rem' }}>
                Users
              </ListGroup.Item>
            </ListGroup>
          )}
        </div>
        <div>
          <div onClick={() => toggleSection('kund')} style={{
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            Kundmedarbetare {openSection === 'kund' ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {openSection === 'kund' && (
            <ListGroup variant="flush" className="mt-2">
              <ListGroup.Item action style={{ padding: '0.5rem 1rem' }}>
                Client
              </ListGroup.Item>
            </ListGroup>
          )}
        </div>
      </div>
      
      {/* Footer/User Info */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid rgb(17, 86, 154)',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#6f42c1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <FaUser style={{ color: '#fff' }} />
        </div>
        <span style={{ marginLeft: '0.5rem' }}>Admin/Kundmedarbetare</span>
      </div>
    </div>
  );
};

export default Sidebar;