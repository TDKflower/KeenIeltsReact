import React from "react";
import PageHeadingBriefinfo from "../../components/layout/PageHeadingBriefInfo";
import { Container, Row, Col, Card } from "react-bootstrap";
import * as Yup from "yup";
import BaseForm from "../../components/layout/BaseForm";
import useAxios from "../../utils/useAxios";
import { DJANGO_BASE_URL } from "../../utils/config";
import AccountSettingForm from "../../components/layout/AccountSettingForm";

const AccountPage = () => {
  return (
    <>
      <PageHeadingBriefinfo
        pagetitle={"Account Settings"}
        briefinfo={
          "Manage your personal information and other account settings."
        }
      />
      <Container>
        <Row className="justify-content-center">
          <Col xl={8} lg={10} md={12} className="mt-3">
            <AccountSettingForm />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AccountPage;
