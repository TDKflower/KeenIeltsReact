import React from "react";
import { Card, Col, Row, Stack } from "react-bootstrap";
import StartPracticeTestCard from "./StartPracticeTestCard";
import Logo from "../../assets/images/brand/logo/logo-small.svg";
import AccountSettingForm from "../auth/AccountSettingForm";
import YourPerformanceCard from "../layout/student/YourPerformanceCard";
import FifteenDaysPerformanceChart from "../layout/student/FifteenDaysPerformanceChart";
import YourRecentTestsCard from "../layout/student/YourRecentTestsCard";
import DashboardCommunityChat from "../DashboardCommunityChat";
import SkeletonLoader from "../elements/skeleton/SkeletonLoader";

const DashboardCards = ({ overallPerformance, overallPerformanceFeedback }) => {
  return (
    <Row className="mt-0 pt-0">
      <Col sm={12} lg={6} className="">
        <StartPracticeTestCard />

        <YourPerformanceCard
          overallPerformance={overallPerformance}
          overallPerformanceFeedback={overallPerformanceFeedback}
        />

        {(overallPerformanceFeedback == null ||
          overallPerformanceFeedback["overall_feedback"] == null) && (
          <div className="mb-3">
            <SkeletonLoader title={"Performance Feedback"} />
          </div>
        )}
      </Col>
      <Col sm={12} lg={6}>
        <Card className="mb-2 ">
          <Card.Header>
            <h3 className="mt-2 fw-bold">15 Days Performance Chart</h3>
          </Card.Header>
          <Card.Body>
            <div
              className="mb-0"
              style={{
                width: "100%",
                height: "150px",
              }}
            >
              <FifteenDaysPerformanceChart
                overallPerformance={overallPerformance}
              />
            </div>
          </Card.Body>
        </Card>

        <Card className="mt-3 mb-2">
          <Card.Header>
            <h3 className="mt-2 fw-bold">Your Recent Attempts</h3>
          </Card.Header>
          <Card.Body>
            <YourRecentTestsCard tests={overallPerformance.recent_tests} />
          </Card.Body>
        </Card>

        <div className="my-3">
          <DashboardCommunityChat />
        </div>
      </Col>
    </Row>
  );
};

export default DashboardCards;
