import "./index.css";

import { AuthResult } from "src/auth-result";
import Layout from "src/layout";
import { ThemeProvider } from "@material-tailwind/react";

function App() {
  return (
    <ThemeProvider value={{}}>
      <Layout>
        <AuthResult />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
