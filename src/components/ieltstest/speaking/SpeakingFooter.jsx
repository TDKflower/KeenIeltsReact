import React, { useState, useEffect } from "react";
import CountdownTimer from "../../elements/CountdownTimer";
import {
  Row,
  Col,
  Container,
  Button,
  Stack,
  Badge,
  Card,
} from "react-bootstrap";
import {
  MdKeyboardDoubleArrowRight,
  MdMic,
  MdPause,
  MdPauseCircleFilled,
} from "react-icons/md";
import Waves from "./Waves";

const SpeakingFooter = ({
  handleConfirmEndTest,
  deviceType,
  isSpeaking,
  setIsSpeaking,
  currentQuestion,
  setCurrentQuestion,
  currentSection,
  setCurrentSection,
  isEndTest,
  module,
  userAllResponse,
  setUserAllResponse,
}) => {
  const [testStarted, setIsTestStarted] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);

      setIntervalId(interval);
    } else if (!isRunning && intervalId) {
      clearInterval(intervalId);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (mediaRecorder) {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        const checkAudio = () => {
          analyser.getByteFrequencyData(dataArray);
          const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

          if (volume > 15) {
            setIsSpeaking(true);
          } else {
            setIsSpeaking(false);
          }
          requestAnimationFrame(checkAudio);
        };
        checkAudio();
      });
    }
  }, [mediaRecorder]);

  function startTest() {
    setIsRunning(true);
    startRecording();
  }

  const startRecording = () => {
    setIsTestStarted(true); // Set testStarted to true
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const newMediaRecorder = new MediaRecorder(stream);
        setMediaRecorder(newMediaRecorder);

        newMediaRecorder.ondataavailable = (event) => {
          const audioBlob = new Blob([event.data], { type: "audio/wav" });
          setAudioURL(URL.createObjectURL(audioBlob));
        };

        newMediaRecorder.start();
      })
      .catch((err) => {
        console.error("Could not get media:", err);
      });
  };

  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      setIsRunning(false);
      mediaRecorder.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "paused") {
      setIsRunning(true);
      mediaRecorder.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    console.log("Stop Recording");
  };

  // function updateAudioTimeStampForQuestion -> Save audio timestamp for each question.
  // function handleNextSection -> Save audio for entire section.

  function handleNextQuestion() {
    // Find the index of the current question in the current section
    console.log(elapsedTime);
    stopRecording();

    const currentQuestionIndex = currentSection.questions.findIndex(
      (q) => q === currentQuestion
    );

    // If the current question is found and not the last question in the section
    if (
      currentQuestionIndex !== -1 &&
      currentQuestionIndex < currentSection.questions.length - 1
    ) {
      const nextQuestion = currentSection.questions[currentQuestionIndex + 1];
      setCurrentQuestion(nextQuestion);
    }
    // If it's the last question in the current section
    else if (currentQuestionIndex === currentSection.questions.length - 1) {
      // Find the index of the current section in the module
      const currentSectionIndex = module.sections.findIndex(
        (sec) => sec === currentSection
      );

      // If the current section is found and not the last section in the module
      if (
        currentSectionIndex !== -1 &&
        currentSectionIndex < module.sections.length - 1
      ) {
        const nextSection = module.sections[currentSectionIndex + 1];
        setCurrentSection(nextSection);

        // Optionally, set the question to the first one in the new section
        setCurrentQuestion(nextSection.questions[0]);
      }
      // If it's the last section
      else if (currentSectionIndex === module.sections.length - 1) {
        // Set isEndTest to true
        isEndTest(true);
      }
    } else {
      console.log("Question not found or already at the end.");
    }
  }

  function secondsToMinutes(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }

  return (
    <div
      className=" border-top bg-white"
      style={{ position: "fixed", bottom: 0, width: "100%" }}
    >
      <Container className="">
        <Row className="my-2 text-black justify-content-center ">
          <Col sm={8} className="border-bottom mb-2">
            <div className="mt-2 mb-3 text-center">
              {isPaused ? (
                <div className="text-danger">On pause</div>
              ) : (
                <Badge bg="dark" className="" style={{ fontSize: "20px" }}>
                  <Stack direction="horizontal" className="">
                    <div className="mx-2">
                      <Waves isSpeaking={isSpeaking} background="dark" />
                    </div>
                    <div className="mx-2">{secondsToMinutes(elapsedTime)}</div>
                  </Stack>
                </Badge>
              )}
            </div>
          </Col>
          <Col sm={8}>
            <Row className="">
              <Col className="col-6 mt-1">
                {!testStarted ? (
                  <Button
                    onClick={startTest}
                    className={`w-100 ${deviceType === "desktop" && "btn-lg"}`}
                  >
                    <MdMic size={23} /> Start
                  </Button>
                ) : isPaused ? (
                  <Button
                    onClick={resumeRecording}
                    className={`w-100 ${deviceType === "desktop" && "btn-lg"}`}
                  >
                    <MdMic size={23} /> Continue
                  </Button>
                ) : (
                  <Button
                    variant=""
                    onClick={pauseRecording}
                    className={`w-100 ${
                      deviceType === "desktop" && "btn-lg"
                    } btn-outline-primary`}
                  >
                    <MdPause size={23} /> Pause
                  </Button>
                )}
              </Col>

              <Col className="col-6 mt-1">
                <Button
                  onClick={handleNextQuestion}
                  className={`w-100 ${deviceType === "desktop" && "btn-lg"}`}
                  disabled={!testStarted && "disabled"}
                >
                  Next <MdKeyboardDoubleArrowRight size={23} />
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SpeakingFooter;
