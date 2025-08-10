import React, { useState, useEffect, useContext } from "react";
import { Button, Modal, Nav, Image } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FaBars, FaBriefcaseMedical, FaTimes } from "react-icons/fa";
import "./Sidebar.css";
import { AuthContext } from "../../context/AuthContext";
import { PiGearBold } from "react-icons/pi";
import { BiWallet } from "react-icons/bi";
import { logoutHandler } from "../../utils/logout";
import { TfiReceipt } from "react-icons/tfi";
import logo from '../../assets/images/AKC Pay 1 (1).png'
import { FaUserDoctor } from "react-icons/fa6";


const Sidebar = () => {
  const { loading } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Check window width on mount and resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    {
      section: "Doctor Management",
      items: [
        {
          name: "Doctors",
          path: "/doctors",
          permissionPath: "userManagement.doctors",
          icon: (
            <FaUserDoctor />
          ),
          // badge: "NEW",
        }
      ],
    },
    {
      section: "Medicine Management",
      items: [
        {
          name: "Medicines",
          path: "/medicines",
          permissionPath: "userManagement.medicines",
          icon: (
            <FaBriefcaseMedical />
          ),
        },
      ],
    },
    {
      section: "Finance Management",
      items: [
        {
          name: "Manage Transactions",
          path: "/manage-transaction",
          permissionPath: "finance.payments",
          icon: (
            <TfiReceipt />
          ),
        },
        {
          name: "Payments Settings",
          path: "/payments",
          permissionPath: "finance.payments",
          icon: (
            <BiWallet />
          ),
        },
        {
          name: "Earnings",
          path: "/earnings",
          permissionPath: "finance.earnings",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
            >
              <path
                d="M14.375 7.49766V7.0625C14.375 5.10312 11.4195 3.625 7.5 3.625C3.58047 3.625 0.625 5.10312 0.625 7.0625V10.1875C0.625 11.8195 2.67578 13.1164 5.625 13.5047V13.9375C5.625 15.8969 8.58047 17.375 12.5 17.375C16.4195 17.375 19.375 15.8969 19.375 13.9375V10.8125C19.375 9.19531 17.3891 7.89687 14.375 7.49766ZM18.125 10.8125C18.125 11.8453 15.7195 13 12.5 13C12.2086 13 11.9195 12.9898 11.6344 12.9711C13.3195 12.357 14.375 11.3594 14.375 10.1875V8.76094C16.7086 9.10859 18.125 10.0523 18.125 10.8125ZM5.625 12.2383V10.3797C6.2467 10.4607 6.87304 10.5009 7.5 10.5C8.12696 10.5009 8.7533 10.4607 9.375 10.3797V12.2383C8.75422 12.33 8.12751 12.3757 7.5 12.375C6.87249 12.3757 6.24578 12.33 5.625 12.2383ZM13.125 9.08828V10.1875C13.125 10.843 12.1555 11.5469 10.625 11.9742V10.1484C11.6336 9.90391 12.4875 9.53984 13.125 9.08828ZM7.5 4.875C10.7195 4.875 13.125 6.02969 13.125 7.0625C13.125 8.09531 10.7195 9.25 7.5 9.25C4.28047 9.25 1.875 8.09531 1.875 7.0625C1.875 6.02969 4.28047 4.875 7.5 4.875ZM1.875 10.1875V9.08828C2.5125 9.53984 3.36641 9.90391 4.375 10.1484V11.9742C2.84453 11.5469 1.875 10.843 1.875 10.1875ZM6.875 13.9375V13.6117C7.08047 13.6195 7.28828 13.625 7.5 13.625C7.80312 13.625 8.09922 13.6148 8.38984 13.5977C8.7127 13.7132 9.04157 13.8113 9.375 13.8914V15.7242C7.84453 15.2969 6.875 14.593 6.875 13.9375ZM10.625 15.9883V14.125C11.2465 14.2085 11.8729 14.2503 12.5 14.25C13.127 14.2509 13.7533 14.2107 14.375 14.1297V15.9883C13.1316 16.1706 11.8684 16.1706 10.625 15.9883ZM15.625 15.7242V13.8984C16.6336 13.6539 17.4875 13.2898 18.125 12.8383V13.9375C18.125 14.593 17.1555 15.2969 15.625 15.7242Z"
                fill="black"
              />
            </svg>
          ),
        }
      ],
    },
  ];

  const applyActiveColor = (element, isActive) => {
    if (!React.isValidElement(element)) return element;

    const hasFill = "fill" in element.props;
    const hasStroke = "stroke" in element.props;

    const newProps = {};
    if (hasFill) {
      newProps.fill = isActive ? "#4390f4" : "currentColor";
    }
    if (hasStroke) {
      newProps.stroke = isActive ? "#4390f4" : "";
    }

    return React.cloneElement(
      element,
      newProps,
      element.props.children
        ? React.Children.map(element.props.children, (child) =>
          applyActiveColor(child, isActive)
        )
        : element.props.children
    );
  };

  const NavIcon = ({ icon, isActive }) => {
    return applyActiveColor(icon, isActive);
  };

  const handleLogout = async () => {
    try {
      logoutHandler();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle clicks outside sidebar to close it (only on mobile)
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebarElement = document.getElementById("sidebar");
      const hamburgerElement = document.querySelector(".hamburger-toggle");

      if (
        window.innerWidth < 1024 &&
        sidebarElement &&
        !sidebarElement.contains(event.target) &&
        hamburgerElement &&
        !hamburgerElement.contains(event.target) &&
        isSidebarOpen
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  if (loading) {
    return (
      <div className="sidebar-loading">
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }



  return (
    <>
      {/* Hamburger menu toggle button - always visible on small screens */}
      <button
        className={`hamburger-toggle ${isSidebarOpen ? "active" : ""}`}
        onClick={toggleSidebar}
        aria-label="Toggle navigation"
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar - visible based on isSidebarOpen state */}
      <div
        id="sidebar"
        className={`sidebar border-end ${isSidebarOpen ? "open" : "closed"}`}
      >
        <div className="d-flex align-items-center justify-content-center">
          {/* <h1 className="fs-2 fw-bold mb-0">AKC</h1> */}
          <Image
            src={logo}
            alt="User"
            style={{
              height: 'clamp(30px, 5vw, 40px)',
              width: 'auto',
            }}
            className="me-1"
          />
        </div>

        {/* <Nav className="flex-column"> */}
        <div className="d-flex flex-column h-100">
          <Nav className="flex-column flex-grow-1">
            <Nav.Item>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link py-2 px-3 d-flex align-items-center rounded gap-2  ${isActive ? "active " : "text-dark"
                  }`
                }
                end
              >
                {({ isActive }) => (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="19"
                      viewBox="0 0 18 19"
                      fill="none"
                    >
                      <path
                        d="M2.25 9.5L3.75 8M3.75 8L9 2.75L14.25 8M3.75 8V15.5C3.75 15.9142 4.08579 16.25 4.5 16.25H6.75M14.25 8L15.75 9.5M14.25 8V15.5C14.25 15.9142 13.9142 16.25 13.5 16.25H11.25M6.75 16.25C7.16421 16.25 7.5 15.9142 7.5 15.5V12.5C7.5 12.0858 7.83579 11.75 8.25 11.75H9.75C10.1642 11.75 10.5 12.0858 10.5 12.5V15.5C10.5 15.9142 10.8358 16.25 11.25 16.25M6.75 16.25H11.25"
                        stroke={isActive ? '#4390f4' : 'currentColor'}
                        strokeWidth={isActive ? "2" : "1.2"}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Dashboard
                  </>
                )}
              </NavLink>
            </Nav.Item>

            {navItems.map((section, index) => (
              <div key={index} className="mt-4 mb-3">
                <h6 className="px-3 text-uppercase text-muted small fw-semibold">
                  {section.section}
                </h6>
                {section.items.map((item, itemIndex) => (
                  <Nav.Item key={itemIndex}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `nav-link py-2 px-3 d-flex align-items-center rounded justify-content-between ${isActive ? "active" : "text-dark"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="d-flex align-items-center gap-3">
                            <NavIcon icon={item.icon} isActive={isActive} />
                            {item.name}
                          </div>
                          {(item.badge || item.count) && (
                            <span className="badge bg-primary rounded-pill text-white">
                              {item.badge || item.count}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </Nav.Item>
                ))}
              </div>
            ))}

            {/* <div className="mt-5"> */}
            <div className="mt-auto pb-3">
              <Nav.Item>
                <NavLink
                  to="/site-setting"
                  className={({ isActive }) =>
                    `nav-link py-2 px-3 d-flex align-items-center rounded gap-3 ${isActive ? "active" : "text-dark"
                    }`
                  }
                >
                  <PiGearBold />
                  Site Settings
                </NavLink>
              </Nav.Item>
              {/* <Nav.Item>
                <NavLink
                  to="/support-tickets"
                  className={({ isActive }) =>
                    `nav-link py-2 px-3 d-flex align-items-center rounded gap-3 ${isActive ? "active" : "text-dark"
                    }`
                  }
                >
                  <IoTicketOutline />
                  Support Tickets
                </NavLink>
              </Nav.Item>

              <Nav.Item>
                <NavLink
                  to="/FAQ's"
                  className={({ isActive }) =>
                    `nav-link py-2 px-3 d-flex align-items-center rounded gap-3 ${isActive ? "active" : "text-dark"
                    }`
                  }
                >
                  <GrNotes />
                  FAQ's
                </NavLink>
              </Nav.Item> */}

              <Nav.Item>
                <button
                  className="nav-link py-2 px-3 d-flex align-items-center rounded text-dark border-0 w-100 text-start gap-3"
                  onClick={() => setShowModal(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="19"
                    viewBox="0 0 18 19"
                    fill="none"
                  >
                    <path
                      d="M12.75 12.5L15.75 9.5M15.75 9.5L12.75 6.5M15.75 9.5L5.25 9.5M9.75 12.5V13.25C9.75 14.4926 8.74264 15.5 7.5 15.5H4.5C3.25736 15.5 2.25 14.4926 2.25 13.25V5.75C2.25 4.50736 3.25736 3.5 4.5 3.5H7.5C8.74264 3.5 9.75 4.50736 9.75 5.75V6.5"
                      stroke="black"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Logout
                </button>
              </Nav.Item>
            </div>
          </Nav>
        </div>
      </div>

      {/* Overlay when sidebar is open on mobile */}
      {isSidebarOpen && window.innerWidth < 1024 && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to logout?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setShowModal(false);
              handleLogout();
            }}
          >
            Logout
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default Sidebar;