import { BrowserRouter } from "react-router-dom";
import Router from "./routes/index";
import { FloatButton } from "antd";
import { IoArrowUpOutline } from "react-icons/io5";
import { ConfigProvider } from "antd";


function App() {
  return (
    <ConfigProvider>
        <BrowserRouter>
          <Router />
          <FloatButton.BackTop
            icon={<IoArrowUpOutline color="#1bbdbf" />}
            style={{
              bottom: 24,
              right: "50%",
              transform: "translateX(50%)",
              backgroundColor: "#ecfffb",
            }}
          />
        </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;