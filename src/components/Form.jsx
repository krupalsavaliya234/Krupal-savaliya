import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { useState } from "react";
import validator from "email-validator";
import Button from "./Button";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { RotatingLines } from 'react-loader-spinner'; // Import the loader

const Form = () => {
  const [ref, inView] = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [subjectError, setSubjectError] = useState(false);
  const [messageError, setMessageError] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    access_key: process.env.REACT_APP_ACCESS_KEY,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputFocus = (errorStateSetter) => {
    errorStateSetter(false);
  };

  // Combined validation logic
  const validateForm = () => {
    const isNameError = formData.name === "";
    const isEmailError = formData.email === "" || !validator.validate(formData.email);
    const isSubjectError = formData.subject === "";
    const isMessageError = formData.message === "";

    setNameError(isNameError);
    setEmailError(isEmailError);
    setSubjectError(isSubjectError);
    setMessageError(isMessageError);

    return !(isNameError || isEmailError || isSubjectError || isMessageError);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setFailed(true);
      toast.error('Please fill in all required fields correctly.');
      return;
    }

  setSending(true);
  toast.loading('Submitting your message...', {
    duration: 4000,
    position: 'top-center',
    icon: '⏳',
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
      setSending(false);
      toast.dismiss(); // Dismiss the loading toast
      toast.error('Something went wrong. Please try again later.');
    });
  
  };
  
  const handleButtonText = () => {
    if (sending) {
      return <RotatingLines strokeColor="black" strokeWidth="6" animationDuration="0.75" width="24" visible={true} />;
    } else if (success) {
      return "Message Sent";
    } else if (failed || nameError || messageError || emailError || subjectError) {
      return "Try Again";
    } else {
      return "Send Message";
    }
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
          disabled={sending}
        />
        <Toaster />
      </motion.div>
    </motion.form>
  );
};

export default Form;
