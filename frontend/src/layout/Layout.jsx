import React from "react";
import styled, { ThemeProvider } from "styled-components";
import theme from "../style/theme";
import Header from "./Header.jsx";
import NavBar from "./NavBar.jsx";
import Main from "./Main.jsx";

const Root = styled.div`
  color: ${({ theme }) => theme.color.font};
  font-size: ${({ theme }) => theme.font.size.text};
  font-family: ${({ theme }) => theme.font.family};
  letter-spacing: ${({ theme }) => theme.font.leterSpacing};
`;

const Layout = ({ children }) => (
  <ThemeProvider theme={theme}>
    <Root>
      <Header />
      <Main>{children}</Main>
      <NavBar />
    </Root>
  </ThemeProvider>
);

export default Layout;
