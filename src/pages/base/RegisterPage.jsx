import { useEffect, useContext, useState } from "react";
import AuthContext, { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Col, Row, Card, Container, Button } from "react-bootstrap";
import BaseForm from "../../components/layout/BaseForm";
import * as Yup from "yup";
import YupPassword from "yup-password";

YupPassword(Yup);

const RegisterPage = () => {
  const navigate = useNavigate();
  let { registerUser, registrationError, user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  const form_fields = [
    {
      type: "text",
      label: "First Name",
      id: "first_name",
      invalid_feedback: "e.g. Rahul",
      placeholder: "Enter your First Name",
    },
    {
      type: "text",
      label: "Last Name",
      id: "last_name",
      invalid_feedback: "e.g. Sharma",
      placeholder: "Enter your Last Name",
    },
    {
      type: "email",
      label: "Email",
      id: "email",
      invalid_feedback: "e.g. yourname@gmail.com",
      placeholder: "Enter your Email Address",
    },
    {
      type: "password",
      label: "Password",
      id: "password1",
      invalid_feedback: "Password should be strong",
      placeholder: "*************",
    },
    {
      type: "password",
      label: "Confirm Password",
      id: "password2",
      invalid_feedback: "Confirm password should  be same as Password",
      placeholder: "*************",
    },
  ];

  const SignupSchema = Yup.object().shape({
    first_name: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    last_name: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password1: Yup.string()
      .required("Password is required")
      .min(
        8,
        "password must contain 8 or more characters with at least one of each: uppercase, lowercase, number and special"
      )
      .minLowercase(1, "password must contain at least 1 lower case letter")
      .minUppercase(1, "password must contain at least 1 upper case letter")
      .minNumbers(1, "password must contain at least 1 number")
      .minSymbols(1, "password must contain at least 1 special character"),
    password2: Yup.string().oneOf(
      [Yup.ref("password1"), null],
      "Passwords must match"
    ),
  });

  return (
    <>
      <Container>
        <Row className="align-items-center justify-content-center ">
          <Col lg={5} md={8} className="">
            <Card className="mt-5">
              <Card.Body className="">
                <div className="mb-4">
                  <h1 className="mb-1 fw-bold">Sign up</h1>
                  <span>
                    Enter your personal information to create your account
                  </span>
                </div>

                <BaseForm
                  form_fields={form_fields}
                  submit_label={"Sign up"}
                  on_submit={registerUser}
                  serverErrors={registrationError}
                  validation_schema={SignupSchema}
                  successMessage="Registration Successful"
                />
              </Card.Body>
              <Card.Footer>
                <Row>
                  <Col>
                    <Button
                      variant="outline-primary"
                      className="w-100"
                      as={Link}
                      to={"/login/"}
                    >
                      Sign In
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      variant="outline-primary"
                      className="w-100"
                      as={Link}
                      to={"/reset/"}
                    >
                      Forgot Password
                    </Button>
                  </Col>
                </Row>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default RegisterPage;
