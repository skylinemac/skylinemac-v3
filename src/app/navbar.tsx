import Image from 'next/image'
import logo from './ClubLogo.png';

{
    /* For Future SMAC Hosters:
        This component is the Navigation Bar for the SMAC website displayed at the top of each page.
        To use this component, simply import it into the file you want to use it in and call it as a function.
        The component will automatically display the navigation bar at the top of the page.
        The navigation bar includes the SMAC logo and links to the Overview, Past Tests, Competition Format, and About Us pages at the time of writing.
        To add a new page to the navigation bar, simply add a new link to the page in the div with the class name 'navBarText'.
        The navigation bar is styled using the CSS file index.css. If you want to change the styling of the navigation bar, you can do so by editing the CSS file.
        In index.css, the navigation bar is styled using the class name 'navBar'. The SMAC logo on the left is styled using the class name 'navBarLogo'. 
        The links are styled using the class name 'navBarLinks'. The navigation bar is also styled using flexbox to ensure that the logo and links are displayed in the correct order.
        MAKE ABSOULUTELY SURE THAT THE LOCAL DISPLAY OF THE NAVBAR IS EXACTLY HOW YOU WANT IT BEFORE PUSHING IT TO GITHUB.
    */
}
const Navbar = () => {
    return (
        <div className='navBar'>
            <div className='navBarLogo'>
                <a href='/'>
                    <Image src={logo} alt="" width={50} height={50}/> 
                </a> 
                <a href='/' className='navBarLinks' style={{
                    marginTop: "auto",
                    marginBottom: "auto",
                    marginLeft: "3%",
                }}> SKYLINE MATHEMATICAL APPLICATIONS CONTEST </a>
            </div>
            <div className='navBarText'>
                <a href='/overview' className='navBarLinks'>OVERVIEW</a>
                <a href='/past-tests' className='navBarLinks'>PAST TESTS</a>
                <a href='/competition-format' className='navBarLinks'>RULES</a>
                <a href='/about-us' className='navBarLinks'>ABOUT US</a>
            </div>
        </div>
    );
}

export default Navbar;
