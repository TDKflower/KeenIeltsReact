import React, { useEffect, useState } from "react";
import useAxios from "../../../utils/useAxios";
import { API_URLS } from "../../../utils/urls";
import { useParams } from "react-router";
import { Accordion, Card, Col, Container, Row, Table } from "react-bootstrap";
import PageHeadingBriefinfo from "../../../components/layout/PageHeadingBriefInfo";
import ListeningSection from "../../../components/ieltstest/listening/ListeningSection";
import CustomAudioPlayer from "../../../components/elements/audioplayer/CustomAudioPlayer";
import useAxiosWithoutLoader from "../../../utils/useAxiosWithoutLoader";
import ScoreSection from "../../../components/ieltstest/ScoreSection";
import ReviewAnswers from "../../../components/ieltstest/ReviewAnswers";

const ListeningResultPage = () => {
  const api = useAxios();
  const api1 = useAxiosWithoutLoader();
  const { module_slug, attempt_slug } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [module, setModule] = useState(null);
  const [currentAudioTime, setCurrentAudioTime] = useState(null);

  async function getAttempt() {
    const response = await api.post(
      API_URLS.getListeningAttempt + attempt_slug + "/"
    );
    if (response.status === 200) {
      setAttempt(response.data);
    } else {
      console.error("Unable to fetch attempt at ListeningResult.jsx");
    }
  }

  async function getModule() {
    const response = await api1.post(
      API_URLS.getListeningModule + module_slug + "/"
    );
    if (response.status === 200) {
      setModule(response.data);
    }
  }

  useEffect(() => {
    getAttempt();
  }, []);

  useEffect(() => {
    getModule();
  }, []);

  if (!attempt || !attempt.evaluation) {
    return null;
  }

  if (!module) {
    return null;
  }

  function handleChangeAudioTime(section) {
    setCurrentAudioTime(section.audio_start_time);
  }

  return (
    <>
      <div className="border-bottom">
        <ScoreSection attempt={attempt} module_name={"Listening"} />
      </div>

      <div className="my-4">
        <Container>
          <Row>
            <Col sm={12} md={6} className="mb-3">
              <Row>
                <Col sm={12} className="mb-3">
                  <Card>
                    <Card.Body className="m-0 p-1">
                      <CustomAudioPlayer
                        src={module.audio}
                        start_time={currentAudioTime}
                      />
                    </Card.Body>
                  </Card>
                </Col>
                {module.sections.length > 0 &&
                  module.sections.map((section) => (
                    <div key={section.id} className="my-2">
                      <ListeningSection
                        section={section}
                        user_answers={attempt.evaluation.all_questions}
                        setCurrentSection={handleChangeAudioTime}
                      />
                    </div>
                  ))}
              </Row>
            </Col>
            <Col sm={12} md={6}>
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <span className="text-black fw-bold">Review Answers</span>
                  </Accordion.Header>
                  <Accordion.Body className="p-0 m-0">
                    <ReviewAnswers attempt={attempt} />
                  </Accordion.Body>
                </Accordion.Item>
                {Object.entries(attempt.evaluation.all_sections).map(
                  (section, index) => (
                    <Accordion.Item key={section[0]} eventKey={index + 1}>
                      <Accordion.Header>
                        <span className="text-black fw-bold">
                          Section {index + 1} • {section[1]["correct"]}/
                          {section[1]["correct"] + section[1]["incorrect"]}
                        </span>
                      </Accordion.Header>
                      <Accordion.Body className="p-0 m-0">
                        <Table bordered className="table-sm">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Your Answer</th>
                              <th scope="col">Correct Answer</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(section[1]).map((item, index) => {
                              if (item[0].split("-")[0] === "que") {
                                return (
                                  <tr
                                    key={index}
                                    className={
                                      item[1]["is_user_answer_correct"] === true
                                        ? "table-success"
                                        : "table-danger"
                                    }
                                  >
                                    <td className="fw-bold">
                                      {item[0].split("-")[1]}
                                    </td>
                                    <td className="text-black">
                                      {item[1]["user_answer"]}
                                    </td>
                                    <td className="text-black">
                                      {item[1]["correct_answer"]}
                                    </td>
                                  </tr>
                                );
                              } else {
                                return null; // return null if you don't want to render anything
                              }
                            })}
                          </tbody>
                        </Table>
                      </Accordion.Body>
                    </Accordion.Item>
                  )
                )}
              </Accordion>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ListeningResultPage;
