import * as React from "react";
import "../index.css";
import {
  Template,
  GetPath,
  GetHeadConfig,
  HeadConfig,
  TemplateRenderProps,
} from "@yext/pages";
import Main from "../layouts/Main";
import Form from "../components/FleetForm";
import FleetIcon from "../icons/FleetIcon";
import FleetDeploy from "../components/FleetDeploy";
import useHash from "../hooks/useHash";
import { useEffect, useState } from "react";
import TransitionContainer from "../components/TransitionContainer";

export const getPath: GetPath<TemplateRenderProps> = () => {
  return `index.html`;
};

export const getHeadConfig: GetHeadConfig<
  TemplateRenderProps
> = (): HeadConfig => {
  return {
    title: "Yext Fleet Manager",
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
  };
};

const FleetManager: Template<TemplateRenderProps> = () => {
  const hash = useHash();

  const [showDeploy, setShowDeploy] = useState(false);

  useEffect(() => {
    if (hash === "#deploying" && !showDeploy) {
      setShowDeploy(true);
      // remove hash from url
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [hash]);

  return (
    <Main>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <FleetIcon />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Yext Fleet Manager
        </h2>
      </div>
      {!showDeploy && <Form />}
      <TransitionContainer show={showDeploy}>
        <FleetDeploy />
      </TransitionContainer>
    </Main>
  );
};

export default FleetManager;
