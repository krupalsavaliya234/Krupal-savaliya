import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { useState } from "react";
import validator from "email-validator";
import Button from "./Button";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

const Form = () => {
  const [ref, inView] = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  // State for handling form submission statuses and errors
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [subjectError, setSubjectError] = useState(false);
  const [messageError, setMessageError] = useState(false);

  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    access_key: process.env.REACT_APP_ACCESS_KEY,
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle input focus to reset error state
  const handleInputFocus = (errorStateSetter) => {
    errorStateSetter(false);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate fields
    setNameError(formData.name === "");
    setEmailError(formData.email === "" || !validator.validate(formData.email));
    setSubjectError(formData.subject === "");
    setMessageError(formData.message === "");

    // Handle invalid form
    if (nameError || emailError || subjectError || messageError) {
      setSending(false);
      setFailed(true);
      toast.error('Please fill in all required fields correctly.');
      return;
    }

    // Form submission in progress
    setSending(true);
    toast.loading('Submitting your message...', {
      duration: 4000,
      position: 'top-center',
      icon: '👏',
      iconTheme: { primary: '#000', secondary: '#fff' },
      ariaProps: { role: 'status', 'aria-live': 'polite' },
    });

    const data = JSON.stringify(formData);
    axios.post('https://myportfolio-backend-phzl.onrender.com/send-mail', { data })
      .then((response) => {
        if (response.status === 200) {
          setSending(false);
          setSuccess(true);
          toast.dismiss(); // Dismiss the loading toast
          toast.success('Thank you for connecting! Please check your email.');
        }
      })
      .catch((error) => {
        toast.dismiss(); // Dismiss the loading toast
        toast.error('Something went wrong. Please try again later.');
      });
  };

  const handleButtonText = () => {
    if (sending) return "Please wait...";
    if (success) return "Message Sent";
    if (failed || nameError || emailError || subjectError || messageError) return "Try again";
    return "Send Message";
  };

  return (
    <motion.form
      action=""
      ref={ref}
      className="contactForm"
      initial={{ y: "10vw", opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : { y: "10vw", opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      onSubmit={handleSubmit}
    >
      <h4 className="contentTitle">Send a Message</h4>
      {/* Input fields */}
      <div className="col-12 col-md-6 formGroup" style={{ display: "inline-block" }}>
        <input
          type="text"
          className={`formControl ${nameError ? "formError" : ""}`}
          onFocus={() => handleInputFocus(setNameError)}
          onClick={() => handleInputFocus(setNameError)}
          onChange={handleChange}
          value={formData.name}
          id="contactName"
          name="name"
          placeholder={nameError ? "Please enter your name" : "Name"}
        />
      </div>
      <div className="col-12 col-md-6 formGroup" style={{ display: "inline-block" }}>
        <input
          type="text"
          className={`formControl ${emailError ? "formError" : ""}`}
          onFocus={() => handleInputFocus(setEmailError)}
          onChange={handleChange}
          value={formData.email}
          id="contactEmail"
          name="email"
          placeholder={emailError ? "Please enter a valid email" : "Email"}
          autoComplete="email"
        />
      </div>
      <div className="col-12 formGroup">
        <input
          type="text"
          className={`formControl ${subjectError ? "formError" : ""}`}
          onFocus={() => handleInputFocus(setSubjectError)}
          onChange={handleChange}
          value={formData.subject}
          id="contactSubject"
          name="subject"
          placeholder={subjectError ? "Please enter a subject" : "Subject"}
          autoComplete="off"
        />
      </div>
      <div className="col-12 formGroup">
        <textarea
          className={`formControl ${messageError ? "formError" : ""}`}
          onFocus={() => handleInputFocus(setMessageError)}
          onChange={handleChange}
          value={formData.message}
          name="message"
          id="contactMessage"
          rows="5"
          placeholder={messageError ? "Please enter a message" : "Message"}
          autoComplete="off"
        ></textarea>
      </div>
      {/* Form submission button */}
      <motion.div className="col-12 formGroup formSubmit">
        <Button
          name={handleButtonText()}
          disabled={nameError || emailError || subjectError || messageError || sending || success}
        />
        <Toaster />
      </motion.div>
    </motion.form>
  );
};

export default Form;
