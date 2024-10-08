import { useEffect, useContext } from "react";
import AuthContext, { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Col,
  Row,
  Card,
  Form,
  Button,
  Alert,
  Container,
} from "react-bootstrap";
import NotificationContext from "../../context/layout/NotificationContext";
import BaseForm from "../../components/layout/BaseForm";
import * as Yup from "yup";
import YupPassword from "yup-password";
import CustomAlert from "../../components/layout/CustomAlert";

YupPassword(Yup);
const LoginPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notification, setNotification } = useContext(NotificationContext);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  let { loginUser, loginError } = useContext(AuthContext);
  const form_fields = [
    {
      type: "email",
      label: "Email",
      id: "email",
      placeholder: "Enter your Email Address",
    },
    {
      type: "password",
      label: "Password",
      id: "password",
      placeholder: "*************",
    },
  ];

  const SignInSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Password is required"),
  });
  return (
    <>
      <Container className="mb-5">
        <Row className="align-items-center justify-content-center ">
          <Col lg={5} md={8} className="">
            <Card className="mt-5">
              <Card.Body className="">
                <div className="mb-4">
                  <h1 className="mb-1 fw-bold">Sign in</h1>
                  <span>Enter your email and password to sign in</span>
                </div>
                {/* Form */}
                <BaseForm
                  form_fields={form_fields}
                  validation_schema={SignInSchema}
                  on_submit={loginUser}
                  submit_label={"Sign in"}
                  nonFieldErrors={loginError}
                />
              </Card.Body>
              <Card.Footer>
                <Row>
                  <Col sm={12} md={6} className="my-2">
                    <Button
                      variant="outline-primary"
                      className="w-100"
                      as={Link}
                      to={"/register/"}
                    >
                      Create Account
                    </Button>
                  </Col>
                  <Col sm={12} md={6} className="my-2">
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

export default LoginPage;
