import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import useAxios from "../../../utils/useAxios";
import { Modal, Stack } from "react-bootstrap";
import {
  Row,
  Col,
  Container,
  Card,
  Badge,
  Button,
  Accordion,
  Table,
} from "react-bootstrap";

import ListeningSection from "../../../components/ieltstest/listening/ListeningSection";
import useScrollDirection from "../../../utils/useScrollDirection";
import CountdownTimer from "../../../components/elements/CountdownTimer";
import BookInfo from "../../../components/ieltstest/listening/BookInfo";
import CustomAudioPlayer from "../../../components/elements/audioplayer/CustomAudioPlayer";
import { API_URLS } from "../../../utils/config";
import { FiCheckCircle } from "react-icons/fi";
import { getFormData } from "../../../utils/moduleUtils";
import QuestionPallete from "../../../components/ieltstest/QuestionPallete";

const AttemptListeningModulePage = () => {
  const { module_slug, attempt_slug } = useParams();
  const api = useAxios();
  const [module, setModule] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);
  const scrollDirection = useScrollDirection();
  const formRef = useRef(null);
  const [currentFormData, setCurrentFormData] = useState({});
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [currentAudioTime, setCurrentAudioTime] = useState(null);
  const [testStarted, setTestStarted] = useState(false);

  useEffect(() => {
    getModule();
  }, [setModule]);

  useEffect(() => {
    if (currentSection !== null) {
      setCurrentAudioTime(currentSection.audio_start_time);
    }
  }, [currentSection]);

  async function getModule() {
    const response = await api.post(
      API_URLS.getListeningModule + module_slug + "/"
    );
    if (response.status === 200) {
      setModule(response.data);
      setCurrentSection(response.data.sections[0]);
    }
  }

  const [questionData, setQuestionData] = useState({
    completed_questions: 0,
    total_questions: 0,
  });
  // Log form data every 5 seconds

  function sendAttemptUpdate(attempt_type = "In Progress") {
    const data = {
      answers: currentFormData,
      attempt_type: attempt_type,
    };

    return api.post(
      "/ieltstest/update_attempt/listening/" + attempt_slug + "/",
      data
    );
  }

  function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      // Get the element's position
      const rect = element.getBoundingClientRect();

      // Scroll to the element, minus some offset for spacing
      window.scrollTo({
        top: rect.top + window.pageYOffset - 200,
        behavior: "smooth",
      });
    }
  }

  useEffect(() => {
    getFormDataLocal();
  }, [module]);

  function getFormDataLocal() {
    return getFormData(formRef, module, setCurrentFormData, setQuestionData);
  }
  const handleChange = (event) => {
    const formData = getFormDataLocal();
  };

  function endTest() {
    handleShowModal();
  }

  function handleConfirmEndTest() {
    getFormDataLocal();
    sendAttemptUpdate("Completed")
      .then((response) => {
        if (response.status === 200) {
          console.log("Attempt Updated");
          navigate(
            `/ieltstest/attempt/listening/${module_slug}/${attempt_slug}/get_result`
          );
        }
      })
      .catch((error) => {
        console.error("Error updating attempt: ", error);
      });
    handleCloseModal();
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    endTest();
  };

  useEffect(() => {
    document.title = "Listening Test | KeenIELTS";
  }, []);

  if (!module) {
    return null;
  }

  return (
    <>
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>End Test</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to end the test?</Modal.Body>
        <Modal.Footer className="p-2">
          <Button variant="outline-primary" onClick={handleCloseModal}>
            No
          </Button>
          <Button variant="primary" onClick={handleConfirmEndTest}>
            Yes, end test
          </Button>
        </Modal.Footer>
      </Modal>

      <form onSubmit={handleSubmit} ref={formRef}>
        {testStarted ? (
          <>
            <Row
              className={`${
                scrollDirection === "up" ? "sticky-top" : ""
              } mx-0 border-top border-bottom`}
            >
              <Col sm={12} className="p-0 bg-white">
                <Container>
                  <CustomAudioPlayer
                    src={module.audio}
                    start_time={currentAudioTime}
                    auto_play={true}
                  />
                </Container>
              </Col>
              <Col sm={12} className="bg-white border-top p-0">
                <Container>
                  <Stack direction="horizontal">
                    <div>
                      <span className="text-black" style={{ fontSize: "20px" }}>
                        {" "}
                        <FiCheckCircle /> {questionData.completed_questions}/
                        {questionData.total_questions}
                      </span>
                    </div>
                    <div className="ms-auto">
                      <CountdownTimer
                        initialMinutes={40}
                        initialSeconds={0}
                        handleTimesUp={handleConfirmEndTest}
                        startTimer={testStarted}
                      />
                    </div>
                  </Stack>
                </Container>
              </Col>
            </Row>

            <Container className="my-3">
              <Row>
                <Col sm={12} md={8}>
                  <Row>
                    <Col sm={12} className="my-3">
                      <Accordion>
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>
                            <span className="text-black fw-bold">
                              {module.test.book.name}
                            </span>
                          </Accordion.Header>
                          <Accordion.Body>
                            <BookInfo
                              module={module}
                              attempt_slug={attempt_slug}
                            />
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    </Col>
                    <Col sm={12}>
                      <Row>
                        {module.sections.length > 0 &&
                          module.sections.map((section) => (
                            <div key={section.id} className="my-2">
                              <ListeningSection
                                section={section}
                                setCurrentSection={setCurrentSection}
                                handleChange={handleChange}
                              />
                            </div>
                          ))}
                      </Row>
                    </Col>
                  </Row>
                </Col>

                <Col sm={12} md={4} className="">
                  <Row className="sticky-top" style={{ zIndex: 10 }}>
                    <Col sm={12} className="my-3">
                      <Accordion>
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>
                            <span className="text-black fw-bold">
                              Review Answers
                            </span>
                          </Accordion.Header>
                          <Accordion.Body className="p-0 m-0">
                            <Table striped bordered>
                              <thead>
                                <tr>
                                  <th scope="col">#</th>
                                  <th scope="col">Your Answer</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.entries(currentFormData).map(
                                  (item, index) => (
                                    <tr key={index}>
                                      <td className="fw-bold">{index + 1}</td>
                                      <td className="text-black">{item[1]}</td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </Table>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    </Col>
                    <Col sm={12} className="mt-2">
                      <Card>
                        <Card.Header>
                          <span className=" fw-bold text-black">
                            Question Pallete
                          </span>
                        </Card.Header>
                        <Card.Body>
                          <QuestionPallete
                            module={module}
                            currentFormData={currentFormData}
                          />
                        </Card.Body>

                        <Card.Footer>
                          <Button type="submit">Submit Answers</Button>
                        </Card.Footer>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Container>
          </>
        ) : (
          <Container className="my-3">
            <Row className="justify-content-center">
              <Col sm={8}>
                <Card>
                  <Card.Header className="text-black ">
                    <h3 className="m-0 fw-bold">
                      Begin Your Listening Section
                    </h3>
                  </Card.Header>
                  <Card.Body className="">
                    <p className="fw-bold" style={{ fontSize: "16px" }}>
                      Welcome to the Listening Section of your test. Here, your
                      understanding of spoken English will be assessed.
                    </p>
                    <p style={{ fontSize: "16px" }}>
                      <ul>
                        <li>
                          Please ensure your speakers or headphones are properly
                          connected and set to a comfortable volume level.
                        </li>
                        <li>
                          When you're ready, press the 'Start Test' button to
                          start the listening test. The audio will play only
                          once, so please listen carefully.
                        </li>
                        <li>
                          Remember, take notes if needed and focus on the key
                          details in the conversation or speech.
                        </li>
                        <li>
                          Feel free to begin when you're fully prepared. We wish
                          you the best in this part of your language journey!
                        </li>
                      </ul>
                    </p>
                  </Card.Body>
                  <Card.Footer>
                    <Button
                      onClick={() => {
                        setCurrentAudioTime(0.0);
                        setTestStarted(true);
                      }}
                    >
                      Start Test
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            </Row>
          </Container>
        )}
      </form>
    </>
  );
};

export default AttemptListeningModulePage;
