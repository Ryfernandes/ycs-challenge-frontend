import './Navbar.css';
import ycsLogo from '../assets/ycs-slash.png';

function Navbar() {
  const reloadPage = () => {
    window.location.reload();
  }

  return (
    <div className='navbar'>
      <div onClick={reloadPage} className='logo-container'>
        <img src={ycsLogo} className='ycs-logo'/>
      </div>
    </div>
  )
}

export default Navbar