import React, { useState, useEffect } from 'react';
import logo from './images/logo.png';
import lockIcon from './images/lock.jpg';
import { callApi, setSession } from './main';
import eyeOpen from './images/openeye.png';
import eyeClosed from './images/closedeye.jpg';

const popupwindowstyle = {
  width: '300px',
  height: '450px',
  background: 'linear-gradient(135deg, #636B2F, #847C3D)',
  borderRadius: '8px',
  boxShadow: '0px 0px 20px ',
  overflow: 'hidden',
  position: 'relative',
};

const aboutpopupwindowstyle = {
  width: '500px',
  height: '230px',
  background: 'linear-gradient(135deg,  #636B2F, #847C3D)',
  borderRadius: '10px',
  boxShadow: '0px 0px 20px rgba(255, 255, 255, 1)' ,
  overflow: 'hidden',
  position: 'relative',
};

const contactpopupwindowstyle = {
  width: '700px',
  height: '500px',
  background: 'linear-gradient(135deg, #636B2F, #847C3D)',
  borderRadius: '8px',
  boxShadow: '0px 0px 20px rgba(255, 255, 255, 1)', 
  overflow: 'hidden',
  position: 'relative',
};

const logostyle = {
  width: '75px',
  height: '75px',
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  top: '20px',
};

const logodivstyle = {
  height: '100px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const space = {
  height: '10px',
};

const eyeicon= {
  width: '18px',
  height: '17px',
  border: 'none',
  outline: 'none',
  background: 'white',
  position: 'absolute',
  right: '22px',
  top: '46%',
  transform: 'translateY(-50%)'
};

function Login() {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isAboutUsPopupVisible, setAboutUsPopupVisible] = useState(false);
  const [isContactUsPopupVisible, setContactUsPopupVisible] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (isPopupVisible && !document.getElementById('popupwindow').contains(event.target)) {
        setPopupVisible(false);
        
      }
      if (isAboutUsPopupVisible && !document.getElementById('aboutUsPopupWindow').contains(event.target)) {
        setAboutUsPopupVisible(false);
      }
      if (isContactUsPopupVisible && !document.getElementById('contactUsPopupWindow').contains(event.target)) {
        setContactUsPopupVisible(false);
      }
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [isPopupVisible, isAboutUsPopupVisible, isContactUsPopupVisible]);

  const handleLoginClick = () => {
    setPopupVisible(true);
    setLoginError(false);
  };

  const handleAboutUsClick = () => {
    setAboutUsPopupVisible(true);
  };

  const handleContactUsClick = () => {
    setContactUsPopupVisible(true);
  };

  const handleLogin = async () => {
    const username = document.getElementById('T1').value;
    const password = document.getElementById('T2').value;
    const adminUsername = 'admin';
    const adminPassword = 'admin123';
    if (username === adminUsername && password === adminPassword) {
      setSession('aid', adminUsername, (24 * 60));
      window.location.href = '/adminhome';
      return;
    } else {
      let userType;

      if (username.length === 11) {
        userType = 'student';
      } else if (username.length < 11) {
        userType = 'counsellor';
      } else {
        console.error('Invalid username format');
        return;
      }

      try {
        let bodyData;

        if (userType === 'student') {
          bodyData = { regNo: username, pass: password };
        } else if (userType === 'counsellor') {
          bodyData = { counselorId: username, cpass: password };
        }

        callApi(
          'POST',
          `http://localhost:5000/login/${userType}`,
          JSON.stringify(bodyData),
          function (response) {
            const data = JSON.parse(response);
            if (data.success) {
              if (userType === 'student') {
                setSession('sid', username, (24 * 60));
                window.location.href = '/studenthome';
              } else if (userType === 'counsellor') {
                setSession('cid', username, (24 * 60));
                window.location.href = '/counsellorhome';
              }
            } else {
              setLoginError(true);
            }
          },
          function (error) {
            setLoginError(true);
          }
        );
      } catch (error) {
        console.error('Error during login:', error);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='full-height'>
      <div id='header' className='loginheader'>
        <div style={{ float: 'left', paddingLeft: '10px' }}> SRM University</div>
        <div className='btn1' style={{ textAlign: 'center', marginRight: '730px' }} onClick={handleLoginClick}>
          <span>Login</span>
          <img src={lockIcon} alt='' style={{ marginLeft: '1px', height: '14px' }} />
        </div>
        <div class='btn2' style={{ float: 'right', paddingRight: '150px', marginTop: '-35px' }} onClick={handleAboutUsClick}>
          About Us
        </div>
        <div class='btn2' style={{ float: 'right', paddingRight: '30px', marginTop: '-35px' }} onClick={handleContactUsClick}>
          Contact Us
        </div>
      </div>
      <div id='content' className='logincontent'>
        {isPopupVisible && (
          <div id='popup' className='popup'>
            <div id='popupwindow' className='popupwindow' style={popupwindowstyle}>
              <div className='loginstyle1'>Login</div>
              <div className='loginstyle2'>
                <div style={logodivstyle}>
                  <img src={logo} alt='' style={logostyle} />
                </div>
                <div>Username*</div>
                <div>
                  <input type='text' id='T1' className='txtbox' />
                </div>
                <div style={space}></div>
                <div>Password*</div>
                <div>
                  <input type={showPassword ? 'text' : 'password'} id='T2' className='txtbox' style={{ paddingRight: '40px' }} />
                  <img style={eyeicon} onClick={togglePasswordVisibility} src={showPassword ? eyeClosed : eyeOpen} alt={showPassword ? 'Hide' : 'Show'} />
                </div>
                <div style={space}></div>
                {loginError && (
                  <div style={{ color: 'red', textAlign: 'center' }}>
                    Incorrect username or password.
                  </div>
                )}
                <div style={space}></div>
                <button className='btn' onClick={handleLogin}>Sign In</button>
                <div style={space}></div>
                <label className='linklabel'>Forgot Password?</label>
              </div>
            </div>
          </div>
        )}
        {isAboutUsPopupVisible && (
          <div id='aboutUsPopup' className='popup'>
            <div id='aboutUsPopupWindow' className='aboutpopupwindow' style={aboutpopupwindowstyle}>
              <div className='loginstyle1' style={{ textAlign: 'center' }}>About Us</div>
              <div className='loginstyle4'>
              The SRM Trust established SRM University AP in the year 2017 with its official address at Neerukonda, Mangalagiri Mandal, Guntur District, Andhra Pradesh – 522240.
              The university started its academic journey in the year 2017-18 as part of the SRM Group of Institutions, with a vision to provide world-class education, foster research, and drive innovation in various fields of engineering, sciences, management, and liberal arts.The university has rapidly grown, gaining recognition for its cutting-edge programs in engineering, sciences, management, and liberal arts.

              SRM University AP continues to build a reputation as a premier institution, fostering research-driven education, industry collaborations, and global exposure for its students.
              </div>
            </div>
          </div>
        )}
        {isContactUsPopupVisible && (
          <div id='contactUsPopup' className='popup'>
            <div id='contactUsPopupWindow' className='contactpopupwindow' style={contactpopupwindowstyle}>
              <div className='loginstyle1' style={{ textAlign: 'center' }}>Contact Us</div>
              <div className='loginstyle3'>
                <p><strong>Postal Address:</strong></p>
                <div className='contact-columns'>
                  <div className='column' style={{ flexBasis: '50%' }}>
                    <div className='contact-row'>
                      <p><strong>Official Communication:</strong></p>
                      <p>SRM University-AP, Neerukonda, Mangalagiri Mandal, Guntur District, Mangalagiri, Andhra Pradesh 522240. </p>
                    </div>
                    <div className='contact-row'>
                      <p><strong>Administrative Office (Vijayawada):</strong></p>
                      <p>Phone: 0866 242 9299</p>
                    </div>
                    <div className='contact-row'>
                      <p><strong>Campus (Guntur):</strong></p>
                      <p>Phone: +91-863-2343000 </p>
                    </div>
                  </div>
                  <div className='column-divider'></div>
                  <div className='column' style={{ flexBasis: '50%' }}>
                    <div className='contact-row'>
                      <p><strong>Campus:</strong></p>
                      <p>SRM University- AP, Neerukonda, Mangalagiri Mandal, Guntur District, Andhra Pradesh-522240</p>
                    </div>
                    <div className='contact-row'>
    <p><strong>Email:</strong></p>
    <p>admissions@srmap.edu.in</p>
  </div>
  <div className='contact-row'>
    <p><strong>Website:</strong></p>
    <p><a href="https://www.srmap.edu.in" target="_blank" rel="noopener noreferrer">www.srmap.edu.in</a></p>
  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div id='footer' className='loginfooter'>
        © Copyright 2025 by SRM University. All Rights Reserved
      </div>
    </div>
  );
}

export default Login;
