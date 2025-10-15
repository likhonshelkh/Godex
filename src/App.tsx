import type { ReactElement } from "react";
import {
  LandingLayout,
  Hero,
  ValuePillars,
  Workflow,
  Showcase,
  ChatShell,
  Testimonials,
  Footer,
} from "./components/sections";

function App(): ReactElement {
  return (
    <LandingLayout>
      <Hero />
      <div id="features">
        <ValuePillars />
      </div>
      <div id="workflow">
        <Workflow />
      </div>
      <div id="showcase">
        <Showcase />
      </div>
      <ChatShell />
      <div id="stories">
        <Testimonials />
      </div>
      <div id="cta">
        <Footer />
      </div>
    </LandingLayout>
  );
}

export default App;
