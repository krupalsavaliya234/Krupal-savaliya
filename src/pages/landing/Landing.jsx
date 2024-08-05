import Hero from "../../components/Hero";
import Draw from "../../components/Draw";
import Portfolio from "../portfolio/Portfolio";
import Contact from "../contact/Contact";

/**
 * Represents the Landing page component.
 * Displays the main landing page content including Hero, Drawing, and About sections.
 *
 * @component
 * @param {string} name - The name of the user displayed in the Hero section.
 */

const Landing = ({ name }) => {
  const personalDetails = {
    name: "KRUPAL SAVALIYA",
    location: "Gujarat , India ",
    email: "krupalsavaliya0@gmail.com",
    brand:
      "My unique blend of technical expertise, creative thinking, and background in psychology allows me to approach each project with a deep understanding of the end user's perspective, resulting in highly effective user-centred digital products.",
  };
  // Inline styles for the main landing container
  const styles = {
    landing: {
      height: "calc(100% - 93px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    
  };

  return (
    <>
      {/* Main Landing Page */}
      <main className="landing container" style={styles.landing}>
        {/* Display the drawing component */}
        {/* <Draw /> */}

        {/* Display the hero component */}
        <Hero name={name} />
      </main>

      {/* Display the about section */}
      {/* <About /> */}
      <Portfolio show={true}></Portfolio>
      <Contact    name={personalDetails.name}
                  location={personalDetails.location}
                  email={personalDetails.email}/>
    </>
  );
};

export default Landing;
