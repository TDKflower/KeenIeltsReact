import React, { useState } from "react";
import { Col, Card, Stack, Button } from "react-bootstrap";

import { FiPlayCircle } from "react-icons/fi";
import ParseQuestions from "../ParseQuestions";

const ListeningSection = ({
  section,
  setCurrentSection = null,
  handleChange = null,
  user_answers = null,
}) => {
  function handleSetCurrentSection() {
    setCurrentSection(section);
  }
  const [showNotes, setShowNotes] = useState(false);

  function handleShowNotes() {
    setShowNotes(!showNotes);
  }

  return (
    <Col className="" sm={12}>
      <Card>
        <Card.Header>
          <Stack direction="horizontal">
            <div>
              <span className="text-uppercase fw-bold text-black">
                {section.section}
              </span>
              <span
                className="text-black mx-2"
                onClick={handleSetCurrentSection}
              >
                <FiPlayCircle fontSize={20} />
              </span>
            </div>
            <div className="ms-auto">
              <Button
                className="btn btn-sm btn-primary"
                onClick={handleShowNotes}
              >
                Notes
              </Button>
            </div>
          </Stack>
        </Card.Header>
        <Card.Body>
          <span>
            {showNotes && (
              <textarea
                className="form-control mb-2"
                placeholder="Write your notes here."
                rows={5}
              />
            )}
            <span className="text-black">
              <ParseQuestions
                section={section}
                user_answers={user_answers}
                handleChange={handleChange}
              />
            </span>
          </span>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ListeningSection;
