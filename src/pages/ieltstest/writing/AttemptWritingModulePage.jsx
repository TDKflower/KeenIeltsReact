import React, { useEffect, useRef, useState } from "react";
import useAxios from "../../../utils/useAxios";
import { API_URLS } from "../../../utils/config";
import { useNavigate, useParams } from "react-router-dom";
import { MiniNavBar } from "../../../components/ieltstest/MiniNavBar";
import { Modal } from "react-bootstrap";
import BookInfo from "../../../components/ieltstest/listening/BookInfo";
import "../../../components/ieltstest/writing/WritingModule.css";

import {
  Stack,
  Navbar,
  Card,
  Container,
  Row,
  Col,
  Accordion,
  Table,
  Badge,
  Button,
} from "react-bootstrap";
import { FiArrowLeft, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import WritingSection from "../../../components/ieltstest/writing/WritingSection";
import WritingTask from "../../../components/ieltstest/writing/WritingTask";
import WritingFooter from "../../../components/ieltstest/writing/WritingFooter";
import CustomSplitPane from "../../../components/layout/CustomSplitPane";

const AttemptWritingModulePage = () => {
  // Variables:
  const api = useAxios();
  const { module_slug, attempt_slug } = useParams();
  const [module, setModule] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);
  const [showTestInfoModal, setShowTestInfoModal] = useState(false);
  const handleCloseTestInfoModal = () => setShowTestInfoModal(false);
  const [deviceType, setDeviceType] = useState("desktop");
  const [userAnswerBySection, setUserAnswerBySection] = useState({});
  const formRef = useRef(null);
  const [currentFormData, setCurrentFormData] = useState({});
  const isFirstSection = currentSection
    ? currentSection.id === module.sections[0].id
    : false;
  const isLastSection = currentSection
    ? currentSection.id === module.sections[module.sections.length - 1].id
    : false;
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const handleShowSubmitModal = () => setShowSubmitModal(true);
  const handleClosSubmiteModal = () => setShowSubmitModal(false);
  const navigate = useNavigate();

  // Functions
  async function getModule() {
    const response = await api.post(
      API_URLS.getWritingModule + module_slug + "/"
    );
    if (response.status === 200) {
      setModule(response.data);
      setCurrentSection(response.data.sections[0]);
    }
  }

  function updateCurrentSection(id) {
    const newSection = module.sections.find((section) => section.id === id);
    setCurrentSection(newSection);
  }

  function sendAttemptUpdate(attempt_type = "In Progress") {
    const data = {
      answers: userAnswerBySection,
      attempt_type: attempt_type,
    };

    return api.post(
      "/ieltstest/update_attempt/writing/" + attempt_slug + "/",
      data
    );
  }
  
  function handleConfirmEndTest() {
    getFormDataLocal();
    sendAttemptUpdate("Completed")
      .then((response) => {
        if (response.status === 200) {
          console.log("Attempt Updated");
          navigate(
            `/ieltstest/attempt/writing/${module_slug}/${attempt_slug}/get_result`
          );
        }
      })
      .catch((error) => {
        console.error("Error updating attempt: ", error);
      });
    handleClosSubmiteModal();
  }

  function handlePreviousSectionButton() {
    let current_section_id = currentSection.id;
    let new_section_id = current_section_id - 1;
    const newSection = module.sections.find(
      (section) => section.id === new_section_id
    );
    if (newSection) {
      setCurrentSection(newSection);
    } else {
      const lastElement = module.sections[module.sections.length - 1];
      setCurrentSection(lastElement);
    }
  }

  function handleNextSectionButton() {
    let current_section_id = currentSection.id;
    let new_section_id = current_section_id + 1;
    const newSection = module.sections.find(
      (section) => section.id === new_section_id
    );
    if (newSection) {
      setCurrentSection(newSection);
    } else {
      const lastElement = module.sections[0];
      setCurrentSection(lastElement);
    }
  }

  // CSS

  const paneStyle = {
    overflow: "auto",
  };

  const containerStyle = {
    paddingTop: "50px",
    paddingBottom: "50px",
    height: "calc(100vh - 50px)", // Assuming 50px for NavBar and 50px for Footer
    overflow: "auto", // Prevent scrollbars on the main layout
  };

  //useEffects

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setDeviceType("mobile");
      } else {
        setDeviceType("desktop");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleChange = (event) => {
    const formData = getFormDataLocal();
  };

  function getFormDataLocal() {
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      let data = {};
      for (let [key, value] of formData.entries()) {
        data[key] = value; // Construct the data object
      }
      // Use currentSection.id to store the data for the current section
      setUserAnswerBySection({
        ...userAnswerBySection,
        [currentSection.id]: data[`task-${currentSection.id}`],
      });
      setCurrentFormData(data);
    }
  }

  useEffect(() => {
    if (currentSection) {
      window.scrollTo(0, 0);
    }
  }, [currentSection]);

  useEffect(() => {
    getFormDataLocal();
    if (currentSection) {
    }
  }, [currentSection]);

  useEffect(() => {
    getModule();
  }, []);

  useEffect(() => {
    document.title = "Writing Test | KeenIELTS";
  }, []);

  if (!module) {
    return null;
  }

  return (
    <>
      <MiniNavBar
        module={module}
        currentSection={currentSection}
        updateCurrentSection={updateCurrentSection}
        setShowTestInfoModal={setShowTestInfoModal}
      />
      <CustomSplitPane
        deviceType={deviceType}
        currentSection={currentSection}
        left={
          <WritingTask
            currentSection={currentSection}
            key={currentSection.id}
          />
        }
        right={
          <WritingSection
            currentSection={currentSection}
            key={currentSection.id}
            deviceType={deviceType}
            formRef={formRef}
            handleChange={handleChange}
            currentFormData={currentFormData}
            userAnswerBySection={userAnswerBySection} // Pass this prop
          />
        }
      />

      <WritingFooter
        deviceType={deviceType}
        handleConfirmEndTest={handleConfirmEndTest}
        isFirstSection={isFirstSection}
        isLastSection={isLastSection}
        handleNextSectionButton={handleNextSectionButton}
        handlePreviousSectionButton={handlePreviousSectionButton}
        setShowSubmitModal={setShowSubmitModal}
      />

      <Modal show={showSubmitModal} onHide={handleClosSubmiteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>End Test</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to end the test?</Modal.Body>
        <Modal.Footer className="p-2">
          <Button variant="outline-primary" onClick={handleClosSubmiteModal}>
            No
          </Button>
          <Button variant="primary" onClick={handleConfirmEndTest}>
            Yes, end test
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showTestInfoModal}
        onHide={handleCloseTestInfoModal}
        centered
        className="p-0"
      >
        <Modal.Header closeButton>
          <Modal.Title>Test Info</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <BookInfo module={module} attempt_slug={attempt_slug} />
        </Modal.Body>
        <div className="modal-footer py-2">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={handleCloseTestInfoModal}
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
};

export default AttemptWritingModulePage;
