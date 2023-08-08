import React from "react";
import { Badge } from "react-bootstrap";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

const QuestionBadge = ({ children, user_answers, queName }) => {
  return (
    <Badge
      className="fw-bold"
      style={{ fontSize: "16px" }}
      bg={
        user_answers &&
        user_answers["que-" + queName[1]]["is_user_answer_correct"]
          ? "success"
          : user_answers
          ? "danger"
          : "listening"
      }
    >
      {queName[1]}
      {user_answers &&
        (user_answers["que-" + queName[1]]["is_user_answer_correct"] ? (
          <FiCheckCircle size={18} style={{ marginLeft: "5px" }} />
        ) : (
          <FiXCircle size={18} style={{ marginLeft: "5px" }} />
        ))}
    </Badge>
  );
};

export default QuestionBadge;
