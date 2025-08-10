import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Navbar,
  FormControl,
  InputGroup,
  Image,
  Dropdown,
  Collapse,
  Button,
  Modal,
} from "react-bootstrap";
import {
  IoChevronDownOutline,
  IoCloseOutline,
} from "react-icons/io5";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { logoutHandler } from "../../utils/logout";
import log from "../../utils/logger";

const Header = ({ title }) => {
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const { getAdminProfile } = useAuth();
  const [admin, setAdmin] = useState();
  const [showModal, setShowModal] = useState(false);

  // const [liveBalances, setLiveBalances] = useState({
  //   TRC20: '0.0',
  //   BEP20: '0.0',
  //   POLYGON: '0.0',
  //   ERC20: '0.0',
  // });

  // Toggle search bar on mobile
  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };
  log("admin", admin)
  const fetchData = useCallback(async () => {
    try {
      const response = await getAdminProfile();
      if (response.success) {
        setAdmin(response.data);
      }
    } catch (error) {
      toastAlert("error", "Failed to fetch config");
      console.error(error);
    }
  }, []);

  useEffect(() => {
    // fetchData();
  }, []);

  // const memoizedAdmin = useMemo(() => admin, [admin?.id]);

  // useEffect(() => {
  //   if (!memoizedAdmin || !memoizedAdmin?.id) return;

  //   socket.emit('check-admin-live-balance', { adminId: memoizedAdmin?.id });

  //   const handleLiveBalance = (payload) => {
  //     log("payload", payload);
  //     if (payload?.balanceinfo) {
  //       setLiveBalances(payload.balanceinfo);
  //     }
  //   };

  //   socket.off('get-admin-live-balance', handleLiveBalance); // prevent duplicates
  //   socket.on('get-admin-live-balance', handleLiveBalance);

  //   return () => {
  //     socket.off('get-admin-live-balance', handleLiveBalance);
  //   };
  // }, [memoizedAdmin]);



  const handleLogout = async () => {
    try {
      logoutHandler()
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Navbar className="px-3 px-lg-4 py-3" expand="lg">
      <div className="d-flex justify-content-between align-items-center w-100">
        {/* Left side - Title */}
        <div className="d-flex align-items-center">
          {/* Sidebar toggle button is managed by Sidebar component */}
          <h2 className="h4 mb-0 fw-medium d-none d-sm-block title_block">
            {title}
          </h2>
          <h2 className="h5 mb-0 fw-medium d-block d-sm-none title_block">
            {title}
          </h2>
        </div>


        {/* Right side icons and profile */}
        <div className="d-flex align-items-center gap-1 gap-md-2">

          {/* <div className="d-flex flex-column text-end me-5">
            <small className="text-muted text-center">Live Balances</small>
            <div className="d-flex gap-2 flex-wrap small">
              {Object.entries(liveBalances).map(([key, value]) => (
                <span key={key} className="badge bg-light text-dark border">
                  {key}: {parseFloat(value).toFixed(6)}
                </span>
              ))}
            </div>
          </div> */}


          {/* User profile dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle
              as="div"
              style={{ cursor: "pointer" }}
              className="d-flex align-items-center"
              id="admin-dropdown"
            >
              <Image
                // src="https://i.pravatar.cc/40?img=1"
                // src={admin?.profile}
                src={admin?.profile || null}
                alt="User"
                roundedCircle
                width={32}
                height={32}
                className="me-1"
              />
              <IoChevronDownOutline className="ms-2 text-muted d-none d-md-block" />
            </Dropdown.Toggle>

            <Dropdown.Menu className="border-0 p-2">
              <Dropdown.ItemText>
                {admin?.username}
              </Dropdown.ItemText>
              <Dropdown.ItemText className="text-muted">
                {admin?.email}
              </Dropdown.ItemText>
              <Dropdown.Divider className="text-muted" />
              <Dropdown.Item onClick={() => navigate("/profile")}>
                Profile
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/site-setting")}>
                Settings
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/change-password")}>
                Change Password
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                onClick={() => setShowModal(true)}
                className="text-center fw-bold text-danger"
                style={{ transition: '0.3s' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#ffe5e5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Logout
              </Dropdown.Item>

            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Mobile search - Collapsible */}
      <Collapse in={showSearch} className="w-100 mt-3 d-lg-none">
        <div>
          <InputGroup>
            <InputGroup.Text className="bg-white border-end-0 pe-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="18"
                viewBox="0 0 19 18"
                fill="none"
              >
                <path
                  d="M16.3442 15.75L11.8442 11.25M13.3442 7.5C13.3442 10.3995 10.9937 12.75 8.09424 12.75C5.19474 12.75 2.84424 10.3995 2.84424 7.5C2.84424 4.60051 5.19474 2.25 8.09424 2.25C10.9937 2.25 13.3442 4.60051 13.3442 7.5Z"
                  stroke="#A1A1AA"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </InputGroup.Text>
            <FormControl
              placeholder="Type to search"
              className="border-start-0 shadow-none"
              autoFocus
            />
            <Button
              variant="outline-secondary"
              onClick={toggleSearch}
              aria-label="Close search"
            >
              <IoCloseOutline />
            </Button>
          </InputGroup>
        </div>
      </Collapse>

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
    </Navbar>
  );
};

export default Header;
