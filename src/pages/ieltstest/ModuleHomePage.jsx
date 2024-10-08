import { useParams } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import PageHeadingBriefinfo from "../../components/layout/PageHeadingBriefInfo";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Form,
  Row,
  Stack,
} from "react-bootstrap";
import BookCard from "../../components/ieltstest/BookCard";
import usePublicAxios from "../../utils/usePublicAxios";
import useAxios from "../../utils/useAxios";
import TestTypeContext from "../../context/TestTypeContext";
import TestTypeSwitch from "../../components/ieltstest/TestTypeSwitch";
import { Helmet } from "react-helmet";

const ModuleHomePage = () => {
  let api;
  if (localStorage.getItem("authTokens")) {
    api = useAxios();
  } else {
    api = usePublicAxios();
  }
  const { module_slug } = useParams();
  const [books, setBooks] = useState(null);
  const [testType, setTestType] = useContext(TestTypeContext);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (testType) {
      getBooks();
    }
  }, [module_slug, testType]);

  const getBooks = async () => {
    try {
      const response = await api.get(module_data[module_slug].api_url, {
        params: {
          // Use the `params` key to include query parameters
          testType: testType,
        },
      });
      if (response.status === 200) {
        const books = response.data.filter((book) => book["tests"].length > 0);
        setBooks(books);
      }
    } catch (error) {
      setBooks([]);
      console.error("Error fetching books:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredBooks =
    books &&
    books.filter((book) => {
      const bookWords = book.name.toLowerCase().split(/\s+/);
      const searchWords = searchQuery.toLowerCase().split(/\s+/);
      return searchWords.every((searchWord) =>
        bookWords.some((bookWord) => bookWord.includes(searchWord))
      );
    });

  if (!books) {
    return null;
  }
  return (
    <div>
      <Helmet>
        <title>{module_data[module_slug].seo_title}</title>
        <meta
          name="description"
          content={module_data[module_slug].seo_description}
        />
      </Helmet>
      <PageHeadingBriefinfo
        pagetitle={module_data[module_slug].page_title}
        briefinfo={module_data[module_slug].seo_description}
        color={`bg-${module_slug}`}
      />
      <div className="border-bottom bg-white">
        <Container>
          <Stack direction="horizontal" gap={2}>
            <div className="">
              <TestTypeSwitch />
            </div>
            <div className="ms-auto w-100">
              <div className="  d-lg-block">
                <Form className="d-flex align-items-center">
                  <span className="position-absolute ps-3 search-icon">
                    <i className="fe fe-search text-muted"></i>
                  </span>
                  <Form.Control
                    type="search"
                    placeholder="Search Books"
                    className="form-control form-control-sm ps-6 py-2"
                    onChange={handleSearchChange}
                  />
                </Form>
              </div>
            </div>
          </Stack>
        </Container>
      </div>
      <Container className="p-3 app">
        <Row>
          {filteredBooks.map((book) => (
            <Col xs={12} md={4} lg={3} key={book.slug}>
              <BookCard
                test_type={`${module_slug} test`}
                module_slug={module_slug}
                image_url={book.cover}
                book={book}
                card_title={book.name}
                card_description={book.description}
                color={module_slug}
                module_data={module_data}
              />
            </Col>
          ))}
          {books && filteredBooks.length === 0 && (
            <Col xs={12} className="text-center">
              <h1>No Books Found</h1>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
};
const module_data = {
  listening: {
    title: "Listening Test",
    page_title: "Listening Books",
    page_description:
      "Improve your English listening skills by practicing with mock tests that closely resemble the actual IELTS listening tests.",
    api_url: "/ieltstest/listening/",
    seo_title: "Free Real IELTS Listening Practice Tests | KeenIELTS",
    seo_description:
      "Boost your IELTS Listening skills with KeenIELTS! Access a variety of authentic IELTS Listening tests for free. Experience real test conditions, get instant results, and improve your score. Start your effective IELTS preparation journey today and achieve the score you need!",
  },
  reading: {
    title: "Reading Test",
    page_title: "Reading Books",
    page_description:
      "Improve your English reading skills by practicing with mock tests that closely resemble the actual IELTS reading tests.",
    api_url: "/ieltstest/reading/",
    seo_title: "Free Real IELTS Reading Practice Tests | KeenIELTS",
    seo_description:
      "Boost your IELTS Reading skills with KeenIELTS! Access a variety of authentic IELTS Reading tests for free. Experience real test conditions, get instant results, and improve your score. Start your effective IELTS preparation journey today and achieve the score you need!",
  },
  writing: {
    title: "Writing Test",
    page_title: "Writing Books",
    page_description:
      "Improve your English writing skills by practicing with mock tests that closely resemble the actual IELTS writing tests.",
    api_url: "/ieltstest/writing/",
    seo_title: "Free Real IELTS Writing Practice Tests | KeenIELTS",
    seo_description:
      "Boost your IELTS Writing skills with KeenIELTS! Access a variety of authentic IELTS Writing tests for free. Experience real test conditions, get instant results, and improve your score. Start your effective IELTS preparation journey today and achieve the score you need!",
  },
  speaking: {
    title: "Speaking Test",
    page_title: "Speaking Books",
    page_description:
      "Improve your English speaking skills by practicing with mock tests that closely resemble the actual IELTS speaking tests.",
    api_url: "/ieltstest/speaking/",
    seo_title: "Free Real IELTS Speaking Practice Tests | KeenIELTS",
    seo_description:
      "Boost your IELTS Speaking skills with KeenIELTS! Access a variety of authentic IELTS Speaking tests for free. Experience real test conditions, get instant results, and improve your score. Start your effective IELTS preparation journey today and achieve the score you need!",
  },
  fulltest: {
    title: "Full Test",
    page_title: "Full Test Books",
    page_description: "Practice full IELTS test with answers and explanations.",
    api_url: "/ieltstest/fulltest/",
    seo_title: "Free Real IELTS Complete Practice Tests | KeenIELTS",
    seo_description:
      "Boost your IELTS exam skills with KeenIELTS! Access a variety of authentic IELTS practice tests for free. Experience real test conditions, get instant results, and improve your score. Start your effective IELTS preparation journey today and achieve the score you need!",
  },
};

export default ModuleHomePage;
